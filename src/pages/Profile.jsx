import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { getProfile } from "../services/authService";
import "../styles/Profile.css";

const Profile = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError("");
        const data = await getProfile();
        setProfile(data);
      } catch (error) {
        setError(
          error.response?.data ||
            "Failed to load profile."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return (
      <>
        <Navbar />

        <main className="profile-page">
          <div className="container">
            <div className="profile-loading">
              <div className="spinner-border text-primary"  role="status">
                <span className="visually-hidden"> Loading... </span>
              </div>
              <p>Loading profile...</p>
            </div>
          </div>
        </main>
      </>
    );
  }

  if (error || !profile) {
    return (
      <>
        <Navbar />

        <main className="profile-page">
          <div className="container">
            <div className="alert alert-danger">
              {error || "Profile not found."}
            </div>
            <button className="btn btn-primary" onClick={() => navigate("/products")}> Back to Products </button>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <main className="profile-page">
        <div className="container">
          <div className="profile-header">
            <p className="profile-subtitle"> E-Commerce </p>
            <h1>My Profile</h1>
            <p> View your account information </p>
          </div>

          <div className="profile-card">
            <div className="profile-avatar"> {profile.name?.charAt(0).toUpperCase()} </div>
            <div className="profile-information">
              <div className="profile-item"> <span className="profile-label">Name</span>
                <span className="profile-value"> {profile.name} </span>
              </div>

              <div className="profile-item">
                <span className="profile-label"> Email </span>
                <span className="profile-value"> {profile.email}</span>
              </div>

              <div className="profile-item">
                <span className="profile-label"> Role </span>
                <span className="profile-role"> {profile.role}</span>
              </div>

            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default Profile;