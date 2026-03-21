import { useAuth } from "../Context/AuthContext";
import { useState } from "react";
import { updateDoc, doc } from "firebase/firestore";
import { db } from "../firebase/firebase";
import Header from "../Components/Header";
import { Edit, MapPin, Mail, Briefcase, Star } from "lucide-react";

export default function Profile() {
  const { user } = useAuth();

  const [isEditing, setIsEditing] = useState(false);

  const [bio, setBio] = useState(user?.bio || "");
  const [location, setLocation] = useState(user?.location || "");
  const [skills, setSkills] = useState(user?.skills || []);
  const [skillInput, setSkillInput] = useState("");

  if (!user) return null;

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

            <span className="flex items-center gap-2">
              <Briefcase size={16} /> Available
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
              <p className="text-slate-300">
                {bio || "Add your bio"}
              </p>
            )}
          </div>

          {/* Skills */}
          <div className="mt-4">
            <div className="flex flex-wrap gap-2">
              {skills.length > 0 ? (
                skills.map((skill, i) => (
                  <span
                    key={i}
                    className="bg-indigo-500/20 text-indigo-300 px-3 py-1 rounded-full text-sm"
                  >
                    {skill}
                  </span>
                ))
              ) : (
                <span className="text-slate-400 text-sm">
                  Add skills
                </span>
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

        {[
          { label: "Projects", value: 0 },
          { label: "Bids", value:  0},
          { label: "Rating", value: "4.8" },
        ].map((stat, index) => (
          <div key={index} className="bg-white/5 p-6 rounded-xl border border-white/10 text-center">
            <h3 className="text-xl font-bold">{stat.value}</h3>
            <p className="text-slate-400">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* ================= PORTFOLIO ================= */}
      <div className="max-w-5xl mx-auto mt-6 bg-white/5 p-6 rounded-xl border border-white/10">
        <h3 className="text-xl font-bold mb-4">Portfolio</h3>

        <div className="grid md:grid-cols-3 gap-4">
          {[1, 2, 3].map((item) => (
            <div key={item} className="border border-white/10 rounded-lg overflow-hidden hover:shadow-lg">
              <div className="h-40 bg-slate-700"></div>
              <div className="p-3">
                <h4 className="font-semibold">Project {item}</h4>
                <p className="text-sm text-slate-400">React + Firebase App</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ================= REVIEWS ================= */}
      <div className="max-w-5xl mx-auto mt-6 bg-white/5 p-6 rounded-xl border border-white/10">
        <h3 className="text-xl font-bold mb-4">Reviews</h3>

        {[1, 2].map((review) => (
          <div key={review} className="border-b border-white/10 py-3">
            <div className="flex items-center gap-2">
              <Star size={16} className="text-yellow-400" />
              <span className="font-semibold">5.0</span>
            </div>
            <p className="text-slate-400 mt-1">
              Great work! Delivered on time.
            </p>
          </div>
        ))}
      </div>

    </div>
  );
}