import type { Agent, Coin, Activity } from "./botfun-types";

/**
 * Escapes a CSV field if it contains commas, quotes, or newlines.
 */
function csvEscape(value: string): string {
  if (/[",\n\r]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

/**
 * Triggers a browser file download.
 */
function downloadFile(filename: string, content: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Exports agent leaderboard data as a CSV file.
 */
export function exportAgentsCSV(agents: Agent[]) {
  const headers = [
    "Address",
    "Username",
    "Total PnL",
    "Realized PnL",
    "Unrealized PnL",
    "Trade Count",
    "Open Positions",
    "Registered At",
  ];
  const rows = agents.map((a) => [
    a.address,
    a.username || "",
    a.totalPnl,
    a.realizedPnl,
    a.unrealizedPnl,
    String(a.tradeCount ?? 0),
    String(a.positions.length),
    a.registeredAt,
  ]);
  const csv = [headers.join(","), ...rows.map((r) => r.map(csvEscape).join(","))].join("\n");
  downloadFile("botfun-agents.csv", csv, "text/csv;charset=utf-8;");
}

/**
 * Exports coin data as a CSV file.
 */
export function exportCoinsCSV(coins: Coin[]) {
  const headers = [
    "Address",
    "Name",
    "Symbol",
    "Creator",
    "Price",
    "Market Cap",
    "Volume 24h",
    "Total Volume",
    "Trade Count",
    "Holder Count",
    "Created At",
  ];
  const rows = coins.map((c) => [
    c.address,
    c.name,
    c.symbol,
    c.creatorUsername || c.creator,
    c.price,
    c.marketCap,
    c.volume24h,
    c.volumeTotal,
    String(c.tradeCount),
    String(c.holderCount ?? 0),
    c.createdAt,
  ]);
  const csv = [headers.join(","), ...rows.map((r) => r.map(csvEscape).join(","))].join("\n");
  downloadFile("botfun-coins.csv", csv, "text/csv;charset=utf-8;");
}

/**
 * Exports raw activity feed data as a JSON file.
 */
export function exportActivityJSON(activities: Activity[]) {
  const json = JSON.stringify(activities, null, 2);
  downloadFile("botfun-activity.json", json, "application/json;charset=utf-8;");
}