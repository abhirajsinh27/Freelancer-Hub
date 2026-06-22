import React, { useEffect, useState } from "react";
import { listenProjectsByClient } from "../../Services/projectService";
import { listenBidsByClient } from "../../Services/bidService";
import { useAuth } from "../../Context/AuthContext";
import ProjectCard from "../../Components/ProjectCard";
import { Link, useNavigate } from "react-router-dom";
import Header from "../../Components/Header";
import EmptyState from "../../Components/EmptyState";
import { 
  Briefcase, 
  CheckCircle, 
  MessageSquare, 
  AlertCircle, 
  PlusCircle, 
  TrendingUp,
  Activity,
  ArrowRight,
  Clock
} from "lucide-react";

export default function ClientDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    return null;
  }

  const [projects, setProjects] = useState([]);
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    let unsubProjects = () => {};
    let unsubBids = () => {};

    const loadData = async () => {
      try {
        unsubProjects = listenProjectsByClient(user.uid, (projectsData) => {
          setProjects(projectsData);
          setLoading(false);
        });

        unsubBids = listenBidsByClient(user.uid, (bidsData) => {
          setBids(bidsData);
        });
      } catch (err) {
        console.error("Error loading client dashboard data:", err);
        setLoading(false);
      }
    };

    loadData();

    return () => {
      unsubProjects();
      unsubBids();
    };
  }, [user]);

  // Calculations for stats
  const activeProjects = projects.filter((p) => p.status === "in-progress").length;
  const completedProjects = projects.filter((p) => p.status === "completed").length;
  const totalBids = bids.length;
  const pendingReviews = projects.filter((p) => p.status === "submitted").length;

  // Build Recent Activity Feed from Projects & Bids
  const getActivityFeed = () => {
    const activities = [];

    // Project created events
    projects.forEach((proj) => {
      if (proj.createdAt) {
        activities.push({
          type: "project_created",
          text: `You posted the project "${proj.title}"`,
          date: proj.createdAt.toDate ? proj.createdAt.toDate() : new Date(proj.createdAt),
          icon: Briefcase,
          color: "text-indigo-400 bg-indigo-500/10",
        });
      }

      // Project completed events
      if (proj.status === "completed") {
        activities.push({
          type: "project_completed",
          text: `Project "${proj.title}" was completed successfully`,
          date: new Date(), // Fallback to current date or update status dates
          icon: CheckCircle,
          color: "text-green-400 bg-green-500/10",
        });
      }
    });

    // Bid submission events
    bids.forEach((bid) => {
      activities.push({
        type: "bid_submitted",
        text: `${bid.freelancerName || "A freelancer"} submitted a proposal of ₹${bid.bidAmount} for "${bid.projecttitle || "Untitled"}"`,
        date: bid.createdAt?.toDate ? bid.createdAt.toDate() : new Date(bid.createdAt || Date.now()),
        icon: MessageSquare,
        color: "text-amber-400 bg-amber-500/10",
      });
    });

    // Sort by date descending, take top 4
    return activities
      .sort((a, b) => b.date - a.date)
      .slice(0, 4);
  };

  const activityFeed = getActivityFeed();

  const getProposalCount = (projectId) => {
    return bids.filter((b) => b.projectId === projectId).length;
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans pb-20">
      <Header />

      <main className="max-w-7xl mx-auto px-6 py-12 space-y-10 animate-fade-in">
        {/* Welcome Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-900 pb-6">
          <div>
            <h1 className="text-3xl font-extrabold text-white">Client Console</h1>
            <p className="text-slate-400 text-sm font-light mt-1">
              Welcome back, <span className="font-semibold text-indigo-400">{user.username}</span>. Manage your projects and hire talent.
            </p>
          </div>
          
          <Link
            to="/client/post-project"
            className="inline-flex items-center gap-2 px-5 py-3 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-xl shadow-lg hover:shadow-indigo-600/20 active:scale-95 transition-all"
          >
            <PlusCircle className="w-5 h-5" />
            Create Project
          </Link>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 text-slate-400 text-sm font-light space-y-3">
            <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
            <span>Loading console details...</span>
          </div>
        ) : (
          <>
            {/* Stats Dashboard Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Stat card 1 */}
              <div className="bg-slate-900/40 border border-slate-800/80 p-6 rounded-2xl flex flex-col justify-between h-32 hover:border-slate-700/50 transition duration-300 shadow-soft">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="text-xs font-semibold uppercase tracking-wider">Active Projects</span>
                  <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400">
                    <Briefcase className="w-5 h-5" />
                  </div>
                </div>
                <h3 className="text-3xl font-extrabold text-white tracking-tight">{activeProjects}</h3>
              </div>

              {/* Stat card 2 */}
              <div className="bg-slate-900/40 border border-slate-800/80 p-6 rounded-2xl flex flex-col justify-between h-32 hover:border-slate-700/50 transition duration-300 shadow-soft">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="text-xs font-semibold uppercase tracking-wider">Completed Projects</span>
                  <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
                    <CheckCircle className="w-5 h-5" />
                  </div>
                </div>
                <h3 className="text-3xl font-extrabold text-white tracking-tight">{completedProjects}</h3>
              </div>

              {/* Stat card 3 */}
              <div className="bg-slate-900/40 border border-slate-800/80 p-6 rounded-2xl flex flex-col justify-between h-32 hover:border-slate-700/50 transition duration-300 shadow-soft">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="text-xs font-semibold uppercase tracking-wider">Received Proposals</span>
                  <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                </div>
                <h3 className="text-3xl font-extrabold text-white tracking-tight">{totalBids}</h3>
              </div>

              {/* Stat card 4 */}
              <div className="bg-slate-900/40 border border-slate-800/80 p-6 rounded-2xl flex flex-col justify-between h-32 hover:border-slate-700/50 transition duration-300 shadow-soft">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="text-xs font-semibold uppercase tracking-wider">Pending Reviews</span>
                  <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400">
                    <AlertCircle className="w-5 h-5" />
                  </div>
                </div>
                <h3 className="text-3xl font-extrabold text-white tracking-tight">{pendingReviews}</h3>
              </div>
            </div>

            {/* Layout Column Split */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Left Column: Projects List */}
              <div className="lg:col-span-8 space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-indigo-400" />
                    My Projects
                  </h2>
                  {projects.length > 0 && (
                    <span className="text-xs font-semibold px-2.5 py-1 bg-slate-900 border border-slate-800 text-slate-400 rounded-full">
                      {projects.length} Total
                    </span>
                  )}
                </div>

                {projects.length === 0 ? (
                  <EmptyState
                    iconName="Briefcase"
                    title="No Projects Yet"
                    description="Create your first project and start hiring talented freelancers to bring your ideas to life."
                    actionText="Post a Project"
                    actionLink="/client/post-project"
                  />
                ) : (
                  <div className="grid gap-6">
                    {projects.map((project) => (
                      <ProjectCard
                        key={project.id}
                        title={project.title}
                        budget={project.budget}
                        skills={project.skills}
                        deadline={project.deadline}
                        status={project.status}
                        createdAt={project.createdAt}
                        proposalCount={getProposalCount(project.id)}
                        hasBids={getProposalCount(project.id) > 0}
                        onViewBids={() => navigate(`/client/project/${project.id}/bids`)}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Right Column: Sidepanels */}
              <div className="lg:col-span-4 space-y-8">
                
                {/* Panel 1: Quick Actions */}
                <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-6 shadow-soft glass-panel space-y-4">
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-300">Quick Actions</h3>
                  
                  <div className="grid gap-2">
                    <Link
                      to="/client/post-project"
                      className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:bg-indigo-600/10 hover:border-indigo-500/30 text-sm text-slate-300 hover:text-white transition duration-200 group"
                    >
                      <span>Post New Project</span>
                      <ArrowRight className="w-4.5 h-4.5 text-slate-500 group-hover:text-indigo-400 group-hover:translate-x-1 transition duration-200" />
                    </Link>

                    <Link
                      to="/client/Track-Projects"
                      className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:bg-indigo-600/10 hover:border-indigo-500/30 text-sm text-slate-300 hover:text-white transition duration-200 group"
                    >
                      <span>Track Active Projects</span>
                      <ArrowRight className="w-4.5 h-4.5 text-slate-500 group-hover:text-indigo-400 group-hover:translate-x-1 transition duration-200" />
                    </Link>

                    <Link
                      to="/client/client-bids"
                      className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:bg-indigo-600/10 hover:border-indigo-500/30 text-sm text-slate-300 hover:text-white transition duration-200 group"
                    >
                      <span>View All Proposals</span>
                      <ArrowRight className="w-4.5 h-4.5 text-slate-500 group-hover:text-indigo-400 group-hover:translate-x-1 transition duration-200" />
                    </Link>
                  </div>
                </div>

                {/* Panel 2: Activity Feed */}
                <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-6 shadow-soft glass-panel space-y-5">
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                    <Activity className="w-4 h-4 text-indigo-400" />
                    Recent Activity
                  </h3>

                  {activityFeed.length === 0 ? (
                    <div className="text-center py-6 text-slate-500 text-xs font-light">
                      No recent activities recorded.
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {activityFeed.map((activity, idx) => (
                        <div key={idx} className="flex items-start gap-3 text-xs leading-relaxed">
                          <div className={`p-1.5 rounded-lg shrink-0 ${activity.color}`}>
                            <activity.icon className="w-3.5 h-3.5" />
                          </div>
                          
                          <div className="flex-1 space-y-1">
                            <p className="text-slate-300 font-light">{activity.text}</p>
                            <div className="flex items-center text-[10px] text-slate-500 gap-1 font-light">
                              <Clock className="w-3 h-3" />
                              {activity.date.toLocaleDateString()} at {activity.date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

              </div>

            </div>
          </>
        )}
      </main>
    </div>
  );
}
