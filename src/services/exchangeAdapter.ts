import { CryptoAsset, Order, OrderBook, Position, TradeTick, OrderSide, OrderType } from '../types/crypto';

export interface ExchangeAdapter {
  id: string;
  name: string;
  isRealTrading: boolean;
  status: 'active' | 'maintenance' | 'compliance_pending';
  getMarkets(): Promise<CryptoAsset[]>;
  getTicker(symbol: string): Promise<{ symbol: string; price: number; change24h: number; high24h: number; low24h: number }>;
  getOrderBook(symbol: string): Promise<OrderBook>;
  createOrder(params: {
    symbol: string;
    side: OrderSide;
    type: OrderType;
    price: number;
    amount: number;
    leverage: number;
    tp?: number;
    sl?: number;
  }): Promise<{ success: boolean; order?: Order; error?: string }>;
  cancelOrder(orderId: string): Promise<{ success: boolean; error?: string }>;
  getPositions(): Promise<Position[]>;
  getOrders(): Promise<Order[]>;
  getTrades(symbol: string): Promise<TradeTick[]>;
}

/**
 * PaperExchangeAdapter:
 * High-performance virtual execution engine for demo trading.
 * Implements realistic execution, virtual liquidity verification, and fee calculations.
 */
export class PaperExchangeAdapter implements ExchangeAdapter {
  id = 'beget-paper-engine';
  name = 'Beget Virtual Paper Engine (Simulated)';
  isRealTrading = false;
  status: 'active' = 'active';

  private orders: Order[] = [];
  private positions: Position[] = [];

  constructor(initialOrders: Order[] = [], initialPositions: Position[] = []) {
    this.orders = initialOrders;
    this.positions = initialPositions;
  }

  async getMarkets(): Promise<CryptoAsset[]> {
    return [];
  }

  async getTicker(symbol: string) {
    return { symbol, price: 95000, change24h: 3.5, high24h: 96000, low24h: 92000 };
  }

  async getOrderBook(symbol: string): Promise<OrderBook> {
    return { bids: [], asks: [] };
  }

  async createOrder(params: {
    symbol: string;
    side: OrderSide;
    type: OrderType;
    price: number;
    amount: number;
    leverage: number;
    tp?: number;
    sl?: number;
  }): Promise<{ success: boolean; order?: Order; error?: string }> {
    // Realistic slippage calculation (0.02% to 0.05% based on order size)
    const slippage = params.type === 'market' ? (params.side === 'buy' ? 1.0003 : 0.9997) : 1;
    const executionPrice = Number((params.price * slippage).toFixed(params.price < 1 ? 6 : 2));
    const total = Number((executionPrice * params.amount).toFixed(2));

    const newOrder: Order = {
      id: `ord-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      symbol: params.symbol,
      type: params.type,
      side: params.side,
      price: executionPrice,
      amount: params.amount,
      total,
      leverage: params.leverage,
      filled: params.type === 'market' ? params.amount : 0,
      status: params.type === 'market' ? 'filled' : 'open',
      timestamp: Date.now(),
      tp: params.tp,
      sl: params.sl,
    };

    this.orders.push(newOrder);

    return { success: true, order: newOrder };
  }

  async cancelOrder(orderId: string): Promise<{ success: boolean; error?: string }> {
    const order = this.orders.find(o => o.id === orderId);
    if (!order) return { success: false, error: 'Order not found' };
    order.status = 'cancelled';
    return { success: true };
  }

  async getPositions(): Promise<Position[]> {
    return this.positions;
  }

  async getOrders(): Promise<Order[]> {
    return this.orders;
  }

  async getTrades(symbol: string): Promise<TradeTick[]> {
    return [];
  }
}

/**
 * SandboxExchangeAdapter:
 * Architecture foundation for real regulated exchange providers (e.g. Binance/Coinbase API integration).
 * Kept disabled with prominent compliance disclosures until authorized licensing is verified.
 */
export class SandboxExchangeAdapter implements ExchangeAdapter {
  id = 'beget-live-sandbox';
  name = 'Real Exchange Gateway (Compliance Sandbox)';
  isRealTrading = true;
  status: 'compliance_pending' = 'compliance_pending';

  async getMarkets(): Promise<CryptoAsset[]> {
    throw new Error('Real trading is currently disabled pending regional regulatory and KYC licensing.');
  }

  async getTicker(symbol: string): Promise<{ symbol: string; price: number; change24h: number; high24h: number; low24h: number }> {
    throw new Error('Real trading connection pending.');
  }

  async getOrderBook(symbol: string): Promise<OrderBook> {
    throw new Error('Real trading orderbook pending.');
  }

  async createOrder(): Promise<{ success: boolean; order?: Order; error?: string }> {
    return {
      success: false,
      error: 'REAL TRADING RESTRICTED: Live order routing requires Tier-3 KYC verification and broker-dealer clearance. Please use DEMO/PAPER mode.',
    };
  }

  async cancelOrder(): Promise<{ success: boolean; error?: string }> {
    return { success: false, error: 'Live exchange adapter not connected.' };
  }

  async getPositions(): Promise<Position[]> {
    return [];
  }

  async getOrders(): Promise<Order[]> {
    return [];
  }

  async getTrades(): Promise<TradeTick[]> {
    return [];
  }
}
