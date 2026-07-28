"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Trophy, Pin } from "lucide-react";
import type { Agent } from "@/lib/botfun-types";
import { formatTia, formatPnl, shortenAddress } from "@/lib/format";
import { getAgentColor, getInitials } from "@/lib/dashboard-helpers";

function quickStyle(agent: Agent): { tag: string; color: string } {
  const tc = agent.tradeCount || 0;
  const pos = agent.positions?.length || 0;
  if (tc > 50 || pos > 20) return { tag: "Degen", color: "bg-red-500/20 text-red-400 border-red-500/30" };
  if (pos > 5) return { tag: "Holder", color: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" };
  if (tc > 10) return { tag: "Flipper", color: "bg-blue-500/20 text-blue-400 border-blue-500/30" };
  if (tc > 0) return { tag: "Active", color: "bg-amber-500/20 text-amber-400 border-amber-500/30" };
  return { tag: "Quiet", color: "bg-gray-500/20 text-gray-400 border-gray-500/30" };
}

export function LeaderboardPanel({
  agents,
  onSelect,
  selected,
  watchlistAgentIds,
  onWatch,
  isWatched,
}: {
  agents: Agent[];
  onSelect: (a: Agent) => void;
  selected: string | null;
  watchlistAgentIds: Set<string>;
  onWatch: (type: "agent", id: string, label: string) => void;
  isWatched: (id: string) => boolean;
}) {
  return (
    <Card className="border-gray-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-950/80 backdrop-blur">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-zinc-300">
          <Trophy className="h-4 w-4 text-yellow-500" />
          Agent Leaderboard
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[520px]">
          <div className="space-y-0.5 px-2">
            {agents.map((agent, i) => {
              const pnl = formatPnl(agent.totalPnl);
              const isSelected = selected === agent.address;
              const style = quickStyle(agent);
              const label = agent.username || shortenAddress(agent.address);
              const watched = isWatched(agent.address);

              return (
                <button
                  key={agent.address}
                  onClick={() => onSelect(agent)}
                  className={`w-full flex items-center gap-2 rounded-md px-3 py-2 text-left transition-colors hover:bg-gray-100 dark:hover:bg-zinc-800/60 ${
                    isSelected ? "bg-gray-200 dark:bg-zinc-800 ring-1 ring-gray-400 dark:ring-zinc-600" : ""
                  }`}
                >
                  <span className="w-5 text-right text-xs font-mono text-gray-400 dark:text-zinc-500 shrink-0">
                    {i + 1}
                  </span>
                  <Avatar className="h-7 w-7 shrink-0">
                    <AvatarFallback
                      style={{ backgroundColor: getAgentColor(agent.username) + "33", color: getAgentColor(agent.username), fontSize: 11 }}
                    >
                      {getInitials(agent.username)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <p className="text-sm font-medium text-gray-800 dark:text-zinc-200 truncate">
                        {label}
                      </p>
                      <Badge variant="outline" className={`text-[9px] px-1 py-0 h-3.5 border ${style.color} shrink-0`}>
                        {style.tag}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-400 dark:text-zinc-500">
                      {agent.realizedPnl ? `${formatTia(agent.realizedPnl)} realized` : ""}
                    </p>
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); onWatch("agent", agent.address, label); }}
                    className={`p-0.5 shrink-0 transition-colors ${watched ? "text-amber-400" : "text-gray-300 dark:text-zinc-600 hover:text-amber-400"}`}
                  >
                    <Pin className="h-3 w-3" />
                  </button>
                  <span className={`text-sm font-mono font-semibold shrink-0 ${pnl.positive ? "text-emerald-500" : "text-red-500"}`}>
                    {pnl.text}
                  </span>
                </button>
              );
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}