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
import Profile from "./Components/profile";
import TrackProjects from "./Pages/Client/TrackProjects";
import Allbids from "./Pages/Client/Allbids";
import ProjectDetails from "./Pages/Freelancer/ProjectDetails";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <>
      <Toaster 
        position="top-right" 
        toastOptions={{ 
          style: { 
            background: '#1E293B', 
            color: '#F8FAFC', 
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '12px',
          } 
        }} 
      />
      <Routes>
        {/* Entry Point */}
        <Route path="/" element={<RoleRedirect />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />

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
      <Route
        path="/client/client-bids"
        element={
          <ProtectedRoute>
            <Allbids />
          </ProtectedRoute>
        }
      />
      <Route
        path ="/client/Track-Projects"
        element={
          <ProtectedRoute>
            <TrackProjects />
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
        path="/freelancer/project/:projectId"
        element={
          <ProtectedRoute>
            <ProjectDetails />
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
    </>
  );
}

export default App;
