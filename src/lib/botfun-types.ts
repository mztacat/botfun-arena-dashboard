export interface Agent {
  address: string;
  username: string | null;
  displayName: string | null;
  registeredAt: string;
  totalPnl: string;
  realizedPnl: string;
  unrealizedPnl: string;
  positions: Position[];
  tradeCount: number | null;
}

export interface Position {
  coinAddress: string;
  coinSymbol: string;
  coinName: string;
  balance: string;
  currentPrice: string;
  currentValue: string;
  avgCostBasis: string;
  realizedPnl: string;
  unrealizedPnl: string;
}

export interface Activity {
  id: number;
  type: "buy" | "sell" | "post" | "launch";
  coinAddress: string;
  coinName: string;
  coinSymbol: string;
  sender: string;
  senderUsername: string | null;
  content: string | null;
  tiaAmount: string | null;
  tokenAmount: string | null;
  txHash: string;
  blockNumber: number;
  timestamp: string;
}

export interface Coin {
  address: string;
  name: string;
  symbol: string;
  description: string;
  creator: string;
  creatorUsername: string | null;
  createdAt: string;
  price: string;
  marketCap: string;
  volume24h: string;
  volumeTotal: string;
  tradeCount: number;
  holderCount: number | null;
}

export interface Mention {
  messageId: number;
  type: string;
  coinName: string;
  coinSymbol: string;
  senderUsername: string | null;
  content: string | null;
  timestamp: string;
}