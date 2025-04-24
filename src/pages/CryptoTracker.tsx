import { useEffect, useState, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { ArrowDown, ArrowUp } from "lucide-react";
import { AreaChart, Area, ResponsiveContainer, YAxis } from "recharts";
import { CryptoAsset } from "../store/slices/cryptoSlice";
import { BinanceWebSocket } from "../utils/binanceWebSocket";
import { store, RootState } from "../store";
import { clearState } from "../utils/localStorage";

// Types
interface SortConfig {
  key: keyof CryptoAsset;
  direction: "asc" | "desc";
}

type FilterOption = "all" | "gainers" | "losers";

// Binance WebSocket instance
const binanceWs = new BinanceWebSocket();

const CryptoTracker = () => {
  const dispatch = useDispatch();
  const cryptoData = useSelector((state: RootState) => state.crypto.assets);
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: "rank",
    direction: "asc",
  });
  const [filter, setFilter] = useState<FilterOption>("all");

  useEffect(() => {
    // Clear localStorage to force new image paths
    clearState();

    // Connect to the Binance WebSocket
    binanceWs.connect(store);

    // Cleanup on unmount
    return () => {
      binanceWs.disconnect();
    };
  }, [dispatch]);

  // Sorting logic with type safety
  const sortedData = useMemo(() => {
    let sortableData = [...cryptoData];

    if (sortConfig.key) {
      sortableData.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];

        if (aValue != null && bValue != null) {
          if (aValue < bValue) {
            return sortConfig.direction === "asc" ? -1 : 1;
          }
          if (aValue > bValue) {
            return sortConfig.direction === "asc" ? 1 : -1;
          }
        }
        return 0;
      });
    }
    return sortableData;
  }, [cryptoData, sortConfig]);

  // Filtering logic
  const filteredData = useMemo(() => {
    switch (filter) {
      case "gainers":
        return sortedData.filter((crypto) => crypto.priceChange24h > 0);
      case "losers":
        return sortedData.filter((crypto) => crypto.priceChange24h < 0);
      default:
        return sortedData;
    }
  }, [sortedData, filter]);

  const requestSort = (key: keyof CryptoAsset): void => {
    let direction: "asc" | "desc" = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const getPercentageColorClass = (value: number): string => {
    return value >= 0 ? "text-green-500" : "text-red-500";
  };

  return (
    <div className="min-h-screen bg-gray-100 py-6 sm:py-12 px-2 sm:px-6 lg:px-8">
      <div className="mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-8 text-center">
          Cryptocurrency Tracker
        </h1>

        {/* Filters */}
        <div className="mb-4 sm:mb-6 flex flex-wrap gap-2 justify-center sm:justify-between items-center">
          <div className="flex flex-wrap gap-2">
            <button
              className={`px-3 py-1 sm:px-4 sm:py-2 text-sm rounded-md ${
                filter === "all" ? "bg-blue-600 text-white" : "bg-gray-200"
              }`}
              onClick={() => setFilter("all")}
            >
              All
            </button>
            <button
              className={`px-3 py-1 sm:px-4 sm:py-2 text-sm rounded-md ${
                filter === "gainers" ? "bg-green-600 text-white" : "bg-gray-200"
              }`}
              onClick={() => setFilter("gainers")}
            >
              Top Gainers
            </button>
            <button
              className={`px-3 py-1 sm:px-4 sm:py-2 text-sm rounded-md ${
                filter === "losers" ? "bg-red-600 text-white" : "bg-gray-200"
              }`}
              onClick={() => setFilter("losers")}
            >
              Top Losers
            </button>
          </div>
        </div>

        {/* Crypto Table */}
        <div className="overflow-x-auto bg-white shadow-md rounded-lg">
          <div className="min-w-full inline-block align-middle">
            <div className="overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      onClick={() => requestSort("rank")}
                      className="px-2 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    >
                      #
                    </th>
                    <th
                      onClick={() => requestSort("name")}
                      className="px-2 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    >
                      Name
                    </th>
                    <th
                      onClick={() => requestSort("price")}
                      className="px-2 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    >
                      Price
                    </th>
                    <th
                      onClick={() => requestSort("priceChange1h")}
                      className="hidden xl:table-cell px-2 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    >
                      1h %
                    </th>
                    <th
                      onClick={() => requestSort("priceChange24h")}
                      className="px-2 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    >
                      24h %
                    </th>
                    <th
                      onClick={() => requestSort("priceChange7d")}
                      className="hidden md:table-cell px-2 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    >
                      7d %
                    </th>
                    <th
                      onClick={() => requestSort("marketCap")}
                      className="hidden md:table-cell px-2 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    >
                      Market Cap
                    </th>
                    <th
                      onClick={() => requestSort("volume24h")}
                      className="hidden xl:table-cell px-2 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    >
                      Volume
                    </th>
                    <th
                      onClick={() => requestSort("circulatingSupply")}
                      className="hidden xl:table-cell px-2 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    >
                      Circulating Supply
                    </th>
                    <th className="hidden md:table-cell px-2 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      7d Chart
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((crypto) => (
                    <tr
                      key={crypto.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-2 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500">
                        {crypto.rank}
                      </td>
                      <td className="px-2 sm:px-6 py-2 sm:py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-6 w-6 sm:h-10 sm:w-10">
                            <img
                              className="h-6 w-6 sm:h-10 sm:w-10 rounded-full"
                              src={crypto.image}
                              alt={crypto.name}
                            />
                          </div>
                          <div className="ml-2 sm:ml-4">
                            <div className="text-xs sm:text-sm font-medium text-gray-900">
                              {crypto.name}
                            </div>
                            <div className="text-xs text-gray-500">
                              {crypto.symbol}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-2 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-900">
                        $
                        {crypto.price.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </td>
                      <td className="hidden xl:table-cell px-2 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-xs sm:text-sm">
                        <div
                          className={`flex items-center ${getPercentageColorClass(
                            crypto.priceChange1h
                          )}`}
                        >
                          {crypto.priceChange1h >= 0 ? (
                            <ArrowUp size={12} className="sm:w-4 sm:h-4" />
                          ) : (
                            <ArrowDown size={12} className="sm:w-4 sm:h-4" />
                          )}
                          {Math.abs(crypto.priceChange1h).toFixed(2)}%
                        </div>
                      </td>
                      <td className="px-2 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-xs sm:text-sm">
                        <div
                          className={`flex items-center ${getPercentageColorClass(
                            crypto.priceChange24h
                          )}`}
                        >
                          {crypto.priceChange24h >= 0 ? (
                            <ArrowUp size={12} className="sm:w-4 sm:h-4" />
                          ) : (
                            <ArrowDown size={12} className="sm:w-4 sm:h-4" />
                          )}
                          {Math.abs(crypto.priceChange24h).toFixed(2)}%
                        </div>
                      </td>
                      <td className="hidden md:table-cell px-2 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-xs sm:text-sm">
                        <div
                          className={`flex items-center ${getPercentageColorClass(
                            crypto.priceChange7d
                          )}`}
                        >
                          {crypto.priceChange7d >= 0 ? (
                            <ArrowUp size={12} className="sm:w-4 sm:h-4" />
                          ) : (
                            <ArrowDown size={12} className="sm:w-4 sm:h-4" />
                          )}
                          {Math.abs(crypto.priceChange7d).toFixed(2)}%
                        </div>
                      </td>
                      <td className="hidden md:table-cell px-2 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500">
                        ${crypto.marketCap.toLocaleString()}
                      </td>
                      <td className="hidden xl:table-cell px-2 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500">
                        ${crypto.volume24h.toLocaleString()}
                      </td>
                      <td className="hidden xl:table-cell px-2 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500">
                        {crypto.circulatingSupply.toLocaleString()}{" "}
                        {crypto.symbol}
                        {crypto.maxSupply && (
                          <div className="mt-1 w-full bg-gray-200 rounded-full h-1.5">
                            <div
                              className="bg-blue-600 h-1.5 rounded-full"
                              style={{
                                width: `${
                                  (crypto.circulatingSupply /
                                    crypto.maxSupply) *
                                  100
                                }%`,
                              }}
                            />
                          </div>
                        )}
                      </td>
                      <td className="hidden md:table-cell px-2 sm:px-6 py-2 sm:py-4 whitespace-nowrap">
                        <MiniChart
                          data={crypto.chartData}
                          priceChange7d={crypto.priceChange7d}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

interface MiniChartProps {
  data: number[];
  priceChange7d: number;
}

const MiniChart = ({ data, priceChange7d }: MiniChartProps) => {
  const chartColor = priceChange7d >= 0 ? "#16a34a" : "#dc2626";

  // Transform data to include index for better x-axis distribution
  const chartData = useMemo(
    () =>
      data.map((value, index) => ({
        name: index,
        value: value,
      })),
    [data]
  );

  // Calculate min and max for proper chart scaling
  const minValue = Math.min(...data);
  const maxValue = Math.max(...data);
  const padding = (maxValue - minValue) * 0.1;

  return (
    <div style={{ width: 120, height: 40 }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={chartData}
          margin={{ top: 2, right: 2, bottom: 2, left: 2 }}
        >
          <YAxis domain={[minValue - padding, maxValue + padding]} hide />
          <Area
            type="monotoneX"
            dataKey="value"
            stroke={chartColor}
            fill={chartColor}
            fillOpacity={0.2}
            isAnimationActive={false}
            dot={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CryptoTracker;
