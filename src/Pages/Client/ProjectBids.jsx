import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  listenBidsByProject,
  updateBidStatus,
} from "../../Services/bidService";
import { updateProjectStatus } from "../../Services/projectService";
import { useAuth } from "../../Context/AuthContext";
import Header from "../../Components/Header";

function ProjectBids() {
  const { projectId } = useParams();
  const { user } = useAuth();
  const [bids, setBids] = useState([]);
  const acceptedBid = bids.find((b) => b.status === "accepted");

  useEffect(() => {
    if (!projectId) return;

    const unsubscribe = listenBidsByProject(projectId, (bidsData) => {
      setBids(bidsData);
    });

    return () => unsubscribe();
  }, [projectId]);

  const handleAccept = async (selectedBid) => {
    try {
      // Accept selected bid
      await updateBidStatus(selectedBid.id, "accepted");

      // Reject all other bids
      const otherBids = bids.filter((b) => b.id !== selectedBid.id);
      for (const bid of otherBids) {
        await updateBidStatus(bid.id, "rejected");
      }
      // Update project status
      await updateProjectStatus(projectId, {
        status: "in-progress",
        assignedFreelancerId: selectedBid.freelancerId,
        progress: "",
        submission: "",
      });
    } catch (error) {
      console.error("Accept error:", error);
    }
  };

  const handleReject = async (bid) => {
    await updateBidStatus(bid.id, "rejected");
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-indigo-950 to-slate-900">
      <Header />

      <div className="max-w-5xl mx-auto px-8 py-12">
        <h2 className="text-3xl font-bold text-white mb-8">Freelancer Bids</h2>

        {bids.length === 0 ? (
          <p className="text-slate-400">No bids yet.</p>
        ) : (
          <div className="space-y-6">
            {bids.map((bid) => (
              <div
                key={bid.id}
                className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6"
              >
                <p className="text-white">Freelancer: {bid.freelancerName}</p>

                <p className="text-slate-300">
                  Proposal Time: {bid.proposalTime} days
                </p>

                <p className="text-indigo-400">Bid Amount: ₹{bid.bidAmount}</p>
                {acceptedBid && (
                  <div className="mb-6 p-4 bg-green-900 rounded-lg">
                    Assigned Freelancer: {acceptedBid.freelancerName}
                  </div>
                )}

                {bid.status === "pending" && (
                  <div className="flex gap-4 mt-4">
                    <button
                      onClick={() => handleAccept(bid)}
                      className="bg-green-500 px-5 py-2 rounded-lg text-white"
                    >
                      Accept
                    </button>

                    <button
                      onClick={() => handleReject(bid)}
                      className="bg-red-500 px-5 py-2 rounded-lg text-white"
                    >
                      Reject
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ProjectBids;
