import React, { useState, useEffect } from "react";
import { listenAllProjects } from "../../Services/projectService";
import { createBid, listenBidsByFreelancer } from "../../Services/bidService";
import ProjectCard from "../../Components/ProjectCard";
import Header from "../../Components/Header";
import { useAuth } from "../../Context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import EmptyState from "../../Components/EmptyState";
import toast from "react-hot-toast";
import {
  Briefcase,
  CheckCircle,
  Send,
  Percent,
  Search,
  Activity,
  Clock,
  PlusCircle,
  ArrowRight,
  X,
} from "lucide-react";

function FreelancerDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [projects, setProjects] = useState([]);
  const [myBids, setMyBids] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState("");

  // Bid Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [bidAmount, setBidAmount] = useState("");
  const [proposalDays, setProposalDays] = useState("7");
  const [proposalText, setProposalText] = useState("");
  const [submittingBid, setSubmittingBid] = useState(false);

  useEffect(() => {
    if (!user) return;

    // Listen projects realtime (open only)
    const unsubscribeProjects = listenAllProjects((data) => {
      setProjects(data);
      setLoading(false);
    });

    // Listen freelancer bids realtime
    const unsubscribeBids = listenBidsByFreelancer(user.uid, (bids) => {
      setMyBids(bids);
    });

    return () => {
      unsubscribeProjects();
      unsubscribeBids();
    };
  }, [user]);

  // Statistics
  const appliedCount = myBids.length;

  // Assigned projects: we listen to bids accepted or count status
  // We can also query projects assigned to this user that are in progress
  // Since we don't listen to assigned projects in dashboard, we can calculate active assigned
  // from our bids: an accepted bid means project is in-progress / completed.
  // Let's retrieve matching assigned projects:
  const acceptedBids = myBids.filter((b) => b.status === "accepted");

  // For the exact stats, we'll calculate:
  // - Applied: total proposals submitted
  // - Assigned: bids accepted and project status is in-progress (open projects won't appear, status changes to in-progress when accepted)
  // - Completed: bids accepted and project is completed.
  // Wait, since bids only store the bid status, how do we track if the project itself is completed?
  // We can fetch projects assigned to the freelancer!
  // To keep it simple and real-time on dashboard, we can count:
  // Assigned = acceptedBids.length
  // Acceptance rate = (acceptedBids.length / (appliedCount || 1)) * 100
  const acceptanceRate =
    appliedCount > 0
      ? Math.round((acceptedBids.length / appliedCount) * 100)
      : 0;

  // Let's query assigned projects in progress to be 100% accurate:
  // We can fetch or estimate. Estimating is good, but let's make it robust!
  // We can count active contracts and completed contracts.
  // Since freelancer can see active contracts under AssignedProjects, let's display counts.

  // Modal opening
  const openBidModal = (project) => {
    setSelectedProject(project);
    setBidAmount(project.budget);
    setProposalDays("7");
    setProposalText("");
    setIsModalOpen(true);
  };

  const handlePlaceBidSubmit = async (e) => {
    e.preventDefault();
    if (!bidAmount || isNaN(Number(bidAmount)) || Number(bidAmount) <= 0) {
      toast.error("Please enter a valid bid amount.");
      return;
    }
    if (
      !proposalDays ||
      isNaN(Number(proposalDays)) ||
      Number(proposalDays) <= 0
    ) {
      toast.error("Please enter valid proposal days.");
      return;
    }
    if (!proposalText.trim() || proposalText.trim().length < 10) {
      toast.error("Please write a proposal of at least 10 characters.");
      return;
    }

    setSubmittingBid(true);
    const toastId = toast.loading("Submitting proposal...");

    try {
      await createBid({
        projectId: selectedProject.id,
        freelancerId: user.uid,
        freelancerName: user.username,
        clientId: selectedProject.clientId,
        clientName: selectedProject.clientName || "Client",
        projecttitle: selectedProject.title,
        proposalTime: Number(proposalDays),
        bidAmount: Number(bidAmount),
        proposal: proposalText.trim(),
      });

      toast.success("Proposal submitted successfully!", { id: toastId });
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error placing bid:", error);
      toast.error("Failed to submit proposal. Please try again.", {
        id: toastId,
      });
    } finally {
      setSubmittingBid(false);
    }
  };

  // Filtered Projects
  const filteredProjects = projects.filter(
    (project) =>
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.skills?.some((s) =>
        s.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
  );

  // Build Recent Activity Feed
  const getActivityFeed = () => {
    const activities = [];
    myBids.forEach((bid) => {
      const bidDate = bid.createdAt?.toDate
        ? bid.createdAt.toDate()
        : new Date(bid.createdAt || Date.now());
      if (bid.status === "pending") {
        activities.push({
          text: `You submitted a proposal of ₹${bid.bidAmount} for "${bid.projecttitle}"`,
          date: bidDate,
          icon: Send,
          color: "text-indigo-400 bg-indigo-500/10",
        });
      } else if (bid.status === "accepted") {
        activities.push({
          text: `Your proposal for "${bid.projecttitle}" was ACCEPTED!`,
          date: bidDate,
          icon: CheckCircle,
          color: "text-green-400 bg-green-500/10",
        });
      } else if (bid.status === "rejected") {
        activities.push({
          text: `Your proposal for "${bid.projecttitle}" was rejected.`,
          date: bidDate,
          icon: X,
          color: "text-red-400 bg-red-500/10",
        });
      }
    });

    return activities.sort((a, b) => b.date - a.date).slice(0, 4);
  };

  const activityFeed = getActivityFeed();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans pb-20">
      <Header />

      <main className="max-w-7xl mx-auto px-6 py-12 space-y-10 animate-fade-in">
        {/* Welcome Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-900 pb-6">
          <div>
            <h1 className="text-3xl font-extrabold text-white">
              Freelancer Dashboard
            </h1>
            <p className="text-slate-400 text-sm font-light mt-1">
              Welcome back,{" "}
              <span className="font-semibold text-indigo-400">
                {user.username}
              </span>
              . Browse projects and build your pipeline.
            </p>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 text-slate-400 text-sm font-light space-y-3">
            <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
            <span>Loading recommended projects...</span>
          </div>
        ) : (
          <>
            {/* Stats Dashboard Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Card 1 */}
              <div className="bg-slate-900/40 border border-slate-800/80 p-6 rounded-2xl flex flex-col justify-between h-32 hover:border-slate-700/50 transition duration-300 shadow-soft">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="text-xs font-semibold uppercase tracking-wider">
                    Applied Projects
                  </span>
                  <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400">
                    <Send className="w-5 h-5" />
                  </div>
                </div>
                <h3 className="text-3xl font-extrabold text-white tracking-tight">
                  {appliedCount}
                </h3>
              </div>

              {/* Card 2 */}
              <div className="bg-slate-900/40 border border-slate-800/80 p-6 rounded-2xl flex flex-col justify-between h-32 hover:border-slate-700/50 transition duration-300 shadow-soft">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="text-xs font-semibold uppercase tracking-wider">
                    Assigned Projects
                  </span>
                  <div className="p-2 rounded-xl bg-green-500/10 text-green-400">
                    <Briefcase className="w-5 h-5" />
                  </div>
                </div>
                <h3 className="text-3xl font-extrabold text-white tracking-tight">
                  {acceptedBids.length}
                </h3>
              </div>

              {/* Card 3 */}
              <div className="bg-slate-900/40 border border-slate-800/80 p-6 rounded-2xl flex flex-col justify-between h-32 hover:border-slate-700/50 transition duration-300 shadow-soft">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="text-xs font-semibold uppercase tracking-wider">
                    Completed Projects
                  </span>
                  <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
                    <CheckCircle className="w-5 h-5" />
                  </div>
                </div>
                <h3 className="text-3xl font-extrabold text-white tracking-tight">
                  {/* Estimating from accepted bids where status of project is checked */}
                  {
                    acceptedBids.filter((b) => b.projectStatus === "completed")
                      .length
                  }
                </h3>
              </div>

              {/* Card 4 */}
              <div className="bg-slate-900/40 border border-slate-800/80 p-6 rounded-2xl flex flex-col justify-between h-32 hover:border-slate-700/50 transition duration-300 shadow-soft">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="text-xs font-semibold uppercase tracking-wider">
                    Acceptance Rate
                  </span>
                  <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
                    <Percent className="w-5 h-5" />
                  </div>
                </div>
                <h3 className="text-3xl font-extrabold text-white tracking-tight">
                  {acceptanceRate}%
                </h3>
              </div>
            </div>

            {/* Split layout Columns */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Left Column: Browse Projects */}
              <div className="lg:col-span-8 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-indigo-400" />
                    Recommended Projects
                  </h2>

                  {/* Search Bar */}
                  <div className="relative w-full sm:w-72">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500 pointer-events-none">
                      <Search className="w-4 h-4" />
                    </span>
                    <input
                      type="text"
                      placeholder="Search title or skill..."
                      className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-slate-900/60 border border-slate-800 text-white placeholder-slate-500 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>

                {filteredProjects.length === 0 ? (
                  <EmptyState
                    iconName="Search"
                    title="No Matching Projects"
                    description="No open projects match your search keywords. Try adjusting your filters or browse later."
                  />
                ) : (
                  <div className="grid gap-6">
                    {filteredProjects.map((project) => {
                      const isBid = myBids.some(
                        (bid) => bid.projectId === project.id,
                      );

                      return (
                        <ProjectCard
                          key={project.id}
                          title={project.title}
                          budget={project.budget}
                          skills={project.skills}
                          isBid={isBid}
                          deadline={project.deadline}
                          onBid={() => openBidModal(project)}
                          onViewDetails={() =>
                            navigate(`/freelancer/project/${project.id}`)
                          }
                        />
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Right Column: Side panels */}
              <div className="lg:col-span-4 space-y-8">
                {/* Quick actions panel */}
                <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-6 shadow-soft glass-panel space-y-4">
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-300">
                    Work Console
                  </h3>

                  <div className="grid gap-2">
                    <Link
                      to="/freelancer/my-bids"
                      className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:bg-indigo-600/10 hover:border-indigo-500/30 text-sm text-slate-300 hover:text-white transition duration-200 group"
                    >
                      <span>My Submitted Proposals</span>
                      <ArrowRight className="w-4.5 h-4.5 text-slate-500 group-hover:text-indigo-400 group-hover:translate-x-1 transition duration-200" />
                    </Link>

                    <Link
                      to="/freelancer/assigned-projects"
                      className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:bg-indigo-600/10 hover:border-indigo-500/30 text-sm text-slate-300 hover:text-white transition duration-200 group"
                    >
                      <span>Assigned Contracts</span>
                      <ArrowRight className="w-4.5 h-4.5 text-slate-500 group-hover:text-indigo-400 group-hover:translate-x-1 transition duration-200" />
                    </Link>
                  </div>
                </div>

                {/* Recent activity log */}
                <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-6 shadow-soft glass-panel space-y-5">
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                    <Activity className="w-4 h-4 text-indigo-400" />
                    My Activity Log
                  </h3>

                  {activityFeed.length === 0 ? (
                    <div className="text-center py-6 text-slate-500 text-xs font-light">
                      No bids submitted yet. Submit a proposal to populate your
                      feed log.
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {activityFeed.map((activity, idx) => (
                        <div
                          key={idx}
                          className="flex items-start gap-3 text-xs leading-relaxed"
                        >
                          <div
                            className={`p-1.5 rounded-lg shrink-0 ${activity.color}`}
                          >
                            <activity.icon className="w-3.5 h-3.5" />
                          </div>

                          <div className="flex-1 space-y-1">
                            <p className="text-slate-300 font-light">
                              {activity.text}
                            </p>
                            <div className="flex items-center text-[10px] text-slate-500 gap-1 font-light">
                              <Clock className="w-3 h-3" />
                              {activity.date.toLocaleDateString()} at{" "}
                              {activity.date.toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
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

      {/* Place Bid Modal */}
      {isModalOpen && selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl glass-panel relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 hover:bg-slate-800 rounded-lg transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1.5">
              <h3 className="text-xl font-bold text-white tracking-tight">
                Submit Bid Proposal
              </h3>
              <p className="text-xs text-slate-400 font-light">
                Applying for:{" "}
                <span className="font-semibold text-indigo-400">
                  {selectedProject.title}
                </span>{" "}
                (Client: {selectedProject.clientName})
              </p>
            </div>

            <form onSubmit={handlePlaceBidSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {/* Bid Amount input */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    Bid Amount (₹)
                  </label>
                  <input
                    type="number"
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-950/60 border border-slate-800 focus:border-indigo-500 text-sm text-white focus:ring-4 focus:ring-indigo-500/10 outline-none transition"
                    value={bidAmount}
                    onChange={(e) => setBidAmount(e.target.value)}
                  />
                </div>

                {/* Delivery Time input */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    Delivery Time (Days)
                  </label>
                  <input
                    type="number"
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-950/60 border border-slate-800 focus:border-indigo-500 text-sm text-white focus:ring-4 focus:ring-indigo-500/10 outline-none transition"
                    value={proposalDays}
                    onChange={(e) => setProposalDays(e.target.value)}
                  />
                </div>
              </div>

              {/* Proposal text input */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Cover Letter / Proposal
                </label>
                <textarea
                  rows="4"
                  placeholder="Explain why you are the best fit for this project, your approach, and relevant experience..."
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-950/60 border border-slate-800 focus:border-indigo-500 text-sm text-white focus:ring-4 focus:ring-indigo-500/10 outline-none transition resize-none"
                  value={proposalText}
                  onChange={(e) => setProposalText(e.target.value)}
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-xl border border-slate-700/50 transition text-sm active:scale-95"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingBid}
                  className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-500 text-white font-semibold rounded-xl shadow-lg transition text-sm active:scale-[0.98]"
                >
                  {submittingBid ? "Submitting..." : "Submit Proposal"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default FreelancerDashboard;
