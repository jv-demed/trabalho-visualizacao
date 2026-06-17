import { useMemo } from "react";
import type { EChartsOption } from "echarts";
import type { Pokemon, StatKey } from "../types";
import { EChart, ECHART_TEXT, ECHART_AXIS, ECHART_SPLIT } from "../components/EChart";
import { STATS } from "../data/meta";
import { histogram } from "../lib/stats";

/** Distribuição de um status no conjunto filtrado — mostra a forma (assimetria, picos). */
export function StatHistogram({ data, stat }: { data: Pokemon[]; stat: StatKey }) {
  const meta = STATS.find((s) => s.key === stat)!;
  const option = useMemo<EChartsOption>(() => {
    const vals = data.map((p) => p.stats[stat]);
    const bins = histogram(vals, 20, 0, 200);
    return {
      backgroundColor: "transparent",
      grid: { left: 58, right: 14, top: 12, bottom: 34 },
      tooltip: {
        trigger: "axis",
        confine: true,
        backgroundColor: "#0f172a",
        borderColor: "#334155",
        textStyle: { color: ECHART_TEXT },
        formatter: (ps: any) => {
          const b = bins[ps[0].dataIndex];
          return `${b.x0}–${b.x1}: <b>${b.count}</b> Pokémon`;
        },
      },
      xAxis: {
        type: "category",
        data: bins.map((b) => b.x0),
        name: meta.label,
        nameLocation: "middle",
        nameGap: 24,
        nameTextStyle: { color: ECHART_TEXT },
        axisLine: { lineStyle: { color: ECHART_AXIS } },
        axisLabel: { color: ECHART_TEXT, fontSize: 10, interval: 1 },
      },
      yAxis: {
        type: "value",
        name: "Nº de Pokémon",
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
          data: bins.map((b) => b.count),
          itemStyle: { color: meta.color },
          barCategoryGap: "8%",
        },
      ],
    };
  }, [data, stat, meta]);

  return <EChart option={option} />;
}
