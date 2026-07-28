"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowUpCircle, ArrowDownCircle } from "lucide-react";
import type { Coin } from "@/lib/botfun-types";
import { formatTia, shortenAddress } from "@/lib/format";

interface MoverCoin extends Coin {
  momentum: number;
}

export function TopMovers({ coins, onCoinClick }: { coins: Coin[]; onCoinClick: (addr: string) => void }) {
  const withMomentum: MoverCoin[] = coins.map(c => ({
    ...c,
    momentum: parseFloat(c.volume24h) / Math.max(parseFloat(c.marketCap), 0.001),
  })).sort((a, b) => b.momentum - a.momentum);

  const gainers = withMomentum.slice(0, 5);
  const losers = withMomentum.slice(-5).reverse();
  const maxMomentum = withMomentum.length > 0 ? withMomentum[0].momentum : 1;

  const MoverRow = ({ coin, rank, isGainer }: { coin: MoverCoin; rank: number; isGainer: boolean }) => (
    <button
      onClick={() => onCoinClick(coin.address)}
      className="w-full flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-zinc-800/40 transition-colors text-left"
    >
      <span className="text-[10px] text-gray-400 dark:text-zinc-600 w-3">#{rank}</span>
      <span className={`text-sm font-bold ${isGainer ? "text-emerald-500" : "text-red-500"}`}>
        ${coin.symbol}
      </span>
      <div className="flex-1">
        <div className={`h-1.5 rounded-full ${isGainer ? "bg-emerald-500/20" : "bg-red-500/20"} overflow-hidden`}>
          <div
            className={`h-full rounded-full ${isGainer ? "bg-emerald-500" : "bg-red-500"}`}
            style={{ width: `${(coin.momentum / maxMomentum) * 100}%` }}
          />
        </div>
      </div>
      <span className="text-[10px] font-mono text-gray-400 dark:text-zinc-500 shrink-0">
        {formatTia(coin.marketCap)}
      </span>
    </button>
  );

  return (
    <Card className="border-gray-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-950/80 backdrop-blur">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-zinc-300">
          <ArrowUpCircle className="h-4 w-4 text-emerald-500" />
          Top Movers
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div>
          <div className="flex items-center gap-1 mb-1.5 px-2">
            <Badge className="text-[9px] px-1.5 py-0 h-4 bg-emerald-500/20 text-emerald-500 border-0">HOT</Badge>
            <span className="text-[10px] text-gray-400 dark:text-zinc-500">By volume/market cap ratio</span>
          </div>
          {gainers.map((c, i) => <MoverRow key={c.address} coin={c} rank={i + 1} isGainer />)}
        </div>
        <div className="border-t border-gray-100 dark:border-zinc-800/50 pt-3">
          <div className="flex items-center gap-1 mb-1.5 px-2">
            <Badge className="text-[9px] px-1.5 py-0 h-4 bg-red-500/20 text-red-500 border-0">COLD</Badge>
            <span className="text-[10px] text-gray-400 dark:text-zinc-500">Lowest momentum</span>
          </div>
          {losers.map((c, i) => <MoverRow key={c.address} coin={c} rank={i + 1} isGainer={false} />)}
        </div>
      </CardContent>
    </Card>
  );
}