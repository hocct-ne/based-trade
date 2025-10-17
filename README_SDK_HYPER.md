/\*\*

- @module GuideModule
-
- The @coin98-hyper/core is part of the Hyperliquid Core package and provides functionality

- ## Installation
-
- To use the @coin98-hyper/core,
- Install the package using the following command:
-
- ```bash

  ```

- npm install @coin98-hyper/core
- ```

  ```

-
- ## Usage
-
- Import the @coin98-hyper/core and use it in your project:
-
- ```javascript

  ```

- import { GuideModule } from '@hyperliquid/core';
-
- // Initialize the module
- const sdk = new Hyperliquid();
-
- // Create a new guide
- sdk.createInstane({
  - enableWs?: boolean;
  - testnet?: boolean;
  - maxReconnectAttempts?: number;
  - disableAssetMapRefresh?: boolean;
  - assetMapRefreshIntervalMs?: number;
  - rpcConfig?: Record<string, string>;
- });
- ```

  ```

-
- ## Market ws

```tsx
sdk
  .connect()
  .then(() => {
    console.log('🚀 ~ Home ~ Hyperliquid connected:', sdk.ws.isConnected());
  })
  .catch((error) => {
    console.error('🚀 ~ Home ~ Error connecting to Hyperliquid:', error);
  });

sdk.subscriptions.subscribeToCandle('ETH-PERP', '1h', (candle) => {});
sdk.subscriptions.subscribeToL2Book('ETH-PERP', (trade) => {});
sdk.subscriptions.subscribeToAllMids(data: {
  [coin: string]: string;
}, (trade) => {});
sdk.subscriptions.subscribeToTrades('ETH-PERP', (trade) => {});

```

- ## Market API

```tsx
sdk.info.getAllMids();
sdk.info.getL2Book(coin);
sdk.info.getCandleSnapshot(
    coin: string,
    interval: string,
    startTime: number,
    endTime: number
);
sdk.info.getUserFillsByTime(
    user: string,
    startTime: number,
    endTime: number,
);
sdk.info.getUserOpenOrders(address);

etc.......

```

- ## Exchange API

```tsx
sdk.exchange.placeOrder();
sdk.exchange.cancelOrder();
sdk.exchange.transferBetweenSpotAndPerp();

etc.......

```

## Contributing

Contributions are welcome! Please follow the [contribution guidelines](CONTRIBUTING.md).

## License

This module is licensed under the [MIT License](LICENSE).
