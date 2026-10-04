export type TimeFrame = '1H' | '4H' | '1D' | '1W' | '1M' | '1Y' | 'ALL';

export type CryptoCategory = 
  | 'All' 
  | 'Trending' 
  | 'Top Gainers' 
  | 'Top Losers' 
  | 'Layer 1' 
  | 'Layer 2' 
  | 'DeFi' 
  | 'AI' 
  | 'Gaming' 
  | 'Meme' 
  | 'Stablecoins';

export interface CryptoAsset {
  id: string;
  symbol: string;
  name: string;
  icon: string;
  price: number;
  change24h: number;
  high24h: number;
  low24h: number;
  volume24h: number;
  marketCap: number;
  circulatingSupply: number;
  maxSupply: number | null;
  category: CryptoCategory[];
  sparkline: number[];
  rank: number;
  description: string;
}

export interface CandleData {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface OrderBookLevel {
  price: number;
  amount: number;
  total: number;
}

export interface OrderBook {
  bids: OrderBookLevel[];
  asks: OrderBookLevel[];
}

export interface TradeTick {
  id: string;
  price: number;
  amount: number;
  time: number;
  type: 'buy' | 'sell';
}

export type OrderType = 'market' | 'limit' | 'stop_limit';
export type OrderSide = 'buy' | 'sell';
export type OrderStatus = 'open' | 'filled' | 'cancelled';

export interface Order {
  id: string;
  symbol: string;
  type: OrderType;
  side: OrderSide;
  price: number;
  amount: number;
  total: number;
  leverage: number;
  filled: number;
  status: OrderStatus;
  timestamp: number;
  tp?: number;
  sl?: number;
}

export interface Position {
  id: string;
  symbol: string;
  side: 'long' | 'short';
  entryPrice: number;
  currentPrice: number;
  amount: number;
  leverage: number;
  margin: number;
  pnl: number;
  pnlPercentage: number;
  liquidationPrice: number;
  tp?: number;
  sl?: number;
  timestamp: number;
}

export interface PriceAlert {
  id: string;
  symbol: string;
  targetPrice: number;
  condition: 'above' | 'below';
  isTriggered: boolean;
  createdAt: number;
  triggeredAt?: number;
  active: boolean;
  note?: string;
  sendEmail?: boolean;
}

export interface EmailMessage {
  id: string;
  sender: string;
  recipientEmail: string;
  subject: string;
  body: string;
  category: 'alert' | 'security' | 'announcement' | 'trade' | 'treasury';
  timestamp: number;
  isRead: boolean;
  actionUrl?: string;
  actionLabel?: string;
}

export interface WalletAsset {
  assetId: string;
  symbol: string;
  name: string;
  icon: string;
  balance: number;
  available: number;
  locked: number;
  valueUsd: number;
  address: string;
  networks: string[];
}

export interface WalletTransaction {
  id: string;
  type: 'deposit' | 'withdraw' | 'trade' | 'card_spend' | 'card_topup' | 'admin_mint' | 'p2p';
  symbol: string;
  amount: number;
  valueUsd: number;
  txHash: string;
  timestamp: number;
  status: 'completed' | 'pending' | 'failed';
  destination?: string;
  source?: string;
}

export interface VirtualCard {
  id: string;
  cardNumber: string;
  cardHolder: string;
  expiryMonth: string;
  expiryYear: string;
  cvv: string;
  isFrozen: boolean;
  balance: number; // in USD
  currency: string;
  dailyLimit: number;
  monthlyLimit: number;
  spentThisMonth: number;
  contactlessEnabled: boolean;
  onlinePaymentsEnabled: boolean;
  tier: 'Standard' | 'Black Elite' | 'Founder Metal';
}

export interface CardTransaction {
  id: string;
  merchant: string;
  category: string;
  amount: number;
  timestamp: number;
  status: 'completed' | 'declined';
  logoIcon: string;
}

export interface P2POffer {
  id: string;
  type: 'buy' | 'sell';
  cryptoSymbol: 'USDT' | 'BTC' | 'ETH';
  fiatSymbol: 'USD' | 'EUR' | 'GBP' | 'ETB' | 'KES';
  price: number;
  availableAmount: number;
  minLimit: number;
  maxLimit: number;
  merchantName: string;
  merchantAvatar: string;
  merchantOrders: number;
  completionRate: number;
  isVerified: boolean;
  paymentMethods: string[];
  terms: string;
}

export interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  source: string;
  url: string;
  timeAgo: string;
  category: string;
  sentiment: 'bullish' | 'bearish' | 'neutral';
  relatedCoins: string[];
  aiAnalysis?: string;
}

export interface AIAnalysisReport {
  symbol: string;
  price: number;
  change24h: number;
  timestamp: number;
  summary: string;
  trend: 'Bullish' | 'Bearish' | 'Neutral' | 'Strong Bullish' | 'High Volatility';
  sentimentScore: number; // 0 to 100
  supportLevels: number[];
  resistanceLevels: number[];
  bullishCatalysts: string[];
  bearishRisks: string[];
  technicalIndicators: {
    rsi14: number;
    rsiCondition: 'Oversold' | 'Neutral' | 'Overbought';
    macd: string;
    emaTrend: string;
    bollingerStatus: string;
  };
  keyTakeaway: string;
  disclaimer: string;
}

export type UserRole = 'super_admin' | 'admin' | 'support' | 'analyst' | 'user';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: UserRole;
  kycStatus: 'unverified' | 'pending' | 'verified' | 'rejected';
  twoFactorEnabled: boolean;
  createdAt: string;
  xp: number;
  level: number;
  badges: string[];
  streakDays: number;
  lastClaimDate?: string;
  country: string;
  currency: 'USD' | 'EUR' | 'GBP' | 'ETB';
  isAuthenticated: boolean;
}

export interface AdminSession {
  isAuthenticated: boolean;
  adminEmail: string;
  role: UserRole;
  lastLoginAt?: number;
  sessionToken?: string;
}

export interface LeaderboardUser {
  rank: number;
  name: string;
  avatar: string;
  pnlTotal: number;
  roiPercentage: number;
  winRate: number;
  tradesCount: number;
  badge: string;
}
