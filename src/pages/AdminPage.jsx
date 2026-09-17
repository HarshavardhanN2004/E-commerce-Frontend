import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import "../styles/AdminPage.css";

const AdminPage = () => {
  const navigate = useNavigate();

  return (
    <>
      <Navbar />

      <main className="admin-page">
        <div className="container">
          <div className="admin-welcome">
            <div>
              <h1>Welcome back, Admin</h1>
              <p className="admin-description"> Manage your products, categories, orders and customers from one place. </p>
            </div>
          </div>

          <div className="row g-4 mt-2">
            <div className="col-md-6 col-lg-3">
              <div className="admin-card">
                <h5>Products</h5>
                <p> Add, update and manage products.</p>
                <button className="btn btn-primary" onClick={() => navigate("/admin/products")} >Manage Products </button>
              </div>
            </div>

            <div className="col-md-6 col-lg-3">
              <div className="admin-card">
                <h5>Categories</h5>
                <p> Manage your product categories. </p>
                <button className="btn btn-primary" onClick={() => navigate("/admin/categories")} > Manage Categories </button>
              </div>
            </div>

            <div className="col-md-6 col-lg-3">
              <div className="admin-card">
                <h5>Orders</h5>
                <p> View and manage customer orders. </p>
                <button className="btn btn-primary"onClick={() => navigate("/admin/orders")} > Manage Orders </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default AdminPage;