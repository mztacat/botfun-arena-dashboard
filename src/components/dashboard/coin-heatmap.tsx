"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Grid3x3 } from "lucide-react";
import type { Coin } from "@/lib/botfun-types";
import { formatTia } from "@/lib/format";

export function CoinHeatmap({ coins, onCoinClick }: { coins: Coin[]; onCoinClick: (addr: string) => void }) {
  const sorted = [...coins].sort((a, b) => parseFloat(b.marketCap) - parseFloat(a.marketCap));
  const maxMc = sorted.length > 0 ? parseFloat(sorted[0].marketCap) : 1;

  const getMomentum = (coin: Coin) => {
    const mc = parseFloat(coin.marketCap) || 0.001;
    const vol = parseFloat(coin.volume24h) || 0;
    return vol / mc;
  };

  const maxMomentum = Math.max(...sorted.map(getMomentum), 0.001);

  const getColor = (coin: Coin) => {
    const ratio = getMomentum(coin) / maxMomentum;
    if (ratio > 0.7) return "bg-emerald-500/80 hover:bg-emerald-500 text-white";
    if (ratio > 0.4) return "bg-emerald-400/60 hover:bg-emerald-400/80 text-white";
    if (ratio > 0.15) return "bg-yellow-500/50 hover:bg-yellow-500/70 text-gray-800 dark:text-gray-100";
    return "bg-red-400/40 hover:bg-red-400/60 text-white";
  };

  const getSize = (coin: Coin, index: number) => {
    const mcRatio = parseFloat(coin.marketCap) / maxMc;
    if (index < 3 && mcRatio > 0.3) return "col-span-2 row-span-2";
    if (index < 6) return "col-span-1 row-span-2";
    return "col-span-1 row-span-1";
  };

  return (
    <Card className="border-gray-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-950/80 backdrop-blur">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-zinc-300">
          <Grid3x3 className="h-4 w-4 text-emerald-500" />
          Coin Heatmap
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-4 auto-rows-[60px] gap-1.5">
          {sorted.slice(0, 16).map((coin, i) => (
            <button
              key={coin.address}
              onClick={() => onCoinClick(coin.address)}
              className={`${getSize(coin, i)} rounded-lg p-2 flex flex-col justify-between transition-all ${getColor(coin)}`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm truncate">${coin.symbol}</span>
                <span className="text-[9px] opacity-70">{coin.tradeCount}t</span>
              </div>
              <div className="text-right">
                <span className="text-xs font-mono opacity-90">{formatTia(coin.marketCap)}</span>
              </div>
            </button>
          ))}
        </div>
        <div className="flex items-center justify-center gap-4 mt-3 text-[10px] text-gray-400 dark:text-zinc-500">
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-emerald-500/80" /> Hot</span>
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-yellow-500/50" /> Warm</span>
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-red-400/40" /> Cold</span>
        </div>
      </CardContent>
    </Card>
  );
}