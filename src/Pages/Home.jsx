import React, { useState } from "react";
import Header from "../Components/Header";
import ProjectCard from "../Components/ProjectCard";
import ClientDashboard from "./Client/ClientDashboard";

function Home() {
  const projects = [
    {
      id: 1,
      title: "Build React Website",
      budget: "5000",
      skills: "React, CSS",
    },
    {
      id: 2,
      title: "Create Mobile App",
      budget: "8000",
      skills: "React Native, JavaScript",
    },
    {
      id: 3,
      title: "Design UI/UX for Dashboard",
      budget: "6000",
      skills: "Figma, UI Design",
    },
  ];

  const [searchitem, setSearchitem] = useState(""); // State for search input

  const filteredProjects = projects.filter((project) =>
    project.title.toLowerCase().includes(searchitem.toLowerCase()),
  );                                                                 // Filter projects based on search input

  const [bidprojectid, setBidprojectid] = useState([]); // State to track bid project IDs

  const handlebid = (projectid) => {
    if (bidprojectid.includes(projectid)) {
      return;                            // Prevent duplicate bids
    }
    setBidprojectid([...bidprojectid, projectid]);
  };                                     // Function to handle bidding on a project

  const [userRole, setUserRole] = useState("freelancer"); // State to track user role

  return (
    <>
      <Header />

      <div className="max-w-3xl mx-auto p-4">
      
     {userRole === "client" ? (
    <ClientDashboard 
        projects={projects} 
        bidprojectid={bidprojectid}
    />  ) : 
        (<>
        <h2 className="text-2xl font-bold text-white mb-4">Browse Projects</h2>
        <input
          type="text"
          placeholder="Search projects..."
          value={searchitem}
          onChange={(e) => setSearchitem(e.target.value)}
          className="w-full p-2 mb-4 border text-white border-gray-300 rounded"
        />
        {filteredProjects.map((project) => (
          <ProjectCard
            key={project.id}
            title={project.title}
            budget={project.budget}
            skills={project.skills}
            isBid={bidprojectid?.includes(project.id)}
            onBid={() => handlebid(project.id)}
            userRole={userRole}
          />
        ))}
        </>
        )}
      </div>
    </>
  );
}

export default Home;
