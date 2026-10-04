import { CandleData, CryptoAsset, OrderBook, TradeTick, PriceAlert } from '../types/crypto';

// Generates realistic historical candlestick data based on base price and volatility
export function generateCandles(basePrice: number, count: number = 60, intervalMinutes: number = 15): CandleData[] {
  const candles: CandleData[] = [];
  const now = Date.now();
  const intervalMs = intervalMinutes * 60 * 1000;
  
  let currentPrice = basePrice * 0.94; // start slightly lower for an organic curve
  const volatility = basePrice > 1000 ? 0.0035 : 0.007;

  for (let i = count; i >= 0; i--) {
    const time = now - i * intervalMs;
    // Add mean-reverting random walk
    const changePercent = (Math.random() - 0.485) * volatility * 2;
    const open = currentPrice;
    const close = Math.max(open * (1 + changePercent), open * 0.9);
    const high = Math.max(open, close) * (1 + Math.random() * volatility);
    const low = Math.min(open, close) * (1 - Math.random() * volatility);
    const volume = Math.floor((basePrice * 12 + Math.random() * basePrice * 25) * (1 + Math.abs(changePercent) * 20));

    candles.push({
      time,
      open: Number(open.toFixed(basePrice < 1 ? 6 : 2)),
      high: Number(high.toFixed(basePrice < 1 ? 6 : 2)),
      low: Number(low.toFixed(basePrice < 1 ? 6 : 2)),
      close: Number(close.toFixed(basePrice < 1 ? 6 : 2)),
      volume,
    });

    currentPrice = close;
  }

  // Adjust final candle to match basePrice closely
  if (candles.length > 0) {
    const last = candles[candles.length - 1];
    last.close = basePrice;
    last.high = Math.max(last.high, basePrice);
    last.low = Math.min(last.low, basePrice);
  }

  return candles;
}

// Generates a realistic L2 Order Book around the current mark price
export function generateOrderBook(currentPrice: number, depth: number = 12): OrderBook {
  const bids = [];
  const asks = [];
  const spreadPercent = 0.0004; // 0.04% spread
  const stepPercent = 0.0006;
  const isMicro = currentPrice < 1;

  let totalBidVolume = 0;
  let totalAskVolume = 0;

  for (let i = 0; i < depth; i++) {
    const askPrice = currentPrice * (1 + spreadPercent + i * stepPercent);
    const askAmount = Number((Math.random() * (currentPrice > 10000 ? 1.5 : 25) + 0.1).toFixed(isMicro ? 1 : 4));
    totalAskVolume += askAmount;
    asks.push({
      price: Number(askPrice.toFixed(isMicro ? 6 : 2)),
      amount: askAmount,
      total: Number(totalAskVolume.toFixed(isMicro ? 1 : 4)),
    });

    const bidPrice = currentPrice * (1 - spreadPercent - i * stepPercent);
    const bidAmount = Number((Math.random() * (currentPrice > 10000 ? 1.5 : 25) + 0.1).toFixed(isMicro ? 1 : 4));
    totalBidVolume += bidAmount;
    bids.push({
      price: Number(bidPrice.toFixed(isMicro ? 6 : 2)),
      amount: bidAmount,
      total: Number(totalBidVolume.toFixed(isMicro ? 1 : 4)),
    });
  }

  return {
    bids,
    asks: asks.reverse(), // Highest ask at top
  };
}

// Generates random recent trades for market tape
export function generateInitialTrades(currentPrice: number, count: number = 15): TradeTick[] {
  const trades: TradeTick[] = [];
  const isMicro = currentPrice < 1;
  const now = Date.now();

  for (let i = 0; i < count; i++) {
    const isBuy = Math.random() > 0.48;
    const variation = (Math.random() - 0.5) * 0.001;
    const tradePrice = currentPrice * (1 + variation);
    const amount = Number((Math.random() * (currentPrice > 10000 ? 0.8 : 15) + 0.05).toFixed(isMicro ? 1 : 4));

    trades.push({
      id: `tick-${now - i * 1400}-${i}`,
      price: Number(tradePrice.toFixed(isMicro ? 6 : 2)),
      amount,
      time: now - i * 1400,
      type: isBuy ? 'buy' : 'sell',
    });
  }

  return trades;
}

// Check price alerts against updated asset prices
export function checkTriggeredAlerts(
  alerts: PriceAlert[],
  assets: CryptoAsset[]
): { updatedAlerts: PriceAlert[]; triggeredAlerts: PriceAlert[] } {
  const triggered: PriceAlert[] = [];
  const assetMap = new Map(assets.map(a => [a.symbol, a.price]));

  const updatedAlerts = alerts.map(alert => {
    if (alert.isTriggered || !alert.active) return alert;

    const currentPrice = assetMap.get(alert.symbol);
    if (currentPrice === undefined) return alert;

    const isHit =
      (alert.condition === 'above' && currentPrice >= alert.targetPrice) ||
      (alert.condition === 'below' && currentPrice <= alert.targetPrice);

    if (isHit) {
      const hitAlert: PriceAlert = {
        ...alert,
        isTriggered: true,
        triggeredAt: Date.now(),
      };
      triggered.push(hitAlert);
      return hitAlert;
    }

    return alert;
  });

  return { updatedAlerts, triggeredAlerts: triggered };
}
