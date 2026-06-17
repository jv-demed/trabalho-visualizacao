import type { ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { useDataset } from "../data/useDataset";

/** Logo de pokébola desenhada em SVG. */
function Pokeball({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true">
      <circle cx="50" cy="50" r="48" fill="#fff" stroke="#1f2937" strokeWidth="4" />
      <path d="M2,50 a48,48 0 0,1 96,0 Z" fill="#ef4444" />
      <rect x="2" y="46" width="96" height="8" fill="#1f2937" />
      <circle cx="50" cy="50" r="13" fill="#fff" stroke="#1f2937" strokeWidth="6" />
    </svg>
  );
}

export function Layout({ children }: { children: ReactNode }) {
  const { loading, error } = useDataset();

  return (
    <div className="flex h-full flex-col">
      <header className="flex items-center gap-6 border-b border-slate-800 bg-slate-900/80 px-5 py-3 backdrop-blur">
        <div className="flex items-center gap-2">
          <Pokeball className="h-7 w-7" />
          <h1 className="text-lg font-bold tracking-tight">
            Pokedex <span className="text-sky-400">Dashboard</span>
          </h1>
        </div>
        <span className="ml-auto text-xs text-slate-500">Computação Gráfica e Visualização</span>
      </header>

      <div className="flex min-h-0 flex-1">
        <Sidebar />
        <main className="min-w-0 flex-1 overflow-y-auto p-5">
          {error ? (
            <div className="rounded-lg border border-red-800 bg-red-950/40 p-4 text-sm text-red-200">
              Erro ao carregar os dados: {error}
              <br />
              Rode <code className="text-red-100">npm run build:data</code> para gerar os arquivos.
            </div>
          ) : loading ? (
            <div className="flex h-full items-center justify-center text-slate-500">
              Carregando dados da Pokédex…
            </div>
          ) : (
            children
          )}
        </main>
      </div>
    </div>
  );
}
