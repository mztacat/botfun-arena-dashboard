import type { Activity } from "./botfun-types";
import { timeAgo } from "./format";

export interface VolumeSpike {
  coinAddress: string;
  coinSymbol: string;
  coinName: string;
  spikeScore: number;
  buyCount: number;
  sellCount: number;
  totalTia: number;
  lastAction: string;
  agents: string[];
}

export function detectVolumeSpikes(activities: Activity[]): VolumeSpike[] {
  const window = activities.slice(0, 60);
  const coinEvents = new Map<string, { buys: number; sells: number; tia: number; agents: Set<string>; lastTs: string; name: string; symbol: string }>();

  window.forEach((a) => {
    if (a.type !== "buy" && a.type !== "sell") return;
    const existing = coinEvents.get(a.coinAddress) || {
      buys: 0, sells: 0, tia: 0, agents: new Set<string>(), lastTs: "", name: a.coinName, symbol: a.coinSymbol,
    };
    if (a.type === "buy") existing.buys++;
    else existing.sells++;
    if (a.tiaAmount) existing.tia += parseFloat(a.tiaAmount);
    if (a.senderUsername) existing.agents.add(a.senderUsername);
    if (!existing.lastTs || a.timestamp > existing.lastTs) existing.lastTs = a.timestamp;
    coinEvents.set(a.coinAddress, existing);
  });

  return [...coinEvents.entries()]
    .map(([addr, data]) => {
      const total = data.buys + data.sells;
      const agentDiversity = Math.min(data.agents.size / 3, 1) * 40;
      const volumeScore = Math.min(data.tia / 10, 1) * 30;
      const buyRatio = total > 0 ? (data.buys / total) * 30 : 0;
      const spikeScore = agentDiversity + volumeScore + buyRatio;
      return {
        coinAddress: addr,
        coinSymbol: data.symbol,
        coinName: data.name,
        spikeScore,
        buyCount: data.buys,
        sellCount: data.sells,
        totalTia: data.tia,
        lastAction: timeAgo(data.lastTs),
        agents: [...data.agents],
      };
    })
    .filter((s) => s.buyCount + s.sellCount >= 2)
    .sort((a, b) => b.spikeScore - a.spikeScore)
    .slice(0, 8);
}

const AGENT_COLORS: Record<string, string> = {};
const PALETTE = [
  "#f97316", "#06b6d4", "#a855f7", "#22c55e", "#ef4444",
  "#eab308", "#ec4899", "#14b8a6", "#f43f5e", "#8b5cf6",
  "#3b82f6", "#10b981", "#f59e0b", "#6366f1", "#84cc16",
];
let colorIdx = 0;

export function getAgentColor(username: string | null): string {
  const key = username || "unknown";
  if (!AGENT_COLORS[key]) {
    AGENT_COLORS[key] = PALETTE[colorIdx % PALETTE.length];
    colorIdx++;
  }
  return AGENT_COLORS[key];
}

export function getInitials(username: string | null): string {
  if (!username) return "?";
  const parts = username.split("_");
  return parts.map(p => p[0]).join("").slice(0, 2).toUpperCase();
}