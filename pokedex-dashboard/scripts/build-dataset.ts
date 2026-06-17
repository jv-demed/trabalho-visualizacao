/**
 * Gera o dataset estático do dashboard a partir da PokeAPI (endpoint GraphQL).
 *
 * Saídas (em public/data):
 *   - pokemon.json    : 1 registro por Pokémon (forma padrão) já normalizado
 *   - type-chart.json : matriz 18x18 de efetividade de tipos
 *
 * Rodar com:  npm run build:data
 *
 * Optamos por pré-processar os dados uma única vez (e versioná-los) em vez de
 * bater na API ao vivo: o dashboard fica instantâneo, funciona offline na
 * apresentação e não depende de rate limit / CORS.
 */
import { writeFile, mkdir } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ENDPOINT = "https://graphql.pokeapi.co/v1beta2";
const OUT_DIR = join(dirname(fileURLToPath(import.meta.url)), "..", "public", "data");

// stat_id da PokeAPI -> chave amigável
const STAT_KEY: Record<number, keyof StatBlock> = {
  1: "hp",
  2: "attack",
  3: "defense",
  4: "sp_atk",
  5: "sp_def",
  6: "speed",
};

interface StatBlock {
  hp: number;
  attack: number;
  defense: number;
  sp_atk: number;
  sp_def: number;
  speed: number;
}

async function gql<T>(query: string, variables: Record<string, unknown> = {}): Promise<T> {
  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, variables }),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`);
  const json = (await res.json()) as { data?: T; errors?: unknown };
  if (json.errors) throw new Error(`GraphQL: ${JSON.stringify(json.errors)}`);
  return json.data as T;
}

// ---------- Tipos e matriz de efetividade ----------
async function buildTypeChart() {
  type Resp = {
    type: { id: number; name: string }[];
    typeefficacy: { damage_type_id: number; target_type_id: number; damage_factor: number }[];
  };
  const data = await gql<Resp>(`query {
    type(where: { id: { _lte: 18 } }, order_by: { id: asc }) { id name }
    typeefficacy { damage_type_id target_type_id damage_factor }
  }`);

  const types = data.type;
  const idToIndex = new Map(types.map((t, i) => [t.id, i]));

  // matriz[atacante][defensor] = multiplicador (default 1x)
  const matrix: number[][] = types.map(() => types.map(() => 1));
  for (const e of data.typeefficacy) {
    const a = idToIndex.get(e.damage_type_id);
    const d = idToIndex.get(e.target_type_id);
    if (a === undefined || d === undefined) continue;
    matrix[a][d] = e.damage_factor / 100; // 100 -> 1, 200 -> 2, 50 -> 0.5, 0 -> 0
  }

  return { types: types.map((t) => t.name), matrix };
}

// ---------- Pokémon ----------
async function buildPokemon() {
  type Row = {
    id: number;
    name: string;
    height: number; // decímetros
    weight: number; // hectogramas
    base_experience: number | null;
    pokemonstats: { stat_id: number; base_stat: number }[];
    pokemontypes: { type_id: number; slot: number }[];
    pokemonspecy: {
      id: number;
      generation_id: number;
      evolution_chain_id: number | null;
      evolves_from_species_id: number | null;
    } | null;
  };
  type Resp = { pokemon: Row[]; type: { id: number; name: string }[] };

  const PAGE = 500;
  const typeName = new Map<number, string>();
  const out: PokemonRecord[] = [];

  for (let offset = 0; ; offset += PAGE) {
    const data = await gql<Resp>(
      `query ($limit: Int!, $offset: Int!) {
        type(where: { id: { _lte: 18 } }) { id name }
        pokemon(
          where: { is_default: { _eq: true }, id: { _lt: 10000 } }
          order_by: { id: asc }
          limit: $limit
          offset: $offset
        ) {
          id name height weight base_experience
          pokemonstats { stat_id base_stat }
          pokemontypes { type_id slot }
          pokemonspecy { id generation_id evolution_chain_id evolves_from_species_id }
        }
      }`,
      { limit: PAGE, offset }
    );
    if (typeName.size === 0) for (const t of data.type) typeName.set(t.id, t.name);
    if (data.pokemon.length === 0) break;

    for (const r of data.pokemon) {
      const stats = { hp: 0, attack: 0, defense: 0, sp_atk: 0, sp_def: 0, speed: 0 } as StatBlock;
      for (const s of r.pokemonstats) {
        const key = STAT_KEY[s.stat_id];
        if (key) stats[key] = s.base_stat;
      }
      const types = r.pokemontypes
        .sort((a, b) => a.slot - b.slot)
        .map((t) => typeName.get(t.type_id)!)
        .filter(Boolean);

      out.push({
        id: r.id,
        name: r.name,
        height: r.height / 10, // m
        weight: r.weight / 10, // kg
        base_experience: r.base_experience ?? 0,
        generation: r.pokemonspecy?.generation_id ?? 0,
        types,
        stats,
        total:
          stats.hp + stats.attack + stats.defense + stats.sp_atk + stats.sp_def + stats.speed,
        species_id: r.pokemonspecy?.id ?? r.id,
        evolves_from: r.pokemonspecy?.evolves_from_species_id ?? null,
        chain_id: r.pokemonspecy?.evolution_chain_id ?? null,
      });
    }
    process.stdout.write(`  ...${out.length} pokémon\r`);
    if (data.pokemon.length < PAGE) break;
  }
  return out;
}

interface PokemonRecord {
  id: number;
  name: string;
  height: number;
  weight: number;
  base_experience: number;
  generation: number;
  types: string[];
  stats: StatBlock;
  total: number;
  species_id: number;
  evolves_from: number | null;
  chain_id: number | null;
}

async function main() {
  console.log("Gerando dataset a partir da PokeAPI (GraphQL)...");
  await mkdir(OUT_DIR, { recursive: true });

  const [typeChart, pokemon] = await Promise.all([buildTypeChart(), buildPokemon()]);

  await writeFile(join(OUT_DIR, "type-chart.json"), JSON.stringify(typeChart));
  await writeFile(join(OUT_DIR, "pokemon.json"), JSON.stringify(pokemon));

  console.log(`\nOK: ${pokemon.length} pokémon, ${typeChart.types.length} tipos.`);
  console.log(`Arquivos em ${OUT_DIR}`);
}

main().catch((e) => {
  console.error("\nFalhou:", e);
  process.exit(1);
});
