import ReactECharts from "echarts-for-react";
import type { EChartsOption } from "echarts";
import type { CSSProperties } from "react";

/** Paleta/estilos base para manter todos os gráficos ECharts coerentes no tema escuro. */
export const ECHART_TEXT = "#cbd5e1";
export const ECHART_AXIS = "#475569";
export const ECHART_SPLIT = "#1e293b";

interface Props {
  option: EChartsOption;
  style?: CSSProperties;
  onEvents?: Record<string, (params: any) => void>;
  group?: string;
}

export function EChart({ option, style, onEvents, group }: Props) {
  return (
    <ReactECharts
      option={option}
      notMerge
      lazyUpdate
      style={{ height: "100%", width: "100%", ...style }}
      onEvents={onEvents}
      onChartReady={(chart) => {
        if (group) chart.group = group;
      }}
    />
  );
}
