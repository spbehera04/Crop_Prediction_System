# ================================================
# Smart Farming Recommendation System - Backend API
# ================================================
# Author: Your Name
# Description: Flask backend for crop recommendation,
# weather info, market prices, chatbot, and schemes.
# ================================================

from flask import Flask, jsonify, request, send_from_directory
from datetime import datetime
import json
import os
import random

# Try to import CORS for cross-origin access (frontend requests)
try:
    from flask_cors import CORS
except ImportError:
    # No-op fallback if flask_cors not installed
    def CORS(app, *args, **kwargs):
        pass

# --------------------------------
# Initialize Flask app
# --------------------------------
app = Flask(__name__, static_folder='../frontend', static_url_path='')
CORS(app)

# --------------------------------
# Load JSON Data
# --------------------------------
DATA_PATH = os.path.join(os.path.dirname(__file__), 'data')

def load_json(filename):
    """Safely load JSON data from the data folder"""
    filepath = os.path.join(DATA_PATH, filename)
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            return json.load(f)
    except FileNotFoundError:
        print(f"[Warning] Missing data file: {filename}")
        return []
    except json.JSONDecodeError:
        print(f"[Error] Invalid JSON format in: {filename}")
        return []

CROPS_DATA = load_json('crops.json')
REGIONS_DATA = load_json('regions.json')
SCHEMES_DATA = load_json('schemes.json')
MARKET_PRICES_DATA = load_json('market_prices.json')

# In-memory storage for predictions (temporary; use DB in production)
predictions_history = []


# --------------------------------
# Routes
# --------------------------------

@app.route('/')
def serve_frontend():
    """Serve frontend index.html"""
    return send_from_directory('../frontend', 'index.html')


@app.route('/api/regions', methods=['GET'])
def get_regions():
    """Return list of all regions"""
    return jsonify(REGIONS_DATA)


@app.route('/api/crops', methods=['GET'])
def get_crops():
    """Return list of all crops"""
    return jsonify(CROPS_DATA)


@app.route('/api/recommend', methods=['POST'])
def recommend_crops():
    """
    Recommend crops based on input parameters:
    - temperature
    - rainfall
    - humidity
    - soil_type
    - state
    - district
    """
    data = request.json or {}

    # Input parsing
    temperature = float(data.get('temperature', 0))
    rainfall = float(data.get('rainfall', 0))
    humidity = float(data.get('humidity', 0))
    soil_type = data.get('soil_type', '')
    state = data.get('state', '')
    district = data.get('district', '')

    # Recommendation logic
    recommendations = []
    for crop in CROPS_DATA:
        score = 0
        reasons = []

        # Temperature scoring
        if crop['temp_min'] <= temperature <= crop['temp_max']:
            score += 30
            reasons.append('Optimal temperature')
        elif abs(temperature - (crop['temp_min'] + crop['temp_max']) / 2) <= 5:
            score += 15
            reasons.append('Acceptable temperature')

        # Rainfall scoring
        if crop['rainfall_min'] <= rainfall <= crop['rainfall_max']:
            score += 30
            reasons.append('Optimal rainfall')
        elif abs(rainfall - (crop['rainfall_min'] + crop['rainfall_max']) / 2) <= 200:
            score += 15
            reasons.append('Acceptable rainfall')

        # Humidity scoring
        if crop['humidity_min'] <= humidity <= crop['humidity_max']:
            score += 20
            reasons.append('Optimal humidity')

        # Soil type scoring
        if soil_type.lower() in [s.lower() for s in crop['soil_types']]:
            score += 20
            reasons.append(f'Suitable for {soil_type} soil')

        # Add to recommendations if score is significant
        if score >= 40:
            recommendations.append({
                'crop': crop,
                'score': score,
                'reasons': reasons,
                'suitability': (
                    'High' if score >= 70 else
                    'Medium' if score >= 50 else
                    'Low'
                )
            })

    # Sort and store history
    recommendations.sort(key=lambda x: x['score'], reverse=True)
    prediction = {
        'id': len(predictions_history) + 1,
        'timestamp': datetime.now().isoformat(),
        'input': {
            'temperature': temperature,
            'rainfall': rainfall,
            'humidity': humidity,
            'soil_type': soil_type,
            'state': state,
            'district': district
        },
        'recommendations': recommendations[:5]
    }
    predictions_history.append(prediction)

    return jsonify({
        'recommendations': recommendations[:10],
        'prediction_id': prediction['id']
    })


@app.route('/api/history', methods=['GET'])
def get_history():
    """Return all prediction history"""
    return jsonify(predictions_history)


@app.route('/api/schemes', methods=['GET'])
def get_schemes():
    """Return filtered government schemes"""
    state = request.args.get('state', '')
    category = request.args.get('category', '')

    filtered_schemes = SCHEMES_DATA

    if state:
        filtered_schemes = [
            s for s in filtered_schemes
            if s['state'] == state or s['state'] == 'All India'
        ]
    if category:
        filtered_schemes = [
            s for s in filtered_schemes if s['category'] == category
        ]

    return jsonify(filtered_schemes)


@app.route('/api/market-prices', methods=['GET'])
def get_market_prices():
    """Return crop market prices filtered by state/crop"""
    state = request.args.get('state', '')
    crop = request.args.get('crop', '')

    filtered_prices = MARKET_PRICES_DATA
    if state:
        filtered_prices = [p for p in filtered_prices if p['state'] == state]
    if crop:
        filtered_prices = [p for p in filtered_prices if crop.lower() in p['crop'].lower()]

    return jsonify(filtered_prices)


@app.route('/api/chatbot', methods=['POST'])
def chatbot():
    """Simple rule-based chatbot for farming queries"""
    data = request.json or {}
    message = data.get('message', '').lower()

    responses = {
        'weather': 'Weather affects crop yield. Always check rainfall and temperature before sowing.',
        'irrigation': 'Drip irrigation saves water; flood irrigation is used for rice fields.',
        'fertilizer': 'Use balanced NPK fertilizers or organic compost after soil testing.',
        'pest': 'Use neem-based pesticides and crop rotation for pest control.',
        'soil': 'Test soil every 2 years. Add organic matter to maintain fertility.',
        'subsidy': 'Visit the Schemes section for government subsidies on seeds and tools.',
        'price': 'You can check the Market Prices section for real-time crop prices.',
        'season': 'Kharif (monsoon), Rabi (winter), and Zaid (summer) are India’s main crop seasons.'
    }

    for keyword, response in responses.items():
        if keyword in message:
            return jsonify({'response': response, 'timestamp': datetime.now().isoformat()})

    return jsonify({
        'response': 'I can help with weather, irrigation, fertilizers, pests, soil, subsidies, or market prices.',
        'timestamp': datetime.now().isoformat()
    })


@app.route('/api/weather', methods=['GET'])
def get_weather():
    """Return mock weather data for given region"""
    state = request.args.get('state', '')
    district = request.args.get('district', '')

    weather = {
        'temperature': round(random.uniform(20, 35), 1),
        'rainfall': round(random.uniform(50, 300), 1),
        'humidity': round(random.uniform(50, 90), 1),
        'state': state,
        'district': district,
        'timestamp': datetime.now().isoformat()
    }
    return jsonify(weather)


# --------------------------------
# Run the Flask App
# --------------------------------
if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
