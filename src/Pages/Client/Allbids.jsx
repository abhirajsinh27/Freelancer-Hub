import { use, useEffect, useState } from "react";
import { useAuth } from "../../Context/AuthContext";
import { listenBidsByClient } from "../../Services/bidService";
import Header from "../../Components/Header";
import { listenProjectsByClient } from "../../Services/projectService";



function Allbids() {
  const { user } = useAuth();
  const [bids, setBids] = useState([]);
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    if (!user) return;

    const unsubscribe = listenBidsByClient(user.uid, (data) => {
      setBids(data);
    });

    return () => unsubscribe();
  }, [user]);
  useEffect(() => {
    if(!user)return;

    const unssubscribeProjects = listenProjectsByClient(user.uid, (data) => {
      setProjects(data);
    });

    return () => unssubscribeProjects();
  }, [user]);




  // 🔥 GROUP BY PROJECT
  const groupedBids = bids.reduce((acc, bid) => {
    if (!acc[bid.projectId]) acc[bid.projectId] = [];
    acc[bid.projectId].push(bid);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-indigo-950 to-slate-900">
      <Header />

      <div className="max-w-6xl mx-auto px-8 py-12">
        <h2 className="text-3xl font-bold text-white mb-8">
          Bids Overview
        </h2>

        {bids.length === 0 ? (
          <p className="text-slate-400">No bids yet.</p>
        ) : (
          <div className="space-y-6">
            {Object.entries(groupedBids).map(([projectId, projectBids]) => (
              <div
                key={projectId}
                className="bg-white/5 border border-white/10 rounded-2xl p-6"
              >
                {/* HEADER */}
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg text-white font-semibold">
                    {projects.find((p) => p.id === projectId)?.title || "Untitled Project"}
                  </h3>

                  <span className="text-indigo-400 text-sm">
                    {projectBids.length} Bids
                  </span>
                </div>

                {/* BIDS LIST */}
                <div className="space-y-3">
                  {projectBids.map((bid) => (
                    <div
                      key={bid.id}
                      className="bg-white/5 p-4 rounded-xl border border-white/10 flex justify-between items-center"
                    >
                      <div>
                        <p className="text-white font-medium">
                          {bid.freelancerName || "Freelancer"}
                        </p>

                        <p className="text-slate-400 text-sm">
                          ₹{bid.bidAmount} • {bid.proposalTime} days
                        </p>
                      </div>

                      <span
                        className={`text-xs px-2 py-1 rounded ${
                          bid.status === "accepted"
                            ? "bg-green-500/20 text-green-400"
                            : bid.status === "rejected"
                            ? "bg-red-500/20 text-red-400"
                            : "bg-yellow-500/20 text-yellow-400"
                        }`}
                      >
                        {bid.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Allbids;
