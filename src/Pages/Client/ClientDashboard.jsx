import { useEffect, useState } from "react";
import { listenProjectsByClient } from "../../Services/projectService";
import { useAuth } from "../../Context/AuthContext";
import ProjectCard from "../../Components/ProjectCard";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Header from "../../Components/Header";
import { listenBidsByProject } from "../../Services/bidService";


function ClientDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    return null;
  }

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const totalProjects = projects.length;
  const openProjects = projects.filter((p) => p.status === "open").length;
  const closedProjects = projects.filter((p) => p.status === "closed").length;

   useEffect(() => {
  if (!user) return;

  const unsubscribe = listenProjectsByClient(user.uid, (projectsData) => {
    setProjects(projectsData);
    setLoading(false);
  });

  return () => unsubscribe();

}, [user]);


  if (loading) {
    return (
      <div className="text-center mt-20 text-white">Loading projects...</div>
    );
  }
  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-indigo-950 to-slate-900 pb-20">
      <Header />
      <div className="max-w-6xl mx-auto px-8 py-12 space-y-12">
        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-linear-to-br from-indigo-600 to-indigo-800 p-6 rounded-2xl shadow-lg hover:scale-105 transition duration-300">
            <p className="text-white/80 text-sm">Total Projects</p>
            <h3 className="text-4xl font-bold text-white mt-3">
              {totalProjects}
            </h3>
          </div>

          <div className="bg-linear-to-br from-emerald-500 to-green-700 p-6 rounded-2xl shadow-lg hover:scale-105 transition duration-300">
            <p className="text-white/80 text-sm">Open Projects</p>
            <h3 className="text-4xl font-bold text-white mt-3">
              {openProjects}
            </h3>
          </div>

          <div className="bg-linear-to-br from-rose-500 to-red-700 p-6 rounded-2xl shadow-lg hover:scale-105 transition duration-300">
            <p className="text-white/80 text-sm">Closed Projects</p>
            <h3 className="text-4xl font-bold text-white mt-3">
              {closedProjects}
            </h3>
          </div>
        </div>

        {/* Heading + Button Row */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <h2 className="text-3xl font-bold text-white tracking-tight">
            My Projects
          </h2>

          <Link
            to="/client/post-project"
            className="bg-linear-to-r from-emerald-500 to-green-600 text-white px-6 py-3 rounded-xl shadow-lg hover:scale-105 hover:shadow-green-500/40 transition duration-200"
          >
            + Post New Project
          </Link>
        </div>

        {/* Projects List */}
        <div className="space-y-6">
          {projects.length === 0 ? (
            <p className="text-slate-400">No projects posted yet.</p>
          ) : (
            projects.map((project) => (
              <ProjectCard
                key={project.id}
                title={project.title}
                budget={project.budget}
                skills={project.skills}
                deadline={project.deadline}
                hasBids={true}
                onViewBids={() => navigate(`/client/project/${project.id}/bids`)}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default ClientDashboard;
