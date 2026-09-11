import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Home.css";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="home-page">

      {/* =========================
          Navbar
      ========================= */}
      <nav className="home-navbar">
        <div className="container home-navbar-container">

          <button
            className="home-logo"
            onClick={() => navigate("/")}
          >
            🛍 E-Commerce
          </button>

          <div className="home-nav-buttons">
            <button
              className="home-login-btn"
              onClick={() => navigate("/login")}
            >
              Login
            </button>

            <button
              className="home-register-btn"
              onClick={() => navigate("/register")}
            >
              Register
            </button>
          </div>

        </div>
      </nav>


      {/* =========================
          Hero Section
      ========================= */}
      <section className="home-hero">

        <div className="container">
          <div className="row align-items-center">

            {/* Left Content */}
            <div className="col-lg-6">

              <div className="hero-content">

                <span className="hero-small-text">
                  ✨ YOUR ONE-STOP SHOPPING DESTINATION
                </span>

                <h1>
                  Shop Smart.
                  <br />
                  <span>Live Better.</span>
                </h1>

                <p>
                  Discover amazing products, great deals, and everything
                  you need in one place. Your perfect shopping experience
                  starts here.
                </p>

                <div className="hero-buttons">

                  <button
                    className="shop-now-btn"
                    onClick={() => navigate("/login")}
                  >
                    Shop Now →
                  </button>

                  <button
                    className="explore-btn"
                    onClick={() => navigate("/register")}
                  >
                    Create Account
                  </button>

                </div>

              </div>

            </div>


            {/* Right Shopping Illustration */}
            <div className="col-lg-6">

              <div className="hero-shopping-area">

                <div className="shopping-circle"></div>

                <div className="shopping-card card-one">
                  <span>📱</span>
                  <p>Electronics</p>
                </div>

                <div className="shopping-card card-two">
                  <span>👕</span>
                  <p>Fashion</p>
                </div>

                <div className="shopping-card card-three">
                  <span>🏠</span>
                  <p>Home</p>
                </div>

                <div className="shopping-bag">
                  🛍️
                </div>

                <div className="floating-box box-one">
                  ⭐
                </div>

                <div className="floating-box box-two">
                  🛒
                </div>

              </div>

            </div>

          </div>
        </div>

      </section>


      {/* =========================
          Features Section
      ========================= */}
      <section className="features-section">

        <div className="container">

          <div className="section-heading">
            <span>WHY CHOOSE US</span>
            <h2>Everything You Need for Better Shopping</h2>
            <p>
              We make online shopping simple, convenient and enjoyable.
            </p>
          </div>


          <div className="row g-4">

            <div className="col-md-6 col-lg-3">
              <div className="feature-card">

                <div className="feature-icon">
                  🚚
                </div>

                <h3>Fast Delivery</h3>

                <p>
                  Get your favorite products delivered quickly and safely.
                </p>

              </div>
            </div>


            <div className="col-md-6 col-lg-3">
              <div className="feature-card">

                <div className="feature-icon">
                  🔒
                </div>

                <h3>Secure Shopping</h3>

                <p>
                  Your account and shopping experience are protected.
                </p>

              </div>
            </div>


            <div className="col-md-6 col-lg-3">
              <div className="feature-card">

                <div className="feature-icon">
                  💳
                </div>

                <h3>Easy Checkout</h3>

                <p>
                  Enjoy a simple and convenient checkout experience.
                </p>

              </div>
            </div>


            <div className="col-md-6 col-lg-3">
              <div className="feature-card">

                <div className="feature-icon">
                  ⭐
                </div>

                <h3>Quality Products</h3>

                <p>
                  Explore products selected to give you great value.
                </p>

              </div>
            </div>

          </div>

        </div>

      </section>


      {/* =========================
          Categories Section
      ========================= */}
      <section className="categories-section">

        <div className="container">

          <div className="section-heading">
            <span>EXPLORE OUR STORE</span>
            <h2>Shop by Category</h2>
            <p>
              Find what you're looking for and discover something new.
            </p>
          </div>


          <div className="row g-4">

            <div className="col-6 col-lg-3">
              <div className="category-card">
                <div className="category-icon">
                  💻
                </div>
                <h3>Electronics</h3>
                <p>Latest gadgets & devices</p>
              </div>
            </div>


            <div className="col-6 col-lg-3">
              <div className="category-card">
                <div className="category-icon">
                  👕
                </div>
                <h3>Fashion</h3>
                <p>Style for every occasion</p>
              </div>
            </div>


            <div className="col-6 col-lg-3">
              <div className="category-card">
                <div className="category-icon">
                  🏠
                </div>
                <h3>Home & Living</h3>
                <p>Make your home beautiful</p>
              </div>
            </div>


            <div className="col-6 col-lg-3">
              <div className="category-card">
                <div className="category-icon">
                  🎧
                </div>
                <h3>Accessories</h3>
                <p>Complete your everyday style</p>
              </div>
            </div>

          </div>

        </div>

      </section>


      {/* =========================
          Call To Action
      ========================= */}
      <section className="cta-section">

        <div className="container">

          <div className="cta-content">

            <div>
              <span>READY TO START?</span>

              <h2>
                Your Next Favorite Product
                <br />
                Is Waiting for You.
              </h2>

              <p>
                Join us today and start exploring our collection.
              </p>
            </div>

            <button
              className="cta-button"
              onClick={() => navigate("/register")}
            >
              Get Started →
            </button>

          </div>

        </div>

      </section>


      {/* =========================
          Footer
      ========================= */}
      <footer className="home-footer">

        <div className="container">

          <div className="footer-content">

            <div>
              <h3>🛍 E-Commerce</h3>
              <p>
                Your simple and trusted online shopping destination.
              </p>
            </div>

            <div className="footer-links">

              <button onClick={() => navigate("/login")}>
                Login
              </button>

              <button onClick={() => navigate("/register")}>
                Register
              </button>

            </div>

          </div>

          <div className="footer-bottom">
            <p>
              © 2026 E-Commerce. All Rights Reserved.
            </p>
          </div>

        </div>

      </footer>

    </div>
  );
};

export default Home;

