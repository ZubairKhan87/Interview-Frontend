import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, Briefcase } from 'lucide-react';
import axiosInstance from '../api/axiosConfig';
import InterviewAlert from '../alerts/InterviewAlert';

const CandidateAppliedJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [candidateId, setCandidateId] = useState(null);
  const [hoveredId, setHoveredId] = useState(null);
  const [showDialog, setShowDialog] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);

  const navigate = useNavigate();

  // Debug function to log what's happening
  const debugLog = (message, data) => {
    console.log(`DEBUG: ${message}`, data);
  };

  useEffect(() => {
    debugLog("Component mounted", null);
    const loadData = async () => {
      try {
        debugLog("Starting data fetch", null);
        await fetchCandidateId();
        await fetchAppliedJobs();
      } catch (err) {
        console.error('Error in initial data load:', err);
        setError('Failed to load data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, []);

  const fetchCandidateId = async () => {
    try {
      debugLog("Fetching candidate ID", null);
      const response = await axiosInstance.get('chat/current-candidate/');
      if (response && response.data && response.data.id) {
        debugLog("Candidate ID fetched", response.data.id);
        setCandidateId(response.data.id);
      } else {
        console.warn("Candidate ID response was invalid", response);
      }
    } catch (err) {
      console.error('Error fetching candidate ID:', err);
    }
  };

  const fetchAppliedJobs = async () => {
    try {
      debugLog("Fetching applied jobs", null);
      const response = await axiosInstance.get('job_posting/candidate/applied-jobs/');
      
      if (response && response.data) {
        // Make sure we're dealing with an array
        const jobsData = Array.isArray(response.data) ? response.data : [];
        debugLog(`Jobs fetched: ${jobsData.length}`, jobsData);
        
        // Clean up the data to ensure it's safe for rendering
        const cleanedJobs = jobsData.map(job => ({
          ...job,
          id: job.id || Math.random().toString(36).substr(2, 9),
          title: job.title || 'Untitled Job',
          description: job.description || 'No description available',
          skills: Array.isArray(job.skills) ? job.skills : [],
          experience_level: job.experience_level || 'Not specified',
          location: job.location || 'Not specified',
          application_date: job.application_date || null
        }));
        
        setJobs(cleanedJobs);
      } else {
        debugLog("No jobs data in response", response);
        setJobs([]);
      }
    } catch (err) {
      console.error('Error fetching applied jobs:', err);
      setError(err.message || 'Failed to fetch jobs');
      setJobs([]);
    }
  };

  const handleStartInterview = (job) => {
    debugLog("Starting interview for job", job.id);
    setSelectedJob(job);
    setShowDialog(true);
  };

  const handleProceed = () => {
    if (selectedJob && candidateId) {
      debugLog("Proceeding to face verification", {
        jobId: selectedJob.id,
        candidateId: candidateId
      });
      console.log("Navigating to chat with jobId:", selectedJob.id, "and candidateId:", candidateId);
      navigate('/chat', {
        state: {
          jobId: selectedJob.id,
          candidateId: candidateId,
          jobTitle: selectedJob.title,
          candidateName: selectedJob.full_name || 'Candidate'
        }
      });
      setShowDialog(false);
    } else {
      console.error("Cannot proceed - missing job or candidate ID", {
        selectedJob,
        candidateId
      });
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Date unavailable';
    
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (e) {
      console.error('Error formatting date:', e);
      return 'Invalid date';
    }
  };

  // Safe render method to prevent React child errors
  const safeRender = (content) => {
    if (content === null || content === undefined) {
      return '';
    }
    if (typeof content === 'object') {
      return JSON.stringify(content);
    }
    return content;
  };

  if (loading) {
    return (
      <div className="page-container">
        <div className="loading-container">
          <p className="loading-text">Loading your applications...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-container">
        <div className="error-container">
          <p className="error-text">Error: {safeRender(error)}</p>
          <button 
            className="btn btn-primary mt-4" 
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="content-wrapper">
        <div className="page-header">
          <button 
            className="btn btn-primary" 
            onClick={() => navigate('/candidate-dashboard')}
          >
            <ArrowLeft size={16} /> Back
          </button>
          <h2 className="page-title">Your Applied Jobs</h2>
        </div>

        <div className="grid-container">
          {jobs && jobs.length > 0 ? (
            jobs.map((job, index) => (
              <div
                key={`job-${index}-${job.id || ''}`}
                className={`card ${hoveredId === job.id ? 'card-hovered' : ''}`}
                onMouseEnter={() => setHoveredId(job.id)}
                onMouseLeave={() => setHoveredId(null)}
                style={{
                  willChange: 'transform, box-shadow',
                  transform: 'translateZ(0)',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                }}
              >
                <div className="card-content">
                  <div className="card-header" style={{ position: 'relative' }}>
                    <div className="flex items-center gap-2">
                      <Briefcase className="text-gray-600" size={20} />
                      <h3 className="card-title1">{safeRender(job.title)}</h3>
                    </div>
                    <div className="time-badge-aligned">
                      <Clock size={14} />
                      <span>{formatDate(job.application_date)}</span>
                    </div>
                  </div>

                  <div className="card-body1">
                    <div className="info-section1">
                      <h4 className="section-title1">Description</h4>
                      <p className="description-text1">{safeRender(job.description)}</p>
                    </div>

                    <div className="info-section1">
                      <h4 className="section-title1">Required Skills</h4>
                      <div className="tags-container1">
                        {Array.isArray(job.skills) && job.skills.length > 0 ? (
                          job.skills.map((skill, skillIndex) => (
                            <span 
                              key={`skill-${index}-${skillIndex}`}
                              className="tag skill-tag"
                              style={{ display: 'inline-block' }}
                            >
                              {safeRender(skill)}
                            </span>
                          ))
                        ) : (
                          <span>No skills specified</span>
                        )}
                      </div>
                    </div>

                    <div className="info-section1">
                      <h4 className="section-title1">Experience Level</h4>
                      <p className="text">{safeRender(job.experience_level)}</p>
                    </div>

                    <div className="info-section1">
                      <h4 className="section-title1">Location</h4>
                      <p className="text">{safeRender(job.location)}</p>
                    </div>

                    <div className="button-group">
                      <button
                        className="btn btn-primary"
                        onClick={() => handleStartInterview(job)}
                        style={{ position: 'relative' }}
                      >
                        Start Interview
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="empty-state">
              <p className="empty-text">You haven't applied to any jobs yet.</p>
            </div>
          )}
        </div>
      </div>
      
      {showDialog && (
        <InterviewAlert
          open={showDialog}
          onClose={() => setShowDialog(false)}
          onProceed={handleProceed}
        />
      )}
    </div>
  );
};

export default CandidateAppliedJobs;