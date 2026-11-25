import React from 'react';
import { Sprout, Cloud, Lightbulb, Wifi, FileText, TrendingUp, Mic } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { translations } from '../utils/translations';
import { Button } from './ui/button';

interface LandingPageProps {
  onGetStarted: () => void;
}

export function LandingPage({ onGetStarted }: LandingPageProps) {
  const { language } = useApp();
  const t = translations[language];

  const features = [
    {
      icon: Lightbulb,
      title: t.feature1Title,
      description: t.feature1Desc,
    },
    {
      icon: Cloud,
      title: t.feature2Title,
      description: t.feature2Desc,
    },
    {
      icon: Wifi,
      title: t.feature3Title,
      description: t.feature3Desc,
    },
    {
      icon: FileText,
      title: t.feature4Title,
      description: t.feature4Desc,
    },
    {
      icon: TrendingUp,
      title: t.feature5Title,
      description: t.feature5Desc,
    },
    {
      icon: Mic,
      title: t.feature6Title,
      description: t.feature6Desc,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center mb-4">
                <Sprout className="h-12 w-12 text-green-600 mr-3" />
                <span className="inline-block px-4 py-1 bg-green-100 text-green-800 rounded-full">
                  {t.appTagline}
                </span>
              </div>
              
              <h1 className="text-4xl lg:text-5xl text-gray-900 mb-6">
                {t.heroTitle}
              </h1>
              
              <p className="text-xl text-gray-600 mb-8">
                {t.heroSubtitle}
              </p>
              
              <Button
                onClick={onGetStarted}
                size="lg"
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-6"
              >
                {t.getStarted}
              </Button>
            </div>
            
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1581092335878-2d9ff86ca2bf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhZ3JpY3VsdHVyZSUyMHRlY2hub2xvZ3l8ZW58MXx8fHwxNzYxMjY0MjIzfDA&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Agriculture Technology"
                className="rounded-lg shadow-2xl w-full object-cover h-96"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-green-900/20 to-transparent rounded-lg"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl text-gray-900 mb-4">{t.features}</h2>
          <p className="text-xl text-gray-600">
            Empowering farmers with technology and knowledge
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow border border-gray-100"
              >
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <Icon className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-xl text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-green-700 text-white py-16">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl mb-4">Ready to optimize your crop selection?</h2>
          <p className="text-xl text-green-100 mb-8">
            Get personalized crop recommendations in minutes
          </p>
          <Button
            onClick={onGetStarted}
            size="lg"
            className="bg-white text-green-700 hover:bg-green-50 px-8 py-6"
          >
            {t.getStarted}
          </Button>
        </div>
      </div>
    </div>
  );
}
