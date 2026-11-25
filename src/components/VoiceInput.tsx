import React, { useState, useEffect } from 'react';
import { Mic, MicOff } from 'lucide-react';
import { Button } from './ui/button';
import { useApp } from '../context/AppContext';
import { translations } from '../utils/translations';

interface VoiceInputProps {
  onValue: (value: number) => void;
  fieldName: string;
}

export function VoiceInput({ onValue, fieldName }: VoiceInputProps) {
  const { language } = useApp();
  const t = translations[language];
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);

  useEffect(() => {
    // Check if browser supports speech recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = false;
      recognitionInstance.lang = language === 'en' ? 'en-IN' : 
                                 language === 'hi' ? 'hi-IN' :
                                 language === 'od' ? 'or-IN' :
                                 language === 'ta' ? 'ta-IN' : 'en-IN';

      recognitionInstance.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        const numbers = transcript.match(/\d+/g);
        if (numbers && numbers.length > 0) {
          const value = parseInt(numbers[0], 10);
          onValue(value);
        }
        setIsListening(false);
      };

      recognitionInstance.onerror = () => {
        setIsListening(false);
      };

      recognitionInstance.onend = () => {
        setIsListening(false);
      };

      setRecognition(recognitionInstance);
    }
  }, [language]);

  const toggleListening = () => {
    if (!recognition) {
      alert(t.voiceNotSupported);
      return;
    }

    if (isListening) {
      recognition.stop();
      setIsListening(false);
    } else {
      recognition.start();
      setIsListening(true);
    }
  };

  if (!recognition) {
    return null;
  }

  return (
    <Button
      type="button"
      variant={isListening ? "default" : "outline"}
      size="icon"
      onClick={toggleListening}
      className={isListening ? 'bg-red-500 hover:bg-red-600 animate-pulse' : ''}
      title={t.voiceInput}
    >
      {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
    </Button>
  );
}
