# Real-Time Cryptocurrency Price Tracker

A responsive React application that tracks real-time cryptocurrency prices using Redux Toolkit for state management and Binance WebSocket API for live data.

## Features

- **Live Price Updates**: Connects to Binance WebSocket API for real-time data updates
- **Comprehensive Data Display**: Shows key metrics including price, change percentages, market cap, volume and supply
- **Interactive UI**: Sortable columns, filtering by gainers/losers, and responsive design
- **Visual Elements**: Color-coded price changes and 7-day mini charts
- **Data Management**: Full Redux Toolkit integration with optimized selectors
- **Persistence**: LocalStorage support to maintain state between sessions
- **Fallback Mode**: Option to switch between live data and simulated updates

## Tech Stack

- **Frontend Framework**: React with TypeScript
- **State Management**: Redux Toolkit (RTK)
- **Real-time Data**: Binance WebSocket API
- **Styling**: Tailwind CSS
- **Icons/UI**: Lucide React
- **Data Persistence**: LocalStorage API

## Architecture

The application follows a clean architecture with the following structure:

```
src/
├── components/           # UI components
├── store/                # Redux store and slices
│   ├── index.ts          # Store configuration
│   └── cryptoSlice.ts    # Crypto data slice
├── utils/                # Utility functions
│   ├── binanceWebSocket.ts  # Live WebSocket connection
│   ├── mockWebSocket.ts     # Simulated data for fallback
│   └── localStorage.ts      # Persistence utilities
├── App.tsx               # Main application component
└── index.tsx             # Entry point
```

### Data Flow

1. **Data Source**: Live data from Binance WebSocket or simulated updates
2. **State Management**: All data flows through Redux actions and reducers
3. **UI Updates**: Components subscribe to Redux state via selectors
4. **Persistence**: State is saved to localStorage on updates

## Setup Instructions

### Prerequisites

- Node.js 18.x or higher
- npm 9.x or higher

### Installation

1. Clone the repository:

```bash
git clone https://github.com/kkapil94/xiv-tech
cd xiv-tech
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

## Implementation Details

### Redux State Structure

The core state is organized in a crypto slice with the following structure:

```typescript
interface CryptoState {
  assets: CryptoAsset[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

interface CryptoAsset {
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
```

### WebSocket Connection

The application supports two data modes:

1. **Live Data**: Connects to Binance WebSocket API for real market data
2. **Simulated Data**: Uses a mock WebSocket class to generate random fluctuations

## License

MIT
