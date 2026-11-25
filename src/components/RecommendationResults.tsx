import React, { useState } from 'react';
import { TrendingUp, TrendingDown, Minus, Calendar, Leaf, AlertTriangle, Shield, CheckCircle, DollarSign } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { translations } from '../utils/translations';
import { Recommendation } from '../types';
import { cropDetails } from '../data/crops';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from './ui/accordion';

interface RecommendationResultsProps {
  recommendations: Recommendation[];
}

export function RecommendationResults({ recommendations }: RecommendationResultsProps) {
  const { language } = useApp();
  const t = translations[language];

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'down':
        return <TrendingDown className="h-4 w-4 text-red-600" />;
      default:
        return <Minus className="h-4 w-4 text-gray-600" />;
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return 'bg-green-100 text-green-800';
    if (confidence >= 60) return 'bg-yellow-100 text-yellow-800';
    return 'bg-orange-100 text-orange-800';
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

  const getCropDetails = (cropId: string) => {
    const langCode = language === 'en' ? 'en' : language === 'hi' ? 'hi' : 'en';
    return cropDetails.find(d => d.crop_id === cropId && d.language_code === langCode) ||
           cropDetails.find(d => d.crop_id === cropId && d.language_code === 'en');
  };

  return (
    <div className="max-w-6xl mx-auto">
      <h2 className="text-3xl text-gray-900 mb-8 text-center">{t.recommendedCrops}</h2>
      
      <div className="grid gap-6 md:gap-8">
        {recommendations.map((rec, index) => {
          const details = getCropDetails(rec.crop.crop_id);
          
          return (
            <div key={index} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              <div className="grid md:grid-cols-3 gap-6">
                {/* Crop Image */}
                <div className="relative h-64 md:h-auto">
                  <img
                    src={rec.crop.crop_image_url}
                    alt={getCropName(rec.crop)}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 left-4">
                    <Badge className={`${getConfidenceColor(rec.confidence)} text-lg px-3 py-1`}>
                      {rec.confidence}% {t.confidence}
                    </Badge>
                  </div>
                  <div className="absolute top-4 right-4">
                    <span className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
                      #{index + 1}
                    </span>
                  </div>
                </div>

                {/* Crop Info */}
                <div className="md:col-span-2 p-6">
                  <div className="mb-4">
                    <h3 className="text-2xl text-gray-900 mb-2">
                      {getCropName(rec.crop)}
                    </h3>
                    <p className="text-gray-600">{rec.reasoning}</p>
                  </div>

                  {/* Quick Stats */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-green-50 p-3 rounded-lg">
                      <div className="flex items-center text-green-700 mb-1">
                        <Leaf className="h-4 w-4 mr-1" />
                        <span className="text-sm">{t.yieldPotential}</span>
                      </div>
                      <p className="text-sm">{rec.crop.yield_potential}</p>
                    </div>

                    <div className="bg-blue-50 p-3 rounded-lg">
                      <div className="flex items-center text-blue-700 mb-1">
                        <Calendar className="h-4 w-4 mr-1" />
                        <span className="text-sm">{t.harvestDays}</span>
                      </div>
                      <p className="text-sm">{rec.crop.harvest_days} {t.days}</p>
                    </div>

                    <div className="bg-purple-50 p-3 rounded-lg col-span-2">
                      <div className="flex items-center text-purple-700 mb-1">
                        <span className="text-sm">{t.soilTypes}</span>
                      </div>
                      <p className="text-sm">{rec.crop.soil_type.join(', ')}</p>
                    </div>
                  </div>

                  {/* Market Price */}
                  {rec.marketPrice && (
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 p-4 rounded-lg mb-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <DollarSign className="h-5 w-5 text-green-600 mr-2" />
                          <span className="text-green-900">{t.marketPrice}</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <span className="text-2xl text-green-700">
                            {rec.marketPrice.current_price} {rec.marketPrice.price_unit}
                          </span>
                          {getTrendIcon(rec.marketPrice.trend)}
                        </div>
                      </div>
                      <p className="text-sm text-green-700 mt-1">
                        {t.lastUpdated}: {new Date(rec.marketPrice.last_updated).toLocaleDateString()} • {t.source}: {rec.marketPrice.source}
                      </p>
                    </div>
                  )}

                  {/* Detailed Information Accordion */}
                  {details && (
                    <Accordion type="single" collapsible className="w-full">
                      <AccordionItem value="details">
                        <AccordionTrigger>{t.viewMore}</AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-4 pt-2">
                            {/* Description */}
                            <div>
                              <h4 className="text-gray-900 mb-2">{t.cropDetails}</h4>
                              <p className="text-gray-600">{details.description}</p>
                            </div>

                            {/* Benefits */}
                            <div>
                              <h4 className="flex items-center text-gray-900 mb-2">
                                <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                                {t.benefits}
                              </h4>
                              <ul className="list-disc list-inside space-y-1 text-gray-600">
                                {details.benefits.map((benefit, i) => (
                                  <li key={i}>{benefit}</li>
                                ))}
                              </ul>
                            </div>

                            {/* Diseases */}
                            <div>
                              <h4 className="flex items-center text-gray-900 mb-2">
                                <AlertTriangle className="h-4 w-4 mr-2 text-orange-600" />
                                {t.diseases}
                              </h4>
                              <ul className="list-disc list-inside space-y-1 text-gray-600">
                                {details.diseases.map((disease, i) => (
                                  <li key={i}>{disease}</li>
                                ))}
                              </ul>
                            </div>

                            {/* Prevention Tips */}
                            <div>
                              <h4 className="flex items-center text-gray-900 mb-2">
                                <Shield className="h-4 w-4 mr-2 text-blue-600" />
                                {t.prevention}
                              </h4>
                              <ul className="list-disc list-inside space-y-1 text-gray-600">
                                {details.prevention_tips.map((tip, i) => (
                                  <li key={i}>{tip}</li>
                                ))}
                              </ul>
                            </div>

                            {/* Best Practices */}
                            <div>
                              <h4 className="text-gray-900 mb-2">{t.bestPractices}</h4>
                              <ul className="list-disc list-inside space-y-1 text-gray-600">
                                {details.best_practices.map((practice, i) => (
                                  <li key={i}>{practice}</li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
