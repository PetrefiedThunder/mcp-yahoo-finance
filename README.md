# mcp-yahoo-finance

MCP server for Yahoo Finance data. Real-time quotes, historical prices, fundamentals, options, and trending tickers. No API key required.

## Tools

| Tool | Description |
|------|-------------|
| `get_quote` | Real-time quotes for one or more symbols |
| `get_chart` | Historical OHLCV price data with configurable range/interval |
| `search_symbols` | Search for tickers by company name or keyword |
| `get_fundamentals` | Key financial statistics, income/balance/cashflow statements |
| `get_options` | Options chain data (calls and puts) |
| `get_trending` | Trending tickers by region |

## Install

```bash
npm install
npm run build
```

## Usage with Claude Desktop

```json
{
  "mcpServers": {
    "yahoo-finance": {
      "command": "node",
      "args": ["/path/to/mcp-yahoo-finance/dist/index.js"]
    }
  }
}
```

## No API Key Required

Uses Yahoo Finance's public endpoints. No authentication needed.

## License

MIT
