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

            <p className="mt-3">Loading your orders...</p>
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

            <button
              className="btn btn-primary"
              onClick={() => dispatch(fetchMyOrders())}
            >
              Try Again
            </button>
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
            <p>View your previous orders and their details.</p>
          </div>

          {orders.length === 0 ? (
            <div className="no-orders text-center">
              <h4>No Orders Yet</h4>

              <p>
                You haven't placed any orders yet.
              </p>

              <button
                className="btn btn-primary"
                onClick={() => navigate("/products")}
              >
                Start Shopping
              </button>
            </div>
          ) : (
            <div className="orders-list">

              {orders.map((order) => (
                <div
                  className="order-card"
                  key={order.orderId}
                >

                  <div className="order-card-header">
                    <div>
                      <h5>
                        Order #{order.orderId}
                      </h5>

                      <p>
                        {new Date(
                          order.orderDate
                        ).toLocaleDateString()}
                      </p>
                    </div>

                    <span
                      className={`order-status ${order.status.toLowerCase()}`}
                    >
                      {order.status}
                    </span>
                  </div>

                  <div className="order-card-body">

                    <div>
                      <strong>Items</strong>

                      <p>
                        {order.orderItems?.length || 0} item(s)
                      </p>
                    </div>

                    <div>
                      <strong>Total Amount</strong>

                      <p>
                        ₹
                        {Number(
                          order.grandTotal
                        ).toFixed(2)}
                      </p>
                    </div>

                    <div>
                      <strong>Payment</strong>

                      <p>{order.paymentMethod}</p>
                    </div>

                  </div>

                  <div className="order-card-footer">

                    <button
                      className="btn btn-outline-primary"
                      onClick={() =>
                        navigate(
                          `/orders/${order.orderId}`
                        )
                      }
                    >
                      View Details
                    </button>

                  </div>

                </div>
              ))}

            </div>
          )}

        </div>
      </main>
    </>
  );
};

export default MyOrders;