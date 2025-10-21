import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const PricingPage: React.FC = () => {
  return (
    <div className="relative flex flex-col min-h-screen overflow-x-hidden">
      <Header variant="landing" />

      <main className="flex-1 bg-gray-50 px-10 py-20">
        <div className="max-w-6xl mx-auto flex flex-col gap-12">
          <section className="text-center">
            <h1 className="text-5xl font-extrabold text-gray-900 mb-4">
              Pricing Plans
            </h1>
            <p className="text-gray-600 text-lg max-w-3xl mx-auto">
              Choose a plan that fits your business or freelance needs. Simple, transparent pricing for clients and freelancers.
            </p>
          </section>

          <section className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-8">
            <div className="flex flex-col gap-6 rounded-2xl bg-white p-8 shadow-md hover:shadow-lg transition-shadow duration-300">
              <h2 className="text-gray-900 text-2xl font-bold">Free Plan</h2>
              <p className="text-gray-500 text-sm">
                Perfect for getting started. Post up to 3 jobs or apply to 3 projects per month.
              </p>
              <div className="text-3xl font-extrabold text-gray-900">$0<span className="text-base font-medium">/month</span></div>
              <button className="bg-gradient-to-br from-[#87CEEB] to-[#AFEEEE] text-white font-bold py-2 rounded-xl shadow-md hover:from-[#AFEEEE] hover:to-[#87CEEB] transition-all duration-300">
                Get Started
              </button>
            </div>

            <div className="flex flex-col gap-6 rounded-2xl bg-white p-8 shadow-md hover:shadow-lg transition-shadow duration-300">
              <h2 className="text-gray-900 text-2xl font-bold">Pro Plan</h2>
              <p className="text-gray-500 text-sm">
                For regular users. Unlimited job posts or project applications, plus priority support.
              </p>
              <div className="text-3xl font-extrabold text-gray-900">$29<span className="text-base font-medium">/month</span></div>
              <button className="bg-gradient-to-br from-[#87CEEB] to-[#AFEEEE] text-white font-bold py-2 rounded-xl shadow-md hover:from-[#AFEEEE] hover:to-[#87CEEB] transition-all duration-300">
                Get Started
              </button>
            </div>

            <div className="flex flex-col gap-6 rounded-2xl bg-white p-8 shadow-md hover:shadow-lg transition-shadow duration-300">
              <h2 className="text-gray-900 text-2xl font-bold">Enterprise</h2>
              <p className="text-gray-500 text-sm">
                Custom solutions for large teams or agencies. Contact us for pricing and features.
              </p>
              <div className="text-3xl font-extrabold text-gray-900">Custom</div>
              <button className="bg-gradient-to-br from-[#87CEEB] to-[#AFEEEE] text-white font-bold py-2 rounded-xl shadow-md hover:from-[#AFEEEE] hover:to-[#87CEEB] transition-all duration-300">
                Contact Sales
              </button>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PricingPage;
