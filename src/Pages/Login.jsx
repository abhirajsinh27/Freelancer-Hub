import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/firebase";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      console.log("Login successful");
      navigate("/");
      // AuthContext will automatically:
      // - set user
      // - fetch role from Firestore
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  };

  return (
   <div className="min-h-screen grid md:grid-cols-2 bg-linear-to-br from-[#1e1b4b] to-[#0f172a] text-white">

  {/* LEFT SIDE (Branding) */}
  <div className="hidden md:flex flex-col justify-center items-center bg-white/5 backdrop-blur-md p-10">
    <h1 className="text-4xl font-bold mb-4">FreelancerHub</h1>
    <p className="text-gray-300 text-center max-w-sm">
      Connect with top freelancers and clients. Build, collaborate, and grow your career.
    </p>
  </div>

  {/* RIGHT SIDE (Form) */}
  <div className="flex items-center justify-center p-6">
    <div className="w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-xl">

      <h2 className="text-2xl font-semibold mb-6 text-center">Welcome Back 👋</h2>

      {error && (
        <div className="bg-red-500/20 border border-red-500 text-red-300 p-2 rounded-md mb-4 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleLogin} className="space-y-4">

        <input
          type="email"
          placeholder="Email"
          className="w-full p-3 rounded-xl bg-white/10 border border-white/20 focus:ring-2 focus:ring-indigo-500 outline-none"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-3 rounded-xl bg-white/10 border border-white/20 focus:ring-2 focus:ring-indigo-500 outline-none"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          disabled={loading}
          className="w-full bg-indigo-600 hover:bg-indigo-700 py-3 rounded-xl font-semibold transition"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="text-center text-sm text-gray-400">
          Don’t have an account?{" "}
          <span
            onClick={() => navigate("/signup")}
            className="text-indigo-400 cursor-pointer hover:underline"
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
