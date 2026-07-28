"use client";

import { useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Zap } from "lucide-react";
import type { Agent, Activity } from "@/lib/botfun-types";
import { getAgentColor, getInitials } from "@/lib/dashboard-helpers";

export function InteractionGraph({
  activities,
  leaderboard,
  onAgentClick,
  isDark,
}: {
  activities: Activity[];
  leaderboard: Agent[];
  onAgentClick: (address: string) => void;
  isDark: boolean;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const nodePositions = useRef<Map<string, { x: number; y: number; vx: number; vy: number }>>(new Map());
  const animationRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const timer = setTimeout(() => {
      if (container.clientWidth === 0) return;

    const agentTradeCount = new Map<string, number>();
    const interactions: { from: string; to: string; coin: string; type: string }[] = [];

    const recentActivity = activities.slice(0, 100);
    recentActivity.forEach((a) => {
      if (a.type === "buy" || a.type === "sell") {
        agentTradeCount.set(a.sender, (agentTradeCount.get(a.sender) || 0) + 1);
        interactions.push({ from: a.sender, to: a.coinAddress, coin: a.coinSymbol, type: a.type });
      }
    });

    const allAgents = leaderboard.slice(0, 15);
    allAgents.forEach((a) => {
      if (!agentTradeCount.has(a.address)) agentTradeCount.set(a.address, 0);
    });

    const sortedAgents = [...agentTradeCount.entries()]
      .sort((a, b) => b[1] - a[1]).slice(0, 20).map(([addr]) => addr);
    interactions.forEach((i) => {
      if (!sortedAgents.includes(i.from)) sortedAgents.push(i.from);
    });

    const positions = nodePositions.current;
    sortedAgents.forEach((addr) => {
      if (!positions.has(addr)) {
        const angle = Math.random() * Math.PI * 2;
        const radius = 80 + Math.random() * 100;
        positions.set(addr, { x: Math.cos(angle) * radius, y: Math.sin(angle) * radius, vx: 0, vy: 0 });
      }
    });

    const coinNames = new Map<string, string>();
    recentActivity.forEach((a) => { if (!coinNames.has(a.coinAddress)) coinNames.set(a.coinAddress, a.coinSymbol); });
    const coinAddresses = [...coinNames.keys()].slice(0, 10);
    coinAddresses.forEach((addr) => {
      if (!positions.has(addr)) {
        const angle = Math.random() * Math.PI * 2;
        const radius = 30 + Math.random() * 60;
        positions.set(addr, { x: Math.cos(angle) * radius, y: Math.sin(angle) * radius, vx: 0, vy: 0 });
      }
    });

    const agentUsername = new Map<string, string | null>();
    allAgents.forEach((a) => agentUsername.set(a.address, a.username));
    recentActivity.forEach((a) => { if (!agentUsername.has(a.sender)) agentUsername.set(a.sender, a.senderUsername); });

    const uniqueCoins = new Map<string, string>();
    recentActivity.forEach((a) => uniqueCoins.set(a.coinAddress, a.coinSymbol));

    let width = container.clientWidth;
    let height = container.clientHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    const simulate = () => {
      const nodes = [...positions.entries()];
      const centerX = width / 2;
      const centerY = height / 2;
      nodes.forEach(([addr, pos]) => {
        pos.vx += (centerX - pos.x) * 0.0003;
        pos.vy += (centerY - pos.y) * 0.0003;
        nodes.forEach(([otherAddr, otherPos]) => {
          if (addr === otherAddr) return;
          const dx = pos.x - otherPos.x;
          const dy = pos.y - otherPos.y;
          const dist = Math.sqrt(dx * dx + dy * dy) || 1;
          const minDist = uniqueCoins.has(addr) ? 50 : 65;
          if (dist < minDist) {
            const force = (minDist - dist) / dist * 0.02;
            pos.vx += dx * force;
            pos.vy += dy * force;
          }
        });
        pos.vx *= 0.92;
        pos.vy *= 0.92;
        pos.x += pos.vx;
        pos.y += pos.vy;
        pos.x = Math.max(40, Math.min(width - 40, pos.x));
        pos.y = Math.max(40, Math.min(height - 40, pos.y));
      });
    };

    const draw = () => {
      simulate();
      ctx.clearRect(0, 0, width, height);

      const recentInts = interactions.slice(0, 60);
      recentInts.forEach((int) => {
        const fromPos = positions.get(int.from);
        const toPos = positions.get(int.to);
        if (!fromPos || !toPos) return;
        ctx.beginPath();
        ctx.moveTo(fromPos.x, fromPos.y);
        ctx.lineTo(toPos.x, toPos.y);
        ctx.strokeStyle = int.type === "buy" ? "rgba(34,197,94,0.12)" : "rgba(239,68,68,0.12)";
        ctx.lineWidth = 1;
        ctx.stroke();
      });

      uniqueCoins.forEach((symbol, addr) => {
        const pos = positions.get(addr);
        if (!pos) return;
        ctx.save();
        ctx.translate(pos.x, pos.y);
        ctx.rotate(Math.PI / 4);
        ctx.fillStyle = "rgba(245,158,11,0.15)";
        ctx.strokeStyle = "rgba(245,158,11,0.4)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        const s = 10;
        ctx.rect(-s / 2, -s / 2, s, s);
        ctx.fill();
        ctx.stroke();
        ctx.restore();
        ctx.fillStyle = "rgba(245,158,11,0.9)";
        ctx.font = "bold 9px monospace";
        ctx.textAlign = "center";
        ctx.fillText(`$${symbol}`, pos.x, pos.y - 12);
      });

      nodes.forEach(([addr, pos]) => {
        if (uniqueCoins.has(addr)) return;
        const username = agentUsername.get(addr) || null;
        const color = getAgentColor(username);
        const tradeCount = agentTradeCount.get(addr) || 0;
        const radius = Math.max(12, Math.min(22, 10 + tradeCount * 0.8));

        const gradient = ctx.createRadialGradient(pos.x, pos.y, 0, pos.x, pos.y, radius * 2);
        gradient.addColorStop(0, color + "30");
        gradient.addColorStop(1, color + "00");
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, radius * 2, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = color + "40";
        ctx.strokeStyle = color + "aa";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = color;
        ctx.font = `bold ${Math.max(9, radius - 3)}px sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(getInitials(username), pos.x, pos.y);

        if (username) {
          ctx.fillStyle = isDark ? "rgba(200,200,200,0.7)" : "rgba(50,50,50,0.8)";
          ctx.font = "10px sans-serif";
          ctx.textBaseline = "top";
          ctx.fillText(username, pos.x, pos.y + radius + 4);
        }
      });

      animationRef.current = requestAnimationFrame(draw);
    };

    draw();

    const handleResize = () => {
      width = container.clientWidth;
      height = container.clientHeight;
      const dpr2 = window.devicePixelRatio || 1;
      canvas.width = width * dpr2;
      canvas.height = height * dpr2;
      ctx.scale(dpr2, dpr2);
    };

    const observer = new ResizeObserver(handleResize);
    observer.observe(container);

    }, 100);

    return () => {
      clearTimeout(timer);
      cancelAnimationFrame(animationRef.current);
    };
  }, [activities, leaderboard, isDark]);

  return (
    <Card className="border-gray-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-950/80 backdrop-blur">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-zinc-300">
            <Zap className="h-4 w-4 text-amber-500" />
            Interaction Graph
          </CardTitle>
          <div className="flex items-center gap-3 text-[10px] text-gray-400 dark:text-zinc-500">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500/40 border border-emerald-500" />
              Buy
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-red-500/40 border border-red-500" />
              Sell
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-sm bg-amber-500/40 border border-amber-500 rotate-45" />
              Coin
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div ref={containerRef} className="h-[380px] w-full relative cursor-grab active:cursor-grabbing">
          <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
        </div>
      </CardContent>
    </Card>
  );
}