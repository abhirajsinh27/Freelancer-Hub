import { useParams, useNavigate, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  listenBidsByProject,
  updateBidStatus,
} from "../../Services/bidService";
import { updateProjectStatus, getProjectById } from "../../Services/projectService";
import { useAuth } from "../../Context/AuthContext";
import Header from "../../Components/Header";
import toast from "react-hot-toast";
import EmptyState from "../../Components/EmptyState";
import { 
  User, 
  DollarSign, 
  Calendar, 
  Check, 
  X, 
  ArrowLeft, 
  Briefcase, 
  MessageSquare,
  ShieldAlert
} from "lucide-react";

function ProjectBids() {
  const { projectId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [bids, setBids] = useState([]);
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!projectId) return;

    let unsubBids = () => {};

    const loadData = async () => {
      try {
        setLoading(true);
        
        // Fetch project metadata
        const projData = await getProjectById(projectId);
        setProject(projData);

        // Listen to bids
        unsubBids = listenBidsByProject(projectId, (bidsData) => {
          setBids(bidsData);
          setLoading(false);
        });
      } catch (err) {
        console.error("Error loading bids:", err);
        setLoading(false);
      }
    };

    loadData();

    return () => unsubBids();
  }, [projectId]);

  const acceptedBid = bids.find((b) => b.status === "accepted");

  const handleAccept = async (selectedBid) => {
    const toastId = toast.loading(`Assigning ${selectedBid.freelancerName || "freelancer"}...`);
    try {
      // 1. Accept selected bid
      await updateBidStatus(selectedBid.id, "accepted");

      // 2. Reject all other bids
      const otherBids = bids.filter((b) => b.id !== selectedBid.id);
      for (const bid of otherBids) {
        await updateBidStatus(bid.id, "rejected");
      }

      // 3. Update project status and assign freelancer name + ID
      await updateProjectStatus(projectId, {
        status: "in-progress",
        assignedFreelancerId: selectedBid.freelancerId,
        assignedFreelancerName: selectedBid.freelancerName || "Freelancer",
        progress: "Project started",
        submission: "",
      });

      toast.success("Contract awarded! Project status is now In-Progress.", { id: toastId });
    } catch (error) {
      console.error("Accept bid error:", error);
      toast.error("Failed to assign project. Please try again.", { id: toastId });
    }
  };

  const handleReject = async (bid) => {
    const toastId = toast.loading("Rejecting proposal...");
    try {
      await updateBidStatus(bid.id, "rejected");
      toast.success("Proposal rejected.", { id: toastId });
    } catch (error) {
      console.error("Reject bid error:", error);
      toast.error("Failed to reject bid.", { id: toastId });
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans pb-20">
      <Header />

      <main className="max-w-5xl mx-auto px-6 py-12 space-y-8 animate-fade-in">
        {/* Navigation / Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-900 pb-6">
          <div className="space-y-1">
            <button
              onClick={() => navigate("/client/dashboard")}
              className="inline-flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300 font-semibold uppercase tracking-wider transition"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Dashboard
            </button>
            <h1 className="text-3xl font-extrabold text-white">Freelancer Proposals</h1>
            {project && (
              <p className="text-slate-400 text-sm font-light mt-1">
                Proposals for <span className="font-semibold text-indigo-400">{project.title}</span> (Budget: ₹{project.budget})
              </p>
            )}
          </div>

          {acceptedBid && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-500/10 border border-green-500/20 text-green-400 rounded-full text-xs font-semibold uppercase">
              <Check className="w-3.5 h-3.5" /> Assigned
            </span>
          )}
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 text-slate-400 text-sm font-light space-y-3">
            <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
            <span>Loading proposals...</span>
          </div>
        ) : (
          <>
            {/* If assigned banner */}
            {acceptedBid && (
              <div className="bg-emerald-500/10 border border-emerald-500/20 p-5 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-white">Project Awarded</h4>
                  <p className="text-xs text-slate-400 font-light">
                    Contract has been assigned to <span className="font-semibold text-slate-200">{acceptedBid.freelancerName}</span> for ₹{acceptedBid.bidAmount}.
                  </p>
                </div>
                <Link
                  to="/client/Track-Projects"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white text-xs font-bold rounded-xl transition duration-150 shadow-md"
                >
                  Track Project Progress
                </Link>
              </div>
            )}

            {/* Bids List */}
            {bids.length === 0 ? (
              <EmptyState
                iconName="MessageSquare"
                title="No Proposals Yet"
                description="Freelancers haven't submitted bids for this project yet. Open bids will appear here in real-time."
                actionText="Back to Console"
                actionLink="/client/dashboard"
              />
            ) : (
              <div className="grid gap-6">
                {bids.map((bid) => {
                  const isAccepted = bid.status === "accepted";
                  const isRejected = bid.status === "rejected";
                  const isPending = bid.status === "pending";

                  return (
                    <div
                      key={bid.id}
                      className={`bg-slate-900/40 border p-6 rounded-2xl shadow-soft glass-panel relative overflow-hidden transition-all duration-300 ${
                        isAccepted 
                          ? "border-emerald-500/30 ring-2 ring-emerald-500/10" 
                          : isRejected 
                          ? "border-slate-900 opacity-60" 
                          : "border-slate-800/80 hover:border-slate-700/50"
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                        {/* Bid details */}
                        <div className="space-y-4 flex-1">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center font-bold text-indigo-400 border border-slate-700/50 text-sm">
                              {bid.freelancerName?.charAt(0).toUpperCase() || "F"}
                            </div>
                            <div>
                              <h4 className="font-bold text-white text-base">{bid.freelancerName || "Anonymous Freelancer"}</h4>
                              <p className="text-slate-500 text-xs font-light">Submitted proposal details below</p>
                            </div>
                          </div>

                          {/* Proposal statement */}
                          <div className="bg-slate-950/40 p-4 rounded-xl border border-slate-800/80">
                            <p className="text-sm text-slate-300 font-light leading-relaxed whitespace-pre-line">
                              {bid.proposal || `Hi! I would love to build this project for you. I have experience in the required stacks and can deliver within the requested timeline.`}
                            </p>
                          </div>

                          {/* Metadata row */}
                          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-slate-400 font-light pt-1">
                            <span className="flex items-center gap-1.5 text-indigo-400 font-semibold">
                              <DollarSign className="w-4 h-4" /> Bid: ₹{bid.bidAmount}
                            </span>
                            <span className="flex items-center gap-1.5">
                              <Calendar className="w-4 h-4 text-slate-500" /> Delivery: {bid.proposalTime} days
                            </span>
                          </div>
                        </div>

                        {/* Actions / Status Badges */}
                        <div className="shrink-0 flex sm:flex-col items-end gap-3 w-full sm:w-auto pt-2 sm:pt-0">
                          {isPending && !acceptedBid && (
                            <div className="flex gap-2 w-full sm:w-auto">
                              <button
                                onClick={() => handleAccept(bid)}
                                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-4.5 py-2.5 bg-green-600 hover:bg-green-500 active:scale-95 text-white text-xs font-bold rounded-xl shadow-md transition duration-150"
                              >
                                <Check className="w-4 h-4" /> Accept
                              </button>
                              <button
                                onClick={() => handleReject(bid)}
                                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-4.5 py-2.5 bg-slate-800 hover:bg-red-500 hover:text-white border border-slate-700/50 active:scale-95 text-slate-300 text-xs font-bold rounded-xl transition duration-150"
                              >
                                <X className="w-4 h-4" /> Reject
                              </button>
                            </div>
                          )}

                          {!isPending && (
                            <span
                              className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase border tracking-wider ${
                                isAccepted
                                  ? "bg-green-500/10 border-green-500/20 text-green-400"
                                  : "bg-red-500/10 border-red-500/20 text-red-400"
                              }`}
                            >
                              {bid.status}
                            </span>
                          )}

                          {acceptedBid && isPending && (
                            <span className="text-[10px] text-slate-600 italic font-light flex items-center gap-1">
                              <ShieldAlert className="w-3.5 h-3.5" /> Another proposal accepted
                            </span>
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

export default ProjectBids;
