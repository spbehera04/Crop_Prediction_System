# AgriIntel - Smart Crop Recommendation System

A comprehensive web application for Indian farmers that provides AI-powered crop recommendations based on temperature, rainfall, humidity, and regional data.

## Architecture

**Backend:** Flask (Python)
**Frontend:** HTML, CSS, JavaScript (Vanilla JS)

## Features

- 🌾 **AI-Powered Crop Recommendations** - Smart recommendations based on scientific data
- 🌍 **Regional Data** - Covers all major Indian states and districts
- 🎤 **Voice Input** - Speak in your language (English, Hindi, Odia, Tamil)
- 📱 **PWA Capabilities** - Install on mobile devices, works offline
- 🌐 **Multilingual Support** - English, Hindi, Odia, Tamil
- 💬 **Chatbot Assistant** - Rule-based farming questions and answers
- 📊 **Market Prices** - Current crop prices across India
- 🏛️ **Government Schemes** - Database of agricultural schemes
- 📜 **Prediction History** - Track your past recommendations
- 🔌 **Offline Mode** - Works without internet using cached data

## Project Structure

```
├── backend/
│   ├── app.py                 # Flask application
│   ├── requirements.txt       # Python dependencies
│   └── data/
│       ├── crops.json        # Crop database
│       ├── regions.json      # Regional data
│       ├── schemes.json      # Government schemes
│       └── market_prices.json # Market prices
│
├── frontend/
│   ├── index.html            # Main HTML file
│   ├── manifest.json         # PWA manifest
│   ├── sw.js                 # Service worker
│   ├── css/
│   │   └── styles.css        # All styles
│   └── js/
│       ├── app.js            # Main application logic
│       ├── api.js            # API client
│       ├── voice.js          # Voice input handling
│       ├── translations.js   # Multilingual support
│       └── pwa.js            # PWA functionality
│
└── README_NEW.md             # This file
```

## Installation & Setup

### Prerequisites

- Python 3.8 or higher
- Modern web browser (Chrome, Edge, Safari, or Firefox)

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Create a virtual environment (recommended):**
   ```bash
   python -m venv venv
   
   # On Windows:
   venv\Scripts\activate
   
   # On macOS/Linux:
   source venv/bin/activate
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Run the Flask server:**
   ```bash
   python app.py
   ```

   The backend will start at `http://localhost:5000`

### Frontend Access

1. **Open your browser and navigate to:**
   ```
   http://localhost:5000
   ```

   The Flask server serves both the API and frontend files.

2. **For development, you can also run a separate server:**
   ```bash
   cd frontend
   python -m http.server 8000
   ```
   
   Then access at `http://localhost:8000` (Note: Update API_BASE_URL in api.js)

## Usage Guide

### 1. Getting Crop Recommendations

1. Navigate to the "Recommend" tab
2. Select your state and district (or use auto-detect location)
3. Either:
   - Fetch current weather data automatically, OR
   - Enter temperature, rainfall, and humidity manually
4. Select your soil type
5. Click "Get Recommendations"
6. View recommended crops with suitability scores and reasons

### 2. Voice Input

- Click the microphone icon next to any input field
- Speak your value clearly
- The system will transcribe and fill the field

### 3. Chatbot Assistant

- Go to the Home page
- Type or speak your farming questions
- Get instant answers about:
  - Weather patterns
  - Irrigation methods
  - Fertilizers
  - Pest control
  - Soil health
  - Government subsidies
  - Market prices
  - Crop seasons

### 4. Government Schemes

- Navigate to "Schemes" tab
- Filter by state or category
- View eligibility, benefits, and links to official websites

### 5. Market Prices

- Navigate to "Prices" tab
- Filter by state or search for specific crops
- View current prices and trends (up/down/stable)

### 6. Prediction History

- Navigate to "History" tab
- View all your past recommendations
- See input parameters and results

### 7. Language Selection

- Click the language dropdown in the header
- Select: English, हिंदी, ଓଡ଼ିଆ, or தமிழ்
- All interface text will update

### 8. Install as Mobile App

- On supported browsers, click the install button in header
- Or use browser's "Add to Home Screen" option
- Works offline once installed!

## API Endpoints

### GET `/api/regions`
Get all regions (states and districts)

### GET `/api/crops`
Get all crops data

### POST `/api/recommend`
Get crop recommendations based on parameters
```json
{
  "temperature": 28,
  "rainfall": 1200,
  "humidity": 75,
  "soil_type": "Loamy",
  "state": "Odisha",
  "district": "Cuttack"
}
```

### GET `/api/history`
Get prediction history

### GET `/api/schemes?state=&category=`
Get government schemes (filtered)

### GET `/api/market-prices?state=&crop=`
Get market prices (filtered)

### POST `/api/chatbot`
Send chat message
```json
{
  "message": "How to control pests?"
}
```

### GET `/api/weather?state=&district=`
Get mock weather data for a region

## Technologies Used

### Backend
- **Flask** - Python web framework
- **Flask-CORS** - Cross-origin resource sharing

### Frontend
- **HTML5** - Semantic markup
- **Tailwind CSS** - Utility-first CSS framework (via CDN)
- **Vanilla JavaScript** - No frameworks, pure JS
- **Web Speech API** - Voice input
- **Service Workers** - Offline functionality
- **LocalStorage** - Data caching

## Browser Support

- ✅ Chrome 90+
- ✅ Edge 90+
- ✅ Safari 14+
- ✅ Firefox 88+
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## Offline Functionality

The application uses:
- **Service Workers** to cache static assets
- **LocalStorage** to cache API responses
- **Offline indicator** shows when using cached data
- All features work offline after first load

## Security Notes

- This is a demonstration application
- Mock data is used for recommendations
- Do not collect sensitive PII
- Use HTTPS in production
- Implement proper authentication for production

## Customization

### Adding New Crops
Edit `backend/data/crops.json` and add crop data

### Adding New Regions
Edit `backend/data/regions.json` and add regional data

### Adding New Schemes
Edit `backend/data/schemes.json` and add scheme information

### Modifying Recommendation Algorithm
Edit the `recommend_crops()` function in `backend/app.py`

### Adding New Languages
1. Add translations in `frontend/js/translations.js`
2. Add language option in HTML
3. Update voice language codes

## Deployment

### For Production:

1. **Backend:**
   - Use a production WSGI server (Gunicorn, uWSGI)
   - Set up environment variables
   - Use a proper database (PostgreSQL, MongoDB)
   - Enable HTTPS

2. **Frontend:**
   - Minify CSS and JavaScript
   - Optimize images
   - Configure CDN if needed
   - Update API_BASE_URL for production

3. **Hosting Options:**
   - Heroku
   - PythonAnywhere
   - AWS (EC2, Elastic Beanstalk)
   - Google Cloud Platform
   - DigitalOcean

## Troubleshooting

### Backend doesn't start
- Ensure Python 3.8+ is installed
- Check if port 5000 is available
- Verify all dependencies are installed

### Voice input doesn't work
- Check browser supports Web Speech API
- Ensure microphone permissions are granted
- Try using HTTPS (required for some browsers)

### Offline mode not working
- Ensure service worker is registered
- Check browser console for errors
- Clear cache and reload

### API calls fail
- Verify backend is running
- Check browser console for CORS errors
- Ensure API_BASE_URL is correct

## Contributing

Contributions are welcome! Areas for improvement:
- Real weather API integration
- Database integration
- User authentication
- Advanced ML recommendations
- More languages
- Mobile app version

## License

This project is for educational and demonstration purposes.

## Contact

For questions or support, please open an issue in the repository.

---

Built with ❤️ for Indian Farmers
