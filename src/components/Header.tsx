import React from 'react';
import { Calculator, Github, ExternalLink } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 transition-colors duration-300">
      <div className="container mx-auto px-6 py-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-teal-500 rounded-xl shadow-lg">
              <Calculator className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
                Mathematical Visualization Tool
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-300 mt-2 max-w-3xl">
                Interactive tool for visualizing complex mathematical functions and equations. 
                Built with D3.js and React for dynamic chart rendering and real-time calculations.
              </p>
            </div>
          </div>
          
        <div className="flex space-x-3">
          <a
            href="https://github.com/username/repo-name"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-2 px-6 py-3 bg-gray-800 hover:bg-gray-900 text-white rounded-lg font-medium transition-all duration-200 transform hover:scale-105 shadow-lg"
          >
            <Github className="h-4 w-4" />
            <span>Code</span>
          </a>
        </div>
        </div>
      </div>
    </header>
  );
};

export default Header;