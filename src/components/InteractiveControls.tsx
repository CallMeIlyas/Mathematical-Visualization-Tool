import React from 'react';
import { MathConfig } from '../utils/mathFunctions';
import { Save, Download, Share2, RotateCcw } from 'lucide-react';

interface InteractiveControlsProps {
  config: MathConfig;
  onConfigChange: (config: MathConfig) => void;
  onSave: () => void;
  onLoad: () => void;
  onExport: () => void;
  onShare: () => void;
  onReset: () => void;
}

const InteractiveControls: React.FC<InteractiveControlsProps> = ({
  config,
  onConfigChange,
  onSave,
  onLoad,
  onExport,
  onShare,
  onReset
}) => {
  const handleInputChange = (field: keyof MathConfig, value: string | number) => {
    onConfigChange({
      ...config,
      [field]: typeof value === 'string' ? value : Number(value)
    });
  };

  const inputClasses = "w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200";
  const labelClasses = "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1";

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 transition-all duration-300">
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Interactive Controls</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Function Type */}
        <div>
          <label className={labelClasses}>Function Type</label>
          <select
            value={config.type}
            onChange={(e) => handleInputChange('type', e.target.value)}
            className={inputClasses}
          >
            <option value="integral">Double Integral</option>
            <option value="function">Trigonometric</option>
            <option value="parametric">Exponential</option>
          </select>
        </div>

        {/* Coefficients */}
        <div>
          <label className={labelClasses}>Coefficient A</label>
          <input
            type="number"
            step="0.1"
            value={config.coeffA}
            onChange={(e) => handleInputChange('coeffA', e.target.value)}
            className={inputClasses}
          />
        </div>

        <div>
          <label className={labelClasses}>Coefficient B</label>
          <input
            type="number"
            step="0.1"
            value={config.coeffB}
            onChange={(e) => handleInputChange('coeffB', e.target.value)}
            className={inputClasses}
          />
        </div>

        <div>
          <label className={labelClasses}>Coefficient C</label>
          <input
            type="number"
            step="0.1"
            value={config.coeffC}
            onChange={(e) => handleInputChange('coeffC', e.target.value)}
            className={inputClasses}
          />
        </div>

        {/* X Range */}
        <div>
          <label className={labelClasses}>X Min</label>
          <input
            type="number"
            value={config.xMin}
            onChange={(e) => handleInputChange('xMin', e.target.value)}
            className={inputClasses}
          />
        </div>

        <div>
          <label className={labelClasses}>X Max</label>
          <input
            type="number"
            value={config.xMax}
            onChange={(e) => handleInputChange('xMax', e.target.value)}
            className={inputClasses}
          />
        </div>

        {/* Y Range */}
        <div>
          <label className={labelClasses}>Y Min</label>
          <input
            type="number"
            value={config.yMin}
            onChange={(e) => handleInputChange('yMin', e.target.value)}
            className={inputClasses}
          />
        </div>

        <div>
          <label className={labelClasses}>Y Max</label>
          <input
            type="number"
            value={config.yMax}
            onChange={(e) => handleInputChange('yMax', e.target.value)}
            className={inputClasses}
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3 mt-6 pt-6 border-t border-gray-200 dark:border-gray-600">
        <button
          onClick={onSave}
          className="flex items-center space-x-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-all duration-200 transform hover:scale-105"
        >
          <Save className="h-4 w-4" />
          <span>Save</span>
        </button>
        
        <button
          onClick={onLoad}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-all duration-200 transform hover:scale-105"
        >
          <Download className="h-4 w-4" />
          <span>Load</span>
        </button>

        <button
          onClick={onExport}
          className="flex items-center space-x-2 px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg font-medium transition-all duration-200 transform hover:scale-105"
        >
          <Download className="h-4 w-4" />
          <span>Export</span>
        </button>

        <button
          onClick={onShare}
          className="flex items-center space-x-2 px-4 py-2 bg-teal-500 hover:bg-teal-600 text-white rounded-lg font-medium transition-all duration-200 transform hover:scale-105"
        >
          <Share2 className="h-4 w-4" />
          <span>Share</span>
        </button>

        <button
          onClick={onReset}
          className="flex items-center space-x-2 px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-medium transition-all duration-200 transform hover:scale-105"
        >
          <RotateCcw className="h-4 w-4" />
          <span>Reset</span>
        </button>
      </div>
    </div>
  );
};

export default InteractiveControls;