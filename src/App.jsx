import React from "react";
import { BrowserRouter as Router, Routes, Route,useLocation,Outlet} from "react-router-dom";
import CandidateLogin from "@/components/auth/CandidateLogin";
import Signup from "@/components/auth/Signup";
import Logout from "@/components/auth/Logout";
import RecruiterLogin from "@/components/auth/RecruiterLogin";
import RecruiterDashboard from "@/components/dashboard/RecruiterDashboard";
import JobPostingPage from "@/components/jobposts/JobPostingPage";
import ApplicationForm from "@/components/jobapplications/ApplicationForm";
import LandingPage from "@/components/pages/LandingPage";
import ViewJobPage from "@/components/jobposts/ViewJobPage";
import AllPosts from "@/components/jobposts/AllPosts";
import ApplicantsDetailsPage from "@/components/jobapplications/ApplicantsDetailsPage";
import ApplicantProfilePage from "@/components/jobapplications/ApplicantProfilePage";
import Interview from "@/components/interview/Interview";
import CandidateInterviewPage from "@/components/interview/InterviewDonePage";

import ThankYou from "@/components/pages/ThankYou";
import CandidateDashboard from "@/components/dashboard/CandidateDashboard";
import CandidateAppliedJobs from "@/components/jobposts/CandidateAppliedJobs";
import FaceVerification from "@/components/interview/FaceVerification";
import PendingVerification from "./components/pages/PendingVerification";
import RecruiterSignUp from "./components/auth/RecruiterSignUp";
import IncompleteInterviewPage from "./components/interview/IncompleteInterviewPage";
import { UserProvider  } from './components/context/UserContext';
import Navbar from "./components/layout/NavBar";
import ProfilePage from "./components/pages/ProfilePage"
import Unauthorized from './components/pages/Unauthorized'; // Import the new Unauthorized component
import { AuthenticatedRoute, RecruiterRoute,CandidateRoute } from "./components/routes/ProtectedRoutes";
import { useEffect, useState } from "react";



// Layout with Navbar
// Layout with Navbar
const NavbarLayout = () => {
  return (
    <>
      <Navbar />
      <Outlet /> {/* This renders the matching child route */}
    </>
  );
};

// Layout without Navbar
const NoNavbarLayout = () => {
  return <Outlet />;
};

function App() {
  return (
    <Router>
      <UserProvider>
        <div className="container">
          <Routes>
            {/* Public routes - no authentication needed */}
            <Route element={<NoNavbarLayout />}>
              <Route path="/" element={<LandingPage />} />
              <Route path="/candidate-login" element={<CandidateLogin />} />
              <Route path="/recruiter-login" element={<RecruiterLogin />} />
              <Route path="/recruiter-signup" element={<RecruiterSignUp />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/unauthorized" element={<Unauthorized />} />
            </Route>
            
            {/* Common authenticated routes with navbar */}
            <Route element={<NavbarLayout />}>
              <Route path="/logout" element={<Logout />} />
              
              {/* Recruiter only routes */}
              <Route element={<RecruiterRoute />}>
                <Route path="/recruiter-dashboard" element={<RecruiterDashboard />} />
                <Route path="/JobPosting" element={<JobPostingPage />} />
                <Route path="/view-job" element={<ViewJobPage />} />
                <Route path="/job-applicants" element={<ApplicantsDetailsPage />} />
                <Route path="/applicant-profile" element={<ApplicantProfilePage />} />
              </Route>
              
              {/* Candidate only routes */}
              <Route element={<CandidateRoute />}>
                <Route path="/application-form" element={<ApplicationForm />} />
                <Route path="/applied-jobs" element={<CandidateAppliedJobs />} />
                <Route path="/candidate-dashboard" element={<CandidateDashboard />} />
                <Route path="/face-verification" element={<FaceVerification />} />
                <Route path="/pending-verification" element={<PendingVerification />} />
                <Route path="/interview/completed" element={<CandidateInterviewPage />} />
                <Route path="/interview/incompleted" element={<IncompleteInterviewPage />} />
                <Route path="/publicposts" element={<AllPosts />} />
                <Route path="chat/" element={<Interview />} />
                <Route path="/thank-you" element={<ThankYou />} />
              </Route>
              
              {/* Routes accessible by any authenticated user */}
              <Route element={<AuthenticatedRoute />}>
                <Route path="/profile" element={<ProfilePage />} />
              </Route>
            </Route>
          </Routes>
        </div>
      </UserProvider>
    </Router>
  );
}

export default App;