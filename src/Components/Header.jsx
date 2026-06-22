import React, { useState } from "react";
import { useAuth } from "../Context/AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "../firebase/firebase";
import { useNavigate, NavLink, Link } from "react-router-dom";
import { Menu, X, User, LogOut, ChevronDown, Briefcase } from "lucide-react";
import toast from "react-hot-toast";

function Header() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    const toastId = toast.loading("Logging out...");
    try {
      await signOut(auth);
      setOpen(false);
      setMobileMenuOpen(false);
      toast.success("Logged out successfully.", { id: toastId });
      navigate("/login");
    } catch (err) {
      console.error(err);
      toast.error("Logout failed.", { id: toastId });
    }
  };

  const activeClass =
    "text-indigo-400 font-semibold transition border-b-2 border-indigo-500 pb-1.5 pt-0.5";
  const inactiveClass =
    "text-slate-300 hover:text-white transition pb-1.5 pt-0.5";

  const renderClientLinks = (isMobile = false) => (
    <>
      <NavLink
        to="/client/dashboard"
        onClick={() => setMobileMenuOpen(false)}
        className={({ isActive }) => (isActive ? activeClass : inactiveClass)}
      >
        Dashboard
      </NavLink>
      <NavLink
        to="/client/post-project"
        onClick={() => setMobileMenuOpen(false)}
        className={({ isActive }) => (isActive ? activeClass : inactiveClass)}
      >
        Post Project
      </NavLink>
      <NavLink
        to="/client/client-bids"
        onClick={() => setMobileMenuOpen(false)}
        className={({ isActive }) => (isActive ? activeClass : inactiveClass)}
      >
        View Bids
      </NavLink>
      <NavLink
        to="/client/Track-Projects"
        onClick={() => setMobileMenuOpen(false)}
        className={({ isActive }) => (isActive ? activeClass : inactiveClass)}
      >
        Track Projects
      </NavLink>
    </>
  );

  const renderFreelancerLinks = (isMobile = false) => (
    <>
      <NavLink
        to="/freelancer/dashboard"
        onClick={() => setMobileMenuOpen(false)}
        className={({ isActive }) => (isActive ? activeClass : inactiveClass)}
      >
        Dashboard
      </NavLink>
      <NavLink
        to="/freelancer/my-bids"
        onClick={() => setMobileMenuOpen(false)}
        className={({ isActive }) => (isActive ? activeClass : inactiveClass)}
      >
        My Bids
      </NavLink>
      <NavLink
        to="/freelancer/assigned-projects"
        onClick={() => setMobileMenuOpen(false)}
        className={({ isActive }) => (isActive ? activeClass : inactiveClass)}
      >
        Assigned Projects
      </NavLink>
    </>
  );

  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-white/5 shadow-soft">
      <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center relative">
        {/* Left Branding */}
        <div className="flex items-center gap-4">
          <Link
            to="/"
            className="text-2xl font-bold text-white tracking-wide select-none"
          >
            Freelancer<span className="text-indigo-500">Hub</span>
          </Link>
          {user?.role && (
            <span className="hidden sm:inline-flex px-2 py-0.5 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-full text-[10px] font-semibold uppercase tracking-wider">
              {user.role} console
            </span>
          )}
        </div>

        {/* Center Desktop Navigation */}
        {user && (
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium absolute left-1/2 transform -translate-x-1/2 h-full pt-1.5">
            {user.role === "client" && renderClientLinks()}
            {user.role === "freelancer" && renderFreelancerLinks()}
          </nav>
        )}

        {/* Right Section: Auth and Mobile Menu trigger */}
        <div className="flex items-center gap-4">
          {user ? (
            /* User profile avatar controls */
            <div className="relative">
              <button
                onClick={() => setOpen(!open)}
                className="flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 rounded-full p-1"
              >
                <div className="w-9 h-9 rounded-full bg-indigo-600 border border-indigo-500 text-white flex items-center justify-center font-bold text-sm shadow-md cursor-pointer">
                  {user.username?.charAt(0).toUpperCase()}
                </div>
                <ChevronDown
                  className={`w-4 h-4 text-slate-400 hidden sm:block transition-transform duration-200 ${open ? "rotate-180" : ""}`}
                />
              </button>

              {/* Avatar menu dropdown */}
              {open && (
                <div className="absolute right-0 top-14 w-56 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl z-50 overflow-hidden animate-fade-in glass-panel">
                  <div className="px-4 py-3.5 border-b border-slate-850">
                    <p className="font-semibold text-white text-sm">
                      {user.username}
                    </p>
                    <p className="text-xs text-slate-500 font-light truncate">
                      {user.email}
                    </p>
                  </div>

                  <div className="p-1.5 space-y-1">
                    <button
                      onClick={() => {
                        navigate("/profile");
                        setOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 text-slate-300 hover:bg-slate-800 hover:text-white rounded-xl text-xs font-medium transition flex items-center gap-2"
                    >
                      <User className="w-4 h-4 text-indigo-400" />
                      View Profile
                    </button>

                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-3 py-2 text-red-400 hover:bg-red-500/10 rounded-xl text-xs font-medium transition flex items-center gap-2"
                    >
                      <LogOut className="w-4 h-4" />
                      Log out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Non-authenticated CTAs */
            <div className="hidden md:flex items-center gap-4 text-sm font-semibold">
              <Link
                to="/login"
                className="text-slate-300 hover:text-white transition"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl shadow-md transition"
              >
                Sign Up
              </Link>
            </div>
          )}

          {/* Mobile menu trigger */}
          {user && (
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-400 hover:text-white focus:outline-none hover:bg-slate-900 rounded-xl transition"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          )}
        </div>
      </div>

      {/* Mobile Drawer Overlay */}
      {mobileMenuOpen && user && (
        <div className="md:hidden absolute top-20 left-0 w-full bg-slate-950 border-b border-slate-900 p-6 space-y-6 animate-fade-in shadow-2xl z-40">
          <div className="flex flex-col gap-4 text-sm font-medium">
            {user.role === "client" && renderClientLinks(true)}
            {user.role === "freelancer" && renderFreelancerLinks(true)}
          </div>

          <div className="border-t border-slate-900 pt-4 flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xs">
                {user.username?.charAt(0).toUpperCase()}
              </div>
              <div className="text-xs">
                <p className="font-semibold text-white">{user.username}</p>
                <p className="text-slate-500 font-light">{user.email}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  navigate("/profile");
                  setMobileMenuOpen(false);
                }}
                className="py-2.5 bg-slate-900 border border-slate-805 text-slate-300 hover:text-white rounded-xl text-xs font-semibold text-center flex items-center justify-center gap-1 transition"
              >
                <User className="w-3.5 h-3.5 text-indigo-400" /> Profile
              </button>
              <button
                onClick={handleLogout}
                className="py-2.5 bg-red-950/10 border border-red-950/30 text-red-400 rounded-xl text-xs font-semibold text-center flex items-center justify-center gap-1 transition"
              >
                <LogOut className="w-3.5 h-3.5" /> Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

export default Header;
