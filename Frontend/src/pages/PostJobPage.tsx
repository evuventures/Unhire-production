import React, { useState } from 'react';
import { Upload, X } from 'lucide-react';
import Header from '../components/Header';

const PostJobPage: React.FC = () => {
  const [skills, setSkills] = useState(['UX Research', 'Figma', 'React']);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    budget: '',
    deadline: '',
    priority: 'Normal',
    skillInput: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const removeSkill = (skillToRemove: string) => {
    setSkills(skills.filter(skill => skill !== skillToRemove));
  };

  const addSkill = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && formData.skillInput.trim()) {
      e.preventDefault();
      if (!skills.includes(formData.skillInput.trim())) {
        setSkills([...skills, formData.skillInput.trim()]);
      }
      setFormData({ ...formData, skillInput: '' });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Job posted:', { ...formData, skills });
    // Handle form submission
  };

  const getSkillColor = (index: number) => {
    const colors = [
      'bg-blue-100 text-blue-800',
      'bg-teal-100 text-teal-800', 
      'bg-purple-100 text-purple-800',
      'bg-green-100 text-green-800',
      'bg-orange-100 text-orange-800'
    ];
    return colors[index % colors.length];
  };

  return (
    <div className="relative flex size-full min-h-screen flex-col overflow-x-hidden">
      <div className="layout-container flex h-full grow flex-col">
        <Header variant="app" />

        <main className="flex flex-1 justify-center py-12 bg-gray-50">
          <div className="w-full max-w-2xl space-y-8 px-4">
            <div className="text-center">
              <h1 className="text-4xl font-bold tracking-tighter text-gray-900">Post a New Job</h1>
              <p className="mt-2 text-lg text-gray-600">
                Fill in the details below to find the perfect freelancer for your project.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 space-y-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Job Title */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700" htmlFor="title">
                    Job Title
                  </label>
                  <input
                    className="flex w-full rounded-xl border-gray-300 bg-white h-12 px-4 text-base placeholder:text-gray-400 focus:ring-2 focus:ring-[#87CEEB] focus:border-[#87CEEB] transition-shadow"
                    id="title"
                    name="title"
                    placeholder="e.g., UI/UX Designer for Mobile App"
                    type="text"
                    value={formData.title}
                    onChange={handleInputChange}
                  />
                </div>

                {/* Job Description */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700" htmlFor="description">
                    Job Description
                  </label>
                  <textarea
                    className="flex w-full rounded-xl border-gray-300 bg-white min-h-36 p-4 text-base placeholder:text-gray-400 focus:ring-2 focus:ring-[#87CEEB] focus:border-[#87CEEB] transition-shadow"
                    id="description"
                    name="description"
                    placeholder="Describe the project, required skills, and deliverables in detail..."
                    value={formData.description}
                    onChange={handleInputChange}
                  />
                </div>

                {/* Budget and Deadline */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700" htmlFor="budget">
                      Budget (USD)
                    </label>
                    <div className="relative">
                      <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                        $
                      </span>
                      <input
                        className="pl-7 flex w-full rounded-xl border-gray-300 bg-white h-12 px-4 text-base placeholder:text-gray-400 focus:ring-2 focus:ring-[#87CEEB] focus:border-[#87CEEB] transition-shadow"
                        id="budget"
                        name="budget"
                        placeholder="1000"
                        type="number"
                        value={formData.budget}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700" htmlFor="deadline">
                      Deadline
                    </label>
                    <input
                      className="flex w-full rounded-xl border-gray-300 bg-white h-12 px-4 text-base text-gray-600 focus:ring-2 focus:ring-[#87CEEB] focus:border-[#87CEEB] transition-shadow"
                      id="deadline"
                      name="deadline"
                      type="date"
                      value={formData.deadline}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                {/* Priority and Skills */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700" htmlFor="priority">
                      Priority
                    </label>
                    <select
                      className="flex w-full rounded-xl border-gray-300 bg-white h-12 px-4 text-base text-gray-600 focus:ring-2 focus:ring-[#87CEEB] focus:border-[#87CEEB] transition-shadow"
                      id="priority"
                      name="priority"
                      value={formData.priority}
                      onChange={handleInputChange}
                    >
                      <option>Normal</option>
                      <option>High</option>
                      <option>Urgent</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700" htmlFor="skillInput">
                      Required Skills
                    </label>
                    <input
                      className="flex w-full rounded-xl border-gray-300 bg-white h-12 px-4 text-base placeholder:text-gray-400 focus:ring-2 focus:ring-[#87CEEB] focus:border-[#87CEEB] transition-shadow"
                      id="skillInput"
                      name="skillInput"
                      placeholder="Type a skill and press Enter"
                      type="text"
                      value={formData.skillInput}
                      onChange={handleInputChange}
                      onKeyDown={addSkill}
                    />
                  </div>
                </div>

                {/* Skills Tags */}
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill, index) => (
                    <span
                      key={skill}
                      className={`inline-flex items-center gap-x-1.5 py-1.5 px-3 rounded-full text-xs font-medium ${getSkillColor(index)}`}
                    >
                      {skill}
                      <button
                        className="group relative size-3.5 -mr-1 hover:bg-opacity-20 hover:bg-black rounded-full"
                        type="button"
                        onClick={() => removeSkill(skill)}
                      >
                        <X size={12} />
                      </button>
                    </span>
                  ))}
                </div>

                {/* File Upload */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Attachments</label>
                  <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed border-gray-300 px-6 py-10 text-center hover:border-[#87CEEB] transition-colors">
                    <Upload className="text-4xl text-gray-400" size={48} />
                    <p className="text-base font-semibold text-gray-700">Drag and drop files here</p>
                    <p className="text-sm text-gray-500">Or click to upload files (PDF, DOC, Images)</p>
                    <button
                      className="mt-2 flex items-center justify-center rounded-lg h-10 px-4 text-sm font-semibold text-white bg-[#F08080] hover:bg-opacity-90 transition-all duration-300 transform hover:scale-105"
                      type="button"
                    >
                      <span className="truncate">Browse Files</span>
                    </button>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end pt-4">
                  <button
                    className="flex min-w-[120px] items-center justify-center rounded-xl h-12 px-6 text-base font-bold text-white bg-gradient-to-br from-[#87CEEB] to-[#AFEEEE] hover:from-[#AFEEEE] hover:to-[#87CEEB] transition-all duration-300 transform hover:scale-105 shadow-lg"
                    type="submit"
                  >
                    <span className="truncate">Post Job</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default PostJobPage;