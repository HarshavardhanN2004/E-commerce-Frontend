import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../features/slices/authSlice";
import "../styles/Navbar.css";
import Swal from "sweetalert2";
import "@fortawesome/fontawesome-free/css/all.min.css";

const Navbar = ({ page }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { name, email, role } = useSelector((state) => state.auth);
  const [showProfileCard, setShowProfileCard] = useState(false);

  const handleLogout = () => {
    Swal.fire({
      title: "Logout?",
      text: "Are you sure you want to logout from your account?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, Logout",
      cancelButtonText: "Stay Logged In",
      reverseButtons: true,
      confirmButtonColor: "#dc3545",
      cancelButtonColor: "#6c757d",
      focusCancel: true,
      customClass: {
        popup: "logout-swal-popup",
        title: "logout-swal-title",
        confirmButton: "logout-confirm-button",
        cancelButton: "logout-cancel-button",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(logout());
        navigate("/login");
      }
    });
  };

  const handleProfileClick = () => {
    setShowProfileCard((previousState) => !previousState);
  };

  const handleViewProfile = () => {
    setShowProfileCard(false);
    navigate("/profile");
  };

  const handleCartClick = () => {
    navigate("/cart");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark shop-navbar">
      <div className="container">

        <button className="navbar-brand shop-logo"onClick={() => {
            if (page === "login") {
              navigate("/login");
            } else if (page === "register") {
              navigate("/register");
            } else {
              navigate("/products");
            }
          }}
        >
          <i className="fas fa-shopping-bag"></i>
          E-Commerce
        </button>

        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#shopNavbar" aria-controls="shopNavbar"
          aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="shopNavbar">
          {page === "login" && (
            <div className="navbar-user ms-auto">
              <button type="button" className="btn btn-light navbar-auth-button" onClick={() => navigate("/register")}>
                Register
              </button>
            </div>
          )}

          {page === "register" && (
            <div className="navbar-user ms-auto">
              <button type="button" className="btn btn-light navbar-auth-button" onClick={() => navigate("/login")}>
                Login
              </button>
            </div>
          )}

          {!page && (
            <>
              <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                <li className="nav-item">
                  <button className="nav-link nav-button" onClick={() => navigate("/products")}> Products</button>
                </li>

                {role === "Customer" && (
                  <li className="nav-item">
                    <button className="nav-link nav-button" onClick={() => navigate("/orders")}> My Orders </button>
                  </li>
                )}

                {role === "Admin" && (
                  <li className="nav-item">
                    <button className="nav-link nav-button" onClick={() => navigate("/admin")}> Dashboard</button>
                  </li>
                )}

              </ul>

              <div className="navbar-user">

                {role === "Customer" && (
                  <button type="button" className="navbar-cart-button" onClick={handleCartClick} title="Cart" aria-label="Cart">
                    <i className="fas fa-shopping-cart"></i>
                  </button>
                )}

                <div className="navbar-profile-container">
                  <button type="button" className="navbar-profile-badge" onClick={handleProfileClick}>
                    <span className="navbar-welcome-text"> Welcome,</span>
                    <span className="navbar-user-name"> {name || "User"} </span>
                  </button>

                  {showProfileCard && (
                    <div className="navbar-profile-card">
                      <div className="navbar-profile-card-header">
                        <div className="navbar-profile-icon">
                          {name ? name.charAt(0).toUpperCase() : "U"}
                        </div>

                        <div className="navbar-profile-header-info">
                          <h6>{name || "User"}</h6>
                          <span>{role || "User"}</span>
                        </div>
                      </div>

                      <div className="navbar-profile-card-body">
                        <div className="navbar-profile-detail">
                          <span className="navbar-profile-label"> Name </span>
                          <span className="navbar-profile-value"> {name || "-"} </span>
                        </div>

                        <div className="navbar-profile-detail">
                          <span className="navbar-profile-label"> Email </span>
                          <span className="navbar-profile-value"> {email || "-"} </span>
                        </div>

                        <div className="navbar-profile-detail">
                          <span className="navbar-profile-label"> Role</span>
                          <span className="navbar-profile-value"> {role || "-"}</span>
                        </div>
                        <button type="button" className="navbar-view-profile-button" onClick={handleViewProfile}> View Profile</button>
                      </div>
                    </div>
                  )}
                </div>
                <button type="button" className="btn btn-light logout-button" onClick={handleLogout}> Logout </button>
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;