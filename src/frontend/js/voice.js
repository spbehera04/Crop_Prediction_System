// Voice input functionality using Web Speech API
let recognition = null;
let currentVoiceField = null;
let currentVoiceButton = null;

// Initialize speech recognition
if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
}

// Start voice input
function startVoiceInput(field, button) {
    if (!recognition) {
        alert('Voice input is not supported in your browser. Please use Chrome, Edge, or Safari.');
        return;
    }

    currentVoiceField = field;
    currentVoiceButton = button;

    // Set language based on current app language
    recognition.lang = getVoiceLanguageCode(currentLanguage);

    // Add listening class
    button.classList.add('listening');

    recognition.start();

    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        console.log('Voice input:', transcript);

        if (field === 'chat') {
            document.getElementById('chatInput').value = transcript;
            sendChatMessage();
        } else {
            // For numeric fields, try to extract numbers
            const numericValue = extractNumber(transcript);
            if (numericValue !== null) {
                document.getElementById(field).value = numericValue;
            } else {
                document.getElementById(field).value = transcript;
            }
        }

        button.classList.remove('listening');
    };

    recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        button.classList.remove('listening');

        let errorMessage = 'Voice input error. Please try again.';
        
        switch (event.error) {
            case 'no-speech':
                errorMessage = 'No speech detected. Please try again.';
                break;
            case 'audio-capture':
                errorMessage = 'No microphone found. Please check your device.';
                break;
            case 'not-allowed':
                errorMessage = 'Microphone permission denied. Please enable microphone access.';
                break;
        }

        alert(errorMessage);
    };

    recognition.onend = () => {
        button.classList.remove('listening');
    };
}

// Extract numbers from text
function extractNumber(text) {
    // Handle common number words
    const numberWords = {
        'zero': 0, 'one': 1, 'two': 2, 'three': 3, 'four': 4, 'five': 5,
        'six': 6, 'seven': 7, 'eight': 8, 'nine': 9, 'ten': 10,
        'eleven': 11, 'twelve': 12, 'thirteen': 13, 'fourteen': 14, 'fifteen': 15,
        'sixteen': 16, 'seventeen': 17, 'eighteen': 18, 'nineteen': 19, 'twenty': 20,
        'thirty': 30, 'forty': 40, 'fifty': 50, 'sixty': 60, 'seventy': 70,
        'eighty': 80, 'ninety': 90, 'hundred': 100, 'thousand': 1000
    };

    // Try to find a direct number match
    const numberMatch = text.match(/\d+(\.\d+)?/);
    if (numberMatch) {
        return parseFloat(numberMatch[0]);
    }

    // Try to match number words
    const words = text.toLowerCase().split(' ');
    for (const word of words) {
        if (numberWords[word] !== undefined) {
            return numberWords[word];
        }
    }

    return null;
}

// Get language code for voice recognition
function getVoiceLanguageCode(lang) {
    const langCodes = {
        'en': 'en-IN',
        'hi': 'hi-IN',
        'od': 'or-IN',
        'ta': 'ta-IN'
    };
    return langCodes[lang] || 'en-IN';
}
