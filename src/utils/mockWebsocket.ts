import { CryptoAsset } from "../store/slices/cryptoSlice";
import { Store } from "@reduxjs/toolkit";

type WebSocketCallback = (data: CryptoAsset[]) => void;

export class MockWebSocket {
  private interval: any = null;
  private callbacks: WebSocketCallback[] = [];
  private assets: CryptoAsset[] = [];
  private store: Store | null = null;

  constructor() {
    // Store will be provided when connect() is called
  }

  connect(store: Store): void {
    if (this.interval) {
      return;
    }

    this.store = store;

    this.interval = setInterval(() => {
      if (!this.store) return;

      const state = this.store.getState();
      this.assets = [...state.crypto.assets];

      const updatedAssets = this.assets.map((asset) => {
        // Generate random price fluctuations
        const priceChange = asset.price * (Math.random() * 0.02 - 0.01); // -1% to +1%
        const newPrice = asset.price + priceChange;

        // Update percentage changes
        const priceChange1h = asset.priceChange1h + (Math.random() * 0.4 - 0.2); // -0.2% to +0.2%
        const priceChange24h =
          asset.priceChange24h + (Math.random() * 0.6 - 0.3); // -0.3% to +0.3%
        const priceChange7d = asset.priceChange7d + (Math.random() * 1 - 0.5); // -0.5% to +0.5%

        // Update volume
        const volumeChange = asset.volume24h * (Math.random() * 0.04 - 0.02); // -2% to +2%
        const newVolume = asset.volume24h + volumeChange;

        // Update chart data by adding a new point and removing the oldest
        const newChartData = [...asset.chartData.slice(1), newPrice];

        return {
          ...asset,
          price: newPrice,
          priceChange1h,
          priceChange24h,
          priceChange7d,
          volume24h: newVolume,
          chartData: newChartData,
        };
      });

      this.callbacks.forEach((callback) => callback(updatedAssets));
    }, 1500);
  }

  disconnect(): void {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
    this.store = null;
  }

  subscribe(callback: WebSocketCallback): () => void {
    this.callbacks.push(callback);

    return () => {
      this.callbacks = this.callbacks.filter((cb) => cb !== callback);
    };
  }
}
