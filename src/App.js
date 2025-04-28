import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import CollegeList from "./components/CollegeList";
import RecommendationForm from "./components/RecommendationForm";
import Home from "./components/Home";
import Preferences from "./components/Preferences";
import Favorites from "./components/Favorites";
import ProtectedRoute from "./components/ProtectedRoute";
import { ToastContainer } from "react-toastify";
import LoginAndRegister from "./components/LoginAndRegister";
import Navbar from "./components/Navbar";
import EachCollege from "./components/EachCollege";

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => !!localStorage.getItem("userId"));

  useEffect(() => {
    const checkAuth = () => setIsAuthenticated(!!localStorage.getItem("userId"));
    window.addEventListener("storage", checkAuth);
    return () => window.removeEventListener("storage", checkAuth);
  }, []);

  const handleLogout = () => { 
    localStorage.removeItem("userId");
    localStorage.removeItem("token");
    setIsAuthenticated(false); // Update authentication state
  };

  return (
    <Router>
      <ToastContainer style={{ marginTop: "40px" }} position="top-right" autoClose={3500} hideProgressBar={true} newestOnTop closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
      {isAuthenticated && <Navbar onLogout={handleLogout} />}
      <Routes>
        {/* Redirect logged-in users away from the login page */}
        <Route path="/" element={isAuthenticated ? <Navigate to="/home" /> : <LoginAndRegister setIsAuthenticated={setIsAuthenticated} />} />

        {/* Protected Routes */}
        <Route path="/home" element={<ProtectedRoute isAuthenticated={isAuthenticated}><Home /></ProtectedRoute>} />
        <Route path="/colleges" element={<ProtectedRoute isAuthenticated={isAuthenticated}><CollegeList /></ProtectedRoute>} />
        <Route path="/recommend" element={<ProtectedRoute isAuthenticated={isAuthenticated}><RecommendationForm /></ProtectedRoute>} />
        <Route path="/preferences" element={<ProtectedRoute isAuthenticated={isAuthenticated}><Preferences /></ProtectedRoute>} />
        <Route path="/favorites" element={<ProtectedRoute isAuthenticated={isAuthenticated}><Favorites /></ProtectedRoute>} />
        <Route path="/colleges/:collegeId" element={<ProtectedRoute isAuthenticated={isAuthenticated}><EachCollege /></ProtectedRoute>} />

        {/* Redirect unknown routes */}
        <Route path="*" element={<Navigate to={isAuthenticated ? "/home" : "/"} />} />
      </Routes>
    </Router>
  );
};

export default App;
