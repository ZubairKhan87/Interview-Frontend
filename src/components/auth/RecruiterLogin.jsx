import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../../styles/Login.css";
import { useUser } from "../context/UserContext";

const RecruiterLogin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showError, setShowError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [activeField, setActiveField] = useState('');
  const { updateUser } = useUser();

  const navigate = useNavigate();

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setShowError(false);
  
    try {
      const response = await axios.post(
        "http://localhost:8000/api/authentication/recruiter/",
        {
          username,
          password,
        }
      );
      
      console.log('Login response:', response.data); // Debug
      
      if (!response.data.access || !response.data.refresh) {
        throw new Error('Missing tokens in response');
      }
      
      localStorage.setItem("access", response.data.access);
      localStorage.setItem("refresh", response.data.refresh);
      localStorage.setItem("username", username);
      updateUser(username,"recruiter");
      // Verify tokens were stored
      console.log('Stored tokens:', {
        access: localStorage.getItem('access'),
        refresh: localStorage.getItem('refresh')
      });
      
      navigate("/recruiter-dashboard");
    } catch (err) {
      console.error('Login error:', err); // Debug
      const errorMessage = "Incorrect username or password.";
      setError(errorMessage);
      setShowError(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`login-page ${mounted ? 'fade-in' : ''}`}>
      <div className="background-circles">
        <div className="circle"></div>
        <div className="circle"></div>
      </div>

      <div className="animated-background">
        <div className="gradient-sphere"></div>
      </div>

      <div className="login-container">
        {/* Left Side - Branding */}
        <div className="branding-section">
          <div className="brand-content">
            <h1 className="main-title">
              Welcome to {' '}
              <span className="gradient-text">AI-Powered Interviewing System</span>
            </h1>
            <p className="subtitle">
              Transform your hiring process with intelligent interviews powered by AI
            </p>
            
            <div className="features-grid">
              {[
               { title: 'Smart Analysis', icon: '🔍', delay: '0s' },
               { title: 'Real-time Feedback', icon: '⚡', delay: '0.2s' },
               { title: 'AI Assessment', icon: '🤖', delay: '0.4s' },
               { title: 'Skill Evaluation', icon: '📊', delay: '0.6s' }
              ].map((feature) => (
                <div 
                  key={feature.title}
                  className="feature-card"
                  style={{ '--delay': feature.delay }}
                >
                  <div className="feature-icon">{feature.icon}</div>
                  <p>{feature.title}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="form-section">
          <div className="login-form-container">
            <div className="form-header">
              <h2 className="form-title gradient-text">Recruiter Login</h2>
            </div>
            
            <form onSubmit={handleLogin} className="login-form">
            <label htmlFor="username">Username</label>

              <div className={`input-group floating-label ${activeField === 'username' ? 'focused' : ''}`}>
                <input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onFocus={() => setActiveField('username')}
                  onBlur={() => setActiveField('')}
                  className="input-field"
                  placeholder=" "
                  required
                />
                <div className="input-border"></div>
              </div>
              <label htmlFor="password">Password</label>

              <div className={`input-group floating-label ${activeField === 'password' ? 'focused' : ''}`}>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setActiveField('password')}
                  onBlur={() => setActiveField('')}
                  className="input-field"
                  placeholder=" "
                  required
                />
                <div className="input-border"></div>
              </div>

              {showError && (
                <div className="error-message">
                  <div className="error-icon">⚠️</div>
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="login-button"
              >
                <div className="button-content">
                  {isLoading ? (
                    <>
                      <div className="modern-spinner"></div>
                      <span>Authenticating...</span>
                    </>
                  ) : (
                    <>
                      <span>Login</span>
                      <span className="button-icon">→</span>
                    </>
                  )}
                </div>
              </button>

              <div className="links-section">
                <p>
                  Don't have an Account ?{" "}                  
                  <a href="/recruiter-signup" className="modern-link">
                    <span className="link-text">Sign up here</span>
                  </a>
                {/* </p> */}
                <p>
                  Are you a Candidate?{" "}
                  <a href="/candidate-login" className="modern-link">
                    <span className="link-text">Login as Candidate</span>
                  </a>
                </p>
                  
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecruiterLogin;