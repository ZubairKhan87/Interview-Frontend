// import React, { useState, useEffect } from 'react';
// import { useNavigate, useLocation } from 'react-router-dom';
// import { ArrowLeft as ArrowLeftIcon, Clock as ClockIcon, Search as SearchIcon, Filter as FilterIcon, Briefcase } from 'lucide-react';
// import '../../styles/JobPosts.css';
// import "../../styles/filter.css";
// import { useUser } from '../context/UserContext';
// const BASE_API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// const AllPosts = () => {
//   // Don't destructure useUser() result - just use it directly when needed
//   const userContext = useUser();
  
//   const [allJobs, setAllJobs] = useState([]);
//   const [filteredJobs, setFilteredJobs] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [hoveredId, setHoveredId] = useState(null);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [filters, setFilters] = useState({
//     experience_level: '',
//     skills: '',
//     posted_within: '',
//     jobTitle: '',
//   });
//   const [showFilters, setShowFilters] = useState(false);
//   const navigate = useNavigate();

//   // Fetch jobs
//   useEffect(() => {
//     const fetchJobs = async () => {
//       setLoading(true);
//       try {
//         // Always log what we're trying to fetch to help with debugging
//         console.log("Fetching jobs from:", `${BASE_API_URL}/api/job_posting/publicposts/`);
        
//         const accessToken = localStorage.getItem('access');
//         if (!accessToken) {
//           console.warn("No access token found");
//         }

//         const headers = {};
//         if (accessToken) {
//           headers['Authorization'] = `Bearer ${accessToken}`;
//         }
        
//         const response = await fetch(`${BASE_API_URL}/api/job_posting/publicposts/`, {
//           headers: headers
//         });

//         console.log("API response status:", response.status);

//         if (!response.ok) {
//           throw new Error(`Failed to fetch jobs: ${response.status}`);
//         }

//         const data = await response.json();
//         console.log("Jobs data received:", data ? data.length : 0, "items");
        
//         // Ensure data is an array before sorting
//         if (Array.isArray(data)) {
//           // Add defensive check for created_at property
//           const sortedJobs = data.sort((a, b) => {
//             const dateA = a?.created_at ? new Date(a.created_at) : new Date(0);
//             const dateB = b?.created_at ? new Date(b.created_at) : new Date(0);
//             return dateB - dateA;
//           });
          
//           setAllJobs(sortedJobs);
//           setFilteredJobs(sortedJobs);
//         } else {
//           console.error("Expected array from API but got:", data);
//           setAllJobs([]);
//           setFilteredJobs([]);
//         }
//       } catch (err) {
//         console.error("Error fetching jobs:", err);
//         setError(err.message || "Failed to load jobs");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchJobs();
//   }, []);

//   // Apply filters
//   useEffect(() => {
//     if (!Array.isArray(allJobs)) {
//       console.warn("allJobs is not an array:", allJobs);
//       setFilteredJobs([]);
//       return;
//     }
    
//     if (allJobs.length === 0) {
//       setFilteredJobs([]);
//       return;
//     }
    
//     try {
//       // Work with a clean copy of jobs - filter out any null/undefined entries
//       let result = allJobs.filter(job => job !== null && job !== undefined);

//       // Apply search filter
//       if (searchTerm && searchTerm.trim()) {
//         const searchLower = searchTerm.toLowerCase().trim();
//         result = result.filter(job => {
//           const title = job.title ? job.title : "";
//           const description = job.description ? job.description : "";
//           return title.toLowerCase().includes(searchLower) || 
//                  description.toLowerCase().includes(searchLower);
//         });
//       }

//       // Apply job title filter
//       if (filters.jobTitle && filters.jobTitle.trim()) {
//         const titleLower = filters.jobTitle.toLowerCase().trim();
//         result = result.filter(job => {
//           const title = job.title ? job.title : "";
//           return title.toLowerCase().includes(titleLower);
//         });
//       }

