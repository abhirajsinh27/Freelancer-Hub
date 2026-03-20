import { useEffect,useState } from "react";
import { listenAssignedProjects } from "../../Services/projectService";
import { useAuth } from "../../Context/AuthContext";
import Header from "../../Components/Header";
import ProjectCard from "../../Components/ProjectCard";

function AssignedProjects() {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);

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

        {projects.length === 0 ? (
          <p className="text-slate-400">
            No assigned projects yet.
          </p>
        ) : (
          projects.map((project) => (
            <ProjectCard
              key={project.id}
              title={project.title}
              budget={project.budget}
              skills={project.skills}
              deadline={project.deadline}
              userRole="freelancer"
            />
          ))
        )}
      </div>
    </div>
  );
}

export default AssignedProjects;