import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import "../styles/AdminOrders.css";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const API_URL = process.env.REACT_APP_API_URL;

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      const response = await fetch(`${API_URL}/Orders`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}`,},
      });

      if (!response.ok) {
        throw new Error("Failed to fetch orders.");
      }

      const data = await response.json();

      setOrders(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const getStatusBadgeClass = (status) => {
  switch (status) {
    case "Pending":
      return "bg-warning text-dark";

    case "Confirmed":
      return "bg-primary";

    case "Shipped":
      return "bg-info text-dark";

    case "Delivered":
      return "bg-success";

    case "Cancelled":
      return "bg-danger";

    default:
      return "bg-secondary";
  }
};

  return (
    <>
      <Navbar />

      <main className="admin-orders-page">
        <div className="container">
          <div className="admin-orders-header">
            <div>
              <p className="admin-subtitle">Admin Dashboard</p>
              <h1>Manage Orders</h1>
              <p className="admin-description"> View and manage customer orders. </p>
            </div>
          </div>

          {loading && (
            <div className="text-center mt-4">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden"> Loading... </span>
              </div>
              <p className="mt-2"> Loading orders... </p>
            </div>
          )}

          {error && (
            <div className="alert alert-danger">
              {error}
            </div>
          )}

          {!loading && !error && (
            <div className="table-responsive">
              <table className="table table-bordered table-hover admin-orders-table">

                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Order Date</th>
                    <th>Items</th>
                    <th>Grand Total</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {orders.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="text-center"> No orders found. </td>
                    </tr>
                  ) : (
                    orders.map((order) => (
                      <tr key={order.orderId}>
                        <td> #{order.orderId} </td>
                        <td> {order.name} </td>
                        <td> {new Date(order.orderDate).toLocaleDateString()}</td>
                        <td> {order.orderItems.length}</td>
                        <td> ₹{Number(order.grandTotal).toFixed(2)} </td>
                        <td> <span className={`badge ${getStatusBadgeClass(order.status)}`}>{order.status} </span> </td>
                        <td>
                         <button className="btn btn-sm btn-outline-primary" onClick={() => navigate(`/admin/orders/${order.orderId}`)}>
                        View
                        </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </>
  );
};

export default AdminOrders;