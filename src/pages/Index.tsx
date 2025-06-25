
import ProductCalculator from "@/components/ProductCalculator";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Product Pricing Calculator</h1>
          <p className="text-lg text-gray-600">Calculate your final product amount with GST and traveling costs</p>
        </div>
        <ProductCalculator />
      </div>
    </div>
  );
};

export default Index;
