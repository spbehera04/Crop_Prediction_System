import React, { useState } from 'react';
import { ExternalLink, FileText, CheckCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { translations } from '../utils/translations';
import { governmentSchemes } from '../data/schemes';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

export function GovernmentSchemes() {
  const { language } = useApp();
  const t = translations[language];
  const [selectedCrop, setSelectedCrop] = useState<string>('all');

  const cropTypes = ['all', 'wheat', 'rice', 'cotton', 'sugarcane', 'maize', 'potato', 'tomato', 'pulses'];

  const filteredSchemes = selectedCrop === 'all'
    ? governmentSchemes
    : governmentSchemes.filter(scheme => 
        scheme.crop_types.includes(selectedCrop) || scheme.crop_types.includes('All crops')
      );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl text-gray-900 mb-2">{t.schemesTitle}</h1>
        <p className="text-xl text-gray-600">{t.schemesSubtitle}</p>
      </div>

      {/* Filter by Crop */}
      <div className="mb-8 bg-white p-4 rounded-lg shadow">
        <p className="text-sm text-gray-700 mb-3">Filter by crop type:</p>
        <div className="flex flex-wrap gap-2">
          {cropTypes.map(crop => (
            <Button
              key={crop}
              variant={selectedCrop === crop ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCrop(crop)}
              className={selectedCrop === crop ? 'bg-green-600 hover:bg-green-700' : ''}
            >
              {crop === 'all' ? 'All Crops' : crop.charAt(0).toUpperCase() + crop.slice(1)}
            </Button>
          ))}
        </div>
      </div>

      {/* Schemes Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {filteredSchemes.map((scheme) => (
          <div key={scheme.scheme_id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
            <div className="bg-gradient-to-r from-green-600 to-green-700 p-6 text-white">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-xl mb-2">{scheme.scheme_name[language]}</h3>
                  <div className="flex flex-wrap gap-2">
                    {scheme.region_applicable.map((region, i) => (
                      <Badge key={i} variant="secondary" className="bg-green-500 text-white">
                        {region}
                      </Badge>
                    ))}
                  </div>
                </div>
                <FileText className="h-8 w-8 opacity-80" />
              </div>
            </div>

            <div className="p-6">
              {/* Description */}
              <p className="text-gray-600 mb-4">
                {scheme.description[language]}
              </p>

              {/* Applicable Crops */}
              <div className="mb-4">
                <p className="text-sm text-gray-700 mb-2">Applicable crops:</p>
                <div className="flex flex-wrap gap-2">
                  {scheme.crop_types.slice(0, 5).map((crop, i) => (
                    <Badge key={i} variant="outline" className="border-green-600 text-green-700">
                      {crop}
                    </Badge>
                  ))}
                  {scheme.crop_types.length > 5 && (
                    <Badge variant="outline" className="border-gray-400 text-gray-600">
                      +{scheme.crop_types.length - 5} more
                    </Badge>
                  )}
                </div>
              </div>

              {/* Eligibility */}
              <div className="mb-6">
                <h4 className="text-gray-900 mb-2">{t.eligibility}:</h4>
                <ul className="space-y-1">
                  {scheme.eligibility.map((item, i) => (
                    <li key={i} className="flex items-start text-sm text-gray-600">
                      <CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Button */}
              <Button
                className="w-full bg-green-600 hover:bg-green-700 text-white"
                onClick={() => window.open(scheme.link, '_blank')}
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                {t.learnMore}
              </Button>
            </div>
          </div>
        ))}
      </div>

      {filteredSchemes.length === 0 && (
        <div className="text-center py-12">
          <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No schemes found for the selected crop type.</p>
        </div>
      )}
    </div>
  );
}
