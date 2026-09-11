import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../features/slices/authSlice";
import "../styles/Navbar.css";
import Swal from "sweetalert2";

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { name, role } = useSelector((state) => state.auth);

  const handleLogout = () => {
  Swal.fire({
    title: "Are you sure?",
    text: "You will be logged out of your account.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Yes, Logout",
    cancelButtonText: "Cancel",
    reverseButtons: true,
  }).then((result) => {
    if (result.isConfirmed) {
      dispatch(logout());
      navigate("/login");
    }
  });
};

  return (
    <nav className="navbar navbar-expand-lg navbar-dark shop-navbar">
      <div className="container">

        <button className="navbar-brand shop-logo" onClick={() => navigate("/products")}>
         E-Commerce
        </button>

        <button className="navbar-toggler"type="button" data-bs-toggle="collapse" data-bs-target="#shopNavbar" aria-controls="shopNavbar"
                aria-expanded="false" aria-label="Toggle navigation" >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div  className="collapse navbar-collapse" id="shopNavbar" >
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">

            <li className="nav-item">
              <button  className="nav-link nav-button" onClick={() => navigate("/products")} > Products</button>
            </li>

            {role === "Customer" && (
              <>
                <li className="nav-item">
                  <button className="nav-link nav-button"onClick={() => navigate("/cart")} > Cart </button>
                </li>

                <li className="nav-item">
                  <button className="nav-link nav-button" onClick={() => navigate("/orders")} >My Orders </button>
                </li>
              </>
            )}

            <li className="nav-item"> 
              <button className="nav-link nav-button" onClick={() => navigate("/profile")}>Profile</button>
            </li>

            {role === "Admin" && (
              <li className="nav-item">
                <button className="nav-link nav-button" onClick={() => navigate("/admin")} >Admin Dashboard </button>
              </li>
            )}

          </ul>

          <div className="navbar-user">
            <div className="user-info">
              <span className="welcome-text"> Welcome,</span>
              <span className="user-name">{name}</span>
              <span className="user-role"> {role} </span>
            </div>

            <button className="btn btn-light logout-button" onClick={handleLogout}> Logout </button>
          </div>
        </div>

      </div>
    </nav>
  );
};

export default Navbar;