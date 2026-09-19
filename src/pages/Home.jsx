import React from "react";
import { useNavigate } from "react-router-dom";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "../styles/Home.css";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="home-page">
      <nav className="home-navbar">
        <div className="container home-navbar-container">
          <button className="home-logo" onClick={() => navigate("/")}>
            <i className="fas fa-shopping-bag"></i>
            E-Commerce
          </button>

          <div className="home-nav-buttons">
            <button className="home-register-btn" onClick={() => navigate("/register")}> Register </button>
          </div>
        </div>
      </nav>

      <section className="home-hero">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-4">
              <div className="hero-shopping">
                <div className="hero-shopping-logo">
                  <i className="fas fa-shopping-bag"></i>
                </div>
                <h2>Happy Shopping!</h2>
              </div>
            </div>
            <div className="col-md-8">
              <div className="hero-content">
                <h1>Welcome to Our Store</h1>
                <button className="shop-now-btn" onClick={() => navigate("/login")}>
                  <i className="fas fa-shopping-cart"></i>
                  Shop Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="features-section">
        <div className="container">
          <div className="section-heading">
            <h2>Why Shop With Us?</h2>
          </div>
          <div className="row g-4">
            <div className="col-md-4">
              <div className="feature-card">
                <div className="feature-icon">
                  <i className="fas fa-truck"></i>
                </div>
                <h3>Fast Delivery</h3>
                <p> Get your orders delivered to your doorstep. </p>
              </div>
            </div>


            <div className="col-md-4">
              <div className="feature-card">
                <div className="feature-icon">
                  <i className="fas fa-lock"></i>
                </div>
                <h3>Secure Shopping</h3>
                <p> Your account and orders are kept secure. </p>
              </div>
            </div>

            <div className="col-md-4">
              <div className="feature-card">
                <div className="feature-icon">
                  <i className="fas fa-credit-card"></i>
                </div>
                <h3>Easy Checkout</h3>
                <p> Place your order with a simple checkout process. </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="categories-section">
        <div className="container">
          <div className="section-heading">
            <h2>Shop by Category</h2>
          </div>
          <div className="row g-4">
            <div className="col-6 col-md-3">
              <div className="category-card">
                <i className="fas fa-laptop"></i>
                <h3>Electronics</h3>
              </div>
            </div>

            <div className="col-6 col-md-3">
              <div className="category-card">
                <i className="fas fa-shirt"></i>
                <h3>Fashion</h3>
              </div>
            </div>

            <div className="col-6 col-md-3">
              <div className="category-card">
                <i className="fas fa-house"></i>
                <h3>Home</h3>
              </div>
            </div>

            <div className="col-6 col-md-3">
              <div className="category-card">
                <i className="fas fa-headphones"></i>
                <h3>Accessories</h3>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;