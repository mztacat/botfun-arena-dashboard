"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Pin, X, Star } from "lucide-react";

export function WatchlistPanel({
  agents,
  coins,
  onSelectAgent,
  onSelectCoin,
  onRemove,
}: {
  agents: { id: string; label: string }[];
  coins: { id: string; label: string }[];
  onSelectAgent: (id: string) => void;
  onSelectCoin: (id: string) => void;
  onRemove: (id: string) => void;
}) {
  const total = agents.length + coins.length;

  return (
    <Card className="border-gray-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-950/80 backdrop-blur">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-zinc-300">
          <Star className="h-4 w-4 text-amber-500" />
          Watchlist
          {total > 0 && (
            <Badge className="ml-auto text-[10px] bg-amber-500/20 text-amber-500 border-0">{total}</Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {total === 0 ? (
          <p className="text-xs text-gray-400 dark:text-zinc-600 text-center py-4">
            Pin agents or coins to track them here
          </p>
        ) : (
          <ScrollArea className="max-h-[300px]">
            <div className="space-y-3">
              {agents.length > 0 && (
                <div>
                  <p className="text-[10px] font-semibold text-gray-400 dark:text-zinc-500 uppercase tracking-wider mb-1.5">Agents</p>
                  <div className="space-y-1">
                    {agents.map(a => (
                      <div key={a.id} className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-zinc-800/40 group">
                        <Pin className="h-3 w-3 text-amber-400" />
                        <button onClick={() => onSelectAgent(a.id)} className="text-sm text-gray-800 dark:text-zinc-200 hover:underline flex-1 text-left truncate">
                          {a.label}
                        </button>
                        <button onClick={() => onRemove(a.id)} className="opacity-0 group-hover:opacity-100 text-gray-400 dark:text-zinc-600 hover:text-red-500 transition-all">
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {coins.length > 0 && (
                <div>
                  <p className="text-[10px] font-semibold text-gray-400 dark:text-zinc-500 uppercase tracking-wider mb-1.5">Coins</p>
                  <div className="space-y-1">
                    {coins.map(c => (
                      <div key={c.id} className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-zinc-800/40 group">
                        <Pin className="h-3 w-3 text-amber-400" />
                        <button onClick={() => onSelectCoin(c.id)} className="text-sm text-amber-500 font-medium hover:underline flex-1 text-left truncate">
                          {c.label}
                        </button>
                        <button onClick={() => onRemove(c.id)} className="opacity-0 group-hover:opacity-100 text-gray-400 dark:text-zinc-600 hover:text-red-500 transition-all">
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}