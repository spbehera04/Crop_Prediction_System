import React, { useState, useEffect } from 'react';
import { History, Trash2, Calendar } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { translations } from '../utils/translations';
import { getPredictionHistory } from '../utils/recommendationEngine';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

interface PredictionHistoryProps {
  onViewDetails: (prediction: any) => void;
}

export function PredictionHistory({ onViewDetails }: PredictionHistoryProps) {
  const { language } = useApp();
  const t = translations[language];
  const [history, setHistory] = useState<any[]>([]);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = () => {
    const data = getPredictionHistory();
    setHistory(data);
  };

  const clearHistory = () => {
    if (confirm('Are you sure you want to clear all prediction history?')) {
      localStorage.removeItem('agriintel_predictions');
      setHistory([]);
    }
  };

  const getCropName = (crop: any) => {
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

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl text-gray-900 mb-2">{t.historyTitle}</h1>
          <p className="text-xl text-gray-600">{t.historySubtitle}</p>
        </div>
        {history.length > 0 && (
          <Button variant="destructive" onClick={clearHistory}>
            <Trash2 className="h-4 w-4 mr-2" />
            Clear All
          </Button>
        )}
      </div>

      {history.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-lg shadow">
          <History className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <p className="text-xl text-gray-500 mb-2">{t.noHistory}</p>
          <p className="text-gray-400">Your crop recommendations will appear here</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {history.map((prediction) => (
            <div key={prediction.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center text-gray-600">
                    <Calendar className="h-5 w-5 mr-2" />
                    <span>{new Date(prediction.timestamp).toLocaleString()}</span>
                  </div>
                </div>

                {/* Input Parameters */}
                <div className="grid grid-cols-3 gap-4 mb-4 p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm text-gray-600">{t.temperature}</p>
                    <p className="text-lg text-gray-900">{prediction.input.temperature}°C</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">{t.rainfall}</p>
                    <p className="text-lg text-gray-900">{prediction.input.rainfall}mm</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">{t.humidity}</p>
                    <p className="text-lg text-gray-900">{prediction.input.humidity}%</p>
                  </div>
                </div>

                {/* Recommended Crops */}
                <div>
                  <h3 className="text-gray-900 mb-3">{t.recommendedCrops}:</h3>
                  <div className="grid md:grid-cols-3 gap-4">
                    {prediction.recommendations.map((rec: any, index: number) => (
                      <div key={index} className="relative">
                        <img
                          src={rec.crop.crop_image_url}
                          alt={getCropName(rec.crop)}
                          className="w-full h-32 object-cover rounded-lg"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-lg flex flex-col justify-end p-3">
                          <p className="text-white">{getCropName(rec.crop)}</p>
                          <Badge className="bg-white/90 text-gray-900 w-fit mt-1">
                            {rec.confidence}% {t.confidence}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* View Details Button */}
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => onViewDetails(prediction)}
                  >
                    {t.viewDetails}
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
