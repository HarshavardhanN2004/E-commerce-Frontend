import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import {getProfile,updateProfile,} from "../services/authService";
import Swal from "sweetalert2";
import "../styles/Profile.css";

const Profile = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [formData, setFormData] = useState({
    address: "",
    city: "",
    state: "",
    postalCode: "",
    phoneNumber: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError("");
        const data = await getProfile();
        setProfile(data);

        setFormData({
          address: data.address || "",
          city: data.city || "",
          state: data.state || "",
          postalCode: data.postalCode || "",
          phoneNumber: data.phoneNumber || "",
        });
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

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  };

  const handleBack = () => {
  if (profile.role === "Admin") {
    navigate("/admin");
  } else {
    navigate("/products");
  }
};

  const handleEdit = () => {
    setEditing(true);
  };

  const handleCancel = () => {
    setFormData({
      address: profile.address || "",
      city: profile.city || "",
      state: profile.state || "",
      postalCode: profile.postalCode || "",
      phoneNumber: profile.phoneNumber || "",
    });

    setEditing(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");
      const updatedData = await updateProfile(formData);
      setProfile(updatedData);
      setFormData({
        address: updatedData.address || "",
        city: updatedData.city || "",
        state: updatedData.state || "",
        postalCode: updatedData.postalCode || "",
        phoneNumber: updatedData.phoneNumber || "",
      });

      setEditing(false);

      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: "Profile updated successfully",
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
      });
    } catch (error) {
      setError(
        error.response?.data ||
          "Failed to update profile."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="profile-page">
          <div className="container">
            <div className="profile-loading">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">
                  Loading...
                </span>
              </div>
              <p> Loading profile...</p>
            </div>
          </div>
        </main>
      </>
    );
  }

  if (error && !profile) {
    return (
      <>
        <Navbar />
        <main className="profile-page">
          <div className="container">
            <div className="alert alert-danger">
              {error}
            </div>
            <button className="btn btn-primary" onClick={() => navigate("/products")}> Back to Products</button>
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
            <h1> My Profile</h1>
            <p> View and manage your account information </p>
          </div>

          <div className="profile-card">
            <div className="profile-top">
              <div className="profile-avatar">
              {profile.name?.charAt(0)?.toUpperCase()}
              </div>
              <div className="profile-heading">
                <h2> {profile.name}</h2>
                <span className="profile-role"> {profile.role}</span>
              </div>
            </div>

            {error && (
              <div className="alert alert-danger profile-error">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="profile-section">
                <div className="profile-section-title">
                  <h3> Account Information </h3>
                  <p> These details cannot be changed.</p>
                </div>

                <div className="row g-4">
                  <div className="col-md-6">
                    <label className="profile-label"> Full Name</label>
                    <input type="text" className="form-control profile-input" value={profile.name || ""} disabled/>
                    <small className="profile-help"> Name cannot be changed. </small>
                  </div>

                  <div className="col-md-6">
                    <label className="profile-label"> Email Address</label>
                    <input type="email" className="form-control profile-input" value={profile.email || ""} disabled/>
                    <small className="profile-help">Email cannot be changed.</small>
                  </div>

                  <div className="col-md-6">
                    <label className="profile-label"> User Role</label>
                    <input type="text" className="form-control profile-input" value={profile.role || ""} disabled/>
                  </div>
                </div>
              </div>

              <div className="profile-section">
                <div className="profile-section-title">
                  <h3> Contact & Address</h3>
                  <p> Update your delivery and contact information.</p>
                </div>

                <div className="row g-4">
                  <div className="col-12">
                    <label className="profile-label"> Address</label>
                    <textarea name="address" className="form-control profile-input" rows="3" placeholder="Enter your address"
                      value={formData.address} onChange={handleChange} disabled={!editing}></textarea>
                  </div>

                  <div className="col-md-6">
                    <label className="profile-label"> City </label>
                    <input type="text" name="city" className="form-control profile-input" placeholder="Enter your city"
                      value={formData.city} onChange={handleChange} disabled={!editing}/>
                  </div>

                  <div className="col-md-6">
                    <label className="profile-label"> State </label>
                    <input type="text" name="state" className="form-control profile-input" placeholder="Enter your state"
                      value={formData.state} onChange={handleChange} disabled={!editing}/>
                  </div>

                  <div className="col-md-6">
                    <label className="profile-label"> Postal Code </label>
                    <input type="text" name="postalCode" className="form-control profile-input" placeholder="Enter 6 digit postal code"
                      value={formData.postalCode} onChange={handleChange} disabled={!editing} maxLength="6"/>
                  </div>

                  <div className="col-md-6">
                    <label className="profile-label"> Phone Number </label>
                    <input type="text" name="phoneNumber" className="form-control profile-input" placeholder="Enter 10 digit phone number"
                      value={formData.phoneNumber} onChange={handleChange} disabled={!editing} maxLength="10" />
                  </div>
                </div>
              </div>

              <div className="profile-actions">
                <button type="button" className="back-profile-button" onClick={handleBack}> Back </button>
                {!editing ? (
                  <button type="button" className="edit-profile-button" onClick={handleEdit} > Edit Profile </button>
                ) : (
                  <>
                    <button type="button" className="cancel-profile-button" onClick={handleCancel} disabled={saving}>Cancel</button>
                    <button type="submit"className="save-profile-button" disabled={saving}>
                      {saving ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" aria-hidden="true"></span>
                          Saving...
                        </>
                      ) : (
                        "Save Changes"
                      )}
                    </button>
                  </>
                )}
              </div>
            </form>
          </div>
        </div>
      </main>
    </>
  );
};

export default Profile;