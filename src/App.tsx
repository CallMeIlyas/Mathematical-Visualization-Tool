import React from 'react';
import MathProofVisualization from './components/MathProofVisualization';
import MainApp from './MainApp';

function App() {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Bagian baru (Math Proof) di atas */}
      <section className="py-10">
        <MathProofVisualization />
      </section>

      {/* Bagian lama di bawah */}
      <section className="py-10 border-t border-gray-300 dark:border-gray-700">
        <MainApp />
      </section>
    </div>
  );
}

export default App;