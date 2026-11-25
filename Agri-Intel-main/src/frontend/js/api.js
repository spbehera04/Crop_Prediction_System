// API Client for AgriIntel Backend
const API_BASE_URL = window.location.origin.includes('localhost') || window.location.origin.includes('127.0.0.1')
    ? 'http://localhost:5000'
    : window.location.origin;

const API = {
    // Get all regions
    async getRegions() {
        try {
            const response = await fetch(`${API_BASE_URL}/api/regions`);
            if (!response.ok) throw new Error('Failed to fetch regions');
            return await response.json();
        } catch (error) {
            console.error('API Error (getRegions):', error);
            // Return cached data if available
            return this.getCachedData('regions') || [];
        }
    },

    // Get all crops
    async getCrops() {
        try {
            const response = await fetch(`${API_BASE_URL}/api/crops`);
            if (!response.ok) throw new Error('Failed to fetch crops');
            return await response.json();
        } catch (error) {
            console.error('API Error (getCrops):', error);
            return this.getCachedData('crops') || [];
        }
    },

    // Get crop recommendations
    async getRecommendations(params) {
        try {
            const response = await fetch(`${API_BASE_URL}/api/recommend`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(params)
            });
            if (!response.ok) throw new Error('Failed to get recommendations');
            const data = await response.json();
            
            // Cache the result
            this.cacheData('lastRecommendation', data);
            
            return data;
        } catch (error) {
            console.error('API Error (getRecommendations):', error);
            throw error;
        }
    },

    // Get prediction history
    async getHistory() {
        try {
            const response = await fetch(`${API_BASE_URL}/api/history`);
            if (!response.ok) throw new Error('Failed to fetch history');
            return await response.json();
        } catch (error) {
            console.error('API Error (getHistory):', error);
            return this.getCachedData('history') || [];
        }
    },

    // Get government schemes
    async getSchemes(state = '', category = '') {
        try {
            const params = new URLSearchParams();
            if (state) params.append('state', state);
            if (category) params.append('category', category);
            
            const response = await fetch(`${API_BASE_URL}/api/schemes?${params}`);
            if (!response.ok) throw new Error('Failed to fetch schemes');
            const data = await response.json();
            
            // Cache schemes
            this.cacheData('schemes', data);
            
            return data;
        } catch (error) {
            console.error('API Error (getSchemes):', error);
            return this.getCachedData('schemes') || [];
        }
    },

    // Get market prices
    async getMarketPrices(state = '', crop = '') {
        try {
            const params = new URLSearchParams();
            if (state) params.append('state', state);
            if (crop) params.append('crop', crop);
            
            const response = await fetch(`${API_BASE_URL}/api/market-prices?${params}`);
            if (!response.ok) throw new Error('Failed to fetch market prices');
            const data = await response.json();
            
            // Cache prices
            this.cacheData('marketPrices', data);
            
            return data;
        } catch (error) {
            console.error('API Error (getMarketPrices):', error);
            return this.getCachedData('marketPrices') || [];
        }
    },

    // Send chat message
    async sendChatMessage(message) {
        try {
            const response = await fetch(`${API_BASE_URL}/api/chatbot`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message })
            });
            if (!response.ok) throw new Error('Failed to send chat message');
            return await response.json();
        } catch (error) {
            console.error('API Error (sendChatMessage):', error);
            return {
                response: 'I\'m currently offline. I can help with questions about weather, irrigation, fertilizers, pests, soil health, subsidies, market prices, and crop seasons when connection is restored.',
                timestamp: new Date().toISOString()
            };
        }
    },

    // Get weather data
    async getWeather(state, district) {
        try {
            const params = new URLSearchParams({ state, district });
            const response = await fetch(`${API_BASE_URL}/api/weather?${params}`);
            if (!response.ok) throw new Error('Failed to fetch weather');
            return await response.json();
        } catch (error) {
            console.error('API Error (getWeather):', error);
            throw error;
        }
    },

    // Cache management using localStorage
    cacheData(key, data) {
        try {
            localStorage.setItem(`agriintel_${key}`, JSON.stringify(data));
        } catch (error) {
            console.error('Cache Error:', error);
        }
    },

    getCachedData(key) {
        try {
            const data = localStorage.getItem(`agriintel_${key}`);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error('Cache Error:', error);
            return null;
        }
    }
};

// Check online status
window.addEventListener('online', () => {
    const indicator = document.querySelector('.offline-indicator');
    if (indicator) {
        indicator.remove();
    }
    console.log('Back online');
});

window.addEventListener('offline', () => {
    // Show offline indicator
    if (!document.querySelector('.offline-indicator')) {
        const indicator = document.createElement('div');
        indicator.className = 'offline-indicator fixed bottom-4 right-4 bg-yellow-500 text-white px-6 py-3 rounded-lg shadow-lg font-medium z-[1000]';
        indicator.textContent = '📡 Offline Mode - Using cached data';
        document.body.appendChild(indicator);
    }
    console.log('Gone offline - using cached data');
});
