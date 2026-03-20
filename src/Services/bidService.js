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
   CREATE BID
================================= */
export const createBid = async (bidData) => {
  return await addDoc(collection(db, "bids"), {
    ...bidData,
    status: "pending",
    createdAt: serverTimestamp(),
  });
};

/* ===============================
   REALTIME LISTENERS
================================= */

// Client → listen bids for specific project
export const listenBidsByProject = (projectId, callback) => {
  const q = query(
    collection(db, "bids"),
    where("projectId", "==", projectId)
  );

  return onSnapshot(q, (snapshot) => {
    const bids = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    callback(bids);
  });
};

// Freelancer → listen their bids
export const listenBidsByFreelancer = (freelancerId, callback) => {
  const q = query(
    collection(db, "bids"),
    where("freelancerId", "==", freelancerId)
  );

  return onSnapshot(q, (snapshot) => {
    const bids = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    callback(bids);
  });
};

/* ===============================
   UPDATE BID STATUS
================================= */
export const updateBidStatus = async (bidId, newStatus) => {
  const bidRef = doc(db, "bids", bidId);
  await updateDoc(bidRef, { status: newStatus });
};