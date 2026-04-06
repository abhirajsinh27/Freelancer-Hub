import { db } from "../firebase/firebase";
import { collection, addDoc } from "firebase/firestore";

export const seedData = async () => {
  try {
    console.log("Seeding data...");

    // ================= 🔥 PUT YOUR REAL UID HERE =================
    const client1 = "5nUPmZ9zl9fRpyjmfBRJI6dAT9B3";
    const client2 = "NuLoDnq8labaY4Osrw39lzcBNv02";

    const freelancer1 = "EaCPd25CpjY1hW9VQ6p03A0xCXk2";
    const freelancer2 = "ZdmxEAghgoMvaCvjavWDuyw543I3";

    // ================= PROJECT TITLES =================
    const t1 = "Gaming Website UI";
    const t2 = "Task Manager App";
    const t3 = "E-commerce Website";
    const t4 = "Portfolio Website";
    const t5 = "Real-time Chat Application";
    const t6 = "Admin Dashboard with Analytics";

    // ================= PROJECTS =================

    const p1 = await addDoc(collection(db, "projects"), {
      title: t1,
      description: "Modern gaming UI with animations",
      budget: 15000,
      skills: ["React", "Tailwind"],
      deadline: "2026-04-10",
      status: "open",
      clientId: client1,
    });

    const p2 = await addDoc(collection(db, "projects"), {
      title: t2,
      description: "Full stack Firebase app",
      budget: 20000,
      skills: ["React", "Firebase"],
      deadline: "2026-04-15",
      status: "in-progress",
      clientId: client1,
      assignedFreelancerId: freelancer1,
      assignedFreelancerName: "Donald Bosh",
      progressUpdates: [
        {
          text: "Completed authentication system",
          createdAt: new Date().toLocaleString(),
        },
      ],
      submission: "",
    });

    const p3 = await addDoc(collection(db, "projects"), {
      title: t3,
      description: "Shopping platform with cart",
      budget: 25000,
      skills: ["React", "Redux"],
      deadline: "2026-04-20",
      status: "open",
      clientId: client2,
    });

    const p4 = await addDoc(collection(db, "projects"), {
      title: t4,
      description: "Portfolio with animations",
      budget: 8000,
      skills: ["HTML", "CSS"],
      deadline: "2026-04-05",
      status: "completed",
      clientId: client2,
      assignedFreelancerId: freelancer2,
      assignedFreelancerName: "Thomas Wolt",
      progressUpdates: [
        {
          text: "Designed homepage",
          createdAt: new Date().toLocaleString(),
        },
        {
          text: "Added animations",
          createdAt: new Date().toLocaleString(),
        },
      ],
      submission: "https://github.com/sample-portfolio",
    });

    const p5 = await addDoc(collection(db, "projects"), {
      title: t5,
      description: "Build chat app with Firebase",
      budget: 18000,
      skills: ["React", "Firebase"],
      deadline: "2026-04-18",
      status: "open",
      clientId: client1,
    });

    const p6 = await addDoc(collection(db, "projects"), {
      title: t6,
      description: "Dashboard with charts and analytics",
      budget: 16000,
      skills: ["React", "Chart.js"],
      deadline: "2026-04-22",
      status: "in-progress",
      clientId: client2,
      assignedFreelancerId: freelancer1,
      assignedFreelancerName: "Donald Bosh",
      progressUpdates: [
        {
          text: "Setup dashboard layout",
          createdAt: new Date().toLocaleString(),
        },
      ],
      submission: "",
    });

    // ================= BIDS =================

    // CLIENT 1 → PROJECT 1
    await addDoc(collection(db, "bids"), {
      projectId: p1.id,
      projectTitle: t1,
      freelancerId: freelancer1,
      freelancerName: "Donald Bosh",
      clientId: client1,
      bidAmount: 14000,
      proposalTime: 5,
      status: "pending",
    });

    await addDoc(collection(db, "bids"), {
      projectId: p1.id,
      projectTitle: t1,
      freelancerId: freelancer2,
      freelancerName: "Thomas Wolt",
      clientId: client1,
      bidAmount: 13500,
      proposalTime: 6,
      status: "pending",
    });

    // CLIENT 2 → PROJECT 3
    await addDoc(collection(db, "bids"), {
      projectId: p3.id,
      projectTitle: t3,
      freelancerId: freelancer1,
      freelancerName: "Donald Bosh",
      clientId: client2,
      bidAmount: 23000,
      proposalTime: 10,
      status: "pending",
    });

    await addDoc(collection(db, "bids"), {
      projectId: p3.id,
      projectTitle: t3,
      freelancerId: freelancer2,
      freelancerName: "Thomas Wolt",
      clientId: client2,
      bidAmount: 22000,
      proposalTime: 8,
      status: "accepted",
    });

    // CLIENT 1 → PROJECT 5
    await addDoc(collection(db, "bids"), {
      projectId: p5.id,
      projectTitle: t5,
      freelancerId: freelancer1,
      freelancerName: "Donald Bosh",
      clientId: client1,
      bidAmount: 17000,
      proposalTime: 7,
      status: "pending",
    });

    await addDoc(collection(db, "bids"), {
      projectId: p5.id,
      projectTitle: t5,
      freelancerId: freelancer2,
      freelancerName: "Thomas Wolt",
      clientId: client1,
      bidAmount: 16500,
      proposalTime: 8,
      status: "pending",
    });

    // CLIENT 2 → PROJECT 6
    await addDoc(collection(db, "bids"), {
      projectId: p6.id,
      projectTitle: t6,
      freelancerId: freelancer2,
      freelancerName: "Thomas Wolt",
      clientId: client2,
      bidAmount: 15000,
      proposalTime: 6,
      status: "pending",
    });

    await addDoc(collection(db, "bids"), {
      projectId: p6.id,
      projectTitle: t6,
      freelancerId: freelancer1,
      freelancerName: "Donald Bosh",
      clientId: client2,
      bidAmount: 15500,
      proposalTime: 5,
      status: "accepted",
    });

    console.log("✅ ALL DATA SEEDED SUCCESSFULLY");
  } catch (err) {
    console.error("❌ Error seeding data:", err);
  }
};