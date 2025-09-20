import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import UserContext from "./context/UserContext";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Workout from "./pages/Workout";

const API_BASE = process.env.REACT_APP_API_URL; // use .env variable

function App() {
  const [user, setUser] = useState({ id: null, isAdmin: null });
  const [loadingUser, setLoadingUser] = useState(true);

  const unsetUser = () => {
    localStorage.clear();
    setUser({ id: null, isAdmin: null });
  };

  // Fetch user on mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoadingUser(false);
      return;
    }

    const fetchProfile = async () => {
      try {
        const res = await fetch(`${API_BASE}/users/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        const data = await res.json();
        if (res.ok && data.user) {
          setUser({ id: data.user._id, isAdmin: data.user.isAdmin });
        } else {
          unsetUser();
        }
      } catch (err) {
        unsetUser();
      } finally {
        setLoadingUser(false);
      }
    };

    fetchProfile();
  }, []);

  if (loadingUser) return <div>Loading...</div>;

  return (
    <UserContext.Provider value={{ user, setUser, unsetUser }}>
      <Router>
        <Navbar />
        <Routes>
          <Route
            path="/login"
            element={user.id ? <Navigate to="/workouts" /> : <Login />}
          />
          <Route
            path="/register"
            element={user.id ? <Navigate to="/workouts" /> : <Register />}
          />
          <Route
            path="/workouts"
            element={user.id ? <Workout /> : <Navigate to="/login" />}
          />
        </Routes>
      </Router>
    </UserContext.Provider>
  );
}

export default App;