import { useState, useEffect } from "react";
import { apiService } from "../services/api";
import { useCurrency } from "../context/CurrencyContext";

interface MetalRate {
  metal_name: string;
  rate_per_gram: number;
  rate_per_10_gram: number;
  change_percentage?: number;
  last_updated?: string;
}

const GoldRate = () => {
  const { format } = useCurrency();
  const [metalRates, setMetalRates] = useState<MetalRate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchMetalRates();
  }, []);

  const fetchMetalRates = async () => {
    try {
      setLoading(true);
      const response = await apiService.getDailyMetalRates();
      if (response.success && response.data) {
        setMetalRates(response.data);
      } else {
        // Fallback data if API fails
        setMetalRates([
          { metal_name: '24K Gold', rate_per_gram: 6250, rate_per_10_gram: 62500, change_percentage: 0.5 },
          { metal_name: '22K Gold', rate_per_gram: 5730, rate_per_10_gram: 57300, change_percentage: 0.4 },
          { metal_name: '18K Gold', rate_per_gram: 4688, rate_per_10_gram: 46880, change_percentage: 0.3 },
          { metal_name: 'Silver', rate_per_gram: 78, rate_per_10_gram: 780, change_percentage: -0.2 },
        ]);
      }
    } catch (err) {
      setError('Failed to load metal rates');
      console.error('Error fetching metal rates:', err);
      // Fallback data
      setMetalRates([
        { metal_name: '24K Gold', rate_per_gram: 6250, rate_per_10_gram: 62500, change_percentage: 0.5 },
        { metal_name: '22K Gold', rate_per_gram: 5730, rate_per_10_gram: 57300, change_percentage: 0.4 },
        { metal_name: '18K Gold', rate_per_gram: 4688, rate_per_10_gram: 46880, change_percentage: 0.3 },
        { metal_name: 'Silver', rate_per_gram: 78, rate_per_10_gram: 780, change_percentage: -0.2 },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const goldRates = metalRates.filter(rate => rate.metal_name.toLowerCase().includes('gold'));
  const silverRates = metalRates.filter(rate => rate.metal_name.toLowerCase().includes('silver'));

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">💰</div>
          <p className="text-gray-600">Loading current rates...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <p className="text-red-600">{error}</p>
          <button 
            onClick={fetchMetalRates}
            className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-5xl mx-auto px-4">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">💰</div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Today's Gold & Silver Rates
          </h1>
          <p className="text-gray-600">
            Last updated: March 24, 2026, 9:00 AM IST
          </p>
        </div>

        {/* Gold Rates */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-yellow-500 to-orange-500 p-6 text-white">
            <h2 className="text-2xl font-bold flex items-center gap-3">
              🏆 Gold Rates
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Purity
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Rate
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Unit
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Change
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {goldRates.map((item) => (
                  <tr key={item.metal_name} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <span className="font-semibold text-gray-800">{item.metal_name}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-lg font-bold text-yellow-600">{format(item.rate_per_gram)}</span>
                    </td>
                    <td className="px-6 py-4 text-gray-600 text-sm">per gram</td>
                    <td className="px-6 py-4">
                      {item.change_percentage !== undefined && (
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${
                            item.change_percentage >= 0
                              ? 'bg-green-100 text-green-700'
                              : 'bg-red-100 text-red-700'
                          }`}
                        >
                          {item.change_percentage >= 0 ? '↑' : '↓'} {Math.abs(item.change_percentage)}%
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Silver Rates */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-gray-400 to-gray-600 p-6 text-white">
            <h2 className="text-2xl font-bold flex items-center gap-3">
              🥈 Silver Rates
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Purity
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Rate
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Unit
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Change
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {silverRates.map((item) => (
                  <tr key={item.metal_name} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <span className="font-semibold text-gray-800">{item.metal_name}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-lg font-bold text-gray-600">{format(item.rate_per_gram)}</span>
                    </td>
                    <td className="px-6 py-4 text-gray-600 text-sm">per gram</td>
                    <td className="px-6 py-4">
                      {item.change_percentage !== undefined && (
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${
                            item.change_percentage >= 0
                              ? 'bg-green-100 text-green-700'
                              : 'bg-red-100 text-red-700'
                          }`}
                        >
                          {item.change_percentage >= 0 ? '↑' : '↓'} {Math.abs(item.change_percentage)}%
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Price Alert */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
          <div className="flex items-start gap-4">
            <span className="text-3xl">🔔</span>
            <div>
              <h3 className="font-semibold text-blue-800 mb-2">Get Price Alerts</h3>
              <p className="text-blue-700 text-sm mb-4">
                Subscribe to receive notifications when gold/silver rates change significantly.
              </p>
              <button className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition">
                Subscribe Now
              </button>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-8 text-xs text-gray-500 text-center">
          <p>
            * Rates are indicative and may vary from actual trading prices. Please visit our store 
            or contact us for real-time pricing. GST and making charges are additional.
          </p>
        </div>
      </div>
    </div>
  );
};

export default GoldRate;
