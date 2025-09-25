import React from 'react';

const technologies = [
  { name: 'React', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' },
  { name: 'D3.js', color: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200' },
  { name: 'TypeScript', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' },
  { name: 'KaTeX', color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' },
  { name: 'Mathematical Libraries', color: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' }
];

const TechnologyBadges: React.FC = () => {
  return (
    <div className="flex flex-wrap gap-2">
      {technologies.map((tech) => (
        <span
          key={tech.name}
          className={`px-3 py-1 rounded-full text-sm font-medium transition-all duration-300 transform hover:scale-105 ${tech.color}`}
        >
          {tech.name}
        </span>
      ))}
    </div>
  );
};

export default TechnologyBadges;