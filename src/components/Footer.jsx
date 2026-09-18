import React from "react";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "../styles/Footer.css";

const Footer = () => {
  return (
    <footer className="home-footer">
      <div className="container">

        <div className="footer-content">
          <div>
            <h3>
              <i className="fas fa-shopping-bag"></i>
              E-Commerce
            </h3>

            <p>
              Simple online shopping for everyone.
            </p>
          </div>
        </div>

        <div className="footer-bottom">
          <p>
            © 2026 E-Commerce. All Rights Reserved.
          </p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
