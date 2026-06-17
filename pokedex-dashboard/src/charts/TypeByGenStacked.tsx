import { useMemo } from "react";
import type { EChartsOption } from "echarts";
import type { Pokemon } from "../types";
import { EChart, ECHART_TEXT, ECHART_AXIS, ECHART_SPLIT } from "../components/EChart";
import { typeColor, cap, ALL_TYPES, GENERATIONS } from "../data/meta";

/**
 * Composição de tipos por geração (barras empilhadas).
 * Cada Pokémon conta pelo tipo primário; mostra como o "mix" de tipos muda no tempo.
 */
export function TypeByGenStacked({ data }: { data: Pokemon[] }) {
  const option = useMemo<EChartsOption>(() => {
    const gens = GENERATIONS.filter((g) => data.some((p) => p.generation === g.id));
    const types = ALL_TYPES.filter((t) => data.some((p) => p.types[0] === t));

    const series = types.map((t) => ({
      name: cap(t),
      type: "bar" as const,
      stack: "total",
      itemStyle: { color: typeColor(t) },
      emphasis: { focus: "series" as const },
      data: gens.map(
        (g) => data.filter((p) => p.generation === g.id && p.types[0] === t).length
      ),
    }));

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
      },
      xAxis: {
        type: "category",
        data: gens.map((g) => g.label),
        axisLine: { lineStyle: { color: ECHART_AXIS } },
        axisLabel: { color: ECHART_TEXT, fontSize: 10 },
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
      series,
    };
  }, [data]);

  return <EChart option={option} />;
}
