import React, { useEffect, useState } from "react";
import { useAuth } from "../../Context/AuthContext";
import { listenBidsByClient } from "../../Services/bidService";
import Header from "../../Components/Header";
import { listenProjectsByClient } from "../../Services/projectService";
import EmptyState from "../../Components/EmptyState";
import { Briefcase, MessageSquare, User, DollarSign, Calendar, Info } from "lucide-react";
import { Link } from "react-router-dom";

function Allbids() {
  const { user } = useAuth();
  const [bids, setBids] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    setLoading(true);

    const unsubscribeBids = listenBidsByClient(user.uid, (data) => {
      setBids(data);
    });

    const unsubscribeProjects = listenProjectsByClient(user.uid, (data) => {
      setProjects(data);
      setLoading(false);
    });

    return () => {
      unsubscribeBids();
      unsubscribeProjects();
    };
  }, [user]);

  // Group bids by project ID
  const groupedBids = bids.reduce((acc, bid) => {
    if (!acc[bid.projectId]) acc[bid.projectId] = [];
    acc[bid.projectId].push(bid);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans pb-20">
      <Header />

      <main className="max-w-6xl mx-auto px-6 py-12 space-y-8 animate-fade-in">
        {/* Page Header */}
        <div className="border-b border-slate-900 pb-6">
          <h1 className="text-3xl font-extrabold text-white">All Proposals Overview</h1>
          <p className="text-slate-400 text-sm font-light mt-1">
            Browse all proposals submitted by freelancers across your posted projects.
          </p>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 text-slate-400 text-sm font-light space-y-3">
            <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
            <span>Loading proposals overview...</span>
          </div>
        ) : (
          <>
            {bids.length === 0 ? (
              <EmptyState
                iconName="MessageSquare"
                title="No Proposals Yet"
                description="Freelancers haven't submitted bids for your projects. Active bids will show up here."
                actionText="Back to Dashboard"
                actionLink="/client/dashboard"
              />
            ) : (
              <div className="space-y-8">
                {Object.entries(groupedBids).map(([projectId, projectBids]) => {
                  const projectMeta = projects.find((p) => p.id === projectId);
                  const projectTitle = projectMeta?.title || "Untitled Project";
                  const projectBudget = projectMeta?.budget;

                  return (
                    <div
                      key={projectId}
                      className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 shadow-soft glass-panel space-y-6"
                    >
                      {/* Project Header banner */}
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-850">
                        <div className="space-y-1">
                          <h3 className="text-lg font-bold text-white flex items-center gap-2">
                            <Briefcase className="w-5 h-5 text-indigo-400" />
                            {projectTitle}
                          </h3>
                          {projectBudget && (
                            <p className="text-xs text-slate-400">Project Budget: ₹{projectBudget}</p>
                          )}
                        </div>

                        <Link
                          to={`/client/project/${projectId}/bids`}
                          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-750 text-xs font-semibold rounded-xl text-white transition flex items-center gap-1 shrink-0"
                        >
                          <Info className="w-3.5 h-3.5" /> Manage Bids
                        </Link>
                      </div>

                      {/* Project Bids List */}
                      <div className="grid gap-4">
                        {projectBids.map((bid) => {
                          const isAccepted = bid.status === "accepted";
                          const isRejected = bid.status === "rejected";
                          const isPending = bid.status === "pending";

                          return (
                            <div
                              key={bid.id}
                              className="bg-slate-950/40 p-4 rounded-xl border border-slate-850 hover:border-slate-800 transition flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
                            >
                              {/* Bidder name & metadata */}
                              <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                  <div className="w-6.5 h-6.5 rounded-full bg-slate-800 flex items-center justify-center text-[10px] font-bold text-indigo-400 border border-slate-700/50">
                                    {bid.freelancerName?.charAt(0).toUpperCase() || "F"}
                                  </div>
                                  <span className="text-sm font-semibold text-slate-200">
                                    {bid.freelancerName || "Freelancer"}
                                  </span>
                                </div>
                                <div className="flex items-center gap-4 text-xs text-slate-400 font-light">
                                  <span className="flex items-center gap-1 text-indigo-400/90 font-medium">
                                    <DollarSign className="w-3.5 h-3.5" /> ₹{bid.bidAmount}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <Calendar className="w-3.5 h-3.5 text-slate-500" /> {bid.proposalTime} days
                                  </span>
                                </div>
                              </div>

                              {/* Status Badge */}
                              <span
                                className={`text-[10px] font-bold px-2.5 py-1.5 rounded-xl border uppercase tracking-wider ${
                                  isAccepted
                                    ? "bg-green-500/10 border-green-500/20 text-green-400"
                                    : isRejected
                                    ? "bg-red-500/10 border-red-500/20 text-red-400"
                                    : "bg-yellow-500/10 border-yellow-500/20 text-yellow-400"
                                }`}
                              >
                                {bid.status}
                              </span>
                            </div>
                          );
                        })}
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

export default Allbids;
