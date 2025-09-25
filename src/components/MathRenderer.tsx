import React from 'react';
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';

interface MathRendererProps {
  equation: string;
  block?: boolean;
  className?: string;
}

const MathRenderer: React.FC<MathRendererProps> = ({ equation, block = false, className = '' }) => {
  const baseClasses = `transition-all duration-300 ${className}`;

  try {
    return (
      <div className={baseClasses}>
        {block ? (
          <BlockMath math={equation} />
        ) : (
          <InlineMath math={equation} />
        )}
      </div>
    );
  } catch (error) {
    return (
      <div className={`${baseClasses} text-red-500 dark:text-red-400`}>
        Error rendering equation: {equation}
      </div>
    );
  }
};

export default MathRenderer;