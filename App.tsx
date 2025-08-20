import React, { useState, useCallback } from 'react';
import Header from './components/Header';
import CodeInput from './components/CodeInput';
import ReviewOutput from './components/ReviewOutput';
import { reviewCode } from './services/geminiService';
import { LANGUAGES } from './constants';

interface ReviewData {
  review: string;
  improvedCode: string;
}

const App: React.FC = () => {
  const [code, setCode] = useState<string>('');
  const [language, setLanguage] = useState<string>(LANGUAGES[0].value);
  const [reviewData, setReviewData] = useState<ReviewData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleReview = useCallback(async () => {
    if (!code.trim()) {
      setError("Por favor, ingresa algo de código para revisar.");
      return;
    }
    setIsLoading(true);
    setError(null);
    setReviewData(null);

    try {
      const result = await reviewCode(code, language);
      setReviewData(result);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Ocurrió un error desconocido.';
      setError(`No se pudo obtener la revisión: ${errorMessage}`);
      setReviewData(null);
    } finally {
      setIsLoading(false);
    }
  }, [code, language]);

  const handleClear = useCallback(() => {
    setCode('');
    setReviewData(null);
    setError(null);
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 font-sans">
      <Header onClear={handleClear} />
      <main className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <CodeInput
            code={code}
            onCodeChange={setCode}
            language={language}
            onLanguageChange={setLanguage}
            onSubmit={handleReview}
            isLoading={isLoading}
          />
          <ReviewOutput reviewData={reviewData} isLoading={isLoading} error={error} language={language} />
        </div>
      </main>
      <footer className="text-center p-4 text-gray-500 text-sm">
        <p>Desarrollado por Google Gemini</p>
      </footer>
    </div>
  );
};

export default App;