"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { GitCompareArrows, X, Users } from "lucide-react";
import type { Agent, Activity } from "@/lib/botfun-types";
import { formatTia, formatPnl } from "@/lib/format";
import { getAgentColor, getInitials } from "@/lib/dashboard-helpers";
import { classifyAgent } from "@/lib/agent-classifier";

function calcWinRate(agent: Agent, activities: Activity[]): number {
  const buys = new Map<string, number>();
  const sells = new Map<string, number>();
  activities.filter(a => a.sender === agent.address && a.type === "buy").forEach(b => {
    buys.set(b.coinAddress, (buys.get(b.coinAddress) || 0) + parseFloat(b.tiaAmount || "0"));
  });
  activities.filter(a => a.sender === agent.address && a.type === "sell").forEach(s => {
    sells.set(s.coinAddress, (sells.get(s.coinAddress) || 0) + parseFloat(s.tiaAmount || "0"));
  });
  let wins = 0, total = 0;
  buys.forEach((cost, addr) => {
    const rev = sells.get(addr) || 0;
    if (rev > 0) { total++; if (rev > cost) wins++; }
  });
  return total > 0 ? wins / total : 0.5;
}

function findCommonCoins(a: Agent, b: Agent): string[] {
  const aCoins = new Set(a.positions?.map(p => p.coinSymbol) || []);
  const bCoins = new Set(b.positions?.map(p => p.coinSymbol) || []);
  return [...aCoins].filter(c => bCoins.has(c));
}

export function AgentComparison({ agents, activities }: { agents: Agent[]; activities: Activity[] }) {
  const [selected, setSelected] = useState<Agent[]>([]);

  const toggle = (agent: Agent) => {
    setSelected(prev => {
      if (prev.find(a => a.address === agent.address)) return prev.filter(a => a.address !== agent.address);
      if (prev.length >= 2) return prev;
      return [...prev, agent];
    });
  };

  if (selected.length < 2) {
    return (
      <Card className="border-gray-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-950/80 backdrop-blur">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-zinc-300">
            <GitCompareArrows className="h-4 w-4 text-violet-500" />
            Agent Comparison
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-xs text-gray-400 dark:text-zinc-500 mb-3">Select 2 agents to compare:</p>
          <div className="flex flex-wrap gap-1.5 max-h-[400px] overflow-y-auto">
            {agents.slice(0, 15).map(agent => {
              const isActive = selected.find(a => a.address === agent.address);
              return (
                <button
                  key={agent.address}
                  onClick={() => toggle(agent)}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? "bg-violet-500/20 text-violet-400 ring-1 ring-violet-500/40"
                      : "bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-zinc-400 hover:bg-gray-200 dark:hover:bg-zinc-700"
                  }`}
                >
                  <Avatar className="h-4 w-4">
                    <AvatarFallback style={{ backgroundColor: getAgentColor(agent.username) + "33", color: getAgentColor(agent.username), fontSize: 8 }}>
                      {getInitials(agent.username)}
                    </AvatarFallback>
                  </Avatar>
                  {agent.username}
                  {isActive && <X className="h-3 w-3" />}
                </button>
              );
            })}
          </div>
          {selected.length === 1 && (
            <p className="text-xs text-gray-400 dark:text-zinc-600 mt-3">1 selected — pick one more</p>
          )}
        </CardContent>
      </Card>
    );
  }

  const [a1, a2] = selected;
  const p1 = classifyAgent(a1, activities);
  const p2 = classifyAgent(a2, activities);
  const wr1 = calcWinRate(a1, activities);
  const wr2 = calcWinRate(a2, activities);
  const common = findCommonCoins(a1, a2);

  const StatBlock = ({ label, v1, v2 }: { label: string; v1: string; v2: string }) => (
    <div className="grid grid-cols-3 gap-1 text-center items-center">
      <span className="text-sm font-mono font-bold text-gray-800 dark:text-zinc-200">{v1}</span>
      <span className="text-[10px] text-gray-400 dark:text-zinc-500 font-medium uppercase">{label}</span>
      <span className="text-sm font-mono font-bold text-gray-800 dark:text-zinc-200">{v2}</span>
    </div>
  );

  return (
    <Card className="border-gray-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-950/80 backdrop-blur">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-zinc-300">
            <GitCompareArrows className="h-4 w-4 text-violet-500" />
            Agent Comparison
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={() => setSelected([])} className="h-7 text-xs text-gray-400 dark:text-zinc-500">
            Reset
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Agent headers */}
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="flex flex-col items-center gap-1">
            <Avatar className="h-10 w-10">
              <AvatarFallback style={{ backgroundColor: getAgentColor(a1.username) + "33", color: getAgentColor(a1.username), fontSize: 14, fontWeight: 700 }}>
                {getInitials(a1.username)}
              </AvatarFallback>
            </Avatar>
            <p className="text-sm font-bold text-gray-800 dark:text-zinc-200">{a1.username}</p>
            <Badge variant="outline" className={`text-[9px] border ${p1.tagColor}`}>{p1.tag}</Badge>
          </div>
          <div className="flex items-center justify-center">
            <span className="text-xs text-gray-400 dark:text-zinc-600 font-bold">VS</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <Avatar className="h-10 w-10">
              <AvatarFallback style={{ backgroundColor: getAgentColor(a2.username) + "33", color: getAgentColor(a2.username), fontSize: 14, fontWeight: 700 }}>
                {getInitials(a2.username)}
              </AvatarFallback>
            </Avatar>
            <p className="text-sm font-bold text-gray-800 dark:text-zinc-200">{a2.username}</p>
            <Badge variant="outline" className={`text-[9px] border ${p2.tagColor}`}>{p2.tag}</Badge>
          </div>
        </div>

        <div className="space-y-2 p-3 rounded-lg bg-gray-50 dark:bg-zinc-900/50">
          <StatBlock label="Total PnL" v1={formatPnl(a1.totalPnl).text} v2={formatPnl(a2.totalPnl).text} />
          <StatBlock label="Realized" v1={`+${formatTia(a1.realizedPnl)}`} v2={`+${formatTia(a2.realizedPnl)}`} />
          <StatBlock label="Win Rate" v1={`${(wr1 * 100).toFixed(0)}%`} v2={`${(wr2 * 100).toFixed(0)}%`} />
          <StatBlock label="Positions" v1={`${a1.positions?.length || 0}`} v2={`${a2.positions?.length || 0}`} />
          <StatBlock label="Trades" v1={`${a1.tradeCount || 0}`} v2={`${a2.tradeCount || 0}`} />
          <StatBlock label="Frequency" v1={p1.tradeFrequency} v2={p2.tradeFrequency} />
        </div>

        {common.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-gray-500 dark:text-zinc-400 mb-1.5 uppercase tracking-wider">Common Coins</p>
            <div className="flex flex-wrap gap-1.5">
              {common.map(s => (
                <Badge key={s} variant="outline" className="text-xs border-amber-500/30 text-amber-500">${s}</Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}