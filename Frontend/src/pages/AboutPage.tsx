import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const AboutPage: React.FC = () => {
  return (
    <div className="relative flex flex-col min-h-screen overflow-x-hidden">
      <Header variant="landing" />

      <main className="flex-1 bg-gray-50 px-10 py-20">
        <div className="max-w-6xl mx-auto flex flex-col gap-12">
          <section className="text-center">
            <h1 className="text-5xl font-extrabold text-gray-900 mb-4">
              Why Unhire?
            </h1>
            <p className="text-gray-600 text-lg max-w-3xl mx-auto">
              Unhire connects businesses and freelancers seamlessly, providing a streamlined workflow for posting jobs, finding the right talent, and collaborating efficiently. We focus on trust, security, and quality for every project.
            </p>
          </section>

          <section className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-8">
            <div className="flex flex-col gap-4 rounded-xl bg-white p-6 shadow-md hover:shadow-lg transition-shadow duration-300">
              <h2 className="text-gray-900 text-xl font-bold">Top Talent</h2>
              <p className="text-gray-500 text-sm">
                Access a wide pool of verified experts across multiple domains, ready to deliver quality work.
              </p>
            </div>
            <div className="flex flex-col gap-4 rounded-xl bg-white p-6 shadow-md hover:shadow-lg transition-shadow duration-300">
              <h2 className="text-gray-900 text-xl font-bold">Secure Payments</h2>
              <p className="text-gray-500 text-sm">
                Your payments are safe and reliable, with guaranteed transactions between clients and freelancers.
              </p>
            </div>
            <div className="flex flex-col gap-4 rounded-xl bg-white p-6 shadow-md hover:shadow-lg transition-shadow duration-300">
              <h2 className="text-gray-900 text-xl font-bold">Seamless Collaboration</h2>
              <p className="text-gray-500 text-sm">
                Use built-in communication tools and workflow management to keep projects on track.
              </p>
            </div>
            <div className="flex flex-col gap-4 rounded-xl bg-white p-6 shadow-md hover:shadow-lg transition-shadow duration-300">
              <h2 className="text-gray-900 text-xl font-bold">Flexible Work</h2>
              <p className="text-gray-500 text-sm">
                Work with freelancers for both short-term tasks and long-term projects, based on your needs.
              </p>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AboutPage;
