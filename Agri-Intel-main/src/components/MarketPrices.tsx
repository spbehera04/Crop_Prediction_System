import React, { useState } from 'react';
import { TrendingUp, TrendingDown, Minus, DollarSign } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { translations } from '../utils/translations';
import { marketPrices } from '../data/marketPrices';
import { crops } from '../data/crops';
import { regions } from '../data/regions';
import { Badge } from './ui/badge';

export function MarketPrices() {
  const { language } = useApp();
  const t = translations[language];

  const [selectedRegion, setSelectedRegion] = useState<string>('all');

  const uniqueRegions = Array.from(new Set(marketPrices.map(p => p.region_id)));
  
  const filteredPrices = selectedRegion === 'all'
    ? marketPrices
    : marketPrices.filter(p => p.region_id === selectedRegion);

  const getCropName = (cropId: string) => {
    const crop = crops.find(c => c.crop_id === cropId);
    if (!crop) return cropId;
    
    switch (language) {
      case 'hi':
        return crop.crop_name_hi;
      case 'od':
        return crop.crop_name_od;
      case 'ta':
        return crop.crop_name_ta;
      default:
        return crop.crop_name;
    }
  };

  const getRegionName = (regionId: string) => {
    const region = regions.find(r => r.region_id === regionId);
    if (!region) return regionId;
    
    switch (language) {
      case 'hi':
        return `${region.state_name_hi}, ${region.district_name}`;
      case 'od':
        return `${region.state_name_od}, ${region.district_name}`;
      case 'ta':
        return `${region.state_name_ta}, ${region.district_name}`;
      default:
        return `${region.state_name}, ${region.district_name}`;
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-5 w-5 text-green-600" />;
      case 'down':
        return <TrendingDown className="h-5 w-5 text-red-600" />;
      default:
        return <Minus className="h-5 w-5 text-gray-600" />;
    }
  };

  const getTrendBadge = (trend: string) => {
    switch (trend) {
      case 'up':
        return <Badge className="bg-green-100 text-green-800">Rising</Badge>;
      case 'down':
        return <Badge className="bg-red-100 text-red-800">Falling</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">Stable</Badge>;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl text-gray-900 mb-2">{t.marketTitle}</h1>
        <p className="text-xl text-gray-600">{t.marketSubtitle}</p>
      </div>

      {/* Region Filter */}
      <div className="mb-8 bg-white p-4 rounded-lg shadow">
        <label htmlFor="region-filter" className="text-sm text-gray-700 mb-2 block">
          Filter by region:
        </label>
        <select
          id="region-filter"
          value={selectedRegion}
          onChange={(e) => setSelectedRegion(e.target.value)}
          className="w-full md:w-auto px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
        >
          <option value="all">All Regions</option>
          {uniqueRegions.map((regionId) => (
            <option key={regionId} value={regionId}>
              {getRegionName(regionId)}
            </option>
          ))}
        </select>
      </div>

      {/* Prices Table */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-green-700 text-white">
              <tr>
                <th className="px-6 py-4 text-left">{t.crop}</th>
                <th className="px-6 py-4 text-left hidden md:table-cell">Region</th>
                <th className="px-6 py-4 text-right">{t.price}</th>
                <th className="px-6 py-4 text-center">{t.trend}</th>
                <th className="px-6 py-4 text-left hidden lg:table-cell">{t.lastUpdated}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredPrices.map((price) => (
                <tr key={price.price_id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-gray-900">{getCropName(price.crop_id)}</p>
                      <p className="text-sm text-gray-500 md:hidden">{getRegionName(price.region_id)}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600 hidden md:table-cell">
                    {getRegionName(price.region_id)}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end">
                      <DollarSign className="h-4 w-4 text-green-600 mr-1" />
                      <span className="text-lg text-gray-900">{price.current_price}</span>
                      <span className="text-sm text-gray-500 ml-1">{price.price_unit.replace('₹/', '/')}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center space-x-2">
                      {getTrendIcon(price.trend)}
                      <span className="hidden sm:inline">{getTrendBadge(price.trend)}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600 hidden lg:table-cell">
                    <div>
                      <p>{new Date(price.last_updated).toLocaleDateString()}</p>
                      <p className="text-xs text-gray-500">{t.source}: {price.source}</p>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredPrices.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <DollarSign className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No price data available for the selected region.</p>
        </div>
      )}

      {/* Disclaimer */}
      <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <p className="text-sm text-yellow-800">
          <strong>Note:</strong> Market prices are indicative and may vary. Please verify with local mandis for actual rates.
        </p>
      </div>
    </div>
  );
}
