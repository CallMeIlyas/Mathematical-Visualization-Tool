import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Calculator, Book, TrendingUp, Image, Shuffle, Lock, Sun, Moon, Play, Pause, RotateCcw, Download, Share2 } from 'lucide-react';
import * as d3 from 'd3';
import Header from '../components/Header';

// Theme Hook
const useTheme = () => {
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') || 'light';
    }
    return 'light';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  return { theme, toggleTheme };
};

// Graph Theory Algorithms
const generateGraph = (nodes, edges, type) => {
  const graph = { nodes: [], edges: [] };
  
  // Generate random nodes
  for (let i = 0; i < nodes; i++) {
    graph.nodes.push({
      id: i,
      x: Math.random() * 400 + 50,
      y: Math.random() * 300 + 50,
      label: String.fromCharCode(65 + i)
    });
  }

  // Generate random edges
  const usedEdges = new Set();
  for (let i = 0; i < edges; i++) {
    let source, target, weight;
    do {
      source = Math.floor(Math.random() * nodes);
      target = Math.floor(Math.random() * nodes);
      weight = Math.floor(Math.random() * 20) + 1;
    } while (source === target || usedEdges.has(`${Math.min(source, target)}-${Math.max(source, target)}`));
    
    usedEdges.add(`${Math.min(source, target)}-${Math.max(source, target)}`);
    graph.edges.push({ source, target, weight });
  }

  return graph;
};

const dijkstra = (graph, start) => {
  const distances = {};
  const visited = new Set();
  const path = {};
  const steps = [];

  graph.nodes.forEach(node => {
    distances[node.id] = Infinity;
    path[node.id] = null;
  });
  distances[start] = 0;

  while (visited.size < graph.nodes.length) {
    let current = null;
    let minDistance = Infinity;

    for (const node of graph.nodes) {
      if (!visited.has(node.id) && distances[node.id] < minDistance) {
        current = node.id;
        minDistance = distances[node.id];
      }
    }

    if (current === null) break;
    
    visited.add(current);
    steps.push({ current, visited: new Set(visited), distances: { ...distances } });

    graph.edges.forEach(edge => {
      if (edge.source === current && !visited.has(edge.target)) {
        const alt = distances[current] + edge.weight;
        if (alt < distances[edge.target]) {
          distances[edge.target] = alt;
          path[edge.target] = current;
        }
      } else if (edge.target === current && !visited.has(edge.source)) {
        const alt = distances[current] + edge.weight;
        if (alt < distances[edge.source]) {
          distances[edge.source] = alt;
          path[edge.source] = current;
        }
      }
    });
  }

  return { distances, path, steps };
};

