import { useMemo, useState } from "react";
import { useDataset } from "../data/useDataset";
import { useFilters, applyFilters } from "../store/useFilters";
import { STATS } from "../data/meta";
import type { StatKey } from "../types";
import { ChartCard } from "../components/ChartCard";
import { ScatterWeightHeight } from "../charts/ScatterWeightHeight";
import { StatBoxPlot } from "../charts/StatBoxPlot";
import { StatHistogram } from "../charts/StatHistogram";
import { TypeByGenStacked } from "../charts/TypeByGenStacked";
import { BstByGeneration } from "../charts/BstByGeneration";
import { TypeTreemap } from "../charts/TypeTreemap";

function StatSelect({ value, onChange }: { value: StatKey; onChange: (s: StatKey) => void }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value as StatKey)}
      className="rounded-md border border-slate-700 bg-slate-800 px-2 py-1 text-xs text-slate-200 focus:border-sky-500 focus:outline-none"
    >
      {STATS.map((s) => (
        <option key={s.key} value={s.key}>
          {s.label}
        </option>
      ))}
    </select>
  );
}

export function Overview() {
  const { data } = useDataset();
  const filters = useFilters();
  const [stat, setStat] = useState<StatKey>("attack");

  const filtered = useMemo(
    () => (data ? applyFilters(data.pokemon, filters) : []),
    [data, filters]
  );

  if (!data) return null;

  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
      <ChartCard
        title="Peso × Altura"
        conclusion="Peso e altura crescem juntos de forma forte (correlação ≈ 0,81 em escala log): na média, a densidade dos Pokémon é quase constante. O que chama atenção são as exceções fora da diagonal — corpos muito pesados para sua altura concentram-se em tipos Aço, Pedra e Terra."
      >
        <ScatterWeightHeight data={filtered} />
      </ChartCard>

      <ChartCard
        title="Composição de tipos por geração"
        conclusion="A composição é notavelmente estável: Água, Normal e Planta lideram em praticamente todas as gerações. Em vez de reinventar o conjunto, cada geração reaplica a mesma receita de tipos — os tipos mais recentes (Fada, Sombrio) aparecem só a partir das gerações em que foram introduzidos."
      >
        <TypeByGenStacked data={filtered} />
      </ChartCard>

      <ChartCard
        title="Distribuição de status por tipo"
        conclusion="O tipo prevê o status: em Ataque lideram Lutador, Terra e Dragão (medianas ~95–105) e ficam atrás Psíquico e Fada (~55–60); em Defesa dominam Aço e Pedra (~100). Troque o atributo no seletor para confirmar que cada tipo tem um perfil próprio."
        actions={<StatSelect value={stat} onChange={setStat} />}
      >
        <StatBoxPlot data={filtered} stat={stat} />
      </ChartCard>

      <ChartCard
        title="Distribuição do atributo no conjunto"
        conclusion="A distribuição é assimétrica à direita: a maioria se concentra em valores baixos-médios e há uma cauda longa de valores altos (lendários e pseudo-lendários). Não há um valor 'típico' único — o conjunto é dominado por Pokémon medianos com poucos extremos puxando a média para cima."
        actions={<StatSelect value={stat} onChange={setStat} />}
      >
        <StatHistogram data={filtered} stat={stat} />
      </ChartCard>

      <ChartCard
        title="Poder médio por geração"
        conclusion="O BST (Base Stat Total) é a soma dos 6 atributos base de um Pokémon (HP, Ataque, Defesa, At. Esp., Def. Esp. e Velocidade) — um número único que resume seu poder geral. Usando a mediana de cada geração (que ignora a distorção dos poucos lendários), ele salta de ~405–415 nas gerações I–III para ~480–488 a partir da IV: Pokémon mais recentes são, em geral, estatisticamente mais fortes — a franquia elevou o piso de poder ao longo do tempo."
      >
        <BstByGeneration data={filtered} />
      </ChartCard>

      <ChartCard
        title="Pokémon por tipo"
        bodyClass="h-72"
        conclusion="Os 18 tipos estão longe de equilibrados: Água (154) é o mais comum, seguido de Normal (131) e Planta (127), enquanto Gelo (48) é o mais raro — diferença de mais de 3×. A franquia tem tipos 'padrão' e tipos de nicho."
      >
        <TypeTreemap data={filtered} />
      </ChartCard>
    </div>
  );
}
