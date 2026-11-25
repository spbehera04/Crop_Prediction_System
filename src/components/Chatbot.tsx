import React, { useState } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { translations } from '../utils/translations';
import { Button } from './ui/button';

export function Chatbot() {
  const { language } = useApp();
  const t = translations[language];
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Array<{ text: string; isUser: boolean }>>([
    { text: getWelcomeMessage(language), isUser: false },
  ]);
  const [input, setInput] = useState('');

  function getWelcomeMessage(lang: string) {
    const welcomes = {
      en: "Hello! I'm your farming assistant. Ask me anything about crops, planting, fertilizers, or pest control.",
      hi: "नमस्ते! मैं आपका कृषि सहायक हूं। फसलों, रोपण, उर्वरकों या कीट नियंत्रण के बारे में मुझसे कुछ भी पूछें।",
      od: "ନମସ୍କାର! ମୁଁ ଆପଣଙ୍କର କୃଷି ସହାୟକ। ଫସଲ, ରୋପଣ, ସାର କିମ୍ବା କୀଟ ନିୟନ୍ତ୍ରଣ ବିଷୟରେ ମୋତେ କିଛି ପଚାରନ୍ତୁ।",
      ta: "வணக்கம்! நான் உங்கள் விவசாய உதவியாளர். பயிர்கள், நடவு, உரங்கள் அல்லது பூச்சி கட்டுப்பாடு பற்றி என்னிடம் கேளுங்கள்.",
    };
    return welcomes[lang as keyof typeof welcomes] || welcomes.en;
  }

  const quickQuestions = [
    t.whenToPlant,
    t.whatFertilizer,
    t.howMuchWater,
    t.pestControl,
  ];

  const getBotResponse = (question: string): string => {
    const lowerQuestion = question.toLowerCase();
    
    // Simple keyword-based responses
    if (lowerQuestion.includes('plant') || lowerQuestion.includes('बुवाई') || lowerQuestion.includes('ବୁଣିବା') || lowerQuestion.includes('நட')) {
      return language === 'en' 
        ? "The best time to plant depends on your crop and region. For most Kharif crops, plant in June-July. For Rabi crops like wheat, plant in October-November. Always check local weather forecasts before planting."
        : language === 'hi'
        ? "रोपण का सर्वोत्तम समय आपकी फसल और क्षेत्र पर निर्भर करता है। अधिकांश खरीफ फसलों के लिए, जून-जुलाई में बोएं। गेहूं जैसी रबी फसलों के लिए, अक्टूबर-नवंबर में बोएं।"
        : "The best time to plant depends on your crop and region. For most Kharif crops, plant in June-July. For Rabi crops like wheat, plant in October-November.";
    }
    
    if (lowerQuestion.includes('fertilizer') || lowerQuestion.includes('उर्वरक') || lowerQuestion.includes('ସାର') || lowerQuestion.includes('உர')) {
      return language === 'en'
        ? "Use balanced NPK fertilizers (Nitrogen-Phosphorus-Potassium) based on soil testing. Generally, apply nitrogen in 2-3 splits during crop growth. Use organic manures like FYM for soil health. Consider using bio-fertilizers for sustainable farming."
        : language === 'hi'
        ? "मिट्टी परीक्षण के आधार पर संतुलित एनपीके उर्वरकों का उपयोग करें। आमतौर पर, फसल वृद्धि के दौरान 2-3 भागों में नाइट्रोजन लगाएं। मिट्टी के स्वास्थ्य के लिए जैविक खाद का उपयोग करें।"
        : "Use balanced NPK fertilizers based on soil testing. Apply nitrogen in 2-3 splits during crop growth. Use organic manures for soil health.";
    }
    
    if (lowerQuestion.includes('water') || lowerQuestion.includes('पानी') || lowerQuestion.includes('ପାଣି') || lowerQuestion.includes('தண்ணீ')) {
      return language === 'en'
        ? "Water requirements vary by crop. Rice needs continuous flooding (5cm water level). Wheat needs 4-6 irrigations. Use drip irrigation for water efficiency. Water early morning or evening to reduce evaporation. Critical stages like flowering need adequate water."
        : language === 'hi'
        ? "जल की आवश्यकता फसल के अनुसार भिन्न होती है। चावल को निरंतर जल भराव (5 सेमी जल स्तर) की आवश्यकता होती है। गेहूं को 4-6 सिंचाई की आवश्यकता होती है। जल दक्षता के लिए ड्रिप सिंचाई का उपयोग करें।"
        : "Water requirements vary by crop. Rice needs continuous flooding. Wheat needs 4-6 irrigations. Use drip irrigation for efficiency.";
    }
    
    if (lowerQuestion.includes('pest') || lowerQuestion.includes('कीट') || lowerQuestion.includes('କୀଟ') || lowerQuestion.includes('பூச்சி')) {
      return language === 'en'
        ? "Use Integrated Pest Management (IPM): 1) Monitor fields regularly, 2) Use pest-resistant varieties, 3) Practice crop rotation, 4) Use neem-based bio-pesticides, 5) Install pheromone traps, 6) Maintain field hygiene. Chemical pesticides should be last resort."
        : language === 'hi'
        ? "एकीकृत कीट प्रबंधन (IPM) का उपयोग करें: 1) नियमित रूप से खेतों की निगरानी करें, 2) कीट-प्रतिरोधी किस्मों का उपयोग करें, 3) फसल चक्र अपनाएं, 4) नीम आधारित जैव-कीटनाशकों का उपयोग करें।"
        : "Use Integrated Pest Management (IPM): Monitor fields regularly, use pest-resistant varieties, practice crop rotation, use bio-pesticides.";
    }
    
    // Default response
    return language === 'en'
      ? "I can help you with questions about crop selection, planting times, fertilizers, irrigation, and pest control. Please ask a specific question or use the quick questions below."
      : language === 'hi'
      ? "मैं फसल चयन, रोपण समय, उर्वरक, सिंचाई और कीट नियंत्रण के बारे में सवालों में आपकी मदद कर सकता हूं। कृपया एक विशिष्ट प्रश्न पूछें।"
      : "I can help you with questions about crop selection, planting, fertilizers, irrigation, and pest control. Please ask a specific question.";
  };

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage = { text: input, isUser: true };
    const botResponse = { text: getBotResponse(input), isUser: false };

    setMessages([...messages, userMessage, botResponse]);
    setInput('');
  };

  const handleQuickQuestion = (question: string) => {
    const userMessage = { text: question, isUser: true };
    const botResponse = { text: getBotResponse(question), isUser: false };
    setMessages([...messages, userMessage, botResponse]);
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-green-600 hover:bg-green-700 text-white rounded-full p-4 shadow-lg z-50 transition-transform hover:scale-110"
        aria-label="Open chat"
      >
        <MessageCircle className="h-6 w-6" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-96 max-w-[calc(100vw-3rem)] bg-white rounded-lg shadow-2xl z-50 flex flex-col max-h-[600px]">
      {/* Header */}
      <div className="bg-green-600 text-white p-4 rounded-t-lg flex items-center justify-between">
        <div className="flex items-center">
          <MessageCircle className="h-5 w-5 mr-2" />
          <h3>{t.chatAssistant}</h3>
        </div>
        <button onClick={() => setIsOpen(false)} className="hover:bg-green-700 rounded p-1">
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg, index) => (
          <div key={index} className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-[80%] p-3 rounded-lg ${
                msg.isUser
                  ? 'bg-green-600 text-white rounded-br-none'
                  : 'bg-gray-100 text-gray-900 rounded-bl-none'
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
      </div>

      {/* Quick Questions */}
      {messages.length <= 1 && (
        <div className="px-4 pb-3">
          <p className="text-xs text-gray-600 mb-2">{t.quickQuestions}:</p>
          <div className="grid grid-cols-2 gap-2">
            {quickQuestions.map((q, i) => (
              <button
                key={i}
                onClick={() => handleQuickQuestion(q)}
                className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 p-2 rounded transition-colors text-left"
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder={t.askQuestion}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
          <Button onClick={handleSend} className="bg-green-600 hover:bg-green-700">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