// Gradient Descent Visualization
const GradientDescent = ({ isPlaying, onReset }) => {
  const svgRef = useRef();
  const [learningRate, setLearningRate] = useState(0.1);
  const [currentPoint, setCurrentPoint] = useState({ x: 3, y: 2 });
  const [path, setPath] = useState([]);
  const [step, setStep] = useState(0);

  const f = (x, y) => (x - 2) ** 2 + (y - 1) ** 2 + Math.sin(x * y) * 0.5;
  const gradientX = (x, y) => 2 * (x - 2) + 0.5 * Math.cos(x * y) * y;
  const gradientY = (x, y) => 2 * (y - 1) + 0.5 * Math.cos(x * y) * x;

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const margin = { top: 20, right: 20, bottom: 40, left: 40 };
    const width = 500 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    const xScale = d3.scaleLinear().domain([0, 5]).range([0, width]);
    const yScale = d3.scaleLinear().domain([0, 4]).range([height, 0]);
    const colorScale = d3.scaleSequential(d3.interpolateViridis).domain([0, 20]);

    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    // Draw contour plot
    const contourData = [];
    for (let i = 0; i <= 50; i++) {
      for (let j = 0; j <= 40; j++) {
        const x = (i / 50) * 5;
        const y = (j / 40) * 4;
        contourData.push({ x, y, z: f(x, y) });
      }
    }

    g.selectAll('.contour-cell')
      .data(contourData)
      .enter()
      .append('rect')
      .attr('class', 'contour-cell')
      .attr('x', d => xScale(d.x) - 5)
      .attr('y', d => yScale(d.y) - 5)
      .attr('width', 10)
      .attr('height', 10)
      .attr('fill', d => colorScale(d.z))
      .attr('opacity', 0.3);

    // Draw path
    if (path.length > 1) {
      const line = d3.line()
        .x(d => xScale(d.x))
        .y(d => yScale(d.y))
        .curve(d3.curveMonotoneX);

      g.append('path')
        .datum(path)
        .attr('fill', 'none')
        .attr('stroke', '#ff4444')
        .attr('stroke-width', 2)
        .attr('d', line);
    }

    // Draw current point
    g.append('circle')
      .attr('cx', xScale(currentPoint.x))
      .attr('cy', yScale(currentPoint.y))
      .attr('r', 6)
      .attr('fill', '#ff4444')
      .attr('stroke', 'white')
      .attr('stroke-width', 2);

    // Draw gradient vector
    const gradX = gradientX(currentPoint.x, currentPoint.y);
    const gradY = gradientY(currentPoint.x, currentPoint.y);
    const scale = 20;

    g.append('line')
      .attr('x1', xScale(currentPoint.x))
      .attr('y1', yScale(currentPoint.y))
      .attr('x2', xScale(currentPoint.x) - gradX * scale)
      .attr('y2', yScale(currentPoint.y) + gradY * scale)
      .attr('stroke', '#44ff44')
      .attr('stroke-width', 2)
      .attr('marker-end', 'url(#arrowhead)');

    // Add arrow marker
    svg.append('defs').append('marker')
      .attr('id', 'arrowhead')
      .attr('viewBox', '0 -5 10 10')
      .attr('refX', 5)
      .attr('refY', -1.5)
      .attr('markerWidth', 6)
      .attr('markerHeight', 6)
      .attr('orient', 'auto')
      .append('path')
      .attr('d', 'M0,-5L10,0L0,5')
      .attr('fill', '#44ff44');

    // Add axes
    g.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(xScale));

    g.append('g')
      .call(d3.axisLeft(yScale));

  }, [currentPoint, path]);

  useEffect(() => {
    let interval;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentPoint(prev => {
          const gradX = gradientX(prev.x, prev.y);
          const gradY = gradientY(prev.x, prev.y);
          const newPoint = {
            x: prev.x - learningRate * gradX,
            y: prev.y - learningRate * gradY
          };
          
          setPath(p => [...p, newPoint]);
          setStep(s => s + 1);
          
          return newPoint;
        });
      }, 200);
    }
    return () => clearInterval(interval);
  }, [isPlaying, learningRate]);

  const handleReset = () => {
    setCurrentPoint({ x: 3, y: 2 });
    setPath([{ x: 3, y: 2 }]);
    setStep(0);
    onReset();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-4">
        <label className="text-sm font-medium">Learning Rate:</label>
        <input
          type="range"
          min="0.01"
          max="0.5"
          step="0.01"
          value={learningRate}
          onChange={(e) => setLearningRate(parseFloat(e.target.value))}
          className="flex-1"
        />
        <span className="text-sm w-12">{learningRate.toFixed(2)}</span>
      </div>
      
      <div className="text-sm text-gray-600 dark:text-gray-400">
        Step: {step} | Current: ({currentPoint.x.toFixed(3)}, {currentPoint.y.toFixed(3)}) | 
        Value: {f(currentPoint.x, currentPoint.y).toFixed(3)}
      </div>
      
      <svg ref={svgRef} width="500" height="400" className="border rounded bg-white dark:bg-gray-800" />
      
      <button
        onClick={handleReset}
        className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-medium"
      >
        Reset
      </button>
    </div>
  );
};

