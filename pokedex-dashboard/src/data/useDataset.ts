import { useEffect, useState } from "react";
import type { Pokemon, TypeChart } from "../types";

export interface Dataset {
  pokemon: Pokemon[];
  typeChart: TypeChart;
}

let cache: Dataset | null = null;
let inflight: Promise<Dataset> | null = null;

async function load(): Promise<Dataset> {
  if (cache) return cache;
  if (inflight) return inflight;
  const base = import.meta.env.BASE_URL;
  inflight = Promise.all([
    fetch(`${base}data/pokemon.json`).then((r) => r.json() as Promise<Pokemon[]>),
    fetch(`${base}data/type-chart.json`).then((r) => r.json() as Promise<TypeChart>),
  ]).then(([pokemon, typeChart]) => {
    cache = { pokemon, typeChart };
    return cache;
  });
  return inflight;
}

export function useDataset() {
  const [data, setData] = useState<Dataset | null>(cache);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (data) return;
    let alive = true;
    load()
      .then((d) => alive && setData(d))
      .catch((e) => alive && setError(String(e)));
    return () => {
      alive = false;
    };
  }, [data]);

  return { data, loading: !data && !error, error };
}
