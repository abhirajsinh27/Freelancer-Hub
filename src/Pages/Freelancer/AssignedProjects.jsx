import React, { useEffect, useState } from "react";
import { listenAssignedProjects } from "../../Services/projectService";
import { useAuth } from "../../Context/AuthContext";
import Header from "../../Components/Header";
import { updateProjectStatus } from "../../Services/projectService";
import toast from "react-hot-toast";
import EmptyState from "../../Components/EmptyState";
import { 
  Briefcase, 
  DollarSign, 
  Calendar, 
  Clock, 
  Send, 
  Save, 
  CheckCircle,
  FileCheck
} from "lucide-react";

function AssignedProjects() {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [submission, setSubmission] = useState({});
  const [progress, setProgress] = useState({});
  const [loading, setLoading] = useState(true);

  const handleUpdateProgress = async (projectId, projectTitle) => {
    const text = progress[projectId]?.trim();
    if (!text) {
      toast.error("Please enter a progress update note.");
      return;
    }

    const toastId = toast.loading("Updating progress...");
    try {
      await updateProjectStatus(projectId, {
        progress: text,
      });
      toast.success("Progress log updated successfully!", { id: toastId });
    } catch (err) {
      console.error("Error updating progress:", err);
      toast.error("Failed to save progress update.", { id: toastId });
    }
  };

  const handleSubmitWork = async (projectId, projectTitle) => {
    const link = submission[projectId]?.trim();
    if (!link) {
      toast.error("Please enter your delivery submission link.");
      return;
    }

    if (!link.startsWith("http://") && !link.startsWith("https://")) {
      toast.error("Please enter a valid URL starting with http:// or https://");
      return;
    }

    const toastId = toast.loading("Submitting work...");
    try {
      await updateProjectStatus(projectId, {
        submission: link,
        status: "submitted",
      });
      toast.success("Work submitted successfully! The client has been notified.", { id: toastId });
    } catch (err) {
      console.error("Error submitting work:", err);
      toast.error("Failed to submit work delivery.", { id: toastId });
    }
  };

  useEffect(() => {
    if (!user) return;

    setLoading(true);
    const unsubscribe = listenAssignedProjects(user.uid, (data) => {
      const active = data.filter((proj) => proj.status !== "completed");
      setProjects(active);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans pb-20">
      <Header />

      <main className="max-w-5xl mx-auto px-6 py-12 space-y-8 animate-fade-in">
        {/* Page Header */}
        <div className="border-b border-slate-900 pb-6">
          <h1 className="text-3xl font-extrabold text-white">Assigned Contracts</h1>
          <p className="text-slate-400 text-sm font-light mt-1">
            Publish progress updates on your active contracts and submit completed project deliverables for approval.
          </p>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 text-slate-400 text-sm font-light space-y-3">
            <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
            <span>Loading assigned contracts...</span>
          </div>
        ) : (
          <>
            {projects.length === 0 ? (
              <EmptyState
                iconName="Briefcase"
                title="No Assigned Projects"
                description="You don't have any active project contracts in progress. Browse open projects and start bidding!"
                actionText="Browse Available Projects"
                actionLink="/freelancer/dashboard"
              />
            ) : (
              <div className="grid gap-8">
                {projects.map((project) => (
                  <div
                    key={project.id}
                    className="bg-slate-900/40 border border-slate-800 p-6 sm:p-8 rounded-2xl shadow-soft glass-panel space-y-6"
                  >
                    {/* Header Row */}
                    <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pb-4 border-b border-slate-850">
                      <div className="space-y-1">
                        <h3 className="text-xl font-bold text-white flex items-center gap-2">
                          <Briefcase className="w-5 h-5 text-indigo-400" />
                          {project.title}
                        </h3>
                        <p className="text-xs text-slate-400 font-light max-w-2xl leading-relaxed">
                          {project.description || "No description provided."}
                        </p>
                      </div>

                      <span className="shrink-0 bg-indigo-500/10 text-indigo-400 border border-indigo-500/10 px-4 py-1.5 rounded-full text-sm font-semibold shadow-glow-primary">
                        ₹{project.budget}
                      </span>
                    </div>

                    {/* Project Skills & Deadlines metadata */}
                    <div className="flex flex-wrap items-center justify-between gap-4 text-xs font-light text-slate-400">
                      <div className="flex flex-wrap gap-2">
                        {project.skills?.map((skill, idx) => (
                          <span
                            key={idx}
                            className="px-2.5 py-1 bg-slate-800 text-slate-300 font-semibold rounded-full"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4 text-rose-500/60" /> Deadline: {project.deadline || "N/A"}
                        </span>
                        <span className="px-2.5 py-0.5 bg-indigo-500/10 text-indigo-400 border border-indigo-500/10 rounded font-semibold uppercase text-[10px]">
                          {project.status}
                        </span>
                      </div>
                    </div>

                    {/* Progress Update & Deliverables section */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                      
                      {/* Left: Progress notes updater */}
                      <div className="bg-slate-950/40 p-5 rounded-xl border border-slate-850 space-y-4">
                        <h4 className="text-xs font-semibold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
                          <Clock className="w-4 h-4" /> Log Progress Update
                        </h4>
                        
                        <textarea
                          rows="4"
                          placeholder="Describe what you completed, milestones achieved, or current development hurdles..."
                          className="w-full px-3 py-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-sm text-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition resize-none"
                          value={progress[project.id] !== undefined ? progress[project.id] : project.progress || ""}
                          onChange={(e) =>
                            setProgress({ ...progress, [project.id]: e.target.value })
                          }
                        />

                        <button
                          onClick={() => handleUpdateProgress(project.id, project.title)}
                          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-xs font-bold rounded-lg text-white transition flex items-center gap-1.5 shadow-md"
                        >
                          <Save className="w-3.5 h-3.5" /> Save Progress
                        </button>
                      </div>

                      {/* Right: Submit Delivery Link */}
                      <div className="bg-slate-950/40 p-5 rounded-xl border border-slate-850 space-y-4">
                        <h4 className="text-xs font-semibold uppercase tracking-wider text-green-400 flex items-center gap-1.5">
                          <FileCheck className="w-4 h-4" /> Submit Work Delivery
                        </h4>
                        
                        <textarea
                          rows="4"
                          placeholder="Paste a link to your final work deliverables (e.g. GitHub Repository, Figma Link, Google Drive Folder)..."
                          className="w-full px-3 py-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-sm text-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition resize-none"
                          value={submission[project.id] !== undefined ? submission[project.id] : project.submission || ""}
                          onChange={(e) =>
                            setSubmission({ ...submission, [project.id]: e.target.value })
                          }
                        />

                        <button
                          onClick={() => handleSubmitWork(project.id, project.title)}
                          className="px-4 py-2 bg-green-600 hover:bg-green-500 active:scale-95 text-xs font-bold rounded-lg text-white transition flex items-center gap-1.5 shadow-md"
                        >
                          <Send className="w-3.5 h-3.5" /> Submit Deliverables
                        </button>
                      </div>

                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}

export default AssignedProjects;
