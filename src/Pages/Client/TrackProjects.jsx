import React from 'react'
import Header from "../../Components/Header";
import { useState,useEffect } from 'react';
import { listenProjectsByClient } from '../../Services/projectService';
import { useAuth } from '../../Context/AuthContext';

function TrackProjects() {
    const {user} = useAuth()
    const [projects, setProjects] = useState([]);

    useEffect(() => {
        if (!user) return;
        const unsubscribe = listenProjectsByClient(user.uid, (projectsData) => {
          setProjects(projectsData);
        });
        return () => unsubscribe();
      }, [user]);


    return (
         <div className="min-h-screen bg-linear-to-br from-slate-900 via-indigo-950 to-slate-900">
      <Header />

      <div className="max-w-6xl mx-auto px-8 py-12">
        <h2 className="text-3xl font-bold text-white mb-8">
          My Projects
        </h2>

        {projects.length === 0 ? (
          <p className="text-slate-400">
            No projects yet.
          </p>
        ) : (
          <div className="space-y-6">
            {projects.map((project) => (
              <div
                key={project.id}
                className="bg-white/5 border border-white/10 rounded-2xl p-6"
              >
                {/* HEADER */}
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-semibold text-white">
                      {project.title}
                    </h3>

                    <p className="text-slate-400 text-sm mt-1">
                      {project.description}
                    </p>
                  </div>

                  <span className="text-green-400 font-semibold">
                    ₹{project.budget}
                  </span>
                </div>

                {/* STATUS */}
                <div className="mt-3">
                  <span className="text-xs bg-indigo-500/20 px-2 py-1 rounded text-indigo-300">
                    {project.status}
                  </span>
                </div>

                {/* ASSIGNED */}
                {project.assignedFreelancerName && (
                  <p className="text-sm text-slate-400 mt-3">
                    Assigned to:{" "}
                    <span className="text-white">
                      {project.assignedFreelancerName}
                    </span>
                  </p>
                )}

                {/* PROGRESS */}
                <div className="mt-4 bg-white/5 p-4 rounded-xl border border-white/10">
                  <p className="text-indigo-400 text-sm mb-1">
                    Progress
                  </p>

                  <p className="text-slate-300 text-sm">
                    {project.progress || "No updates yet"}
                  </p>
                </div>

                {/* SUBMISSION */}
                <div className="mt-4 bg-white/5 p-4 rounded-xl border border-white/10">
                  <p className="text-green-400 text-sm mb-1">
                    Submission
                  </p>

                  {project.submission ? (
                    <a
                      href={project.submission}
                      target="_blank"
                      rel="noreferrer"
                      className="text-green-400 underline text-sm"
                    >
                      View Work
                    </a>
                  ) : (
                    <p className="text-slate-400 text-sm">
                      Not submitted yet
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
    )
}

export default TrackProjects
