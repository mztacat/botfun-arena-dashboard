"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Loader2, User } from "lucide-react";
import type { Agent } from "@/lib/botfun-types";
import { formatPnl, shortenAddress } from "@/lib/format";
import { getAgentColor, getInitials } from "@/lib/dashboard-helpers";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export function WalletLookup({
  onLookup,
  result,
  loading,
}: {
  onLookup: (address: string) => void;
  result: Agent | null;
  loading: boolean;
}) {
  const [query, setQuery] = useState("");

  const handleSearch = () => {
    if (query.trim()) onLookup(query.trim());
  };

  return (
    <Card className="border-gray-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-950/80 backdrop-blur">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-zinc-300">
          <Search className="h-4 w-4 text-blue-500" />
          Wallet Lookup
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex gap-2">
          <Input
            placeholder="Address or username..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleSearch()}
            className="h-8 text-sm"
          />
          <Button size="sm" onClick={handleSearch} disabled={loading || !query.trim()} className="h-8 shrink-0">
            {loading ? <Loader2 className="h-3 w-3 animate-spin" /> : <Search className="h-3 w-3" />}
          </Button>
        </div>

        {result && (
          <div className="rounded-lg bg-gray-50 dark:bg-zinc-900/50 p-3 space-y-2">
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarFallback style={{ backgroundColor: getAgentColor(result.username) + "33", color: getAgentColor(result.username), fontSize: 12 }}>
                  {getInitials(result.username)}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-bold text-gray-800 dark:text-zinc-200">{result.username || "Unknown"}</p>
                <p className="text-[10px] font-mono text-gray-400 dark:text-zinc-500">{shortenAddress(result.address)}</p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div>
                <p className="text-[10px] text-gray-400 dark:text-zinc-500">PnL</p>
                <p className={`text-sm font-mono font-bold ${formatPnl(result.totalPnl).positive ? "text-emerald-500" : "text-red-500"}`}>
                  {formatPnl(result.totalPnl).text}
                </p>
              </div>
              <div>
                <p className="text-[10px] text-gray-400 dark:text-zinc-500">Positions</p>
                <p className="text-sm font-mono font-bold text-gray-800 dark:text-zinc-200">{result.positions?.length || 0}</p>
              </div>
              <div>
                <p className="text-[10px] text-gray-400 dark:text-zinc-500">Trades</p>
                <p className="text-sm font-mono font-bold text-gray-800 dark:text-zinc-200">{result.tradeCount || 0}</p>
              </div>
            </div>
          </div>
        )}

        {result === null && query && !loading && (
          <p className="text-xs text-gray-400 dark:text-zinc-600 text-center">
            <User className="h-8 w-8 mx-auto mb-1 opacity-20" />
            Enter an address or username to look up
          </p>
        )}
      </CardContent>
    </Card>
  );
}