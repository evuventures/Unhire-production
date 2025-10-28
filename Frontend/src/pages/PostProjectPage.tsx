import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

const PostProjectPage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    description: '',
    requirements: '',
    deliverables: '',
    budgetType: 'fixed',
    budgetAmount: '',
    paymentTerms: 'upon-completion',
    deadline: '',
    experienceLevel: 'mid-level',
    locationPreference: 'remote',
    language: 'english',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication token not found');
      }

      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/projects`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to post project');
      }

      await response.json();
      setSuccess('Project posted successfully! Redirecting to dashboard...');
      setTimeout(() => {
        navigate('/client-dashboard');
      }, 2000);

    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto bg-white p-8 rounded-2xl shadow-lg">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800">Post a New Project</h1>
            <p className="text-gray-600 mt-2">Fill in the details below to find the perfect expert for your project.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Project Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Project Title</label>
              <input type="text" name="title" id="title" value={formData.title} onChange={handleInputChange} className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#87CEEB] outline-none" required />
            </div>

            {/* Category */}
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <input type="text" name="category" id="category" value={formData.category} onChange={handleInputChange} className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#87CEEB] outline-none" placeholder="e.g., Web Development, Graphic Design" required />
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea name="description" id="description" value={formData.description} onChange={handleInputChange} rows={4} className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#87CEEB] outline-none" required></textarea>
            </div>

            {/* Requirements */}
            <div>
              <label htmlFor="requirements" className="block text-sm font-medium text-gray-700 mb-1">Requirements</label>
              <textarea name="requirements" id="requirements" value={formData.requirements} onChange={handleInputChange} rows={3} className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#87CEEB] outline-none"></textarea>
            </div>

            {/* Deliverables */}
            <div>
              <label htmlFor="deliverables" className="block text-sm font-medium text-gray-700 mb-1">Deliverables</label>
              <textarea name="deliverables" id="deliverables" value={formData.deliverables} onChange={handleInputChange} rows={3} className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#87CEEB] outline-none"></textarea>
            </div>

            {/* Budget */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="budgetType" className="block text-sm font-medium text-gray-700 mb-1">Budget Type</label>
                <select name="budgetType" id="budgetType" value={formData.budgetType} onChange={handleInputChange} className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#87CEEB] outline-none">
                  <option value="fixed">Fixed Price</option>
                  <option value="hourly">Hourly Rate</option>
                </select>
              </div>
              <div>
                <label htmlFor="budgetAmount" className="block text-sm font-medium text-gray-700 mb-1">Budget Amount (USD)</label>
                <input type="number" name="budgetAmount" id="budgetAmount" value={formData.budgetAmount} onChange={handleInputChange} className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#87CEEB] outline-none" required />
              </div>
            </div>

            {/* Payment Terms */}
            <div>
              <label htmlFor="paymentTerms" className="block text-sm font-medium text-gray-700 mb-1">Payment Terms</label>
              <select name="paymentTerms" id="paymentTerms" value={formData.paymentTerms} onChange={handleInputChange} className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#87CEEB] outline-none">
                <option value="upon-completion">Upon Completion</option>
                <option value="milestones">By Milestones</option>
                <option value="50-50">50% Upfront, 50% on Completion</option>
              </select>
            </div>

            {/* Deadline */}
            <div>
              <label htmlFor="deadline" className="block text-sm font-medium text-gray-700 mb-1">Deadline</label>
              <input type="date" name="deadline" id="deadline" value={formData.deadline} onChange={handleInputChange} className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#87CEEB] outline-none" required />
            </div>

            {/* Experience Level */}
            <div>
              <label htmlFor="experienceLevel" className="block text-sm font-medium text-gray-700 mb-1">Experience Level</label>
              <select name="experienceLevel" id="experienceLevel" value={formData.experienceLevel} onChange={handleInputChange} className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#87CEEB] outline-none">
                <option value="junior">Junior</option>
                <option value="mid-level">Mid-level</option>
                <option value="expert">Expert</option>
              </select>
            </div>

            {/* Location and Language */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="locationPreference" className="block text-sm font-medium text-gray-700 mb-1">Location Preference</label>
                <select name="locationPreference" id="locationPreference" value={formData.locationPreference} onChange={handleInputChange} className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#87CEEB] outline-none">
                  <option value="remote">Remote</option>
                  <option value="on-site">On-site</option>
                  <option value="hybrid">Hybrid</option>
                </select>
              </div>
              <div>
                <label htmlFor="language" className="block text-sm font-medium text-gray-700 mb-1">Preferred Language</label>
                <input type="text" name="language" id="language" value={formData.language} onChange={handleInputChange} className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#87CEEB] outline-none" placeholder="e.g., English, Spanish" />
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-4">
              <button type="submit" disabled={loading} className="px-6 py-3 rounded-xl text-white bg-gradient-to-br from-[#87CEEB] to-[#AFEEEE] font-semibold hover:from-[#AFEEEE] hover:to-[#87CEEB] shadow-lg transition-transform transform hover:scale-105 disabled:opacity-50">
                {loading ? 'Submitting...' : 'Post Project'}
              </button>
            </div>

            {/* Messages */}
            {error && <p className="text-red-500 text-center mt-4">{error}</p>}
            {success && <p className="text-green-500 text-center mt-4">{success}</p>}
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PostProjectPage;
