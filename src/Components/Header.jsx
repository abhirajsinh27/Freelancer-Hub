import { useAuth } from "../Context/AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "../firebase/firebase";
import { useNavigate, NavLink } from "react-router-dom";
import { useState } from "react";

function Header() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/5 border-b border-white/10 shadow-lg r">
<div className="w-full px-10 py-5 flex justify-between items-center relative">
    
        {/* Left Section */}
        <div className="flex items-center gap-4 ">
          <h1 className="text-2xl font-bold text-white tracking-wide">
            Freelancer<span className="text-indigo-500">Hub</span>
          </h1>
          
        </div>

        {/* Center Navigation */}
        <nav className="hidden md:flex gap-6 text-sm font-medium absolute left-1/2 transform -translate-x-1/2">
          {user?.role === "client" && (
            <>
              <NavLink
                to="/client/dashboard"
                className={({ isActive }) =>
                  isActive
                    ? "text-indigo-400"
                    : "text-slate-300 hover:text-white transition"
                }
              >
                Dashboard
              </NavLink>

              <NavLink
                to="/client/post-project"
                className={({ isActive }) =>
                  isActive
                    ? "text-indigo-400"
                    : "text-slate-300 hover:text-white transition"
                }
              >
                Post Project
              </NavLink>
              <NavLink
                to="/client/Track-Projects"
                className={({ isActive }) =>
                  isActive
                    ? "text-indigo-400"
                    : "text-slate-300 hover:text-white transition"
                }
              >
                Track Projects
              </NavLink>

            </>
          )}

          {user?.role === "freelancer" && (
            <>
            <NavLink
              to="/freelancer/dashboard"
              className={({ isActive }) =>
                isActive
                  ? "text-indigo-400"
                  : "text-slate-300 hover:text-white transition"
              }
            >
              Browse Projects
            </NavLink>

            <NavLink
              to="/freelancer/my-bids"
              className={({ isActive }) =>
                isActive
                  ? "text-indigo-400"
                  : "text-slate-300 hover:text-white transition"
              }
            >
              My Bids
            </NavLink>
            <NavLink
              to="/freelancer/assigned-projects"
              className={({ isActive }) =>
                isActive
                  ? "text-indigo-400"
                  : "text-slate-300 hover:text-white transition"
              }
            >
              Assigned Projects
            </NavLink>
            </>
          )}
        </nav>

        {/* Right Section */}
       <div className="flex items-center gap-4 relative">
  {/* AVATAR */}
  <div
    onClick={() => setOpen(!open)}
    className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center cursor-pointer font-bold text-white"
  >
    {user?.username?.charAt(0).toUpperCase()}
  </div>

  {/* DROPDOWN */}
 {open && (
  <div className="absolute right-0 top-14 w-56 bg-slate-900/90 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl shadow-indigo-500/10 z-50 overflow-hidden animate-fadeIn">

    {/* USER INFO */}
    <div className="px-4 py-3 border-b border-white/10">
      <p className="font-semibold text-white">{user.username}</p>
      <p className="text-xs text-slate-400">{user.email}</p>
    </div>

    {/* PROFILE */}
    <button
      onClick={() => {
        navigate("/profile");
        setOpen(false);
      }}
      className="w-full text-left px-4 py-3 text-slate-300 hover:bg-white/10 hover:text-white transition flex items-center gap-2"
    >
      👤 Profile
    </button>

    {/* LOGOUT */}
    <button
      onClick={handleLogout}
      className="w-full text-left px-4 py-3 text-red-400 hover:bg-red-500/10 transition flex items-center gap-2"
    >
      🚪 Logout
    </button>

  </div>
)}
</div>

      </div>
    </header>
  );
}

export default Header;

