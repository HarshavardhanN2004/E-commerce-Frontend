import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { fetchOrderById } from "../features/slices/orderSlice";
import "../styles/Order.css";

const Order = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { orderId } = useParams();

  const { order, loading, error } = useSelector(
    (state) => state.order
  );

  useEffect(() => {
    dispatch(fetchOrderById(orderId));
  }, [dispatch, orderId]);

  if (loading) {
    return (
      <>
        <Navbar />

        <main className="order-page">
          <div className="container text-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">
                Loading...
              </span>
            </div>

            <p>Loading your order...</p>
          </div>
        </main>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />

        <main className="order-page">
          <div className="container text-center">
            <h4>Unable to load order</h4>
            <p>{error}</p>
            <button className="btn btn-primary" onClick={() => navigate("/products")}> Continue Shopping </button>
          </div>
        </main>
      </>
    );
  }

  if (!order) {
    return null;
  }

  return (
    <>
      <Navbar />

      <main className="order-page">
        <div className="container">
          <div className="order-success text-center">
            <div className="order-success-icon">
              ✅
            </div>
            <h1>Order Placed Successfully!</h1>
            <p> Thank you for your order.</p>
            <p> Order ID: <strong>#{order.orderId}</strong></p>
          </div>

          <div className="order-container">
            <div className="order-details">
              <h4>Delivery Information</h4>
              <p> <strong>Name:</strong> {order.name}</p>
              <p> <strong>Address:</strong> {order.address}</p>
              <p> <strong>City:</strong> {order.city} </p>
              <p> <strong>State:</strong> {order.state} </p>
              <p> <strong>Postal Code:</strong> {order.postalCode} </p>
              <p> <strong>Phone:</strong> {order.phoneNumber} </p>
              <p> <strong>Payment:</strong> {order.paymentMethod} </p>
              <p> <strong>Status:</strong> {order.status}</p>
            </div>

            <div className="order-summary">
              <h4>Order Summary</h4>
              {order.orderItems?.map((item) => (
                <div className="order-item" key={item.orderItemId}>
                  <div>
                    <strong> {item.productName} </strong>
                    <span> Qty: {item.quantity} </span>
                  </div>
                  <strong>₹{Number(item.subtotal).toFixed(2)}</strong>
                </div>
              ))}

              <div className="order-total">
                <span>Total</span>
                <strong> ₹{Number(order.grandTotal).toFixed(2)}</strong>
              </div>
            </div>
          </div>

          <div className="text-center mt-4">
            <button className="btn btn-primary me-2"onClick={() => navigate("/products")} >Continue Shopping </button>
            <button className="btn btn-outline-primary" onClick={() => navigate("/orders")}> My Orders </button>
          </div>
        </div>
      </main>
    </>
  );
};

export default Order;