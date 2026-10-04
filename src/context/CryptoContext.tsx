import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import {
  CryptoAsset,
  CandleData,
  OrderBook,
  TradeTick,
  Order,
  Position,
  PriceAlert,
  WalletAsset,
  WalletTransaction,
  VirtualCard,
  CardTransaction,
  P2POffer,
  UserProfile,
  TimeFrame,
  OrderSide,
  OrderType,
  EmailMessage,
  AdminSession,
} from '../types/crypto';
import { INITIAL_CRYPTO_ASSETS, INITIAL_P2P_OFFERS } from '../data/cryptoList';
import { generateCandles, generateOrderBook, generateInitialTrades, checkTriggeredAlerts } from '../services/marketData';

export type MainNavTab = 'markets' | 'trade' | 'ai' | 'wallet' | 'card' | 'p2p' | 'rewards' | 'education' | 'admin';

export interface ToastNotification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'alert' | 'broadcast';
  timestamp: number;
  recipient?: string;
}

interface CryptoContextType {
  // Navigation & View
  activeTab: MainNavTab;
  setActiveTab: (tab: MainNavTab) => void;
  currency: 'USD' | 'EUR' | 'GBP' | 'ETB';
  setCurrency: (currency: 'USD' | 'EUR' | 'GBP' | 'ETB') => void;
  currencyRate: number;
  formatCurrency: (amountInUsd: number) => string;

  // Assets & Real-time
  assets: CryptoAsset[];
  selectedAsset: CryptoAsset;
  setSelectedAsset: (asset: CryptoAsset) => void;
  timeframe: TimeFrame;
  setTimeframe: (tf: TimeFrame) => void;
  candles: CandleData[];
  orderBook: OrderBook;
  trades: TradeTick[];

  // Demo / Paper Trading
  paperBalance: number;
  orders: Order[];
  positions: Position[];
  tradeHistory: Order[];
  placeOrder: (params: {
    symbol: string;
    side: OrderSide;
    type: OrderType;
    price: number;
    amount: number;
    leverage: number;
    tp?: number;
    sl?: number;
  }) => { success: boolean; message: string };
  closePosition: (positionId: string) => void;
  cancelOrder: (orderId: string) => void;
  resetPaperBalance: () => void;

  // Price Alerts
  alerts: PriceAlert[];
  addAlert: (symbol: string, targetPrice: number, condition: 'above' | 'below', note?: string, sendEmail?: boolean) => void;
  deleteAlert: (alertId: string) => void;
  toggleAlertActive: (alertId: string) => void;

  // Multi-Crypto Wallet
  wallets: WalletAsset[];
  walletTransactions: WalletTransaction[];
  depositToWallet: (symbol: string, amount: number) => void;
  withdrawFromWallet: (symbol: string, amount: number, address: string, network: string) => { success: boolean; message: string };

  // Virtual Mastercard
  virtualCard: VirtualCard;
  cardTransactions: CardTransaction[];
  topUpCard: (amountUsd: number) => { success: boolean; message: string };
  toggleFreezeCard: () => void;
  updateCardLimits: (daily: number, monthly: number) => void;

  // P2P Marketplace
  p2pOffers: P2POffer[];
  executeP2PTrade: (offerId: string, cryptoAmount: number) => { success: boolean; message: string };

  // Rewards & Gamification
  userProfile: UserProfile;
  claimDailyStreak: () => void;
  addXp: (amount: number, reason: string) => void;
  setUserRole: (role: UserProfile['role']) => void;
  updateUserKyc: (status: UserProfile['kycStatus']) => void;

  // User Authentication
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  authModalMode: 'login' | 'register';
  setAuthModalMode: (mode: 'login' | 'register') => void;
  loginUser: (email: string, name?: string) => void;
  registerUser: (name: string, email: string, country?: string) => void;
  logoutUser: () => void;

  // Admin Authentication & Session
  adminSession: AdminSession;
  loginAdmin: (email: string, keyOrPass: string, token2Fa?: string) => { success: boolean; message: string };
  logoutAdmin: () => void;

  // Admin USDT Generator & Treasury
  adminTreasury: {
    vaultBalanceUsdt: number;
    totalMintedUsdt: number;
    liquidityPoolUsdt: number;
  };
  mintUsdt: (amount: number, destination: 'admin_vault' | 'user_wallet' | 'liquidity_pool') => { success: boolean; txHash: string };

  // Notifications & Broadcasts
  notifications: ToastNotification[];
  dismissNotification: (id: string) => void;
  clearAllNotifications: () => void;
  addNotification: (title: string, message: string, type?: ToastNotification['type']) => void;
  broadcastNotificationToAllUsers: (title: string, message: string, type?: ToastNotification['type'], sendEmailAlso?: boolean) => void;

  // Email Messages
  emails: EmailMessage[];
  sendEmailMessage: (recipientEmail: string, subject: string, body: string, category?: EmailMessage['category'], actionUrl?: string, actionLabel?: string) => void;
  broadcastEmailToAllUsers: (subject: string, body: string, category?: EmailMessage['category']) => void;
  markEmailAsRead: (emailId: string) => void;
  deleteEmail: (emailId: string) => void;

  // Real Trading Toggle
  isRealTradingMode: boolean;
  setIsRealTradingMode: (enabled: boolean) => void;
}

