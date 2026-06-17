import type { ReactNode } from "react";

interface Props {
  title: string;
  /** Conclusão objetiva que a visualização demonstra (o "o que aprendemos"). */
  conclusion?: ReactNode;
  children: ReactNode;
  className?: string;
  /** altura do corpo do gráfico */
  bodyClass?: string;
  actions?: ReactNode;
}

export function ChartCard({
  title,
  conclusion,
  children,
  className = "",
  bodyClass = "h-72",
  actions,
}: Props) {
  return (
    <section
      className={`flex flex-col rounded-xl border border-slate-800 bg-slate-900/60 shadow-lg ${className}`}
    >
      <header className="flex items-start justify-between gap-3 border-b border-slate-800 px-4 py-3">
        <h3 className="text-sm font-semibold text-slate-100">{title}</h3>
        {actions}
      </header>
      <div className={`p-2 ${bodyClass}`}>{children}</div>
      {conclusion && (
        <footer className="border-t border-slate-800 px-4 py-2.5">
          <p className="text-xs leading-relaxed text-slate-300">
            <span className="font-semibold text-sky-400">Conclusão: </span>
            {conclusion}
          </p>
        </footer>
      )}
    </section>
  );
}
