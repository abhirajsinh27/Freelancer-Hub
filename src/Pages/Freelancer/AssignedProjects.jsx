import { useEffect, useState } from "react";
import { listenAssignedProjects } from "../../Services/projectService";
import { useAuth } from "../../Context/AuthContext";
import Header from "../../Components/Header";
import { updateProjectStatus } from "../../Services/projectService";

function AssignedProjects() {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [submission, setSubmission] = useState({});
  const [progress, setProgress] = useState({});

  const handleUpdateProgress = async (projectId) => {
    if (!progress[projectId]) return; // 🚫 prevent empty
    await updateProjectStatus(projectId, {
      progress: progress[projectId] || "",
    });
  };

  const handleSubmitWork = async (projectId) => {
    if (!submission[projectId]) return; // 🚫 prevent empty
    await updateProjectStatus(projectId, {
      submission: submission[projectId] || "",
      status: "submitted",
    });
  };

  useEffect(() => {
    if (!user) return;

    const unsubscribe = listenAssignedProjects(user.uid, (data) => {
      setProjects(data);
    });

    return () => unsubscribe();
  }, [user]);

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-indigo-950 to-slate-900">
      <Header />

      <div className="max-w-5xl mx-auto px-8 py-12">
        <h2 className="text-4xl font-bold text-white mb-8">
          Assigned Projects
        </h2>

        <div className="space-y-6">
          {projects.map((project) => (
            <div
              key={project.id}
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-lg hover:shadow-indigo-500/10 transition"
            >
              {/* ================= HEADER ================= */}
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-white">
                    {project.title}
                  </h3>

                  <p className="text-slate-400 text-sm mt-1">
                    {project.description || "No description provided"}
                  </p>
                </div>

                <span className="bg-indigo-500/20 text-indigo-300 px-3 py-1 rounded-full text-sm">
                  ₹{project.budget}
                </span>
              </div>

              {/* ================= SKILLS ================= */}
              <div className="flex flex-wrap gap-2 mb-4">
                {project.skills?.map((skill, i) => (
                  <span
                    key={i}
                    className="bg-slate-700 text-slate-300 text-xs px-3 py-1 rounded-full"
                  >
                    {skill}
                  </span>
                ))}
              </div>

              {/* ================= META ================= */}
              <div className="flex justify-between text-sm text-slate-400 mb-4">
                <span>Deadline: {project.deadline || "N/A"}</span>

                <span className="bg-indigo-500/20 px-2 py-1 rounded text-indigo-300">
                  {project.status}
                </span>
              </div>

              {/* ================= PROGRESS SECTION ================= */}
              <div className="bg-white/5 border border-white/10 rounded-xl p-4 mb-4">
                <h4 className="text-sm text-indigo-400 mb-2">
                  Update Progress
                </h4>

                <textarea
                  placeholder="Write what you have completed..."
                  className="w-full bg-white/10 p-3 rounded-lg text-sm outline-none"
                  value={progress[project.id] || project.progress || ""}
                  onChange={(e) =>
                    setProgress({ ...progress, [project.id]: e.target.value })
                  }
                />

                <button
                  onClick={() => handleUpdateProgress(project.id)}
                  className="mt-2 bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg text-sm"
                >
                  Save Progress
                </button>
              </div>

              {/* ================= SUBMISSION SECTION ================= */}
              <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                <h4 className="text-sm text-green-400 mb-2">Submit Work</h4>

                <textarea
                  placeholder="Paste GitHub / Drive link..."
                  className="w-full bg-white/10 p-3 rounded-lg text-sm outline-none"
                  value={submission[project.id] || project.submission || ""}
                  onChange={(e) =>
                    setSubmission({
                      ...submission,
                      [project.id]: e.target.value,
                    })
                  }
                />

                <button
                  onClick={() => handleSubmitWork(project.id)}
                  className="mt-2 bg-green-500 hover:bg-green-600 px-4 py-2 rounded-lg text-sm"
                >
                  Submit Project
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AssignedProjects;
