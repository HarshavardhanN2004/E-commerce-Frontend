import React, { useEffect } from "react";
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

  useEffect(() => {
    dispatch(fetchMyOrders());
  }, [dispatch]);

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
                  {orders.map((order) => (
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
            </div>
          )}
        </div>
      </main>
    </>
  );
};

export default MyOrders;