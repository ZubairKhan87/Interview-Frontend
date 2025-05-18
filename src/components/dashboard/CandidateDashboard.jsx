import React, { useState,useEffect } from 'react';
import axiosInstance from '../api/axiosConfig';
import { useUser } from "../context/UserContext";
const BASE_API_URL = import.meta.env.VITE_API_URL;

import { 
  BriefcaseIcon, PlayIcon, NewspaperIcon, SparklesIcon ,
  CalendarIcon, CheckCircleIcon, ClockIcon, Building2Icon,
  TrendingUpIcon, AwardIcon, MessageSquareIcon,XCircleIcon ,PauseCircleIcon,
  BookOpenIcon, GraduationCapIcon, ScrollIcon, 
  FileTextIcon, MapPinIcon,HourglassIcon ,TimerIcon , UsersIcon, HeartIcon,ChevronRight,ChevronDownIcon,ChevronRightIcon,PlusIcon   
} from 'lucide-react';
import "../../styles/CandidateDashboard.css";
import Arbisoft from '../../assets/Arbisoft.jpg';
import Netsol from '../../assets/netsol.jpg';
import zubair from "../../assets/zubair.jpg";
import axios from "axios";

import {useLocation, useNavigate,Link } from 'react-router-dom';

const CandidateDashboard = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [jobPosts, setJobPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [applicationCount, setApplicationCount] = useState(0); // New state for application count
  const [candidateId, setCandidateId] = useState(null);
  const [jobs, setJobs] = useState([]);
  const { updateUser } = useUser();

  const [error, setError] = useState(null);
  const [applications, setApplications] = useState([]);
  const [username, setUsername] = useState(localStorage.getItem('username') || 'Guest');
  const [profileImage, setProfileImage] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [name,setName]=useState();
  const [interview,setInterviews]=useState([]);
  const [incompleteInterview,setIncompleteInterview]=useState([]);
  const [interviewCount,setInterviewCount]=useState(0);
  const [incompletedInterviewCount,setIncompletedInterviewCount]=useState(0)
  const [pendingInterviewCount,setPendingInterviewCount]=useState(0)
  const navigate = useNavigate();
  // Function to format relative time
  const getRelativeTime = (dateString) => {
    const now = new Date();
    const posted = new Date(dateString);
    const diffInSeconds = Math.floor((now - posted) / 1000);
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInSeconds < 60) return 'just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m`;
    if (diffInHours < 24) return `${diffInHours}h`;
    if (diffInDays < 7) return `${diffInDays}d`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)}w`;
    return `${Math.floor(diffInDays / 30)}mo`;
  };


  useEffect(() => {
      const fetchJobs = async () => {
        setLoading(true);
        const accessToken = localStorage.getItem('access');
        
        try {
          const response = await fetch(`${BASE_API_URL}/api/job_posting/publicposts/`, {
            headers: {
              'Authorization': `Bearer ${accessToken}`
            }
          });
  
          if (!response.ok) {
            throw new Error('Failed to fetch jobs');
          }
  
          const data = await response.json();
          // Sort jobs by date before setting them
          const sortedJobs = data
          .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
          .slice(0, 2);
          setJobPosts(sortedJobs);
          // setFilteredJobs(sortedJobs);
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };
  
      fetchJobs();
    }, []);
  

  
  useEffect(() => {
    const fetchApplications = () => {
      axiosInstance.get('job_posting/candidate/applied-jobs/')
        .then((response) => {
          const data = response.data;
          const sortedApplications = data
            .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
            .slice(0, 2);
          setApplications(sortedApplications);
          setLoading(false);
        })
        .catch((err) => {
          setError(err.message);
          setLoading(false);
        });
    };

    fetchApplications();
  }, []);
  
  useEffect(() => {
    fetchAppliedJobs();
    fetchCandidateId();
    fetchPendingInterviews();
    fetchInterviewDoneJobs();
    fetchIncompleteInterviews();
  }, []);

  const fetchCandidateId = async () => {
    try {
      const response = await axiosInstance.get('chat/current-candidate/');
      setCandidateId(response.data.id);
    } catch (err) {
      console.error('Error fetching candidate ID:', err);
    }
  };

  const fetchAppliedJobs = () => {
    axiosInstance
      .get('job_posting/candidate/applied-jobs/')
      .then((response) => {
        const jobsData = response.data;
        const sortedApplications = jobsData
            .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
            .slice(0, 2);
        setJobs(sortedApplications);
        setApplicationCount(jobsData.length); // Count the number of jobs
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  };

  const fetchPendingInterviews=()=>{
    axiosInstance.get('job_posting/candidate/interview/pending/')
    .then((response)=>{
      const pendingInterviewData = response.data;          
      console.log("Pending interviews data",pendingInterviewData);
      // setIncompleteInterview(pendingInterviewData);
      setPendingInterviewCount(pendingInterviewData.length);
      setLoading(false);
    })
    .catch((error)=>{
      setError(error.message);
      setLoading(false);
    })
  }
  const fetchInterviewDoneJobs=()=>{
    axiosInstance.get('job_posting/candidate/interview/completed/')
    .then((response) =>{
      const interviewData = response.data;
      const sortedApplications = interviewData
            .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
            .slice(0, 2);
      console.log("interviews done",interviewData)
      setInterviews(sortedApplications);
      setInterviewCount(interviewData.length);
      setLoading(false);
    })
    .catch((error) =>{
      setError(error.message);
      setLoading(false);
    })
  }


  const fetchIncompleteInterviews=()=>{
    axiosInstance.get('job_posting/candidate/interview/incomplete/')
    .then((response)=>{
      const incompleteInterviewData = response.data;
      const sortedApplications = incompleteInterviewData
            .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
            .slice(0, 2);
      console.log("Incomplete interview data",incompleteInterviewData);
      setIncompleteInterview(sortedApplications);
      setIncompletedInterviewCount(incompleteInterviewData.length);
      setLoading(false);
    })
    .catch((error)=>{
      setError(error.message);
      setLoading(false);
    })
  }

  useEffect(() => {
    const fetchProfileImage = async () => {
        try {
            const accessToken = localStorage.getItem('access');
            
            if (!accessToken) {
                console.error('No access token found');
                return;
            }

            const response = await axios.get(`${BASE_API_URL}/api/authentication/profile/image/`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });
            console.log(response.data.profile_image)
            if (response.data.profile_image && response.data.candidate_name) {
                setProfileImage(response.data.profile_image);
                setName(response.data.candidate_name);
                updateUser(response.data.candidate_name,"candidate");

            }
        } catch (error) {
            console.error('Error fetching profile image:', error);
            // If token expired, we might want to use the refresh token here
        }
    };

    fetchProfileImage();
}, []);

/// Add this function to handle file selection and upload
const handleImageChange = async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  // Basic validation
  if (!file.type.startsWith('image/')) {
    alert('Please select an image file');
    return;
  }

  try {
    setIsUploading(true);

    // Create FormData to send file
    const formData = new FormData();
    formData.append('profile_image', file);

    const accessToken = localStorage.getItem('access');
    
    const response = await axios.post(
      `${BASE_API_URL}/api/authentication/profile/image/upload/`,
      formData,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'multipart/form-data',
        }
      }
    );

    if (response.data.profile_image) {
      setProfileImage(response.data.profile_image);
    }
  } catch (error) {
    if (error.response) {
      alert(error.response.data.error);
    } else {
      console.error('Error uploading image:', error);
      alert('Failed to upload image');
    }
  } finally {
    setIsUploading(false);
  }
};

  const getStatusClass = (status) => {
    switch (status.toLowerCase()) {
      case 'applied':
        return 'pending';
      case 'interview done':
        return 'success';
      default:
        return '';
        
    }
  };

  if (loading) {
  return (
    <div className="status-container">
      <span className="loader"></span>
      <p>Fetching data, please wait...</p>
    </div>
  );
}

if (error) {
  return (
    <div className="status-container error">
      <span className="error-icon">⚠️</span>
      <p>Oops! Something went wrong.<br />{error}</p>
    </div>
  );
}


  
  const handleLogout = () => {
    localStorage.removeItem('username');
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    navigate("/logout")
    console.log('Logging out...');
  };
  const handleSeePosts = () => {
    navigate("/publicposts")
    // console.log('Logging out...');
  };
  const handleAppliedPosts = () => {
    navigate("/applied-jobs")
    // console.log('Logging out...');
  };
  const handleInterviewDone=()=>{
    navigate("/interview/completed")
  }

  const handleIncompleteInterview=()=>{
    navigate("/interview/incompleted")

  }
  return (
    <div className="ts-dashboard">
  
    {/* Main Content */}
    <div className="ts-content">
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
      <div className="ts-content-wrapper">
       
        
        {/* Main Dashboard Content */}
        <main className="ts-main">
          {/* Summary Cards */}
          <div className="ts-summary-grid">
            <div className="ts-summary-card">
              <div className="ts-card-content">
                <div className="ts-card-icon">
                  <BriefcaseIcon className="recruiter-dashboard__icon-container recruiter-dashboard__icon-blue" />
                </div>
                <div className="ts-card-info">
                  <p className="ts-card-label">Total Applied Jobs</p>
                  <p className="ts-card-value">{applicationCount}</p>
                </div>
              </div>
            </div>
            
              <div className="ts-card-content">
                <div className="ts-card-icon">
                  <CheckCircleIcon   className="recruiter-dashboard__icon-container recruiter-dashboard__icon-green" />
                </div>
                <div className="ts-card-info">
                  <p className="ts-card-label">Completed Interviews</p>
                  <p className="ts-card-value">{interviewCount}</p>
                </div>
              </div>
            
              <div className="ts-card-content">
                <div className="ts-card-icon">
                  <TimerIcon    className="recruiter-dashboard__icon-container recruiter-dashboard__icon-purple" />
                </div>
                <div className="ts-card-info">
                  <p className="ts-card-label"> Pending Interviews</p>
                  <p className="ts-card-value">{pendingInterviewCount}</p>
                </div>
              </div>

              <div className="ts-card-content">
                <div className="ts-card-icon">
                  <PauseCircleIcon    className="recruiter-dashboard__icon-container recruiter-dashboard__icon-orange" />
                </div>
                <div className="ts-card-info">
                  <p className="ts-card-label">Incompleted Interviews</p>
                  <p className="ts-card-value">{incompletedInterviewCount}</p>
                </div>
              </div>
            
          </div>
          
          {/* Recent Job Posts */}
          <div className="ts-content-card">
            <div className="ts-card-header">
              <div className="ts-header-title">
                <SparklesIcon      Icon className="recruiter-dashboard__icon-container recruiter-dashboard__icon-blue" />
                <h2 className="ts-heading">Recent Job Posts</h2>
              </div>
              <Link to="/publicposts" className="ts-view-all-link">
                View Posted Jobs
                <ChevronRightIcon className="ts-chevron-icon" />
              </Link>
            </div>
            
            <div className="ts-card-list">
              {(jobPosts || []).slice(0, 3).map((job, index) => (
                <div key={job?.id || index} className="ts-list-item">
                  <div className="ts-item-content">
                    <div className="ts-item-info">
                      <div className="ts-item-icon">
                        <FileTextIcon className="recruiter-dashboard__icon-container recruiter-dashboard__icon-purple" />
                      </div>
                      <div className="ts-item-details">
                        <h3 className="ts-item-title">{job?.title || 'Software Engineer'}</h3>
                        <div className="ts-status-container">
                          <span className="ts-status-badge ts-status-yellow">
                            {/* {'Applied'} */}
                            {job?.location || 'Remote'}

                          </span>
                        </div>
                        <div className="ts-item-meta">
                          <span className="ts-meta-text">Posted {getRelativeTime ? getRelativeTime(job?.created_at) : '2 days ago'}</span>
                        </div>
                      </div>
                    </div>
                    <button 
                      className="ts-action-button" 
                      onClick={handleSeePosts}
                    >
                      View
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            {(!jobPosts || jobPosts.length === 0) && (
              <div className="ts-empty-state">
                <BriefcaseIcon className="ts-empty-icon" />
                <h3 className="ts-empty-title">No job posts yet</h3>
                <p className="ts-empty-message">Check back soon for the latest job opportunities tailored for you.</p>
              </div>
            )}
          </div>
          
          {/* Recent Applications */}
          <div className="ts-content-card">
            <div className="ts-card-header">
              <div className="ts-header-title">
                <BriefcaseIcon className="recruiter-dashboard__icon-container recruiter-dashboard__icon-blue" />
                <h2 className="ts-heading">Recent Applied Jobs</h2>
              </div>
              <Link to="/applied-jobs" className="ts-view-all-link">
                View Applied Jobs
                <ChevronRightIcon className="ts-chevron-icon" />
              </Link>
            </div>
            
            <div className="ts-card-list">
              {(applications || []).slice(0, 3).map((app, index) => (
                <div key={app?.id || index} className="ts-list-item">
                  <div className="ts-item-content">
                    <div className="ts-item-info">
                      <div className="ts-item-icon">
                        <FileTextIcon className="recruiter-dashboard__icon-container recruiter-dashboard__icon-purple" />
                      </div>
                      <div className="ts-item-details">
                        <h3 className="ts-item-title">{app?.title || 'Software Engineer'}</h3>
                        <p className="ts-item-subtitle">{app?.location || 'Remote'}</p>
                        <div className="ts-status-container">
                          <span className="ts-status-badge ts-status-yellow">
                            {'Applied'}
                          </span>
                        </div>
                      </div>
                    </div>
                    <button 
                      className="ts-action-button" 
                      onClick={handleAppliedPosts}
                    >
                      View
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            {(!applications || applications.length === 0) && (
              <div className="ts-empty-state">
                <FileTextIcon className="ts-empty-icon" />
                <h3 className="ts-empty-title">No applications yet</h3>
                <p className="ts-empty-message">Start applying to jobs that match your skills and experience.</p>
                <Link to="/publicposts" className="ts-browse-button">
                  Browse Jobs
                </Link>
              </div>
            )}
          </div>
        </main>
      </div>
      
      {/* Full width sections starting after Recent Applications */}
      <div className="ts-full-width-sections">
        {/* Interviews Grid - Now full width */}
        <div className="interviews-grid-full">
          <div className="interviews-grid-container">
            {/* Completed Interviews */}
            <div className="interview-card"> 
              <div className="interview-card-header">
                <div className="header-title">
                  <CheckCircleIcon className="recruiter-dashboard__icon-container recruiter-dashboard__icon-green" />
                  <h2 className="header-text">Completed Interviews</h2>
                </div>
                <Link to="/interview/completed" className="view-all-link">
                  View All
                  <ChevronRightIcon className="chevron-icon" />
                </Link>
              </div>
              
              <div className="interview-list">
                {interview.slice(0, 2).map((app, index) => (
                  <div key={app?.id || index} className="interview-item">
                    <div className="interview-content">
                      <div className="interview-info">
                        <h3 className="interview-title">{app?.title || 'Senior Developer'}</h3>
                        <p className="interview-location">{app?.location || 'Remote'}</p>
                        <div className="interview-meta">
                          <span className="status-badge completed-badge">
                            Completed
                          </span>
                          <span className="interview-date">{app?.date || 'March 15, 2023'}</span>
                        </div>
                      </div>
                      <button 
                        className="action-button"
                        onClick={handleInterviewDone}
                      >
                        View
                      </button>
                    </div>
                  </div>
                ))}
                
                {(!interview || interview.length === 0) && (
                  <div className="empty-state">
                    <p className="empty-text">No completed interviews yet</p>
                  </div>
                )}
              </div>
            </div>
            
            {/* Upcoming Interviews */}
            <div className="interview-card">
              <div className="interview-card-header">
                <div className="header-title">
                  <ClockIcon className="recruiter-dashboard__icon-container recruiter-dashboard__icon-orange" />
                  <h2 className="header-text">Incompleted Interviews</h2>
                </div>
                <Link to="/interview/incompleted" className="view-all-link">
                  View All
                  <ChevronRightIcon className="chevron-icon" />
                </Link>
              </div>
              
              <div className="interview-list">
                {incompleteInterview.slice(0, 2).map((app, index) => (
                  <div key={app?.id || index} className="interview-item">
                    <div className="interview-content">
                      <div className="interview-info">
                        <h3 className="interview-title">{app?.title || 'Frontend Developer'}</h3>
                        <p className="interview-location">{app?.location || 'Remote'}</p>
                        <div className="interview-meta">
                          <span className="status-badge pending-badge">
                            Incompleted
                          </span>
                          <span className="interview-date">{app?.date || 'March 22, 2023'}</span>
                        </div>
                      </div>
                      <button 
                        className="action-button"
                        onClick={handleIncompleteInterview}
                      >
                        View
                      </button>
                    </div>
                  </div>
                ))}
                
                {(!incompleteInterview || incompleteInterview.length === 0) && (
                  <div className="empty-state">
                    <p className="empty-text">No pending interviews</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* <div className="additional-sections-full">
          <div className="section-card-full">
            <div className="section-header">
              <div className="header-title">
                <HeartIcon className="header-icon heart-icon" />
                <h2 className="header-text">Saved Jobs</h2>
              </div>
            </div>
            
            <div className="job-list-full">
              {savedJobs.map((job, index) => (
                <div key={index} className="job-item">
                  <div className="job-content">
                    <div className="company-logo">
                      <img 
                        src={job.company === 'Arbisoft' ? Arbisoft : Netsol} 
                        alt={job.company} 
                        className="logo-image"
                      />
                    </div>
                    <div className="job-info">
                      <h3 className="job-role">{job.role}</h3>
                      <p className="job-company">{job.company} • {job.location}</p>
                      <span className="job-salary">{job.salary}</span>
                    </div>
                    <button className="favorite-button">
                      <HeartIcon className="favorite-icon" />
                    </button>
                  </div>
                </div>
              ))}
            </div> */}
          {/* </div> */}
          
          {/* Learning Path */}
          
        {/* </div>
        
        <div className="section-card-full events-section-full">
          <div className="section-header">
            <div className="header-title">
              <CalendarClockIcon className="header-icon calendar-icon" />
              <h2 className="header-text">Events & Workshops</h2>
            </div>
          </div> */}
          
          {/* <div className="events-list-full">
            {events.map((event, index) => (
              <div key={index} className="event-item">
                <div className="event-content">
                  <div className="event-date-block">
                    <span className="event-month">{event.month}</span>
                    <span className="event-day">{event.date}</span>
                  </div>
                  <div className="event-info">
                    <h3 className="event-title">{event.title}</h3>
                    <p className="event-details">{event.type} • {event.time}</p>
                  </div> */}
                  {/* <button className="join-button">
                    Join
                  </button> */}
                {/* </div>
              </div>
            ))} */}
          {/* </div> */}
        {/* </div> */}
      </div>
    </div>
  </div>
  )
}

export default CandidateDashboard;