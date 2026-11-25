// Global state
let currentLanguage = 'en';
let regions = [];
let crops = [];
let schemes = [];
let marketPrices = [];
let history = [];

// Initialize app
document.addEventListener('DOMContentLoaded', async () => {
    await loadInitialData();
    setupEventListeners();
    setupNavigation();
    updateTranslations();
});

// Load initial data from API
async function loadInitialData() {
    try {
        showLoading();
        
        // Load regions
        regions = await API.getRegions();
        populateStateDropdown();
        populateSchemeStateFilter();
        populatePriceStateFilter();
        
        // Load crops
        crops = await API.getCrops();
        
        // Load schemes
        schemes = await API.getSchemes();
        displaySchemes(schemes);
        
        // Load market prices
        marketPrices = await API.getMarketPrices();
        displayMarketPrices(marketPrices);
        
        // Load history
        history = await API.getHistory();
        displayHistory(history);
        
        hideLoading();
    } catch (error) {
        console.error('Error loading initial data:', error);
        hideLoading();
    }
}

// Setup event listeners
function setupEventListeners() {
    // Language selector
    document.getElementById('languageSelector').addEventListener('change', (e) => {
        currentLanguage = e.target.value;
        updateTranslations();
    });

    // State/District selection
    document.getElementById('stateSelect').addEventListener('change', handleStateChange);
    
    // Location detection
    document.getElementById('detectLocationBtn').addEventListener('click', detectLocation);
    
    // Fetch weather
    document.getElementById('fetchWeatherBtn').addEventListener('click', fetchWeather);
    
    // Form submission
    document.getElementById('recommendationForm').addEventListener('submit', handleRecommendationSubmit);
    
    // Voice input buttons
    document.querySelectorAll('.voice-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const field = e.currentTarget.dataset.field;
            startVoiceInput(field, e.currentTarget);
        });
    });
    
    // Chat functionality
    document.getElementById('sendChatBtn').addEventListener('click', sendChatMessage);
    document.getElementById('chatInput').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendChatMessage();
        }
    });
    document.getElementById('voiceChatBtn').addEventListener('click', () => {
        startVoiceInput('chat', document.getElementById('voiceChatBtn'));
    });
    
    // Filters
    document.getElementById('schemeStateFilter').addEventListener('change', filterSchemes);
    document.getElementById('schemeCategoryFilter').addEventListener('change', filterSchemes);
    document.getElementById('priceStateFilter').addEventListener('change', filterPrices);
    document.getElementById('priceCropFilter').addEventListener('input', filterPrices);
}

// Setup navigation
function setupNavigation() {
    document.querySelectorAll('.nav-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            const view = tab.dataset.view;
            switchView(view);
        });
    });
}

// Switch between views
function switchView(viewName) {
    // Update active tab
    document.querySelectorAll('.nav-tab').forEach(tab => {
        const isActive = tab.dataset.view === viewName;
        if (isActive) {
            tab.classList.add('bg-primary', 'text-white');
            tab.classList.remove('text-gray-600', 'hover:bg-gray-50');
        } else {
            tab.classList.remove('bg-primary', 'text-white');
            tab.classList.add('text-gray-600', 'hover:bg-gray-50');
        }
    });
    
    // Update active view
    document.querySelectorAll('.view').forEach(view => {
        view.classList.add('hidden');
        view.classList.remove('block');
    });
    const activeView = document.getElementById(`${viewName}View`);
    activeView.classList.remove('hidden');
    activeView.classList.add('block');
    
    // Scroll to top
    window.scrollTo(0, 0);
}

// Populate state dropdown
function populateStateDropdown() {
    const stateSelect = document.getElementById('stateSelect');
    const states = [...new Set(regions.map(r => r.state_name))];
    
    states.forEach(state => {
        const option = document.createElement('option');
        option.value = state;
        option.textContent = state;
        stateSelect.appendChild(option);
    });
}