const CryptoContext = createContext<CryptoContextType | undefined>(undefined);

export const CryptoProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<MainNavTab>('markets');
  const [currency, setCurrency] = useState<'USD' | 'EUR' | 'GBP' | 'ETB'>('USD');
  const [isRealTradingMode, setIsRealTradingMode] = useState<boolean>(false);

  // Currency Exchange Rates
  const currencyRates: Record<'USD' | 'EUR' | 'GBP' | 'ETB', { symbol: string; rate: number }> = {
    USD: { symbol: '$', rate: 1.0 },
    EUR: { symbol: '€', rate: 0.92 },
    GBP: { symbol: '£', rate: 0.79 },
    ETB: { symbol: 'Br ', rate: 135.5 },
  };

  const currencyRate = currencyRates[currency].rate;

  const formatCurrency = useCallback((amountInUsd: number) => {
    const config = currencyRates[currency];
    const converted = amountInUsd * config.rate;
    if (Math.abs(converted) >= 1e9) {
      return `${config.symbol}${(converted / 1e9).toFixed(2)}B`;
    }
    if (Math.abs(converted) >= 1e6) {
      return `${config.symbol}${(converted / 1e6).toFixed(2)}M`;
    }
    if (Math.abs(converted) < 0.01 && converted > 0) {
      return `${config.symbol}${converted.toFixed(6)}`;
    }
    return `${config.symbol}${converted.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }, [currency]);

  // Market Assets
  const [assets, setAssets] = useState<CryptoAsset[]>(INITIAL_CRYPTO_ASSETS);
  const [selectedAsset, setSelectedAsset] = useState<CryptoAsset>(INITIAL_CRYPTO_ASSETS[0]);
  const [timeframe, setTimeframe] = useState<TimeFrame>('1D');
  const [candles, setCandles] = useState<CandleData[]>(() => generateCandles(INITIAL_CRYPTO_ASSETS[0].price, 50, 15));
  const [orderBook, setOrderBook] = useState<OrderBook>(() => generateOrderBook(INITIAL_CRYPTO_ASSETS[0].price));
  const [trades, setTrades] = useState<TradeTick[]>(() => generateInitialTrades(INITIAL_CRYPTO_ASSETS[0].price));

  // Paper Trading State
  const [paperBalance, setPaperBalance] = useState<number>(100000.0);
  const [orders, setOrders] = useState<Order[]>([]);
  const [positions, setPositions] = useState<Position[]>([]);
  const [tradeHistory, setTradeHistory] = useState<Order[]>([]);

  // Price Alerts
  const [alerts, setAlerts] = useState<PriceAlert[]>([
    {
      id: 'alert-btc-100k',
      symbol: 'BTC',
      targetPrice: 96000,
      condition: 'above',
      isTriggered: false,
      createdAt: Date.now() - 3600000,
      active: true,
      note: 'Breakout above $96k milestone',
    },
    {
      id: 'alert-eth-3200',
      symbol: 'ETH',
      targetPrice: 3200,
      condition: 'below',
      isTriggered: false,
      createdAt: Date.now() - 7200000,
      active: true,
      note: 'Dip buy zone near key support',
    },
  ]);

  // Multi-Crypto Wallets
  const [wallets, setWallets] = useState<WalletAsset[]>([
    {
      assetId: 'bitcoin',
      symbol: 'BTC',
      name: 'Bitcoin',
      icon: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png',
      balance: 1.25,
      available: 1.25,
      locked: 0,
      valueUsd: 1.25 * 94850,
      address: 'bc1q9v8t7z6m5n4k3j2h1g0f9e8d7c6b5a4xyz',
      networks: ['Bitcoin (Native SegWit)', 'Lightning Network'],
    },
    {
      assetId: 'ethereum',
      symbol: 'ETH',
      name: 'Ethereum',
      icon: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png',
      balance: 8.50,
      available: 8.50,
      locked: 0,
      valueUsd: 8.50 * 3345,
      address: '0x71C...8B39B2e',
      networks: ['Ethereum (ERC20)', 'Arbitrum One', 'Optimism', 'Base'],
    },
    {
      assetId: 'solana',
      symbol: 'SOL',
      name: 'Solana',
      icon: 'https://assets.coingecko.com/coins/images/4128/large/solana.png',
      balance: 45.0,
      available: 45.0,
      locked: 0,
      valueUsd: 45.0 * 218.4,
      address: '7XqP...9kL2',
      networks: ['Solana SPL'],
    },
    {
      assetId: 'tether',
      symbol: 'USDT',
      name: 'Tether USD',
      icon: 'https://assets.coingecko.com/coins/images/325/large/Tether.png',
      balance: 24500.0,
      available: 24500.0,
      locked: 0,
      valueUsd: 24500.0,
      address: 'TX9k7rB6yP2sL3mN8qW4vC1zH5jK9t',
      networks: ['TRC20 (Tron)', 'ERC20 (Ethereum)', 'BEP20 (BNB Chain)', 'Arbitrum'],
    },
  ]);

  const [walletTransactions, setWalletTransactions] = useState<WalletTransaction[]>([
    {
      id: 'tx-init-1',
      type: 'deposit',
      symbol: 'USDT',
      amount: 25000,
      valueUsd: 25000,
      txHash: '0x9fa837c41d8e4823812f8623719bca402',
      timestamp: Date.now() - 86400000,
      status: 'completed',
      source: 'External TRC20 Wallet',
    },
    {
      id: 'tx-init-2',
      type: 'deposit',
      symbol: 'BTC',
      amount: 1.25,
      valueUsd: 1.25 * 94850,
      txHash: '3a4f89d02c842b109e23819fa2810',
      timestamp: Date.now() - 43200000,
      status: 'completed',
      source: 'Cold Storage Vault',
    },
  ]);

  // Virtual Mastercard
  const [virtualCard, setVirtualCard] = useState<VirtualCard>({
    id: 'card-beget-001',
    cardNumber: '5354 8820 9142 6631',
    cardHolder: 'JOEL WONDI',
    expiryMonth: '11',
    expiryYear: '29',
    cvv: '842',
    isFrozen: false,
    balance: 2850.0,
    currency: 'USD',
    dailyLimit: 5000,
    monthlyLimit: 25000,
    spentThisMonth: 1145.20,
    contactlessEnabled: true,
    onlinePaymentsEnabled: true,
    tier: 'Black Elite',
  });

  const [cardTransactions, setCardTransactions] = useState<CardTransaction[]>([
    {
      id: 'ctx-1',
      merchant: 'Apple Store Inc.',
      category: 'Electronics',
      amount: 49.99,
      timestamp: Date.now() - 14400000,
      status: 'completed',
      logoIcon: 'apple',
    },
    {
      id: 'ctx-2',
      merchant: 'Spotify Premium',
      category: 'Entertainment',
      amount: 11.99,
      timestamp: Date.now() - 86400000,
      status: 'completed',
      logoIcon: 'music',
    },
    {
      id: 'ctx-3',
      merchant: 'Uber Rides & Eats',
      category: 'Transport',
      amount: 32.50,
      timestamp: Date.now() - 172800000,
      status: 'completed',
      logoIcon: 'car',
    },
  ]);

  // P2P Marketplace Offers
  const [p2pOffers, setP2pOffers] = useState<P2POffer[]>(INITIAL_P2P_OFFERS);

  // User Profile & Gamification
  const [userProfile, setUserProfile] = useState<UserProfile>({
    id: 'usr-92841',
    name: 'Joel Wondi',
    email: 'joelwondi24@gmail.com',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    role: 'super_admin', // Default to super_admin so user can test all features including USDT generator!
    kycStatus: 'verified',
    twoFactorEnabled: true,
    createdAt: '2024-01-15',
    xp: 2450,
    level: 4,
    badges: ['Pioneer', 'Alpha Trader', 'AI Analyst Pro', 'Streak Master'],
    streakDays: 7,
    lastClaimDate: '',
    country: 'United States',
    currency: 'USD',
    isAuthenticated: true,
  });

  // User Auth Modal State
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');

  // Admin Authentication Session
  const [adminSession, setAdminSession] = useState<AdminSession>({
    isAuthenticated: true,
    adminEmail: 'admin@beget.com',
    role: 'super_admin',
    lastLoginAt: Date.now(),
    sessionToken: 'ADMIN-SEC-ROOT',
  });

  // Admin Treasury & USDT Generator
  const [adminTreasury, setAdminTreasury] = useState({
    vaultBalanceUsdt: 5000000,
    totalMintedUsdt: 12500000,
    liquidityPoolUsdt: 7500000,
  });

  // Toast Notifications
  const [notifications, setNotifications] = useState<ToastNotification[]>([
    {
      id: 'notif-welcome',
      title: 'Welcome to Beget Trading',
      message: 'Demo balance of $100,000 USD is active. Explore live charts, AI Analyst, and Virtual Mastercard.',
      type: 'info',
      timestamp: Date.now(),
    },
  ]);

  // Email Messages State
  const [emails, setEmails] = useState<EmailMessage[]>([
    {
      id: 'email-welcome',
      sender: 'Beget Security Desk <security@beget.com>',
      recipientEmail: 'joelwondi24@gmail.com',
      subject: 'Welcome to Beget Crypto Trading Platform',
      body: `Hello Joel,\n\nWelcome to Beget — the AI-powered crypto terminal.\n\nYour account has been provisioned with:\n• $100,000 USD virtual demo trading margin\n• Beget Black Elite Virtual Mastercard\n• Multi-chain custodial sandbox addresses (BTC, ETH, SOL, USDT)\n• Full access to the Gemini 3.8 AI Crypto Analyst\n\nIf you have any questions or require support, reply directly or open a ticket in the Support Center.\n\nBest regards,\nThe Beget Team`,
      category: 'announcement',
      timestamp: Date.now() - 7200000,
      isRead: false,
      actionUrl: '/trade',
      actionLabel: 'Launch Trading Terminal',
    },
    {
      id: 'email-security',
      sender: 'Beget Alerts <alerts@beget.com>',
      recipientEmail: 'joelwondi24@gmail.com',
      subject: 'Security Notice: New Session Authorized',
      body: `A new session was authenticated for your Beget account from IP 192.168.1.1 (Desktop Web Applet). Two-factor authorization was successfully validated.\n\nIf this was not you, please immediately freeze your Virtual Mastercard and reset your password in the Security Center.`,
      category: 'security',
      timestamp: Date.now() - 3600000,
      isRead: true,
    },
  ]);

  const addNotification = useCallback((title: string, message: string, type: ToastNotification['type'] = 'info', recipient?: string) => {
    const newNotif: ToastNotification = {
      id: `toast-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      title,
      message,
      type,
      recipient,
      timestamp: Date.now(),
    };
    setNotifications(prev => [newNotif, ...prev.slice(0, 29)]);
  }, []);

  const sendEmailMessage = useCallback(
    (
      recipientEmail: string,
      subject: string,
      body: string,
      category: EmailMessage['category'] = 'alert',
      actionUrl?: string,
      actionLabel?: string
    ) => {
      const newEmail: EmailMessage = {
        id: `email-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        sender: 'Beget Notification Service <system@beget.com>',
        recipientEmail,
        subject,
        body,
        category,
        timestamp: Date.now(),
        isRead: false,
        actionUrl,
        actionLabel,
      };

      setEmails(prev => [newEmail, ...prev]);
      addNotification(
        `Email Dispatched: ${subject}`,
        `Message delivered to ${recipientEmail}. Check Email Messages in notifications drawer.`,
        'info'
      );
    },
    [addNotification]
  );

  const broadcastEmailToAllUsers = useCallback(
    (subject: string, body: string, category: EmailMessage['category'] = 'announcement') => {
      const newEmail: EmailMessage = {
        id: `email-bcast-${Date.now()}`,
        sender: 'Beget Global Broadcast <announcements@beget.com>',
        recipientEmail: 'All Registered Traders (Broadcast)',
        subject,
        body,
        category,
        timestamp: Date.now(),
        isRead: false,
      };
      setEmails(prev => [newEmail, ...prev]);
      addNotification(
        `Email Broadcast Sent to All Users`,
        `Subject: "${subject}" delivered to all platform member inboxes.`,
        'broadcast'
      );
    },
    [addNotification]
  );

  const broadcastNotificationToAllUsers = useCallback(
    (title: string, message: string, type: ToastNotification['type'] = 'broadcast', sendEmailAlso: boolean = true) => {
      const bcastNotif: ToastNotification = {
        id: `bcast-${Date.now()}`,
        title: `📢 ALL USERS ALERT: ${title}`,
        message,
        type,
        recipient: 'All Registered Users',
        timestamp: Date.now(),
      };
      setNotifications(prev => [bcastNotif, ...prev.slice(0, 29)]);

      if (sendEmailAlso) {
        broadcastEmailToAllUsers(`[ANNOUNCEMENT] ${title}`, message, 'announcement');
      }
    },
    [broadcastEmailToAllUsers]
  );

  const markEmailAsRead = useCallback((emailId: string) => {
    setEmails(prev => prev.map(e => (e.id === emailId ? { ...e, isRead: true } : e)));
  }, []);

  const deleteEmail = useCallback((emailId: string) => {
    setEmails(prev => prev.filter(e => e.id !== emailId));
  }, []);

  const dismissNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  // Update Candles and Orderbook when selected asset changes
  useEffect(() => {
    const count = timeframe === '1H' ? 40 : timeframe === '4H' ? 50 : 60;
    const interval = timeframe === '1H' ? 3 : timeframe === '4H' ? 15 : 60;
    setCandles(generateCandles(selectedAsset.price, count, interval));
    setOrderBook(generateOrderBook(selectedAsset.price));
    setTrades(generateInitialTrades(selectedAsset.price));
  }, [selectedAsset.id, timeframe]);

  // Real-time market tick engine
  useEffect(() => {
    const interval = setInterval(() => {
      setAssets(prevAssets => {
        const updated = prevAssets.map(asset => {
          // Dynamic realistic micro-tick (-0.15% to +0.15%)
          const tickDeltaPercent = (Math.random() - 0.495) * 0.003;
          const newPrice = Math.max(
            Number((asset.price * (1 + tickDeltaPercent)).toFixed(asset.price < 1 ? 6 : 2)),
            0.000001
          );

          const high24h = Math.max(asset.high24h, newPrice);
          const low24h = Math.min(asset.low24h, newPrice);
          const change24h = Number((asset.change24h + tickDeltaPercent * 10).toFixed(2));

          const sparkline = [...asset.sparkline.slice(1), newPrice];

          return {
            ...asset,
            price: newPrice,
            high24h,
            low24h,
            change24h,
            sparkline,
          };
        });

        // Trigger Alert Checks
        const { updatedAlerts, triggeredAlerts } = checkTriggeredAlerts(alerts, updated);
        if (triggeredAlerts.length > 0) {
          setAlerts(updatedAlerts);
          triggeredAlerts.forEach(alert => {
            addNotification(
              `Target Hit: ${alert.symbol} Price Alert`,
              `${alert.symbol} has crossed your threshold of $${alert.targetPrice.toLocaleString()} (${alert.condition.toUpperCase()}).`,
              'alert'
            );
            if (alert.sendEmail !== false) {
              sendEmailMessage(
                userProfile.email,
                `🚨 [PRICE ALERT] ${alert.symbol} hit target $${alert.targetPrice.toLocaleString()}`,
                `Hello ${userProfile.name},\n\nYour automated price alert for ${alert.symbol} has triggered!\n\n• Asset: ${alert.symbol}\n• Threshold: ${alert.condition === 'above' ? 'Rises Above' : 'Falls Below'} $${alert.targetPrice.toLocaleString()}\n• Trigger Time: ${new Date().toLocaleTimeString()}\n• User Note: ${alert.note || 'None'}\n\nReview your open positions and manage your orders on the Beget Trading Terminal.`,
                'alert',
                '/trade',
                'View Chart & Trade'
              );
            }
          });
        }

        return updated;
      });
    }, 1800);

    return () => clearInterval(interval);
  }, [alerts, addNotification]);

  // Keep selected asset in sync with real-time updates
  useEffect(() => {
    const current = assets.find(a => a.id === selectedAsset.id);
    if (current && current.price !== selectedAsset.price) {
      setSelectedAsset(current);
      // Append real-time trade tick
      const isBuy = Math.random() > 0.48;
      const newTrade: TradeTick = {
        id: `tick-${Date.now()}`,
        price: current.price,
        amount: Number((Math.random() * (current.price > 1000 ? 0.6 : 10) + 0.05).toFixed(current.price < 1 ? 1 : 4)),
        time: Date.now(),
        type: isBuy ? 'buy' : 'sell',
      };
      setTrades(prev => [newTrade, ...prev.slice(0, 24)]);
    }
  }, [assets, selectedAsset.id, selectedAsset.price]);

  // Re-calculate open position PnL against real-time prices
  useEffect(() => {
    if (positions.length === 0) return;
    const assetMap = new Map(assets.map(a => [a.symbol, a.price]));

    setPositions(prevPositions =>
      prevPositions.map(pos => {
        const markPrice = assetMap.get(pos.symbol) || pos.currentPrice;
        const priceDiff = pos.side === 'long' ? markPrice - pos.entryPrice : pos.entryPrice - markPrice;
        const pnl = Number((priceDiff * pos.amount * pos.leverage).toFixed(2));
        const pnlPercentage = Number(((pnl / pos.margin) * 100).toFixed(2));

        return {
          ...pos,
          currentPrice: markPrice,
          pnl,
          pnlPercentage,
        };
      })
    );
  }, [assets, positions.length]);

  // Paper Trading: Place Order
  const placeOrder = useCallback(
    ({
      symbol,
      side,
      type,
      price,
      amount,
      leverage,
      tp,
      sl,
    }: {
      symbol: string;
      side: OrderSide;
      type: OrderType;
      price: number;
      amount: number;
      leverage: number;
      tp?: number;
      sl?: number;
    }) => {
      const orderTotal = price * amount;
      const marginRequired = Number((orderTotal / leverage).toFixed(2));
      const fee = Number((orderTotal * 0.0005).toFixed(2)); // 0.05% fee

      if (marginRequired + fee > paperBalance) {
        return {
          success: false,
          message: `Insufficient demo balance. Margin required: $${marginRequired.toLocaleString()} | Available: $${paperBalance.toLocaleString()}`,
        };
      }

      // Deduct margin & fee from virtual balance
      setPaperBalance(prev => Number((prev - (marginRequired + fee)).toFixed(2)));

      const orderId = `ord-${Date.now()}`;
      const newOrder: Order = {
        id: orderId,
        symbol,
        type,
        side,
        price,
        amount,
        total: orderTotal,
        leverage,
        filled: type === 'market' ? amount : 0,
        status: type === 'market' ? 'filled' : 'open',
        timestamp: Date.now(),
        tp,
        sl,
      };

      if (type === 'market') {
        // Immediate fill into Position
        const liqFactor = 0.9 / leverage;
        const liquidationPrice =
          side === 'buy'
            ? Number((price * (1 - liqFactor)).toFixed(price < 1 ? 6 : 2))
            : Number((price * (1 + liqFactor)).toFixed(price < 1 ? 6 : 2));

        const newPosition: Position = {
          id: `pos-${Date.now()}`,
          symbol,
          side: side === 'buy' ? 'long' : 'short',
          entryPrice: price,
          currentPrice: price,
          amount,
          leverage,
          margin: marginRequired,
          pnl: 0,
          pnlPercentage: 0,
          liquidationPrice,
          tp,
          sl,
          timestamp: Date.now(),
        };

        setPositions(prev => [newPosition, ...prev]);
        setTradeHistory(prev => [newOrder, ...prev]);
        addNotification(
          'Simulated Order Filled',
          `${side.toUpperCase()} ${amount} ${symbol} @ $${price.toLocaleString()} executed successfully.`,
          'success'
        );
      } else {
        setOrders(prev => [newOrder, ...prev]);
        addNotification(
          'Limit Order Placed',
          `${side.toUpperCase()} ${amount} ${symbol} limit set at $${price.toLocaleString()}.`,
          'info'
        );
      }

      return { success: true, message: 'Order created successfully' };
    },
    [paperBalance, addNotification]
  );

  // Close Position
  const closePosition = useCallback(
    (positionId: string) => {
      const pos = positions.find(p => p.id === positionId);
      if (!pos) return;

      const payout = Number((pos.margin + pos.pnl).toFixed(2));
      setPaperBalance(prev => Number((prev + Math.max(payout, 0)).toFixed(2)));
      setPositions(prev => prev.filter(p => p.id !== positionId));

      addNotification(
        'Position Closed',
        `${pos.side.toUpperCase()} ${pos.symbol} closed. P&L: ${pos.pnl >= 0 ? '+' : ''}$${pos.pnl.toLocaleString()} (${pos.pnlPercentage}%)`,
        pos.pnl >= 0 ? 'success' : 'warning'
      );
    },
    [positions, addNotification]
  );

  // Cancel Order
  const cancelOrder = useCallback(
    (orderId: string) => {
      const order = orders.find(o => o.id === orderId);
      if (!order) return;

      const marginRefund = Number(((order.total / order.leverage) * 1.0005).toFixed(2));
      setPaperBalance(prev => Number((prev + marginRefund).toFixed(2)));
      setOrders(prev => prev.filter(o => o.id !== orderId));

      addNotification('Order Cancelled', `Limit order for ${order.amount} ${order.symbol} cancelled.`, 'info');
    },
    [orders, addNotification]
  );

  // Reset Demo Balance
  const resetPaperBalance = useCallback(() => {
    setPaperBalance(100000.0);
    setPositions([]);
    setOrders([]);
    addNotification('Demo Reset', 'Virtual trading account restored to $100,000 USD.', 'success');
  }, [addNotification]);

  // Price Alerts Management
  const addAlert = useCallback(
    (symbol: string, targetPrice: number, condition: 'above' | 'below', note?: string, sendEmail: boolean = true) => {
      const newAlert: PriceAlert = {
        id: `alert-${Date.now()}`,
        symbol,
        targetPrice,
        condition,
        isTriggered: false,
        createdAt: Date.now(),
        active: true,
        note,
        sendEmail,
      };
      setAlerts(prev => [newAlert, ...prev]);
      addNotification(
        'Price Alert Set',
        `We will notify you ${sendEmail ? `and send an email alert to ${userProfile.email} ` : ''}when ${symbol} moves ${condition} $${targetPrice.toLocaleString()}.`,
        'success'
      );
    },
    [addNotification, userProfile.email]
  );

  const deleteAlert = useCallback((alertId: string) => {
    setAlerts(prev => prev.filter(a => a.id !== alertId));
  }, []);

  const toggleAlertActive = useCallback((alertId: string) => {
    setAlerts(prev => prev.map(a => (a.id === alertId ? { ...a, active: !a.active } : a)));
  }, []);

  // Multi-Crypto Wallets Deposit / Withdraw
  const depositToWallet = useCallback(
    (symbol: string, amount: number) => {
      const currentAsset = assets.find(a => a.symbol === symbol);
      const price = currentAsset ? currentAsset.price : 1;

      setWallets(prev =>
        prev.map(w => {
          if (w.symbol === symbol) {
            const newBal = w.balance + amount;
            return {
              ...w,
              balance: newBal,
              available: newBal,
              valueUsd: Number((newBal * price).toFixed(2)),
            };
          }
          return w;
        })
      );

      const tx: WalletTransaction = {
        id: `tx-${Date.now()}`,
        type: 'deposit',
        symbol,
        amount,
        valueUsd: Number((amount * price).toFixed(2)),
        txHash: `0x${Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`,
        timestamp: Date.now(),
        status: 'completed',
        source: 'Simulated Network Node',
      };

      setWalletTransactions(prev => [tx, ...prev]);
      addNotification('Deposit Confirmed', `Successfully credited ${amount} ${symbol} to your wallet.`, 'success');
    },
    [assets, addNotification]
  );

  const withdrawFromWallet = useCallback(
    (symbol: string, amount: number, address: string, network: string) => {
      const wallet = wallets.find(w => w.symbol === symbol);
      if (!wallet || wallet.available < amount) {
        return { success: false, message: `Insufficient ${symbol} available balance.` };
      }

      const currentAsset = assets.find(a => a.symbol === symbol);
      const price = currentAsset ? currentAsset.price : 1;

      setWallets(prev =>
        prev.map(w => {
          if (w.symbol === symbol) {
            const newBal = w.balance - amount;
            return {
              ...w,
              balance: newBal,
              available: newBal,
              valueUsd: Number((newBal * price).toFixed(2)),
            };
          }
          return w;
        })
      );

      const tx: WalletTransaction = {
        id: `tx-${Date.now()}`,
        type: 'withdraw',
        symbol,
        amount,
        valueUsd: Number((amount * price).toFixed(2)),
        txHash: `0x${Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`,
        timestamp: Date.now(),
        status: 'completed',
        destination: `${address.slice(0, 6)}...${address.slice(-4)} (${network})`,
      };

      setWalletTransactions(prev => [tx, ...prev]);
      addNotification(
        'Withdrawal Broadcasted',
        `Transferred ${amount} ${symbol} via ${network}. TxHash confirmed.`,
        'success'
      );
      return { success: true, message: 'Withdrawal processed successfully' };
    },
    [wallets, assets, addNotification]
  );

  // Virtual Mastercard Top-Up & Freeze
  const topUpCard = useCallback(
    (amountUsd: number) => {
      const usdtWallet = wallets.find(w => w.symbol === 'USDT');
      if (!usdtWallet || usdtWallet.available < amountUsd) {
        return { success: false, message: 'Insufficient USDT in wallet to fund card.' };
      }

      // Deduct from USDT wallet
      setWallets(prev =>
        prev.map(w => {
          if (w.symbol === 'USDT') {
            const newBal = w.balance - amountUsd;
            return { ...w, balance: newBal, available: newBal, valueUsd: newBal };
          }
          return w;
        })
      );

      // Add to Card balance
      setVirtualCard(prev => ({
        ...prev,
        balance: Number((prev.balance + amountUsd).toFixed(2)),
      }));

      // Record transaction
      const cardTx: CardTransaction = {
        id: `ctx-${Date.now()}`,
        merchant: 'Wallet Top-up (USDT)',
        category: 'Funding',
        amount: amountUsd,
        timestamp: Date.now(),
        status: 'completed',
        logoIcon: 'wallet',
      };
      setCardTransactions(prev => [cardTx, ...prev]);

      addNotification('Card Funded', `Added $${amountUsd.toLocaleString()} to your Beget Virtual Mastercard.`, 'success');
      return { success: true, message: 'Card successfully funded' };
    },
    [wallets, addNotification]
  );

  const toggleFreezeCard = useCallback(() => {
    setVirtualCard(prev => {
      const nextFrozen = !prev.isFrozen;
      addNotification(
        nextFrozen ? 'Card Frozen' : 'Card Unfrozen',
        nextFrozen
          ? 'Your virtual card is temporarily locked against all charges.'
          : 'Your virtual card is active and ready for online payments.',
        nextFrozen ? 'warning' : 'success'
      );
      return { ...prev, isFrozen: nextFrozen };
    });
  }, [addNotification]);

  const updateCardLimits = useCallback((daily: number, monthly: number) => {
    setVirtualCard(prev => ({ ...prev, dailyLimit: daily, monthlyLimit: monthly }));
  }, []);

  // P2P Marketplace Trade Execution
  const executeP2PTrade = useCallback(
    (offerId: string, cryptoAmount: number) => {
      const offer = p2pOffers.find(o => o.id === offerId);
      if (!offer) return { success: false, message: 'Offer no longer available.' };

      if (cryptoAmount < offer.minLimit / offer.price || cryptoAmount > offer.maxLimit / offer.price) {
        return { success: false, message: 'Amount falls outside merchant order limits.' };
      }

      // Credit crypto to wallet if buying
      if (offer.type === 'buy') {
        depositToWallet(offer.cryptoSymbol, cryptoAmount);
      }

      addNotification(
        'P2P Escrow Completed',
        `Simulated trade of ${cryptoAmount} ${offer.cryptoSymbol} with merchant ${offer.merchantName} finalized successfully.`,
        'success'
      );

      return { success: true, message: 'P2P trade executed with escrow security.' };
    },
    [p2pOffers, depositToWallet, addNotification]
  );

  // Daily Streak Claim
  const claimDailyStreak = useCallback(() => {
    setUserProfile(prev => {
      const nextStreak = prev.streakDays + 1;
      const bonusXp = 100 * nextStreak;
      addNotification('Streak Claimed!', `Day ${nextStreak} streak active! Received +${bonusXp} XP.`, 'success');
      return {
        ...prev,
        streakDays: nextStreak,
        xp: prev.xp + bonusXp,
        level: Math.floor((prev.xp + bonusXp) / 1000) + 1,
        lastClaimDate: new Date().toISOString().split('T')[0],
      };
    });
  }, [addNotification]);

  const addXp = useCallback(
    (amount: number, reason: string) => {
      setUserProfile(prev => {
        const nextXp = prev.xp + amount;
        const nextLevel = Math.floor(nextXp / 1000) + 1;
        addNotification(`+${amount} XP Earned`, reason, 'success');
        return { ...prev, xp: nextXp, level: nextLevel };
      });
    },
    [addNotification]
  );

  const setUserRole = useCallback((role: UserProfile['role']) => {
    setUserProfile(prev => ({ ...prev, role }));
  }, []);

  const updateUserKyc = useCallback((status: UserProfile['kycStatus']) => {
    setUserProfile(prev => ({ ...prev, kycStatus: status }));
  }, []);

  // User Auth Implementation
  const loginUser = useCallback((email: string, name?: string) => {
    setUserProfile(prev => ({
      ...prev,
      email,
      name: name || (email.split('@')[0].toUpperCase()),
      isAuthenticated: true,
    }));
    addNotification('Login Successful', `Welcome back, ${email}!`, 'success');
  }, [addNotification]);

  const registerUser = useCallback((name: string, email: string, country?: string) => {
    setUserProfile(prev => ({
      ...prev,
      name,
      email,
      country: country || 'United States',
      isAuthenticated: true,
      createdAt: new Date().toISOString().split('T')[0],
      xp: 250,
      streakDays: 1,
    }));
    addNotification('Account Created!', `Welcome to Beget, ${name}! $100k demo margin credited.`, 'success');
  }, [addNotification]);

  const logoutUser = useCallback(() => {
    setUserProfile(prev => ({
      ...prev,
      isAuthenticated: false,
    }));
    addNotification('Logged Out', 'You have been safely signed out.', 'info');
  }, [addNotification]);

  // Admin Auth Implementation
  const loginAdmin = useCallback((email: string, keyOrPass: string, token2Fa?: string) => {
    const validEmails = ['admin@beget.com', 'joelwondi24@gmail.com', 'superadmin@beget.com'];
    const isAllowedEmail = validEmails.includes(email.toLowerCase()) || email.toLowerCase().includes('admin');

    if (!isAllowedEmail) {
      return { success: false, message: 'Unauthorized email. Administrator privileges required.' };
    }

    if (!keyOrPass || keyOrPass.length < 5) {
      return { success: false, message: 'Invalid Admin Security Key or Password.' };
    }

    const sessionToken = `ADMIN-SEC-${Date.now()}`;
    setAdminSession({
      isAuthenticated: true,
      adminEmail: email,
      role: 'super_admin',
      lastLoginAt: Date.now(),
      sessionToken,
    });

    setUserProfile(prev => ({ ...prev, role: 'super_admin' }));

    addNotification(
      'Super Admin Clearance Granted',
      `Admin Console unlocked for ${email}. Session ID: ${sessionToken}`,
      'success'
    );

    return { success: true, message: 'Access granted' };
  }, [addNotification]);

  const logoutAdmin = useCallback(() => {
    setAdminSession((prev: AdminSession) => ({
      ...prev,
      isAuthenticated: false,
      sessionToken: undefined,
    }));
    addNotification('Admin Session Locked', 'Security clearance revoked.', 'warning');
  }, [addNotification]);

  // Admin USDT Generator & Treasury Faucet
  // (Specifically requested: "on admin area create a USDT generarer genreatea usdt admin wallte, adds all wallet all cryptocurrencies, p2p card, reward, in admin part add usdt genraenter the move to ours wallet")
  const mintUsdt = useCallback(
    (amount: number, destination: 'admin_vault' | 'user_wallet' | 'liquidity_pool') => {
      const txHash = `0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`;

      setAdminTreasury(prev => {
        const totalMinted = prev.totalMintedUsdt + amount;
        if (destination === 'admin_vault') {
          return {
            ...prev,
            vaultBalanceUsdt: prev.vaultBalanceUsdt + amount,
            totalMintedUsdt: totalMinted,
          };
        } else if (destination === 'liquidity_pool') {
          return {
            ...prev,
            liquidityPoolUsdt: prev.liquidityPoolUsdt + amount,
            totalMintedUsdt: totalMinted,
          };
        } else {
          return {
            ...prev,
            totalMintedUsdt: totalMinted,
          };
        }
      });

      if (destination === 'user_wallet') {
        // Direct move into User Wallet
        setWallets(prev =>
          prev.map(w => {
            if (w.symbol === 'USDT') {
              const newBal = w.balance + amount;
              return { ...w, balance: newBal, available: newBal, valueUsd: newBal };
            }
            return w;
          })
        );
        addNotification(
          'USDT Minted & Transferred to Wallet',
          `Minted ${amount.toLocaleString()} USDT and credited directly to your User USDT Wallet! Tx: ${txHash.slice(0, 10)}...`,
          'success'
        );
      } else {
        addNotification(
          'USDT Generated by Admin',
          `Minted ${amount.toLocaleString()} USDT allocated to ${destination.replace('_', ' ').toUpperCase()}. Tx: ${txHash.slice(0, 10)}...`,
          'success'
        );
      }

      // Log to wallet transaction ledger
      const tx: WalletTransaction = {
        id: `mint-${Date.now()}`,
        type: 'admin_mint',
        symbol: 'USDT',
        amount,
        valueUsd: amount,
        txHash,
        timestamp: Date.now(),
        status: 'completed',
        destination: destination === 'user_wallet' ? 'User Tether Wallet' : 'Admin Reserve Vault',
      };
      setWalletTransactions(prev => [tx, ...prev]);

      return { success: true, txHash };
    },
    [addNotification]
  );

  return (
    <CryptoContext.Provider
      value={{
        activeTab,
        setActiveTab,
        currency,
        setCurrency,
        currencyRate,
        formatCurrency,
        assets,
        selectedAsset,
        setSelectedAsset,
        timeframe,
        setTimeframe,
        candles,
        orderBook,
        trades,
        paperBalance,
        orders,
        positions,
        tradeHistory,
        placeOrder,
        closePosition,
        cancelOrder,
        resetPaperBalance,
        alerts,
        addAlert,
        deleteAlert,
        toggleAlertActive,
        wallets,
        walletTransactions,
        depositToWallet,
        withdrawFromWallet,
        virtualCard,
        cardTransactions,
        topUpCard,
        toggleFreezeCard,
        updateCardLimits,
        p2pOffers,
        executeP2PTrade,
        userProfile,
        claimDailyStreak,
        addXp,
        setUserRole,
        updateUserKyc,
        isAuthModalOpen,
        setIsAuthModalOpen,
        authModalMode,
        setAuthModalMode,
        loginUser,
        registerUser,
        logoutUser,
        adminSession,
        loginAdmin,
        logoutAdmin,
        adminTreasury,
        mintUsdt,
        notifications,
        dismissNotification,
        clearAllNotifications,
        addNotification,
        broadcastNotificationToAllUsers,
        emails,
        sendEmailMessage,
        broadcastEmailToAllUsers,
        markEmailAsRead,
        deleteEmail,
        isRealTradingMode,
        setIsRealTradingMode,
      }}
    >
      {children}
    </CryptoContext.Provider>
  );
};

export const useCrypto = () => {
  const context = useContext(CryptoContext);
  if (!context) {
    throw new Error('useCrypto must be used within a CryptoProvider');
  }
  return context;
};
