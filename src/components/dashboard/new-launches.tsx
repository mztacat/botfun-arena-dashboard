"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Rocket, Clock, Pin } from "lucide-react";
import type { Coin } from "@/lib/botfun-types";
import { timeAgo, shortenAddress, formatTia } from "@/lib/format";

export function NewLaunches({
  coins,
  onCoinClick,
  isWatched,
  onWatch,
}: {
  coins: Coin[];
  onCoinClick: (addr: string) => void;
  isWatched: (id: string) => boolean;
  onWatch: (type: "coin", id: string, label: string) => void;
}) {
  return (
    <Card className="border-emerald-500/20 bg-white/80 dark:bg-zinc-950/80 backdrop-blur">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-zinc-300">
          <Rocket className="h-4 w-4 text-emerald-500" />
          New Launches
          <Badge variant="outline" className="ml-auto text-[10px] border-emerald-500/30 text-emerald-500 bg-emerald-500/10">
            FRESH
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[260px]">
          <div className="px-2 space-y-0.5">
            {coins.map((coin, i) => {
              const isNew = i < 3;
              return (
                <div
                  key={coin.address}
                  onClick={() => onCoinClick(coin.address)}
                  className={`w-full flex items-start gap-3 rounded-md px-3 py-2.5 text-left transition-colors hover:bg-gray-100 dark:hover:bg-zinc-800/60 cursor-pointer ${isNew ? "border-l-2 border-emerald-500/60" : ""}`}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-semibold ${isNew ? "text-emerald-500" : "text-amber-500"}`}>
                        ${coin.symbol}
                      </span>
                      {isNew && (
                        <Badge className="text-[9px] px-1 py-0 h-4 bg-emerald-500/20 text-emerald-500 border-0">
                          NEW
                        </Badge>
                      )}
                    </div>
                    <p className="text-[11px] text-gray-400 dark:text-zinc-500 line-clamp-1 mt-0.5">{coin.name}</p>
                    <p className="text-[10px] text-gray-400 dark:text-zinc-600 line-clamp-1 mt-0.5 leading-relaxed">
                      {coin.description}
                    </p>
                    <div className="flex items-center gap-3 mt-1.5 text-[10px] text-gray-400 dark:text-zinc-500">
                      <span className="flex items-center gap-1">
                        <Clock className="h-2.5 w-2.5" />
                        {timeAgo(coin.createdAt)}
                      </span>
                      <span>{coin.tradeCount} trades</span>
                      <span>{formatTia(coin.marketCap)} MC</span>
                    </div>
                    <p className="text-[10px] text-gray-400 dark:text-zinc-600 mt-1">
                      by @{coin.creatorUsername || shortenAddress(coin.creator)}
                    </p>
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); onWatch("coin", coin.address, `$${coin.symbol}`); }}
                    className={`p-0.5 shrink-0 mt-0.5 transition-colors ${isWatched(coin.address) ? "text-amber-400" : "text-gray-300 dark:text-zinc-600 hover:text-amber-400"}`}
                  >
                    <Pin className="h-3 w-3" />
                  </button>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}