// Handle state change
function handleStateChange(e) {
    const selectedState = e.target.value;
    const districtSelect = document.getElementById('districtSelect');
    
    // Clear districts
    districtSelect.innerHTML = '<option value="">Select District</option>';
    
    if (!selectedState) return;
    
    // Populate districts for selected state
    const districts = regions
        .filter(r => r.state_name === selectedState)
        .map(r => r.district_name);
    
    districts.forEach(district => {
        const option = document.createElement('option');
        option.value = district;
        option.textContent = district;
        districtSelect.appendChild(option);
    });
}

// Detect location
async function detectLocation() {
    const btn = document.getElementById('detectLocationBtn');
    const originalText = btn.innerHTML;
    
    btn.disabled = true;
    btn.innerHTML = '<span>Detecting...</span>';
    
    if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                // Simulate region detection (in real app, use reverse geocoding)
                const randomRegion = regions[Math.floor(Math.random() * regions.length)];
                document.getElementById('stateSelect').value = randomRegion.state_name;
                handleStateChange({ target: { value: randomRegion.state_name } });
                
                setTimeout(() => {
                    document.getElementById('districtSelect').value = randomRegion.district_name;
                }, 100);
                
                btn.disabled = false;
                btn.innerHTML = originalText;
            },
            (error) => {
                let errorMessage = 'Unable to detect location. Please select manually.';
                
                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        errorMessage = 'Location permission denied. Please enable location access or select manually.';
                        break;
                    case error.POSITION_UNAVAILABLE:
                        errorMessage = 'Location information unavailable. Please select manually.';
                        break;
                    case error.TIMEOUT:
                        errorMessage = 'Location request timed out. Please select manually.';
                        break;
                }
                
                alert(errorMessage);
                btn.disabled = false;
                btn.innerHTML = originalText;
            },
            {
                enableHighAccuracy: false,
                timeout: 10000,
                maximumAge: 300000
            }
        );
    } else {
        alert('Geolocation is not supported by your browser. Please select your region manually.');
        btn.disabled = false;
        btn.innerHTML = originalText;
    }
}

// Fetch weather data
async function fetchWeather() {
    const state = document.getElementById('stateSelect').value;
    const district = document.getElementById('districtSelect').value;
    
    if (!state || !district) {
        alert('Please select state and district first');
        return;
    }
    
    try {
        showLoading();
        const weather = await API.getWeather(state, district);
        
        document.getElementById('temperature').value = weather.temperature;
        document.getElementById('rainfall').value = weather.rainfall;
        document.getElementById('humidity').value = weather.humidity;
        
        hideLoading();
    } catch (error) {
        console.error('Error fetching weather:', error);
        alert('Failed to fetch weather data');
        hideLoading();
    }
}

// Handle recommendation form submission
async function handleRecommendationSubmit(e) {
    e.preventDefault();
    
    const formData = {
        state: document.getElementById('stateSelect').value,
        district: document.getElementById('districtSelect').value,
        temperature: parseFloat(document.getElementById('temperature').value),
        rainfall: parseFloat(document.getElementById('rainfall').value),
        humidity: parseFloat(document.getElementById('humidity').value),
        soil_type: document.getElementById('soilType').value
    };
    
    try {
        showLoading();
        const result = await API.getRecommendations(formData);
        displayRecommendations(result.recommendations);
        
        // Refresh history
        history = await API.getHistory();
        displayHistory(history);
        
        hideLoading();
        
        // Scroll to results
        document.getElementById('resultsSection').scrollIntoView({ behavior: 'smooth' });
    } catch (error) {
        console.error('Error getting recommendations:', error);
        alert('Failed to get recommendations');
        hideLoading();
    }
}

// Display recommendations
function displayRecommendations(recommendations) {
    const container = document.getElementById('resultsContainer');
    const section = document.getElementById('resultsSection');
    
    container.innerHTML = '';
    
    if (!recommendations || recommendations.length === 0) {
        container.innerHTML = '<p class="text-center text-gray-600 py-8">No suitable crops found for the given parameters. Try adjusting the values.</p>';
        section.classList.remove('hidden');
        return;
    }
    
    recommendations.forEach(rec => {
        const card = createCropCard(rec);
        container.appendChild(card);
    });
    
    section.classList.remove('hidden');
}

