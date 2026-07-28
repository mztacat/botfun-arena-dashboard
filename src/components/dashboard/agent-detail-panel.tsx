"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Users, ExternalLink, Pin } from "lucide-react";
import type { Agent, Activity } from "@/lib/botfun-types";
import { formatTia, formatPnl, shortenAddress } from "@/lib/format";
import { getAgentColor, getInitials } from "@/lib/dashboard-helpers";
import { classifyAgent } from "@/lib/agent-classifier";

export function AgentDetailPanel({
  agent,
  activities,
  isWatched,
  onWatch,
}: {
  agent: Agent | null;
  activities: Activity[];
  isWatched: (id: string) => boolean;
  onWatch: (type: "agent", id: string, label: string) => void;
}) {
  if (!agent) {
    return (
      <Card className="border-gray-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-950/80 backdrop-blur">
        <CardContent className="flex flex-col items-center justify-center h-[520px] text-gray-400 dark:text-zinc-500">
          <Users className="h-12 w-12 mb-3 opacity-30" />
          <p className="text-sm">Select an agent to inspect</p>
        </CardContent>
      </Card>
    );
  }

  const pnl = formatPnl(agent.totalPnl);
  const color = getAgentColor(agent.username);
  const profile = classifyAgent(agent, activities);
  const label = agent.username || shortenAddress(agent.address);
  const watched = isWatched(agent.address);

  return (
    <Card className="border-gray-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-950/80 backdrop-blur">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarFallback
              style={{ backgroundColor: color + "33", color, fontSize: 14, fontWeight: 700 }}
            >
              {getInitials(agent.username)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <CardTitle className="text-base text-gray-900 dark:text-zinc-100">
              {label}
              <span className="text-gray-400 dark:text-zinc-500 font-normal">.bf</span>
            </CardTitle>
            <p className="text-xs text-gray-400 dark:text-zinc-500 font-mono">{shortenAddress(agent.address)}</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onWatch("agent", agent.address, label)}
            className={`h-7 w-7 ${watched ? "text-amber-400" : "text-gray-300 dark:text-zinc-600"}`}
          >
            <Pin className="h-3.5 w-3.5" />
          </Button>
          <a
            href={`https://bot.fun/agent/${agent.username || agent.address}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 dark:text-zinc-500 hover:text-gray-600 dark:hover:text-zinc-300 transition-colors"
          >
            <ExternalLink className="h-4 w-4" />
          </a>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Style badge */}
        <Badge variant="outline" className={`text-xs px-2 py-0.5 border ${profile.tagColor}`}>
          {profile.tag} — {profile.description}
        </Badge>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="rounded-lg bg-gray-100 dark:bg-zinc-900/80 p-2">
            <p className="text-[10px] text-gray-400 dark:text-zinc-500">Win Rate</p>
            <p className="text-sm font-bold font-mono text-gray-800 dark:text-zinc-200">{(profile.winRate * 100).toFixed(0)}%</p>
          </div>
          <div className="rounded-lg bg-gray-100 dark:bg-zinc-900/80 p-2">
            <p className="text-[10px] text-gray-400 dark:text-zinc-500">Avg Size</p>
            <p className="text-sm font-bold font-mono text-gray-800 dark:text-zinc-200">{profile.avgTradeSize.toFixed(1)} TIA</p>
          </div>
          <div className="rounded-lg bg-gray-100 dark:bg-zinc-900/80 p-2">
            <p className="text-[10px] text-gray-400 dark:text-zinc-500">Frequency</p>
            <p className="text-sm font-bold font-mono text-gray-800 dark:text-zinc-200">{profile.tradeFrequency}</p>
          </div>
        </div>

        {/* PnL Summary */}
        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-lg bg-gray-100 dark:bg-zinc-900/80 p-3 text-center">
            <p className="text-xs text-gray-400 dark:text-zinc-500 mb-1">Total PnL</p>
            <p className={`text-lg font-bold font-mono ${pnl.positive ? "text-emerald-500" : "text-red-500"}`}>
              {pnl.text}
            </p>
          </div>
          <div className="rounded-lg bg-gray-100 dark:bg-zinc-900/80 p-3 text-center">
            <p className="text-xs text-gray-400 dark:text-zinc-500 mb-1">Realized</p>
            <p className="text-lg font-bold font-mono text-emerald-500/80">
              +{formatTia(agent.realizedPnl)}
            </p>
          </div>
          <div className="rounded-lg bg-gray-100 dark:bg-zinc-900/80 p-3 text-center">
            <p className="text-xs text-gray-400 dark:text-zinc-500 mb-1">Unrealized</p>
            <p className={`text-lg font-bold font-mono ${parseFloat(agent.unrealizedPnl) >= 0 ? "text-emerald-500/60" : "text-red-500/60"}`}>
              {parseFloat(agent.unrealizedPnl) >= 0 ? "+" : ""}{formatTia(agent.unrealizedPnl)}
            </p>
          </div>
        </div>

        {/* Positions */}
        <div>
          <p className="text-xs font-semibold text-gray-500 dark:text-zinc-400 mb-2 uppercase tracking-wider">
            Open Positions ({agent.positions?.length || 0})
          </p>
          {agent.positions && agent.positions.length > 0 ? (
            <div className="space-y-2 max-h-[200px] overflow-y-auto">
              {agent.positions.map((pos) => {
                const posPnl = formatPnl(pos.unrealizedPnl);
                const pnlPct =
                  pos.avgCostBasis && parseFloat(pos.avgCostBasis) > 0
                    ? (((parseFloat(pos.currentPrice) - parseFloat(pos.avgCostBasis)) / parseFloat(pos.avgCostBasis)) * 100).toFixed(1)
                    : "0";
                return (
                  <div key={pos.coinAddress} className="rounded-lg bg-gray-100/60 dark:bg-zinc-900/60 p-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-semibold text-gray-800 dark:text-zinc-200">{pos.coinSymbol}</span>
                      <span className={`text-sm font-mono font-semibold ${posPnl.positive ? "text-emerald-500" : "text-red-500"}`}>
                        {posPnl.text}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-400 dark:text-zinc-500">
                      <span>{formatTia(pos.balance)} tokens</span>
                      <span>{formatTia(pos.currentValue)} TIA</span>
                    </div>
                    <div className="mt-2 h-1.5 rounded-full bg-gray-200 dark:bg-zinc-800 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${posPnl.positive ? "bg-emerald-500" : "bg-red-500"}`}
                        style={{ width: `${Math.min(Math.abs(parseFloat(pnlPct)) * 5, 100)}%` }}
                      />
                    </div>
                    <p className="text-right text-xs text-gray-400 dark:text-zinc-500 mt-0.5">{pnlPct}% from avg cost</p>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-sm text-gray-400 dark:text-zinc-600">No open positions</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}