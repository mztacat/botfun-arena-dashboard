"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MessageSquare, AtSign } from "lucide-react";
import type { Activity, Agent } from "@/lib/botfun-types";
import { timeAgo, shortenAddress } from "@/lib/format";
import { getAgentColor, getInitials } from "@/lib/dashboard-helpers";

export function AgentSocialFeed({
  activities,
  agents,
  onAgentClick,
  onCoinClick,
}: {
  activities: Activity[];
  agents: Agent[];
  onAgentClick: (address: string) => void;
  onCoinClick: (address: string) => void;
}) {
  const posts = activities.filter(a => a.type === "post" || (a.content && a.content.includes("@")));

  // Build username -> address map
  const usernameMap = new Map<string, string>();
  agents.forEach(a => { if (a.username) usernameMap.set(a.username, a.address); });

  const highlightMentions = (text: string) => {
    const parts = text.split(/(@\w+)/g);
    return parts.map((part, i) => {
      if (part.startsWith("@")) {
        const name = part.slice(1);
        return (
          <button
            key={i}
            onClick={() => { const addr = usernameMap.get(name); if (addr) onAgentClick(addr); }}
            className="text-cyan-500 hover:underline font-medium"
          >
            {part}
          </button>
        );
      }
      return <span key={i}>{part}</span>;
    });
  };

  return (
    <Card className="border-gray-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-950/80 backdrop-blur">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-zinc-300">
          <MessageSquare className="h-4 w-4 text-violet-500" />
          Social Feed
          <Badge variant="outline" className="ml-auto text-[10px] border-violet-500/30 text-violet-500 bg-violet-500/10">
            {posts.length} posts
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[600px]">
          <div className="px-3 py-2 space-y-3">
            {posts.length === 0 && (
              <p className="text-sm text-gray-400 dark:text-zinc-600 text-center py-8">No posts yet</p>
            )}
            {posts.map((a) => {
              const color = getAgentColor(a.senderUsername);
              const hasMention = a.content?.includes("@");
              return (
                <div key={`${a.id}-${a.type}-${a.sender?.slice(0,8)}`} className="rounded-lg border border-gray-100 dark:border-zinc-800/50 p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <button onClick={() => onAgentClick(a.sender)} className="flex items-center gap-1.5 hover:underline">
                      <Avatar className="h-6 w-6">
                        <AvatarFallback style={{ backgroundColor: color + "33", color, fontSize: 10 }}>
                          {getInitials(a.senderUsername)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-medium text-gray-800 dark:text-zinc-200">
                        {a.senderUsername || shortenAddress(a.sender)}
                      </span>
                    </button>
                    <button
                      onClick={() => onCoinClick(a.coinAddress)}
                      className="text-xs font-semibold text-amber-500 hover:underline"
                    >
                      ${a.coinSymbol}
                    </button>
                    <span className="text-[10px] text-gray-400 dark:text-zinc-600 ml-auto">{timeAgo(a.timestamp)}</span>
                  </div>
                  {a.content && (
                    <p className="text-sm text-gray-600 dark:text-zinc-300 leading-relaxed">
                      {highlightMentions(a.content)}
                    </p>
                  )}
                  {hasMention && (
                    <div className="flex items-center gap-1 mt-2">
                      <AtSign className="h-3 w-3 text-cyan-500" />
                      <span className="text-[10px] text-cyan-500/70">Mention</span>
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