// Create crop card
function createCropCard(recommendation) {
    const { crop, score, reasons, suitability } = recommendation;
    
    const card = document.createElement('div');
    card.className = 'bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all hover:-translate-y-1';
    
    const badgeColors = {
        high: 'bg-green-100 text-green-800',
        medium: 'bg-yellow-100 text-yellow-800',
        low: 'bg-red-100 text-red-800'
    };
    
    card.innerHTML = `
        <img src="${crop.image_url}" alt="${crop.name}" class="w-full h-48 object-cover" onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22400%22 height=%22200%22><rect fill=%22%2322c55e%22 width=%22400%22 height=%22200%22/><text x=%2250%25%22 y=%2250%25%22 font-size=%2224%22 fill=%22white%22 text-anchor=%22middle%22 dy=%22.3em%22>${crop.name}</text></svg>'">
        <div class="p-6">
            <div class="flex justify-between items-start mb-4">
                <h3 class="text-xl font-semibold">${crop.name}</h3>
                <span class="px-3 py-1 rounded-full text-xs font-semibold ${badgeColors[suitability.toLowerCase()]}">${suitability}</span>
            </div>
            <div class="space-y-2 mb-4 text-sm">
                <div class="flex justify-between">
                    <span class="text-gray-600">Temperature:</span>
                    <span class="font-medium">${crop.temp_min}°C - ${crop.temp_max}°C</span>
                </div>
                <div class="flex justify-between">
                    <span class="text-gray-600">Rainfall:</span>
                    <span class="font-medium">${crop.rainfall_min}-${crop.rainfall_max} mm</span>
                </div>
                <div class="flex justify-between">
                    <span class="text-gray-600">Yield Potential:</span>
                    <span class="font-medium">${crop.yield_potential}</span>
                </div>
                <div class="flex justify-between">
                    <span class="text-gray-600">Harvest Time:</span>
                    <span class="font-medium">${crop.harvest_days} days</span>
                </div>
                <div class="flex justify-between">
                    <span class="text-gray-600">Match Score:</span>
                    <span class="font-medium">${score}%</span>
                </div>
            </div>
            ${reasons.length > 0 ? `
                <div class="pt-4 border-t border-gray-200">
                    <h4 class="text-sm text-gray-600 mb-2">Why this crop:</h4>
                    <ul class="space-y-1">
                        ${reasons.map(reason => `<li class="text-sm text-green-600 flex items-center gap-2"><span class="font-bold">✓</span>${reason}</li>`).join('')}
                    </ul>
                </div>
            ` : ''}
        </div>
    `;
    
    return card;
}

// Chat functionality
async function sendChatMessage() {
    const input = document.getElementById('chatInput');
    const message = input.value.trim();
    
    if (!message) return;
    
    // Add user message to chat
    addChatMessage(message, 'user');
    input.value = '';
    
    try {
        const response = await API.sendChatMessage(message);
        addChatMessage(response.response, 'bot');
    } catch (error) {
        console.error('Error sending chat message:', error);
        addChatMessage('Sorry, I encountered an error. Please try again.', 'bot');
    }
}

