#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const USER_AGENT = "mcp-yahoo-finance/1.0.0";
const BASE = "https://query1.finance.yahoo.com";
const RATE_LIMIT_MS = 500;
let lastRequestTime = 0;

async function rateLimitedFetch(url: string): Promise<any> {
  const now = Date.now();
  const elapsed = now - lastRequestTime;
  if (elapsed < RATE_LIMIT_MS) {
    await new Promise((r) => setTimeout(r, RATE_LIMIT_MS - elapsed));
  }
  lastRequestTime = Date.now();

  const res = await fetch(url, {
    headers: { "User-Agent": USER_AGENT },
  });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Yahoo Finance error: ${res.status} — ${body.slice(0, 500)}`);
  }
  return res.json();
}

const server = new McpServer({
  name: "mcp-yahoo-finance",
  version: "1.0.0",
});

server.tool(
  "get_quote",
  "Get real-time stock quote for one or more symbols.",
  {
    symbols: z.string().describe("Comma-separated ticker symbols (e.g. 'AAPL,GOOGL,MSFT')"),
  },
  async ({ symbols }) => {
    const url = `${BASE}/v7/finance/quote?symbols=${encodeURIComponent(symbols)}&crumb=`;
    const data = await rateLimitedFetch(url);
    return { content: [{ type: "text" as const, text: JSON.stringify(data, null, 2) }] };
  }
);

server.tool(
  "get_chart",
  "Get historical price data (OHLCV) for a symbol.",
  {
    symbol: z.string().describe("Ticker symbol (e.g. 'AAPL')"),
    range: z.enum(["1d", "5d", "1mo", "3mo", "6mo", "1y", "2y", "5y", "10y", "ytd", "max"]).default("1mo"),
    interval: z.enum(["1m", "2m", "5m", "15m", "30m", "60m", "90m", "1h", "1d", "5d", "1wk", "1mo", "3mo"]).default("1d"),
  },
  async ({ symbol, range, interval }) => {
    const url = `${BASE}/v8/finance/chart/${encodeURIComponent(symbol)}?range=${range}&interval=${interval}`;
    const data = await rateLimitedFetch(url);
    return { content: [{ type: "text" as const, text: JSON.stringify(data, null, 2) }] };
  }
);

server.tool(
  "search_symbols",
  "Search for stock/ETF/fund symbols by name or keyword.",
  {
    query: z.string().describe("Company name or keyword (e.g. 'Tesla', 'artificial intelligence ETF')"),
  },
  async ({ query }) => {
    const url = `https://query2.finance.yahoo.com/v1/finance/search?q=${encodeURIComponent(query)}&quotesCount=10&newsCount=0`;
    const data = await rateLimitedFetch(url);
    return { content: [{ type: "text" as const, text: JSON.stringify(data, null, 2) }] };
  }
);

server.tool(
  "get_fundamentals",
  "Get key financial statistics and fundamentals for a stock.",
  {
    symbol: z.string().describe("Ticker symbol"),
  },
  async ({ symbol }) => {
    const url = `${BASE}/v10/finance/quoteSummary/${encodeURIComponent(symbol)}?modules=financialData,defaultKeyStatistics,incomeStatementHistory,balanceSheetHistory,cashflowStatementHistory,earningsHistory`;
    const data = await rateLimitedFetch(url);
    return { content: [{ type: "text" as const, text: JSON.stringify(data, null, 2) }] };
  }
);

server.tool(
  "get_options",
  "Get options chain data for a stock.",
  {
    symbol: z.string().describe("Ticker symbol"),
    date: z.string().optional().describe("Expiration date as epoch timestamp (optional, defaults to nearest)"),
  },
  async ({ symbol, date }) => {
    let url = `${BASE}/v7/finance/options/${encodeURIComponent(symbol)}`;
    if (date) url += `?date=${date}`;
    const data = await rateLimitedFetch(url);
    return { content: [{ type: "text" as const, text: JSON.stringify(data, null, 2) }] };
  }
);

server.tool(
  "get_trending",
  "Get trending tickers in a specific market.",
  {
    region: z.enum(["US", "GB", "CA", "DE", "FR", "JP", "AU", "IN", "HK"]).default("US"),
  },
  async ({ region }) => {
    const url = `${BASE}/v1/finance/trending/${region}?count=20`;
    const data = await rateLimitedFetch(url);
    return { content: [{ type: "text" as const, text: JSON.stringify(data, null, 2) }] };
  }
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
