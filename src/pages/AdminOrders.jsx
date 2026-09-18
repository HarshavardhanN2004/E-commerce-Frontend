import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import "../styles/AdminOrders.css";
import fetchApi from "../services/fetchApi";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 5;
  const navigate = useNavigate();
  const formatDate = (dateValue) => {
  if (!dateValue) {
    return "";
  }
  const date = new Date(dateValue);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError("");
      const token = localStorage.getItem("token");

     const response = await fetchApi("/Orders", {
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
  const totalPages = Math.ceil(orders.length / ordersPerPage);
  const startIndex = (currentPage - 1) * ordersPerPage;
  const currentOrders = orders.slice(startIndex,startIndex + ordersPerPage);
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <>
      <Navbar />

      <main className="admin-orders-page">
        <div className="container">
          <div className="admin-orders-header">
            <div>
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
                   currentOrders.map((order) => (
                      <tr key={order.orderId}>
                        <td> #{order.orderId} </td>
                        <td> {order.name} </td>
                       <td>{formatDate(order.orderDate)}</td>
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
               {totalPages > 1 && (
            <nav className="mt-3">
              <ul className="pagination justify-content-center">
                <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                  <button type="button" className="page-link" onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
                    Previous
                  </button>
                </li>

                {Array.from({ length: totalPages }, (_, index) => (
                  <li key={index + 1} className={`page-item ${currentPage === index + 1 ? "active" : "" }`}>
                    <button type="button" className="page-link" onClick={() => handlePageChange(index + 1)}>
                      {index + 1}
                    </button>
                  </li>
                ))}
                <li className={`page-item ${currentPage === totalPages ? "disabled" : "" }`}>
                  <button type="button" className="page-link" onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
                    Next
                  </button>
                </li>
              </ul>
            </nav>
          )}
            </div>
          )}
        </div>
      </main>
    </>
  );
};

export default AdminOrders;