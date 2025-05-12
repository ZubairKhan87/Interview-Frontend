import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, Briefcase } from 'lucide-react';
import axiosInstance from '../api/axiosConfig';
import InterviewAlert from '../alerts/InterviewAlert';
// const BASE_API_URL = import.meta.env.VITE_API_URL; // Unused variable removed

const CandidateAppliedJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [candidateId, setCandidateId] = useState(null);
  const [hoveredId, setHoveredId] = useState(null);
  const [showDialog, setShowDialog] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    // Handle API calls separately to better isolate errors
    const loadData = async () => {
      try {
        await fetchCandidateId();
        await fetchAppliedJobs();
      } catch (err) {
        console.error('Error loading data:', err);
        setError('Failed to load data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, []);

  const fetchCandidateId = async () => {
    try {
      const response = await axiosInstance.get('chat/current-candidate/');
      if (response && response.data) {
        setCandidateId(response.data.id);
      }
    } catch (err) {
      console.error('Error fetching candidate ID:', err);
      // Don't set loading to false here, as we still need to fetch jobs
    }
  };

  const fetchAppliedJobs = async () => {
    try {
      const response = await axiosInstance.get('job_posting/candidate/applied-jobs/');
      if (response && response.data) {
        setJobs(Array.isArray(response.data) ? response.data : []);
      } else {
        setJobs([]);
      }
    } catch (err) {
      console.error('Error fetching applied jobs:', err);
      setError(err.message || 'Failed to fetch jobs');
      setJobs([]);
    }
  };

  const handleSeeDetails = (job) => {
    navigate('/job-details', { state: { job } });
  };

  const handleStartInterview = (job) => {
    setSelectedJob(job);
    setShowDialog(true);
  };

  const handleProceed = () => {
    if (selectedJob) {
      navigate('/face-verification', {
        state: {
          jobId: selectedJob.id,
          candidateId: candidateId,
          jobTitle: selectedJob.title,
          candidateName: selectedJob.full_name
        }
      });
      setShowDialog(false);
    }
  };

  const formatDate = (dateString) => {
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

  // Render loading state
  if (loading) {
    return (
      <div className="page-container">
        <div className="loading-container">
          <p className="loading-text">Loading your applications...</p>
        </div>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="page-container">
        <div className="error-container">
          <p className="error-text">Error: {error}</p>
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
            jobs.map((job) => (
              <div
                key={job.id || index} // Fallback to index if id is missing
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
                      <h3 className="card-title1">{job.title || 'Untitled Job'}</h3>
                    </div>
                    <div className="time-badge-aligned" >
                      <Clock size={14} />
                      <span>{job.application_date ? formatDate(job.application_date) : 'Date unavailable'}</span>
                    </div>
                  </div>

                  <div className="card-body1">
                    <div className="info-section1">
                      <h4 className="section-title1">Description</h4>
                      <p className="description-text1">{job.description || 'No description available'}</p>
                    </div>

                    <div className="info-section1">
                      <h4 className="section-title1">Required Skills</h4>
                      <div className="tags-container1">
                        {Array.isArray(job.skills) && job.skills.length > 0 ? (
                          job.skills.map((skill, index) => (
                            <span 
                              key={index} 
                              className="tag skill-tag"
                              style={{ display: 'inline-block' }}
                            >
                              {skill}
                            </span>
                          ))
                        ) : (
                          <span>No skills specified</span>
                        )}
                      </div>
                    </div>

                    <div className="info-section1">
                      <h4 className="section-title1">Experience Level</h4>
                      <p className="text">{job.experience_level || 'Not specified'}</p>
                    </div>

                    <div className="info-section1">
                      <h4 className="section-title1">Location</h4>
                      <p className="text">{job.location || 'Not specified'}</p>
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
      
      {/* Only render InterviewAlert if it's imported correctly */}
      {InterviewAlert && (
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