import React, { useState } from 'react';
import { AlertCircle, WifiOff } from 'lucide-react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { LandingPage } from './components/LandingPage';
import { CropRecommendationForm } from './components/CropRecommendationForm';
import { RecommendationResults } from './components/RecommendationResults';
import { GovernmentSchemes } from './components/GovernmentSchemes';
import { MarketPrices } from './components/MarketPrices';
import { PredictionHistory } from './components/PredictionHistory';
import { Chatbot } from './components/Chatbot';
import { generateRecommendations, storePrediction } from './utils/recommendationEngine';
import { translations } from './utils/translations';
import { PredictionInput, Recommendation } from './types';
import { Alert, AlertDescription } from './components/ui/alert';

function AppContent() {
  const { language, isOffline } = useApp();
  const t = translations[language];
  const [currentPage, setCurrentPage] = useState<string>('home');
  const [recommendations, setRecommendations] = useState<Recommendation[] | null>(null);

  const handleGetStarted = () => {
    setCurrentPage('recommendations');
    setRecommendations(null);
  };

  const handleSubmitPrediction = (input: PredictionInput) => {
    const results = generateRecommendations(input);
    setRecommendations(results);
    storePrediction(input, results);
    
    // Scroll to results
    setTimeout(() => {
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    }, 100);
  };

  const handleViewHistoryDetails = (prediction: any) => {
    setRecommendations(prediction.recommendations);
    setCurrentPage('recommendations');
    setTimeout(() => {
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    }, 100);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <LandingPage onGetStarted={handleGetStarted} />;
      
      case 'recommendations':
        return (
          <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <CropRecommendationForm onSubmit={handleSubmitPrediction} />
              
              {recommendations && (
                <div className="mt-12">
                  <RecommendationResults recommendations={recommendations} />
                </div>
              )}
            </div>
          </div>
        );
      
      case 'schemes':
        return <GovernmentSchemes />;
      
      case 'markets':
        return <MarketPrices />;
      
      case 'history':
        return <PredictionHistory onViewDetails={handleViewHistoryDetails} />;
      
      default:
        return <LandingPage onGetStarted={handleGetStarted} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header currentPage={currentPage} onNavigate={setCurrentPage} />
      
      {/* Offline Indicator */}
      {isOffline && (
        <Alert className="mx-4 mt-4 bg-yellow-50 border-yellow-200">
          <WifiOff className="h-4 w-4 text-yellow-600" />
          <AlertDescription className="text-yellow-800">
            {t.offlineMessage}
          </AlertDescription>
        </Alert>
      )}
      
      <main>
        {renderPage()}
      </main>
      
      <Chatbot />
      
      {/* Footer */}
      <footer className="bg-green-900 text-white py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-green-100">
              © 2025 AgriIntel. Empowering farmers with smart technology.
            </p>
            <p className="text-green-300 mt-2 text-sm">
              For support, contact your nearest Krishi Vigyan Kendra or call 1800-180-1551 (Kisan Call Center)
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
