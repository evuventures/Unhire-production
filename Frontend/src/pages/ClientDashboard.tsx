import React, { useEffect, useState } from 'react';
import { Bell } from 'lucide-react';
import logo from '../assets/logo.svg';

interface Project {
  _id: string;
  title: string;
  category: string;
  description: string;
  requirements: string;
  deliverables: string;
  progress?: number;
  status?: string;
  budgetType: string;
  budgetAmount: number;
  paymentTerms: string;
  startDate: string;
  endDate: string;
  deadline: string;
  experienceLevel: string;
  locationPreference: string;
  language: string;
}

const ClientDashboard: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [newProject, setNewProject] = useState<Project>({
    _id: '',
    title: '',
    category: '',
    description: '',
    requirements: '',
    deliverables: '',
    budgetType: 'fixed',
    budgetAmount: 0,
    paymentTerms: '',
    startDate: '',
    endDate: '',
    deadline: '',
    experienceLevel: '',
    locationPreference: '',
    language: 'English',
  });

  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const token = localStorage.getItem('token');

  // Fetch client projects
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch(`${backendUrl}/api/projects/client`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        console.log('Client projects:', data);
        setProjects(data);
      } catch (err) {
        console.error('Error fetching projects:', err);
      }
    };
    fetchProjects();
  }, []);

  // Post a new project
  const handlePostProject = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`${backendUrl}/api/projects`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newProject),
      });
      const data = await res.json();
      console.log('Project posted:', data);
      setProjects((prev) => [...prev, data]);
      setShowForm(false);
      alert('Project posted successfully!');
      setNewProject({
        _id: '',
        title: '',
        category: '',
        description: '',
        requirements: '',
        deliverables: '',
        budgetType: 'fixed',
        budgetAmount: 0,
        paymentTerms: '',
        startDate: '',
        endDate: '',
        deadline: '',
        experienceLevel: '',
        locationPreference: '',
        language: 'English',
      });
    } catch (err) {
      console.error('Error posting project:', err);
      alert('Failed to post project.');
    }
  };

  // Check project status
  const checkStatus = async (projectId: string) => {
    try {
      const res = await fetch(`${backendUrl}/api/projects/${projectId}/status`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      alert(`Project Status: ${data.status}`);
    } catch (err) {
      console.error('Error fetching project status:', err);
      alert('Failed to fetch project status.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-gray-200 px-10 py-4 bg-white">
        <div className="flex items-center gap-3">
          <img src={logo} alt="Unhire Logo" className="h-8 w-auto" />
          <span className="text-xl font-bold text-gray-900">Client Dashboard</span>
        </div>
        <div className="flex items-center gap-4">
          <button className="relative flex items-center justify-center size-10 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors">
            <Bell size={20} />
          </button>
          <div
            className="bg-center bg-no-repeat aspect-square bg-cover rounded-full w-10 h-10 border-2 border-transparent hover:border-[#87CEEB] transition-colors cursor-pointer"
            style={{ backgroundImage: 'url("https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=100")' }}
          />
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 px-10 py-16">
        <div className="max-w-6xl mx-auto flex flex-col gap-12">
          {/* Post Project Button */}
          {projects.length === 0 && !showForm && (
            <div className="flex justify-center">
              <button
                onClick={() => setShowForm(true)}
                className="bg-[#87CEEB] hover:bg-[#AFEEEE] text-white font-bold py-3 px-6 rounded-xl"
              >
                Post Your First Project
              </button>
            </div>
          )}

          {/* Post Project Form */}
          {showForm && (
            <section className="bg-white p-6 rounded-2xl shadow-md">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Post a New Project</h2>
              <form className="grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={handlePostProject}>
                <input type="text" placeholder="Title" value={newProject.title} onChange={(e) => setNewProject({ ...newProject, title: e.target.value })} required className="border border-gray-300 rounded-xl px-4 py-3" />
                <input type="text" placeholder="Category" value={newProject.category} onChange={(e) => setNewProject({ ...newProject, category: e.target.value })} required className="border border-gray-300 rounded-xl px-4 py-3" />
                <input type="text" placeholder="Description" value={newProject.description} onChange={(e) => setNewProject({ ...newProject, description: e.target.value })} required className="border border-gray-300 rounded-xl px-4 py-3 col-span-2" />
                <input type="text" placeholder="Requirements" value={newProject.requirements} onChange={(e) => setNewProject({ ...newProject, requirements: e.target.value })} required className="border border-gray-300 rounded-xl px-4 py-3 col-span-2" />
                <input type="text" placeholder="Deliverables" value={newProject.deliverables} onChange={(e) => setNewProject({ ...newProject, deliverables: e.target.value })} required className="border border-gray-300 rounded-xl px-4 py-3 col-span-2" />
                <input type="number" placeholder="Budget Amount" value={newProject.budgetAmount} onChange={(e) => setNewProject({ ...newProject, budgetAmount: Number(e.target.value) })} required className="border border-gray-300 rounded-xl px-4 py-3" />
                <select value={newProject.budgetType} onChange={(e) => setNewProject({ ...newProject, budgetType: e.target.value })} className="border border-gray-300 rounded-xl px-4 py-3">
                  <option value="fixed">Fixed</option>
                  <option value="hourly">Hourly</option>
                </select>
                <input type="text" placeholder="Payment Terms" value={newProject.paymentTerms} onChange={(e) => setNewProject({ ...newProject, paymentTerms: e.target.value })} required className="border border-gray-300 rounded-xl px-4 py-3 col-span-2" />
                <input type="date" placeholder="Start Date" value={newProject.startDate} onChange={(e) => setNewProject({ ...newProject, startDate: e.target.value })} required className="border border-gray-300 rounded-xl px-4 py-3" />
                <input type="date" placeholder="End Date" value={newProject.endDate} onChange={(e) => setNewProject({ ...newProject, endDate: e.target.value })} required className="border border-gray-300 rounded-xl px-4 py-3" />
                <input type="datetime-local" placeholder="Deadline" value={newProject.deadline} onChange={(e) => setNewProject({ ...newProject, deadline: e.target.value })} required className="border border-gray-300 rounded-xl px-4 py-3 col-span-2" />
                <input type="text" placeholder="Experience Level" value={newProject.experienceLevel} onChange={(e) => setNewProject({ ...newProject, experienceLevel: e.target.value })} required className="border border-gray-300 rounded-xl px-4 py-3" />
                <input type="text" placeholder="Location Preference" value={newProject.locationPreference} onChange={(e) => setNewProject({ ...newProject, locationPreference: e.target.value })} required className="border border-gray-300 rounded-xl px-4 py-3" />
                <input type="text" placeholder="Language" value={newProject.language} onChange={(e) => setNewProject({ ...newProject, language: e.target.value })} required className="border border-gray-300 rounded-xl px-4 py-3" />
                <button type="submit" className="col-span-2 bg-[#87CEEB] hover:bg-[#AFEEEE] text-white font-bold py-3 rounded-xl transition-colors">Post Project</button>
              </form>
            </section>
          )}

          {/* Client Projects */}
          {projects.length > 0 && (
            <section className="flex flex-col gap-4">
              <h2 className="text-2xl font-bold text-gray-900">Your Projects</h2>
              <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-6">
                {projects.map((project) => (
                  <div key={project._id} className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition-shadow cursor-pointer" onClick={() => checkStatus(project._id)}>
                    <h3 className="text-lg font-bold text-gray-900">{project.title}</h3>
                    <p className="text-gray-600 text-sm">{project.description}</p>
                    <p className="text-gray-500 text-xs mt-1">Budget: ${project.budgetAmount} ({project.budgetType})</p>
                    <p className="text-gray-500 text-xs mt-1">Status: {project.status || 'Pending'}</p>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
    </div>
  );
};

export default ClientDashboard;
