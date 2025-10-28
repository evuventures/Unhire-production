import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

interface Project {
  id: string;
  title: string;
  description: string;
  client: string;
  status: string;
}

const ExpertDashboard: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    // TODO: Fetch projects available to claim from backend
    setProjects([
      { id: '1', title: 'Build Landing Page', description: 'Need a responsive landing page', client: 'Acme Corp', status: 'Open' },
      { id: '2', title: 'API Integration', description: 'Integrate payment API', client: 'Beta Ltd', status: 'Open' },
    ]);
  }, []);

  const claimProject = (id: string) => {
    // TODO: Implement claim project API
    alert(`Project ${id} claimed!`);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      {/* Main */}
      <main className="flex-1 px-10 py-16">
        <div className="max-w-6xl mx-auto flex flex-col gap-12">
          <h1 className="text-4xl font-extrabold text-gray-900">Available Projects</h1>

          {projects.length === 0 ? (
            <p className="text-gray-500 text-lg">No projects available to claim at the moment.</p>
          ) : (
            <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-6">
              {projects.map(project => (
                <div key={project.id} className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col gap-4">
                  <h2 className="text-gray-900 text-xl font-bold">{project.title}</h2>
                  <p className="text-gray-500 text-sm">{project.description}</p>
                  <p className="text-gray-600 text-sm font-semibold">Client: {project.client}</p>
                  <p className="text-gray-600 text-sm font-semibold">Status: {project.status}</p>
                  <button
                    onClick={() => claimProject(project.id)}
                    className="bg-gradient-to-br from-[#87CEEB] to-[#AFEEEE] text-white font-bold py-2 px-6 rounded-xl shadow-md hover:from-[#AFEEEE] hover:to-[#87CEEB] transition-all duration-300"
                  >
                    Claim Project
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ExpertDashboard;
