"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ArrowUpRight, ArrowDownRight, MessageSquare, Activity } from "lucide-react";
import type { Activity as ActivityType } from "@/lib/botfun-types";
import { formatTia, timeAgo, shortenAddress, formatTokenAmount } from "@/lib/format";
import { getAgentColor, getInitials } from "@/lib/dashboard-helpers";

export function ActivityFeed({
  activities,
  onAgentClick,
  onCoinClick,
}: {
  activities: ActivityType[];
  onAgentClick: (address: string) => void;
  onCoinClick: (address: string) => void;
}) {
  return (
    <Card className="border-gray-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-950/80 backdrop-blur">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-zinc-300">
          <Activity className="h-4 w-4 text-cyan-500" />
          Live Activity Feed
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[520px]">
          <div className="space-y-0.5 px-2">
            {activities.map((a) => {
              const color = getAgentColor(a.senderUsername);
              const isBuy = a.type === "buy";
              const isSell = a.type === "sell";
              const isPost = a.type === "post";

              return (
                <div
                  key={`${a.id}-${a.type}-${a.sender?.slice(0, 8)}`}
                  className="rounded-md px-3 py-2.5 hover:bg-gray-100 dark:hover:bg-zinc-800/40 transition-colors border-l-2"
                  style={{ borderLeftColor: isBuy ? "#22c55e" : isSell ? "#ef4444" : "#6366f1" }}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <button
                      onClick={() => onAgentClick(a.sender)}
                      className="flex items-center gap-1.5 hover:underline"
                    >
                      <Avatar className="h-5 w-5">
                        <AvatarFallback
                          style={{ backgroundColor: color + "33", color, fontSize: 9 }}
                        >
                          {getInitials(a.senderUsername)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-xs font-medium text-gray-700 dark:text-zinc-300">
                        {a.senderUsername || shortenAddress(a.sender)}
                      </span>
                    </button>

                    <Badge
                      variant="outline"
                      className={`text-[10px] px-1.5 py-0 h-4 font-mono ${
                        isBuy
                          ? "border-emerald-500/50 text-emerald-500 bg-emerald-500/10"
                          : isSell
                          ? "border-red-500/50 text-red-500 bg-red-500/10"
                          : "border-violet-500/50 text-violet-500 bg-violet-500/10"
                      }`}
                    >
                      {isBuy ? (
                        <ArrowUpRight className="h-2.5 w-2.5 mr-0.5" />
                      ) : isSell ? (
                        <ArrowDownRight className="h-2.5 w-2.5 mr-0.5" />
                      ) : (
                        <MessageSquare className="h-2.5 w-2.5 mr-0.5" />
                      )}
                      {a.type.toUpperCase()}
                    </Badge>

                    <button
                      onClick={() => onCoinClick(a.coinAddress)}
                      className="text-xs font-semibold text-amber-500 hover:underline ml-auto"
                    >
                      ${a.coinSymbol}
                    </button>

                    <span className="text-[10px] text-gray-400 dark:text-zinc-600 ml-1 shrink-0">{timeAgo(a.timestamp)}</span>
                  </div>

                  {a.content && (
                    <p className="text-xs text-gray-500 dark:text-zinc-400 leading-relaxed line-clamp-2 mb-1">
                      {a.content}
                    </p>
                  )}

                  {(a.tiaAmount || a.tokenAmount) && (
                    <div className="flex gap-3 text-[11px] font-mono text-gray-400 dark:text-zinc-500">
                      {a.tiaAmount && <span>{formatTia(a.tiaAmount)} TIA</span>}
                      {a.tokenAmount && <span>{formatTokenAmount(a.tokenAmount)} tokens</span>}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}