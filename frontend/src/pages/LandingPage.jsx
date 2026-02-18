import React from "react";
import { Box, BarChart3, Package, ShieldCheck, Zap } from "lucide-react";

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* Hero Section */}
      <header className="container mx-auto px-6 py-20 text-center">
        <h1 className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight">
          Inventory management <br />
          <span className="text-blue-600">without the headache.</span>
        </h1>
        <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto">
          Track stock levels, manage orders, and analyze sales data in
          real-time. Stop guessing and start growing with StockFlow.
        </p>
        <div className="flex flex-col md:flex-row justify-center gap-4">
          <button className="bg-blue-600 text-white px-8 py-4 rounded-xl text-lg font-bold shadow-lg hover:bg-blue-700">
            Get Started
          </button>
        </div>
      </header>

      {/* Features Section */}
      <section id="features" className="bg-white py-20">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-16">
            Everything you need to scale
          </h2>
          <div className="grid md:grid-cols-3 gap-12">
            <FeatureCard
              icon={<Zap className="text-yellow-500" />}
              title="Real-time Tracking"
              description="Automatic updates across all warehouses the moment a sale is made."
            />
            <FeatureCard
              icon={<BarChart3 className="text-blue-500" />}
              title="Advanced Analytics"
              description="Predict demand and avoid overstocking with our AI-driven insights."
            />
            <FeatureCard
              icon={<ShieldCheck className="text-green-500" />}
              title="Secure & Reliable"
              description="Enterprise-grade encryption keeps your supplier and customer data safe."
            />
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-slate-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              Simple, transparent pricing
            </h2>
            <p className="text-slate-600">
              No hidden fees. Scale as your warehouse grows.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Starter Plan */}
            <div className="bg-white p-8 rounded-2xl border border-slate-200 hover:border-blue-500 transition shadow-sm">
              <h3 className="text-xl font-bold mb-2">Starter</h3>
              <div className="text-4xl font-bold mb-6">
                $49
                <span className="text-lg text-slate-500 font-normal">/mo</span>
              </div>
              <ul className="space-y-4 mb-8 text-slate-600 text-sm">
                <li className="flex items-center gap-2">✓ Up to 500 SKUs</li>
                <li className="flex items-center gap-2">✓ 2 User Accounts</li>
                <li className="flex items-center gap-2">✓ Basic Reporting</li>
              </ul>
              <button className="w-full py-3 rounded-lg border border-blue-600 text-blue-600 font-bold hover:bg-blue-50">
                Choose Starter
              </button>
            </div>

            {/* Pro Plan */}
            <div className="bg-white p-8 rounded-2xl border-2 border-blue-600 relative shadow-xl transform scale-105">
              <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-4 py-1 rounded-full text-xs font-bold uppercase">
                Most Popular
              </span>
              <h3 className="text-xl font-bold mb-2">Professional</h3>
              <div className="text-4xl font-bold mb-6">
                $129
                <span className="text-lg text-slate-500 font-normal">/mo</span>
              </div>
              <ul className="space-y-4 mb-8 text-slate-600 text-sm">
                <li className="flex items-center gap-2 font-semibold text-slate-800">
                  ✓ Unlimited SKUs
                </li>
                <li className="flex items-center gap-2">✓ 10 User Accounts</li>
                <li className="flex items-center gap-2">
                  ✓ Advanced Forecasting
                </li>
                <li className="flex items-center gap-2">✓ API Access</li>
              </ul>
              <button className="w-full py-3 rounded-lg bg-blue-600 text-white font-bold hover:bg-blue-700 transition">
                Start 14-Day Trial
              </button>
            </div>

            {/* Enterprise */}
            <div className="bg-white p-8 rounded-2xl border border-slate-200 hover:border-blue-500 transition shadow-sm">
              <h3 className="text-xl font-bold mb-2">Enterprise</h3>
              <div className="text-4xl font-bold mb-6">Custom</div>
              <ul className="space-y-4 mb-8 text-slate-600 text-sm">
                <li className="flex items-center gap-2">
                  ✓ Multi-warehouse support
                </li>
                <li className="flex items-center gap-2">✓ Dedicated Manager</li>
                <li className="flex items-center gap-2">
                  ✓ Custom Integrations
                </li>
              </ul>
              <button className="w-full py-3 rounded-lg border border-slate-300 text-slate-700 font-bold hover:bg-slate-50">
                Contact Sales
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6 max-w-4xl">
          <h2 className="text-3xl font-bold text-center mb-12">
            Frequently Asked Questions
          </h2>
          <div className="space-y-8">
            <div>
              <h4 className="text-lg font-bold mb-2">
                How long does it take to set up?
              </h4>
              <p className="text-slate-600">
                Most teams are up and running in less than 24 hours. Our bulk
                import tool makes it easy to migrate your existing data from
                Excel or Shopify.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-bold mb-2">
                Can I integrate with my current POS?
              </h4>
              <p className="text-slate-600">
                Yes, we offer native integrations with Square, Clover, and
                Shopify, plus a robust API for custom setups.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-bold mb-2">
                What happens if I go over my SKU limit?
              </h4>
              <p className="text-slate-600">
                We won't cut you off. We'll simply notify you to upgrade to the
                next tier in your following billing cycle.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }) => (
  <div className="p-8 rounded-2xl border border-slate-100 bg-slate-50 hover:shadow-md transition">
    <div className="mb-4">{icon}</div>
    <h3 className="text-xl font-bold mb-2">{title}</h3>
    <p className="text-slate-600">{description}</p>
  </div>
);

export default LandingPage;
