import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Helmet } from "react-helmet"; // Make sure to install react-helmet
import { useUser } from "../context/UserContext";

import {
  Search,
  Plus,
  Briefcase,
  Users,
  Star,
  ChevronRight,
  Bell,
  LogOut,
  ChevronDown,
  Building,
  CheckCircleIcon,
  RefreshCcwIcon
} from "lucide-react";
import axiosInstance from "../api/axiosConfig";
import zubair from "../../assets/zubair.jpg";
import "../../styles/RecruiterDashboard.css";

const RecruiterDashboard = () => {
  const navigate = useNavigate();
  const [jobPosts, setJobPosts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [notificationCount, setNotificationCount] = useState(3);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [totalCompletedInterviews, setTotalCompletedInterviews] = useState(0);
  const [totalReInterviewsRequest, setTotalReInterviewsRequest] = useState(0);
  const [dashboardStats, setDashboardStats] = useState({
    totalApplications: 0,
    activeJobs: 0,
  });
  const [username, setUsername] = useState(
    localStorage.getItem("username") || "Guest"
  );
  // const { userType } = useUser();

  useEffect(() => {
    const accessToken = localStorage.getItem("access");
    if (!accessToken) {
      navigate("/recruiter-dashboard");
      return;
    }

    axiosInstance
      .get("job_posting/with_applicants/")
      .then((response) => {
        const processedPosts = response.data
          .map((post) => ({
            ...post,
            skills: Array.isArray(post.skills)
              ? post.skills.join(", ")
              : post.skills || "",
          }))
          .sort((a, b) => new Date(b.created_at) - new Date(a.created_at)); // Add this line

        const totalApps = processedPosts.reduce((total, post) => {
          return total + (post.applicants?.length || 0);
        }, 0);
        setJobPosts(processedPosts);
        setDashboardStats((prev) => ({
          ...prev,
          activeJobs: processedPosts.length,
          totalApplications: totalApps,
        }));
      })
      .catch((error) => {
        console.error("Error fetching job posts:", error);
        if (error.response && error.response.status === 401) {
          localStorage.removeItem("access");
          localStorage.removeItem("refresh");
          navigate("/login");
        }
      });
  }, [navigate]);

  useEffect(() => {
    const accessToken = localStorage.getItem("access");
    if (!accessToken) {
      navigate("/recruiter-dashboard");
      return;
    }
    console.log("Fetching completed interviews...");
    axiosInstance
      .get("job_posting/recruiter/completed/")
      .then((response) => {
        const completedInterviews = response.data;
        console.log("Completed interviews:", completedInterviews);
        const totalCompletedInterviews = completedInterviews.reduce((total, post) => {
          return total + (post.applicants);
        }, 0);
        setTotalCompletedInterviews(totalCompletedInterviews); // Set total count here
      })
      
      .catch((error) => {
        console.error("Error fetching job posts:", error);
        if (error.response && error.response.status === 401) {
          localStorage.removeItem("access");
          localStorage.removeItem("refresh");
          navigate("/login");
        }
      });
  }, [navigate]);


  useEffect(() => {
    const accessToken = localStorage.getItem("access");
    if (!accessToken) {
      navigate("/recruiter-dashboard");
      return;
    }
    console.log("Fetching request interviews...");
    axiosInstance
      .get("job_posting/recruiter/reinterview/")
      .then((response) => {
        const reInterviews = response.data;
        console.log("Re interviews:", reInterviews);
        const requestReInterviews = reInterviews.reduce((total, post) => {
          return total + (post.applicants);
        }, 0);
        setTotalReInterviewsRequest(requestReInterviews); // Set total count here
      })
      
      .catch((error) => {
        console.error("Error fetching reinterviews posts:", error);
        if (error.response && error.response.status === 401) {
          localStorage.removeItem("access");
          localStorage.removeItem("refresh");
          navigate("/login");
        }
      });
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("username");
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    navigate("/");
  };

  console.log("iterbiew:", totalCompletedInterviews);
  const handleIconClick = () => navigate("/JobPosting");
  const handleIconPostClick = () => navigate("/view-job");

  const getSkillsArray = (skillsString) => {
    if (!skillsString) return [];
    return skillsString
      .split(",")
      .map((skill) => skill.trim())
      .filter(Boolean);
  };

  return (
    <div className="recruiter-dashboard">
      <Helmet>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Helmet>

      <div className="recruiter-dashboard__container">
        <div className="welcome-text">
          <h1>Welcome, {username}</h1>
        </div>

        <style>
          {`
          .welcome-text {
            text-align: center;
            color:rgb(40, 99, 237);
          }
        `}
        </style>
        <main className="recruiter-dashboard__main-content">
          <div className="recruiter-dashboard__stats-grid recruiter-dashboard__fade-in">
            <div className="recruiter-dashboard__stat-card">
              <div className="recruiter-dashboard__stat-content">
                <div className="recruiter-dashboard__icon-container recruiter-dashboard__icon-blue">
                  <Users className="recruiter-dashboard__stat-icon" />
                </div>
                <div>
                  <p className="ts-card-label">
                    Total Applications
                  </p>
                  <p className="ts-card-value">
                    {dashboardStats.totalApplications}
                  </p>
                </div>
              </div>
            </div>

            <div className="recruiter-dashboard__stat-card">
              <div className="recruiter-dashboard__stat-content">
                <div className="recruiter-dashboard__icon-container recruiter-dashboard__icon-green">
                  <CheckCircleIcon className="recruiter-dashboard__stat-icon" />
                </div>
                <div>
                  {/* <Link to="/view-job"> */}
                  <p className="ts-card-label">Completed Interviews</p>
                  <p className="ts-card-value">
                    {totalCompletedInterviews}
                  </p>
                  {/* </Link> */}
                </div>
              </div>
            </div>

            <div className="recruiter-dashboard__stat-card">
              <div className="recruiter-dashboard__stat-content">
                <div className="recruiter-dashboard__icon-container recruiter-dashboard__icon-purple">
                  <RefreshCcwIcon className="recruiter-dashboard__stat-icon" />
                </div>
                <div>
                  <p className="ts-card-label">Re-interview Requests</p>
                  <p className="ts-card-value">{totalReInterviewsRequest}</p>
                </div>
              </div>
            </div>

            <div className="recruiter-dashboard__stat-card">
              <div className="recruiter-dashboard__stat-content">
                <div className="recruiter-dashboard__icon-container recruiter-dashboard__icon-orange">
                  <Briefcase className="recruiter-dashboard__stat-icon" />
                </div>
                <div>
                  {/* <Link to="/view-job"> */}
                  <p className="ts-card-label">
                    Active Job Posts
                  </p>
                  <p className="ts-card-value">
                    {dashboardStats.activeJobs}
                  </p>
                  {/* </Link> */}
                </div>
              </div>
            </div>
          </div>

          <div className="recruiter-dashboard__quick-actions recruiter-dashboard__fade-in">
            <div
              className="recruiter-dashboard__action-card"
              onClick={handleIconClick}
            >
              <div className="recruiter-dashboard__action-content">
                <div>
                  <h3 className="recruiter-dashboard__action-title">
                    Post a New Job
                  </h3>
                  <p className="recruiter-dashboard__action-description">
                    Create a new job posting and find the perfect candidates
                  </p>
                </div>
                <div className="recruiter-dashboard__icon-container recruiter-dashboard__icon-blue">
                  <Plus className="recruiter-dashboard__action-icon" />
                </div>
              </div>
            </div>

            <div
              className="recruiter-dashboard__action-card"
              onClick={handleIconPostClick}
            >
              <div className="recruiter-dashboard__action-content">
                <div>
                  <h3 className="recruiter-dashboard__action-title">
                    View Posted Jobs
                  </h3>
                  <p className="recruiter-dashboard__action-description">
                    Manage and track your active job postings
                  </p>
                </div>
                <div className="recruiter-dashboard__icon-container recruiter-dashboard__icon-green">
                  <Briefcase className="recruiter-dashboard__action-icon" />
                </div>
              </div>
            </div>
          </div>

          <div className="recruiter-dashboard__table-container recruiter-dashboard__fade-in">
            <div className="recruiter-dashboard__table-header">
              <h2 className="recruiter-dashboard__table-title">
                Recent Job Posts
              </h2>
              <Link
                to="/view-job"
                className="recruiter-dashboard__view-all-button"
              >
                View all
                <ChevronRight className="recruiter-dashboard__chevron-icon" />
              </Link>
            </div>

            <div className="recruiter-dashboard__table-scroll">
              <table className="recruiter-dashboard__table">
                <thead>
                  <tr>
                    <th>Job Title</th>
                    <th>Skills Required</th>
                    <th>Posted Date</th>
                    <th>Applicants</th>
                  </tr>
                </thead>
                <tbody>
                  {jobPosts.slice(0, 2).map((post, index) => (
                    <tr key={`job-post-${post.id}-${index}`}>
                      <td>
                        <span className="recruiter-dashboard__job-title">
                          {post.job_title}
                        </span>
                      </td>
                      <td>
                        <div className="recruiter-dashboard__skills-container">
                          {getSkillsArray(post.skills).map((skill, idx) => (
                            <span
                              key={idx}
                              className="recruiter-dashboard__skill-tag"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="recruiter-dashboard__posted-date">
                        {new Date(post.posted_at).toLocaleDateString()}
                      </td>
                      <td>
                        {post.applicants && post.applicants.length > 0 ? (
                          <div className="recruiter-dashboard__applicant-list">
                            <div className="recruiter-dashboard__applicant-avatar">
                              {post.applicants.length}
                            </div>
                            {/* {post.applicants.map((applicant, idx) => (
                              <div 
                                key={`applicant-${post.id}-${idx}`}
                                className="recruiter-dashboard__applicant-item"
                              >
                               
                                {/* <span className="recruiter-dashboard__applicant-avatar">{post.applicants.length}</span> */}
                          </div>
                        ) : (
                          // ))} */}
                          // </div>
                          <span className="recruiter-dashboard__no-applicants">
                            No applicants yet
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default RecruiterDashboard;
