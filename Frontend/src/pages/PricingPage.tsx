import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Zap, Rocket, Building2, ArrowRight } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const PricingPage: React.FC = () => {
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');

  const plans = [
    {
      name: "Basic",
      icon: Zap,
      price: billingPeriod === 'monthly' ? "0" : "0",
      description: "Perfect for exploring the marketplace and starting small projects.",
      features: [
        "Post up to 3 projects/mo",
        "Apply to 5 jobs/mo",
        "Standard AI matching",
        "Community support",
        "Standard escrow protection"
      ],
      cta: "Get Started",
      popular: false
    },
    {
      name: "Professional",
      icon: Rocket,
      price: billingPeriod === 'monthly' ? "29" : "24",
      description: "For active users and growing businesses looking for consistency.",
      features: [
        "Unlimited project posts",
        "Unlimited applications",
        "Priority AI matching",
        "24/7 dedicated support",
        "Advanced escrow options",
        "Custom project analytics"
      ],
      cta: "Join Pro",
      popular: true
    },
    {
      name: "Enterprise",
      icon: Building2,
      price: "Custom",
      description: "Tailored solutions for large agencies and corporate hiring needs.",
      features: [
        "White-labeled workspace",
        "Dedicated account manager",
        "Direct API access",
        "Custom vetting service",
        "Bulk hiring tools",
        "SLA guarantees"
      ],
      cta: "Contact Sales",
      popular: false
    }
  ];

  return (
    <div className="relative min-h-screen bg-background text-text-primary overflow-x-hidden">
      <Header />

      <main className="pt-32 pb-20">
        <section className="container mx-auto px-6 mb-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight">
              Simple, <span className="text-primary italic">transparent</span> pricing
            </h1>
            <p className="text-text-secondary text-lg max-w-2xl mx-auto">
              Choose the plan that's right for you. No hidden fees, no complicated contracts.
            </p>

            {/* Billing Switcher */}
            <div className="flex items-center justify-center gap-4 mt-12">
              <span className={`text-sm font-bold transition-colors ${billingPeriod === 'monthly' ? 'text-white' : 'text-text-secondary'}`}>Monthly</span>
              <button
                onClick={() => setBillingPeriod(prev => prev === 'monthly' ? 'yearly' : 'monthly')}
                className="relative w-14 h-7 bg-surface border border-border rounded-full p-1 transition-all"
              >
                <motion.div
                  animate={{ x: billingPeriod === 'monthly' ? 0 : 28 }}
                  className="size-5 bg-primary rounded-full shadow-lg"
                />
              </button>
              <span className={`text-sm font-bold transition-colors ${billingPeriod === 'yearly' ? 'text-white' : 'text-text-secondary'}`}>
                Yearly <span className="text-primary text-[10px] ml-1 bg-primary/10 px-2 py-0.5 rounded-full">Save 20%</span>
              </span>
            </div>
          </motion.div>
        </section>

        <section className="container mx-auto px-6 mb-32">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {plans.map((plan, i) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className={`relative glass-card p-10 flex flex-col group hover:border-primary/40 transition-all ${plan.popular ? 'border-primary/50 shadow-2xl shadow-primary/10' : 'border-border'}`}
              >
                {plan.popular && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-white text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full shadow-lg">
                    Most Popular
                  </div>
                )}

                <div className="mb-8">
                  <div className={`size-14 rounded-2xl flex items-center justify-center mb-6 ${plan.popular ? 'bg-primary/20 text-primary' : 'bg-white/5 text-text-secondary'} group-hover:scale-110 transition-transform`}>
                    <plan.icon size={28} />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <p className="text-text-secondary text-sm leading-relaxed">{plan.description}</p>
                </div>

                <div className="mb-10">
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-black">{plan.price !== 'Custom' ? '$' : ''}{plan.price}</span>
                    {plan.price !== 'Custom' && (
                      <span className="text-text-secondary text-sm font-medium">
                        /{billingPeriod === 'monthly' ? 'mo' : 'yr'}
                      </span>
                    )}
                  </div>
                </div>

                <div className="space-y-4 mb-10 flex-1">
                  {plan.features.map(feature => (
                    <div key={feature} className="flex items-center gap-3 text-sm">
                      <div className={`p-0.5 rounded-full ${plan.popular ? 'bg-primary/20 text-primary' : 'bg-white/5 text-text-secondary'}`}>
                        <Check size={14} />
                      </div>
                      <span className="text-text-secondary">{feature}</span>
                    </div>
                  ))}
                </div>

                <button className={`w-full py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 group/btn ${plan.popular ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-white/5 text-white border border-white/5 hover:bg-white/10'}`}>
                  {plan.cta}
                  <ArrowRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </motion.div>
            ))}
          </div>
        </section>

        {/* FAQ / Trust badge section */}
        <section className="container mx-auto px-6 py-20">
          <div className="glass-card p-12 text-center md:flex md:items-center md:justify-between gap-8">
            <div className="text-left">
              <h4 className="text-2xl font-bold mb-2">Still have questions?</h4>
              <p className="text-text-secondary">Explore our documentation or chat with our support team.</p>
            </div>
            <div className="flex gap-4 mt-8 md:mt-0">
              <button className="btn-secondary px-8">Visit Help Center</button>
              <button className="btn-primary px-8">Contact Support</button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default PricingPage;
