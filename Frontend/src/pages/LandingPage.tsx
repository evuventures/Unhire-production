import React from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, Users, Clock, ArrowRight, Star, Shield, Zap, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import Header from '../components/Header';
import Footer from '../components/Footer';

const LandingPage: React.FC = () => {
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const stagger = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <div className="relative min-h-screen bg-background text-text-primary overflow-x-hidden">
      <Header />

      <main>
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
          {/* Animated Background Elements */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] pointer-events-none overflow-hidden">
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 blur-[120px] rounded-full animate-pulse" />
            <div className="absolute bottom-[10%] right-[-5%] w-[30%] h-[30%] bg-indigo-500/10 blur-[100px] rounded-full animate-pulse delay-700" />
          </div>

          <div className="container mx-auto px-6 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 glass mb-8"
              >
                <div className="size-2 rounded-full bg-primary animate-ping" />
                <span className="text-sm font-medium text-text-secondary">Revolutionizing the global workforce</span>
              </motion.div>

              <motion.h1
                {...fadeInUp}
                className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 leading-[1.1]"
              >
                Find the perfect <span className="bg-gradient-to-r from-primary to-indigo-400 bg-clip-text text-transparent italic">expert</span> for your vision
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-lg md:text-xl text-text-secondary mb-12 max-w-2xl mx-auto leading-relaxed"
              >
                Unhire connects top-tier talent with ambitious projects. Whether you're hiring or looking to build, we make collaboration seamless, secure, and instant.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="flex flex-col sm:flex-row items-center justify-center gap-4"
              >
                <Link to="/signup?role=client" className="btn-primary w-full sm:w-auto px-8 py-4 text-base">
                  Hire Instantly
                </Link>
                <Link to="/signup?role=expert" className="btn-secondary w-full sm:w-auto px-8 py-4 text-base">
                  Start Working
                </Link>
              </motion.div>
            </div>

            {/* Dashboard Preview / Visual element */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="mt-20 relative max-w-5xl mx-auto"
            >
              <div className="glass-card p-2 rounded-[2.5rem] shadow-2xl shadow-primary/10 overflow-hidden group">
                <img
                  src="https://images.pexels.com/photos/3182812/pexels-photo-3182812.jpeg?auto=compress&cs=tinysrgb&w=1600"
                  alt="Unhire Platform"
                  className="rounded-[2rem] w-full h-auto object-cover aspect-[16/9] grayscale-[0.5] group-hover:grayscale-0 transition-all duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent pointer-events-none" />
              </div>
            </motion.div>
          </div>
        </section>

        {/* Dynamic Benefits / Stats */}
        <section className="py-24 bg-surface/30">
          <div className="container mx-auto px-6">
            <motion.div
              variants={stagger}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-3 gap-12"
            >
              {[
                { icon: Zap, title: "Instant Hiring", desc: "No more long interview cycles. Find vetted experts in minutes, not weeks." },
                { icon: Shield, title: "Secure Escrow", desc: "Your payments are protected. Funds are only released when you're satisfied." },
                { icon: Users, title: "Global Talent", desc: "Access a world-class network of developers, designers, and strategists." }
              ].map((item, i) => (
                <motion.div
                  key={i}
                  variants={fadeInUp}
                  className="flex flex-col items-center text-center group"
                >
                  <div className="size-16 rounded-2xl glass flex items-center justify-center mb-6 group-hover:bg-primary/10 group-hover:border-primary/50 transition-all duration-300">
                    <item.icon className="text-primary" size={32} />
                  </div>
                  <h3 className="text-xl font-bold mb-4">{item.title}</h3>
                  <p className="text-text-secondary leading-relaxed">{item.desc}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Detailed Features */}
        <section className="py-32 relative overflow-hidden">
          <div className="container mx-auto px-6">
            <div className="flex flex-col md:flex-row items-center gap-20 mb-32">
              <div className="flex-1">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                >
                  <h2 className="text-3xl md:text-5xl font-bold mb-8 leading-tight">
                    Optimized for modern <br /> remote collaboration
                  </h2>
                  <div className="space-y-6">
                    {[
                      "Real-time task tracking and deliverables",
                      "Automated invoicing and reporting",
                      "Direct messaging and video consultation",
                      "AI-powered talent matching"
                    ].map((feature, i) => (
                      <div key={i} className="flex items-center gap-4">
                        <CheckCircle2 className="text-primary" size={24} />
                        <span className="text-lg text-text-secondary">{feature}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </div>
              <div className="flex-1 relative">
                <div className="glass-card rounded-3xl p-4 overflow-hidden shadow-2xl relative z-10">
                  <img src="https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=800" alt="Collaboration" className="rounded-2xl w-full" />
                </div>
                <div className="absolute -top-10 -right-10 w-64 h-64 bg-primary/20 blur-[80px] rounded-full" />
              </div>
            </div>
          </div>
        </section>

        {/* Pricing/CTA */}
        <section className="py-32 relative">
          <div className="container mx-auto px-6 text-center">
            <div className="glass-card max-w-4xl mx-auto p-12 md:p-20 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8">
                <Zap className="text-primary/20 animate-pulse" size={120} />
              </div>

              <h2 className="text-4xl md:text-6xl font-bold mb-8">Ready to unhire?</h2>
              <p className="text-xl text-text-secondary mb-12 max-w-xl mx-auto">
                Join thousands of businesses and freelancers building the future together.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                <Link to="/signup" className="btn-primary px-12 py-5 text-lg">
                  Create Free Account
                </Link>
                <Link to="/about" className="text-white font-semibold flex items-center gap-2 hover:text-primary transition-colors group">
                  See how it works
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default LandingPage;