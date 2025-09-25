export interface MathConfig {
  type: 'integral' | 'function' | 'parametric';
  equation: string;
  xMin: number;
  xMax: number;
  yMin: number;
  yMax: number;
  coeffA: number;
  coeffB: number;
  coeffC: number;
}

export const defaultConfig: MathConfig = {
  type: 'integral',
  equation: 'x^2 + y',
  xMin: -5,
  xMax: 5,
  yMin: -5,
  yMax: 5,
  coeffA: 1,
  coeffB: 1,
  coeffC: 0
};

export const evaluateFunction = (x: number, y: number, config: MathConfig): number => {
  const { coeffA, coeffB, coeffC } = config;
  
  switch (config.type) {
    case 'integral':
      return coeffA * x * x + coeffB * y + coeffC;
    case 'function':
      return coeffA * Math.sin(coeffB * x) + coeffC * Math.cos(y);
    case 'parametric':
      return coeffA * Math.exp(-coeffB * (x * x + y * y)) + coeffC;
    default:
      return x * x + y;
  }
};

export const generateDataPoints = (config: MathConfig, resolution: number = 30) => {
  const points = [];
  const xStep = (config.xMax - config.xMin) / resolution;
  const yStep = (config.yMax - config.yMin) / resolution;

  for (let i = 0; i <= resolution; i++) {
    for (let j = 0; j <= resolution; j++) {
      const x = config.xMin + i * xStep;
      const y = config.yMin + j * yStep;
      const z = evaluateFunction(x, y, config);
      points.push({ x, y, z });
    }
  }
  
  return points;
};

export const getLatexEquation = (config: MathConfig): string => {
  const { coeffA, coeffB, coeffC, type } = config;
  
  switch (type) {
    case 'integral':
      return `\\iint_{${config.xMin}}^{${config.xMax}} \\int_{${config.yMin}}^{${config.yMax}} (${coeffA}x^2 + ${coeffB}y + ${coeffC}) \\, dx \\, dy`;
    case 'function':
      return `f(x,y) = ${coeffA}\\sin(${coeffB}x) + ${coeffC}\\cos(y)`;
    case 'parametric':
      return `f(x,y) = ${coeffA}e^{-${coeffB}(x^2 + y^2)} + ${coeffC}`;
    default:
      return 'f(x,y) = x^2 + y';
  }
};