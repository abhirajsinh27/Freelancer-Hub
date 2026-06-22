import React, { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { getProjectById } from "../../Services/projectService";
import { createBid, listenBidsByFreelancer } from "../../Services/bidService";
import Header from "../../Components/Header";
import { useAuth } from "../../Context/AuthContext";
import toast from "react-hot-toast";
import { 
  ArrowLeft, 
  Calendar, 
  DollarSign, 
  User, 
  Tag, 
  Send, 
  Briefcase, 
  ShieldAlert,
  Clock,
  CheckCircle2
} from "lucide-react";

function ProjectDetails() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [project, setProject] = useState(null);
  const [myBids, setMyBids] = useState([]);
  const [loading, setLoading] = useState(true);

  // Bid form state
  const [bidAmount, setBidAmount] = useState("");
  const [proposalDays, setProposalDays] = useState("7");
  const [proposalText, setProposalText] = useState("");
  const [submittingBid, setSubmittingBid] = useState(false);

  useEffect(() => {
    if (!projectId) return;

    let unsubBids = () => {};

    const loadData = async () => {
      try {
        setLoading(true);
        const data = await getProjectById(projectId);
        setProject(data);
        
        if (user) {
          unsubBids = listenBidsByFreelancer(user.uid, (bidsData) => {
            setMyBids(bidsData);
            setLoading(false);
          });
        } else {
          setLoading(false);
        }
      } catch (err) {
        console.error("Error loading project details:", err);
        setLoading(false);
      }
    };

    loadData();

    return () => unsubBids();
  }, [projectId, user]);

  const existingBid = myBids.find((b) => b.projectId === projectId);

  const handlePlaceBidSubmit = async (e) => {
    e.preventDefault();
    if (!bidAmount || isNaN(Number(bidAmount)) || Number(bidAmount) <= 0) {
      toast.error("Please enter a valid bid amount.");
      return;
    }
    if (!proposalDays || isNaN(Number(proposalDays)) || Number(proposalDays) <= 0) {
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
        projectId: project.id,
        freelancerId: user.uid,
        freelancerName: user.username,
        clientId: project.clientId,
        clientName: project.clientName || "Client",
        projecttitle: project.title,
        proposalTime: Number(proposalDays),
        bidAmount: Number(bidAmount),
        proposal: proposalText.trim(),
      });

      toast.success("Proposal submitted successfully!", { id: toastId });
    } catch (error) {
      console.error("Error placing bid:", error);
      toast.error("Failed to submit proposal. Please try again.", { id: toastId });
    } finally {
      setSubmittingBid(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
        <Header />
        <div className="flex flex-col items-center justify-center py-40 text-slate-400 text-sm font-light space-y-3">
          <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          <span>Loading project details...</span>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
        <Header />
        <div className="max-w-5xl mx-auto px-6 py-20 text-center space-y-6">
          <p className="text-xl text-slate-400 font-light">Project not found or was removed.</p>
          <button
            onClick={() => navigate(user?.role === "client" ? "/client/dashboard" : "/freelancer/dashboard")}
            className="inline-flex items-center justify-center px-6 py-3 bg-indigo-600 hover:bg-indigo-505 text-white font-semibold rounded-xl transition duration-200"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans pb-20">
      <Header />

      <main className="max-w-6xl mx-auto px-6 py-12 space-y-8 animate-fade-in">
        {/* Navigation & Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-900 pb-6">
          <div className="space-y-1">
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300 font-semibold uppercase tracking-wider transition"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Go Back
            </button>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">{project.title}</h1>
            <p className="text-xs text-slate-400 font-light mt-1">
              Posted by <span className="font-semibold text-slate-300">{project.clientName || "Client"}</span>
            </p>
          </div>

          <span
            className={`px-3 py-1.5 rounded-full text-xs font-semibold uppercase border tracking-wider self-start sm:self-center ${
              project.status === "completed"
                ? "bg-green-500/10 border-green-500/20 text-green-400"
                : project.status === "in-progress"
                ? "bg-indigo-500/10 border-indigo-500/20 text-indigo-400"
                : "bg-slate-900 border-slate-800 text-slate-300"
            }`}
          >
            Status: {project.status || "open"}
          </span>
        </div>

        {/* Info Grid Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Block: Brief details */}
          <div className="lg:col-span-7 bg-slate-900/40 border border-slate-800/80 p-6 sm:p-8 rounded-2xl shadow-soft glass-panel space-y-8">
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-white uppercase tracking-wider text-xs text-indigo-400">Project Description</h2>
              <p className="text-slate-300 leading-relaxed font-light whitespace-pre-line text-sm sm:text-base">
                {project.description || "No description details provided."}
              </p>
            </div>

            {/* Quick specifications stats cards */}
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="bg-slate-950/40 p-4 rounded-xl border border-slate-850">
                <span className="text-[10px] uppercase font-semibold text-slate-500 tracking-wider block">Target Budget</span>
                <span className="text-2xl font-bold text-white mt-1 block">₹{project.budget}</span>
              </div>
              <div className="bg-slate-950/40 p-4 rounded-xl border border-slate-850">
                <span className="text-[10px] uppercase font-semibold text-slate-500 tracking-wider block">Deadline Date</span>
                <span className="text-2xl font-bold text-white mt-1 block">{project.deadline || "N/A"}</span>
              </div>
            </div>

            {/* Required skills */}
            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Tag className="w-4 h-4 text-indigo-400" /> Required Skills stack
              </h4>
              <div className="flex flex-wrap gap-2">
                {project.skills && project.skills.length > 0 ? (
                  project.skills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-3.5 py-1.5 bg-slate-800 text-slate-300 text-xs font-semibold rounded-full border border-slate-750"
                    >
                      {skill}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-slate-500 font-light italic">No tags specified.</span>
                )}
              </div>
            </div>
          </div>

          {/* Right Block: Bid Proposals / Forms */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Project snapshots details */}
            <div className="bg-slate-900/40 border border-slate-800/80 p-6 rounded-2xl shadow-soft glass-panel space-y-4">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-300">Project Snapshot</h3>
              
              <dl className="space-y-3.5 text-xs font-light text-slate-300">
                <div className="flex items-center justify-between py-2 border-b border-slate-850">
                  <dt className="text-slate-500">Client Owner</dt>
                  <dd className="font-semibold text-slate-200">{project.clientName || "Unknown"}</dd>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-slate-850">
                  <dt className="text-slate-500">Bidding Status</dt>
                  <dd className="font-semibold text-indigo-400 capitalize">{project.status || "open"}</dd>
                </div>
                {project.assignedFreelancerName && (
                  <div className="flex items-center justify-between py-2 border-b border-slate-850">
                    <dt className="text-slate-500">Contractor</dt>
                    <dd className="font-semibold text-green-400">{project.assignedFreelancerName}</dd>
                  </div>
                )}
              </dl>
            </div>

            {/* If Freelancer: Bid details or bid form */}
            {user?.role === "freelancer" && (
              <>
                {existingBid ? (
                  /* Proposal submitted info card */
                  <div className="bg-slate-900/40 border border-indigo-500/20 p-6 rounded-2xl shadow-soft glass-panel space-y-5 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 blur-[50px] rounded-full pointer-events-none"></div>

                    <div className="space-y-1">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-xl text-[10px] font-bold uppercase tracking-wider">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Proposal Submitted
                      </span>
                      <h3 className="text-sm font-bold text-white pt-2">Your Bid Proposal Details</h3>
                    </div>

                    <div className="space-y-3 text-xs font-light">
                      <div className="bg-slate-950/40 p-4 rounded-xl border border-slate-850 text-slate-300 leading-relaxed whitespace-pre-line font-light">
                        {existingBid.proposal}
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-slate-950/40 p-3 rounded-lg border border-slate-850">
                          <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Your Bid</span>
                          <span className="text-sm font-semibold text-indigo-400 mt-1 block">₹{existingBid.bidAmount}</span>
                        </div>
                        <div className="bg-slate-950/40 p-3 rounded-lg border border-slate-850">
                          <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Delivery Days</span>
                          <span className="text-sm font-semibold text-indigo-400 mt-1 block">{existingBid.proposalTime} days</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 font-light border-t border-slate-850">
                        <span>Current bid status:</span>
                        <span className={`font-semibold capitalize text-xs ${
                          existingBid.status === "accepted" ? "text-green-400" : existingBid.status === "rejected" ? "text-red-400" : "text-yellow-400"
                        }`}>{existingBid.status}</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Bid Form */
                  <>
                    {project.status !== "open" ? (
                      <div className="bg-slate-900/40 border border-slate-850 p-6 rounded-2xl shadow-soft glass-panel text-center py-8 space-y-3">
                        <ShieldAlert className="w-8 h-8 text-rose-500 mx-auto" />
                        <h4 className="text-sm font-bold text-white">Project Closed</h4>
                        <p className="text-xs text-slate-400 font-light">
                          This project is currently active or completed. Bidding is disabled.
                        </p>
                      </div>
                    ) : (
                      <div className="bg-slate-900/40 border border-slate-800/80 p-6 rounded-2xl shadow-soft glass-panel space-y-5">
                        <h3 className="text-sm font-bold text-white uppercase tracking-wider text-xs text-indigo-400">Place Proposal Bid</h3>
                        
                        <form onSubmit={handlePlaceBidSubmit} className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            {/* Bid Amount input */}
                            <div className="space-y-1">
                              <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Bid Amount (₹)</label>
                              <div className="relative">
                                <span className="absolute inset-y-0 left-0 pl-2.5 flex items-center text-slate-600 pointer-events-none text-xs">
                                  ₹
                                </span>
                                <input
                                  type="number"
                                  placeholder={project.budget}
                                  className="w-full pl-6 pr-3 py-2 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition"
                                  value={bidAmount}
                                  onChange={(e) => setBidAmount(e.target.value)}
                                />
                              </div>
                            </div>

                            {/* Delivery Days input */}
                            <div className="space-y-1">
                              <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Delivery (Days)</label>
                              <div className="relative">
                                <span className="absolute inset-y-0 left-0 pl-2.5 flex items-center text-slate-600 pointer-events-none">
                                  <Clock className="w-3.5 h-3.5 text-slate-500/50" />
                                </span>
                                <input
                                  type="number"
                                  placeholder="7"
                                  className="w-full pl-8 pr-3 py-2 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition"
                                  value={proposalDays}
                                  onChange={(e) => setProposalDays(e.target.value)}
                                />
                              </div>
                            </div>
                          </div>

                          {/* Proposal Text input */}
                          <div className="space-y-1">
                            <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Proposal details</label>
                            <textarea
                              rows="4"
                              placeholder="Write a clear brief proposal pitch..."
                              className="w-full px-3 py-2 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition resize-none"
                              value={proposalText}
                              onChange={(e) => setProposalText(e.target.value)}
                            />
                          </div>

                          <button
                            type="submit"
                            disabled={submittingBid}
                            className="w-full py-3 bg-indigo-600 hover:bg-indigo-505 disabled:bg-slate-800 disabled:text-slate-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-indigo-600/20 active:scale-[0.98] transition-all flex items-center justify-center gap-1.5 text-xs"
                          >
                            <Send className="w-3.5 h-3.5" /> Submit Bid Proposal
                          </button>
                        </form>
                      </div>
                    )}
                  </>
                )}
              </>
            )}

            {/* If Client, link to project bids */}
            {user?.role === "client" && user.uid === project.clientId && (
              <div className="bg-slate-900/40 border border-slate-850 p-6 rounded-2xl shadow-soft glass-panel space-y-4">
                <h4 className="text-sm font-bold text-white">Manage Project Proposals</h4>
                <p className="text-xs text-slate-400 font-light leading-relaxed">
                  Review the bids submitted by freelancers for this project, accept the winning proposal, and kickstart development.
                </p>
                <Link
                  to={`/client/project/${project.id}/bids`}
                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl shadow-lg text-xs flex items-center justify-center gap-1.5 transition active:scale-95"
                >
                  <Briefcase className="w-4 h-4" /> View Bids / Award Contract
                </Link>
              </div>
            )}
          </div>

        </div>
      </main>
    </div>
  );
}

export default ProjectDetails;