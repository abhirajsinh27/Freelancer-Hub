import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/firebase";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { useNavigate } from "react-router-dom";

function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("freelancer");
  const [error, setError] = useState(null);
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError(null);

    if (username.trim().length < 3) {
      return setError("Username must be at least 3 characters");
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );

      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        username: username,
        role: role,

        photoURL: "",
        bio: "",
        skills: [],

        createdAt: new Date(),
      });

      navigate("/login");
    } catch (err) {
      console.error("Signup error:", err);
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen grid md:grid-cols-2 bg-linear-to-br from-[#1e1b4b] to-[#0f172a] text-white">

  {/* LEFT SIDE */}
  <div className="hidden md:flex flex-col justify-center items-center bg-white/5 backdrop-blur-md p-10">
    <h1 className="text-4xl font-bold mb-4">Join FreelancerHub 🚀</h1>
    <p className="text-gray-300 text-center max-w-sm">
      Create your account and start working with clients or freelancers instantly.
    </p>
  </div>

  {/* RIGHT SIDE */}
  <div className="flex items-center justify-center p-6">
    <div className="w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-xl">

      <h2 className="text-2xl font-semibold mb-6 text-center">Create Account</h2>

      {error && (
        <div className="bg-red-500/20 border border-red-500 text-red-300 p-2 rounded-md mb-4 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSignup} className="space-y-4">

        <input
          type="text"
          placeholder="Username"
          className="w-full p-3 rounded-xl bg-white/10 border border-white/20 focus:ring-2 focus:ring-indigo-500 outline-none"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

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

        <select
          className="w-full p-3 rounded-xl bg-white/10 border border-white/20 focus:ring-2 focus:ring-indigo-500"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="freelancer" className="text-black">Freelancer</option>
          <option value="client" className="text-black">Client</option>
        </select>

        <button
          className="w-full bg-indigo-600 hover:bg-indigo-700 py-3 rounded-xl font-semibold transition"
        >
          Create Account
        </button>

        <p className="text-center text-sm text-gray-400">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-indigo-400 cursor-pointer hover:underline"
          >
            Login
          </span>
        </p>

      </form>
    </div>
  </div>
</div>
  );
}
export default SignUp;