// Add chat message
function addChatMessage(message, sender) {
    const messagesContainer = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');
    const isUser = sender === 'user';
    messageDiv.className = `flex gap-3 items-start ${isUser ? 'flex-row-reverse' : ''}`;
    
    const avatar = sender === 'bot' ? '🤖' : '👤';
    
    messageDiv.innerHTML = `
        <div class="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0 text-2xl">${avatar}</div>
        <div class="${isUser ? 'bg-primary text-white' : 'bg-gray-100'} rounded-lg p-3 max-w-[70%]">
            <p>${message}</p>
        </div>
    `;
    
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// Filter schemes
function filterSchemes() {
    const stateFilter = document.getElementById('schemeStateFilter').value;
    const categoryFilter = document.getElementById('schemeCategoryFilter').value;
    
    let filtered = schemes;
    
    if (stateFilter) {
        filtered = filtered.filter(s => s.state === stateFilter || s.state === 'All India');
    }
    
    if (categoryFilter) {
        filtered = filtered.filter(s => s.category === categoryFilter);
    }
    
    displaySchemes(filtered);
}

// Display schemes
function displaySchemes(schemesToDisplay) {
    const container = document.getElementById('schemesContainer');
    container.innerHTML = '';
    
    if (schemesToDisplay.length === 0) {
        container.innerHTML = '<p class="text-center text-gray-600 py-8">No schemes found for the selected filters.</p>';
        return;
    }
    
    schemesToDisplay.forEach(scheme => {
        const card = document.createElement('div');
        card.className = 'bg-white p-6 rounded-xl shadow-sm border-l-4 border-primary';
        
        card.innerHTML = `
            <div class="flex justify-between items-start mb-4">
                <h3 class="text-lg font-semibold">${scheme.name}</h3>
                <span class="px-3 py-1 bg-primary text-white rounded-full text-xs font-semibold">${scheme.category}</span>
            </div>
            <p class="text-gray-600 mb-4 text-sm">${scheme.description}</p>
            <div class="space-y-2 mb-4">
                <div class="flex gap-2 text-sm">
                    <span class="font-semibold">Benefits:</span>
                    <span class="text-gray-600">${scheme.benefits}</span>
                </div>
                <div class="flex gap-2 text-sm">
                    <span class="font-semibold">Eligibility:</span>
                    <span class="text-gray-600">${scheme.eligibility}</span>
                </div>
                <div class="flex gap-2 text-sm">
                    <span class="font-semibold">Applicable:</span>
                    <span class="text-gray-600">${scheme.state}</span>
                </div>
            </div>
            <a href="${scheme.link}" target="_blank" class="text-primary font-medium text-sm hover:underline">Learn More →</a>
        `;
        
        container.appendChild(card);
    });
}

// Populate scheme state filter
function populateSchemeStateFilter() {
    const filter = document.getElementById('schemeStateFilter');
    const states = [...new Set(schemes.map(s => s.state))];
    
    states.forEach(state => {
        if (state !== 'All India') {
            const option = document.createElement('option');
            option.value = state;
            option.textContent = state;
            filter.appendChild(option);
        }
    });
}

// Filter market prices
function filterPrices() {
    const stateFilter = document.getElementById('priceStateFilter').value;
    const cropFilter = document.getElementById('priceCropFilter').value.toLowerCase();
    
    let filtered = marketPrices;
    
    if (stateFilter) {
        filtered = filtered.filter(p => p.state === stateFilter);
    }
    
    if (cropFilter) {
        filtered = filtered.filter(p => p.crop.toLowerCase().includes(cropFilter));
    }
    
    displayMarketPrices(filtered);
}

// Display market prices
function displayMarketPrices(pricesToDisplay) {
    const container = document.getElementById('pricesContainer');
    
    if (pricesToDisplay.length === 0) {
        container.innerHTML = '<p class="p-8 text-center text-gray-600">No prices found for the selected filters.</p>';
        return;
    }
    
    const trendClasses = {
        up: 'bg-green-100 text-green-800',
        down: 'bg-red-100 text-red-800',
        stable: 'bg-gray-100 text-gray-800'
    };
    
    let tableHTML = `
        <table class="w-full">
            <thead class="bg-gray-50">
                <tr>
                    <th class="px-4 py-3 text-left font-semibold text-gray-900 border-b-2 border-gray-200">Crop</th>
                    <th class="px-4 py-3 text-left font-semibold text-gray-900 border-b-2 border-gray-200">State</th>
                    <th class="px-4 py-3 text-left font-semibold text-gray-900 border-b-2 border-gray-200">District</th>
                    <th class="px-4 py-3 text-left font-semibold text-gray-900 border-b-2 border-gray-200">Price</th>
                    <th class="px-4 py-3 text-left font-semibold text-gray-900 border-b-2 border-gray-200">Date</th>
                    <th class="px-4 py-3 text-left font-semibold text-gray-900 border-b-2 border-gray-200">Trend</th>
                </tr>
            </thead>
            <tbody>
    `;
    
    pricesToDisplay.forEach(price => {
        const trendIcon = price.trend === 'up' ? '↑' : price.trend === 'down' ? '↓' : '→';
        tableHTML += `
            <tr class="border-b border-gray-200">
                <td class="px-4 py-3">${price.crop}</td>
                <td class="px-4 py-3">${price.state}</td>
                <td class="px-4 py-3">${price.district}</td>
                <td class="px-4 py-3 font-semibold">${price.price} ${price.unit}</td>
                <td class="px-4 py-3">${new Date(price.date).toLocaleDateString()}</td>
                <td class="px-4 py-3"><span class="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${trendClasses[price.trend]}">${trendIcon} ${price.trend}</span></td>
            </tr>
        `;
    });
    
    tableHTML += `
            </tbody>
        </table>
    `;
    
    container.innerHTML = tableHTML;
}

// Populate price state filter
function populatePriceStateFilter() {
    const filter = document.getElementById('priceStateFilter');
    const states = [...new Set(marketPrices.map(p => p.state))];
    
    states.forEach(state => {
        const option = document.createElement('option');
        option.value = state;
        option.textContent = state;
        filter.appendChild(option);
    });
}

// Display history
function displayHistory(historyItems) {
    const container = document.getElementById('historyContainer');
    
    if (historyItems.length === 0) {
        container.innerHTML = '<p class="text-center text-gray-600 py-8">No prediction history yet. Make your first crop recommendation!</p>';
        return;
    }
    
    container.innerHTML = '';
    
    // Reverse to show newest first
    [...historyItems].reverse().forEach(item => {
        const card = document.createElement('div');
        card.className = 'bg-white p-6 rounded-xl shadow-sm';
        
        const date = new Date(item.timestamp);
        
        card.innerHTML = `
            <div class="flex justify-between items-center mb-4 pb-4 border-b border-gray-200">
                <h3 class="text-lg font-semibold">Prediction #${item.id}</h3>
                <span class="text-sm text-gray-600">${date.toLocaleString()}</span>
            </div>
            <div class="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
                <div class="flex flex-col gap-1">
                    <span class="text-xs text-gray-600">Location</span>
                    <span class="font-semibold">${item.input.district}, ${item.input.state}</span>
                </div>
                <div class="flex flex-col gap-1">
                    <span class="text-xs text-gray-600">Temperature</span>
                    <span class="font-semibold">${item.input.temperature}°C</span>
                </div>
                <div class="flex flex-col gap-1">
                    <span class="text-xs text-gray-600">Rainfall</span>
                    <span class="font-semibold">${item.input.rainfall} mm</span>
                </div>
                <div class="flex flex-col gap-1">
                    <span class="text-xs text-gray-600">Humidity</span>
                    <span class="font-semibold">${item.input.humidity}%</span>
                </div>
                <div class="flex flex-col gap-1">
                    <span class="text-xs text-gray-600">Soil Type</span>
                    <span class="font-semibold">${item.input.soil_type}</span>
                </div>
            </div>
            <div class="text-sm text-gray-600">
                <strong>Top Recommendations:</strong> ${item.recommendations.slice(0, 3).map(r => r.crop.name).join(', ')}
            </div>
        `;
        
        container.appendChild(card);
    });
}

// Loading spinner
function showLoading() {
    document.getElementById('loadingSpinner').classList.remove('hidden');
    document.getElementById('loadingSpinner').classList.add('flex');
}

function hideLoading() {
    document.getElementById('loadingSpinner').classList.add('hidden');
    document.getElementById('loadingSpinner').classList.remove('flex');
}
