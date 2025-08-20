import React, { useState } from 'react';
import { LANGUAGES } from '../constants';
import { CodeIcon } from './icons/CodeIcon';
import { ClipboardIcon } from './icons/ClipboardIcon';
import { CheckIcon } from './icons/CheckIcon';

interface CodeInputProps {
  code: string;
  onCodeChange: (code: string) => void;
  language: string;
  onLanguageChange: (language: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
}

const CodeInput: React.FC<CodeInputProps> = ({
  code,
  onCodeChange,
  language,
  onLanguageChange,
  onSubmit,
  isLoading,
}) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = () => {
    if (!code) return;
    navigator.clipboard.writeText(code);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="bg-gray-800 rounded-lg shadow-lg p-6 flex flex-col h-full">
        <div className="flex items-center mb-4">
            <CodeIcon className="h-6 w-6 mr-2 text-gray-400" />
            <h2 className="text-xl font-semibold text-white">Tu Código</h2>
        </div>
      <div className="flex-grow flex flex-col">
        <div className="relative flex-grow">
          <button
            onClick={handleCopy}
            disabled={!code}
            className="absolute top-2 right-2 p-1.5 rounded-md bg-gray-700/50 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            title={isCopied ? "Copiado!" : "Copiar código"}
            aria-label={isCopied ? "Copiado!" : "Copiar código"}
          >
            {isCopied ? (
              <CheckIcon className="h-5 w-5 text-green-400" />
            ) : (
              <ClipboardIcon className="h-5 w-5 text-gray-300" />
            )}
          </button>
          <textarea
            value={code}
            onChange={(e) => onCodeChange(e.target.value)}
            placeholder="Pega tu código aquí..."
            className="w-full h-full min-h-[300px] lg:min-h-[500px] p-4 bg-gray-900 text-gray-300 font-mono rounded-md border border-gray-700 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors resize-none"
            spellCheck="false"
          />
        </div>
        <div className="mt-4 flex flex-col sm:flex-row items-center gap-4">
          <select
            value={language}
            onChange={(e) => onLanguageChange(e.target.value)}
            className="w-full sm:w-auto bg-gray-700 text-white border border-gray-600 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            aria-label="Seleccionar lenguaje de programación"
          >
            {LANGUAGES.map((lang) => (
              <option key={lang.value} value={lang.value}>
                {lang.label}
              </option>
            ))}
          </select>
          <button
            onClick={onSubmit}
            disabled={isLoading || !code}
            className="w-full sm:w-auto flex-grow items-center justify-center px-6 py-2 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-indigo-500 transition-all duration-200 disabled:bg-gray-500 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Revisando...
              </div>
            ) : (
              'Revisar Código'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CodeInput;