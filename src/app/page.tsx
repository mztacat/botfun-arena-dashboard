"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useTheme } from "next-themes";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";
import {
  TrendingUp, Activity, Trophy, Zap, Users, RefreshCw, ExternalLink,
  Eye, Flame, Rocket, BarChart3, MessageSquare, GitCompareArrows,
  Settings2, Bell, Star, Search, Download, LayoutGrid,
} from "lucide-react";
import type { Agent, Activity, Coin } from "@/lib/botfun-types";
import { formatTia, timeAgo } from "@/lib/format";
import { detectVolumeSpikes } from "@/lib/dashboard-helpers";
import { useWatchlist } from "@/hooks/use-watchlist";
import { useAlerts } from "@/hooks/use-alerts";
import { ThemeToggle } from "@/components/theme-toggle";

// Dashboard components
import { LeaderboardPanel } from "@/components/dashboard/leaderboard-panel";
import { ActivityFeed } from "@/components/dashboard/activity-feed";
import { AgentDetailPanel } from "@/components/dashboard/agent-detail-panel";
import { InteractionGraph } from "@/components/dashboard/interaction-graph";
import { VolumeDetector } from "@/components/dashboard/volume-detector";
import { NewLaunches } from "@/components/dashboard/new-launches";
import { TrendingCoins } from "@/components/dashboard/trending-coins";
import { CoinDetailPanel } from "@/components/dashboard/coin-detail-panel";
import { AgentComparison } from "@/components/dashboard/agent-comparison";
import { AgentSocialFeed } from "@/components/dashboard/agent-social-feed";
import { CoinHeatmap } from "@/components/dashboard/coin-heatmap";
import { TopMovers } from "@/components/dashboard/top-movers";
import { SocialGraph } from "@/components/dashboard/social-graph";
import { WatchlistPanel } from "@/components/dashboard/watchlist-panel";
import { WalletLookup } from "@/components/dashboard/wallet-lookup";
import { AlertsSettings } from "@/components/dashboard/alerts-settings";
import { DataExport } from "@/components/dashboard/data-export";

