import { Navigate, Outlet } from 'react-router-dom';
import { useUser } from '../context/UserContext'; 

// ProtectedRoute for Recruiter Routes
export const RecruiterRoute = () => {
  const { userType } = useUser();
  
  if (!userType) {
    // If not logged in, redirect to recruiter login
    return <Navigate to="/recruiter-login" replace />;
  }
  
  if (userType !== 'recruiter') {
    // If logged in but not a recruiter, redirect to appropriate page
    return <Navigate to="/unauthorized" replace />;
  }
  
  // If recruiter, allow access to the route
  return <Outlet />;
};

// ProtectedRoute for Candidate Routes
export const CandidateRoute = () => {
  const { userType } = useUser();
  
  if (!userType) {
    // If not logged in, redirect to candidate login
    return <Navigate to="/candidate-login" replace />;
  }
  
  if (userType !== 'candidate') {
    // If logged in but not a candidate, redirect to appropriate page
    return <Navigate to="/unauthorized" replace />;
  }
  
  // If candidate, allow access to the route
  return <Outlet />;
};

// For routes that require any authentication
export const AuthenticatedRoute = () => {
  const { userType } = useUser();
  
  if (!userType) {
    // If not logged in, redirect to landing page
    return <Navigate to="/" replace />;
  }
  
  // Allow access to the route for any authenticated user
  return <Outlet />;
};