//       // Apply experience level filter
//       if (filters.experience_level) {
//         result = result.filter(job => {
//           const expLevel = job.experience_level ? job.experience_level : "";
//           return expLevel.toLowerCase() === filters.experience_level.toLowerCase();
//         });
//       }

//       // Apply skills filter
//       if (filters.skills && filters.skills.trim()) {
//         const searchSkills = filters.skills.toLowerCase().split(',').map(skill => skill.trim());
//         result = result.filter(job => {
//           // Add null check for skills
//           const jobSkills = job.skills && Array.isArray(job.skills) 
//             ? job.skills.map(skill => typeof skill === 'string' ? skill.toLowerCase() : '')
//             : [];
          
//           return searchSkills.some(searchSkill => 
//             jobSkills.some(jobSkill => jobSkill.includes(searchSkill))
//           );
//         });
//       }

//       // Apply posted within filter
//       if (filters.posted_within) {
//         const now = new Date();
        
//         result = result.filter(job => {
//           if (!job.created_at) return false;
          
//           const jobDate = new Date(job.created_at);
//           if (isNaN(jobDate.getTime())) return false;
          
//           const timeDiff = now - jobDate;
//           const daysDiff = timeDiff / (1000 * 60 * 60 * 24);

//           switch (filters.posted_within) {
//             case '1h':
//               return daysDiff <= 1/24;
//             case '24h':
//               return daysDiff <= 1;
//             case '7d':
//               return daysDiff <= 7;
//             case '30d':
//               return daysDiff <= 30;
//             default:
//               return true;
//           }
//         });
//       }

//       // Sort the filtered results by date (most recent first)
//       result.sort((a, b) => {
//         const dateA = a?.created_at ? new Date(a.created_at) : new Date(0);
//         const dateB = b?.created_at ? new Date(b.created_at) : new Date(0);
//         return dateB - dateA;
//       });
      
//       setFilteredJobs(result);
//     } catch (err) {
//       console.error("Error applying filters:", err);
//       // On error, just show all jobs
//       setFilteredJobs(allJobs);
//     }
//   }, [searchTerm, filters, allJobs]);

//   const handleFilterChange = (e) => {
//     const { name, value } = e.target;
//     setFilters(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   const clearFilters = () => {
//     setFilters({
//       experience_level: '',
//       skills: '',
//       posted_within: '',
//       jobTitle: '',
//     });
//     setSearchTerm('');
//   };

//   const handleApplyJob = (job) => {
//     navigate('/application-form', { state: { jobData: job } });
//   };

//   const formatPostedDate = (dateString) => {
//     if (!dateString) return "Unknown";
    
//     try {
//       const now = new Date();
//       const createdAt = new Date(dateString);
      
//       if (isNaN(createdAt.getTime())) {
//         return "Invalid date";
//       }
      
//       const diffInSeconds = Math.floor((now - createdAt) / 1000);

//       if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
//       if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
//       if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
//       if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d ago`;
//       if (diffInSeconds < 31536000) return `${Math.floor(diffInSeconds / 2592000)}mo ago`;
//       return `${Math.floor(diffInSeconds / 31536000)}y ago`;
//     } catch (error) {
//       console.error("Error formatting date:", error);
//       return "Unknown";
//     }
//   };

//   // Handle loading state
//   if (loading) {
//     return (
//       <div className="loading-container">
//         <p className="loading-text">Loading jobs...</p>
//       </div>
//     );
//   }

//   // Handle error state
//   if (error) {
//     return (
//       <div className="error-container">
//         <p className="error-text">Error: {error}</p>
//         <button 
//           onClick={() => window.location.reload()} 
//           className="btn btn-primary"
//         >
//           Try Again
//         </button>
//       </div>
//     );
//   }

//   return (
//     <div className="page-container">
//       <div className="content-wrapper">
//         <div className="page-header">
//           <button className="btn btn-primary" onClick={() => navigate('/candidate-dashboard')}>
//             <ArrowLeftIcon size={16} /> Back
//           </button>
//           <h2 className="page-title">Available Job Positions</h2>
//         </div>

