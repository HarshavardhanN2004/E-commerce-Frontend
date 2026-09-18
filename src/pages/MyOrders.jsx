import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { fetchMyOrders } from "../features/slices/orderSlice";
import "../styles/MyOrders.css";

const MyOrders = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { orders, loading, error } = useSelector(
    (state) => state.order
  );
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 4;
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

  useEffect(() => {
    dispatch(fetchMyOrders());
  }, [dispatch]);

  useEffect(() => {
  setCurrentPage(1);
}, [orders]);

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="my-orders-page">
          <div className="container text-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">
                Loading...
              </span>
            </div>

            <p className="mt-3">
              Loading your orders...
            </p>
          </div>
        </main>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <main className="my-orders-page">
          <div className="container text-center">
            <h4>Unable to load orders</h4>
            <p>{error}</p>
            <button className="btn btn-primary" onClick={() => dispatch(fetchMyOrders())}>Try Again </button>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="my-orders-page">
        <div className="container">
          <div className="my-orders-header">
            <h1>My Orders</h1>
            <p> View your previous orders and their details.</p>
          </div>

          {orders.length === 0 ? (
            <div className="no-orders text-center">
              <h4>No Orders Yet</h4>
              <p> You haven't placed any orders yet. </p>
              <button className="btn btn-primary" onClick={() => navigate("/products")}> Start Shopping</button>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-bordered table-hover my-orders-table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Order Date</th>
                    <th>Items</th>
                    <th>Total Amount</th>
                    <th>Payment</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {currentOrders.map((order) => (
                    <tr key={order.orderId}>
                      <td> <strong>  #{order.orderId} </strong></td>
                      <td> {formatDate(order.orderDate)}</td>
                      <td> {order.orderItems?.length || 0} item(s) </td>
                      <td> ₹{Number(order.grandTotal).toFixed(2)}</td>
                      <td> {order.paymentMethod}</td>
                      <td> <span className={`badge ${getStatusBadgeClass(order.status)}`}>{order.status}</span></td>
                      <td> <button className="btn btn-sm btn-outline-primary" onClick={() => navigate(`/orders/${order.orderId}`)}> View </button> </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {totalPages > 1 && (
              <nav className="mt-4">
                <ul className="pagination justify-content-center">
                  <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`} >
                    <button type="button"className="page-link"onClick={() => handlePageChange(currentPage - 1)}disabled={currentPage === 1}>Previous
                    </button>
                  </li>

                  {Array.from(
                    { length: totalPages },
                    (_, index) => (
                      <li key={index + 1} className={`page-item ${currentPage === index + 1 ? "active" : ""}`}>
                        <button type="button" className="page-link" onClick={() => handlePageChange(index + 1)}>{index + 1}</button>
                      </li>
                    )
                  )}

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

export default MyOrders;