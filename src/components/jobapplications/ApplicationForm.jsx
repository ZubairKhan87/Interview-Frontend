import React, { useState, useEffect } from "react";
import "../../styles/ApplicationForm.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faEnvelope, faGraduationCap, faFileUpload, faFilePdf } from "@fortawesome/free-solid-svg-icons";
import { useLocation, useNavigate } from 'react-router-dom';
import CustomAlert from '../alerts/CustomAlert';
import { useUser } from "../context/UserContext";
const BASE_API_URL = import.meta.env.VITE_API_URL;

function ApplicationForm() {
  const { name, profileImage } = useUser();
  const { state } = useLocation();
  const { jobData } = state;
  
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    qualification: "",
    marks: "",
  });
  const [resumeFile, setResumeFile] = useState(null);
  const [resumeFileName, setResumeFileName] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  // Add upload progress state
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const navigate = useNavigate();
  
  // Error state
  const [error, setError] = useState({
    show: false,
    message: "",
    type: "" // 'error' or 'success'
  });

  // Fetch candidate profile data on component mount
  useEffect(() => {
    const fetchCandidateProfile = async () => {
      setIsLoading(true);
      try {
        const accessToken = localStorage.getItem("access");
        const response = await fetch(`${BASE_API_URL}/api/job_posting/current-candidate/profile/`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (response.ok) {
          const profileData = await response.json();
          
          // Pre-fill form with existing data
          setFormData({
            fullName: profileData.name || "",
            email: profileData.email || "",
            qualification: profileData.education?.toLowerCase() || "", // Convert to match your select options
            marks: "",
          });
          
          // Handle resume information
          if (profileData.resume) {
            // Extract file name from URL
            const resumeUrl = profileData.resume;
            const fileName = resumeUrl.split('/').pop();
            setResumeFileName(fileName);
          }
        }
      } catch (error) {
        console.error("Error fetching candidate profile:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCandidateProfile();
  }, []);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file && (file.type === "application/pdf" || file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document")) {
      setResumeFile(file);
      setResumeFileName(file.name);
      setError({ show: false, message: "", type: "" });
    } else {
      setError({
        show: true,
        message: "Please upload a valid PDF or DOCX file.",
        type: "error"
      });
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
    setError({ show: false, message: "", type: "" }); // Clear error on input change
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.fullName || !formData.email || !formData.qualification || (!resumeFile && !resumeFileName)) {
      setError({
        show: true,
        message: "Please fill out all required fields.",
        type: "error"
      });
      return;
    }

    const form = new FormData();
    form.append("job_id", jobData.id);
    form.append("full_name", formData.fullName);
    form.append("email", formData.email);
    form.append("qualification", formData.qualification);
    form.append("marks", formData.marks || 0);
    
    // Only append resume if a new file was selected
    if (resumeFile) {
      form.append("resume", resumeFile);
    }

    const accessToken = localStorage.getItem("access");

    try {
      // Set uploading state to true before starting the fetch
      setIsUploading(true);
      setUploadProgress(0);
      
      // Create a new XMLHttpRequest for progress tracking
      const xhr = new XMLHttpRequest();
      
      xhr.upload.addEventListener('progress', function(e) {
        if (e.lengthComputable) {
          const percentComplete = Math.round((e.loaded / e.total) * 100);
          setUploadProgress(percentComplete);
        }
      });
      
      xhr.addEventListener('load', function() {
        if (xhr.status >= 200 && xhr.status < 300) {
          setIsUploading(false);
          setError({
            show: true,
            message: "Application submitted successfully!",
            type: "success"
          });
          setTimeout(() => {
            navigate("/applied-jobs");
          }, 2000);
        } else {
          setIsUploading(false);
          let errorMessage = "An error occurred while submitting the application.";
          try {
            const errorData = JSON.parse(xhr.responseText);
            errorMessage = errorData.detail || "You can't apply more than one time for a single job";
          } catch (e) {
            // If parsing fails, use default error message
          }
          setError({
            show: true,
            message: errorMessage,
            type: "error"
          });
        }
      });
      
      xhr.addEventListener('error', function() {
        setIsUploading(false);
        setError({
          show: true,
          message: "Network error occurred while submitting the application.",
          type: "error"
        });
      });
      
      xhr.open('POST', `${BASE_API_URL}/api/job_posting/apply/`, true);
      xhr.setRequestHeader('Authorization', `Bearer ${accessToken}`);
      xhr.send(form);
      
    } catch (error) {
      setIsUploading(false);
      setError({
        show: true,
        message: "An error occurred while submitting the application.",
        type: "error"
      });
    }
  };

  if (isLoading) {
    return (
      <div className="screenBackground">
        <div className="app">
          <div className="form-container">
            <h1 className="form-title">Loading Application Form...</h1>
            <div className="loading-spinner"></div> {/* Add a loading spinner class in your CSS */}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="screenBackground">
      <div className="app">
        <div className="form-container">
          <h1 className="form-title">Application Form</h1>
          <p className="pre-filled-notice">Your profile information has been pre-filled. You can edit if needed.</p>
          <form className="form-grid" onSubmit={handleSubmit}>
            {/* Full Name */}
            <div className="form-field">
              <label htmlFor="fullName">Full Name</label>
              <div className="input-wrapper">
                <FontAwesomeIcon icon={faUser} className="icon" />
                <input
                  type="text"
                  id="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Write your full name"
                />
              </div>
            </div>

            {/* Email Address */}
            <div className="form-field">
              <label htmlFor="email">Email Address</label>
              <div className="input-wrapper">
                <FontAwesomeIcon icon={faEnvelope} className="icon" />
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Write your Email Address"
                />
              </div>
            </div>

            {/* Highest Qualification */}
            <div className="highest-qualification-field">
              <label htmlFor="qualification">
                Highest Qualification 
                {formData.qualification && (
                  <span className="prefilled-indicator">(Pre-filled from your profile)</span>
                )}
              </label>
              <div className="input-wrapper">
                <FontAwesomeIcon icon={faGraduationCap} className="icon" />
                <select 
                  id="qualification" 
                  value={formData.qualification} 
                  onChange={handleChange}
                  className={formData.qualification ? "prefilled-select" : ""}
                >
                  <option value="">Select your highest qualification</option>
                  <option value="bachelors">Bachelors</option>
                  <option value="masters">Masters</option>
                  <option value="phd">Ph.D.</option>
                </select>
              </div>
            </div>

            {/* Resume Upload */}
            <div className="form-field">
              <label htmlFor="resume">Resume CV</label>
              <div className="upload-wrapper">
                <FontAwesomeIcon icon={faFilePdf} className="icon pdf-upload-icon" />
                <input
                  type="file"
                  id="resume"
                  onChange={handleFileUpload}
                  accept=".pdf,.docx"
                  hidden
                />
                <label htmlFor="resume" className="upload-label">
                  <FontAwesomeIcon icon={faFileUpload} className="icon" />
                  <p>{resumeFileName ? "Change your resume" : "Click to upload your resume"}</p>
                  <p className="small-text">Upload PDF or DOCX files up to 500MB</p>
                </label>
              </div>
              {resumeFileName && (
                <p className="file-name">
                  <span className="current-file">Current resume: {resumeFileName}</span>
                  {resumeFile && <span className="new-file"> (New: {resumeFile.name})</span>}
                </p>
              )}
            </div>

            {/* Upload Progress Indicator - Show only when uploading */}
            {isUploading && (
              <div className="upload-progress-container">
                <div className="upload-progress-label">Uploading Resume: {uploadProgress}%</div>
                <div className="upload-progress-bar">
                  <div 
                    className="upload-progress-fill" 
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
                <div className="upload-status-message">
                  {uploadProgress < 100 
                    ? "Please wait while we upload your resume..." 
                    : "Processing your application..."}
                </div>
              </div>
            )}

            {/* Buttons and Error/Success Message */}
            <div className="form-footer">
              <div className="form-buttons">
                <button 
                  type="button" 
                  className="cancel-button" 
                  onClick={() => navigate(-1)}
                  disabled={isUploading}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="apply-button"
                  disabled={isUploading}
                >
                  {isUploading ? "Submitting..." : "Apply Now"}
                </button>
              </div>
              
              {error.show && (
                <div className={`message-container ${error.type}`}>
                  {error.message}
                </div>
              )}
            </div>

            {/* Warning */}
            <div className="warning-box">
              <p>Ensure all the provided information and your resume highlight your skills and experience.</p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ApplicationForm;