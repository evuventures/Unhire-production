import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

const ClientDashboard = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [selectedProjectStatus, setSelectedProjectStatus] = useState(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const token = localStorage.getItem('token');
        const user = JSON.parse(localStorage.getItem('user'));
        if (!token || !user) {
          throw new Error('Authentication token or user info not found');
        }
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/projects/client/${user._id}`, {
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

  const handleCheckStatus = async (projectId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/projects/${projectId}/status`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch project status');
      }

      const data = await response.json();
      setSelectedProjectStatus(data);
      setIsStatusModalOpen(true);
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center h-screen text-red-500">{error}</div>;
  }

  const statusColors = {
    active: 'bg-green-500',
    unassigned: 'bg-yellow-500',
    completed: 'bg-blue-500',
    expired: 'bg-red-500',
  };

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
              <div key={project._id} className="bg-white rounded-2xl shadow-lg p-6 flex flex-col">
                <h2 className="text-xl font-bold text-gray-800 mb-2">{project.title}</h2>
                <p className="text-gray-600 mb-4">{project.category}</p>
                <div className="flex justify-between items-center text-sm mb-4">
                  <span className="font-semibold">Budget:</span>
                  <span>${project.budgetAmount}</span>
                </div>
                <div className="flex justify-between items-center text-sm mb-4">
                  <span className="font-semibold">Status:</span>
                  <span className={`px-2 py-1 rounded-full text-white text-xs capitalize ${statusColors[project.status] || 'bg-gray-500'}`}>
                    {project.status}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm mb-6">
                  <span className="font-semibold">Deadline:</span>
                  <span>{new Date(project.deadline).toLocaleDateString()}</span>
                </div>
                <div className="mt-auto pt-4 border-t border-gray-100">
                  <Link to={`/client/project/${project._id}`}>
                    <button className="w-full px-4 py-2 rounded-xl text-white bg-gradient-to-br from-[#87CEEB] to-[#AFEEEE] font-semibold hover:from-[#AFEEEE] hover:to-[#87CEEB] shadow-md transition-transform transform hover:scale-105 mb-2">
                      View Details
                    </button>
                  </Link>
                  <button
                    onClick={() => handleCheckStatus(project._id)}
                    className="w-full px-4 py-2 rounded-xl text-white bg-gray-700 font-semibold hover:bg-gray-800 shadow-md transition-transform transform hover:scale-105"
                  >
                    Check Status
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      {isStatusModalOpen && selectedProjectStatus && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full mx-4">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Project Status</h2>
            <div className="space-y-2 text-gray-700">
              <p><strong>Title:</strong> {selectedProjectStatus.title}</p>
              <p><strong>Status:</strong> <span className="font-semibold capitalize">{selectedProjectStatus.status}</span></p>
              <p><strong>Assigned Expert:</strong> {selectedProjectStatus.assignedExpert ? selectedProjectStatus.assignedExpert.name : 'Not yet assigned'}</p>
              <p><strong>Draft Submitted:</strong> {selectedProjectStatus.draftSubmitted ? 'Yes' : 'No'}</p>
              {selectedProjectStatus.remainingTime && (
                <div className="p-3 bg-gray-100 rounded-lg mt-2">
                  <p className="font-semibold"><strong>Time Remaining for Expert to Submit Draft:</strong></p>
                  <span>{selectedProjectStatus.remainingTime.hours} hours, {selectedProjectStatus.remainingTime.minutes} minutes, {selectedProjectStatus.remainingTime.seconds} seconds</span>
                </div>
              )}
            </div>
            <button
              onClick={() => setIsStatusModalOpen(false)}
              className="mt-6 w-full px-4 py-2 rounded-xl text-white bg-red-500 font-semibold hover:bg-red-600 shadow-md transition-transform transform hover:scale-105"
            >
              Close
            </button>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
};

export default ClientDashboard;