import { useMemo } from "react";
import type { EChartsOption } from "echarts";
import type { Pokemon } from "../types";
import { EChart, ECHART_TEXT, ECHART_AXIS, ECHART_SPLIT } from "../components/EChart";
import { GENERATIONS } from "../data/meta";
import { quantileSorted } from "../lib/stats";

/**
 * Mediana do total de status (BST) por geração — testa a hipótese de "power creep":
 * os Pokémon lançados ficaram, em média, mais fortes ao longo do tempo?
 */
export function BstByGeneration({ data }: { data: Pokemon[] }) {
  const option = useMemo<EChartsOption>(() => {
    const gens = GENERATIONS.filter((g) => data.some((p) => p.generation === g.id));
    const rows = gens.map((g) => {
      const vals = data.filter((p) => p.generation === g.id).map((p) => p.total);
      const sorted = [...vals].sort((a, b) => a - b);
      return { label: g.label, region: g.region, n: vals.length, median: Math.round(quantileSorted(sorted, 0.5)) };
    });

    return {
      backgroundColor: "transparent",
      grid: { left: 58, right: 14, top: 12, bottom: 30 },
      tooltip: {
        trigger: "axis",
        axisPointer: { type: "shadow" },
        confine: true,
        backgroundColor: "#0f172a",
        borderColor: "#334155",
        textStyle: { color: ECHART_TEXT },
        formatter: (ps: any) => {
          const r = rows[ps[0].dataIndex];
          return `<b>${r.label}</b> (${r.region})<br/>BST mediano: <b>${r.median}</b><br/>${r.n} Pokémon`;
        },
      },
      xAxis: {
        type: "category",
        data: rows.map((r) => r.label),
        axisLine: { lineStyle: { color: ECHART_AXIS } },
        axisLabel: { color: ECHART_TEXT, fontSize: 10 },
      },
      yAxis: {
        type: "value",
        min: 350,
        name: "BST mediano",
        nameLocation: "middle",
        nameGap: 40,
        nameTextStyle: { color: ECHART_TEXT },
        axisLine: { lineStyle: { color: ECHART_AXIS } },
        splitLine: { lineStyle: { color: ECHART_SPLIT } },
        axisLabel: { color: ECHART_TEXT },
      },
      series: [
        {
          type: "bar",
          data: rows.map((r) => r.median),
          itemStyle: { color: "#38bdf8", borderRadius: [4, 4, 0, 0] },
          barWidth: "55%",
          label: { show: true, position: "top", color: ECHART_TEXT, fontSize: 10 },
        },
      ],
    };
  }, [data]);

  return <EChart option={option} />;
}
