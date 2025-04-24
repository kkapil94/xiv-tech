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

// Generate mock chart data
const generateChartData = (
  length: number,
  trend: "up" | "down" | "volatile"
): number[] => {
  const data: number[] = [];
  let value = 100 + Math.random() * 50;

  for (let i = 0; i < length; i++) {
    if (trend === "up") {
      value += Math.random() * 5;
    } else if (trend === "down") {
      value -= Math.random() * 5;
    } else {
      value += (Math.random() - 0.5) * 10;
    }
    value = Math.max(50, value);
    data.push(value);
  }

  return data;
};

// Initial state with sample crypto assets
const initialState: CryptoState = {
  assets: [
    {
      id: "bitcoin",
      rank: 1,
      name: "Bitcoin",
      symbol: "BTC",
      image: "/btc.png",
      price: 48235.75,
      priceChange1h: 0.5,
      priceChange24h: 2.3,
      priceChange7d: 5.7,
      marketCap: 929782835298,
      volume24h: 28735982735,
      circulatingSupply: 19283726,
      maxSupply: 21000000,
      chartData: generateChartData(24, "up"),
    },
    {
      id: "ethereum",
      rank: 2,
      name: "Ethereum",
      symbol: "ETH",
      image: "/eth.png",
      price: 2532.46,
      priceChange1h: -0.2,
      priceChange24h: 1.8,
      priceChange7d: -3.2,
      marketCap: 304598234509,
      volume24h: 14536982342,
      circulatingSupply: 120293847,
      maxSupply: null,
      chartData: generateChartData(24, "volatile"),
    },
    {
      id: "tether",
      rank: 3,
      name: "Tether",
      symbol: "USDT",
      image: "/teth.png",
      price: 1.0,
      priceChange1h: 0.01,
      priceChange24h: 0.05,
      priceChange7d: -0.02,
      marketCap: 83547239583,
      volume24h: 67823459230,
      circulatingSupply: 83547239583,
      maxSupply: null,
      chartData: generateChartData(24, "volatile"),
    },
    {
      id: "bnb",
      rank: 4,
      name: "BNB",
      symbol: "BNB",
      image: "/bn.jpeg",
      price: 382.75,
      priceChange1h: 0.8,
      priceChange24h: -1.2,
      priceChange7d: 3.5,
      marketCap: 59283475293,
      volume24h: 1983247593,
      circulatingSupply: 154932651,
      maxSupply: 200000000,
      chartData: generateChartData(24, "up"),
    },
    {
      id: "solana",
      rank: 5,
      name: "Solana",
      symbol: "SOL",
      image: "/sol.png",
      price: 89.32,
      priceChange1h: 1.2,
      priceChange24h: 4.5,
      priceChange7d: 12.3,
      marketCap: 37592837465,
      volume24h: 2938475632,
      circulatingSupply: 420837465,
      maxSupply: null,
      chartData: generateChartData(24, "up"),
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
