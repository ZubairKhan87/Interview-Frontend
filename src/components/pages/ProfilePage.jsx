import { useState, useEffect } from "react";
import { useUser } from "../context/UserContext";
import axios from "axios";
import { Link } from "react-router-dom";
import {
  User,
  Briefcase,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Edit,
  FileText,
  Award,
  Book,
  Link as LinkIcon,
  UploadCloud,
} from "lucide-react";
import "../../styles/ProfilePage.css"; //  a CSS file for styles
import axiosInstance from "../api/axiosConfig";
const BASE_API_URL = import.meta.env.VITE_API_URL;

const ProfilePage = () => {
  // Get userType from UserContext
  const { username, profileImage, userType } = useUser();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({});
  const [resumeFile, setResumeFile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [profile, setProfileImage] = useState("");
  const [seperateProfile, setSeperateProfile] = useState({});
  // Add debugging for development
  useEffect(() => {
    console.log("ProfilePage - Current User:", {
      username,
      userType,
      storedUserType: localStorage.getItem("userType"),
    });
  }, [username, userType]);

  useEffect(() => {
    const fetchProfileDetails = async () => {
      try {
        setLoading(true);
        const accessToken = localStorage.getItem("access");
        if (!accessToken) {
          setError("Authentication token not found");
          setLoading(false);
          return;
        }

        // Get userType from localStorage as a fallback
        const currentUserType = userType || localStorage.getItem("userType");
        console.log("ProfilePage fetching with userType:", currentUserType);

        // Decide which endpoint to use based on user type
        let endpoint =
          `${BASE_API_URL}/api/authentication/profile/image/`;

        if (currentUserType === "candidate") {
          // Candidate-specific endpoint if needed
          endpoint =
            `${BASE_API_URL}/api/authentication/profile/candidate/image/`;
        } else if (currentUserType === "recruiter") {
          // Recruiter-specific endpoint if needed
          endpoint =
            `${BASE_API_URL}api/authentication/profile/recruiter/image/`;
        }

        const response = await axios.get(endpoint, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });

        setSeperateProfile({
          name: response.data.candidate_name,
          profile_image: response.data.profile_image,
        });
        console.log("sep profile data is ", seperateProfile);
        // console.log('image',profileData.profile_image)
        setLoading(false);
      } catch (err) {
        console.error("Error fetching profile details:", err);
        setError("Failed to load profile data. Please try again later.");
        setLoading(false);
      }
    };

    fetchProfileDetails();
  }, [userType]);

  // API service for candidate profile
  // API service for candidate profile
  const fetchCandidateProfile = async () => {
    const currentUserType = userType || localStorage.getItem("userType");
    let endpoint = "";
    if (currentUserType === "candidate") {
      endpoint = `${BASE_API_URL}/api/authentication/candidate/profile/`;
    } else if (currentUserType === "recruiter") {
      endpoint = `${BASE_API_URL}/api/authentication/recruiter/profile/`;
    }
    try {
      const accessToken = localStorage.getItem("access"); // Changed to 'access' to match  other code

      const response = await axios.get(endpoint, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });
      // Ensure skills is an array
      if (response.data.skills && !Array.isArray(response.data.skills)) {
        response.data.skills = response.data.skills
          .split(",")
          .map((s) => s.trim());
      } else if (!response.data.skills) {
        response.data.skills = [];
      }
      console.log("Profile data fetched:", response.data);
      setProfileData(response.data);
      setFormData(response.data); // Initialize form data with current profile data

      return response.data;
    } catch (error) {
      console.error("Error fetching profile:", error);
      throw error;
    }
  };

  const updateCandidateProfile = async (profileData) => {
    const currentUserType = userType || localStorage.getItem("userType");
    let endpoint = "";
    if (currentUserType === "candidate") {
      endpoint = `${BASE_API_URL}/api/authentication/candidate/profile/`;
    } else if (currentUserType === "recruiter") {
      endpoint = `${BASE_API_URL}/api/authentication/recruiter/profile/`;
    }
    try {
      const accessToken = localStorage.getItem("access");

      const response = await axios.put(endpoint, profileData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });

      // Process skills to ensure it's always an array
      // let skills = [];
      // if (response.data.skills) {
      //   if (typeof response.data.skills === 'string') {
      //     skills = response.data.skills.split(',').map(s => s.trim());
      //   } else if (Array.isArray(response.data.skills)) {
      //     skills = response.data.skills;
      //   }
      // }
      // response.data.skills = skills;

      setProfileData(response.data);
      console.log("response ", response.data);
      return response.data;
    } catch (error) {
      console.error("Error updating profile:", error);
      throw error;
    }
  };

  const uploadResume = async (resumeFile) => {
    try {
      const accessToken = localStorage.getItem("access");

      const formData = new FormData();
      formData.append("resume", resumeFile);

      const response = await axios.post(
        `${BASE_API_URL}/api/authentication/candidate/resume/`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            // Don't set Content-Type here, axios will do it automatically for FormData
          },
        }
      );

      // Update the local profile data with new resume info
      setProfileData((prev) => ({
        ...prev,
        resume_url: response.data.resume_url,
        resume_name: resumeFile.name, // Store the file name
        resume_uploaded_date: new Date().toLocaleDateString(), // Store upload date
      }));

      return response.data;
    } catch (error) {
      console.error("Error uploading resume:", error);
      throw error;
    }
  };
  // Load profile data on component mount
  useEffect(() => {
    fetchCandidateProfile();
  }, []);
  const handleProfileUpdate = async (updatedData) => {
    try {
      setLoading(true);
      const result = await updateCandidateProfile(updatedData);
      setProfileData(result.data);
      // Show success message
      alert("Profile updated successfully");
    } catch (err) {
      setError("Failed to update profile");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleResumeUpload = async (file) => {
    try {
      setLoading(true);
      const result = await uploadResume(file);
      // Update the profile data with new resume info if needed
      // Show success message
      alert("Resume uploaded successfully");
    } catch (err) {
      setError("Failed to upload resume");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle skill input (add/remove skills)
  const handleSkillsChange = (skills) => {
    setFormData((prev) => ({
      ...prev,
      skills: Array.isArray(skills)
        ? skills
        : skills.split(",").map((s) => s.trim()),
    }));
  };

  // Handle resume file selection
  const handleResumeChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setResumeFile(e.target.files[0]);
      // setProfileData(resumeFile)
    }
  };

  // Handle form submission
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Create a copy of formData to make changes
      const dataToSubmit = { ...formData };

      // Ensure skills is in the correct format for your API
      if (typeof dataToSubmit.skills === "string") {
        dataToSubmit.skills = dataToSubmit.skills
          .split(",")
          .map((s) => s.trim());
      }

      await updateCandidateProfile(dataToSubmit);

      if (resumeFile) {
        await uploadResume(resumeFile);
        setResumeFile(null);
      }

      setIsEditing(false);
      // Show success message
      alert("Profile updated successfully");
    } catch (err) {
      console.error("Form submission error:", err);
      alert("Failed to update profile. Please try again.");
    }
  };

  const handleImageChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Basic validation
    if (!file.type.startsWith("image/")) {
      alert("Please select an image file");
      return;
    }

    try {
      setIsUploading(true);

      // Create FormData to send file
      const formData = new FormData();
      formData.append("profile_image", file);

      const accessToken = localStorage.getItem("access");
      const currentUserType = userType || localStorage.getItem("userType");
      let endpoint =
        `${BASE_API_URL}/api/authentication/profile/image/candidate/upload/`;

      if (currentUserType === "candidate") {
        endpoint =
          `${BASE_API_URL}/api/authentication/profile/image/candidate/upload/`;
      } else if (currentUserType === "recruiter") {
        endpoint =
          `${BASE_API_URL}/api/authentication/profile/image/recruiter/upload/`;
      }
      const response = await axios.post(endpoint, formData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.profile_image) {
        setProfileImage(response.data.profile_image);
      }
    } catch (error) {
      if (error.response) {
        alert(error.response.data.error);
      } else {
        console.error("Error uploading image:", error);
        alert("Failed to upload image");
      }
    } finally {
      setIsUploading(false);
    }
  };
  // For demo purpose, generate mock data if API fails
  const generateMockData = () => {
    // Get userType from localStorage as a fallback if context value is null
    const currentUserType = userType || localStorage.getItem("userType");

    if (currentUserType === "recruiter") {
      return {
        name: username || "Jane Smith",
        email: "jane.smith@company.com",
        phone: "+1 (555) 123-4567",
        company: "Tech Innovations Inc.",
        position: "Senior HR Manager",
        location: "San Francisco, CA",
        joined_date: "2022-05-15",
        bio: "Experienced HR professional with 8+ years in tech recruitment. Passionate about connecting the right talent with the right opportunities.",
        company_website: "www.techinnovations.com",
        active_jobs: 12,
        total_hires: 78,
      };
    } else {
      return {
        name: username || "John Doe",
        email: "john.doe@example.com",
        phone: "+1 (555) 987-6543",
        headline: "Full Stack Developer",
        location: "Austin, TX",
        experience: "5 years",
        education: "B.S. Computer Science, University of Texas",
        skills: ["JavaScript", "React", "Node.js", "Python", "SQL", "AWS"],
        bio: "Passionate developer with experience in building scalable web applications. Always eager to learn new technologies and solve complex problems.",
        linkedin: "linkedin.com/in/johndoe",
        github: "github.com/johndoe",
        portfolio: "johndoe.dev",
      };
    }
  };

  // If loading fails, use mock data
  const displayData = profileData || (error && generateMockData());
  console.log("displayData", displayData);
  // Get userType from localStorage as a fallback if context value is null
  const currentUserType = userType || localStorage.getItem("userType");

  if (loading) {
    return (
      <div className="ts-profile-loading">
        <div className="ts-spinner"></div>
        <p>Loading profile information...</p>
      </div>
    );
  }

  console.log("Image URL being used:", displayData?.profile_image);

  return (
    <div className="ts-profile-page">
       <div className="ts-profile-header">
    <div className="ts-profile-content-wrapper">
      <div className="ts-profile-avatar-wrapper">
        <div className="ts-profile-avatar-container">
          <img
            src={seperateProfile?.profile_image || "/api/placeholder/128/128"}
            alt="Profile"
            className="ts-profile-avatar"
          />
          {(
    userType === "recruiter" ||
    (userType === "candidate" && !seperateProfile?.profile_image)
  ) && (
            <div className="ts-profile-upload-overlay">
              <input
                type="file"
                id="profile-image-upload"
                accept="image/*"
                onChange={handleImageChange}
                className="ts-file-input"
              />
            </div>
          )}
          <button className="ts-upload-photo-btn">
        <UploadCloud size={16} />
        <label htmlFor="profile-image-upload" className="ts-upload-btn">
          {isUploading ? "Uploading..." : "Upload Photo"}
        </label>
      </button>
        </div>
      </div>

      <div className="ts-profile-info-wrapper">
        <div className="ts-profile-header-info">
          <h1 className="ts-profile-name1">{displayData?.name}</h1>
          <p className="ts-profile-headline">
            {currentUserType === "recruiter"
              ? `${displayData?.company}`
              : displayData?.headline}
          </p>
          <p className="ts-profile-location">
            <MapPin size={16} className="ts-icon-small" />
            {displayData?.location || "Location not specified"}
          </p>
        </div>

        <button
          className="ts-edit-profile-btn"
          onClick={() => setIsEditing(!isEditing)}
        >
          <Edit size={16} />
          <span>{isEditing ? "Cancel Editing" : "Edit Profile"}</span>
        </button>
      </div>
      </div>
      </div>
      {isEditing ? (
        // Edit Profile Form
        <form onSubmit={handleSubmit} className="ts-profile-edit-form">
          <div className="ts-profile-content">
            <div className="ts-profile-main">
              <section className="ts-profile-section">
                <h2 className="ts-section-title">Basic Information</h2>
                <div className="ts-form-group">
                  <label htmlFor="name">Full Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name || ""}
                    onChange={handleInputChange}
                    className="ts-form-input"
                  />
                </div>
                <div className="ts-form-group">
                  <label htmlFor="headline">Bio</label>
                  <input
                    type="text"
                    id="headline"
                    name="headline"
                    value={formData.headline || ""}
                    onChange={handleInputChange}
                    className="ts-form-input"
                  />
                </div>
                <div className="ts-form-group">
                  <label htmlFor="location">Location</label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={formData.location || ""}
                    onChange={handleInputChange}
                    className="ts-form-input"
                  />
                </div>
              </section>

              <section className="ts-profile-section">
                <h2 className="ts-section-title">About</h2>
                <div className="ts-form-group">
                  {/* <label htmlFor="bio">Bio</label> */}
                  <textarea
                    id="bio"
                    name="bio"
                    value={formData.bio || ""}
                    onChange={handleInputChange}
                    className="ts-form-textarea"
                    rows={5}
                  />
                </div>
              </section>
              {userType === "candidate" && (
                <>
                  <section className="ts-profile-section">
                    <h2 className="ts-section-title">Skills</h2>
                    <div className="ts-form-group">
                      <label htmlFor="skills">Skills (comma separated)</label>
                      <input
                        type="text"
                        id="skills"
                        name="skills"
                        value={formData.skillsInput || ""}
                        onChange={(e) => {
                          const inputValue = e.target.value;
                          const skillsArray = inputValue
                            .split(",")
                            .map((s) => s.trim())
                            .filter((s) => s);

                          setFormData((prev) => ({
                            ...prev,
                            skillsInput: inputValue, // Store the raw input
                            skills: skillsArray, // Store the processed array
                          }));
                        }}
                        className="ts-form-input"
                      />
                    </div>
                  </section>

                  <section className="ts-profile-section">
                    <h2 className="ts-section-title">Experience</h2>
                    <div className="ts-form-group">
                      <label htmlFor="experience">Experience</label>
                      <input
                        type="text"
                        id="experience"
                        name="experience"
                        value={formData.experience || ""}
                        onChange={handleInputChange}
                        className="ts-form-input"
                      />
                    </div>
                  </section>

                  <section className="ts-profile-section">
                    <h2 className="ts-section-title">Education</h2>
                    <div className="ts-form-group">
                      <label htmlFor="education">Education</label>
                      <input
                        type="text"
                        id="education"
                        name="education"
                        value={formData.education || ""}
                        onChange={handleInputChange}
                        className="ts-form-input"
                      />
                    </div>
                  </section>

                  <section className="ts-profile-section">
                    <h2 className="ts-section-title">Professional Links</h2>
                    <div className="ts-form-group">
                      <label htmlFor="linkedin">LinkedIn URL</label>
                      <input
                        type="text"
                        id="linkedin"
                        name="linkedin"
                        value={formData.linkedin || ""}
                        onChange={handleInputChange}
                        className="ts-form-input"
                        placeholder="linkedin.com/in/yourprofile"
                      />
                    </div>
                    <div className="ts-form-group">
                      <label htmlFor="github">GitHub URL</label>
                      <input
                        type="text"
                        id="github"
                        name="github"
                        value={formData.github || ""}
                        onChange={handleInputChange}
                        className="ts-form-input"
                        placeholder="github.com/yourusername"
                      />
                    </div>
                    <div className="ts-form-group">
                      <label htmlFor="portfolio">Portfolio URL</label>
                      <input
                        type="text"
                        id="portfolio"
                        name="portfolio"
                        value={formData.portfolio || ""}
                        onChange={handleInputChange}
                        className="ts-form-input"
                        placeholder="yourportfolio.com"
                      />
                    </div>
                  </section>
                </>
              )}
            </div>

            <div className="ts-profile-sidebar">
              <section className="ts-profile-section ts-contact-section">
                <h2 className="ts-section-title">Contact Information</h2>
                <div className="ts-form-group">
                  <label htmlFor="email">Email</label>
                  {/* <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email || ''}
                    onChange={handleInputChange}
                    className="ts-form-input"
                  /> */}
                </div>
                <div className="ts-form-group">
                  <label htmlFor="phone">Phone</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone || ""}
                    onChange={handleInputChange}
                    className="ts-form-input"
                  />
                </div>
              </section>
              {userType === "candidate" && (
                <>
                  <section className="ts-profile-section">
                    <h2 className="ts-section-title">Resume</h2>
                    <div className="ts-form-group">
                      <label htmlFor="resume">Upload New Resume</label>
                      <input
                        type="file"
                        id="resume"
                        name="resume"
                        onChange={handleResumeChange}
                        className="ts-form-input-file"
                        accept=".pdf,.doc,.docx"
                      />
                    </div>
                  </section>
                </>
              )}
              {userType === "recruiter" && (
                <>
                  <section className="ts-profile-section">
                    <h2 className="ts-section-title">Company Information</h2>
                    <div className="ts-form-group">
                      <label htmlFor="company">Company Name</label>
                      <input
                        type="text"
                        id="company"
                        name="company"
                        value={formData.company || ""}
                        onChange={handleInputChange}
                        className="ts-form-input"
                      />
                    </div>
                    <div className="ts-form-group">
                      <label htmlFor="company_website">Company Website</label>
                      <input
                        type="text"
                        id="company_website"
                        name="company_website"
                        value={formData.company_website || ""}
                        onChange={handleInputChange}
                        className="ts-form-input"
                        placeholder="yourcompany.com"
                      />
                    </div>
                    <div className="ts-form-group">
                      <label htmlFor="industry">Industry</label>
                      <input
                        type="text"
                        id="industry"
                        name="industry"
                        value={formData.industry || ""}
                        onChange={handleInputChange}
                        className="ts-form-input"
                      />
                    </div>
                    <div className="ts-form-group">
                      <label htmlFor="company_size">Company Size</label>
                      <input
                        type="text"
                        id="company_size"
                        name="company_size"
                        value={formData.company_size || ""}
                        onChange={handleInputChange}
                        className="ts-form-input"
                        placeholder="e.g., 1-10, 11-50, 51-200, 201-500, 500+"
                      />
                    </div>
                  </section>

                  <section className="ts-profile-section">
                    <h2 className="ts-section-title">Professional Links</h2>
                    <div className="ts-form-group">
                      <label htmlFor="linkedin">LinkedIn URL</label>
                      <input
                        type="text"
                        id="linkedin"
                        name="linkedin"
                        value={formData.linkedin || ""}
                        onChange={handleInputChange}
                        className="ts-form-input"
                        placeholder="linkedin.com/in/yourprofile"
                      />
                    </div>
                    <div className="ts-form-group">
                      <label htmlFor="company_linkedin">Company LinkedIn</label>
                      <input
                        type="text"
                        id="company_linkedin"
                        name="company_linkedin"
                        value={formData.company_linkedin || ""}
                        onChange={handleInputChange}
                        className="ts-form-input"
                        placeholder="linkedin.com/company/yourcompany"
                      />
                    </div>
                  </section>
                </>
              )}
              {/* </div> */}
              <div className="ts-form-actions">
                <button type="submit" className="ts-save-profile-btn">
                  Save Profile
                </button>
                <button
                  type="button"
                  className="ts-cancel-btn"
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </form>
      ) : (
        // Display Profile View
        <div className="ts-profile-content">
          <div className="ts-profile-main">
            {/* Bio Section */}
            <section className="ts-profile-section">
              <h2 className="ts-section-title">About</h2>
              <p className="ts-profile-bio">
                {displayData?.bio || "No bio information provided."}
              </p>
            </section>

            {currentUserType === "recruiter" ? (
              <>
                {/* Recruiter Specific Sections */}
                <section className="ts-profile-section">
                  <h2 className="ts-section-title">Company Information</h2>
                  <div className="ts-info-grid">
                    <div className="ts-info-item">
                      <Briefcase size={18} className="ts-info-icon" />
                      <div>
                        <h3 className="ts-info-label">Company</h3>
                        <p className="ts-info-value">{displayData?.company}</p>
                      </div>
                    </div>
                    <div className="ts-info-item">
                      <LinkIcon size={18} className="ts-info-icon" />
                      <div>
                        <h3 className="ts-info-label">Website</h3>
                        <p className="ts-info-value">
                          {displayData?.company_website}
                        </p>
                      </div>
                    </div>
                  </div>
                </section>

                <section className="ts-profile-section">
                  <h2 className="ts-section-title">Recruitment Activity</h2>
                  <div className="ts-stats-grid">
                    <div className="ts-stat-card">
                      <div className="ts-stat-icon">
                        <FileText size={24} />
                      </div>
                      <div className="ts-stat-info">
                        <h3 className="ts-stat-value">
                          {displayData?.active_jobs || 0}
                        </h3>
                        <p className="ts-stat-label">Active Jobs</p>
                      </div>
                    </div>
                    <div className="ts-stat-card">
                      <div className="ts-stat-icon">
                        <User size={24} />
                      </div>
                      <div className="ts-stat-info">
                        <h3 className="ts-stat-value">
                          {displayData?.total_hires || 0}
                        </h3>
                        <p className="ts-stat-label">Total Hires</p>
                      </div>
                    </div>
                  </div>
                </section>
              </>
            ) : (
              <>
                {/* Candidate Specific Sections */}
                <section className="ts-profile-section">
                  <h2 className="ts-section-title">Skills</h2>
                  <div className="ts-skills-container">
                    {displayData?.skills && displayData.skills.length > 0 ? (
                      displayData.skills.map((skill, index) => (
                        <span key={index} className="ts-skill-tag">
                          {skill}
                        </span>
                      ))
                    ) : (
                      <p>No skills listed</p>
                    )}
                  </div>
                </section>
              </>
            )}

            {userType === "candidate" && (
              <>
                <section className="ts-profile-section">
                  <h2 className="ts-section-title">Experience</h2>
                  <div className="ts-info-item">
                    <Briefcase size={18} className="ts-info-icon" />
                    <div>
                      <h3 className="ts-info-value">
                        {displayData?.experience || "Not specified"}
                      </h3>
                    </div>
                  </div>
                </section>

                <section className="ts-profile-section">
                  <h2 className="ts-section-title">Education</h2>
                  <div className="ts-info-item">
                    <Book size={18} className="ts-info-icon" />
                    <div>
                      <h3 className="ts-info-value">
                        {displayData?.education || "Not specified"}
                      </h3>
                    </div>
                  </div>
                </section>
                <section className="ts-profile-section">
                  <h2 className="ts-section-title">Professional Links</h2>
                  <div className="ts-links-grid">
                    {displayData?.linkedin && (
                      <a
                        href={`https://${displayData.linkedin}`}
                        className="ts-social-link"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <span className="ts-social-icon linkedin">in</span>
                        <span className="ts-social-text">LinkedIn</span>
                      </a>
                    )}
                    {displayData?.github && (
                      <a
                        href={`https://${displayData.github}`}
                        className="ts-social-link"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <span className="ts-social-icon github">GH</span>
                        <span className="ts-social-text">GitHub</span>
                      </a>
                    )}
                    {displayData?.portfolio && (
                      <a
                        href={`https://${displayData.portfolio}`}
                        className="ts-social-link"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <span className="ts-social-icon portfolio">🌐</span>
                        <span className="ts-social-text">Portfolio</span>
                      </a>
                    )}
                  </div>
                </section>
              </>
            )}
          </div>
          <div className="ts-profile-sidebar">
            <section className="ts-profile-section ts-contact-section">
              <h2 className="ts-section-title">Contact Information</h2>
              <div className="ts-contact-info">
                <div className="ts-contact-item">
                  <Mail className="ts-contact-icon" />
                  <p>{displayData?.email || "Email not provided"}</p>
                </div>
                <div className="ts-contact-item">
                  <Phone className="ts-contact-icon" />
                  <p>{displayData?.phone || "Phone not provided"}</p>
                </div>
                <div className="ts-contact-item">
                  <Calendar className="ts-contact-icon" />
                  <p>Joined {displayData?.joined_date || "Recently"}</p>
                </div>
              </div>
            </section>

            {currentUserType === "candidate" && (
              <section className="ts-profile-section">
                <h2 className="ts-section-title">Resume</h2>
                <div className="ts-resume-preview">
                  <FileText size={24} className="ts-resume-icon" />
                  <div className="ts-resume-info">
                    <p className="ts-resume-title">Resume</p>
                    <p className="ts-resume-date">Uploaded on May 10, 2023</p>
                  </div>
                </div>
                <button
                  className="ts-update-resume-btn"
                  onClick={() => setIsEditing(true)}
                >
                  <UploadCloud size={16} />
                  <span>Update Resume</span>
                </button>
              </section>
            )}

            {/* {currentUserType === "recruiter" && (
              <section className="ts-profile-section">
                <h2 className="ts-section-title">Quick Actions</h2>
                <div className="ts-quick-actions">
                  <button className="ts-action-btn ts-post-job-btn">
                    <FileText size={16} />
                    <Link to="/JobPosting">Post New Job</Link>
                  </button>
                  
                  <button className="ts-action-btn ts-post-job-btn">
                    <User size={16} />
                    <Link to="/job-applicants"> View Applicants </Link>
                  </button>
                </div>
              </section>
            )} */}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
