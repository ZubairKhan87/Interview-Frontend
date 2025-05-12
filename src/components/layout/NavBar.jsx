import { useState,useEffect } from "react";
import { useUser } from "../context/UserContext"; // Import User Context
import { BellIcon, ChevronDownIcon, LogOutIcon,UserIcon } from "lucide-react"; // Using lucide-react icons
import logo from '../../assets/logo.png';

const Navbar = () => {
  const { username,name, profileImage,userType, handleLogout,handleSeeProfile } = useUser();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
   // Add this for debugging
   useEffect(() => {
    console.log("Current user state:", { 
      username, 
      name, 
      userType,
      localStorageUserType: localStorage.getItem("userType")
    });
  }, [username, name, userType]);
  return (
    <nav className="ts-nav">
      <div className="ts-nav-container">
        <div className="ts-nav-content">
          <div className="ts-logo-container">
            
          <a className="logo d-flex align-items-center">
              <img 
                src={logo} 
                alt="TalentScout Logo" 
                style={{ 
                  width: `50px`, 
                  height: `50px`, 
                  objectFit: 'contain' 
                }} 
              />
              <h1 className="ts-logo">TalentScout</h1>
            </a>
          </div>
          
          <div className="ts-profile-actions">
            <button className="ts-notification-btn">
              <BellIcon className="ts-icon" />
              <span className="ts-notification-badge">3</span>
            </button>
            
            <div className="ts-profile-menu-container">
              <div 
                className="ts-profile-trigger"
                onClick={() => setShowProfileMenu(!showProfileMenu)}
              >
                <img 
                  src={profileImage ? profileImage : "/api/placeholder/32/32"} 
                  alt="Profile" 
                  className="ts-profile-img"
                />            
                <span className="ts-profile-name">{username}</span>
                <ChevronDownIcon className="ts-dropdown-icon" />
              </div>
              
              {showProfileMenu && (
                <div className="ts-dropdown-menu">
                  
                  <button className="ts-dropdown-item" onClick={handleSeeProfile}>
                  <UserIcon className="ts-dropdown-icon-small" />
                  Profile
                </button>

                  <button className="ts-dropdown-item" onClick={handleLogout}>
                    <LogOutIcon className="ts-dropdown-icon-small" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
