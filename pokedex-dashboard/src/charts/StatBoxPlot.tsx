import { useMemo } from "react";
import type { EChartsOption } from "echarts";
import type { Pokemon, StatKey } from "../types";
import { EChart, ECHART_TEXT, ECHART_AXIS, ECHART_SPLIT } from "../components/EChart";
import { typeColor, cap, ALL_TYPES, STATS } from "../data/meta";
import { boxStats } from "../lib/stats";

/**
 * Distribuição de um status por tipo (box plot): mediana, dispersão e outliers.
 * Responde perguntas como "Dragão realmente ataca mais?" com base estatística,
 * não com um único valor médio.
 */
export function StatBoxPlot({ data, stat }: { data: Pokemon[]; stat: StatKey }) {
  const statLabel = STATS.find((s) => s.key === stat)?.label ?? "Valor";
  const option = useMemo<EChartsOption>(() => {
    const types = ALL_TYPES.filter((t) => data.some((p) => p.types.includes(t)));
    const boxes: number[][] = [];
    const colors: string[] = [];
    for (const t of types) {
      const vals = data.filter((p) => p.types.includes(t)).map((p) => p.stats[stat]);
      boxes.push(boxStats(vals));
      colors.push(typeColor(t));
    }

    return {
      backgroundColor: "transparent",
      grid: { left: 58, right: 14, top: 12, bottom: 64 },
      tooltip: {
        trigger: "item",
        confine: true,
        backgroundColor: "#0f172a",
        borderColor: "#334155",
        textStyle: { color: ECHART_TEXT },
      },
      xAxis: {
        type: "category",
        data: types.map(cap),
        axisLine: { lineStyle: { color: ECHART_AXIS } },
        axisLabel: { color: ECHART_TEXT, rotate: 45, fontSize: 10 },
      },
      yAxis: {
        type: "value",
        name: statLabel,
        nameLocation: "middle",
        nameGap: 38,
        nameTextStyle: { color: ECHART_TEXT },
        axisLine: { lineStyle: { color: ECHART_AXIS } },
        splitLine: { lineStyle: { color: ECHART_SPLIT } },
        axisLabel: { color: ECHART_TEXT },
      },
      series: [
        {
          type: "boxplot",
          data: boxes.map((b, i) => ({
            value: b,
            itemStyle: { color: colors[i] + "55", borderColor: colors[i] },
          })),
          tooltip: {
            formatter: (p: any) =>
              `<b>${p.name}</b><br/>máx: ${p.value[5]}<br/>Q3: ${p.value[4]}<br/>mediana: ${p.value[3]}<br/>Q1: ${p.value[2]}<br/>mín: ${p.value[1]}`,
          },
        },
      ],
    };
  }, [data, stat, statLabel]);

  return <EChart option={option} />;
}
