import React from "react";
import { useAuth } from "../Context/AuthContext";
import { Calendar, DollarSign, MessageSquare, Clock, ArrowRight } from "lucide-react";

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
  proposalCount = 0,
  status = "open",
  createdAt,
}) {
  if (!title && !budget && !skills) return null;

  const { user } = useAuth();

  // Date formatter
  const getFormattedDate = () => {
    if (!createdAt) return "Just now";
    try {
      const dateObj = createdAt.toDate ? createdAt.toDate() : new Date(createdAt);
      return dateObj.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
    } catch (e) {
      return "Recently";
    }
  };

  return (
    <div className="group bg-slate-900/40 border border-slate-800/80 hover:border-indigo-500/30 rounded-2xl p-6 shadow-soft hover:shadow-glow-primary hover:-translate-y-0.5 transition-all duration-300 glass-panel">
      {/* Top row */}
      <div className="flex justify-between items-start gap-4 mb-3.5">
        <h3 className="text-lg font-bold text-white group-hover:text-indigo-400 transition leading-snug tracking-tight">
          {title || "Untitled Project"}
        </h3>
        <span className="shrink-0 bg-indigo-500/10 border border-indigo-500/10 text-indigo-400 px-3.5 py-1.5 rounded-full text-xs font-semibold shadow-glow-primary">
          ₹ {budget || "Not specified"}
        </span>
      </div>

      {/* Skills list tags */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        {skills && skills.length > 0 ? (
          skills.map((skill, index) => (
            <span
              key={index}
              className="bg-slate-800 text-slate-300 text-[10px] font-semibold px-2.5 py-1 rounded-full"
            >
              {skill}
            </span>
          ))
        ) : (
          <span className="text-slate-500 text-xs font-light italic">No skills listed</span>
        )}
      </div>

      {/* Meta Specifications details (Date, proposal count, deadline) */}
      <div className="grid grid-cols-2 sm:flex sm:items-center gap-x-6 gap-y-2 text-xs font-light text-slate-400 border-t border-slate-850 pt-4 mt-4">
        <span className="flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-slate-500" />
          <span>Posted: {getFormattedDate()}</span>
        </span>
        
        <span className="flex items-center gap-1.5">
          <MessageSquare className="w-3.5 h-3.5 text-slate-500" />
          <span>{proposalCount} {proposalCount === 1 ? "proposal" : "proposals"}</span>
        </span>

        {deadline && (
          <span className="flex items-center gap-1.5 col-span-2 sm:col-span-1">
            <Calendar className="w-3.5 h-3.5 text-rose-500/60" />
            <span className="text-slate-300">Deadline: {deadline}</span>
          </span>
        )}

        <span
          className={`px-2 py-0.5 rounded text-[9px] uppercase font-bold tracking-wider ml-auto hidden sm:inline-block border ${
            status === "completed"
              ? "bg-green-500/10 border-green-500/20 text-green-400"
              : status === "in-progress"
              ? "bg-indigo-500/10 border-indigo-500/20 text-indigo-400"
              : "bg-slate-900 border-slate-800 text-slate-400"
          }`}
        >
          {status}
        </span>
      </div>

      {/* Divider */}
      <div className="border-t border-slate-850 my-4"></div>

      {/* Dynamic CTA Control Buttons */}
      <div className="flex justify-between items-center">
        {/* Mobile status indicator */}
        <span
          className={`px-2 py-0.5 rounded text-[9px] uppercase font-bold tracking-wider sm:hidden border ${
            status === "completed"
              ? "bg-green-500/10 border-green-500/20 text-green-400"
              : status === "in-progress"
              ? "bg-indigo-500/10 border-indigo-500/20 text-indigo-400"
              : "bg-slate-900 border-slate-800 text-slate-400"
          }`}
        >
          {status}
        </span>

        <div className="flex justify-end gap-3 w-full">
          {/* FREELANCER ACTIONS */}
          {user?.role === "freelancer" && (
            <>
              {onViewDetails && (
                <button
                  onClick={onViewDetails}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 active:scale-95 text-xs font-semibold rounded-xl text-slate-300 hover:text-white border border-slate-750 transition"
                >
                  View Details
                </button>
              )}
              {status === "open" && onBid && (
                <button
                  disabled={isBid}
                  onClick={onBid}
                  className={`px-4.5 py-2 text-xs font-bold rounded-xl shadow-md transition active:scale-[0.97] flex items-center gap-1 ${
                    isBid
                      ? "bg-slate-800/80 border border-slate-800 text-slate-500 cursor-not-allowed"
                      : "bg-indigo-600 hover:bg-indigo-500 text-white"
                  }`}
                >
                  {isBid ? "Bid Placed" : <>Apply Now <ArrowRight className="w-3.5 h-3.5" /></>}
                </button>
              )}
            </>
          )}

          {/* CLIENT ACTIONS */}
          {user?.role === "client" && onViewBids && (
            <button
              disabled={!hasBids}
              onClick={onViewBids}
              className={`px-4.5 py-2 text-xs font-bold rounded-xl shadow-md transition active:scale-[0.97] ${
                hasBids
                  ? "bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg hover:shadow-indigo-600/15"
                  : "bg-slate-805 text-slate-500 border border-slate-850 cursor-not-allowed"
              }`}
            >
              {hasBids ? `View Proposals (${proposalCount})` : "No Proposals Yet"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProjectCard;
