import React, { useState, useEffect } from "react";
import { useAuth } from "../../Context/AuthContext";
import { listenBidsByFreelancer } from "../../Services/bidService";
import Header from "../../Components/Header";
import EmptyState from "../../Components/EmptyState";
import { Briefcase, Send, DollarSign, Calendar, Info } from "lucide-react";
import { useNavigate } from "react-router-dom";

function MyBids() {
  const { user } = useAuth();
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    const unsubscribe = listenBidsByFreelancer(user.uid, (bidsData) => {
      setBids(bidsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans pb-20">
      <Header />

      <main className="max-w-5xl mx-auto px-6 py-12 space-y-8 animate-fade-in">
        {/* Page Header */}
        <div className="border-b border-slate-900 pb-6">
          <h1 className="text-3xl font-extrabold text-white">My Submitted Proposals</h1>
          <p className="text-slate-400 text-sm font-light mt-1">
            Track the status of all proposals you have submitted for open projects.
          </p>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 text-slate-400 text-sm font-light space-y-3">
            <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
            <span>Loading submitted proposals...</span>
          </div>
        ) : (
          <>
            {bids.length === 0 ? (
              <EmptyState
                iconName="Send"
                title="No Proposals Placed"
                description="You haven't submitted any bids for open projects yet. Browse available projects and pitch your proposal!"
                actionText="Browse Projects"
                actionLink="/freelancer/dashboard"
              />
            ) : (
              <div className="grid gap-6">
                {bids.map((bid) => {
                  const isAccepted = bid.status === "accepted";
                  const isRejected = bid.status === "rejected";
                  const isPending = bid.status === "pending";
                  const bidDate = bid.createdAt?.toDate ? bid.createdAt.toDate() : new Date(bid.createdAt || Date.now());

                  return (
                    <div
                      key={bid.id}
                      className={`bg-slate-900/40 border p-5 rounded-2xl shadow-soft glass-panel flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition-all duration-300 ${
                        isAccepted 
                          ? "border-green-500/20" 
                          : isRejected 
                          ? "border-slate-900 opacity-60" 
                          : "border-slate-805"
                      }`}
                    >
                      {/* Bid Info */}
                      <div className="space-y-3 flex-1">
                        <div className="space-y-1">
                          <h3 className="text-base font-bold text-white flex items-center gap-2">
                            <Briefcase className="w-4.5 h-4.5 text-indigo-400" />
                            {bid.projecttitle || "Untitled Project"}
                          </h3>
                          <p className="text-xs text-slate-400 font-light">
                            Client: <span className="font-semibold text-slate-300">{bid.clientName || "Client"}</span>
                          </p>
                        </div>

                        {/* Proposal snippet */}
                        {bid.proposal && (
                          <p className="text-xs text-slate-400 bg-slate-950/40 px-3 py-2 rounded-lg border border-slate-850 max-w-xl font-light line-clamp-2">
                            {bid.proposal}
                          </p>
                        )}

                        {/* Metrics row */}
                        <div className="flex flex-wrap items-center gap-x-5 gap-y-1 text-xs font-light text-slate-400">
                          <span className="flex items-center gap-1 text-indigo-400 font-semibold">
                            <DollarSign className="w-3.5 h-3.5" /> Bid: ₹{bid.bidAmount}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5 text-slate-500" /> Time: {bid.proposalTime} days
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5 text-slate-500" /> Date: {bidDate.toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      {/* Status badge */}
                      <div className="shrink-0 flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
                        <button
                          onClick={() => navigate(`/freelancer/project/${bid.projectId}`)}
                          className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs font-semibold rounded-lg text-slate-300 hover:text-white border border-slate-750 transition flex items-center gap-1"
                        >
                          <Info className="w-3.5 h-3.5" /> Details
                        </button>
                        
                        <span
                          className={`text-[10px] font-bold px-3 py-2 rounded-xl border uppercase tracking-wider ${
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

export default MyBids;
