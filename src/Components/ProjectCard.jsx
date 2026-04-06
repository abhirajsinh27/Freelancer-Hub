import { useAuth } from "../Context/AuthContext";

function ProjectCard({
  title,
  budget,
  skills,
  isBid = false,
  hasBids = false,
  onBid,
  onViewBids,
  onViewDetails,
  deadline,
  proposalTime,
}) {
  if (!title && !budget && !skills) return null;

  const { user } = useAuth();

  return (
    <div className="group bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-lg hover:shadow-indigo-500/20 hover:-translate-y-1 transition-all duration-300">
      {/* ================= TOP SECTION ================= */}
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-semibold text-white group-hover:text-indigo-400 transition">
          {title || "Untitled Project"}
        </h3>

        <span className="bg-indigo-500/20 text-indigo-300 px-4 py-1 rounded-full text-sm font-medium">
          ₹{budget || "Not specified"}
        </span>
      </div>

      {/* ================= SKILLS ================= */}
      <div className="flex flex-wrap gap-2 mb-4">
        {skills && skills.length > 0 ? (
          skills.map((skill, index) => (
            <span
              key={index}
              className="bg-slate-700 text-slate-300 text-xs px-3 py-1 rounded-full"
            >
              {skill}
            </span>
          ))
        ) : (
          <span className="text-slate-400 text-sm">No skills specified</span>
        )}
      </div>

      {/* ================= DEADLINE ================= */}
      <div className="text-sm mb-2">
        <span className="text-rose-400 font-medium">Deadline:</span>{" "}
        <span className="text-slate-300">{deadline || "Not specified"}</span>
      </div>

      {/* ================= PROPOSAL TIME ================= */}
      {user?.role === "freelancer" && isBid && proposalTime && (
        <div className="text-sm text-indigo-400 mb-2">
          Your Proposal Time: {proposalTime} days
        </div>
      )}

      {/* ================= DIVIDER ================= */}
      <div className="border-t border-white/10 my-4"></div>

      {/* ================= ACTION SECTION ================= */}
      <div className="flex justify-end">
        {/* FREELANCER VIEW */}
        {user?.role === "freelancer" && (
          <>
          <button
            onClick={onViewDetails}
            className="bg-linear-to-r from-slate-600 to-slate-700 text-white px-6 py-2 rounded-xl shadow-md hover:scale-105 hover:shadow-slate-500/40 transition duration-200 mr-4" > View Details </button> 
          <button
            disabled={isBid}
            onClick={onBid}
            className={
              isBid
                ? "bg-slate-600 text-slate-300 px-6 py-2 rounded-xl cursor-not-allowed"
                : "bg-linear-to-r from-indigo-500 to-indigo-600 text-white px-6 py-2 rounded-xl shadow-md hover:scale-105 hover:shadow-indigo-500/40 transition duration-200"
            }
          >
            {isBid ? "Bid Placed" : "Place Bid"}
          </button>
        </>
      )}

        {/* CLIENT VIEW */}
        {user?.role === "client" && (
          <button
            disabled={!hasBids}
            onClick={onViewBids}
            className={
              hasBids
                ? "bg-linear-to-r from-emerald-500 to-green-600 text-white px-6 py-2 rounded-xl shadow-md hover:scale-105 hover:shadow-green-500/40 transition duration-200"
                : "bg-slate-600 text-slate-300 px-6 py-2 rounded-xl cursor-not-allowed"
            }
          >
            {hasBids ? "View Bids" : "No Bids Yet"}
          </button>
        )}
      </div>
    </div>
  );
}

export default ProjectCard;
