import { Crop, PredictionInput, Recommendation } from '../types';
import { crops } from '../data/crops';
import { marketPrices } from '../data/marketPrices';

interface CropScore {
  crop: Crop;
  score: number;
  tempMatch: number;
  rainfallMatch: number;
  humidityMatch: number;
}

/**
 * Calculate how well a value matches a range (0-100)
 */
function calculateRangeMatch(value: number, min: number, max: number): number {
  if (value >= min && value <= max) {
    return 100; // Perfect match
  }
  
  const range = max - min;
  const midpoint = (min + max) / 2;
  const distance = Math.abs(value - midpoint);
  const maxDistance = range;
  
  // Allow some tolerance (20% beyond range)
  const tolerance = range * 0.2;
  const totalAllowedDistance = maxDistance + tolerance;
  
  if (distance > totalAllowedDistance) {
    return 0; // Too far from ideal range
  }
  
  // Linear decrease from 100 to 0
  const matchPercentage = Math.max(0, 100 - (distance / totalAllowedDistance) * 100);
  return matchPercentage;
}

/**
 * Calculate confidence score for a crop based on input parameters
 */
function calculateCropScore(crop: Crop, input: PredictionInput): CropScore {
  const tempMatch = calculateRangeMatch(
    input.temperature,
    crop.ideal_temp_min,
    crop.ideal_temp_max
  );
  
  const rainfallMatch = calculateRangeMatch(
    input.rainfall,
    crop.rainfall_min,
    crop.rainfall_max
  );
  
  const humidityMatch = calculateRangeMatch(
    input.humidity,
    crop.humidity_min,
    crop.humidity_max
  );
  
  // Weighted average: temperature (40%), rainfall (35%), humidity (25%)
  const score = (tempMatch * 0.4) + (rainfallMatch * 0.35) + (humidityMatch * 0.25);
  
  return {
    crop,
    score,
    tempMatch,
    rainfallMatch,
    humidityMatch,
  };
}

/**
 * Generate reasoning text for a recommendation
 */
function generateReasoning(cropScore: CropScore, input: PredictionInput): string {
  const { crop, tempMatch, rainfallMatch, humidityMatch } = cropScore;
  
  const reasons: string[] = [];
  
  if (tempMatch > 80) {
    reasons.push(`Temperature (${input.temperature}°C) is ideal for ${crop.crop_name}`);
  } else if (tempMatch > 50) {
    reasons.push(`Temperature is acceptable for ${crop.crop_name}`);
  }
  
  if (rainfallMatch > 80) {
    reasons.push(`Rainfall (${input.rainfall}mm) matches perfectly`);
  } else if (rainfallMatch > 50) {
    reasons.push(`Rainfall is within workable range`);
  }
  
  if (humidityMatch > 80) {
    reasons.push(`Humidity (${input.humidity}%) is optimal`);
  } else if (humidityMatch > 50) {
    reasons.push(`Humidity conditions are suitable`);
  }
  
  if (reasons.length === 0) {
    reasons.push(`Moderate conditions for ${crop.crop_name} cultivation`);
  }
  
  return reasons.join('. ') + '.';
}

/**
 * Get market price for a crop in a region
 */
function getMarketPrice(cropId: string, regionId?: string) {
  if (!regionId) return undefined;
  
  const price = marketPrices.find(
    p => p.crop_id === cropId && p.region_id === regionId
  );
  
  return price;
}

/**
 * Main recommendation engine
 */
export function generateRecommendations(input: PredictionInput): Recommendation[] {
  // Calculate scores for all crops
  const cropScores = crops.map(crop => calculateCropScore(crop, input));
  
  // Sort by score (highest first)
  cropScores.sort((a, b) => b.score - a.score);
  
  // Take top 3 crops
  const topCrops = cropScores.slice(0, 3);
  
  // Convert to recommendations
  const recommendations: Recommendation[] = topCrops.map(cropScore => {
    const confidence = Math.round(cropScore.score);
    const reasoning = generateReasoning(cropScore, input);
    const marketPrice = getMarketPrice(cropScore.crop.crop_id, input.region_id);
    
    return {
      crop: cropScore.crop,
      confidence,
      reasoning,
      marketPrice,
    };
  });
  
  return recommendations;
}

/**
 * Store prediction in localStorage for offline access
 */
export function storePrediction(input: PredictionInput, recommendations: Recommendation[]) {
  try {
    const history = getPredictionHistory();
    const newPrediction = {
      id: Date.now().toString(),
      input,
      recommendations,
      timestamp: new Date().toISOString(),
    };
    
    // Keep only last 10 predictions
    const updatedHistory = [newPrediction, ...history].slice(0, 10);
    localStorage.setItem('agriintel_predictions', JSON.stringify(updatedHistory));
  } catch (error) {
    console.error('Error storing prediction:', error);
  }
}

/**
 * Get prediction history from localStorage
 */
export function getPredictionHistory() {
  try {
    const data = localStorage.getItem('agriintel_predictions');
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error loading prediction history:', error);
    return [];
  }
}
