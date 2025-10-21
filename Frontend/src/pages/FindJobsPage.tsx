import React from 'react';
import { Link } from 'react-router-dom';
import { Search, ChevronDown, Star, Home, User, Briefcase, FileText, CreditCard } from 'lucide-react';

const FindJobsPage: React.FC = () => {
  const featuredJobs = [
    {
      id: 1,
      title: 'Senior Software Engineer',
      description: 'Develop and maintain scalable applications using modern technologies.',
      budget: '$120k',
      image: 'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=800',
      featured: false
    },
    {
      id: 2,
      title: 'Product Manager',
      description: 'Lead product strategy and roadmap for innovative solutions.',
      budget: '$130k',
      image: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=800',
      featured: true
    },
    {
      id: 3,
      title: 'UX/UI Designer',
      description: 'Design intuitive user interfaces and exceptional experiences.',
      budget: '$100k',
      image: 'https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=800',
      featured: false
    }
  ];

  const availableJobs = [
    {
      title: 'Senior Software Engineer',
      match: 'Perfect Match',
      matchColor: 'bg-green-100 text-green-800',
      budget: '$80,000 - $120,000',
      posted: '2 days ago'
    },
    {
      title: 'Product Manager',
      match: 'Good Match',
      matchColor: 'bg-blue-100 text-blue-800',
      budget: '$90,000 - $130,000',
      posted: '3 days ago'
    },
    {
      title: 'UX/UI Designer',
      match: 'Perfect Match',
      matchColor: 'bg-green-100 text-green-800',
      budget: '$70,000 - $100,000',
      posted: '5 days ago'
    },
    {
      title: 'Data Analyst',
      match: 'Missing Skills',
      matchColor: 'bg-red-100 text-red-800',
      budget: '$60,000 - $90,000',
      posted: '1 week ago'
    },
    {
      title: 'Marketing Specialist',
      match: 'Good Match',
      matchColor: 'bg-blue-100 text-blue-800',
      budget: '$50,000 - $80,000',
      posted: '2 weeks ago'
    }
  ];

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-white flex flex-col p-6 space-y-8 sticky top-0 h-screen border-r border-gray-200">
        <Link to="/" className="flex items-center gap-3">
          <div className="size-6 text-[#87CEEB]">
            <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
              <path 
                clipRule="evenodd" 
                d="M12.0799 24L4 19.2479L9.95537 8.75216L18.04 13.4961L18.0446 4H29.9554L29.96 13.4961L38.0446 8.75216L44 19.2479L35.92 24L44 28.7521L38.0446 39.2479L29.96 34.5039L29.9554 44H18.0446L18.04 34.5039L9.95537 39.2479L4 28.7521L12.0799 24Z" 
                fill="currentColor" 
                fillRule="evenodd"
              />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-gray-900">Unhire</h1>
        </Link>
        
        <div className="flex flex-col flex-1 justify-between">
          <nav className="flex flex-col space-y-2">
            <Link 
              className="flex items-center gap-3 px-4 py-3 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors" 
              to="/"
            >
              <Home size={20} />
              <span className="text-sm font-medium">Home</span>
            </Link>
            <a 
              className="flex items-center gap-3 px-4 py-3 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors" 
              href="#"
            >
              <User size={20} />
              <span className="text-sm font-medium">My Profile</span>
            </a>
            <a 
              className="flex items-center gap-3 px-4 py-3 text-[#87CEEB] bg-blue-50 rounded-lg" 
              href="#"
            >
              <Briefcase size={20} />
              <span className="text-sm font-medium">Jobs</span>
            </a>
            <a 
              className="flex items-center gap-3 px-4 py-3 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors" 
              href="#"
            >
              <FileText size={20} />
              <span className="text-sm font-medium">Proposals</span>
            </a>
            <a 
              className="flex items-center gap-3 px-4 py-3 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors" 
              href="#"
            >
              <CreditCard size={20} />
              <span className="text-sm font-medium">Payments</span>
            </a>
          </nav>
          
          <div className="flex items-center gap-3 mt-auto">
            <div 
              className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 border-2 border-[#87CEEB]"
              style={{ backgroundImage: 'url("https://images.pexels.com/photos/3184306/pexels-photo-3184306.jpeg?auto=compress&cs=tinysrgb&w=100")' }}
            />
            <div>
              <p className="text-sm font-semibold text-gray-900">Sophia Carter</p>
              <p className="text-xs text-gray-500">Freelancer</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <header className="mb-8">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900">Find Jobs</h1>
            <p className="text-gray-600 mt-1">Browse and discover your next freelance opportunity.</p>
          </header>

          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                className="w-full bg-white border border-gray-300 rounded-xl h-12 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-[#87CEEB] focus:border-[#87CEEB] transition-shadow"
                placeholder="Search for jobs by title, company or keyword"
                type="text"
              />
            </div>
            <div className="flex gap-4">
              <button className="flex items-center gap-2 bg-white border border-gray-300 rounded-xl px-4 h-12 hover:bg-gray-50 transition-colors">
                <span className="text-sm text-gray-700">Skills</span>
                <ChevronDown className="text-gray-400" size={16} />
              </button>
              <button className="flex items-center gap-2 bg-white border border-gray-300 rounded-xl px-4 h-12 hover:bg-gray-50 transition-colors">
                <span className="text-sm text-gray-700">Job Type</span>
                <ChevronDown className="text-gray-400" size={16} />
              </button>
              <button className="flex items-center gap-2 bg-white border border-gray-300 rounded-xl px-4 h-12 hover:bg-gray-50 transition-colors">
                <span className="text-sm text-gray-700">Budget</span>
                <ChevronDown className="text-gray-400" size={16} />
              </button>
            </div>
          </div>

          {/* Featured Jobs */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6 text-gray-900">Featured Jobs</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredJobs.map((job) => (
                <div
                  key={job.id}
                  className={`bg-white p-6 rounded-2xl border ${
                    job.featured ? 'border-2 border-[#87CEEB]' : 'border border-gray-200'
                  } flex flex-col gap-4 shadow-sm hover:shadow-lg transition-all duration-300 hover:transform hover:-translate-y-2 relative`}
                >
                  {job.featured && (
                    <div className="absolute -top-3 -right-3 bg-gradient-to-r from-[#87CEEB] to-[#AFEEEE] p-2 rounded-full shadow-lg">
                      <Star className="text-white" size={16} />
                    </div>
                  )}
                  <div
                    className="w-full bg-center bg-no-repeat aspect-[16/9] bg-cover rounded-xl"
                    style={{ backgroundImage: `url("${job.image}")` }}
                  />
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{job.title}</h3>
                    <p className="text-gray-600 text-sm">{job.description}</p>
                  </div>
                  <div className="mt-auto pt-4 border-t border-gray-200 flex justify-between items-center">
                    <span className="text-sm font-semibold bg-gradient-to-r from-[#87CEEB] to-[#AFEEEE] text-white px-3 py-1 rounded-full">
                      {job.budget}
                    </span>
                    <button className="bg-gradient-to-r from-[#87CEEB] to-[#AFEEEE] hover:from-[#AFEEEE] hover:to-[#87CEEB] px-4 py-2 rounded-lg text-white font-semibold text-sm transition-all duration-300 transform hover:scale-105">
                      Apply Now
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Available Jobs Table */}
          <section>
            <h2 className="text-2xl font-bold mb-6 text-gray-900">Available Jobs</h2>
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
              <table className="w-full text-left">
                <thead className="border-b border-gray-200 bg-gray-50">
                  <tr className="text-gray-600">
                    <th className="px-6 py-4 font-semibold text-sm">Job Title</th>
                    <th className="px-6 py-4 font-semibold text-sm">Skills Match</th>
                    <th className="px-6 py-4 font-semibold text-sm">Budget</th>
                    <th className="px-6 py-4 font-semibold text-sm">Posted</th>
                    <th className="px-6 py-4 font-semibold text-sm"></th>
                  </tr>
                </thead>
                <tbody>
                  {availableJobs.map((job, index) => (
                    <tr
                      key={index}
                      className="border-b border-gray-200 last:border-b-0 hover:bg-blue-50 hover:bg-opacity-30 transition-colors"
                    >
                      <td className="px-6 py-5 text-gray-900 font-semibold">{job.title}</td>
                      <td className="px-6 py-5">
                        <span className={`inline-block text-xs font-semibold px-2.5 py-1 rounded-full ${job.matchColor}`}>
                          {job.match}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-gray-600">{job.budget}</td>
                      <td className="px-6 py-5 text-gray-600">{job.posted}</td>
                      <td className="px-6 py-5 text-right">
                        <button className="bg-gradient-to-r from-[#87CEEB] to-[#AFEEEE] hover:from-[#AFEEEE] hover:to-[#87CEEB] px-4 py-2 rounded-lg text-white font-semibold text-sm transition-all duration-300 transform hover:scale-105">
                          View Job
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default FindJobsPage;