import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, Plugin } from 'vite';
import { GoogleGenAI } from '@google/genai';

function aiApiPlugin(): Plugin {
  return {
    name: 'ai-api-endpoints',
    configureServer(server) {
      server.middlewares.use('/api/ai/analyze', async (req, res) => {
        if (req.method !== 'POST') {
          res.statusCode = 405;
          res.end(JSON.stringify({ error: 'Method Not Allowed' }));
          return;
        }

        let body = '';
        req.on('data', chunk => {
          body += chunk;
        });

        req.on('end', async () => {
          try {
            const parsed = JSON.parse(body || '{}');
            const apiKey = process.env.GEMINI_API_KEY;

            if (!apiKey) {
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({}));
              return;
            }

            const ai = new GoogleGenAI({ apiKey });
            const prompt = `You are the lead crypto market analyst for Beget Trading Platform.
Analyze this asset:
Symbol: ${parsed.symbol}
Name: ${parsed.name}
Current Price: $${parsed.price}
24h Change: ${parsed.change24h}%
24h High: $${parsed.high24h}
24h Low: $${parsed.low24h}
24h Volume: $${parsed.volume24h}

Provide a concise, professional JSON response matching this schema:
{
  "summary": "2-3 sentences of objective market summary",
  "trend": "Bullish" | "Bearish" | "Neutral" | "Strong Bullish",
  "sentimentScore": number between 1 and 99,
  "bullishCatalysts": ["catalyst 1", "catalyst 2", "catalyst 3"],
  "bearishRisks": ["risk 1", "risk 2", "risk 3"],
  "keyTakeaway": "1 sentence tactical advice"
}
Important: Return ONLY raw JSON without markdown code fences. Never promise guaranteed profits or claim certainty.`;

            const aiRes = await ai.models.generateContent({
              model: 'gemini-3.8-flash',
              contents: prompt,
            });

            const text = aiRes.text || '{}';
            const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
            res.setHeader('Content-Type', 'application/json');
            res.end(cleanText);
          } catch (err: any) {
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: err?.message || 'AI request failed' }));
          }
        });
      });

      server.middlewares.use('/api/ai/chat', async (req, res) => {
        if (req.method !== 'POST') {
          res.statusCode = 405;
          res.end(JSON.stringify({ error: 'Method Not Allowed' }));
          return;
        }

        let body = '';
        req.on('data', chunk => {
          body += chunk;
        });

        req.on('end', async () => {
          try {
            const parsed = JSON.parse(body || '{}');
            const apiKey = process.env.GEMINI_API_KEY;

            if (!apiKey) {
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({}));
              return;
            }

            const ai = new GoogleGenAI({ apiKey });
            const prompt = `You are Beget's AI Crypto Assistant. Answer the user's question clearly, educationally, and accurately.
Context:
Selected Asset: ${parsed.contextAsset ? `${parsed.contextAsset.name} (${parsed.contextAsset.symbol}) at $${parsed.contextAsset.price}` : 'None'}
User query: "${parsed.message}"

Guidelines:
- Explain crypto concepts clearly
- Never give personalized investment guarantees
- Remind users that paper trading is risk-free learning
- Include practical tips for technical indicators like RSI, MACD, or candlestick patterns when relevant.`;

            const aiRes = await ai.models.generateContent({
              model: 'gemini-3.8-flash',
              contents: prompt,
            });

            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ reply: aiRes.text }));
          } catch (err: any) {
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: err?.message || 'Chat failed' }));
          }
        });
      });
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), aiApiPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});

