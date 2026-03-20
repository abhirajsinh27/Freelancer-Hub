import { Route, Routes } from "react-router-dom";
import Login from "./Pages/Login";
import SignUp from "./Pages/SignUp";
import ClientDashboard from "./Pages/Client/ClientDashboard";
import FreelancerDashboard from "./Pages/Freelancer/FreelancerDashboard";
import PostProject from "./Pages/Client/PostProject";
import ProtectedRoute from "./Routes/ProtectedRoute";
import RoleRedirect from "./Components/RoleRedirect";
import "./App.css";
import ProjectBids from "./Pages/Client/ProjectBids";
import MyBids from "./Pages/Freelancer/MyBids";
import AssignedProjects from "./Pages/Freelancer/AssignedProjects";

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />

      {/* After Login */}
      <Route path="/" element={<RoleRedirect />} />

      {/* Client Routes */}
      <Route
        path="/client/dashboard"
        element={
          <ProtectedRoute>
            <ClientDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/client/project/:projectId/bids"
        element={
          <ProtectedRoute>
            <ProjectBids />
          </ProtectedRoute>
        }
      />
      <Route
        path="/client/post-project"
        element={
          <ProtectedRoute>
            <PostProject />
          </ProtectedRoute>
        }
      />

      {/* Freelancer Routes */}
      <Route
        path="/freelancer/dashboard"
        element={
          <ProtectedRoute>
            <FreelancerDashboard />
          </ProtectedRoute>
        }
      />
        <Route
        path ="/freelancer/my-bids"
        element={
          <ProtectedRoute>
            <MyBids/>
          </ProtectedRoute>
        }
       /> 
        <Route
        path ="/freelancer/assigned-projects"
        element={
          <ProtectedRoute>
            <AssignedProjects />
          </ProtectedRoute>
        }
       />
    </Routes>
  );
}

export default App;
