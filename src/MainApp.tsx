import React, { useState, useCallback } from 'react';
import Header from './components/Header';
import ThemeToggle from './components/ThemeToggle';
import MathRenderer from './components/MathRenderer';
import TechnologyBadges from './components/TechnologyBadges';
import InteractiveControls from './components/InteractiveControls';
import Visualization from './components/Visualization';
import { MathConfig, defaultConfig, getLatexEquation } from './utils/mathFunctions';
import { useTheme } from './hooks/useTheme';

function MainApp() {
  useTheme(); // Initialize theme
  
  const [config, setConfig] = useState<MathConfig>(defaultConfig);
  const [visualizationType, setVisualizationType] = useState<'2d' | '3d' | 'contour'>('2d');
  const [savedConfigs, setSavedConfigs] = useState<MathConfig[]>([]);

  const handleConfigChange = useCallback((newConfig: MathConfig) => {
    setConfig(newConfig);
  }, []);

  const handleSave = useCallback(() => {
    const saved = [...savedConfigs, config];
    setSavedConfigs(saved);
    localStorage.setItem('mathConfigs', JSON.stringify(saved));
    alert('Configuration saved successfully!');
  }, [config, savedConfigs]);

  const handleLoad = useCallback(() => {
    const saved = localStorage.getItem('mathConfigs');
    if (saved) {
      const configs = JSON.parse(saved);
      if (configs.length > 0) {
        setConfig(configs[configs.length - 1]);
        setSavedConfigs(configs);
        alert('Configuration loaded successfully!');
      }
    } else {
      alert('No saved configurations found!');
    }
  }, []);

  const handleExport = useCallback(() => {
    const svg = document.querySelector('svg');
    if (svg) {
      const svgData = new XMLSerializer().serializeToString(svg);
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      canvas.width = 800;
      canvas.height = 600;
      
      img.onload = () => {
        if (ctx) {
          ctx.drawImage(img, 0, 0);
          const a = document.createElement('a');
          a.download = 'mathematical-visualization.png';
          a.href = canvas.toDataURL('image/png');
          a.click();
        }
      };
      
      img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
    }
  }, []);

  const handleShare = useCallback(() => {
    const params = new URLSearchParams({
      type: config.type,
      xMin: config.xMin.toString(),
      xMax: config.xMax.toString(),
      yMin: config.yMin.toString(),
      yMax: config.yMax.toString(),
      coeffA: config.coeffA.toString(),
      coeffB: config.coeffB.toString(),
      coeffC: config.coeffC.toString(),
      viz: visualizationType
    });
    
    const shareUrl = `${window.location.origin}${window.location.pathname}?${params.toString()}`;
    
    if (navigator.share) {
      navigator.share({
        title: 'Mathematical Visualization',
        text: 'Check out this mathematical function visualization!',
        url: shareUrl,
      });
    } else {
      navigator.clipboard.writeText(shareUrl).then(() => {
        alert('Share URL copied to clipboard!');
      });
    }
  }, [config, visualizationType]);

  const handleReset = useCallback(() => {
    setConfig(defaultConfig);
    setVisualizationType('2d');
  }, []);

  // Load config from URL parameters on mount
  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.has('type')) {
      const urlConfig: MathConfig = {
        type: params.get('type') as any || 'integral',
        equation: defaultConfig.equation,
        xMin: parseFloat(params.get('xMin') || defaultConfig.xMin.toString()),
        xMax: parseFloat(params.get('xMax') || defaultConfig.xMax.toString()),
        yMin: parseFloat(params.get('yMin') || defaultConfig.yMin.toString()),
        yMax: parseFloat(params.get('yMax') || defaultConfig.yMax.toString()),
        coeffA: parseFloat(params.get('coeffA') || defaultConfig.coeffA.toString()),
        coeffB: parseFloat(params.get('coeffB') || defaultConfig.coeffB.toString()),
        coeffC: parseFloat(params.get('coeffC') || defaultConfig.coeffC.toString()),
      };
      setConfig(urlConfig);
      
      const vizType = params.get('viz') as '2d' | '3d' | 'contour';
      if (vizType) {
        setVisualizationType(vizType);
      }
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <ThemeToggle />

      
      <main className="container mx-auto px-6 py-8 space-y-8">
        {/* Equation + Examples */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-8 transition-all duration-300">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">Current Equation</h2>
          <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6 mb-6">
            <MathRenderer 
              equation={getLatexEquation(config)} 
              block={true}
              className="text-center text-xl"
            />
          </div>

          <div className="mt-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">Technologies Used:</h3>
            <TechnologyBadges />
          </div>
        </div>

        {/* Controls */}
        <InteractiveControls
          config={config}
          onConfigChange={handleConfigChange}
          onSave={handleSave}
          onLoad={handleLoad}
          onExport={handleExport}
          onShare={handleShare}
          onReset={handleReset}
        />

        {/* Visualization */}
        <Visualization
          config={config}
          visualizationType={visualizationType}
          onVisualizationTypeChange={setVisualizationType}
        />

        {/* Footer */}
        <footer className="text-center py-8 text-gray-600 dark:text-gray-400">
          <p>Mathematical Visualization Tool - Built with React, TypeScript, D3.js, and KaTeX</p>
          <p className="mt-2">Explore the beauty of mathematics through interactive visualizations</p>
        </footer>
      </main>
    </div>
  );
}

export default MainApp;