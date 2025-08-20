import React, { useMemo, useState, useEffect } from 'react';
import Loader from './Loader';
import { RobotIcon } from './icons/RobotIcon';
import { ClipboardIcon } from './icons/ClipboardIcon';
import { CheckIcon } from './icons/CheckIcon';
import { SparklesIcon } from './icons/SparklesIcon';

interface ReviewData {
  review: string;
  improvedCode: string;
}

interface ReviewOutputProps {
  reviewData: ReviewData | null;
  isLoading: boolean;
  error: string | null;
  language: string;
}

const formatReview = (text: string): React.ReactNode[] => {
    if (!text) return [];

    const blocks = text.split(/(```[\s\S]*?```)/g);
    const elements: React.ReactNode[] = [];

    blocks.forEach((block, index) => {
        if (block.startsWith('```')) {
            const lang = block.match(/```(\w*)/)?.[1] || '';
            const code = block.replace(/```\w*\n/, '').replace(/```$/, '');
            elements.push(
                <div key={`code-block-${index}`} className="my-4 rounded-lg bg-gray-900 overflow-hidden border border-gray-700">
                    <div className="px-4 py-2 bg-gray-800 text-xs text-gray-400 font-semibold">{lang || 'code'}</div>
                    <pre className="p-4 text-sm text-gray-300 overflow-x-auto">
                        <code>{code}</code>
                    </pre>
                </div>
            );
        } else {
            block.split('\n').forEach((line, lineIndex) => {
                const key = `line-${index}-${lineIndex}`;
                if (line.startsWith('### ')) {
                    elements.push(<h3 key={key} className="text-xl font-semibold mt-4 mb-2 text-indigo-300">{line.substring(4)}</h3>);
                } else if (line.startsWith('## ')) {
                    elements.push(<h2 key={key} className="text-2xl font-bold mt-6 mb-3 border-b border-gray-600 pb-2">{line.substring(3)}</h2>);
                } else if (line.startsWith('# ')) {
                    elements.push(<h1 key={key} className="text-3xl font-bold mt-8 mb-4 border-b-2 border-indigo-500 pb-2">{line.substring(2)}</h1>);
                } else if (line.match(/^\s*[\*\-]\s/)) {
                     const content = line.replace(/^\s*[\*\-]\s/, '');
                     elements.push(<li key={key} className="ml-6 list-disc my-1">{renderInlineFormatting(content, key)}</li>);
                } else if (line.trim() !== '') {
                    elements.push(<p key={key} className="my-2 leading-relaxed">{renderInlineFormatting(line, key)}</p>);
                }
            });
        }
    });

    return elements;
};

const renderInlineFormatting = (line: string, baseKey: string) => {
    const parts = line.split(/(\*\*.*?\*\*|`.*?`)/g);
    return parts.map((part, i) => {
        const key = `${baseKey}-part-${i}`;
        if (part.startsWith('**') && part.endsWith('**')) {
            return <strong key={key} className="font-bold text-white">{part.slice(2, -2)}</strong>;
        }
        if (part.startsWith('`') && part.endsWith('`')) {
            return <code key={key} className="bg-gray-700 text-indigo-300 rounded px-1.5 py-1 font-mono text-sm">{part.slice(1, -1)}</code>;
        }
        return part;
    });
};

const ReviewOutput: React.FC<ReviewOutputProps> = ({ reviewData, isLoading, error, language }) => {
  const [isCopied, setIsCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'feedback' | 'code'>('feedback');
  
  const formattedReview = useMemo(() => reviewData ? formatReview(reviewData.review) : [], [reviewData]);

  useEffect(() => {
    if (reviewData) {
      setActiveTab('feedback');
    }
  }, [reviewData]);

  const handleCopy = () => {
    if (!reviewData) return;
    const textToCopy = activeTab === 'feedback' ? reviewData.review : reviewData.improvedCode;
    navigator.clipboard.writeText(textToCopy);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-center">
          <Loader />
          <p className="mt-4 text-lg font-semibold text-gray-300">Analizando tu código...</p>
          <p className="text-sm text-gray-500">La IA está pensando. Esto puede tardar un momento.</p>
        </div>
      );
    }
    if (error) {
      return (
        <div className="flex items-center justify-center h-full">
            <div className="bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-lg text-center">
                <h3 className="font-bold">Ocurrió un Error</h3>
                <p className="text-sm">{error}</p>
            </div>
        </div>
      );
    }
    if (reviewData) {
      return (
        <div className="flex flex-col h-full">
          <div className="flex border-b border-gray-700">
            <button
              onClick={() => setActiveTab('feedback')}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors focus:outline-none ${
                activeTab === 'feedback'
                  ? 'border-b-2 border-indigo-400 text-white'
                  : 'text-gray-400 hover:text-white border-b-2 border-transparent'
              }`}
            >
              <RobotIcon className="h-5 w-5" />
              Feedback
            </button>
            <button
              onClick={() => setActiveTab('code')}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors focus:outline-none ${
                activeTab === 'code'
                  ? 'border-b-2 border-indigo-400 text-white'
                  : 'text-gray-400 hover:text-white border-b-2 border-transparent'
              }`}
            >
              <SparklesIcon className="h-5 w-5" />
              Código Mejorado
            </button>
          </div>
          <div className="pt-4 flex-grow overflow-y-auto">
            {activeTab === 'feedback' ? (
              <div className="prose prose-invert max-w-none">{formattedReview}</div>
            ) : (
              <div className="bg-gray-900 rounded-md border border-gray-700 overflow-hidden h-full">
                <pre className="h-full text-sm text-gray-300 overflow-auto font-mono">
                  <code className="p-4 block">{reviewData.improvedCode}</code>
                </pre>
              </div>
            )}
          </div>
        </div>
      );
    }
    return (
      <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
        <RobotIcon className="h-16 w-16 mb-4" />
        <h3 className="text-xl font-semibold text-gray-300">Esperando Código</h3>
        <p>Ingresa tu código a la izquierda y haz clic en "Revisar Código" para comenzar.</p>
      </div>
    );
  };

  return (
    <div className="bg-gray-800 rounded-lg shadow-lg p-6 h-full min-h-[400px] lg:min-h-[612px] flex flex-col">
      <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-700">
          <div className="flex items-center">
            <SparklesIcon className="h-6 w-6 mr-2 text-indigo-400" />
            <h2 className="text-xl font-semibold text-white">Resultados de la IA</h2>
          </div>
          {reviewData && !isLoading && !error && (
             <button
                onClick={handleCopy}
                className="p-1.5 rounded-md bg-gray-700/50 hover:bg-gray-700 transition-all"
                title={isCopied ? "Copiado!" : `Copiar ${activeTab === 'feedback' ? 'feedback' : 'código'}`}
                aria-label={isCopied ? "Copiado!" : `Copiar ${activeTab === 'feedback' ? 'feedback' : 'código'}`}
              >
                {isCopied ? (
                  <CheckIcon className="h-5 w-5 text-green-400" />
                ) : (
                  <ClipboardIcon className="h-5 w-5 text-gray-300" />
                )}
              </button>
          )}
      </div>
      <div className="flex-grow overflow-y-auto pr-2">
        {renderContent()}
      </div>
    </div>
  );
};

export default ReviewOutput;