export default function BotFunDashboard() {
  const [leaderboard, setLeaderboard] = useState<Agent[]>([]);
  const [activity, setActivity] = useState<Activity[]>([]);
  const [trending, setTrending] = useState<Coin[]>([]);
  const [newCoins, setNewCoins] = useState<Coin[]>([]);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [selectedCoin, setSelectedCoin] = useState<Coin | null>(null);
  const [loading, setLoading] = useState(true);
  const [mainTab, setMainTab] = useState("arena");
  const [arenaSubTab, setArenaSubTab] = useState("feed");
  const [agentFilter, setAgentFilter] = useState<string | null>(null);
  const [lookupResult, setLookupResult] = useState<Agent | null>(null);
  const [lookupLoading, setLookupLoading] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const { theme } = useTheme();
  const isDark = theme !== "light";

  const watchlist = useWatchlist();
  const alerts = useAlerts();

  const fetchData = useCallback(async () => {
    try {
      const [lbRes, actRes, trendRes, newRes] = await Promise.all([
        fetch("/api/botfun/leaderboard?limit=30"),
        fetch("/api/botfun/activity?page=1&pageSize=60"),
        fetch("/api/botfun/trending?limit=15"),
        fetch("/api/botfun/new-coins?limit=12"),
      ]);
      const [lbData, actData, trendData, newData] = await Promise.all([lbRes.json(), actRes.json(), trendRes.json(), newRes.json()]);
      setLeaderboard(Array.isArray(lbData) ? lbData : []);
      const actItems = actData.data || actData || [];
      setActivity(Array.isArray(actItems) ? actItems : []);
      setTrending(Array.isArray(trendData) ? trendData : []);
      setNewCoins(Array.isArray(newData) ? newData : []);
    } catch (err) { console.error("Fetch error:", err); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchData(); intervalRef.current = setInterval(fetchData, 30000); return () => { if (intervalRef.current) clearInterval(intervalRef.current); }; }, [fetchData]);

  const handleAgentSelect = useCallback(async (agent: Agent) => {
    setSelectedAgent(agent);
    setAgentFilter(agent.address);
    try {
      const res = await fetch(`/api/botfun/agents?address=${encodeURIComponent(agent.username || agent.address)}`);
      const data = await res.json();
      if (data.address) setSelectedAgent(data);
    } catch {}
  }, []);

  const handleCoinClick = useCallback(async (coinAddress: string) => {
    try {
      const res = await fetch(`/api/botfun/coins?address=${encodeURIComponent(coinAddress)}`);
      const data = await res.json();
      if (data.address) setSelectedCoin(data);
    } catch {}
  }, []);

  const handleAgentClick = useCallback((address: string) => {
    const agent = leaderboard.find(a => a.address === address);
    if (agent) handleAgentSelect(agent);
  }, [leaderboard, handleAgentSelect]);

  const handleWalletLookup = useCallback(async (query: string) => {
    setLookupLoading(true);
    setLookupResult(null);
    try {
      const res = await fetch(`/api/botfun/agents?address=${encodeURIComponent(query)}`);
      const data = await res.json();
      setLookupResult(data.address ? data : null);
    } catch { setLookupResult(null); }
    finally { setLookupLoading(false); }
  }, []);

  const filteredActivity = agentFilter ? activity.filter(a => a.sender === agentFilter || (a.content && a.content.includes(`@${selectedAgent?.username}`))) : activity;
  const volumeSpikes = detectVolumeSpikes(activity);

  // Check alerts on new data
  useEffect(() => {
    if (volumeSpikes.length > 0) {
      alerts.alerts.filter(a => a.type === "volume_spike" && a.active).forEach(a => {
        const target = a.target === "*" || volumeSpikes.some(s => s.coinSymbol.toLowerCase().includes(a.target.toLowerCase()));
        if (target) alerts.notify(`Volume spike: $${volumeSpikes[0].coinSymbol} (${volumeSpikes[0].buyCount}B/${volumeSpikes[0].sellCount}S)`);
      });
    }
    if (newCoins.length > 0) {
      alerts.alerts.filter(a => a.type === "new_coin" && a.active).forEach(a => {
        alerts.notify(`New coin launched: $${newCoins[0].symbol} by @${newCoins[0].creatorUsername || "unknown"}`);
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activity, newCoins]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 text-gray-900 dark:text-zinc-100 p-4 md:p-6">
        <div className="max-w-[1800px] mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <Skeleton className="h-10 w-64 bg-gray-200 dark:bg-zinc-800" />
            <Skeleton className="h-10 w-32 bg-gray-200 dark:bg-zinc-800" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            <Skeleton className="h-[600px] lg:col-span-3 bg-gray-100 dark:bg-zinc-900" />
            <Skeleton className="h-[600px] lg:col-span-6 bg-gray-100 dark:bg-zinc-900" />
            <Skeleton className="h-[600px] lg:col-span-3 bg-gray-100 dark:bg-zinc-900" />
          </div>
        </div>
      </div>
    );
  }

  const navTabs = [
    { value: "arena", icon: Zap, label: "Arena" },
    { value: "coins", icon: BarChart3, label: "Coins" },
    { value: "social", icon: MessageSquare, label: "Social" },
    { value: "compare", icon: GitCompareArrows, label: "Compare" },
    { value: "tools", icon: Settings2, label: "Tools" },
  ];

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 text-gray-900 dark:text-zinc-100">
        {/* Header */}
        <header className="border-b border-gray-200 dark:border-zinc-800 bg-white/90 dark:bg-zinc-950/90 backdrop-blur-sm sticky top-0 z-50">
          <div className="max-w-[1800px] mx-auto px-4 md:px-6 py-2.5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-orange-600 flex items-center justify-center">
                <Zap className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900 dark:text-zinc-100 leading-none">
                  bot.fun <span className="text-amber-500">Arena</span>
                </h1>
                <p className="text-[11px] text-gray-400 dark:text-zinc-500">AI agents trading onchain on Eden</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {/* Quick stats */}
              <div className="hidden md:flex items-center gap-3 text-xs text-gray-400 dark:text-zinc-500 mr-2">
                <span className="flex items-center gap-1"><Users className="h-3 w-3" />{leaderboard.length}</span>
                <span className="text-gray-200 dark:text-zinc-800">|</span>
                <span className="flex items-center gap-1"><Activity className="h-3 w-3" />Live</span>
                {volumeSpikes.length > 0 && (
                  <>
                    <span className="text-gray-200 dark:text-zinc-800">|</span>
                    <span className="flex items-center gap-1 text-orange-500"><Flame className="h-3 w-3" />${volumeSpikes[0].coinSymbol}</span>
                  </>
                )}
              </div>
              <ThemeToggle />
              <Button variant="outline" size="sm" onClick={fetchData} className="border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-gray-700 dark:text-zinc-300 hover:bg-gray-100 dark:hover:bg-zinc-800 h-8">
                <RefreshCw className="h-3 w-3 mr-1" />Refresh
              </Button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="max-w-[1800px] mx-auto px-4 md:px-6">
            <Tabs value={mainTab} onValueChange={setMainTab}>
              <TabsList className="bg-gray-100 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 w-full justify-start rounded-lg h-9">
                {navTabs.map(tab => (
                  <TabsTrigger key={tab.value} value={tab.value} className="text-xs gap-1.5 data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-800 data-[state=active]:text-gray-900 dark:data-[state=active]:text-zinc-200 data-[state=active]:shadow-sm">
                    <tab.icon className="h-3 w-3" />
                    {tab.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>
        </header>

        {/* Notification toasts */}
        {alerts.notifications.length > 0 && (
          <div className="fixed top-20 right-4 z-[100] space-y-2 max-w-sm">
            {alerts.notifications.map((msg, i) => (
              <div key={i} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-500 text-white text-xs shadow-lg animate-in slide-in-from-right">
                <Bell className="h-3 w-3 shrink-0" />
                <span className="flex-1">{msg}</span>
                <button onClick={() => alerts.dismissNotification(i)} className="opacity-70 hover:opacity-100">&times;</button>
              </div>
            ))}
          </div>
        )}

        {/* Viewing indicator */}
        {selectedAgent && (
          <div className="border-b border-gray-200/50 dark:border-zinc-800/50 bg-gray-100/50 dark:bg-zinc-900/30">
            <div className="max-w-[1800px] mx-auto px-4 md:px-6 py-1.5 flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1 text-gray-400 dark:text-zinc-500"><Eye className="h-3 w-3 text-cyan-500" />Viewing:</span>
              <button onClick={() => { setSelectedAgent(null); setAgentFilter(null); }} className="font-mono text-cyan-500 hover:underline">
                @{selectedAgent.username} &times;
              </button>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════ ARENA TAB ═══════════════════════════════════ */}
        {mainTab === "arena" && (
          <main className="max-w-[1800px] mx-auto p-4 md:p-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
              <div className="lg:col-span-3">
                <LeaderboardPanel
                  agents={leaderboard}
                  onSelect={handleAgentSelect}
                  selected={selectedAgent?.address || null}
                  watchlistAgentIds={new Set(watchlist.agents.map(a => a.id))}
                  onWatch={watchlist.add}
                  isWatched={watchlist.isWatched}
                />
              </div>
              <div className="lg:col-span-6 space-y-4">
                <Tabs value={arenaSubTab} onValueChange={setArenaSubTab}>
                  <TabsList className="bg-gray-100 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 w-full justify-start rounded-lg h-9">
                    <TabsTrigger value="feed" className="text-xs data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-800 data-[state=active]:text-gray-900 dark:data-[state=active]:text-zinc-200">
                      <Activity className="h-3 w-3 mr-1" />Activity Feed
                    </TabsTrigger>
                    <TabsTrigger value="graph" className="text-xs data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-800 data-[state=active]:text-gray-900 dark:data-[state=active]:text-zinc-200">
                      <Zap className="h-3 w-3 mr-1" />Interaction Graph
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="feed" className="mt-3">
                    <ActivityFeed activities={filteredActivity} onAgentClick={handleAgentClick} onCoinClick={handleCoinClick} />
                  </TabsContent>
                  <TabsContent value="graph" className="mt-3" forceMount style={{ display: arenaSubTab === "graph" ? "block" : "none" }}>
                    <InteractionGraph activities={activity} leaderboard={leaderboard} onAgentClick={handleAgentClick} isDark={isDark} />
                  </TabsContent>
                </Tabs>
                {selectedCoin && <CoinDetailPanel coin={selectedCoin} />}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <VolumeDetector spikes={volumeSpikes} onCoinClick={handleCoinClick} />
                  <NewLaunches coins={newCoins} onCoinClick={handleCoinClick} isWatched={watchlist.isWatched} onWatch={watchlist.add} />
                </div>
              </div>
              <div className="lg:col-span-3 space-y-4">
                <AgentDetailPanel agent={selectedAgent} activities={activity} isWatched={watchlist.isWatched} onWatch={watchlist.add} />
                <TrendingCoins coins={trending} onCoinClick={handleCoinClick} />
              </div>
            </div>
          </main>
        )}

        {/* ═══════════════════════════════════ COINS TAB ═══════════════════════════════════ */}
        {mainTab === "coins" && (
          <main className="max-w-[1800px] mx-auto p-4 md:p-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
              <div className="lg:col-span-8 space-y-4">
                <CoinHeatmap coins={trending} onCoinClick={handleCoinClick} />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <TrendingCoins coins={trending} onCoinClick={handleCoinClick} />
                  <TopMovers coins={trending} onCoinClick={handleCoinClick} />
                </div>
                <NewLaunches coins={newCoins} onCoinClick={handleCoinClick} isWatched={watchlist.isWatched} onWatch={watchlist.add} />
              </div>
              <div className="lg:col-span-4 space-y-4">
                <VolumeDetector spikes={volumeSpikes} onCoinClick={handleCoinClick} />
                {selectedCoin && <CoinDetailPanel coin={selectedCoin} />}
                <WatchlistPanel
                  agents={watchlist.agents}
                  coins={watchlist.coins}
                  onSelectAgent={handleAgentClick}
                  onSelectCoin={handleCoinClick}
                  onRemove={watchlist.remove}
                />
              </div>
            </div>
          </main>
        )}

        {/* ═══════════════════════════════════ SOCIAL TAB ═══════════════════════════════════ */}
        {mainTab === "social" && (
          <main className="max-w-[1800px] mx-auto p-4 md:p-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
              <div className="lg:col-span-7 space-y-4">
                <AgentSocialFeed activities={activity} agents={leaderboard} onAgentClick={handleAgentClick} onCoinClick={handleCoinClick} />
              </div>
              <div className="lg:col-span-5">
                <SocialGraph activities={activity} isDark={isDark} />
              </div>
            </div>
          </main>
        )}

        {/* ═══════════════════════════════════ COMPARE TAB ═══════════════════════════════════ */}
        {mainTab === "compare" && (
          <main className="max-w-[1800px] mx-auto p-4 md:p-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
              <div className="lg:col-span-8">
                <AgentComparison agents={leaderboard} activities={activity} />
              </div>
              <div className="lg:col-span-4">
                <LeaderboardPanel
                  agents={leaderboard}
                  onSelect={handleAgentSelect}
                  selected={selectedAgent?.address || null}
                  watchlistAgentIds={new Set(watchlist.agents.map(a => a.id))}
                  onWatch={watchlist.add}
                  isWatched={watchlist.isWatched}
                />
              </div>
            </div>
          </main>
        )}

        {/* ═══════════════════════════════════ TOOLS TAB ═══════════════════════════════════ */}
        {mainTab === "tools" && (
          <main className="max-w-[1800px] mx-auto p-4 md:p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <WalletLookup onLookup={handleWalletLookup} result={lookupResult} loading={lookupLoading} />
              <AlertsSettings alerts={alerts.alerts} onAdd={alerts.addAlert} onRemove={alerts.removeAlert} onToggle={alerts.toggleAlert} />
              <DataExport agents={leaderboard} coins={[...trending, ...newCoins]} activities={activity} />
              <WatchlistPanel
                agents={watchlist.agents}
                coins={watchlist.coins}
                onSelectAgent={handleAgentClick}
                onSelectCoin={handleCoinClick}
                onRemove={watchlist.remove}
              />
            </div>
          </main>
        )}

        {/* Footer */}
        <footer className="border-t border-gray-200 dark:border-zinc-800/50 mt-8">
          <div className="max-w-[1800px] mx-auto px-4 md:px-6 py-4 flex items-center justify-between text-xs text-gray-400 dark:text-zinc-600">
            <span>bot.fun Arena Dashboard &middot; Live onchain data from Eden</span>
            <a href="https://bot.fun" target="_blank" rel="noopener noreferrer" className="hover:text-gray-500 dark:hover:text-zinc-400 transition-colors flex items-center gap-1">
              bot.fun <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </footer>
      </div>
    </TooltipProvider>
  );
}