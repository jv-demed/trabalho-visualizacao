import type { StatKey } from "../types";

/** Cores oficiais dos 18 tipos — usadas de forma consistente em todos os gráficos
 *  para que a cor seja um canal de codificação confiável (mesma cor = mesmo tipo). */
export const TYPE_COLORS: Record<string, string> = {
  normal: "#A8A77A",
  fire: "#EE8130",
  water: "#6390F0",
  electric: "#F7D02C",
  grass: "#7AC74C",
  ice: "#96D9D6",
  fighting: "#C22E28",
  poison: "#A33EA1",
  ground: "#E2BF65",
  flying: "#A98FF3",
  psychic: "#F95587",
  bug: "#A6B91A",
  rock: "#B6A136",
  ghost: "#735797",
  dragon: "#6F35FC",
  dark: "#705746",
  steel: "#B7B7CE",
  fairy: "#D685AD",
};

export const typeColor = (t: string) => TYPE_COLORS[t] ?? "#888";

/** Ordem e rótulos dos 6 status base. */
export const STATS: { key: StatKey; label: string; short: string; color: string }[] = [
  { key: "hp", label: "HP", short: "HP", color: "#4ade80" },
  { key: "attack", label: "Ataque", short: "Atk", color: "#f87171" },
  { key: "defense", label: "Defesa", short: "Def", color: "#fbbf24" },
  { key: "sp_atk", label: "At. Esp.", short: "SpA", color: "#60a5fa" },
  { key: "sp_def", label: "Def. Esp.", short: "SpD", color: "#22d3ee" },
  { key: "speed", label: "Velocidade", short: "Spe", color: "#c084fc" },
];

export const GENERATIONS: { id: number; label: string; region: string }[] = [
  { id: 1, label: "Gen I", region: "Kanto" },
  { id: 2, label: "Gen II", region: "Johto" },
  { id: 3, label: "Gen III", region: "Hoenn" },
  { id: 4, label: "Gen IV", region: "Sinnoh" },
  { id: 5, label: "Gen V", region: "Unova" },
  { id: 6, label: "Gen VI", region: "Kalos" },
  { id: 7, label: "Gen VII", region: "Alola" },
  { id: 8, label: "Gen VIII", region: "Galar" },
  { id: 9, label: "Gen IX", region: "Paldea" },
];

export const ALL_TYPES = Object.keys(TYPE_COLORS);

/** URL do artwork oficial — construída a partir do id, sem requisição extra na geração. */
export const artworkUrl = (id: number) =>
  `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;

export const spriteUrl = (id: number) =>
  `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;

export const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
export const prettyName = (s: string) => s.split("-").map(cap).join(" ");
