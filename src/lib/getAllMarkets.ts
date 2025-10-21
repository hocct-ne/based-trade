export function getAllMarkets(state: any) {
  const perps = state.universe.map((u: any, i: any) => {
    const ctx = state.assetCtxs[i];
    return {
      symbol: `${u.name}-PERP`,
      markPx: ctx.markPx,
      oraclePx: ctx.oraclePx,
      change24hValue: ctx.markPx - ctx.prevDayPx,
      volume24h: ctx.dayNtlVlm,
      change24h: ctx.prevDayPx
        ? ((ctx.markPx - ctx.prevDayPx) / ctx.prevDayPx) * 100
        : 0,
      funding: ctx.funding,
      type: "PERP" as const,
    };
  });

  const spots = (state.spotAssetCtxs || []).map((ctx: any) => ({
    symbol: ctx.coin,
    markPx: ctx.markPx,
    volume24h: ctx.dayNtlVlm,
    change24h: ctx.prevDayPx
      ? ((ctx.markPx - ctx.prevDayPx) / ctx.prevDayPx) * 100
      : 0,
    marketCap: ctx.circulatingSupply * ctx.markPx,
    type: "SPOT" as const,
  }));

  return [...spots, ...perps];
}
