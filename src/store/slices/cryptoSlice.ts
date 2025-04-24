import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../index";

export interface ChartDataPoint {
  timestamp: number;
  price: number;
}

export interface CryptoAsset {
  id: string;
  rank: number;
  name: string;
  symbol: string;
  image: string;
  price: number;
  priceChange1h: number;
  priceChange24h: number;
  priceChange7d: number;
  marketCap: number;
  volume24h: number;
  circulatingSupply: number;
  maxSupply: number | null;
  chartData: number[];
}

export interface CryptoState {
  assets: CryptoAsset[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

// Initial state with sample crypto assets
const initialState: CryptoState = {
  assets: [
    {
      id: "bitcoin",
      rank: 1,
      name: "Bitcoin",
      symbol: "BTC",
      image: "/btc.png",
      price: 0,
      priceChange1h: 0,
      priceChange24h: 0,
      priceChange7d: 0,
      marketCap: 0,
      volume24h: 0,
      circulatingSupply: 19283726,
      maxSupply: 21000000,
      chartData: Array(24).fill(0),
    },
    {
      id: "ethereum",
      rank: 2,
      name: "Ethereum",
      symbol: "ETH",
      image: "/eth.png",
      price: 0,
      priceChange1h: 0,
      priceChange24h: 0,
      priceChange7d: 0,
      marketCap: 0,
      volume24h: 0,
      circulatingSupply: 120293847,
      maxSupply: null,
      chartData: Array(24).fill(0),
    },
    {
      id: "xrp",
      rank: 3,
      name: "XRP",
      symbol: "XRP",
      image: "/xrp.png", // temporarily using BTC icon until XRP icon is provided
      price: 0,
      priceChange1h: 0,
      priceChange24h: 0,
      priceChange7d: 0,
      marketCap: 0,
      volume24h: 0,
      circulatingSupply: 46800000000,
      maxSupply: 100000000000,
      chartData: Array(24).fill(0),
    },
    {
      id: "bnb",
      rank: 4,
      name: "BNB",
      symbol: "BNB",
      image: "/bn.jpeg",
      price: 0,
      priceChange1h: 0,
      priceChange24h: 0,
      priceChange7d: 0,
      marketCap: 0,
      volume24h: 0,
      circulatingSupply: 154932651,
      maxSupply: 200000000,
      chartData: Array(24).fill(0),
    },
    {
      id: "solana",
      rank: 5,
      name: "Solana",
      symbol: "SOL",
      image: "/sol.png",
      price: 0,
      priceChange1h: 0,
      priceChange24h: 0,
      priceChange7d: 0,
      marketCap: 0,
      volume24h: 0,
      circulatingSupply: 420837465,
      maxSupply: null,
      chartData: Array(24).fill(0),
    },
  ],
  status: "idle",
  error: null,
};

// Create the crypto slice
const cryptoSlice = createSlice({
  name: "crypto",
  initialState,
  reducers: {
    updateCryptoData: (state, action: PayloadAction<CryptoAsset[]>) => {
      state.assets = action.payload;
    },
    updateSingleAsset: (
      state,
      action: PayloadAction<Partial<CryptoAsset> & { id: string }>
    ) => {
      const index = state.assets.findIndex(
        (asset) => asset.id === action.payload.id
      );
      if (index !== -1) {
        state.assets[index] = { ...state.assets[index], ...action.payload };
      }
    },
  },
});

export const { updateCryptoData, updateSingleAsset } = cryptoSlice.actions;

export const selectAllCryptoAssets = (state: RootState) => state.crypto.assets;
export const selectCryptoById = (state: RootState, id: string) =>
  state.crypto.assets.find((asset: CryptoAsset) => asset.id === id);

export default cryptoSlice.reducer;
