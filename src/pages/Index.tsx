
import React, { useState } from 'react';
import ProductCalculator from "@/components/ProductCalculator";
import LandingPage from "@/components/LandingPage";

const Index = () => {
  const [showCalculator, setShowCalculator] = useState(false);

  if (showCalculator) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">Smart Cost Calculator</h1>
            <p className="text-lg text-gray-600">Professional real-time product pricing calculator</p>
          </div>
          <ProductCalculator onBack={() => setShowCalculator(false)} />
        </div>
      </div>
    );
  }

  return <LandingPage onGetStarted={() => setShowCalculator(true)} />;
};

export default Index;
