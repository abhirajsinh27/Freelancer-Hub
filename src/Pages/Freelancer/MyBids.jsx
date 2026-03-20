import { useAuth } from "../../Context/AuthContext";
import { listenBidsByFreelancer } from "../../Services/bidService";
import { useState,useEffect } from "react";
import Header from "../../Components/Header";

function MyBids() {
  const { user } = useAuth();
  const [bids, setBids] = useState([]);

   useEffect(() => {
    if (!user) return;

    const unsubscribe = listenBidsByFreelancer(user.uid, (bidsData) => {
      setBids(bidsData);
    });

    return () => unsubscribe();
},[user]);


    return (
    <div className="min-h-screen bg-slate-900 text-white">
      <Header />

      <div className="max-w-5xl mx-auto p-8">
        <h2 className="text-3xl font-bold mb-8">My Bids</h2>

        {bids.length === 0 ? (
          <p>No bids placed yet.</p>
        ) : (
          <div className="space-y-6">
            {bids.map((bid) => (
              <div
                key={bid.id}
                className="bg-white/5 p-6 rounded-xl border border-white/10"
              >
                <p>Client: {bid.clientName}</p>
                <p>Bid Amount: ₹{bid.bidAmount}</p>
                <p>Proposal Time: {bid.proposalTime} days</p>

                <p className="mt-2 font-semibold">
                  Status:{" "}
                  <span
                    className={
                      bid.status === "accepted"
                        ? "text-green-400"
                        : bid.status === "rejected"
                        ? "text-red-400"
                        : "text-yellow-400"
                    }
                  >
                    {bid.status}
                  </span>
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MyBids;

