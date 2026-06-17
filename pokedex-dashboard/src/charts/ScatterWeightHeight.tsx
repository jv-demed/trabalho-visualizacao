import { useMemo } from "react";
import type { EChartsOption } from "echarts";
import type { Pokemon } from "../types";
import { EChart, ECHART_TEXT, ECHART_AXIS, ECHART_SPLIT } from "../components/EChart";
import { typeColor, cap, prettyName } from "../data/meta";

/**
 * Correlação peso × altura, codificando 4 dimensões num só gráfico:
 *  posição X = peso, posição Y = altura, COR = tipo primário, TAMANHO = base experience.
 * Escalas logarítmicas porque ambos variam por ordens de grandeza.
 */
export function ScatterWeightHeight({
  data,
  onSelect,
}: {
  data: Pokemon[];
  onSelect?: (id: number) => void;
}) {
  const option = useMemo<EChartsOption>(() => {
    // uma série por tipo primário -> legenda + cor consistente
    const byType = new Map<string, Pokemon[]>();
    for (const p of data) {
      const t = p.types[0];
      if (!byType.has(t)) byType.set(t, []);
      byType.get(t)!.push(p);
    }
    const maxExp = Math.max(1, ...data.map((p) => p.base_experience));

    const series = [...byType.entries()].map(([t, list]) => ({
      name: cap(t),
      type: "scatter" as const,
      itemStyle: { color: typeColor(t), opacity: 0.8 },
      symbolSize: (val: number[]) => 5 + (val[2] / maxExp) * 22,
      data: list.map((p) => ({
        value: [p.weight, p.height, p.base_experience, p.id, p.name],
      })),
    }));

    return {
      backgroundColor: "transparent",
      grid: { left: 58, right: 16, top: 12, bottom: 62 },
      tooltip: {
        trigger: "item",
        confine: true,
        backgroundColor: "#0f172a",
        borderColor: "#334155",
        textStyle: { color: ECHART_TEXT },
        formatter: (p: any) =>
          `<b>${prettyName(p.value[4])}</b><br/>Peso: ${p.value[0]} kg<br/>Altura: ${p.value[1]} m<br/>Base exp: ${p.value[2]}`,
      },
      legend: {
        type: "scroll",
        bottom: 0,
        textStyle: { color: ECHART_TEXT, fontSize: 10 },
        pageTextStyle: { color: ECHART_TEXT },
      },
      xAxis: {
        type: "log",
        name: "Peso (kg)",
        nameLocation: "middle",
        nameGap: 24,
        nameTextStyle: { color: ECHART_TEXT },
        axisLine: { lineStyle: { color: ECHART_AXIS } },
        splitLine: { lineStyle: { color: ECHART_SPLIT } },
        axisLabel: { color: ECHART_TEXT },
      },
      yAxis: {
        type: "log",
        name: "Altura (m)",
        nameLocation: "middle",
        nameGap: 38,
        nameTextStyle: { color: ECHART_TEXT },
        axisLine: { lineStyle: { color: ECHART_AXIS } },
        splitLine: { lineStyle: { color: ECHART_SPLIT } },
        axisLabel: { color: ECHART_TEXT },
      },
      series,
    };
  }, [data]);

  return (
    <EChart
      option={option}
      onEvents={{
        click: (p: any) => p?.value?.[3] != null && onSelect?.(p.value[3]),
      }}
    />
  );
}
