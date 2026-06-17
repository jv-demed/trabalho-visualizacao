/** Quantil (interpolação linear) de um array numérico já ORDENADO. */
export function quantileSorted(sorted: number[], q: number): number {
  if (sorted.length === 0) return 0;
  const pos = (sorted.length - 1) * q;
  const base = Math.floor(pos);
  const rest = pos - base;
  return sorted[base + 1] !== undefined
    ? sorted[base] + rest * (sorted[base + 1] - sorted[base])
    : sorted[base];
}

/** [min, Q1, mediana, Q3, max] para um box plot. */
export function boxStats(values: number[]): [number, number, number, number, number] {
  const s = [...values].sort((a, b) => a - b);
  return [
    s[0] ?? 0,
    quantileSorted(s, 0.25),
    quantileSorted(s, 0.5),
    quantileSorted(s, 0.75),
    s[s.length - 1] ?? 0,
  ];
}

/** Histograma simples com nBins faixas iguais entre min e max. */
export function histogram(values: number[], nBins: number, min: number, max: number) {
  const bins = new Array(nBins).fill(0);
  const width = (max - min) / nBins || 1;
  for (const v of values) {
    let i = Math.floor((v - min) / width);
    if (i < 0) i = 0;
    if (i >= nBins) i = nBins - 1;
    bins[i]++;
  }
  return bins.map((count, i) => ({
    count,
    x0: Math.round(min + i * width),
    x1: Math.round(min + (i + 1) * width),
  }));
}
