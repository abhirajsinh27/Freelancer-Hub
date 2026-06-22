import React, { useEffect, useState } from "react";
import Header from "../../Components/Header";
import { listenProjectsByClient, updateProjectStatus } from "../../Services/projectService";
import { useAuth } from "../../Context/AuthContext";
import toast from "react-hot-toast";
import EmptyState from "../../Components/EmptyState";
import { 
  Briefcase, 
  User, 
  ExternalLink, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  TrendingUp,
  FileCheck
} from "lucide-react";

function TrackProjects() {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    const unsubscribe = listenProjectsByClient(user.uid, (projectsData) => {
      setProjects(projectsData);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [user]);

  const handleCompleteProject = async (projectId, projectTitle) => {
    const toastId = toast.loading(`Completing project "${projectTitle}"...`);
    try {
      await updateProjectStatus(projectId, {
        status: "completed",
      });
      toast.success("Project marked as completed! Payment contract released.", { id: toastId });
    } catch (err) {
      console.error("Error completing project:", err);
      toast.error("Failed to complete project. Please try again.", { id: toastId });
    }
  };

  // Filter projects that have been assigned (in-progress, submitted, completed)
  const trackedProjects = projects.filter(
    (p) => p.status === "in-progress" || p.status === "submitted" || p.status === "completed"
  );

  // Status Stepper Helper
  const renderTimeline = (status) => {
    const steps = [
      { key: "open", label: "Open / Hiring", done: true },
      { key: "in-progress", label: "In Progress", done: status === "in-progress" || status === "submitted" || status === "completed" },
      { key: "completed", label: "Completed", done: status === "completed" }
    ];

    return (
      <div className="flex items-center w-full justify-between pt-4 pb-2">
        {steps.map((step, idx) => (
          <React.Fragment key={step.key}>
            {/* Step bubble */}
            <div className="flex flex-col items-center relative z-10">
              <div
                className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                  step.done
                    ? "bg-indigo-600 border-indigo-500 text-white shadow-glow-primary"
                    : "bg-slate-950 border-slate-800 text-slate-500"
                }`}
              >
                {step.done ? "✓" : idx + 1}
              </div>
              <span
                className={`text-[10px] mt-2 font-semibold uppercase tracking-wider ${
                  step.done ? "text-indigo-400" : "text-slate-500"
                }`}
              >
                {step.label}
              </span>
            </div>
            {/* Connector line */}
            {idx < steps.length - 1 && (
              <div
                className={`flex-1 h-0.5 mx-2 -translate-y-3 transition-all duration-300 ${
                  (idx === 0 && (status === "in-progress" || status === "submitted" || status === "completed")) || (idx === 1 && status === "completed")
                    ? "bg-indigo-600"
                    : "bg-slate-800"
                }`}
              ></div>
            )}
          </React.Fragment>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans pb-20">
      <Header />

      <main className="max-w-6xl mx-auto px-6 py-12 space-y-8 animate-fade-in">
        {/* Page title header */}
        <div className="border-b border-slate-900 pb-6">
          <h1 className="text-3xl font-extrabold text-white">Project Tracking Board</h1>
          <p className="text-slate-400 text-sm font-light mt-1">
            Monitor real-time progress on your active contracts, view freelancer deliverables, and approve completed projects.
          </p>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 text-slate-400 text-sm font-light space-y-3">
            <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
            <span>Loading tracked projects...</span>
          </div>
        ) : (
          <>
            {trackedProjects.length === 0 ? (
              <EmptyState
                iconName="TrendingUp"
                title="No Active Contracts"
                description="You don't have any assigned projects in development yet. Award a bid to a freelancer to start tracking project delivery."
                actionText="View Proposals"
                actionLink="/client/client-bids"
              />
            ) : (
              <div className="grid gap-8">
                {trackedProjects.map((project) => {
                  const isSubmitted = project.status === "submitted";
                  const isCompleted = project.status === "completed";

                  return (
                    <div
                      key={project.id}
                      className={`bg-slate-900/40 border p-6 sm:p-8 rounded-2xl shadow-soft glass-panel space-y-8 transition-all duration-300 ${
                        isCompleted ? "border-slate-900/80 opacity-80" : "border-slate-800"
                      }`}
                    >
                      {/* Header details */}
                      <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pb-4 border-b border-slate-800/60">
                        <div className="space-y-1">
                          <h3 className="text-xl font-bold text-white flex items-center gap-2">
                            <Briefcase className="w-5 h-5 text-indigo-400" />
                            {project.title}
                          </h3>
                          <p className="text-xs text-slate-400 font-light max-w-2xl leading-relaxed">
                            {project.description}
                          </p>
                        </div>
                        <span className="shrink-0 bg-indigo-500/10 text-indigo-400 px-4 py-1.5 rounded-full text-sm font-semibold border border-indigo-500/10 shadow-glow-primary">
                          ₹{project.budget}
                        </span>
                      </div>

                      {/* Visual Timeline Stepper */}
                      <div className="max-w-2xl mx-auto px-4">
                        {renderTimeline(project.status)}
                      </div>

                      {/* Info & updates box grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                        {/* Progress column */}
                        <div className="bg-slate-950/40 p-5 rounded-2xl border border-slate-800/80 space-y-3">
                          <h4 className="text-xs font-semibold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
                            <Clock className="w-4 h-4" /> Real-time Progress Log
                          </h4>
                          <div className="text-sm text-slate-300 font-light leading-relaxed">
                            {project.progress || "No progress reports saved yet by the freelancer."}
                          </div>
                          {project.assignedFreelancerName && (
                            <div className="flex items-center gap-1.5 text-xs text-slate-500 font-light pt-2">
                              <User className="w-3.5 h-3.5 text-slate-600" />
                              Developer: <span className="font-semibold text-slate-400">{project.assignedFreelancerName}</span>
                            </div>
                          )}
                        </div>

                        {/* Deliverables column */}
                        <div className="bg-slate-950/40 p-5 rounded-2xl border border-slate-800/80 space-y-4 flex flex-col justify-between">
                          <div className="space-y-2">
                            <h4 className="text-xs font-semibold uppercase tracking-wider text-green-400 flex items-center gap-1.5">
                              <FileCheck className="w-4 h-4" /> Submitted Deliverables
                            </h4>
                            {project.submission ? (
                              <div className="pt-1">
                                <a
                                  href={project.submission}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="inline-flex items-center gap-1.5 text-sm text-green-400 hover:text-green-300 hover:underline transition font-medium"
                                >
                                  View Delivery Links <ExternalLink className="w-4 h-4" />
                                </a>
                              </div>
                            ) : (
                              <p className="text-xs text-slate-500 font-light italic">
                                Waiting for final deliverables submission from developer...
                              </p>
                            )}
                          </div>

                          {/* Approval Actions */}
                          {isSubmitted && (
                            <button
                              onClick={() => handleCompleteProject(project.id, project.title)}
                              className="w-full py-3 bg-green-600 hover:bg-green-500 active:scale-[0.98] text-white text-xs font-bold rounded-xl shadow-lg hover:shadow-green-600/20 transition-all flex items-center justify-center gap-2"
                            >
                              <CheckCircle2 className="w-4.5 h-4.5" /> Approve Work & Complete Project
                            </button>
                          )}

                          {isCompleted && (
                            <div className="inline-flex items-center gap-1.5 px-3 py-2 bg-green-500/10 border border-green-500/20 text-green-400 rounded-xl text-xs font-semibold justify-center">
                              <CheckCircle2 className="w-4 h-4" /> Project Successfully Completed
                            </div>
                          )}

                          {!isSubmitted && !isCompleted && (
                            <div className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-900/60 border border-slate-800 text-slate-500 rounded-xl text-xs font-light justify-center">
                              <AlertCircle className="w-4 h-4 text-slate-600" /> Currently In Development Phase
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}

export default TrackProjects;
