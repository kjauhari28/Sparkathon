import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import StoreUI from "./StoreUi";
import SalesUI from "./SalesUi";
import "./App.css";

const App = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [view, setView] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleAuth = (e) => {
    e.preventDefault();
    if (email && password) {
      setLoggedIn(true);
    }
  };

  if (!loggedIn) {
    return (
      <div className="wrapper">
        <div className="container">
          <h2>{view === "login" ? "Login" : "Register"}</h2>
          <form onSubmit={handleAuth}>
            <input
              type="email"
              placeholder="Email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button type="submit">{view === "login" ? "Login" : "Register"}</button>
          </form>
          <button
            className="toggle-button"
            onClick={() => setView(view === "login" ? "register" : "login")}
          >
            Switch to {view === "login" ? "Register" : "Login"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<StoreUI />} />
        <Route path="/sales/:storeId" element={<SalesUI />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default App;
