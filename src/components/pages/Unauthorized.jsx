import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../../styles/Unauthorized.css'; 

const Unauthorized = () => {
  const [fade, setFade] = useState(false);
  
  useEffect(() => {
    // Add fade-in effect
    setFade(true);
    
    // Add warning animation
    const timer = setTimeout(() => {
      const warningIcon = document.querySelector('.warning-icon');
      if (warningIcon) {
        warningIcon.classList.add('pulse');
      }
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`unauthorized-container ${fade ? 'fade-in' : ''}`}>
      <div className="unauthorized-card">
        <div className="warning-icon">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path 
              d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
            <path 
              d="M12 8V12" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
            <circle cx="12" cy="16" r="0.5" stroke="currentColor" strokeWidth="3" />
          </svg>
        </div>
        
        <h1 className="error-title">Unauthorized Access</h1>
        
        <div className="error-divider"></div>
        
        <p className="error-message">
          You don't have permission to access this page.
          Please log in with the appropriate account.
        </p>
        
        <div className="button-container">
          <Link to="/" className="home-button">
            <span className="button-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                <polyline points="9 22 9 12 15 12 15 22"></polyline>
              </svg>
            </span>
            Return to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;