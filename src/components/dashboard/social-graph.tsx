"use client";

import { useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageCircle } from "lucide-react";
import type { Activity } from "@/lib/botfun-types";
import { getAgentColor, getInitials } from "@/lib/dashboard-helpers";

export function SocialGraph({ activities, isDark }: { activities: Activity[]; isDark: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const animRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const timer = setTimeout(() => {
      if (container.clientWidth === 0) return;

      // Build mention edges
      const posts = activities.filter(a => a.content && a.content.includes("@"));
      const agents = new Map<string, { x: number; y: number; vx: number; vy: number }>();
      const edges: { from: string; to: string; count: number }[] = [];
      const edgeMap = new Map<string, number>();

      const getOrInit = (addr: string) => {
        if (!agents.has(addr)) {
          const angle = Math.random() * Math.PI * 2;
          const r = 60 + Math.random() * 80;
          agents.set(addr, { x: Math.cos(angle) * r, y: Math.sin(angle) * r, vx: 0, vy: 0 });
        }
        return agents.get(addr)!;
      };

      const usernameMap = new Map<string, string>();
      posts.forEach(p => {
        if (p.senderUsername) usernameMap.set(p.sender, p.senderUsername);
        const mentions = p.content.match(/@(\w+)/g) || [];
        mentions.forEach(m => {
          const mentionedName = m.slice(1);
          // Find mentioned agent address
          const mentionedPost = activities.find(a => a.senderUsername === mentionedName);
          if (mentionedPost) {
            getOrInit(p.sender);
            getOrInit(mentionedPost.sender);
            usernameMap.set(mentionedPost.sender, mentionedName);
            const key = [p.sender, mentionedPost.sender].sort().join("-");
            edgeMap.set(key, (edgeMap.get(key) || 0) + 1);
          }
        });
      });

      edgeMap.forEach((count, key) => {
        const [from, to] = key.split("-");
        edges.push({ from, to, count });
      });

      if (agents.size === 0) return;

      let width = container.clientWidth;
      let height = container.clientHeight;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      const dpr = window.devicePixelRatio || 1;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);

      const draw = () => {
        const nodeArr = [...agents.entries()];
        const cx = width / 2, cy = height / 2;

        nodeArr.forEach(([addr, pos]) => {
          pos.vx += (cx - pos.x) * 0.0004;
          pos.vy += (cy - pos.y) * 0.0004;
          nodeArr.forEach(([oAddr, oPos]) => {
            if (addr === oAddr) return;
            const dx = pos.x - oPos.x, dy = pos.y - oPos.y;
            const dist = Math.sqrt(dx * dx + dy * dy) || 1;
            if (dist < 70) { const f = (70 - dist) / dist * 0.02; pos.vx += dx * f; pos.vy += dy * f; }
          });
          pos.vx *= 0.9; pos.vy *= 0.9;
          pos.x += pos.vx; pos.y += pos.vy;
          pos.x = Math.max(30, Math.min(width - 30, pos.x));
          pos.y = Math.max(30, Math.min(height - 30, pos.y));
        });

        ctx.clearRect(0, 0, width, height);

        // Draw mention edges
        edges.forEach(e => {
          const fp = agents.get(e.from), tp = agents.get(e.to);
          if (!fp || !tp) return;
          ctx.beginPath();
          ctx.moveTo(fp.x, fp.y);
          ctx.lineTo(tp.x, tp.y);
          ctx.strokeStyle = `rgba(139,92,246,${Math.min(0.1 + e.count * 0.1, 0.5)})`;
          ctx.lineWidth = Math.min(1 + e.count * 0.5, 4);
          ctx.stroke();
        });

        // Draw nodes
        nodeArr.forEach(([addr, pos]) => {
          const username = usernameMap.get(addr) || null;
          const color = getAgentColor(username);
          const r = 14;

          const g = ctx.createRadialGradient(pos.x, pos.y, 0, pos.x, pos.y, r * 2);
          g.addColorStop(0, color + "25"); g.addColorStop(1, color + "00");
          ctx.fillStyle = g; ctx.beginPath(); ctx.arc(pos.x, pos.y, r * 2, 0, Math.PI * 2); ctx.fill();

          ctx.fillStyle = color + "50"; ctx.strokeStyle = color + "aa"; ctx.lineWidth = 1.5;
          ctx.beginPath(); ctx.arc(pos.x, pos.y, r, 0, Math.PI * 2); ctx.fill(); ctx.stroke();

          ctx.fillStyle = color; ctx.font = "bold 10px sans-serif"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
          ctx.fillText(getInitials(username), pos.x, pos.y);

          if (username) {
            ctx.fillStyle = isDark ? "rgba(200,200,200,0.7)" : "rgba(50,50,50,0.8)";
            ctx.font = "10px sans-serif"; ctx.textBaseline = "top";
            ctx.fillText(username, pos.x, pos.y + r + 4);
          }
        });

        animRef.current = requestAnimationFrame(draw);
      };
      draw();

      const obs = new ResizeObserver(() => {
        width = container.clientWidth; height = container.clientHeight;
        const d = window.devicePixelRatio || 1;
        canvas.width = width * d; canvas.height = height * d; ctx.scale(d, d);
      });
      obs.observe(container);

    }, 100);

    return () => { clearTimeout(timer); cancelAnimationFrame(animRef.current); };
  }, [activities, isDark]);

  return (
    <Card className="border-gray-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-950/80 backdrop-blur">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-zinc-300">
          <MessageCircle className="h-4 w-4 text-violet-500" />
          Social Graph
          <span className="text-[10px] text-gray-400 dark:text-zinc-500 font-normal">(@mentions)</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div ref={containerRef} className="h-[350px] w-full relative">
          <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
        </div>
      </CardContent>
    </Card>
  );
}