import { useAuth } from "../Context/AuthContext";
import { useState, useEffect } from "react";
import { updateDoc, doc } from "firebase/firestore";
import { db } from "../firebase/firebase";
import Header from "../Components/Header";
import { Edit, MapPin, Mail, Star } from "lucide-react";
import { listenBidsByFreelancer } from "../Services/bidService";
import {
  listenAssignedProjects,
  listenProjectsByClient,
} from "../Services/projectService";

export default function Profile() {
  const { user } = useAuth();

  const [isEditing, setIsEditing] = useState(false);

  const [bio, setBio] = useState(user?.bio || "");
  const [location, setLocation] = useState(user?.location || "");
  const [skills, setSkills] = useState(user?.skills || []);
  const [skillInput, setSkillInput] = useState("");
  const [bids, setBids] = useState([]);
  const [projects, setProjects] = useState([]);
  const [assignedProjects, setAssignedProjects] = useState([]);

  if (!user) return null;
  // 🔥 REALTIME DATA FETCHING
  useEffect(() => {
    if (!user) return;

    let unsubscribe;
    if (user.role === "freelancer") {
      // get bids
      const unsubBids = listenBidsByFreelancer(user.uid, setBids);
      // get assigned projects
      const unsubAssigned = listenAssignedProjects(
        user.uid,
        setAssignedProjects,
      );
      return () => {
        unsubBids();
        unsubAssigned();
      };
    }
    if (user.role === "client") {
      unsubscribe = listenProjectsByClient(user.uid, setProjects);
      return () => unsubscribe();
    }
  }, [user]);

  // 🔥 SAVE PROFILE
  const handleSave = async () => {
    try {
      const userRef = doc(db, "users", user.uid);

      await updateDoc(userRef, {
        bio,
        location,
        skills,
      });

      setIsEditing(false);
      alert("Profile updated!");
    } catch (err) {
      console.error(err);
    }
  };

  const completion =
    (bio ? 25 : 0) +
    (skills.length ? 25 : 0) +
    (location ? 25 : 0) +
    (user.photoURL ? 25 : 0);

  const stats =
    user.role === "freelancer"
      ? [
          { label: "Bids", value: bids.length },
          { label: "Active Projects", value: assignedProjects.length },
          {
            label: "Accepted",
            value: bids.filter((b) => b.status === "accepted").length,
          },
        ]
      : [
          { label: "Projects", value: projects.length },
          {
            label: "Open",
            value: projects.filter((p) => p.status === "open").length,
          },
          {
            label: "Closed",
            value: projects.filter((p) => p.status === "closed").length,
          },
        ];

  return (
    <div className="bg-slate-900 min-h-screen text-white">
      <Header />

      {/* ================= PROFILE CARD ================= */}
      <div className="max-w-5xl mx-auto mt-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-lg overflow-hidden">
        {/* Banner */}
        <div className="h-40 bg-linear-to-r from-indigo-600 to-blue-600"></div>

        {/* Profile Info */}
        <div className="p-6 relative">
          {/* Avatar */}
          <div className="absolute -top-16 left-6">
            <div className="w-32 h-32 rounded-full bg-indigo-600 flex items-center justify-center text-4xl font-bold border-4 border-slate-900 shadow-md">
              {user.username?.charAt(0).toUpperCase()}
            </div>
          </div>

          {/* Edit Button */}
          <div className="flex justify-end">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
            >
              <Edit size={16} />
              {isEditing ? "Cancel" : "Edit Profile"}
            </button>
          </div>

          {/* Name & Role */}
          <div className="mt-16">
            <h2 className="text-2xl font-bold">{user.username}</h2>
            <p className="text-slate-400 capitalize">{user.role}</p>
          </div>
          {/* Profile Completion */}
          <div className="mt-4">
            <p className="text-sm text-slate-400 mb-1">
              Profile Completion: {completion}%
            </p>

            <div className="w-full bg-white/10 rounded-full h-2">
              <div
                className="bg-indigo-500 h-2 rounded-full transition-all"
                style={{ width: `${completion}%` }}
              ></div>
            </div>
          </div>

          {/* Info Row */}
          <div className="flex flex-wrap gap-6 mt-4 text-slate-400">
            {/* Location */}
            {isEditing ? (
              <input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Enter location"
                className="bg-white/10 px-3 py-1 rounded"
              />
            ) : (
              <span className="flex items-center gap-2">
                <MapPin size={16} /> {location || "Add location"}
              </span>
            )}

            {/* Email */}
            <span className="flex items-center gap-2">
              <Mail size={16} /> {user.email}
            </span>
          </div>

          {/* Bio */}
          <div className="mt-4">
            {isEditing ? (
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full bg-white/10 p-3 rounded-lg"
              />
            ) : (
              <p className="text-slate-300">{bio || "Add your bio"}</p>
            )}
          </div>

          {/* Skills */}
          <div className="mt-4">
            <div className="flex flex-wrap gap-2">
              {skills.length > 0 ? (
                skills.map((skill, i) => (
                  <span
                    key={i}
                    className="bg-indigo-500/20 text-indigo-300 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                  >
                    {skill}

                    {/* 🔥 REMOVE BUTTON */}
                    {isEditing && (
                      <button
                        onClick={() =>
                          setSkills(skills.filter((_, index) => index !== i))
                        }
                        className="text-red-400 hover:text-red-500 text-xs"
                      >
                        ✕
                      </button>
                    )}
                  </span>
                ))
              ) : (
                <p className="text-slate-400 text-sm">No skills added yet</p>
              )}
            </div>

            {/* Add Skill */}
            {isEditing && (
              <div className="flex gap-2 mt-3">
                <input
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  placeholder="Add skill"
                  className="flex-1 bg-white/10 px-3 py-2 rounded"
                />
                <button
                  onClick={() => {
                    if (skillInput.trim()) {
                      setSkills([...skills, skillInput]);
                      setSkillInput("");
                    }
                  }}
                  className="bg-indigo-600 px-4 rounded"
                >
                  Add
                </button>
              </div>
            )}
          </div>

          {/* SAVE BUTTON */}
          {isEditing && (
            <button
              onClick={handleSave}
              className="mt-6 bg-green-500 hover:bg-green-600 px-5 py-2 rounded-lg"
            >
              Save Changes
            </button>
          )}
        </div>
      </div>

      {/* ================= STATS ================= */}
      <div className="max-w-5xl mx-auto mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white/5 p-6 rounded-xl border border-white/10 text-center"
          >
            <h3 className="text-xl font-bold">{stat.value}</h3>
            <p className="text-slate-400">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* ================= PORTFOLIO ================= */}
      <div className="max-w-5xl mx-auto mt-6 bg-white/5 p-6 rounded-xl border border-white/10">
        <h3 className="text-xl font-bold mb-4">
          {user.role === "freelancer" ? "Work History" : "My Projects"}
        </h3>

        <div className="grid md:grid-cols-3 gap-4">
         {user.role === "freelancer" &&
  assignedProjects.map((project) => (
    <div
      key={project.id}
      className="border border-white/10 rounded-lg overflow-hidden hover:shadow-lg"
    >
      <div className="h-40 bg-slate-700"></div>

      <div className="p-3">
        <h4 className="font-semibold">{project.title}</h4>

        <p className="text-sm text-slate-400">
          {project.skills?.join(", ") || "No skills"}
        </p>
      </div>
    </div>
  ))}
          {user.role === "client" &&
  projects.map((project) => (
    <div
      key={project.id}
      className="border border-white/10 rounded-lg overflow-hidden hover:shadow-lg"
    >
      <div className="h-40 bg-slate-700"></div>

      <div className="p-3">
        <h4 className="font-semibold">{project.title}</h4>

        <p className="text-sm text-slate-400">
          {project.skills?.join(", ") || "No skills"}
        </p>
      </div>
    </div>
  ))}
  {user.role === "freelancer" && assignedProjects.length === 0 && (
  <p className="text-slate-400">No projects assigned yet</p>
)}

{user.role === "client" && projects.length === 0 && (
  <p className="text-slate-400">No projects created yet</p>
)}
        </div>
      </div>
      
    </div>
  );
}
