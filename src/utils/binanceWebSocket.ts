import { Store } from "@reduxjs/toolkit";
import { updateSingleAsset, CryptoAsset } from "../store/slices/cryptoSlice";

const BINANCE_WS_URL = "wss://stream.binance.com:9443/ws";

export class BinanceWebSocket {
  private ws: WebSocket | null = null;
  private store: Store | null = null;
  private subscriptions: string[] = [];

  constructor() {
    this.subscriptions = [
      "btcusdt@ticker",
      "ethusdt@ticker",
      "xrpusdt@ticker",
      "bnbusdt@ticker",
      "solusdt@ticker",
    ];
  }

  connect(store: Store): void {
    if (this.ws) {
      return;
    }

    this.store = store;
    this.ws = new WebSocket(BINANCE_WS_URL);

    this.ws.onopen = () => {
      console.log("Connected to Binance WebSocket");
      this.subscribe();
    };

    this.ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log({ data });
      if (data.e === "24hrTicker") {
        this.handleTickerUpdate(data);
      }
    };

    this.ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    this.ws.onclose = () => {
      console.log("WebSocket connection closed");
      // Attempt to reconnect after 5 seconds
      setTimeout(() => this.connect(store), 5000);
    };
  }

  private subscribe(): void {
    if (!this.ws) return;

    const subscribeMsg = {
      method: "SUBSCRIBE",
      params: this.subscriptions,
      id: 1,
    };

    this.ws.send(JSON.stringify(subscribeMsg));
  }

  private handleTickerUpdate(data: any): void {
    if (!this.store) return;

    const symbol = data.s.toLowerCase();
    const price = parseFloat(data.c);
    const priceChange24h = parseFloat(data.P);
    const volume24h = parseFloat(data.v) * price;

    const symbolToId: { [key: string]: string } = {
      btcusdt: "bitcoin",
      ethusdt: "ethereum",
      xrpusdt: "xrp",
      bnbusdt: "bnb",
      solusdt: "solana",
    };

    const id = symbolToId[symbol];
    if (!id) return;

    this.store.dispatch(
      updateSingleAsset({
        id,
        price,
        priceChange24h,
        volume24h,
        chartData: [
          ...(this.store
            .getState()
            .crypto.assets.find((asset: CryptoAsset) => asset.id === id)
            ?.chartData.slice(1) || []),
          price,
        ],
      })
    );
  }

  disconnect(): void {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.store = null;
  }
}
