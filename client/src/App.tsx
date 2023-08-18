import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginForm from "./page/login/Login";
import RegistrationForm from "./page/registration/Registration";
import Dashboard from "./page/dashboard/Dashboard";

const App = () => {
  const [authenticated, setAuthenticated] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  const handleLogin = (status: boolean, userId?: string) => {
    setAuthenticated(status);
    console.log('handlelogin', status, userId)
    if (status && userId) {
      console.log(userId);
      
      setCurrentUserId(userId)
    } else {
      setCurrentUserId(null);
    }
  };

  useEffect(() => {
    console.log('authenticated: ', authenticated);
    
  }, [authenticated])

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              authenticated ? (
                <Navigate to="/dashboard" />
              ) : (
                <LoginForm onLogin={handleLogin} />
              )
            }
          />
          <Route
            path="/register"
            element={<RegistrationForm onRegistration={handleLogin} />}
          />
          <Route
            path="/dashboard"
            element={
              authenticated ? (
                <Dashboard currentUserId={currentUserId} onLogout={handleLogin} />
              ) : (
                <Navigate to="/" />
              )
            }
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;