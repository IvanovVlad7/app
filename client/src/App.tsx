import React, { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginForm from "./page/login/Login";
import RegistrationForm from "./page/registration/Registration";
import Dashboard from "./page/dashboard/Dashboard";

function App() {
  const [authenticated, setAuthenticated] = useState(false);
  const [user, setUser] = useState<string | null>(null);

  const handleLogin = (username: string) => {
    setAuthenticated(true);
    setUser(username);
  };

  const handleRegistration = () => {
    setAuthenticated(true);
    setUser(null);
    return <Navigate to="/dashboard" />;
  };

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
            element={<RegistrationForm onRegistration={handleRegistration} />}
          />
          <Route path="/dashboard" element={<Dashboard user={user} />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
