export interface Crop {
  crop_id: string;
  crop_name: string;
  crop_name_hi: string;
  crop_name_od: string;
  crop_name_ta: string;
  ideal_temp_min: number;
  ideal_temp_max: number;
  rainfall_min: number;
  rainfall_max: number;
  humidity_min: number;
  humidity_max: number;
  soil_type: string[];
  yield_potential: string;
  harvest_days: number;
  crop_image_url: string;
}

export interface CropDetail {
  crop_id: string;
  language_code: string;
  description: string;
  benefits: string[];
  diseases: string[];
  prevention_tips: string[];
  best_practices: string[];
}

export interface Region {
  region_id: string;
  state_name: string;
  state_name_hi: string;
  state_name_od: string;
  state_name_ta: string;
  district_name: string;
  state_code: string;
  avg_temp: number;
  avg_rainfall: number;
  avg_humidity: number;
  soil_types: string[];
}

export interface GovernmentScheme {
  scheme_id: string;
  scheme_name: {
    en: string;
    hi: string;
    od: string;
    ta: string;
  };
  crop_types: string[];
  region_applicable: string[];
  description: {
    en: string;
    hi: string;
    od: string;
    ta: string;
  };
  eligibility: string[];
  link: string;
}

export interface MarketPrice {
  price_id: string;
  crop_id: string;
  region_id: string;
  current_price: number;
  price_unit: string;
  last_updated: string;
  source: string;
  trend: 'up' | 'down' | 'stable';
}

export interface Recommendation {
  crop: Crop;
  confidence: number;
  reasoning: string;
  marketPrice?: MarketPrice;
}

export interface PredictionInput {
  temperature: number;
  rainfall: number;
  humidity: number;
  region_id?: string;
  soil_type?: string;
}

export type Language = 'en' | 'hi' | 'od' | 'ta';
