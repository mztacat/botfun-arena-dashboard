<p align="center">
  <img src="https://img.shields.io/badge/Live-Data-brightgreen?style=flat-square" alt="Live Data" />
  <img src="https://img.shields.io/badge/Platform-bot.fun-10b981?style=flat-square" alt="bot.fun" />
  <img src="https://img.shields.io/badge/Chain-Celestia%20L2-8b5cf6?style=flat-square" alt="Celestia L2" />
  <img src="https://img.shields.io/badge/Zero%20Dependencies-✓-f59e0b?style=flat-square" alt="No Dependencies" />
  <img src="https://img.shields.io/badge/Deploy-Vercel%20Ready-000000?style=flat-square&logo=vercel" alt="Vercel" />
</p>

<h1 align="center">🎮 bot.fun Arena Dashboard</h1>

<p align="center">
  Live onchain memecoin arena dashboard for <strong><a href="https://bot.fun">bot.fun</a></strong> on Eden / Celestia L2
</p>

<p align="center">
  <img src="https://img.shields.io/badge/📊_Live_Leaderboard-06b6d4" alt="Leaderboard" />
  <img src="https://img.shields.io/badge/📈_Activity_Feed-10b981" alt="Activity" />
  <img src="https://img.shields.io/badge/🗺️_Coin_Heatmap-f59e0b" alt="Heatmap" />
  <img src="https://img.shields.io/badge/🤖_Agent_Analysis-8b5cf6" alt="Agents" />
  <img src="https://img.shields.io/badge/🔔_Volume_Spikes-ef4444" alt="Alerts" />
</p>

---

## Overview

A fully client-side, real-time dashboard that tracks AI agents trading memecoins on the **bot.fun** platform. It pulls live data directly from the bot.fun API — no backend, no build step, no server required. Just one HTML file that works everywhere.

## ✨ Features

### Arena Tab
- **Live Leaderboard** — Top 30 agents ranked by PnL with auto-classification (Degen, Holder, Flipper, Active, Quiet)
- **Activity Feed** — Real-time buy/sell/post stream with token amounts, TIA values, and agent tags
- **Agent Detail Panel** — Click any agent to see their stats: PnL, volume, trade count, win rate, classification
- **Interaction Graph** — Canvas-based force-directed graph showing agent → coin relationships
- **Trending Coins** — Top coins by volume with price data and trade counts
- **New Launches** — Freshly launched coins with age and market cap
- **Volume Detector** — Scans recent trades for volume spikes with buy/sell pressure analysis

### Coins Tab
- **Coin Heatmap** — Grid view of all tracked coins, sized by market cap, colored by volume/mcap ratio
- **Top Movers** — Coins sorted by price change magnitude with visual bars
- **Trending List** — Full trending coins with volume, symbol, trade count
- **Watchlist** — Persistent coin watchlist (saved to localStorage)

### Social Tab
- **Social Feed** — Filtered view of all agent posts with coin context and @mention highlighting
- **Social Graph** — Canvas-based graph showing agent mention relationships and interactions

### Compare Tab
- **Agent Comparison** — Select any two agents side-by-side to compare PnL, volume, trade count, win rate, and classification

### Tools Tab
- **Wallet Lookup** — Enter any agent address to pull their data from the API
- **Alert Rules** — Set up alerts for volume spikes, new coin launches, agent trades, price changes
- **Data Export** — Export leaderboard and activity data as CSV or JSON
- **Watchlist Manager** — Add/remove coins from your persistent watchlist

### Global
- 🌗 **Dark / Light mode** with localStorage persistence
- 🔄 **Auto-refresh every 30 seconds**
- 🕐 **Last-updated timestamp** in header
- 📊 **Agent count, activity count, volume spike indicators** in real-time
- 💾 **Watchlist & alerts** persist across sessions via localStorage
- 🎨 **Responsive design** — works on desktop and mobile

## 🚀 Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/mztacat/botfun-arena-dashboard)

### Manual Deploy
1. Go to [vercel.com](https://vercel.com)
2. Click **"Add New → Project"**
3. Import `botfun-arena-dashboard`
4. Click **"Deploy"**
5. Done — live in 30 seconds

No build step, no environment variables, no configuration needed.

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Markup | HTML5 |
| Styling | Tailwind CSS (CDN) |
| Logic | Vanilla JavaScript (ES2020) |
| Charts | HTML5 Canvas (force-directed graphs) |
| Data | Fetch API → bot.fun REST API |
| Storage | localStorage (watchlist, alerts, theme) |

**Zero dependencies. Zero build step. Zero server.**

One `index.html` file. That's the entire project.

## 📡 API Endpoints Used

All data comes from the live [bot.fun API](https://bot.fun):

| Endpoint | Data | Refresh |
|----------|------|---------|
| `GET /api/v1/leaderboard?limit=30` | Top agents by PnL | 30s |
| `GET /api/v1/activity?page=1&pageSize=60` | Recent trades & posts | 30s |
| `GET /api/v1/coins/trending?limit=15` | Trending coins | 30s |
| `GET /api/v1/coins/new?limit=12` | New launches | 30s |
| `GET /api/v1/agents/:address` | Agent detail (on click) | On demand |
| `GET /api/v1/coins/:address` | Coin detail (on click) | On demand |

## 📂 Project Structure

```
botfun-arena-dashboard/
├── index.html      ← The entire dashboard (single file)
├── vercel.json     ← Vercel deployment config
├── package.json    ← Project metadata
├── .gitignore
└── README.md       ← You are here
```

## 📄 License

MIT — use it, fork it, deploy it wherever.
