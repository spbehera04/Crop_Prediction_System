import React, { useState } from 'react';
import { Menu, X, Languages, Home, FileText, DollarSign, History, Sprout } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { translations } from '../utils/translations';

interface HeaderProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export function Header({ currentPage, onNavigate }: HeaderProps) {
  const { language, setLanguage } = useApp();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  
  const t = translations[language];

  const languages = [
    { code: 'en' as const, name: 'English', native: 'English' },
    { code: 'hi' as const, name: 'Hindi', native: 'हिन्दी' },
    { code: 'od' as const, name: 'Odia', native: 'ଓଡ଼ିଆ' },
    { code: 'ta' as const, name: 'Tamil', native: 'தமிழ்' },
  ];

  const navItems = [
    { id: 'home', label: t.home, icon: Home },
    { id: 'recommendations', label: t.recommendations, icon: Sprout },
    { id: 'schemes', label: t.schemes, icon: FileText },
    { id: 'markets', label: t.markets, icon: DollarSign },
    { id: 'history', label: t.history, icon: History },
  ];

  return (
    <header className="bg-green-700 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center cursor-pointer" onClick={() => onNavigate('home')}>
            <Sprout className="h-8 w-8 mr-2" />
            <div>
              <h1 className="text-xl">{t.appName}</h1>
              <p className="text-xs text-green-100">{t.appTagline}</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-4">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`flex items-center px-3 py-2 rounded-md transition-colors ${
                    currentPage === item.id
                      ? 'bg-green-800 text-white'
                      : 'text-green-50 hover:bg-green-600'
                  }`}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Language Selector */}
          <div className="relative hidden md:block">
            <button
              onClick={() => setIsLanguageOpen(!isLanguageOpen)}
              className="flex items-center px-3 py-2 rounded-md bg-green-600 hover:bg-green-500 transition-colors"
            >
              <Languages className="h-5 w-5 mr-2" />
              {languages.find(l => l.code === language)?.native}
            </button>
            {isLanguageOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      setLanguage(lang.code);
                      setIsLanguageOpen(false);
                    }}
                    className={`block w-full text-left px-4 py-2 hover:bg-green-50 ${
                      language === lang.code ? 'bg-green-100 text-green-800' : 'text-gray-700'
                    }`}
                  >
                    {lang.native} ({lang.name})
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-md hover:bg-green-600"
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden pb-4">
            <nav className="flex flex-col space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      onNavigate(item.id);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`flex items-center px-3 py-2 rounded-md ${
                      currentPage === item.id
                        ? 'bg-green-800 text-white'
                        : 'text-green-50 hover:bg-green-600'
                    }`}
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    {item.label}
                  </button>
                );
              })}
            </nav>
            
            {/* Mobile Language Selector */}
            <div className="mt-4 border-t border-green-600 pt-4">
              <p className="text-sm text-green-100 mb-2">Select Language</p>
              <div className="grid grid-cols-2 gap-2">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      setLanguage(lang.code);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`px-3 py-2 rounded-md ${
                      language === lang.code
                        ? 'bg-green-800 text-white'
                        : 'bg-green-600 text-green-50 hover:bg-green-500'
                    }`}
                  >
                    {lang.native}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
