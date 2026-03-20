import {
  collection,
  addDoc,
  query,
  where,
  serverTimestamp,
  doc,
  updateDoc,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../firebase/firebase";

/* ===============================
   CREATE PROJECT
================================= */
export const createProject = async (projectData) => {
  return await addDoc(collection(db, "projects"), {
    ...projectData,
    createdAt: serverTimestamp(),
    status: "open",
  });
};

/* ===============================
   REALTIME LISTENERS
================================= */

// Client → listen only their projects
export const listenProjectsByClient = (clientId, callback) => {
  const q = query(
    collection(db, "projects"),
    where("clientId", "==", clientId)
  );

  return onSnapshot(q, (snapshot) => {
    const projects = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    callback(projects);
  });
};

// Freelancer → listen all open projects
export const listenAllProjects = (callback) => {
  const q = query(
    collection(db, "projects"),
    where("status", "==", "open")
  );

  return onSnapshot(q, (snapshot) => {
    const projects = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    callback(projects);
  });
};

export const listenAssignedProjects = (freelancerId, callback) => {
  const q = query(
    collection(db, "projects"),
    where("assignedFreelancerId", "==", freelancerId),
    where("status", "==", "in-progress")
  );

  const unsubscribe = onSnapshot(q, (snapshot) => {
    const projects = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    callback(projects);
  });

  return unsubscribe;
};

/* ===============================
   UPDATE PROJECT STATUS
================================= */
export const updateProjectStatus = async (projectId, data) => {
  const projectRef = doc(db, "projects", projectId);
  await updateDoc(projectRef, data);
};