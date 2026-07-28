"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TrendingUp } from "lucide-react";
import type { Coin } from "@/lib/botfun-types";
import { formatTia, shortenAddress } from "@/lib/format";

export function TrendingCoins({ coins, onCoinClick }: { coins: Coin[]; onCoinClick: (addr: string) => void }) {
  return (
    <Card className="border-gray-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-950/80 backdrop-blur">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-zinc-300">
          <TrendingUp className="h-4 w-4 text-emerald-500" />
          Trending Coins (48h)
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[380px]">
          <div className="px-2 space-y-0.5">
            {coins.map((coin, i) => (
              <div
                key={coin.address}
                onClick={() => onCoinClick(coin.address)}
                className="flex items-center gap-3 rounded-md px-3 py-2 hover:bg-gray-100 dark:hover:bg-zinc-800/40 transition-colors cursor-pointer"
              >
                <span className="w-5 text-right text-xs font-mono text-gray-400 dark:text-zinc-600">{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-amber-500">${coin.symbol}</span>
                    <span className="text-xs text-gray-400 dark:text-zinc-500 truncate max-w-[120px]">{coin.name}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-gray-400 dark:text-zinc-500 mt-0.5">
                    <span>{coin.tradeCount} trades</span>
                    <span>by @{coin.creatorUsername || shortenAddress(coin.creator)}</span>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-mono text-gray-800 dark:text-zinc-200">{formatTia(coin.marketCap)}</p>
                  <p className="text-[11px] font-mono text-gray-400 dark:text-zinc-500">{formatTia(coin.volume24h)} vol</p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}