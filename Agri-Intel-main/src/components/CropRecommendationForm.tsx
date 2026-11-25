import React, { useState, useEffect } from 'react';
import { MapPin, Cloud, Loader2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { translations } from '../utils/translations';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Slider } from './ui/slider';
import { VoiceInput } from './VoiceInput';
import { regions } from '../data/regions';
import { PredictionInput } from '../types';

interface CropRecommendationFormProps {
  onSubmit: (input: PredictionInput) => void;
}

export function CropRecommendationForm({ onSubmit }: CropRecommendationFormProps) {
  const { language } = useApp();
  const t = translations[language];
  
  const [temperature, setTemperature] = useState(25);
  const [rainfall, setRainfall] = useState(800);
  const [humidity, setHumidity] = useState(65);
  const [selectedState, setSelectedState] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [isFetchingWeather, setIsFetchingWeather] = useState(false);

  // Get unique states
  const states = Array.from(new Set(regions.map(r => r.state_name))).sort();
  
  // Get districts for selected state
  const districts = selectedState 
    ? regions.filter(r => r.state_name === selectedState).map(r => ({
        name: r.district_name,
        id: r.region_id
      }))
    : [];

  const handleAutoDetectLocation = () => {
    setIsGettingLocation(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // Simulate region detection (in real app, would use reverse geocoding)
          const randomRegion = regions[Math.floor(Math.random() * regions.length)];
          setSelectedState(randomRegion.state_name);
          setTimeout(() => {
            setSelectedDistrict(randomRegion.district_name);
          }, 100);
          setIsGettingLocation(false);
        },
        (error) => {
          let errorMessage = 'Unable to detect location. Please select manually.';
          
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = 'Location permission denied. Please enable location access in your browser settings or select your region manually.';
              console.warn('Geolocation permission denied');
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = 'Location information unavailable. Please select your region manually.';
              console.warn('Geolocation position unavailable');
              break;
            case error.TIMEOUT:
              errorMessage = 'Location request timed out. Please select your region manually.';
              console.warn('Geolocation timeout');
              break;
            default:
              console.warn('Geolocation error:', error.message || 'Unknown error');
              break;
          }
          
          setIsGettingLocation(false);
          alert(errorMessage);
        },
        {
          enableHighAccuracy: false,
          timeout: 10000,
          maximumAge: 300000
        }
      );
    } else {
      setIsGettingLocation(false);
      alert('Geolocation is not supported by your browser. Please select your region manually.');
    }
  };

  const handleFetchWeather = () => {
    if (!selectedState || !selectedDistrict) {
      alert('Please select a region first');
      return;
    }
    
    setIsFetchingWeather(true);
    
    // Simulate weather API call
    setTimeout(() => {
      const region = regions.find(r => 
        r.state_name === selectedState && r.district_name === selectedDistrict
      );
      
      if (region) {
        setTemperature(region.avg_temp);
        setRainfall(region.avg_rainfall);
        setHumidity(region.avg_humidity);
      }
      
      setIsFetchingWeather(false);
    }, 1500);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const region = regions.find(r => 
      r.state_name === selectedState && r.district_name === selectedDistrict
    );
    
    onSubmit({
      temperature,
      rainfall,
      humidity,
      region_id: region?.region_id,
    });
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6 md:p-8">
      <h2 className="text-2xl text-gray-900 mb-6">{t.enterDetails}</h2>
      
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Region Selection */}
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="state">{t.selectState}</Label>
            <select
              id="state"
              value={selectedState}
              onChange={(e) => {
                setSelectedState(e.target.value);
                setSelectedDistrict('');
              }}
              className="w-full mt-2 px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="">{t.selectState}</option>
              {states.map((state) => (
                <option key={state} value={state}>
                  {state}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <Label htmlFor="district">{t.selectDistrict}</Label>
            <select
              id="district"
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              disabled={!selectedState}
              className="w-full mt-2 px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-100"
            >
              <option value="">{t.selectDistrict}</option>
              {districts.map((district) => (
                <option key={district.id} value={district.name}>
                  {district.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Auto-detect and Fetch Weather Buttons */}
        <div className="flex flex-wrap gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={handleAutoDetectLocation}
            disabled={isGettingLocation}
          >
            {isGettingLocation ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t.loading}
              </>
            ) : (
              <>
                <MapPin className="mr-2 h-4 w-4" />
                {t.autoDetect}
              </>
            )}
          </Button>
          
          <Button
            type="button"
            variant="outline"
            onClick={handleFetchWeather}
            disabled={isFetchingWeather || !selectedState || !selectedDistrict}
          >
            {isFetchingWeather ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t.loading}
              </>
            ) : (
              <>
                <Cloud className="mr-2 h-4 w-4" />
                {t.fetchWeather}
              </>
            )}
          </Button>
        </div>

        {/* Temperature */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <Label htmlFor="temperature">
              {t.temperature}: {temperature}{t.temperatureUnit}
            </Label>
            <VoiceInput onValue={setTemperature} fieldName="temperature" />
          </div>
          <Slider
            id="temperature"
            min={0}
            max={50}
            step={1}
            value={[temperature]}
            onValueChange={(values) => setTemperature(values[0])}
            className="mt-2"
          />
          <div className="flex justify-between mt-1 text-sm text-gray-500">
            <span>0°C</span>
            <span>50°C</span>
          </div>
        </div>

        {/* Rainfall */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <Label htmlFor="rainfall">
              {t.rainfall}: {rainfall}{t.rainfallUnit}
            </Label>
            <VoiceInput onValue={setRainfall} fieldName="rainfall" />
          </div>
          <Slider
            id="rainfall"
            min={0}
            max={3000}
            step={50}
            value={[rainfall]}
            onValueChange={(values) => setRainfall(values[0])}
            className="mt-2"
          />
          <div className="flex justify-between mt-1 text-sm text-gray-500">
            <span>0mm</span>
            <span>3000mm</span>
          </div>
        </div>

        {/* Humidity */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <Label htmlFor="humidity">
              {t.humidity}: {humidity}{t.humidityUnit}
            </Label>
            <VoiceInput onValue={setHumidity} fieldName="humidity" />
          </div>
          <Slider
            id="humidity"
            min={0}
            max={100}
            step={5}
            value={[humidity]}
            onValueChange={(values) => setHumidity(values[0])}
            className="mt-2"
          />
          <div className="flex justify-between mt-1 text-sm text-gray-500">
            <span>0%</span>
            <span>100%</span>
          </div>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          size="lg"
          className="w-full bg-green-600 hover:bg-green-700 text-white py-6"
        >
          {t.getRecommendations}
        </Button>
      </form>
    </div>
  );
}
