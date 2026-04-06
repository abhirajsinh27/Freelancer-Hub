import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getProjectById } from "../../Services/projectService";
import Header from "../../Components/Header";

function ProjectDetails() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!projectId) return;

    const loadProject = async () => {
      setLoading(true);
      const data = await getProjectById(projectId);
      setProject(data);
      setLoading(false);
    };

    loadProject();
  }, [projectId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-900 via-indigo-950 to-slate-900 text-white">
        <Header />
        <div className="max-w-5xl mx-auto px-6 py-20 text-center">
          Loading project details...
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-900 via-indigo-950 to-slate-900 text-white">
        <Header />
        <div className="max-w-5xl mx-auto px-6 py-20 text-center">
          <p className="text-xl text-slate-300">Project not found.</p>
          <button
            onClick={() => navigate("/freelancer/dashboard")}
            className="mt-6 bg-indigo-500 px-5 py-3 rounded-xl text-white"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-indigo-950 to-slate-900 pb-20">
      <Header />

      <div className="max-w-6xl mx-auto px-6 py-12 space-y-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-slate-400 uppercase tracking-[.25em] text-xs">
              Project Details
            </p>
            <h1 className="text-4xl font-bold text-white">{project.title}</h1>
          </div>
          <button
            onClick={() => navigate("/freelancer/dashboard")}
            className="inline-flex items-center justify-center rounded-2xl bg-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/20"
          >
            Back to dashboard
          </button>
        </div>

        <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8">
            <div className="flex items-center justify-between gap-4 mb-6">
              <span className="inline-flex rounded-full bg-indigo-500/15 px-4 py-2 text-sm text-indigo-200">
                Status: {project.status || "Open"}
              </span>
              <span className="text-sm text-slate-400">Posted by {project.clientName || "Client"}</span>
            </div>

            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-white">Description</h2>
                <p className="mt-3 text-slate-300 leading-7">
                  {project.description || "No description provided for this project."}
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-3xl bg-slate-950/50 p-5">
                  <p className="text-sm uppercase tracking-[.2em] text-slate-500">Budget</p>
                  <p className="mt-3 text-3xl font-semibold text-white">₹{project.budget || "0"}</p>
                </div>

                <div className="rounded-3xl bg-slate-950/50 p-5">
                  <p className="text-sm uppercase tracking-[.2em] text-slate-500">Deadline</p>
                  <p className="mt-3 text-3xl font-semibold text-white">{project.deadline || "Not specified"}</p>
                </div>
              </div>

              <div className="rounded-3xl bg-slate-950/50 p-5">
                <p className="text-sm uppercase tracking-[.2em] text-slate-500">Required skills</p>
                <div className="mt-4 flex flex-wrap gap-3">
                  {project.skills?.length > 0 ? (
                    project.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="rounded-full bg-slate-800 px-4 py-2 text-sm text-slate-200"
                      >
                        {skill}
                      </span>
                    ))
                  ) : (
                    <span className="text-slate-500">No skills listed.</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          <aside className="space-y-6">
            <div className="rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Project snapshot</h2>
              <dl className="space-y-4 text-slate-300">
                <div className="flex items-center justify-between">
                  <dt className="text-sm text-slate-400">Client</dt>
                  <dd>{project.clientName || "Unknown"}</dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-sm text-slate-400">Status</dt>
                  <dd>{project.status || "open"}</dd>
                </div>
                {project.assignedFreelancerId && (
                  <div className="flex items-center justify-between">
                    <dt className="text-sm text-slate-400">Assigned freelancer</dt>
                    <dd>{project.assignedFreelancerName || "TBA"}</dd>
                  </div>
                )}
              </dl>
            </div>

            <div className="rounded-3xl bg-slate-950/50 p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Next steps</h2>
              <p className="text-slate-400 leading-7">
                Review the full project brief and place your bid from the dashboard.
                If you already submitted a proposal, keep an eye on the project status.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

export default ProjectDetails;