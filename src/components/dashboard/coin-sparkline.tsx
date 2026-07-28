"use client";

interface SparklineProps {
  activities: { type: string; tiaAmount: string | null; timestamp: string }[];
  width?: number;
  height?: number;
}

export function CoinSparkline({ activities, width = 80, height = 24 }: SparklineProps) {
  const trades = activities.filter(a => a.type === "buy" || a.type === "sell");
  if (trades.length < 2) {
    return (
      <svg width={width} height={height} className="shrink-0">
        <line x1={0} y1={height / 2} x2={width} y2={height / 2} stroke="currentColor" strokeWidth={0.5} className="text-gray-300 dark:text-zinc-700" />
      </svg>
    );
  }

  // Build cumulative net TIA flow
  let cumulative = 0;
  const points: { x: number; y: number }[] = [];
  trades.forEach((t, i) => {
    const amount = parseFloat(t.tiaAmount || "0");
    if (t.type === "buy") cumulative += amount;
    else cumulative -= amount;
    points.push({ x: (i / (trades.length - 1)) * width, y: 0 });
  });

  const maxAbs = Math.max(...points.map(p => Math.abs(p.y)), 0.001);
  points.forEach(p => { p.y = height / 2 - (p.y / maxAbs) * (height / 2 - 2); });

  const isPositive = cumulative >= 0;
  const color = isPositive ? "#22c55e" : "#ef4444";
  const pathD = points.map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");

  return (
    <svg width={width} height={height} className="shrink-0">
      <line x1={0} y1={height / 2} x2={width} y2={height / 2} stroke="currentColor" strokeWidth={0.5} className="text-gray-200 dark:text-zinc-800" />
      <path d={pathD} fill="none" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}