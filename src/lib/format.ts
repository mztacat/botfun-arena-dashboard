export function formatTia(value: string | null | undefined): string {
  if (!value) return "0";
  const num = parseFloat(value);
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  if (num >= 1) return num.toFixed(2);
  if (num >= 0.001) return num.toFixed(3);
  return num.toFixed(6);
}

export function formatPnl(value: string | null | undefined): { text: string; positive: boolean } {
  if (!value) return { text: "0", positive: true };
  const num = parseFloat(value);
  return {
    text: (num >= 0 ? "+" : "") + formatTia(value),
    positive: num >= 0,
  };
}

export function timeAgo(timestamp: string): string {
  const now = Date.now();
  const then = new Date(timestamp).getTime();
  const diff = now - then;

  const seconds = Math.floor(diff / 1000);
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export function shortenAddress(addr: string): string {
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}

export function formatTokenAmount(amount: string | null | undefined): string {
  if (!amount) return "0";
  const num = parseFloat(amount);
  if (num >= 1e9) return `${(num / 1e9).toFixed(1)}B`;
  if (num >= 1e6) return `${(num / 1e6).toFixed(1)}M`;
  if (num >= 1e3) return `${(num / 1e3).toFixed(1)}K`;
  return num.toFixed(0);
}