//         <div className="search-filter-container">
//           <div className="search-bar">
//             <SearchIcon size={20} />
//             <input
//               type="text"
//               placeholder="Search by title or description..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               className="search-input"
//             />
//           </div>

//           <button
//             className="btn btn-secondary filter-toggle"
//             onClick={() => setShowFilters(!showFilters)}
//           >
//             <FilterIcon size={20} />
//             {showFilters ? 'Hide Filters' : 'Show Filters'}
//           </button>
//         </div>

//         {showFilters && (
//           <div className="filters-panel">
//             <div className="filter-group">
//               <label>Job Title</label>
//               <input
//                 type="text"
//                 name="jobTitle"
//                 value={filters.jobTitle}
//                 onChange={handleFilterChange}
//                 placeholder="Filter by job title..."
//                 className="filter-input"
//               />
//             </div>

//             <div className="filter-group">
//               <label>Experience Level</label>
//               <select
//                 name="experience_level"
//                 value={filters.experience_level}
//                 onChange={handleFilterChange}
//                 className="filter-select"
//               >
//                 <option value="">All Levels</option>
//                 <option value="Basic">Basic</option>
//                 <option value="Intermediate">Intermediate</option>
//                 <option value="Expert">Expert</option>
//               </select>
//             </div>

//             <div className="filter-group">
//               <label>Skills (comma-separated)</label>
//               <input
//                 type="text"
//                 name="skills"
//                 value={filters.skills}
//                 onChange={handleFilterChange}
//                 placeholder="e.g., Python, React, Django"
//                 className="filter-input"
//               />
//             </div>

//             <div className="filter-group">
//               <label>Posted Within</label>
//               <select
//                 name="posted_within"
//                 value={filters.posted_within}
//                 onChange={handleFilterChange}
//                 className="filter-select"
//               >
//                 <option value="">Any Time</option>
//                 <option value="1h">Last 1 hour</option>
//                 <option value="24h">Last 24 hours</option>
//                 <option value="7d">Last 7 days</option>
//                 <option value="30d">Last 30 days</option>
//               </select>
//             </div>

//             <button
//               className="btn btn-secondary clear-filters"
//               onClick={clearFilters}
//             >
//               Clear All Filters
//             </button>
//           </div>
//         )}

//         <div className="grid-container">
//           {filteredJobs && filteredJobs.length > 0 ? (
//             filteredJobs.map((job, index) => {
//               // Make sure job is not null or undefined before rendering
//               if (!job) return null;
              
//               return (
//                 <div 
//                   key={job.id || `job-${index}`} 
//                   className={`card ${hoveredId === job.id ? 'card-hovered' : ''}`}
//                   onMouseEnter={() => setHoveredId(job.id)}
//                   onMouseLeave={() => setHoveredId(null)}
//                 >
//                   <div className="card-content">
//                     <div className="time-badge">
//                       <ClockIcon size={14} />
//                       <span>{formatPostedDate(job.created_at)}</span>
//                     </div>

//                     <div className="card-body1">
//                       <Briefcase className="text-gray-600" size={20} />

//                       <h3 className="card-title1">{job.title || "Untitled Position"}</h3>
                      
//                       <div className="info-section1">
//                         <h4 className="section-title1">Description</h4>
//                         <p className="description-text1">{job.description || "No description available"}</p>
//                       </div>

//                       <div className="info-section1">
//                         <h4 className="section-title1">Required Skills</h4>
//                         <div className="tags-container1">
//                           {job.skills && Array.isArray(job.skills) && job.skills.length > 0 ? (
//                             job.skills.map((skill, idx) => (
//                               <span key={`${job.id}-skill-${idx}`} className="tag skill-tag">
//                                 {typeof skill === 'string' ? skill : ''}
//                               </span>
//                             ))
//                           ) : (
//                             <span className="no-skills">No specific skills mentioned</span>
//                           )}
//                         </div>
//                       </div>

//                       <div className="info-section1">
//                         <h4 className="section-title1">Experience Level</h4>
//                         <p className="text">{job.experience_level || "Not specified"}</p>
//                       </div>
                      
