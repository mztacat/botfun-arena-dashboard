"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Flame } from "lucide-react";
import type { VolumeSpike } from "@/lib/dashboard-helpers";

export function VolumeDetector({ spikes, onCoinClick }: { spikes: VolumeSpike[]; onCoinClick: (addr: string) => void }) {
  const maxScore = spikes.length > 0 ? spikes[0].spikeScore : 1;

  return (
    <Card className="border-orange-500/20 bg-white/80 dark:bg-zinc-950/80 backdrop-blur">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-zinc-300">
          <Flame className="h-4 w-4 text-orange-500" />
          Volume Detector
          <Badge variant="outline" className="ml-auto text-[10px] border-orange-500/30 text-orange-500 bg-orange-500/10">
            LIVE
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[300px]">
          <div className="px-2 space-y-1.5">
            {spikes.length === 0 && (
              <p className="text-xs text-gray-400 dark:text-zinc-600 text-center py-6">Scanning for spikes...</p>
            )}
            {spikes.map((spike) => {
              const intensity = spike.spikeScore / maxScore;
              const isHot = intensity > 0.7;
              const isWarm = intensity > 0.4;
              const barColor = isHot ? "bg-orange-500" : isWarm ? "bg-amber-500" : "bg-yellow-600";
              const glowColor = isHot ? "shadow-orange-500/20" : isWarm ? "shadow-amber-500/10" : "";
              const netFlow = spike.buyCount - spike.sellCount;
              const isNetBuy = netFlow > 0;

              return (
                <button
                  key={spike.coinAddress}
                  onClick={() => onCoinClick(spike.coinAddress)}
                  className={`w-full text-left rounded-lg px-3 py-2.5 transition-all hover:bg-gray-100 dark:hover:bg-zinc-800/60 ${glowColor ? "shadow-md " + glowColor : ""}`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-bold ${isHot ? "text-orange-500" : isWarm ? "text-amber-500" : "text-yellow-600"}`}>
                        ${spike.coinSymbol}
                      </span>
                      {isHot && <Flame className="h-3 w-3 text-orange-500" />}
                    </div>
                    <span className={`text-xs font-mono font-semibold ${isNetBuy ? "text-emerald-500" : "text-red-500"}`}>
                      {isNetBuy ? "+" : ""}{netFlow} net
                    </span>
                  </div>

                  <div className="h-1.5 rounded-full bg-gray-200 dark:bg-zinc-800 mb-2 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${barColor} transition-all duration-500`}
                      style={{ width: `${intensity * 100}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-gray-400 dark:text-zinc-500">
                    <span className="flex items-center gap-2">
                      <span className="text-emerald-500">{spike.buyCount} buys</span>
                      <span className="text-red-500">{spike.sellCount} sells</span>
                    </span>
                    <span>{spike.totalTia.toFixed(1)} TIA</span>
                  </div>

                  {spike.agents.length > 0 && (
                    <div className="flex items-center gap-1 mt-1.5 flex-wrap">
                      {spike.agents.slice(0, 4).map((agent) => (
                        <span
                          key={agent}
                          className="text-[9px] px-1.5 py-0.5 rounded bg-gray-200 dark:bg-zinc-800 text-gray-500 dark:text-zinc-400"
                        >
                          @{agent}
                        </span>
                      ))}
                      {spike.agents.length > 4 && (
                        <span className="text-[9px] text-gray-400 dark:text-zinc-600">+{spike.agents.length - 4}</span>
                      )}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}