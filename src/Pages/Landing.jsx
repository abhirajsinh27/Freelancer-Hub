import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import Header from "../Components/Header";
import { 
  Briefcase, 
  Users, 
  CheckCircle, 
  MessageSquare, 
  ArrowRight, 
  PlusCircle, 
  FileText, 
  UserCheck, 
  Sparkles,
  Github,
  Twitter,
  Linkedin
} from "lucide-react";

export default function Landing() {
  const { user } = useAuth();

  const stats = [
    { label: "Projects Posted", value: "12,480+", icon: Briefcase, color: "text-indigo-400 bg-indigo-500/10" },
    { label: "Active Freelancers", value: "8,920+", icon: Users, color: "text-emerald-400 bg-emerald-500/10" },
    { label: "Successful Matches", value: "98.4%", icon: CheckCircle, color: "text-amber-400 bg-amber-500/10" },
    { label: "Total Proposals", value: "45,000+", icon: MessageSquare, color: "text-rose-400 bg-rose-500/10" },
  ];

  const steps = [
    {
      num: "01",
      title: "Client Posts Project",
      description: "Define requirements, set budgets, and list needed skills in minutes.",
      icon: PlusCircle,
    },
    {
      num: "02",
      title: "Freelancers Submit Proposals",
      description: "Qualified freelancers apply with custom bids and delivery timelines.",
      icon: FileText,
    },
    {
      num: "03",
      title: "Client Selects Freelancer",
      description: "Review proposals, chat with applicants, and hire the best fit.",
      icon: UserCheck,
    },
    {
      num: "04",
      title: "Project Gets Completed",
      description: "Track progress updates and release payments upon work delivery.",
      icon: CheckCircle,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 overflow-x-hidden selection:bg-indigo-600 selection:text-white">
      <Header />

      {/* Hero Section */}
      <section className="relative flex-1 flex flex-col items-center justify-center text-center px-6 pt-20 pb-16 lg:pt-32 lg:pb-24">
        {/* Glow Effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-600/10 blur-[120px] rounded-full pointer-events-none"></div>
        <div className="absolute top-1/3 left-1/3 w-[300px] h-[300px] bg-blue-600/10 blur-[100px] rounded-full pointer-events-none"></div>

        <div className="max-w-4xl mx-auto space-y-8 relative z-10 animate-slide-up">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 rounded-full text-xs font-semibold tracking-wide">
            <Sparkles className="w-4.5 h-4.5 text-indigo-400 animate-pulse" />
            Empowering the Future of Freelancing
          </div>

          {/* Main Title */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.1] text-white">
            Hire Top Freelancers <span className="gradient-text font-black">Faster</span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto font-light leading-relaxed">
            Post projects, receive proposals, and manage work in one place. Connect with talented freelancers worldwide.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            {user ? (
              <Link
                to={user.role === "client" ? "/client/dashboard" : "/freelancer/dashboard"}
                className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-indigo-500/30 transition-all duration-300"
              >
                Go to Dashboard
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            ) : (
              <>
                <Link
                  to="/signup?role=client"
                  className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-indigo-500/30 transition-all duration-300"
                >
                  Start Hiring
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
                <Link
                  to="/signup?role=freelancer"
                  className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-xl border border-slate-700/50 transition-all duration-300"
                >
                  Find Work
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="px-6 py-12 border-y border-slate-900 bg-slate-900/20 backdrop-blur-sm relative">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, idx) => (
              <div 
                key={idx} 
                className="bg-slate-900/50 border border-slate-800/80 p-6 rounded-2xl flex flex-col justify-between space-y-4 hover:border-slate-700/50 transition duration-300 shadow-soft"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-slate-400">{stat.label}</span>
                  <div className={`p-2 rounded-xl ${stat.color}`}>
                    <stat.icon className="w-5 h-5" />
                  </div>
                </div>
                <h3 className="text-3xl font-bold text-white tracking-tight">{stat.value}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="px-6 py-20 lg:py-28 relative">
        <div className="max-w-6xl mx-auto space-y-16">
          <div className="text-center space-y-4 max-w-xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">How It Works</h2>
            <p className="text-slate-400 font-light">
              FreelancerHub connects clients and freelancers through a streamlined, secure project workflow.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
            {steps.map((step, idx) => (
              <div key={idx} className="relative group">
                {/* Horizontal connector lines for desktop */}
                {idx < 3 && (
                  <div className="hidden lg:block absolute top-10 left-[75%] w-[50%] h-[1px] bg-slate-800 group-hover:bg-indigo-500/50 transition duration-300 z-0"></div>
                )}
                
                <div className="bg-slate-900/40 border border-slate-800/80 p-6 rounded-3xl space-y-6 relative z-10 shadow-soft group-hover:border-slate-700/50 hover:-translate-y-1 transition-all duration-300">
                  <div className="flex justify-between items-center">
                    <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center text-indigo-400 font-bold border border-slate-700/30 group-hover:bg-indigo-600 group-hover:text-white transition duration-300">
                      <step.icon className="w-6 h-6" />
                    </div>
                    <span className="text-4xl font-black text-slate-800 group-hover:text-slate-700 transition duration-300">{step.num}</span>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-lg font-bold text-white group-hover:text-indigo-300 transition duration-300">{step.title}</h3>
                    <p className="text-sm text-slate-400 leading-relaxed font-light">{step.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="mt-auto border-t border-slate-900 bg-slate-950/80 backdrop-blur-md px-6 py-12">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 border-b border-slate-900 pb-12">
          <div className="md:col-span-2 space-y-4">
            <h2 className="text-2xl font-bold text-white tracking-wide">
              Freelancer<span className="text-indigo-500">Hub</span>
            </h2>
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed font-light">
              Premium, role-based freelancer marketplace helping companies scale and freelancers build exceptional careers.
            </p>
            <div className="flex items-center gap-4 text-slate-400">
              <a href="#" className="hover:text-indigo-400 transition"><Github className="w-5 h-5" /></a>
              <a href="#" className="hover:text-indigo-400 transition"><Twitter className="w-5 h-5" /></a>
              <a href="#" className="hover:text-indigo-400 transition"><Linkedin className="w-5 h-5" /></a>
            </div>
          </div>
          
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-slate-200 uppercase tracking-wider">Product</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><a href="#" className="hover:text-white transition">Features</a></li>
              <li><a href="#" className="hover:text-white transition">About</a></li>
              <li><a href="#" className="hover:text-white transition">Success Stories</a></li>
              <li><a href="#" className="hover:text-white transition">Contact</a></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-slate-200 uppercase tracking-wider">Legal</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><a href="#" className="hover:text-white transition">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white transition">Terms of Service</a></li>
              <li><a href="#" className="hover:text-white transition">Security Guidelines</a></li>
              <li><a href="#" className="hover:text-white transition">Cookie Policy</a></li>
            </ul>
          </div>
        </div>

        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 pt-8 gap-4">
          <p>© {new Date().getFullYear()} FreelancerHub. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:underline">Privacy</a>
            <span>•</span>
            <a href="#" className="hover:underline">Terms</a>
            <span>•</span>
            <a href="#" className="hover:underline">Sitemap</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
