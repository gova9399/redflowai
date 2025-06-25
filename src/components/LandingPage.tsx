
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Calculator, Download, Share2, FileExport } from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="max-w-6xl mx-auto px-4 py-16">
        {/* Header */}
        <div className="flex items-center justify-between mb-16">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
              <Calculator className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-white">Smart Cost Calculator</span>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="text-white border-white/30 hover:bg-white/10">
              Sign In
            </Button>
          </div>
        </div>

        {/* Hero Section */}
        <div className="text-center mb-20">
          <h1 className="text-6xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-6">
            Smart Cost Calculator
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Calculate product costs with GST, discounts, and traveling charges. Export your calculations 
            and share them easily.
          </p>
          <div className="flex gap-4 justify-center">
            <Button 
              onClick={onGetStarted}
              size="lg" 
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-lg px-8 py-3"
            >
              Get Started
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="text-white border-white/30 hover:bg-white/10 text-lg px-8 py-3"
            >
              Sign In
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Calculator className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Smart Calculations</h3>
              <p className="text-gray-300">
                Automatically calculate GST, discounts, and traveling charges with real-time previews.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Download className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Multi-Format Export</h3>
              <p className="text-gray-300">
                Export your calculations as CSV, Excel, PDF, or JSON formats.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Share2 className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Easy Sharing</h3>
              <p className="text-gray-300">
                Generate shareable links and send via email, WhatsApp, or Telegram.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* How It Works */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-12">How It Works</h2>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: 1, title: "Add Products", desc: "Enter product details including price, quantity, and GST.", color: "from-blue-500 to-cyan-500" },
              { step: 2, title: "Auto Calculate", desc: "See real-time calculations with discounts and charges applied.", color: "from-green-500 to-emerald-500" },
              { step: 3, title: "Save & Export", desc: "Save calculations and export in your preferred format.", color: "from-purple-500 to-pink-500" },
              { step: 4, title: "Share Results", desc: "Generate shareable links for clients and colleagues.", color: "from-orange-500 to-red-500" }
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className={`w-16 h-16 bg-gradient-to-r ${item.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
                  <span className="text-2xl font-bold text-white">{item.step}</span>
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                <p className="text-gray-300 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <Card className="bg-gradient-to-r from-purple-600/30 to-blue-600/30 border-white/20 backdrop-blur-sm">
          <CardContent className="p-12 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to simplify your cost calculations?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Join thousands of users who trust our smart calculator for their business needs.
            </p>
            <Button 
              onClick={onGetStarted}
              size="lg"
              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-lg px-8 py-3"
            >
              Start Calculating Now
            </Button>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-16 text-gray-400">
          <p>© 2025 Smart Cost Calculator. Built with React & TypeScript.</p>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
