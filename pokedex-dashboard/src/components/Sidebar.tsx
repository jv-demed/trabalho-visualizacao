import { useMemo } from "react";
import { useFilters, applyFilters } from "../store/useFilters";
import { useDataset } from "../data/useDataset";
import { ALL_TYPES, GENERATIONS, typeColor, cap } from "../data/meta";

export function Sidebar() {
  const f = useFilters();
  const { data } = useDataset();

  const count = useMemo(() => {
    if (!data) return 0;
    return applyFilters(data.pokemon, f).length;
  }, [data, f]);

  const total = data?.pokemon.length ?? 0;

  return (
    <aside className="flex w-72 shrink-0 flex-col gap-5 overflow-y-auto border-r border-slate-800 bg-slate-900/40 p-4">
      <div>
        <div className="flex items-baseline justify-between">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400">Filtros</h2>
          <button
            onClick={f.reset}
            className="text-xs text-sky-400 hover:text-sky-300"
          >
            limpar
          </button>
        </div>
        <p className="mt-1 text-xs text-slate-500">
          <span className="font-semibold text-slate-300">{count}</span> de {total} Pokémon
        </p>
      </div>

      {/* Tipos */}
      <div>
        <h3 className="mb-2 text-xs font-medium text-slate-400">Tipos</h3>
        <div className="flex flex-wrap gap-1.5">
          {ALL_TYPES.map((t) => {
            const on = f.selectedTypes.includes(t);
            return (
              <button
                key={t}
                onClick={() => f.toggleType(t)}
                className={`rounded-md px-2 py-1 text-xs font-medium capitalize transition ${
                  on ? "text-white" : "text-slate-300 opacity-60 hover:opacity-100"
                }`}
                style={{
                  backgroundColor: on ? typeColor(t) : "transparent",
                  border: `1px solid ${typeColor(t)}`,
                }}
              >
                {cap(t)}
              </button>
            );
          })}
        </div>
      </div>

      {/* Gerações */}
      <div>
        <h3 className="mb-2 text-xs font-medium text-slate-400">Gerações</h3>
        <div className="grid grid-cols-3 gap-1.5">
          {GENERATIONS.map((g) => {
            const on = f.generations.includes(g.id);
            return (
              <button
                key={g.id}
                onClick={() => f.toggleGeneration(g.id)}
                title={g.region}
                className={`rounded-md border px-2 py-1 text-xs transition ${
                  on
                    ? "border-sky-500 bg-sky-500/20 text-sky-200"
                    : "border-slate-700 text-slate-400 hover:border-slate-500"
                }`}
              >
                {g.label}
              </button>
            );
          })}
        </div>
      </div>

      <p className="mt-auto text-[11px] leading-relaxed text-slate-600">
        Os filtros valem para todas as abas (brushing &amp; linking). Dados: PokeAPI.
      </p>
    </aside>
  );
}
