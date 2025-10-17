import { Position } from "@/hooks/usePositions";

export function PositionsTable({ positions }: { positions: Position[] }) {
  return (
    <div className="text-sm">
      <div className="grid grid-cols-8 text-muted-foreground border-b border-border/50 pb-1 mb-1">
        <div>Coin</div>
        <div>Size</div>
        <div>Position Value</div>
        <div>Entry Price</div>
        <div>Mark Price</div>
        <div>Liq. Price</div>
        <div>Margin</div>
        <div>PNL</div>
      </div>

      {positions.map((p) => (
        <div
          key={p.symbol}
          className="grid grid-cols-8 border-b border-border/30 py-1"
        >
          <div className="text-primary font-semibold">
            {p.symbol}{" "}
            <span className="text-muted-foreground">{p.leverage}x</span>
          </div>
          <div>{p.size.toFixed(5)} BTC</div>
          <div>${(p.entryPrice * Math.abs(p.size)).toFixed(2)}</div>
          <div>{p.entryPrice.toLocaleString()}</div>
          <div>{p.markPrice.toLocaleString()}</div>
          <div>{p.liqPrice.toLocaleString()}</div>
          <div>${p.margin.toFixed(2)}</div>
          <div
            className={`${
              p.pnl >= 0 ? "text-green-400" : "text-red-400"
            } font-mono`}
          >
            {p.pnl.toFixed(2)}
          </div>
        </div>
      ))}
    </div>
  );
}
