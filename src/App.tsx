import React from "react";
import MathProofVisualization from "./components/MathProofVisualization";
import MainApp from "./MainApp";
import { useResponsive } from "./hooks/useResponsive";

function App() {
  const { isMobile, isTablet, isDesktop } = useResponsive();

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <section className="py-10">
        <MathProofVisualization />
      </section>

      <section className="py-10 border-t border-gray-300 dark:border-gray-700">
        <MainApp />
      </section>
    </div>
  );
}

export default App;