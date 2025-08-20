import React from 'react';
import { RobotIcon } from './icons/RobotIcon';
import { RefreshIcon } from './icons/RefreshIcon';

interface HeaderProps {
    onClear: () => void;
}

const Header: React.FC<HeaderProps> = ({ onClear }) => {
  return (
    <header className="py-4 px-4 sm:px-6 lg:px-8 bg-gray-900/80 backdrop-blur-sm border-b border-gray-700 sticky top-0 z-10">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center">
            <RobotIcon className="h-8 w-8 mr-3 text-indigo-400" />
            <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                Revisor de Código con IA
                </h1>
                <p className="text-sm sm:text-md text-gray-400">Feedback instantáneo sobre tu código con Gemini</p>
            </div>
        </div>
        <button
            onClick={onClear}
            className="p-2 bg-gray-700/50 text-gray-300 font-semibold rounded-full hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-indigo-500 transition-all duration-200"
            title="Limpiar y comenzar de nuevo"
            aria-label="Limpiar y comenzar de nuevo"
        >
            <RefreshIcon className="h-5 w-5" />
        </button>
      </div>
    </header>
  );
};

export default Header;