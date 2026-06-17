export interface StatBlock {
  hp: number;
  attack: number;
  defense: number;
  sp_atk: number;
  sp_def: number;
  speed: number;
}

export interface Pokemon {
  id: number;
  name: string;
  height: number; // metros
  weight: number; // kg
  base_experience: number;
  generation: number;
  types: string[];
  stats: StatBlock;
  total: number;
  species_id: number;
  evolves_from: number | null;
  chain_id: number | null;
}

export interface TypeChart {
  types: string[];
  /** matrix[atacante][defensor] = multiplicador de dano (0, 0.5, 1, 2) */
  matrix: number[][];
}

export type StatKey = keyof StatBlock;
