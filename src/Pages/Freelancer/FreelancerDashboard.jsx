import { useState, useEffect } from "react";
import { listenAllProjects } from "../../Services/projectService";
import { createBid, listenBidsByFreelancer } from "../../Services/bidService";
import ProjectCard from "../../Components/ProjectCard";
import Header from "../../Components/Header";
import { useAuth } from "../../Context/AuthContext";

function FreelancerDashboard() {
  const { user } = useAuth();

  const [projects, setProjects] = useState([]);
  const [myBids, setMyBids] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    // 🔥 Listen projects realtime
    const unsubscribeProjects = listenAllProjects((data) => {
      setProjects(data);
      setLoading(false);
    });

    // 🔥 Listen freelancer bids realtime
    const unsubscribeBids = listenBidsByFreelancer(user.uid, (bids) => {
      setMyBids(bids);
    });

    return () => {
      unsubscribeProjects();
      unsubscribeBids();
    };
  }, [user]);

  const handleBid = async (project) => {
    try {
      console.log(project);
      await createBid({
        projectId: project.id,
        freelancerId: user.uid,
        freelancerName: user.username,
        clientId: project.clientId,
        clientName: project.clientName,
        projecttitle: project.title,
        proposalTime: 5,
        bidAmount: project.budget,
      });
    } catch (error) {
      console.error("Error placing bid:", error);
    }
  };

  if (loading) {
    return (
      <div className="text-center mt-20 text-white">Loading projects...</div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-indigo-950 to-slate-900 pb-20">
      <Header />

      <div className="max-w-5xl mx-auto px-6 py-12 space-y-8">
        <h2 className="text-4xl font-bold text-white tracking-tight">
          Available Projects
        </h2>

        {projects.length === 0 ? (
          <p className="text-slate-400">No projects available.</p>
        ) : (
          projects.map((project) => {
            const isBid = myBids.some((bid) => bid.projectId === project.id);

            return (
              <ProjectCard
                key={project.id}
                title={project.title}
                budget={project.budget}
                skills={project.skills}
                isBid={isBid}
                deadline={project.deadline}
                onBid={() => handleBid(project)}
              />
            );
          })
        )}
      </div>
    </div>
  );
}

export default FreelancerDashboard;
