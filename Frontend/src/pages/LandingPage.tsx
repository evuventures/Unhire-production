import React from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, Users, Clock } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const LandingPage: React.FC = () => {
  return (
    <div className="relative flex size-full min-h-screen flex-col overflow-x-hidden">
      <div className="layout-container flex h-full grow flex-col">
        <Header variant="landing" />

        <main className="flex-1">
          {/* Hero Section */}
          <div className="px-40 flex flex-1 justify-center py-20 bg-white">
            <div className="layout-content-container flex flex-col max-w-5xl flex-1">
              <div className="p-4">
                <div 
                  className="flex min-h-[480px] flex-col gap-8 rounded-2xl bg-cover bg-center bg-no-repeat items-start justify-end px-12 pb-12"
                  style={{
                    backgroundImage: 'linear-gradient(to top, rgba(0, 0, 0, 0.6) 0%, rgba(0, 0, 0, 0.1) 50%, rgba(0, 0, 0, 0) 100%), url("https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=1600")'
                  }}
                >
                  <div className="flex flex-col gap-4 text-left max-w-2xl">
                    <h1 className="text-white text-5xl font-extrabold leading-tight tracking-tighter">
                      Find the perfect freelancer for your project
                    </h1>
                    <h2 className="text-gray-200 text-lg font-normal leading-normal">
                      Connect with top-tier talent and get your work done efficiently. Post a job or browse available freelancers to start collaborating.
                    </h2>
                  </div>
                  <div className="flex-wrap gap-4 flex">
                    <Link
                      to="/post-job"
                      className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-12 px-6 bg-gradient-to-br from-[#87CEEB] to-[#AFEEEE] text-white text-base font-bold leading-normal tracking-[0.015em] shadow-lg hover:from-[#AFEEEE] hover:to-[#87CEEB] transition-all duration-300 transform hover:scale-105"
                    >
                      <span className="truncate">Hire instantly</span>
                    </Link>
                    <Link
                      to="/find-jobs"
                      className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-12 px-6 bg-[#F08080] text-white text-base font-bold leading-normal tracking-[0.015em] shadow-lg hover:bg-opacity-90 transition-all duration-300 transform hover:scale-105"
                    >
                      <span className="truncate">Work instantly</span>
                    </Link>
                  </div>
                </div>
              </div>

              {/* How It Works Section */}
              <section className="flex flex-col gap-16 px-4 py-20 bg-white">
                <div className="flex flex-col gap-4 text-center items-center">
                  <h1 className="text-gray-900 tracking-tighter text-4xl font-extrabold leading-tight max-w-2xl">
                    How Unhire Works
                  </h1>
                  <p className="text-gray-600 text-lg font-normal leading-normal max-w-2xl">
                    Our platform connects you with skilled freelancers for both short-term tasks and long-term collaborations.
                  </p>
                </div>
                <div className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-8">
                  <div className="flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-lg transition-shadow duration-300">
                    <div className="text-[#87CEEB]">
                      <Briefcase size={32} />
                    </div>
                    <div className="flex flex-col gap-1">
                      <h2 className="text-gray-900 text-lg font-bold leading-tight">Post a Job</h2>
                      <p className="text-gray-500 text-sm font-normal leading-normal">
                        Describe your project and requirements to attract qualified freelancers.
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-lg transition-shadow duration-300">
                    <div className="text-[#87CEEB]">
                      <Users size={32} />
                    </div>
                    <div className="flex flex-col gap-1">
                      <h2 className="text-gray-900 text-lg font-bold leading-tight">Find a Freelancer</h2>
                      <p className="text-gray-500 text-sm font-normal leading-normal">
                        Browse our talent pool and select the best fit for your needs.
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-lg transition-shadow duration-300">
                    <div className="text-[#87CEEB]">
                      <Clock size={32} />
                    </div>
                    <div className="flex flex-col gap-1">
                      <h2 className="text-gray-900 text-lg font-bold leading-tight">Collaborate</h2>
                      <p className="text-gray-500 text-sm font-normal leading-normal">
                        Work together seamlessly with our built-in tools and communication features.
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Why Choose Section */}
              <section className="flex flex-col gap-16 px-4 py-20 bg-gray-50 rounded-2xl">
                <div className="flex flex-col gap-4 text-center items-center">
                  <h1 className="text-gray-900 tracking-tighter text-4xl font-extrabold leading-tight max-w-2xl">
                    Why Choose Unhire?
                  </h1>
                  <p className="text-gray-600 text-lg font-normal leading-normal max-w-2xl">
                    We offer a streamlined experience for both clients and freelancers, ensuring successful project outcomes.
                  </p>
                </div>
                <div className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-8">
                  <div className="flex flex-col gap-4">
                    <div 
                      className="w-full bg-center bg-no-repeat aspect-video bg-cover rounded-xl shadow-md"
                      style={{ backgroundImage: 'url("https://images.pexels.com/photos/3184306/pexels-photo-3184306.jpeg?auto=compress&cs=tinysrgb&w=800")' }}
                    />
                    <div>
                      <h3 className="text-gray-900 text-lg font-bold leading-normal">Instant Task Flow</h3>
                      <p className="text-gray-500 text-sm font-normal leading-normal">
                        Quickly find freelancers for immediate tasks with our instant job posting feature.
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col gap-4">
                    <div 
                      className="w-full bg-center bg-no-repeat aspect-video bg-cover rounded-xl shadow-md"
                      style={{ backgroundImage: 'url("https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=800")' }}
                    />
                    <div>
                      <h3 className="text-gray-900 text-lg font-bold leading-normal">Long-Term Collaboration</h3>
                      <p className="text-gray-500 text-sm font-normal leading-normal">
                        Build lasting partnerships with talented professionals for ongoing projects.
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col gap-4">
                    <div 
                      className="w-full bg-center bg-no-repeat aspect-video bg-cover rounded-xl shadow-md"
                      style={{ backgroundImage: 'url("https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=800")' }}
                    />
                    <div>
                      <h3 className="text-gray-900 text-lg font-bold leading-normal">Secure Payments</h3>
                      <p className="text-gray-500 text-sm font-normal leading-normal">
                        Our secure payment system ensures timely and reliable transactions for all parties.
                      </p>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
};

export default LandingPage;