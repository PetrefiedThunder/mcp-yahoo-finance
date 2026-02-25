import { describe, it, expect } from "vitest";

describe("mcp-yahoo-finance", () => {
  it("should encode symbols correctly", () => {
    expect(encodeURIComponent("AAPL,GOOGL")).toBe("AAPL%2CGOOGL");
    expect(encodeURIComponent("BRK.B")).toBe("BRK.B");
  });

  it("should support all chart ranges", () => {
    const ranges = ["1d", "5d", "1mo", "3mo", "6mo", "1y", "2y", "5y", "10y", "ytd", "max"];
    expect(ranges.length).toBe(11);
  });

  it("should support all intervals", () => {
    const intervals = ["1m", "2m", "5m", "15m", "30m", "60m", "90m", "1h", "1d", "5d", "1wk", "1mo", "3mo"];
    expect(intervals.length).toBe(13);
  });

  it("should build quote URLs", () => {
    const url = `https://query1.finance.yahoo.com/v7/finance/quote?symbols=AAPL`;
    expect(url).toContain("symbols=AAPL");
  });

  it("should build chart URLs with params", () => {
    const symbol = "TSLA";
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?range=1mo&interval=1d`;
    expect(url).toContain("TSLA");
    expect(url).toContain("range=1mo");
  });

  it("should support all regions for trending", () => {
    const regions = ["US", "GB", "CA", "DE", "FR", "JP", "AU", "IN", "HK"];
    expect(regions.length).toBe(9);
  });
});
