import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import {useNavigate } from 'react-router-dom';
const UserContext = createContext();
const BASE_API_URL = import.meta.env.VITE_API_URL;

export const UserProvider = ({ children }) => {
  const [username, setUsername] = useState(localStorage.getItem("username") || "Guest");
  const [userType, setUserType] = useState(localStorage.getItem("userType") || null);
  const [profileImage, setProfileImage] = useState(null);
  const [name, setName] = useState("");
  const navigate = useNavigate();


  // Function to fetch profile details
  const fetchProfileData = async () => {
    try {
      const accessToken = localStorage.getItem("access");
      if (!accessToken) return;
  
      // Store the current userType before the request
      const currentUserType = localStorage.getItem("userType");
      console.log("Before profile fetch - userType:", currentUserType);
      let endpoint=""
      if (currentUserType==='candidate'){
        endpoint=`${BASE_API_URL}/api/authentication/profile/candidate/image/`
      }
      else  if (currentUserType==='recruiter'){
        endpoint=`${BASE_API_URL}/api/authentication/profile/recruiter/image/`
      }
      const response = await axios.get(endpoint, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
  
      if (response.data.profile_image) {
        setProfileImage(response.data.profile_image);
        
        // Set name and username if available
        if (response.data.candidate_name) {
          setName(response.data.candidate_name);
          setUsername(response.data.candidate_name);
        }
        
        // Always preserve userType - this is critical
        if (currentUserType) {
          console.log("Preserving userType:", currentUserType);
          setUserType(currentUserType);
        }
      }
    } catch (error) {
      console.error("Error fetching profile data:", error);
    }
  };
  // In UserProvider
useEffect(() => {
  const initializeUser = async () => {
    // Get stored values first
    const storedUsername = localStorage.getItem("username") || "Guest";
    const storedUserType = localStorage.getItem("userType");
    
    // Set state from storage
    setUsername(storedUsername);
    if (storedUserType) {
      setUserType(storedUserType);
      console.log("UserContext initialized with:", {storedUsername, storedUserType});
    }
    
    // Then fetch profile data
    await fetchProfileData();
  };

  initializeUser();

  const handleUserChange = () => {
    const storedUsername = localStorage.getItem("username") || "Guest";
    const storedUserType = localStorage.getItem("userType");
    console.log("User change detected:", {storedUsername, storedUserType});
    
    setUsername(storedUsername);
    if (storedUserType) {
      setUserType(storedUserType);
    }
  };

  window.addEventListener("userLoggedIn", handleUserChange);

  return () => {
    window.removeEventListener("userLoggedIn", handleUserChange);
  };
}, []);

  // Function to set user data after login
  const updateUser = (newUsername, newUserType) => {
    console.log(`Updating user: ${newUsername}, type: ${newUserType}`);
    
    // First update localStorage
    localStorage.setItem("username", newUsername);
    localStorage.setItem("userType", newUserType);
    
    // Then update state
    setUsername(newUsername);
    setUserType(newUserType);
  
    // Notify components about the change
    window.dispatchEvent(new Event("userLoggedIn"));
    
    // Fetch profile data after a small delay to ensure localStorage is updated
    setTimeout(() => {
      fetchProfileData();
    }, 100);
  };
  const handleLogout = () => {
    localStorage.clear();
    window.dispatchEvent(new Event("userLoggedIn")); // Notify navbar to reset
    window.location.href = "/logout";
  };

  const handleSeeProfile=()=>{
    navigate("/profile")
  }

  return (
    <UserContext.Provider value={{ username, profileImage, name,userType, 
      updateUser, handleLogout,handleSeeProfile }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
