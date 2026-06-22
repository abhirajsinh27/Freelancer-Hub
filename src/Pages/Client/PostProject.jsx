import React, { useState } from "react";
import { useAuth } from "../../Context/AuthContext";
import { createProject } from "../../Services/projectService";
import { useNavigate } from "react-router-dom";
import Header from "../../Components/Header";
import toast from "react-hot-toast";
import { Plus, Briefcase, Calendar, DollarSign, Tag, Eye } from "lucide-react";

function PostProject() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [budget, setBudget] = useState("");
  const [skills, setSkills] = useState([]);
  const [skillInput, setSkillInput] = useState("");
  const [deadline, setDeadline] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const addSkill = (e) => {
    e.preventDefault();
    const trimmed = skillInput.trim();
    if (trimmed) {
      if (skills.includes(trimmed)) {
        toast.error("Skill tag already added.");
        return;
      }
      setSkills([...skills, trimmed]);
      setSkillInput("");
      // Clear inline error if skill was added
      if (errors.skills) {
        setErrors(prev => ({ ...prev, skills: null }));
      }
    }
  };

  const removeSkill = (index) => {
    setSkills(skills.filter((_, idx) => idx !== index));
  };

  const validate = () => {
    const newErrors = {};
    if (!title.trim()) {
      newErrors.title = "Project title is required.";
    } else if (title.trim().length < 5) {
      newErrors.title = "Title is too short (must be at least 5 characters).";
    }

    if (!description.trim()) {
      newErrors.description = "Project description is required.";
    } else if (description.trim().length < 15) {
      newErrors.description = "Description is too short (must be at least 15 characters).";
    }

    if (!budget.trim()) {
      newErrors.budget = "Project budget is required.";
    } else if (isNaN(Number(budget)) || Number(budget) <= 0) {
      newErrors.budget = "Please enter a valid positive number for budget.";
    }

    if (skills.length === 0) {
      newErrors.skills = "At least one skill tag is required.";
    }

    if (!deadline) {
      newErrors.deadline = "Project deadline is required.";
    } else {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (new Date(deadline) < today) {
        newErrors.deadline = "Deadline cannot be in the past.";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    if (!validate()) {
      toast.error("Please correct the errors in the form.");
      return;
    }

    setLoading(true);
    const toastId = toast.loading("Posting project...");

    try {
      await createProject({
        title: title.trim(),
        description: description.trim(),
        budget: Number(budget),
        skills,
        deadline,
        clientId: user.uid,
        clientName: user.username,
        proposalCount: 0,
      });

      toast.success("Project posted successfully!", { id: toastId });
      navigate("/client/dashboard");
    } catch (err) {
      console.error("Error posting project:", err);
      toast.error("Failed to post project. Please try again.", { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans pb-20">
      <Header />

      <main className="max-w-7xl mx-auto px-6 py-12 space-y-8 animate-fade-in">
        {/* Header Title */}
        <div className="border-b border-slate-900 pb-6">
          <h1 className="text-3xl font-extrabold text-white">Post New Project</h1>
          <p className="text-slate-400 text-sm font-light mt-1">
            Fill in the details to publish your project and connect with specialized freelancers.
          </p>
        </div>

        {/* Two-Column split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Form */}
          <form
            onSubmit={handleSubmit}
            className="lg:col-span-7 bg-slate-900/40 border border-slate-800/80 p-6 sm:p-8 rounded-2xl shadow-soft glass-panel space-y-6"
          >
            {/* Title */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-indigo-400" />
                Project Title
              </label>
              <input
                type="text"
                placeholder="e.g. Develop React E-Commerce Dashboard"
                className={`w-full px-4 py-3 rounded-xl bg-slate-950/60 border ${
                  errors.title ? "border-red-500/85 focus:ring-red-500/30" : "border-slate-800 focus:border-indigo-500 focus:ring-indigo-500/20"
                } text-white placeholder-slate-600 focus:ring-4 outline-none transition`}
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  if (errors.title) setErrors(prev => ({ ...prev, title: null }));
                }}
              />
              {errors.title && (
                <p className="text-xs text-red-400 font-medium pl-1">{errors.title}</p>
              )}
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Detailed Description
              </label>
              <textarea
                rows="5"
                placeholder="Describe your project scope, deliverables, requirements, and expectations..."
                className={`w-full px-4 py-3 rounded-xl bg-slate-950/60 border ${
                  errors.description ? "border-red-500/85 focus:ring-red-500/30" : "border-slate-800 focus:border-indigo-500 focus:ring-indigo-500/20"
                } text-white placeholder-slate-600 focus:ring-4 outline-none transition resize-none`}
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value);
                  if (errors.description) setErrors(prev => ({ ...prev, description: null }));
                }}
              />
              {errors.description && (
                <p className="text-xs text-red-400 font-medium pl-1">{errors.description}</p>
              )}
            </div>

            {/* Budget + Deadline Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Budget */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-indigo-400" />
                  Budget (₹)
                </label>
                <input
                  type="text"
                  placeholder="e.g. 15000"
                  className={`w-full px-4 py-3 rounded-xl bg-slate-950/60 border ${
                    errors.budget ? "border-red-500/85 focus:ring-red-500/30" : "border-slate-800 focus:border-indigo-500 focus:ring-indigo-500/20"
                  } text-white placeholder-slate-600 focus:ring-4 outline-none transition`}
                  value={budget}
                  onChange={(e) => {
                    setBudget(e.target.value);
                    if (errors.budget) setErrors(prev => ({ ...prev, budget: null }));
                  }}
                />
                {errors.budget && (
                  <p className="text-xs text-red-400 font-medium pl-1">{errors.budget}</p>
                )}
              </div>

              {/* Deadline */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-indigo-400" />
                  Deadline Date
                </label>
                <input
                  type="date"
                  className={`w-full px-4 py-3 rounded-xl bg-slate-950/60 border ${
                    errors.deadline ? "border-red-500/85 focus:ring-red-500/30" : "border-slate-800 focus:border-indigo-500 focus:ring-indigo-500/20"
                  } text-white focus:ring-4 outline-none transition cursor-pointer [color-scheme:dark]`}
                  value={deadline}
                  onChange={(e) => {
                    setDeadline(e.target.value);
                    if (errors.deadline) setErrors(prev => ({ ...prev, deadline: null }));
                  }}
                />
                {errors.deadline && (
                  <p className="text-xs text-red-400 font-medium pl-1">{errors.deadline}</p>
                )}
              </div>
            </div>

            {/* Skills tags selection */}
            <div className="space-y-3">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                <Tag className="w-4 h-4 text-indigo-400" />
                Required Skills
              </label>
              
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. React (Press Add)"
                  className={`flex-1 px-4 py-3 rounded-xl bg-slate-950/60 border ${
                    errors.skills ? "border-red-500/85 focus:ring-red-500/30" : "border-slate-800 focus:border-indigo-500 focus:ring-indigo-500/20"
                  } text-white placeholder-slate-600 focus:ring-4 outline-none transition`}
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addSkill(e);
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={addSkill}
                  className="px-5 py-3 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-xl border border-slate-700/50 flex items-center justify-center transition active:scale-95"
                >
                  <Plus className="w-4 h-4" /> Add
                </button>
              </div>
              {errors.skills && (
                <p className="text-xs text-red-400 font-medium pl-1">{errors.skills}</p>
              )}

              {/* Tag Badges displaying */}
              {skills.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-1.5">
                  {skills.map((skill, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 rounded-full text-xs font-semibold"
                    >
                      {skill}
                      <button
                        type="button"
                        onClick={() => removeSkill(index)}
                        className="text-indigo-400 hover:text-indigo-200 transition text-[10px] w-4.5 h-4.5 bg-slate-800 rounded-full inline-flex items-center justify-center"
                      >
                        ✕
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Submit Control */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-indigo-600/20 active:scale-[0.98] transition-all"
            >
              {loading ? "Publishing Project..." : "Publish Project"}
            </button>
          </form>

          {/* Right Column: Dynamic Preview */}
          <div className="lg:col-span-5 space-y-4 lg:sticky lg:top-24">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-2 pl-2">
              <Eye className="w-4.5 h-4.5 text-indigo-400" />
              Live Preview
            </h3>

            <div className="bg-slate-900/40 border border-slate-800/80 p-6 rounded-2xl shadow-soft glass-panel relative overflow-hidden group">
              {/* Badge */}
              <div className="flex justify-between items-start mb-4">
                <h4 className="text-lg font-bold text-white tracking-tight break-words max-w-[70%] group-hover:text-indigo-400 transition">
                  {title || "Developer Needed"}
                </h4>
                <span className="shrink-0 bg-indigo-500/15 text-indigo-300 border border-indigo-500/20 px-3.5 py-1 rounded-full text-xs font-semibold tracking-wide">
                  ₹ {budget || "0"}
                </span>
              </div>

              {/* Description */}
              <p className="text-xs text-slate-400 font-light leading-relaxed mb-4 line-clamp-3 break-words">
                {description || "Provide details about your project to see it dynamically reflected in this live preview card."}
              </p>

              {/* Skills preview */}
              <div className="flex flex-wrap gap-1.5 mb-4">
                {skills.length > 0 ? (
                  skills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 bg-slate-800 text-slate-300 text-[10px] font-semibold rounded-full"
                    >
                      {skill}
                    </span>
                  ))
                ) : (
                  <span className="text-[10px] text-slate-600 font-light italic">
                    Skills will list here...
                  </span>
                )}
              </div>

              {/* Meta */}
              <div className="flex items-center justify-between text-[11px] text-slate-500 border-t border-slate-800 pt-4 mt-4 font-light">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-rose-500/60" />
                  Deadline: {deadline || "Not selected"}
                </span>
                <span className="px-2 py-0.5 bg-green-500/10 text-green-400 border border-green-500/10 rounded font-semibold text-[10px] uppercase">
                  open
                </span>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}

export default PostProject;
