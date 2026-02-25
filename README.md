# mcp-yahoo-finance

Get stock quotes, historical prices, financials, and market data from Yahoo Finance.

> **Free API** — No API key required.

## Tools

| Tool | Description |
|------|-------------|
| `get_quote` | Get real-time stock quote for one or more symbols. |
| `get_chart` | Get historical price data (OHLCV) for a symbol. |
| `search_symbols` | Search for stock/ETF/fund symbols by name or keyword. |
| `get_fundamentals` | Get key financial statistics and fundamentals for a stock. |
| `get_options` | Get options chain data for a stock. |
| `get_trending` | Get trending tickers in a specific market. |

## Installation

```bash
git clone https://github.com/PetrefiedThunder/mcp-yahoo-finance.git
cd mcp-yahoo-finance
npm install
npm run build
```

## Usage with Claude Desktop

Add to your `claude_desktop_config.json`:

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

## Usage with npx

```bash
npx mcp-yahoo-finance
```

## License

MIT
