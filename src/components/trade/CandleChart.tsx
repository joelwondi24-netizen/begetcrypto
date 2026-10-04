import React, { useState, useMemo } from 'react';
import { CandleData, TimeFrame } from '../../types/crypto';
import { Eye, TrendingUp, BarChart2, Layers } from 'lucide-react';

interface CandleChartProps {
  candles: CandleData[];
  symbol: string;
  timeframe: TimeFrame;
  onTimeframeChange: (tf: TimeFrame) => void;
  currentPrice: number;
}

export const CandleChart: React.FC<CandleChartProps> = ({
  candles,
  symbol,
  timeframe,
  onTimeframeChange,
  currentPrice,
}) => {
  const [chartType, setChartType] = useState<'candles' | 'line'>('candles');
  const [showEma, setShowEma] = useState<boolean>(true);
  const [showBands, setShowBands] = useState<boolean>(false);
  const [showRsi, setShowRsi] = useState<boolean>(true);
  const [hoveredCandle, setHoveredCandle] = useState<CandleData | null>(null);

  const timeframes: TimeFrame[] = ['1H', '4H', '1D', '1W', '1M', 'ALL'];

  // Dimensions
  const width = 840;
  const mainHeight = 360;
  const rsiHeight = showRsi ? 90 : 0;
  const padding = { top: 20, right: 65, bottom: 25, left: 15 };

  // Calculate scales
  const { minPrice, maxPrice, maxVolume } = useMemo(() => {
    if (!candles || candles.length === 0) {
      return { minPrice: 0, maxPrice: 100, maxVolume: 100 };
    }
    let min = Infinity;
    let max = -Infinity;
    let vol = 0;

    candles.forEach(c => {
      if (c.low < min) min = c.low;
      if (c.high > max) max = c.high;
      if (c.volume > vol) vol = c.volume;
    });

    const buffer = (max - min) * 0.05 || 1;
    return {
      minPrice: min - buffer,
      maxPrice: max + buffer,
      maxVolume: vol || 1,
    };
  }, [candles]);

  const priceToY = (price: number) => {
    const range = maxPrice - minPrice || 1;
    return padding.top + (1 - (price - minPrice) / range) * (mainHeight - padding.top - padding.bottom);
  };

  const candleWidth = Math.max(
    (width - padding.left - padding.right) / Math.max(candles.length, 1) - 4,
    3
  );

  // EMA 20 Calculation
  const emaPoints = useMemo(() => {
    if (candles.length < 5) return [];
    const k = 2 / (20 + 1);
    let ema = candles[0].close;
    return candles.map((c, i) => {
      ema = c.close * k + ema * (1 - k);
      const x = padding.left + i * ((width - padding.left - padding.right) / candles.length) + candleWidth / 2;
      return { x, y: priceToY(ema) };
    });
  }, [candles, maxPrice, minPrice]);

  // RSI 14 Calculation
  const rsiPoints = useMemo(() => {
    if (!showRsi || candles.length < 14) return [];
    const points: { x: number; y: number; val: number }[] = [];
    let gains = 0;
    let losses = 0;

    for (let i = 1; i < candles.length; i++) {
      const diff = candles[i].close - candles[i - 1].close;
      if (diff >= 0) gains += diff;
      else losses -= diff;

      if (i >= 14) {
        const avgGain = gains / 14;
        const avgLoss = losses / 14 || 0.0001;
        const rs = avgGain / avgLoss;
        const rsi = 100 - 100 / (1 + rs);

        const x = padding.left + i * ((width - padding.left - padding.right) / candles.length) + candleWidth / 2;
        const rsiY = (1 - rsi / 100) * (rsiHeight - 20) + 10;
        points.push({ x, y: rsiY, val: Math.round(rsi) });

        // Rolling subtract
        const prevDiff = candles[i - 13].close - candles[i - 14].close;
        if (prevDiff >= 0) gains -= prevDiff;
        else losses += prevDiff;
      }
    }
    return points;
  }, [candles, showRsi]);

  const activeCandle = hoveredCandle || (candles.length > 0 ? candles[candles.length - 1] : null);

  return (
    <div className="flex flex-col bg-[#0b0f19] border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
      
      {/* Chart Control Toolbar */}
      <div className="flex flex-wrap items-center justify-between p-3 border-b border-slate-800/80 bg-slate-900/50 gap-2 text-xs">
        
        {/* Left: Timeframe Selectors */}
        <div className="flex items-center space-x-1">
          <span className="text-[11px] font-semibold text-slate-400 mr-1 hidden sm:inline">Timeframe:</span>
          {timeframes.map(tf => (
            <button
              key={tf}
              onClick={() => onTimeframeChange(tf)}
              className={`px-2.5 py-1 rounded-lg font-mono font-semibold transition cursor-pointer ${
                timeframe === tf
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              {tf}
            </button>
          ))}
        </div>

        {/* Center: Chart Type (Candle vs Line) */}
        <div className="flex items-center space-x-1 bg-slate-900 p-0.5 rounded-lg border border-slate-800">
          <button
            onClick={() => setChartType('candles')}
            className={`px-2.5 py-1 rounded text-xs font-semibold cursor-pointer ${
              chartType === 'candles' ? 'bg-slate-800 text-white' : 'text-slate-400'
            }`}
          >
            Candles
          </button>
          <button
            onClick={() => setChartType('line')}
            className={`px-2.5 py-1 rounded text-xs font-semibold cursor-pointer ${
              chartType === 'line' ? 'bg-slate-800 text-white' : 'text-slate-400'
            }`}
          >
            Area Line
          </button>
        </div>

        {/* Right: Indicators Toggles */}
        <div className="flex items-center space-x-1.5">
          <button
            onClick={() => setShowEma(!showEma)}
            className={`px-2 py-1 rounded text-[11px] font-semibold transition cursor-pointer ${
              showEma ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            EMA 20
          </button>
          <button
            onClick={() => setShowBands(!showBands)}
            className={`px-2 py-1 rounded text-[11px] font-semibold transition cursor-pointer ${
              showBands ? 'bg-purple-500/20 text-purple-400 border border-purple-500/40' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            Bands
          </button>
          <button
            onClick={() => setShowRsi(!showRsi)}
            className={`px-2 py-1 rounded text-[11px] font-semibold transition cursor-pointer ${
              showRsi ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            RSI (14)
          </button>
        </div>

      </div>

      {/* OHLCV Legend Bar */}
      {activeCandle && (
        <div className="flex flex-wrap items-center space-x-4 px-4 py-1.5 bg-[#090d15] text-[11px] font-mono border-b border-slate-800/40 text-slate-400">
          <span className="font-bold text-white">{symbol}/USDT</span>
          <span>O: <span className="text-slate-200">{activeCandle.open}</span></span>
          <span>H: <span className="text-emerald-400">{activeCandle.high}</span></span>
          <span>L: <span className="text-rose-400">{activeCandle.low}</span></span>
          <span>C: <span className={activeCandle.close >= activeCandle.open ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
            {activeCandle.close}
          </span></span>
          <span className="hidden sm:inline">Vol: <span className="text-slate-200">{activeCandle.volume.toLocaleString()}</span></span>
          {showEma && <span className="text-cyan-400">EMA(20): Active</span>}
        </div>
      )}

      {/* Main SVG Interactive Chart */}
      <div className="relative w-full overflow-hidden select-none">
        <svg
          viewBox={`0 0 ${width} ${mainHeight}`}
          className="w-full h-[320px] sm:h-[380px] bg-gradient-to-b from-[#0a0e17] to-[#070a10]"
          onMouseLeave={() => setHoveredCandle(null)}
        >
          {/* Grid lines */}
          {[0.2, 0.4, 0.6, 0.8].map(ratio => {
            const y = padding.top + ratio * (mainHeight - padding.top - padding.bottom);
            const price = maxPrice - ratio * (maxPrice - minPrice);
            return (
              <g key={ratio}>
                <line
                  x1={padding.left}
                  y1={y}
                  x2={width - padding.right}
                  y2={y}
                  stroke="#1e293b"
                  strokeDasharray="3 3"
                  strokeWidth="0.8"
                />
                <text
                  x={width - padding.right + 8}
                  y={y + 3.5}
                  fill="#64748b"
                  fontSize="10"
                  fontFamily="monospace"
                >
                  {price < 1 ? price.toFixed(4) : price.toFixed(1)}
                </text>
              </g>
            );
          })}

          {/* Volume Bars at Bottom */}
          {candles.map((c, i) => {
            const step = (width - padding.left - padding.right) / candles.length;
            const x = padding.left + i * step;
            const isGreen = c.close >= c.open;
            const volHeight = Math.min((c.volume / maxVolume) * 55, 55);
            const y = mainHeight - padding.bottom - volHeight;

            return (
              <rect
                key={`vol-${i}`}
                x={x}
                y={y}
                width={candleWidth}
                height={volHeight}
                fill={isGreen ? '#10b981' : '#f43f5e'}
                opacity="0.25"
              />
            );
          })}

          {/* Area Line Chart Mode */}
          {chartType === 'line' && (
            <>
              <defs>
                <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              <path
                d={
                  candles.reduce((acc, c, i) => {
                    const step = (width - padding.left - padding.right) / candles.length;
                    const x = padding.left + i * step + candleWidth / 2;
                    const y = priceToY(c.close);
                    return `${acc} ${i === 0 ? 'M' : 'L'} ${x} ${y}`;
                  }, '') + ` L ${width - padding.right} ${mainHeight - padding.bottom} L ${padding.left} ${mainHeight - padding.bottom} Z`
                }
                fill="url(#areaGradient)"
              />
              <path
                d={candles.reduce((acc, c, i) => {
                  const step = (width - padding.left - padding.right) / candles.length;
                  const x = padding.left + i * step + candleWidth / 2;
                  const y = priceToY(c.close);
                  return `${acc} ${i === 0 ? 'M' : 'L'} ${x} ${y}`;
                }, '')}
                fill="none"
                stroke="#10b981"
                strokeWidth="2"
              />
            </>
          )}

          {/* Candlesticks Mode */}
          {chartType === 'candles' &&
            candles.map((c, i) => {
              const step = (width - padding.left - padding.right) / candles.length;
              const x = padding.left + i * step;
              const centerX = x + candleWidth / 2;
              const isGreen = c.close >= c.open;
              const color = isGreen ? '#10b981' : '#f43f5e';

              const highY = priceToY(c.high);
              const lowY = priceToY(c.low);
              const openY = priceToY(c.open);
              const closeY = priceToY(c.close);

              const bodyY = Math.min(openY, closeY);
              const bodyHeight = Math.max(Math.abs(closeY - openY), 1.5);

              return (
                <g
                  key={c.time}
                  onMouseEnter={() => setHoveredCandle(c)}
                  className="cursor-crosshair group"
                >
                  {/* Wick */}
                  <line
                    x1={centerX}
                    y1={highY}
                    x2={centerX}
                    y2={lowY}
                    stroke={color}
                    strokeWidth="1.2"
                  />
                  {/* Body */}
                  <rect
                    x={x}
                    y={bodyY}
                    width={candleWidth}
                    height={bodyHeight}
                    fill={color}
                    rx="1"
                  />
                </g>
              );
            })}

          {/* EMA 20 Line Overlay */}
          {showEma && emaPoints.length > 1 && (
            <path
              d={emaPoints.reduce((acc, pt, i) => `${acc} ${i === 0 ? 'M' : 'L'} ${pt.x} ${pt.y}`, '')}
              fill="none"
              stroke="#06b6d4"
              strokeWidth="1.5"
              strokeDasharray="4 2"
            />
          )}

          {/* Current Price Mark Line */}
          <line
            x1={padding.left}
            y1={priceToY(currentPrice)}
            x2={width - padding.right}
            y2={priceToY(currentPrice)}
            stroke="#10b981"
            strokeDasharray="2 2"
            strokeWidth="1"
          />
          <rect
            x={width - padding.right}
            y={priceToY(currentPrice) - 9}
            width={padding.right}
            height={18}
            fill="#10b981"
            rx="2"
          />
          <text
            x={width - padding.right + 5}
            y={priceToY(currentPrice) + 4}
            fill="#090d14"
            fontSize="10"
            fontFamily="monospace"
            fontWeight="bold"
          >
            {currentPrice < 1 ? currentPrice.toFixed(4) : currentPrice.toFixed(1)}
          </text>
        </svg>

        {/* Sub-Panel: RSI (14) */}
        {showRsi && (
          <div className="border-t border-slate-800 bg-[#070b12] px-3 py-1">
            <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mb-1">
              <span className="font-bold text-amber-400">RSI (14)</span>
              <span>70 Overbought / 30 Oversold</span>
            </div>
            <svg viewBox={`0 0 ${width} 70`} className="w-full h-16">
              {/* Threshold lines */}
              <line x1="0" y1="21" x2={width} y2="21" stroke="#f43f5e" strokeDasharray="3 3" strokeWidth="0.7" opacity="0.6" />
              <line x1="0" y1="49" x2={width} y2="49" stroke="#10b981" strokeDasharray="3 3" strokeWidth="0.7" opacity="0.6" />
              
              {/* RSI Curve */}
              {rsiPoints.length > 1 && (
                <path
                  d={rsiPoints.reduce((acc, pt, i) => `${acc} ${i === 0 ? 'M' : 'L'} ${pt.x} ${pt.y}`, '')}
                  fill="none"
                  stroke="#f59e0b"
                  strokeWidth="1.5"
                />
              )}
            </svg>
          </div>
        )}
      </div>

    </div>
  );
};
