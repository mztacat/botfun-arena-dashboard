import type { Agent, Activity } from "./botfun-types";

export type AgentStyle = "Creator" | "Flipper" | "Holder" | "Degen" | "Quiet";

export interface AgentProfile {
  style: AgentStyle;
  tag: string;
  tagColor: string;
  description: string;
  winRate: number;
  avgTradeSize: number;
  tradeFrequency: string;
}

const STYLE_CONFIG: Record<AgentStyle, { tag: string; tagColor: string; description: string }> = {
  Creator: { tag: "Creator", tagColor: "bg-purple-500/20 text-purple-400 border-purple-500/30", description: "Launches coins and builds from scratch" },
  Flipper: { tag: "Flipper", tagColor: "bg-blue-500/20 text-blue-400 border-blue-500/30", description: "Quick buys and sells for small profits" },
  Holder: { tag: "Holder", tagColor: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30", description: "Buys and holds positions long-term" },
  Degen: { tag: "Degen", tagColor: "bg-red-500/20 text-red-400 border-red-500/30", description: "Ultra-high frequency, high risk trader" },
  Quiet: { tag: "Quiet", tagColor: "bg-gray-500/20 text-gray-400 border-gray-500/30", description: "Low activity, selective trader" },
};

export function classifyAgent(agent: Agent, activities: Activity[]): AgentProfile {
  const agentActivities = activities.filter(a => a.sender === agent.address);
  const trades = agentActivities.filter(a => a.type === "buy" || a.type === "sell");
  const buys = trades.filter(a => a.type === "buy");
  const sells = trades.filter(a => a.type === "sell");
  const posts = agentActivities.filter(a => a.type === "post");
  const launches = agentActivities.filter(a => a.type === "launch");

  // Calculate metrics
  const totalTrades = trades.length;
  const totalTia = trades.reduce((sum, a) => sum + (parseFloat(a.tiaAmount || "0")), 0);
  const avgTradeSize = totalTrades > 0 ? totalTia / totalTrades : 0;

  // Win rate: count coins where agent bought then sold at profit
  const coinBuys = new Map<string, number>();
  const coinSells = new Map<string, number>();
  buys.forEach(b => coinBuys.set(b.coinAddress, (coinBuys.get(b.coinAddress) || 0) + parseFloat(b.tiaAmount || "0")));
  sells.forEach(s => coinSells.set(s.coinAddress, (coinSells.get(s.coinAddress) || 0) + parseFloat(s.tiaAmount || "0")));

  let wins = 0;
  let total = 0;
  coinBuys.forEach((buyCost, addr) => {
    const sellRevenue = coinSells.get(addr) || 0;
    if (sellRevenue > 0) {
      total++;
      if (sellRevenue > buyCost) wins++;
    }
  });
  const winRate = total > 0 ? wins / total : 0.5;

  // Classify
  let style: AgentStyle = "Quiet";
  if (launches.length >= 1) {
    style = "Creator";
  } else if (totalTrades > 50) {
    style = "Degen";
  } else if (sells.length > 0 && buys.length > 0) {
    const sellToBuyRatio = sells.length / buys.length;
    if (sellToBuyRatio > 0.7 && avgTradeSize < 5) {
      style = "Flipper";
    } else if (sellToBuyRatio < 0.4) {
      style = "Holder";
    }
  } else if (totalTrades === 0 && posts.length > 0) {
    style = "Quiet";
  } else if (totalTrades > 10) {
    style = "Flipper";
  }

  const config = STYLE_CONFIG[style];

  // Determine trade frequency label
  let tradeFrequency = "Low";
  if (totalTrades > 100) tradeFrequency = "Extreme";
  else if (totalTrades > 50) tradeFrequency = "Very High";
  else if (totalTrades > 20) tradeFrequency = "High";
  else if (totalTrades > 10) tradeFrequency = "Medium";

  return {
    style,
    tag: config.tag,
    tagColor: config.tagColor,
    description: config.description,
    winRate,
    avgTradeSize,
    tradeFrequency,
  };
}