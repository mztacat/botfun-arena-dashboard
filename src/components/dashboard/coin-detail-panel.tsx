"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import type { Coin } from "@/lib/botfun-types";
import { formatTia, timeAgo, shortenAddress } from "@/lib/format";

export function CoinDetailPanel({ coin }: { coin: Coin | null }) {
  if (!coin) return null;

  return (
    <Card className="border-amber-500/30 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-amber-500">${coin.symbol}</span>
            <span className="text-sm text-gray-500 dark:text-zinc-400">{coin.name}</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => window.open(`https://bot.fun/coin/${coin.address}`, "_blank")}
            className="text-gray-400 dark:text-zinc-500 hover:text-gray-600 dark:hover:text-zinc-300 h-7"
          >
            <ExternalLink className="h-3 w-3 mr-1" />
            View
          </Button>
        </div>
        <p className="text-xs text-gray-400 dark:text-zinc-500 line-clamp-2 mt-1">{coin.description}</p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3 text-center">
          <div className="rounded-lg bg-gray-100 dark:bg-zinc-900/80 p-2">
            <p className="text-[10px] text-gray-400 dark:text-zinc-500">Market Cap</p>
            <p className="text-sm font-mono font-bold text-gray-800 dark:text-zinc-200">{formatTia(coin.marketCap)} TIA</p>
          </div>
          <div className="rounded-lg bg-gray-100 dark:bg-zinc-900/80 p-2">
            <p className="text-[10px] text-gray-400 dark:text-zinc-500">24h Volume</p>
            <p className="text-sm font-mono font-bold text-gray-800 dark:text-zinc-200">{formatTia(coin.volume24h)} TIA</p>
          </div>
          <div className="rounded-lg bg-gray-100 dark:bg-zinc-900/80 p-2">
            <p className="text-[10px] text-gray-400 dark:text-zinc-500">Total Volume</p>
            <p className="text-sm font-mono font-bold text-gray-800 dark:text-zinc-200">{formatTia(coin.volumeTotal)} TIA</p>
          </div>
          <div className="rounded-lg bg-gray-100 dark:bg-zinc-900/80 p-2">
            <p className="text-[10px] text-gray-400 dark:text-zinc-500">Trades</p>
            <p className="text-sm font-mono font-bold text-gray-800 dark:text-zinc-200">{coin.tradeCount.toLocaleString()}</p>
          </div>
        </div>
        <p className="text-[11px] text-gray-400 dark:text-zinc-600 mt-3">
          Created by <span className="text-gray-500 dark:text-zinc-400">@{coin.creatorUsername || shortenAddress(coin.creator)}</span> &middot; {timeAgo(coin.createdAt)}
        </p>
      </CardContent>
    </Card>
  );
}