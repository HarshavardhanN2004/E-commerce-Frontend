import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
//import "../styles/AdminOrderDetails.css";

const AdminOrderDetails = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
const [updatingStatus, setUpdatingStatus] = useState(false);

  const API_URL = process.env.REACT_APP_API_URL;

  const fetchOrder = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      const response = await fetch(`${API_URL}/Orders/${orderId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch order details.");
      }

     const data = await response.json();
    setOrder(data);
    setSelectedStatus(data.status);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [orderId]);

  const handleUpdateStatus = async () => {
  try {
    setUpdatingStatus(true);
    setError("");

    const token = localStorage.getItem("token");

    const response = await fetch(
      `${API_URL}/Orders/${orderId}/status`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(selectedStatus),
      }
    );

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(errorData || "Failed to update order status.");
    }

    const updatedOrder = await response.json();

    setOrder(updatedOrder);
    setSelectedStatus(updatedOrder.status);

    alert("Order status updated successfully.");
  } catch (error) {
    setError(error.message);
  } finally {
    setUpdatingStatus(false);
  }
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

  if (loading) {
    return (
      <>
        <Navbar />

        <div className="text-center mt-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">
              Loading...
            </span>
          </div>

          <p className="mt-2">
            Loading order details...
          </p>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />

        <main className="admin-order-details-page">
          <div className="container">
            <div className="alert alert-danger">
              {error}
            </div>

            <button
              className="btn btn-secondary"
              onClick={() => navigate("/admin/orders")}
            >
              Back to Orders
            </button>
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

      <main className="admin-order-details-page">
        <div className="container">

          <div className="order-details-header">
            <div>
              <p className="admin-subtitle">
                Admin Dashboard
              </p>

              <h1>
                Order #{order.orderId}
              </h1>

              <p className="admin-description">
                View complete order information.
              </p>
            </div>

            <button
              className="btn btn-secondary"
              onClick={() => navigate("/admin/orders")}
            >
              Back to Orders
            </button>
          </div>

          <div className="row g-4">

            <div className="col-lg-6">
              <div className="order-details-card">

                <h4>Customer Information</h4>

                <p>
                  <strong>Name:</strong> {order.name}
                </p>

                <p>
                  <strong>Phone:</strong> {order.phoneNumber}
                </p>

                <p>
                  <strong>Address:</strong> {order.address}
                </p>

                <p>
                  <strong>City:</strong> {order.city}
                </p>

                <p>
                  <strong>State:</strong> {order.state}
                </p>

                <p>
                  <strong>Postal Code:</strong> {order.postalCode}
                </p>

              </div>
            </div>

            <div className="col-lg-6">
              <div className="order-details-card">

                <h4>Order Information</h4>

                <p>
                  <strong>Order Date:</strong>{" "}
                  {new Date(order.orderDate).toLocaleString()}
                </p>

                <p>
                  <strong>Payment Method:</strong>{" "}
                  {order.paymentMethod}
                </p>

                <div className="mb-3">
                <label className="form-label">
                    <strong>Order Status</strong>
                </label>

                <select
                    className="form-select"
                    value={selectedStatus}
                    onChange={(event) =>
                    setSelectedStatus(event.target.value)
                    }
                >
                    <option value="Pending">Pending</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                </select>
                </div>

                <button
                className="btn btn-primary"
                onClick={handleUpdateStatus}
                disabled={updatingStatus}
                >
                {updatingStatus ? "Updating..." : "Update Status"}
                </button>

                <p>
                  <strong>Total Amount:</strong>{" "}
                  ₹{Number(order.totalAmount).toFixed(2)}
                </p>

                <p>
                  <strong>Shipping:</strong>{" "}
                  ₹{Number(order.shippingAmount).toFixed(2)}
                </p>

                <p>
                  <strong>Grand Total:</strong>{" "}
                  ₹{Number(order.grandTotal).toFixed(2)}
                </p>

              </div>
            </div>

          </div>

          <div className="order-details-card mt-4">

            <h4>Ordered Products</h4>

            <div className="table-responsive">

              <table className="table table-bordered table-hover">

                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Quantity</th>
                    <th>Unit Price</th>
                    <th>Subtotal</th>
                  </tr>
                </thead>

                <tbody>
                  {order.orderItems.map((item) => (
                    <tr key={item.orderItemId}>

                      <td>
                        {item.productName}
                      </td>

                      <td>
                        {item.quantity}
                      </td>

                      <td>
                        ₹{Number(item.unitPrice).toFixed(2)}
                      </td>

                      <td>
                        ₹{Number(item.subtotal).toFixed(2)}
                      </td>

                    </tr>
                  ))}
                </tbody>

              </table>

            </div>

          </div>

        </div>
      </main>
    </>
  );
};

export default AdminOrderDetails;