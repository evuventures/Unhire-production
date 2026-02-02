import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Zap, Users, Globe, Target, ArrowRight } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const AboutPage: React.FC = () => {
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6 }
  };

  const values = [
    { icon: Shield, title: "Trust & Security", desc: "Every transaction is protected through our advanced escrow system, ensuring peace of mind for both clients and experts." },
    { icon: Zap, title: "Velocity", desc: "We believe in moving fast without breaking things. Our AI matching engine reduces hiring time from weeks to minutes." },
    { icon: Users, title: "Quality Network", desc: "We don't just host profiles; we cultivate a community of vetted experts dedicated to excellence." },
    { icon: Globe, title: "Global Vision", desc: "Talent has no borders. We connect the world's most ambitious companies with the best minds on the planet." }
  ];

  const team = [
    { name: "Stewart Johanson", role: "CEO & Founder", image: "https://lh3.googleusercontent.com/sitesv/APaQ0SToqWDTYxCwbeo3HvpQllqBggZfWu7TSTDYvQpMLAXbOV5yWgCfmROARPTWRTZalGDYpDQN94SVChHF3n6UfPZoRUQGfSDk9HJG8KsgZ_CHCunbgXKtG5eNAJlcFHUzrEab-NfyChIDfixMHH8aUDNi8G8ihCJnPKL9DQbpfCQIHv9vFZtwO80SHVu3CYDlxEagTu2gaAKgtH7BBzFrRci1SxCigVBR9bYuUTk=w1280" },
    { name: "Sariar Faruk", role: "HR Manager", image: "https://lh3.googleusercontent.com/sitesv/APaQ0SQ_McbZCe-jarbG9994UDZb8OekcB01aEyt8gJZ6Usv7Q3OtIbGNEO20H29dmY8P7tmQ3EOU13MRGMtr2CeIBVl8lE1tV41bbPEKNfQQPNhweE7EMJGcQ1qDULaCLE_ul403gq5gBNiYkok6fhzdg2bzEYGEgzV9N978tbOxcS2tz4wQE7QvGsfnRaW1EmwKkMFPatSEUNnfFIlZmo84oqU0etAgvyfJSe8rgQ=w1280" },
    { name: "Mabel Kusi-Appiah", role: "Social Media Manager", image: "https://lh3.googleusercontent.com/sitesv/APaQ0STt0Vc4bQZOIaIJH5JWKFHNnKtchhgm5JD6weL-WV716ZpG1ayCt0br0BuMiGFiRoMieXaaGskLDPQxjgwkZt8Yt9nkVMWvDgds8wEYIbY8JYmGjdfWhfVMOhmz3vQPN2dKEL-byi69UIKbTeEq7nP04x-4kCT7rsH0sfcYEQqXw2zU5oIpkr1EvSVMcDFE9aN3nknym1Sxlb45mctnygJnkzt5PltdyHbrCsc=w1280" },
    { name: "Jhenelle Hill", role: "Developer", image: "https://lh3.googleusercontent.com/sitesv/APaQ0SQwBkHZsjLtNwXOBEOo3uMwrr9cU4mkyd2z_JVv-JtB0XUM0j7DHq9X9rK0AVkSlFLnWEM_5xDmrchWCQl0FQTFTQ02ODpxF-1XrMK_PJWool119kiBGXB-RnRs-a3OLV75HBKEiXDMs8jX3F_S_pLh32Y-6CuvW_EYB5T5QqyMu6-Oam2AYyHR-zJOoyzVWD8GGWqDymjXzvZB4MWf7cISJiIgSLVHWcxnkbw=w1280" },
    { name: "Nikhil Nandish", role: "Software Engineer", image: "https://lh3.googleusercontent.com/sitesv/APaQ0SRNwnilQnvMRVDubxynhqwXTKSh56h2DmMb5cSaLhmc_0p2DuB-XzKMApLeC04Md2UY7JA5Pa29gnK8BERYiOz5ieC3kp4S0JHxry8cM6aZITXcwqBF8i84cDPP6s92kHWadsr4Kxk3-yM0Vwwclh6un1mBmPFBPM5GmcqJhlTt4ygf2STYrSZI0ZuHXTYjpUvEZ56bZDPn35aEz5-cnNMV1Afn2pzRYPHc0O4=w1280" },
    { name: "Rajnil Prasad", role: "Frontend Developer", image: "https://lh3.googleusercontent.com/sitesv/APaQ0SRq-RapA2RSdr7s88IZ8kQlvBovTAoEedsdSDRP8_UbW404scw_P7pFhZqH4BieS9drDm5JWClaMJcieI8xmncG_XFFvb30IAIQHCes_QBQdMe2HftWq4C2dyMJF8gCDo6jZD-vOgyb8d6KSyvPR7ckg_yTnjINvPNsYUq1aV0_NTAJ2uXx8jCPe1meh8RJ4Z9Tcx3UVIwdhMY-H-iP4aoTMu0s8cTPKV2V=w1280" }
  ];

  return (
    <div className="relative min-h-screen bg-background text-text-primary overflow-x-hidden">
      <Header />

      <main className="pt-32 pb-20">
        {/* Story Section */}
        <section className="container mx-auto px-6 mb-32">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-block px-4 py-2 rounded-full border border-white/10 glass text-primary text-xs font-bold uppercase tracking-widest"
            >
              Our Mission
            </motion.div>
            <motion.h1
              {...fadeInUp}
              className="text-5xl md:text-7xl font-extrabold tracking-tight leading-tight"
            >
              Empowering the future of <span className="bg-gradient-to-r from-primary to-indigo-400 bg-clip-text text-transparent italic">independent work</span>.
            </motion.h1>
            <motion.p
              {...fadeInUp}
              className="text-xl text-text-secondary leading-relaxed"
            >
              Unhire was born from a simple observation: the traditional hiring model is broken. It's slow, expensive, and often results in mismatches. We're here to build a more efficient, transparent, and fair ecosystem for everyone.
            </motion.p>
          </div>
        </section>

        {/* Vision/Image Section */}
        <section className="container mx-auto px-6 mb-32">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-card p-4 rounded-[3rem] overflow-hidden shadow-2xl shadow-primary/10"
          >
            <img
              src="https://images.pexels.com/photos/3182773/pexels-photo-3182773.jpeg?auto=compress&cs=tinysrgb&w=1600"
              alt="Our Vision"
              className="rounded-[2.5rem] w-full h-[600px] object-cover grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-1000"
            />
          </motion.div>
        </section>

        {/* Core Values */}
        <section className="py-32 bg-surface/30">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((v, i) => (
                <motion.div
                  key={i}
                  variants={fadeInUp}
                  initial="initial"
                  whileInView="whileInView"
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="glass-card p-8 group border-white/5 hover:border-primary/20 transition-all"
                >
                  <div className="size-16 rounded-2xl bg-white/5 flex items-center justify-center mb-8 group-hover:scale-110 group-hover:bg-primary/10 transition-all duration-300">
                    <v.icon className="text-primary" size={32} />
                  </div>
                  <h3 className="text-xl font-bold mb-4">{v.title}</h3>
                  <p className="text-text-secondary text-sm leading-relaxed">{v.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-32">
          <div className="container mx-auto px-6">
            <motion.div {...fadeInUp} className="text-center mb-20">
              <h2 className="text-4xl font-bold mb-4">The minds behind Unhire</h2>
              <p className="text-text-secondary max-w-xl mx-auto italic">A small team with a massive vision to rebuild the global workforce infrastructure.</p>
            </motion.div>

            <div className="flex flex-wrap justify-center gap-12">
              {team.map((m, i) => (
                <motion.div
                  key={i}
                  variants={fadeInUp}
                  initial="initial"
                  whileInView="whileInView"
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.2 }}
                  className="group"
                >
                  <div className="size-64 md:size-80 rounded-[3rem] overflow-hidden mb-6 glass p-2">
                    <img src={m.image} alt={m.name} className="w-full h-full object-cover rounded-[2.5rem] grayscale group-hover:grayscale-0 transition-all duration-500" />
                  </div>
                  <div className="text-center">
                    <h4 className="text-2xl font-bold mb-1">{m.name}</h4>
                    <p className="text-primary text-sm font-bold tracking-widest uppercase">{m.role}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20">
          <div className="container mx-auto px-6 text-center">
            <motion.div
              {...fadeInUp}
              className="max-w-2xl mx-auto py-12 px-8 rounded-[3rem] border border-white/10 glass flex flex-col items-center"
            >
              <div className="size-14 rounded-full bg-primary/20 flex items-center justify-center text-primary mb-6 animate-bounce">
                <Target size={24} />
              </div>
              <h3 className="text-3xl font-bold mb-4">Join our mission</h3>
              <p className="text-text-secondary mb-8">We're always looking for ambitious talent and visionary companies to join our network.</p>
              <button className="btn-primary px-10 flex items-center gap-2 group">
                Get in touch
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default AboutPage;
