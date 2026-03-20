import { useAuth } from "../Context/AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "../firebase/firebase";
import { useNavigate, NavLink } from "react-router-dom";

function Header() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/5 border-b border-white/10 shadow-lg">
<div className="w-full px-10 py-5 flex justify-between items-center">
    
        {/* Left Section */}
        <div className="flex items-center gap-4 ">
          <h1 className="text-2xl font-bold text-white tracking-wide">
            Freelance<span className="text-indigo-500">Hub</span>
          </h1>

          {user?.role && (
            <span className={`px-3 py-1 text-xs rounded-full font-semibold
              ${user?.role === "client"
                ? "bg-green-500/20 text-green-400"
                : "bg-indigo-500/20 text-indigo-400"
              }`}>
              {user?.role.toUpperCase()}
            </span>
          )}
        </div>

        {/* Center Navigation */}
        <nav className="hidden md:flex gap-6 text-sm font-medium">
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
        <div className="flex items-center gap-4">
          {user && (
            <span className="hidden sm:block text-slate-400 text-sm">
              {user.email}
            </span>
          )}

          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg shadow-md transition duration-200"
          >
            Logout
          </button>
        </div>

      </div>
    </header>
  );
}

export default Header;

