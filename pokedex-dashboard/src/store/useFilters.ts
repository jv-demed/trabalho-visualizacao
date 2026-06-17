import { create } from "zustand";
import type { Pokemon } from "../types";

/**
 * Estado de filtro GLOBAL e compartilhado por todos os gráficos.
 * Qualquer recorte aqui (tipo, geração, faixa de status) refiltra simultaneamente
 * todas as visões do panorama — permitindo testar se as conclusões se mantêm
 * em subconjuntos dos dados (brushing & linking).
 */
interface FilterState {
  selectedTypes: string[]; // vazio = todos os tipos
  generations: number[]; // vazio = todas as gerações

  toggleType: (t: string) => void;
  toggleGeneration: (g: number) => void;
  reset: () => void;
}

export const useFilters = create<FilterState>((set) => ({
  selectedTypes: [],
  generations: [],

  toggleType: (t) =>
    set((s) => ({
      selectedTypes: s.selectedTypes.includes(t)
        ? s.selectedTypes.filter((x) => x !== t)
        : [...s.selectedTypes, t],
    })),
  toggleGeneration: (g) =>
    set((s) => ({
      generations: s.generations.includes(g)
        ? s.generations.filter((x) => x !== g)
        : [...s.generations, g],
    })),
  reset: () => set({ selectedTypes: [], generations: [] }),
}));

/** Aplica os filtros globais a um conjunto de Pokémon. */
export function applyFilters(
  pokemon: Pokemon[],
  f: Pick<FilterState, "selectedTypes" | "generations">
): Pokemon[] {
  return pokemon.filter((p) => {
    if (f.selectedTypes.length && !p.types.some((t) => f.selectedTypes.includes(t))) return false;
    if (f.generations.length && !f.generations.includes(p.generation)) return false;
    return true;
  });
}
