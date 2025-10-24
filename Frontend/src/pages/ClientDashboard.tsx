import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

const ClientDashboard = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/projects/client`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch projects');
        }

        const data = await response.json();
        setProjects(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center h-screen text-red-500">{error}</div>;
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">My Projects</h1>
          <Link to="/post-project">
            <button className="px-4 py-2 rounded-xl text-white bg-gradient-to-br from-[#87CEEB] to-[#AFEEEE] font-semibold hover:from-[#AFEEEE] hover:to-[#87CEEB] shadow-md transition-transform transform hover:scale-105">
              + Post Project
            </button>
          </Link>
        </div>

        {projects.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl shadow-lg">
            <p className="text-gray-500 mb-4">You haven't posted any projects yet.</p>
            <Link to="/post-project">
              <button className="px-4 py-2 rounded-xl text-white bg-gradient-to-br from-[#87CEEB] to-[#AFEEEE] font-semibold hover:from-[#AFEEEE] hover:to-[#87CEEB] shadow-md transition-transform transform hover:scale-105">
                Post a Project
              </button>
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <div key={project._id} className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-2">{project.title}</h2>
                <p className="text-gray-600 mb-4">{project.category}</p>
                <div className="flex justify-between items-center text-sm mb-4">
                  <span className="font-semibold">Budget:</span>
                  <span>${project.budgetAmount}</span>
                </div>
                <div className="flex justify-between items-center text-sm mb-4">
                  <span className="font-semibold">Status:</span>
                  <span className={`px-2 py-1 rounded-full text-white ${project.status === 'Open' ? 'bg-green-500' : 'bg-yellow-500'}`}>
                    {project.status}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm mb-6">
                  <span className="font-semibold">Deadline:</span>
                  <span>{new Date(project.deadline).toLocaleDateString()}</span>
                </div>
                <Link to={`/client/project/${project._id}`}>
                  <button className="w-full px-4 py-2 rounded-xl text-white bg-gradient-to-br from-[#87CEEB] to-[#AFEEEE] font-semibold hover:from-[#AFEEEE] hover:to-[#87CEEB] shadow-md transition-transform transform hover:scale-105">
                    View Details
                  </button>
                </Link>
              </div>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default ClientDashboard;