import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Unauthorized.css";

const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <div className="unauthorized-page">
      <div className="unauthorized-card">
        <div className="unauthorized-icon">
          🔒
        </div>

        <h1>Access Denied</h1>
        <h2>403 - Unauthorized</h2>
        <p> Sorry, you don't have permission to access this page.</p>
        <p> Please return to the appropriate page for your account. </p>

        <div className="unauthorized-buttons">
          <button className="unauthorized-home-btn" onClick={() => navigate("/")}>Go to Home </button>
          <button className="unauthorized-back-btn"onClick={() => navigate(-1)}> Go Back </button>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;

