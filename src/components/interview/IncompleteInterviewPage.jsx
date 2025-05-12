import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, Briefcase } from 'lucide-react';
import axiosInstance from '../api/axiosConfig';

const IncompleteInterviewPage = () => {
  const [incompleteInterview, setIncompleteInterview] = useState([]);
  const [interviewCount, setInterviewCount] = useState(0)
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [candidateId, setCandidateId] = useState(null);
  const [hoveredId, setHoveredId] = useState(null);
  const [showDialog, setShowDialog] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  

  const navigate = useNavigate();

  useEffect(() => {
    fetchCandidateId();
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

  const fetchIncompleteInterviews=()=>{
    axiosInstance.get('job_posting/candidate/interview/incomplete/')
    .then((response)=>{
      const incompleteInterviewData = response.data;
      console.log("Incomplete interview data",incompleteInterviewData);
      setIncompleteInterview(incompleteInterviewData);
      setLoading(false);
    })
    .catch((error)=>{
      setError(error.message);
      setLoading(false);
    })
  }

  const handleRequestInterview = async (interviewId) => {
    console.log("Requesting interview with id:", interviewId);
    try {
        const response = await axiosInstance.post(`job_posting/candidate/interview/${interviewId}/request/`);
        console.log("Interview status updated successfully.");
        
        // Show success message if the response is successful
        if (response.status === 200) {
          setSuccessMessage(prev => ({
            ...prev,
            [interviewId]: 'Interview request sent successfully! We wish you best of Luck!'
          }));
            // Optional: Auto-hide after 3 seconds
            // / Navigate to the next page after a short delay
          setTimeout(() => {
            // Clear the success message
            setSuccessMessage("");
            
            // Navigate to interview preparation page
            // Assuming you're using react-router-dom
            navigate('/candidate-dashboard', {
              state: {
                interviewId: interviewId,
                message: 'Interview request sent successfully! We wish you best of Luck!'
              }
            });
          }, 1500); // 1.5 second delay to show success message
            
          // Refresh the incomplete interviews list
          fetchIncompleteInterviews();
        }
    } catch (error) {
        console.error("Error requesting interview:", error);
    }
};


  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
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
          <p className="error-text">Error: {error}</p>
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
          {incompleteInterview.length > 0 ? (
            incompleteInterview.map((job) => (
              <div
                key={job.id}
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
                      <h3 className="card-title1">{job.title}</h3>
                    </div>
                    <div className="time-badge-aligned">
                      {/* <Clock size={14} /> */}
                      {/* <span>{formatDate(job.application_date)}</span> */}
                    </div>
                  </div>

                  <div className="card-body1">
                    <div className="info-section1">
                      <h4 className="section-title1">Description</h4>
                      <p className="description-text1">{job.description}</p>
                    </div>

                    <div className="info-section1">
                      <h4 className="section-title1">Required Skills</h4>
                      <div className="tags-container1">
                        {Array.isArray(job.skills) && job.skills.map((skill, index) => (
                          <span 
                            key={index} 
                            className="tag skill-tag"
                            style={{ display: 'inline-block' }}
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="info-section1">
                      <h4 className="section-title1">Experience Level</h4>
                      <p className="text">{job.experience_level}</p>
                    </div>

                    <div className="info-section1">
                      <h4 className="section-title1">Location</h4>
                      <p className="text">{job.location}</p>
                    </div>
                    <div key={job.id} className="button-group">
                      <button
                        className="btn btn-primary"
                        onClick={() => handleRequestInterview(job.id)}
                        style={{ position: 'relative' }}
                      >
                        Request Reinterview
                      </button>
                       {/* Success Message */}
                       {successMessage[job.id] && (
                                <div className="alert alert-success mt-3">
                        {successMessage[job.id]}
                  </div>
                            )}
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
    </div>
  );
};

export default IncompleteInterviewPage;