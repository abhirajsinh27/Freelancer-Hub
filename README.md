# FreelancerHub

A modern freelance marketplace built with **React.js**, **Firebase Authentication**, and **Cloud Firestore**. FreelancerHub connects Clients and Freelancers on a single platform, enabling project posting, proposal submission, and project management through role-based dashboards.

---

## 🚀 Live Features

### 🔐 Authentication & Authorization
- User Registration and Login
- Firebase Authentication
- Role-Based Access Control (Client / Freelancer)
- Protected Routes
- Secure User Sessions

### 👤 Client Features
- Create New Projects
- Manage Posted Projects
- View Freelancer Proposals
- Accept or Reject Bids
- Track Project Progress

### 💼 Freelancer Features
- Browse Available Projects
- Submit Project Proposals
- Manage Submitted Bids
- Track Accepted Projects
- Build Professional Presence

### 📁 Project Management
- Real-Time Firestore Database
- Project Status Tracking
- Skill-Based Projects
- Proposal Management
- Dynamic Project Listings

### 🎨 User Interface
- Responsive Design
- Modern Dashboard Layout
- Clean Navigation
- Mobile Friendly
- Tailwind CSS Styling

---

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|----------|
| React.js | Frontend Development |
| Firebase Authentication | User Authentication |
| Cloud Firestore | Database |
| React Router DOM | Routing |
| React Context API | State Management |
| Tailwind CSS | Styling |
| Firebase Hosting | Deployment |

---

## 📂 Project Structure

```bash
src/
│
├── assets/
├── components/
│   ├── common/
│   ├── client/
│   └── freelancer/
│
├── context/
│   └── AuthContext.jsx
│
├── pages/
│   ├── Home.jsx
│   ├── Login.jsx
│   ├── Register.jsx
│   ├── ClientDashboard.jsx
│   ├── FreelancerDashboard.jsx
│   └── ProjectDetails.jsx
│
├── routes/
│   ├── ProtectedRoute.jsx
│   └── RoleRedirect.jsx
│
├── services/
│   ├── projectService.js
│   └── bidService.js
│
├── firebase/
│   └── firebaseConfig.js
│
├── App.jsx
└── main.jsx
```

---

## 🔄 Application Workflow

### Client Workflow

1. Register/Login
2. Select Client Role
3. Post New Project
4. Receive Freelancer Proposals
5. Review Bids
6. Accept Freelancer
7. Manage Project

### Freelancer Workflow

1. Register/Login
2. Select Freelancer Role
3. Browse Projects
4. Submit Proposal
5. Wait for Client Approval
6. Get Project Assigned
7. Complete Project

---

## 🗄️ Firestore Database Design

### Users Collection

```json
{
  "uid": "user_id",
  "name": "John Doe",
  "email": "john@example.com",
  "role": "client",
  "createdAt": "timestamp"
}
```

### Projects Collection

```json
{
  "title": "React Developer Needed",
  "description": "Build a responsive dashboard",
  "clientId": "user_id",
  "clientName": "John Doe",
  "skills": ["React", "Firebase"],
  "budget": 10000,
  "status": "open",
  "createdAt": "timestamp"
}
```

### Bids Collection

```json
{
  "projectId": "project_id",
  "freelancerId": "user_id",
  "proposal": "I can complete this project efficiently.",
  "amount": 8000,
  "createdAt": "timestamp"
}
```

---

## ✨ Key Features Implemented

- Firebase Authentication
- Firestore Database Integration
- Role-Based Dashboards
- Project Posting System
- Proposal/Bidding System
- Protected Routes
- Context API State Management
- Real-Time Data Updates
- Responsive UI Design
- CRUD Operations

---

## 🎯 Learning Outcomes

Through this project, I gained practical experience in:

- Building Full-Stack Applications
- Firebase Authentication
- Firestore Database Design
- React Context API
- State Management
- Role-Based Authorization
- Component Reusability
- Real-Time Data Handling
- Modern Frontend Development
- Project Architecture

---

## 📸 Screenshots

### Home Page
_Add Screenshot Here_

### Client Dashboard
_Add Screenshot Here_

### Freelancer Dashboard
_Add Screenshot Here_

### Project Details Page
_Add Screenshot Here_

### Proposal Management
_Add Screenshot Here_

---

## 🔮 Future Enhancements

- Real-Time Chat System
- Notifications
- Payment Gateway Integration
- Freelancer Ratings & Reviews
- Project Milestones
- File Upload Support
- Admin Dashboard
- Freelancer Portfolio Profiles
- Advanced Search & Filters
- Project Analytics

---

## ⚙️ Installation

### Clone Repository

```bash
git clone https://github.com/abhirajsinh27/Freelancer-Hub.git
```

### Navigate to Project

```bash
cd Freelancer-Hub
```

### Install Dependencies

```bash
npm install
```

### Start Development Server

```bash
npm run dev
```

---

## 👨‍💻 Developer

**Abhirajsinh Vala**

B.Tech Computer Engineering  
Indus University

### Skills Used

- React.js
- JavaScript (ES6+)
- Firebase Authentication
- Cloud Firestore
- React Router DOM
- Context API
- Tailwind CSS
- Git & GitHub

---

## 📌 Project Objective

The objective of FreelancerHub is to provide a centralized platform where clients can post projects and freelancers can discover opportunities, submit proposals, and collaborate efficiently. The project demonstrates the implementation of modern web development concepts including authentication, authorization, database management, state management, and responsive user interface design.

---

⭐ If you found this project useful, consider giving it a star.
