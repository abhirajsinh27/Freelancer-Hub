import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/firebase";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Sparkles, Mail, Lock } from "lucide-react";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrors({});

    if (!validate()) return;

    setLoading(true);
    const toastId = toast.loading("Logging you in...");

    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success("Welcome back!", { id: toastId });
      navigate("/");
    } catch (err) {
      console.error("Login error:", err);
      let message = "Invalid email or password. Please try again.";
      if (
        err.code === "auth/user-not-found" ||
        err.code === "auth/wrong-password"
      ) {
        message = "Incorrect email or password.";
      }
      toast.error(message, { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid md:grid-cols-12 bg-slate-950 text-slate-100 font-sans animate-fade-in">
      {/* LEFT SIDE (Branding Showcase) */}
      <div className="hidden md:flex md:col-span-5 flex-col justify-between p-12 bg-gradient-to-br from-indigo-950/80 via-slate-900/50 to-slate-950 relative border-r border-slate-900 overflow-hidden">
        <div className="absolute top-1/3 left-1/4 w-[350px] h-[350px] bg-indigo-500/10 blur-[100px] rounded-full pointer-events-none"></div>

        <div>
          <h1 className="text-2xl font-bold text-white tracking-wide">
            Freelancer<span className="text-indigo-500">Hub</span>
          </h1>
        </div>

        <div className="space-y-6 relative z-10">
          <div className="w-12 h-12 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-xl flex items-center justify-center">
            <Sparkles className="w-6 h-6" />
          </div>
          <h2 className="text-4xl font-extrabold tracking-tight text-white leading-tight">
            Welcome back to the Command Center.
          </h2>
          <p className="text-slate-400 font-light leading-relaxed max-w-sm">
            Access your projects, bids, proposals, and track real-time contract
            completions all from a single dashboard.
          </p>
        </div>

        <div className="text-xs text-slate-500 font-light">
          © {new Date().getFullYear()} FreelancerHub. SaaS Platform.
        </div>
      </div>

      {/* RIGHT SIDE (Login Form) */}
      <div className="col-span-12 md:col-span-7 flex items-center justify-center p-6 sm:p-12 relative">
        <div className="absolute top-1/4 right-1/4 w-[300px] h-[300px] bg-indigo-600/5 blur-[120px] rounded-full pointer-events-none"></div>

        <div className="w-full max-w-md bg-slate-900/40 border border-slate-800/80 rounded-2xl p-8 sm:p-10 shadow-soft glass-panel space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold tracking-tight text-white animate-slide-up">
              Welcome Back 👋
            </h2>
            <p className="text-sm text-slate-400 font-light">
              Enter your credentials to access your dashboard.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            {/* Email Input */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Email Address
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500 pointer-events-none">
                  <Mail className="w-5 h-5" />
                </span>
                <input
                  type="text"
                  placeholder="you@example.com"
                  className={`w-full pl-11 pr-4 py-3 rounded-xl bg-slate-950/60 border ${
                    errors.email
                      ? "border-red-500/85 focus:ring-red-500/30"
                      : "border-slate-800 focus:border-indigo-500 focus:ring-indigo-500/20"
                  } text-white placeholder-slate-600 focus:ring-4 outline-none transition`}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              {errors.email && (
                <p className="text-xs text-red-400 font-medium pl-1 animate-fade-in">
                  {errors.email}
                </p>
              )}
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Password
                </label>
              </div>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500 pointer-events-none">
                  <Lock className="w-5 h-5" />
                </span>
                <input
                  type="password"
                  placeholder="••••••••"
                  className={`w-full pl-11 pr-4 py-3 rounded-xl bg-slate-950/60 border ${
                    errors.password
                      ? "border-red-500/85 focus:ring-red-500/30"
                      : "border-slate-800 focus:border-indigo-500 focus:ring-indigo-500/20"
                  } text-white placeholder-slate-600 focus:ring-4 outline-none transition`}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              {errors.password && (
                <p className="text-xs text-red-400 font-medium pl-1 animate-fade-in">
                  {errors.password}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-500 active:scale-[0.98] text-white font-semibold rounded-xl shadow-lg hover:shadow-indigo-600/20 transition duration-200 mt-2"
            >
              {loading ? "Logging in..." : "Login"}
            </button>

            <p className="text-center text-sm text-slate-400 font-light mt-4">
              Don’t have an account?{" "}
              <span
                onClick={() => navigate("/signup")}
                className="text-indigo-400 font-semibold cursor-pointer hover:text-indigo-300 hover:underline transition"
              >
                Sign up
              </span>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