//                       <div className="info-section1">
//                         <h4 className="section-title1">Location</h4>
//                         <p className="text">{job.location || "Not specified"}</p>
//                       </div>

//                       <button
//                         className={`btn btn-primary compact w-full ${hoveredId === job.id ? 'btn-hover' : ''}`}
//                         onClick={() => handleApplyJob(job)}
//                       >
//                         Apply Now
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               );
//             })
//           ) : (
//             <div className="empty-state">
//               <p className="empty-text">No jobs match your search criteria.</p>
//               <button 
//                 onClick={clearFilters} 
//                 className="btn btn-secondary mt-4"
//               >
//                 Clear All Filters
//               </button>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AllPosts;


import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft as ArrowLeftIcon, Clock as ClockIcon, Search as SearchIcon, Filter as FilterIcon,Briefcase } from 'lucide-react';
import '../../styles/JobPosts.css';
import "../../styles/filter.css"; // Assuming AllPosts uses filter.css
import { useUser } from '../context/UserContext';
const AllPosts = () => {
  const { name, profileImage } = useUser();
  
  const [allJobs, setAllJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hoveredId, setHoveredId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    experience_level: '',
    skills: '',
    posted_within: '',
    jobTitle: '', // Added new filter for job title
  });
  const [showFilters, setShowFilters] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      const accessToken = localStorage.getItem('access');
      
      try {
        const response = await fetch('http://127.0.0.1:8000/api/job_posting/publicposts/', {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch jobs');
        }

        const data = await response.json();
        // Sort jobs by date before setting them
        const sortedJobs = data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        setAllJobs(sortedJobs);
        setFilteredJobs(sortedJobs);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  useEffect(() => {
    let result = [...allJobs];

    // Apply search filter
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase().trim();
      result = result.filter(job => 
        job.title.toLowerCase().includes(searchLower) ||
        job.description.toLowerCase().includes(searchLower)
      );
    }

    // Apply job title filter
    if (filters.jobTitle.trim()) {
      const titleLower = filters.jobTitle.toLowerCase().trim();
      result = result.filter(job => 
        job.title.toLowerCase().includes(titleLower)
      );
    }

    // Apply experience level filter
    if (filters.experience_level) {
      result = result.filter(job => 
        job.experience_level.toLowerCase() === filters.experience_level.toLowerCase()
      );
    }

    // Apply skills filter
    if (filters.skills.trim()) {
      const searchSkills = filters.skills.toLowerCase().split(',').map(skill => skill.trim());
      result = result.filter(job => {
        const jobSkills = job.skills.map(skill => skill.toLowerCase());
        return searchSkills.some(searchSkill => 
          jobSkills.some(jobSkill => jobSkill.includes(searchSkill))
        );
      });
    }

    // Apply posted within filter
    if (filters.posted_within) {
      const now = new Date();
      const jobDate = (date) => new Date(date);
      
      result = result.filter(job => {
        const timeDiff = now - jobDate(job.created_at);
        const daysDiff = timeDiff / (1000 * 60 * 60 * 24);

        switch (filters.posted_within) {
          case '1h':
            return daysDiff <= 1/24;
          case '24h':
            return daysDiff <= 1;
          case '7d':
            return daysDiff <= 7;
          case '30d':
            return daysDiff <= 30;
          default:
            return true;
        }
      });
    }

    // Sort the filtered results by date (most recent first)
    result.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    
    setFilteredJobs(result);
  }, [searchTerm, filters, allJobs]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      experience_level: '',
      skills: '',
      posted_within: '',
      jobTitle: '', // Clear job title filter as well
      // Location:'',
    });
    setSearchTerm('');
  };

  const handleApplyJob = (job) => {
    navigate('/application-form', { state: { jobData: job } });
  };

  const formatPostedDate = (dateString) => {
    const now = new Date();
    const createdAt = new Date(dateString);
    const diffInSeconds = Math.floor((now - createdAt) / 1000);

    if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    if (diffInSeconds < 31536000) return `${Math.floor(diffInSeconds / 2592000)}mo ago`;
    return `${Math.floor(diffInSeconds / 31536000)}y ago`;
  };

  // const handleSearchChange = (e) => {
  //   setSearchTerm(e.target.value);
  // };

 if (loading) {
  return (
    <div className="loading-container">
      <span className="loader"></span>
      <p className="loading-text">Loading jobs, please wait...</p>
    </div>
  );
}

