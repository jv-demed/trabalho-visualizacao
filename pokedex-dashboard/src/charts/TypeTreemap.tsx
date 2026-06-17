import { useMemo } from "react";
import type { EChartsOption } from "echarts";
import type { Pokemon } from "../types";
import { EChart, ECHART_TEXT } from "../components/EChart";
import { typeColor, cap, ALL_TYPES } from "../data/meta";

/**
 * Treemap da contagem de Pokémon por tipo (considera os dois tipos).
 * Área proporcional à quantidade: hierarquia + proporção num único enquadramento.
 */
export function TypeTreemap({ data }: { data: Pokemon[] }) {
  const option = useMemo<EChartsOption>(() => {
    const counts = new Map<string, number>();
    for (const p of data) for (const t of p.types) counts.set(t, (counts.get(t) ?? 0) + 1);

    const children = ALL_TYPES.filter((t) => counts.has(t)).map((t) => ({
      name: cap(t),
      value: counts.get(t)!,
      itemStyle: { color: typeColor(t) },
    }));

    return {
      backgroundColor: "transparent",
      tooltip: {
        confine: true,
        backgroundColor: "#0f172a",
        borderColor: "#334155",
        textStyle: { color: ECHART_TEXT },
        formatter: (p: any) => `<b>${p.name}</b>: ${p.value} Pokémon`,
      },
      series: [
        {
          type: "treemap",
          roam: false,
          nodeClick: false,
          breadcrumb: { show: false },
          label: { color: "#fff", fontSize: 12, formatter: "{b}\n{c}" },
          itemStyle: { borderColor: "#0f172a", borderWidth: 2 },
          data: children,
        },
      ],
    };
  }, [data]);

  return <EChart option={option} />;
}