// SVD Visualization
const SVDVisualization = () => {
  const [rank, setRank] = useState(5);
  const [originalMatrix, setOriginalMatrix] = useState(null);
  const [reconstructed, setReconstructed] = useState(null);

  useEffect(() => {
    // Generate a simple example matrix (like a simple image pattern)
    const size = 20;
    const matrix = Array(size).fill().map(() => Array(size).fill(0));
    
    // Create a simple pattern
    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        matrix[i][j] = Math.sin((i + j) * 0.3) * Math.cos(i * 0.2) + 
                      Math.sin(j * 0.4) * 0.5 + 
                      Math.random() * 0.1;
      }
    }
    
    setOriginalMatrix(matrix);
    
    // Simulate SVD reconstruction (simplified)
    const reconstructedMatrix = Array(size).fill().map(() => Array(size).fill(0));
    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        let value = 0;
        for (let k = 0; k < rank; k++) {
          // Simplified reconstruction - in real SVD this would use U, Σ, V matrices
          const factor = Math.exp(-k * 0.1); // Decreasing singular values
          value += matrix[i][j] * factor * (k < rank ? 1 : 0);
        }
        reconstructedMatrix[i][j] = value;
      }
    }
    
    setReconstructed(reconstructedMatrix);
  }, [rank]);

  const renderMatrix = (matrix, title) => {
    if (!matrix) return null;
    
    const max = Math.max(...matrix.flat());
    const min = Math.min(...matrix.flat());
    
    return (
      <div className="space-y-2">
        <h4 className="font-medium">{title}</h4>
        <div className="grid grid-cols-20 gap-0 w-80 h-80 border">
          {matrix.flat().map((value, idx) => {
            const normalized = (value - min) / (max - min);
            const gray = Math.floor(normalized * 255);
            return (
              <div
                key={idx}
                className="w-4 h-4"
                style={{ backgroundColor: `rgb(${gray}, ${gray}, ${gray})` }}
              />
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-4">
        <label className="text-sm font-medium">Rank (Singular Values):</label>
        <input
          type="range"
          min="1"
          max="15"
          value={rank}
          onChange={(e) => setRank(parseInt(e.target.value))}
          className="flex-1"
        />
        <span className="text-sm w-8">{rank}</span>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {renderMatrix(originalMatrix, 'Original Matrix')}
        {renderMatrix(reconstructed, `Reconstructed (Rank ${rank})`)}
      </div>
      
      <div className="text-sm text-gray-600 dark:text-gray-400">
        <p>SVD decomposes matrix A = UΣVᵀ where:</p>
        <p>• U: Left singular vectors (orthogonal)</p>
        <p>• Σ: Singular values (diagonal, decreasing)</p>
        <p>• Vᵀ: Right singular vectors (orthogonal)</p>
        <p>Lower rank approximation uses only the largest {rank} singular values.</p>
      </div>
    </div>
  );
};

// Sorting Algorithms Comparison
const SortingComparison = ({ isPlaying, onReset }) => {
  const [arraySize, setArraySize] = useState(50);
  const [arrays, setArrays] = useState({ quicksort: [], mergesort: [], randomizedQuicksort: [] });
  const [steps, setSteps] = useState({ quicksort: 0, mergesort: 0, randomizedQuicksort: 0 });
  const [comparisons, setComparisons] = useState({ quicksort: 0, mergesort: 0, randomizedQuicksort: 0 });

  const generateArray = useCallback(() => {
    const arr = Array.from({ length: arraySize }, (_, i) => ({
      value: Math.floor(Math.random() * 100),
      index: i,
      isComparing: false,
      isPivot: false
    }));
    
    setArrays({
      quicksort: [...arr],
      mergesort: [...arr],
      randomizedQuicksort: [...arr]
    });
    setSteps({ quicksort: 0, mergesort: 0, randomizedQuicksort: 0 });
    setComparisons({ quicksort: 0, mergesort: 0, randomizedQuicksort: 0 });
  }, [arraySize]);

  useEffect(() => {
    generateArray();
  }, [generateArray]);

  const renderArray = (array, title, algorithm) => (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <h4 className="font-medium">{title}</h4>
        <div className="text-sm text-gray-600 dark:text-gray-400">
          Steps: {steps[algorithm]} | Comparisons: {comparisons[algorithm]}
        </div>
      </div>
      <div className="flex items-end space-x-1 h-32 bg-gray-100 dark:bg-gray-700 p-2 rounded">
        {array.map((item, idx) => (
          <div
            key={idx}
            className={`flex-1 transition-all duration-200 ${
              item.isPivot ? 'bg-red-500' : 
              item.isComparing ? 'bg-yellow-500' : 
              'bg-blue-500'
            }`}
            style={{ height: `${(item.value / 100) * 100}%` }}
          />
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-4">
        <label className="text-sm font-medium">Array Size:</label>
        <input
          type="range"
          min="10"
          max="100"
          value={arraySize}
          onChange={(e) => setArraySize(parseInt(e.target.value))}
          className="flex-1"
        />
        <span className="text-sm w-12">{arraySize}</span>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {renderArray(arrays.quicksort, 'QuickSort (Deterministic)', 'quicksort')}
        {renderArray(arrays.mergesort, 'MergeSort', 'mergesort')}
        {renderArray(arrays.randomizedQuicksort, 'Randomized QuickSort', 'randomizedQuicksort')}
      </div>
      
      <div className="flex space-x-2">
        <button
          onClick={generateArray}
          className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium"
        >
          Generate New Array
        </button>
        <button
          onClick={onReset}
          className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-medium"
        >
          Reset
        </button>
      </div>
      
      <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
        <p>• <strong>QuickSort:</strong> O(n log n) average, O(n²) worst case</p>
        <p>• <strong>MergeSort:</strong> O(n log n) guaranteed, stable</p>
        <p>• <strong>Randomized QuickSort:</strong> O(n log n) expected, avoids worst case</p>
      </div>
    </div>
  );
};

// RSA Encryption Visualization
const RSAVisualization = () => {
  const [p, setP] = useState(11);
  const [q, setQ] = useState(13);
  const [message, setMessage] = useState(42);
  const [steps, setSteps] = useState([]);

  useEffect(() => {
    const n = p * q;
    const phi = (p - 1) * (q - 1);
    
    // Find e (commonly 65537, but we'll use smaller for demo)
    let e = 3;
    while (gcd(e, phi) !== 1 && e < phi) {
      e++;
    }
    
    // Find d (modular inverse of e mod phi)
    const d = modInverse(e, phi);
    
    // Encryption: c = m^e mod n
    const encrypted = modPow(message, e, n);
    
    // Decryption: m = c^d mod n
    const decrypted = modPow(encrypted, d, n);
    
    setSteps([
      { step: 1, description: `Choose primes: p = ${p}, q = ${q}` },
      { step: 2, description: `Calculate n = p × q = ${n}` },
      { step: 3, description: `Calculate φ(n) = (p-1)(q-1) = ${phi}` },
      { step: 4, description: `Choose e = ${e} (gcd(e, φ(n)) = 1)` },
      { step: 5, description: `Calculate d = ${d} (e⁻¹ mod φ(n))` },
      { step: 6, description: `Public key: (${e}, ${n}), Private key: (${d}, ${n})` },
      { step: 7, description: `Encryption: ${message}^${e} mod ${n} = ${encrypted}` },
      { step: 8, description: `Decryption: ${encrypted}^${d} mod ${n} = ${decrypted}` }
    ]);
  }, [p, q, message]);

  const gcd = (a, b) => b === 0 ? a : gcd(b, a % b);
  
  const modInverse = (a, m) => {
    for (let i = 1; i < m; i++) {
      if ((a * i) % m === 1) return i;
    }
    return 1;
  };
  
  const modPow = (base, exp, mod) => {
    let result = 1;
    base = base % mod;
    while (exp > 0) {
      if (exp % 2 === 1) {
        result = (result * base) % mod;
      }
      exp = Math.floor(exp / 2);
      base = (base * base) % mod;
    }
    return result;
  };

  const isPrime = (n) => {
    if (n < 2) return false;
    for (let i = 2; i <= Math.sqrt(n); i++) {
      if (n % i === 0) return false;
    }
    return true;
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Prime p:</label>
          <input
            type="number"
            value={p}
            onChange={(e) => setP(parseInt(e.target.value) || 2)}
            className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
          />
          {!isPrime(p) && <p className="text-red-500 text-xs mt-1">Not prime!</p>}
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Prime q:</label>
          <input
            type="number"
            value={q}
            onChange={(e) => setQ(parseInt(e.target.value) || 2)}
            className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
          />
          {!isPrime(q) && <p className="text-red-500 text-xs mt-1">Not prime!</p>}
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Message (m):</label>
          <input
            type="number"
            value={message}
            onChange={(e) => setMessage(parseInt(e.target.value) || 1)}
            className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
          />
        </div>
      </div>
      
      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
        <h4 className="font-medium mb-3">RSA Encryption Steps:</h4>
        <div className="space-y-2">
          {steps.map((step) => (
            <div key={step.step} className="flex items-start space-x-2">
              <span className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white text-xs rounded-full flex items-center justify-center">
                {step.step}
              </span>
              <span className="text-sm">{step.description}</span>
            </div>
          ))}
        </div>
      </div>
      
      <div className="text-sm text-gray-600 dark:text-gray-400">
        <p><strong>Security:</strong> RSA security depends on the difficulty of factoring large numbers.</p>
        <p><strong>Key Size:</strong> Real RSA uses much larger primes (1024+ bits) for security.</p>
      </div>
    </div>
  );
};

// Main Component
const App = () => {
  const { theme, toggleTheme } = useTheme();
  const [activeSection, setActiveSection] = useState('graph');
  const [isPlaying, setIsPlaying] = useState(false);

  const sections = [
    { id: 'graph', label: 'Graph Theory', icon: Calculator },
    { id: 'gradient', label: 'Gradient Descent', icon: TrendingUp },,
    { id: 'sorting', label: 'Sorting Algorithms', icon: Shuffle },
    { id: 'rsa', label: 'RSA Encryption', icon: Lock }
  ];

  const handleReset = () => {
    setIsPlaying(false);
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'graph':
        return <GraphTheorySection />;
      case 'gradient':
        return <GradientDescent isPlaying={isPlaying} onReset={handleReset} />;
      case 'svd':
        return <SVDVisualization />;
      case 'sorting':
        return <SortingComparison isPlaying={isPlaying} onReset={handleReset} />;
      case 'rsa':
        return <RSAVisualization />;
      default:
        return <GraphTheorySection />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* Theme Toggle */}
      <button
        onClick={toggleTheme}
        className="fixed top-4 right-4 z-50 p-3 bg-white dark:bg-gray-800 rounded-full shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300"
      >
        {theme === 'light' ? (
          <Moon className="h-5 w-5 text-gray-700" />
        ) : (
          <Sun className="h-5 w-5 text-yellow-500" />
        )}
      </button>
      
      <Header />

      {/* Navigation */}
      <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-6">
          <div className="flex space-x-1 overflow-x-auto">
            {sections.map((section) => {
              const Icon = section.icon;
              return (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`flex items-center space-x-2 px-4 py-3 font-medium whitespace-nowrap transition-all duration-200 ${
                    activeSection === section.id
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{section.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
          {/* Play Controls for applicable sections */}
          {(activeSection === 'gradient' || activeSection === 'sorting') && (
            <div className="flex items-center space-x-2 mb-6 pb-6 border-b border-gray-200 dark:border-gray-600">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium"
              >
                {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                <span>{isPlaying ? 'Pause' : 'Play'}</span>
              </button>
              
              <button
                onClick={handleReset}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-medium"
              >
                <RotateCcw className="h-4 w-4" />
                <span>Reset</span>
              </button>
            </div>
          )}
          
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

// Graph Theory Section Component
const GraphTheorySection = () => {
  const svgRef = useRef();
  const [algorithm, setAlgorithm] = useState('dijkstra');
  const [graph, setGraph] = useState(null);
  const [result, setResult] = useState(null);
  const [animationStep, setAnimationStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const newGraph = generateGraph(6, 9, algorithm);
    setGraph(newGraph);
    
    if (algorithm === 'dijkstra') {
      const dijkstraResult = dijkstra(newGraph, 0);
      setResult(dijkstraResult);
    }
    setAnimationStep(0);
  }, [algorithm]);

  useEffect(() => {
    if (!svgRef.current || !graph) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const width = 500;
    const height = 400;

    // Draw edges
    svg.selectAll('.edge')
      .data(graph.edges)
      .enter()
      .append('line')
      .attr('class', 'edge')
      .attr('x1', d => graph.nodes[d.source].x)
      .attr('y1', d => graph.nodes[d.source].y)
      .attr('x2', d => graph.nodes[d.target].x)
      .attr('y2', d => graph.nodes[d.target].y)
      .attr('stroke', '#94a3b8')
      .attr('stroke-width', 2);

    // Draw edge weights
    svg.selectAll('.weight')
      .data(graph.edges)
      .enter()
      .append('text')
      .attr('class', 'weight')
      .attr('x', d => (graph.nodes[d.source].x + graph.nodes[d.target].x) / 2)
      .attr('y', d => (graph.nodes[d.source].y + graph.nodes[d.target].y) / 2)
      .attr('text-anchor', 'middle')
      .attr('fill', '#475569')
      .attr('font-size', '12px')
      .attr('font-weight', 'bold')
      .text(d => d.weight);

    // Draw nodes
    svg.selectAll('.node')
      .data(graph.nodes)
      .enter()
      .append('circle')
      .attr('class', 'node')
      .attr('cx', d => d.x)
      .attr('cy', d => d.y)
      .attr('r', 20)
      .attr('fill', (d, i) => {
        if (result && result.steps[animationStep]) {
          const step = result.steps[animationStep];
          if (step.current === i) return '#ef4444'; // Current node
          if (step.visited.has(i)) return '#22c55e'; // Visited
        }
        return '#3b82f6'; // Default
      })
      .attr('stroke', 'white')
      .attr('stroke-width', 3);

    // Draw node labels
    svg.selectAll('.node-label')
      .data(graph.nodes)
      .enter()
      .append('text')
      .attr('class', 'node-label')
      .attr('x', d => d.x)
      .attr('y', d => d.y + 5)
      .attr('text-anchor', 'middle')
      .attr('fill', 'white')
      .attr('font-size', '14px')
      .attr('font-weight', 'bold')
      .text(d => d.label);

    // Draw distances (for Dijkstra)
    if (result && algorithm === 'dijkstra' && result.steps[animationStep]) {
      const distances = result.steps[animationStep].distances;
      svg.selectAll('.distance')
        .data(graph.nodes)
        .enter()
        .append('text')
        .attr('class', 'distance')
        .attr('x', d => d.x + 25)
        .attr('y', d => d.y - 25)
        .attr('text-anchor', 'middle')
        .attr('fill', '#1f2937')
        .attr('font-size', '12px')
        .attr('font-weight', 'bold')
        .text((d, i) => distances[i] === Infinity ? '∞' : distances[i]);
    }

  }, [graph, algorithm, result, animationStep]);

  const handleAnimate = () => {
    if (!result || !result.steps) return;
    
    setIsAnimating(true);
    let step = 0;
    const interval = setInterval(() => {
      if (step >= result.steps.length - 1) {
        clearInterval(interval);
        setIsAnimating(false);
        return;
      }
      setAnimationStep(step);
      step++;
    }, 1000);
  };

  const algorithms = [
    { id: 'dijkstra', name: 'Dijkstra\'s Shortest Path' },
    { id: 'mst', name: 'Minimum Spanning Tree' },
    { id: 'maxflow', name: 'Maximum Flow' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Graph Theory Algorithms
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Visualize fundamental graph algorithms with step-by-step execution
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <select
            value={algorithm}
            onChange={(e) => setAlgorithm(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            {algorithms.map(alg => (
              <option key={alg.id} value={alg.id}>{alg.name}</option>
            ))}
          </select>
          
          <button
            onClick={handleAnimate}
            disabled={isAnimating}
            className="px-4 py-2 bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white rounded-lg font-medium"
          >
            {isAnimating ? 'Animating...' : 'Animate'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 p-4">
            <svg ref={svgRef} width="500" height="400" className="w-full h-auto" />
          </div>
          
          {algorithm === 'dijkstra' && result && (
            <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
              <p><strong>Current Step:</strong> {animationStep + 1} / {result.steps.length}</p>
              {result.steps[animationStep] && (
                <p><strong>Processing:</strong> Node {graph.nodes[result.steps[animationStep].current]?.label}</p>
              )}
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
            <h4 className="font-semibold mb-3">Algorithm Information</h4>
            
            {algorithm === 'dijkstra' && (
              <div className="space-y-2 text-sm">
                <p><strong>Dijkstra's Algorithm:</strong></p>
                <p>• Finds shortest paths from source to all vertices</p>
                <p>• Time Complexity: O((V + E) log V)</p>
                <p>• Works only with non-negative edge weights</p>
                <p>• Uses greedy approach with priority queue</p>
                
                <div className="mt-4 space-y-1">
                  <p><strong>Legend:</strong></p>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-blue-500 rounded"></div>
                    <span>Unvisited</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-red-500 rounded"></div>
                    <span>Current</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-green-500 rounded"></div>
                    <span>Visited</span>
                  </div>
                </div>
              </div>
            )}

            {algorithm === 'mst' && (
              <div className="space-y-2 text-sm">
                <p><strong>Minimum Spanning Tree:</strong></p>
                <p>• Connects all vertices with minimum total weight</p>
                <p>• Kruskal's: O(E log E) using Union-Find</p>
                <p>• Prim's: O((V + E) log V) using priority queue</p>
                <p>• Results in tree with V-1 edges</p>
              </div>
            )}

            {algorithm === 'maxflow' && (
              <div className="space-y-2 text-sm">
                <p><strong>Maximum Flow:</strong></p>
                <p>• Ford-Fulkerson method</p>
                <p>• Finds maximum flow from source to sink</p>
                <p>• Time Complexity: O(E × max_flow)</p>
                <p>• Uses augmenting paths</p>
              </div>
            )}
          </div>

          {result && algorithm === 'dijkstra' && (
            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
              <h4 className="font-semibold mb-3">Final Distances</h4>
              <div className="space-y-1 text-sm">
                {graph.nodes.map((node, idx) => (
                  <div key={idx} className="flex justify-between">
                    <span>To {node.label}:</span>
                    <span className="font-mono">
                      {result.distances[idx] === Infinity ? '∞' : result.distances[idx]}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;