if (error) {
  return (
    <div className="error-container">
      <span className="error-icon">⚠️</span>
      <p className="error-text">Oops! Failed to load jobs.<br />{error}</p>
    </div>
  );
}


  return (
    
    <div className="page-container">
      
      <div className="content-wrapper">
        <div className="page-header">
          <button className="btn btn-primary" onClick={() => navigate('/candidate-dashboard')}>
            <ArrowLeftIcon size={16} /> Back
          </button>
          <h2 className="page-title">Available Job Positions</h2>
        </div>

        <div className="search-filter-container">
          <div className="search-bar">
            <SearchIcon size={20} />
            <input
              type="text"
              placeholder="Search by title or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>

          <button
            className="btn btn-secondary filter-toggle"
            onClick={() => setShowFilters(!showFilters)}
          >
            <FilterIcon size={20} />
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </button>
        </div>

        {showFilters && (
          <div className="filters-panel">
            <div className="filter-group">
              <label>Job Title</label>
              <input
                type="text"
                name="jobTitle"
                value={filters.jobTitle}
                onChange={handleFilterChange}
                placeholder="Filter by job title..."
                className="filter-input"
              />
            </div>

            <div className="filter-group">
              <label>Experience Level</label>
              <select
                name="experience_level"
                value={filters.experience_level}
                onChange={handleFilterChange}
                className="filter-select"
              >
                <option value="">All Levels</option>
                <option value="Basic">Basic</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Expert">Expert</option>
              </select>
            </div>

            <div className="filter-group">
              <label>Skills (comma-separated)</label>
              <input
                type="text"
                name="skills"
                value={filters.skills}
                onChange={handleFilterChange}
                placeholder="e.g., Python, React, Django"
                className="filter-input"
              />
            </div>

            <div className="filter-group">
              <label>Posted Within</label>
              <select
                name="posted_within"
                value={filters.posted_within}
                onChange={handleFilterChange}
                className="filter-select"
              >
                <option value="">Any Time</option>
                <option value="1h">Last 1 hours</option>
                <option value="24h">Last 24 hours</option>
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
              </select>
            </div>

            <button
              className="btn btn-secondary clear-filters"
              onClick={clearFilters}
            >
              Clear All Filters
            </button>
          </div>
        )}

        <div className="grid-container">
          {filteredJobs.length > 0 ? (
            filteredJobs.map((job) => (
              <div 
                key={job.id} 
                className={`card  ${hoveredId === job.id ? 'card-hovered' : ''}`}
                onMouseEnter={() => setHoveredId(job.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                <div className="card-content">
                  <div className="time-badge">
                    <ClockIcon size={14} />
                    <span>{formatPostedDate(job.created_at)}</span>
                  </div>

                  <div className="card-body1">
                  <Briefcase className="text-gray-600" size={20} />

                    <h3 className="card-title1">{job.title}</h3>
                    
                    <div className="info-section1">
                      <h4 className="section-title1">Description</h4>
                      <p className="description-text1">{job.description}</p>
                    </div>

                    <div className="info-section1">
                      <h4 className="section-title1">Required Skills</h4>
                      <div className="tags-container1">
                        {job.skills.map((skill, index) => (
                          <span key={index} className="tag skill-tag">
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

                    <button
                      className={`btn btn-primary compact w-full ${hoveredId === job.id ? 'btn-hover' : ''}`}
                      onClick={() => handleApplyJob(job)}
                      style={{ position: 'relative' }}
                    >
                      Apply Now
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="empty-state">
              <p className="empty-text">No jobs match your search criteria.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AllPosts;