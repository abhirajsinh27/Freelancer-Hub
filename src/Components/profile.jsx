import React, { useState, useEffect } from "react";
import { useAuth } from "../Context/AuthContext";
import { updateDoc, doc } from "firebase/firestore";
import { db } from "../firebase/firebase";
import Header from "../Components/Header";
import { Edit, MapPin, Mail, Calendar, User, Shield, Briefcase, Plus, X } from "lucide-react";
import { listenBidsByFreelancer } from "../Services/bidService";
import { listenAssignedProjects, listenProjectsByClient } from "../Services/projectService";
import toast from "react-hot-toast";

export default function Profile() {
  const { user } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [bio, setBio] = useState("");
  const [location, setLocation] = useState("");
  const [skills, setSkills] = useState([]);
  const [skillInput, setSkillInput] = useState("");
  const [loading, setLoading] = useState(true);

  // Stats realtime counters
  const [bids, setBids] = useState([]);
  const [projects, setProjects] = useState([]);
  const [assignedProjects, setAssignedProjects] = useState([]);

  useEffect(() => {
    if (!user) return;
    setBio(user.bio || "");
    setLocation(user.location || "");
    setSkills(user.skills || []);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    if (!user) return;

    let unsubBids = () => {};
    let unsubAssigned = () => {};
    let unsubProjects = () => {};

    if (user.role === "freelancer") {
      unsubBids = listenBidsByFreelancer(user.uid, setBids);
      unsubAssigned = listenAssignedProjects(user.uid, setAssignedProjects);
    } else if (user.role === "client") {
      unsubProjects = listenProjectsByClient(user.uid, setProjects);
    }

    return () => {
      unsubBids();
      unsubAssigned();
      unsubProjects();
    };
  }, [user]);

  if (!user) return null;

  const handleSave = async () => {
    const toastId = toast.loading("Saving changes...");
    try {
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, {
        bio: bio.trim(),
        location: location.trim(),
        skills,
      });

      setIsEditing(false);
      toast.success("Profile updated successfully!", { id: toastId });
    } catch (err) {
      console.error("Error saving profile:", err);
      toast.error("Failed to update profile. Please try again.", { id: toastId });
    }
  };

  const addSkill = (e) => {
    e.preventDefault();
    const trimmed = skillInput.trim();
    if (trimmed) {
      if (skills.includes(trimmed)) {
        toast.error("Skill tag already exists.");
        return;
      }
      setSkills([...skills, trimmed]);
      setSkillInput("");
    }
  };

  const removeSkill = (index) => {
    setSkills(skills.filter((_, idx) => idx !== index));
  };

  // Profile calculations
  const getJoinedDate = () => {
    const createdAt = user.createdAt;
    if (!createdAt) return "Member";
    try {
      const dateObj = createdAt.toDate ? createdAt.toDate() : new Date(createdAt);
      return dateObj.toLocaleDateString(undefined, { month: "long", year: "numeric" });
    } catch (e) {
      return "Recently";
    }
  };

  const completion =
    (bio ? 35 : 0) +
    (skills.length ? 35 : 0) +
    (location ? 30 : 0);

  const completedProjectsCount = assignedProjects.filter((p) => p.status === "completed").length;

  return (
    <div className="bg-slate-950 min-h-screen text-slate-100 font-sans pb-20">
      <Header />

      <main className="max-w-4xl mx-auto px-6 py-12 space-y-8 animate-fade-in">
        
        {loading ? (
          <div className="flex flex-col items-center justify-center py-40 text-slate-400 text-sm font-light space-y-3">
            <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
            <span>Loading profile...</span>
          </div>
        ) : (
          <>
            {/* Banner card wrapper */}
            <div className="bg-slate-900/40 border border-slate-800 rounded-3xl overflow-hidden shadow-soft glass-panel relative">
              <div className="h-44 bg-gradient-to-r from-indigo-900 via-indigo-950 to-slate-900 relative">
                <div className="absolute top-4 right-4 bg-slate-950/80 border border-white/5 backdrop-blur px-3 py-1 rounded-full text-[10px] font-semibold text-indigo-400 uppercase tracking-wider">
                  {user.role} Account
                </div>
              </div>

              {/* Card Body details */}
              <div className="p-6 sm:p-8 relative pt-0">
                {/* Profile Avatar bubble */}
                <div className="absolute -top-16 left-6 sm:left-8">
                  <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl bg-indigo-600 border-4 border-slate-950 text-white flex items-center justify-center font-extrabold text-4xl shadow-2xl relative select-none">
                    {user.username?.charAt(0).toUpperCase()}
                  </div>
                </div>

                {/* Edit Button overlay */}
                <div className="flex justify-end pt-4">
                  {isEditing ? (
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setBio(user.bio || "");
                          setLocation(user.location || "");
                          setSkills(user.skills || []);
                          setIsEditing(false);
                        }}
                        className="px-4 py-2 border border-slate-800 hover:bg-slate-850 text-slate-400 hover:text-white rounded-xl text-xs font-semibold transition"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSave}
                        className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow-md transition active:scale-95"
                      >
                        Save Changes
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-750 text-slate-200 rounded-xl text-xs font-semibold transition active:scale-95"
                    >
                      <Edit className="w-3.5 h-3.5" /> Edit Profile
                    </button>
                  )}
                </div>

                {/* User branding metadata */}
                <div className="mt-16 sm:mt-18 space-y-4">
                  <div className="space-y-1">
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-2">
                      {user.username}
                      <Shield className="w-5 h-5 text-indigo-400" />
                    </h2>
                    <p className="text-slate-500 text-sm font-light flex items-center gap-1.5 capitalize">
                      <Briefcase className="w-4 h-4 text-slate-600" /> {user.role} FreelancerHub member
                    </p>
                  </div>

                  {/* Joined Date, Location Specifiers */}
                  <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-light text-slate-400">
                    <span className="flex items-center gap-1.5">
                      <Mail className="w-4 h-4 text-slate-500" /> {user.email}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4 text-slate-500" /> Joined {getJoinedDate()}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-slate-500" />
                      {isEditing ? (
                        <input
                          type="text"
                          className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-slate-200 outline-none focus:border-indigo-500 text-xs transition"
                          placeholder="e.g. New York, USA"
                          value={location}
                          onChange={(e) => setLocation(e.target.value)}
                        />
                      ) : (
                        <span>{location || "Location not set"}</span>
                      )}
                    </span>
                  </div>

                  {/* Bio block */}
                  <div className="pt-2">
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">About / Summary</h4>
                    {isEditing ? (
                      <textarea
                        rows="4"
                        className="w-full px-3 py-2 rounded-xl bg-slate-950/60 border border-slate-800 text-sm text-slate-200 outline-none focus:border-indigo-500 transition resize-none"
                        value={bio}
                        placeholder="Tell the community about your expertise, experience, and deliverables..."
                        onChange={(e) => setBio(e.target.value)}
                      />
                    ) : (
                      <p className="text-sm text-slate-300 font-light leading-relaxed whitespace-pre-line">
                        {bio || "No summary details added yet. Click Edit Profile to customize."}
                      </p>
                    )}
                  </div>

                  {/* Profile Completion bar */}
                  <div className="pt-2 space-y-1.5">
                    <div className="flex justify-between items-center text-xs font-light text-slate-400">
                      <span>Profile Completion</span>
                      <span className="font-semibold text-indigo-400">{completion}%</span>
                    </div>
                    <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-850">
                      <div
                        className="bg-indigo-600 h-full rounded-full transition-all duration-500 shadow-glow-primary"
                        style={{ width: `${completion}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Skills tags block */}
                  <div className="pt-2 space-y-3">
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">Skills & Tech Stack</h4>
                    
                    <div className="flex flex-wrap gap-1.5">
                      {skills.length > 0 ? (
                        skills.map((skill, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center gap-1 px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 rounded-full text-xs font-semibold"
                          >
                            {skill}
                            {isEditing && (
                              <button
                                type="button"
                                onClick={() => removeSkill(index)}
                                className="text-indigo-400 hover:text-indigo-200 transition text-[10px] w-4.5 h-4.5 bg-slate-800 rounded-full inline-flex items-center justify-center ml-1"
                              >
                                ✕
                              </button>
                            )}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-slate-500 font-light italic">No skill tags listed.</span>
                      )}
                    </div>

                    {isEditing && (
                      <div className="flex gap-2 max-w-sm pt-1">
                        <input
                          type="text"
                          className="flex-1 px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:border-indigo-500 outline-none transition"
                          placeholder="e.g. Next.js"
                          value={skillInput}
                          onChange={(e) => setSkillInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              addSkill(e);
                            }
                          }}
                        />
                        <button
                          type="button"
                          onClick={addSkill}
                          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-750 text-white rounded-xl text-xs font-semibold flex items-center justify-center transition"
                        >
                          <Plus className="w-3.5 h-3.5" /> Add
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Profile Statistics Widgets row */}
            <div className="grid grid-cols-3 gap-6">
              {user.role === "client" ? (
                <>
                  <div className="bg-slate-900/40 border border-slate-800 p-5 rounded-2xl text-center shadow-soft glass-panel space-y-1">
                    <span className="text-2xl font-bold text-white block">{projects.length}</span>
                    <span className="text-xs text-slate-500 block font-light">Projects Posted</span>
                  </div>
                  <div className="bg-slate-900/40 border border-slate-800 p-5 rounded-2xl text-center shadow-soft glass-panel space-y-1">
                    <span className="text-2xl font-bold text-white block">
                      {projects.filter((p) => p.status === "open").length}
                    </span>
                    <span className="text-xs text-slate-500 block font-light">Open Hiring</span>
                  </div>
                  <div className="bg-slate-900/40 border border-slate-800 p-5 rounded-2xl text-center shadow-soft glass-panel space-y-1">
                    <span className="text-2xl font-bold text-white block">
                      {projects.filter((p) => p.status === "completed").length}
                    </span>
                    <span className="text-xs text-slate-500 block font-light">Contracts Completed</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="bg-slate-900/40 border border-slate-800 p-5 rounded-2xl text-center shadow-soft glass-panel space-y-1">
                    <span className="text-2xl font-bold text-white block">{bids.length}</span>
                    <span className="text-xs text-slate-500 block font-light">Total Proposals</span>
                  </div>
                  <div className="bg-slate-900/40 border border-slate-800 p-5 rounded-2xl text-center shadow-soft glass-panel space-y-1">
                    <span className="text-2xl font-bold text-white block">
                      {assignedProjects.filter((p) => p.status === "in-progress" || p.status === "submitted").length}
                    </span>
                    <span className="text-xs text-slate-500 block font-light">Active Work</span>
                  </div>
                  <div className="bg-slate-900/40 border border-slate-800 p-5 rounded-2xl text-center shadow-soft glass-panel space-y-1">
                    <span className="text-2xl font-bold text-white block">{completedProjectsCount}</span>
                    <span className="text-xs text-slate-500 block font-light">Projects Completed</span>
                  </div>
                </>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
