# AgriIntel - Smart Crop Recommendation System

A comprehensive AI-powered crop recommendation web application designed specifically for Indian farmers, featuring multilingual support, offline capabilities, and integration with government schemes and market prices.

## 🌾 Features

### Core Functionality
- **Smart Crop Recommendations**: Rule-based algorithm that analyzes temperature, rainfall, and humidity to recommend the top 3 most suitable crops
- **Confidence Scoring**: Each recommendation includes a confidence percentage based on how well conditions match ideal crop requirements
- **Regional Customization**: Select from 19+ Indian states and districts for location-specific recommendations

### Multilingual Support
- Available in **4 languages**: English, Hindi (हिन्दी), Odia (ଓଡ଼ିଆ), Tamil (தமிழ்)
- All crop names, UI elements, and agricultural information translated
- Language preference persisted across sessions

### Voice Input
- Voice-to-text input for temperature, rainfall, and humidity fields
- Supports multiple Indian languages
- Perfect for farmers with limited literacy

### Government Schemes Integration
- 8+ major government agricultural schemes
- Eligibility criteria and application links
- Filter schemes by crop type
- Multilingual scheme information

### Market Intelligence
- Real-time market prices for major crops
- Price trends (rising, falling, stable)
- Region-wise pricing data
- Data sourced from Agmarknet

### Offline Mode
- Progressive Web App (PWA) capabilities
- Offline prediction history (last 10 predictions)
- Works without internet connection using cached data
- Installable on mobile devices

### Chat Assistant
- Built-in farming chatbot for instant answers
- Quick questions for common farming queries
- Context-aware responses about planting, fertilizers, irrigation, and pest control
- Multilingual chat support

## 📊 Crop Database

Includes comprehensive data for 10 major crops:
- **Cereals**: Wheat, Rice, Maize, Pearl Millet (Bajra)
- **Cash Crops**: Cotton, Sugarcane, Groundnut
- **Vegetables**: Potato, Tomato
- **Pulses**: Lentils

Each crop includes:
- Ideal temperature, rainfall, and humidity ranges
- Suitable soil types
- Yield potential
- Harvest duration
- Common diseases and prevention tips
- Best practices for cultivation
- Benefits and agricultural information

## 🗺️ Regional Coverage

19 regions across major agricultural states:
- Punjab (Ludhiana, Amritsar)
- Haryana (Karnal)
- Uttar Pradesh (Meerut, Varanasi)
- West Bengal (Bardhaman)
- Odisha (Cuttack, Bhubaneswar)
- Tamil Nadu (Chennai, Coimbatore)
- Maharashtra (Nagpur, Nashik)
- Gujarat (Ahmedabad)
- Rajasthan (Jaipur)
- Madhya Pradesh (Indore)
- Karnataka (Bangalore)
- Andhra Pradesh (Vijayawada)
- Telangana (Hyderabad)
- Bihar (Patna)

## 🛠️ Technology Stack

- **Frontend**: React 18+ with TypeScript
- **Styling**: Tailwind CSS v4.0
- **UI Components**: shadcn/ui component library
- **Icons**: Lucide React
- **State Management**: React Context API
- **Data Storage**: LocalStorage for offline capabilities
- **PWA**: Service Workers for offline functionality

## 🚀 How It Works

1. **Select Region**: Choose your state and district from the dropdown
2. **Auto-detect Location**: Use geolocation to automatically detect your region (optional)
3. **Fetch Weather**: Auto-populate current weather data for your region (optional)
4. **Input Parameters**: 
   - Temperature (0-50°C) via slider or voice input
   - Rainfall (0-3000mm) via slider or voice input
   - Humidity (0-100%) via slider or voice input
5. **Get Recommendations**: System analyzes data and provides top 3 crop recommendations
6. **View Details**: Expand each recommendation to see:
   - Crop description and benefits
   - Soil requirements
   - Common diseases and prevention
   - Best cultivation practices
   - Current market prices (if available for your region)

## 📱 Progressive Web App

AgriIntel can be installed as a Progressive Web App on mobile devices:
- Add to home screen for quick access
- Works offline with cached data
- App-like experience
- Fast loading times

## 🌐 API Integration (Production-Ready)

The application is designed to integrate with:
- **OpenAI/Claude API**: For AI-powered crop recommendations
- **OpenWeatherMap API**: For real-time weather data
- **Agmarknet API**: For live market prices
- **Google Translate API**: For enhanced multilingual support

Currently uses mock data and rule-based algorithms for demonstration purposes.

## 🔒 Data & Privacy

- No personal data collection
- All prediction history stored locally
- No user accounts required
- Privacy-first design

## 📞 Support

For agricultural support, contact:
- **Kisan Call Center**: 1800-180-1551
- Visit your nearest **Krishi Vigyan Kendra**

## 🎯 Target Users

- Small and marginal farmers
- Agricultural extension workers
- Farming cooperatives
- Agricultural students and researchers
- Rural development organizations

## 💡 Future Enhancements

- Integration with real AI models (GPT-4, Claude)
- Soil testing integration
- Weather forecast integration
- Crop disease detection using image recognition
- Marketplace for buying/selling produce
- Direct integration with bank accounts for scheme applications
- SMS-based recommendations for feature phone users

---

**Built with ❤️ for Indian farmers**
