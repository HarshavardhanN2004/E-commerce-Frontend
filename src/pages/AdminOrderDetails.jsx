import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Swal from "sweetalert2";
import "../styles/AdminOrderDetails.css";
import fetchApi from "../services/fetchApi";

const AdminOrderDetails = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [updatingStatus, setUpdatingStatus] = useState(false);
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

  const fetchOrder = async () => {
    try {
      setLoading(true);
      setError("");
      const token = localStorage.getItem("token");
     const response = await fetchApi(`/Orders/${orderId}`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}`,},
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
    const response = await fetchApi(
      `/Orders/${orderId}/status?status=${encodeURIComponent(selectedStatus)}`,
      {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}`, },
      }
    );
    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(
        errorData || "Failed to update order status."
      );
    }

    const updatedOrder = await response.json();

    setOrder(updatedOrder);
    setSelectedStatus(updatedOrder.status);
    Swal.fire({
      toast: true,
      position: "top-end",
      icon: "success",
      title: "Order status updated successfully",
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true,
    });
  } catch (error) {
    setError(error.message);
  } finally {
    setUpdatingStatus(false);
  }
};

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "Pending":
        return "status-pending";

      case "Confirmed":
        return "status-confirmed";

      case "Shipped":
        return "status-shipped";

      case "Delivered":
        return "status-delivered";

      case "Cancelled":
        return "status-cancelled";

      default:
        return "status-default";
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />

        <div className="admin-order-loading">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden"> Loading... </span>
          </div>
          <p>Loading order details...</p>
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
            <div className="admin-order-error">
              <h4>Unable to Load Order</h4>
              <p>{error}</p>
              <button  className="btn btn-primary" onClick={() => navigate("/admin/orders")}>Back to Order </button>
            </div>
          </div>
        </main>
      </>
    );
  }

  if (!order) {
    return null;
  }
  const isDelivered = order.status === "Delivered";

  return (
    <>
      <Navbar />
      <main className="admin-order-details-page">
        <div className="container">
          <div className="admin-order-header">
            <div className="admin-order-title-section">
              <h1>
                Order #{order.orderId}
              </h1>
              <p> View customer, payment and product information.</p>
            </div>

            <button className="back-orders-button" onClick={() => navigate("/admin/orders")}>  Back to Orders</button>
          </div>

          <div className="order-status-card">
            <div className="status-card-left">
              <div>
                <span className="status-label"> Current Order Status</span>
                <span className={`order-status-badge ${getStatusBadgeClass(order.status )}`}>{order.status}</span>
              </div>

            </div>
            <div className="status-card-right">
              <div className="status-update-controls">

               <select id="orderStatus" className="form-select" value={selectedStatus} onChange={(event) => setSelectedStatus(event.target.value)}
                disabled={updatingStatus || isDelivered}>
                  <option value="Pending"> Pending</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Shipped"> Shipped</option>
                  <option value="Delivered"> Delivered</option>
                  <option value="Cancelled"> Cancelled </option>
                </select>

                <button className="update-status-button" onClick={handleUpdateStatus}  disabled={updatingStatus || isDelivered}>
                  {updatingStatus ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" aria-hidden="true"></span>
                      Updating...
                    </>
                  ) : ( "Update Status")}
                </button>
              </div>
               {isDelivered && (
                <small className="text-muted"> Delivered orders cannot be updated.</small>
                )}
            </div>
          </div>

          <div className="row g-4">
            <div className="col-lg-6">
              <div className="information-card">
                <div className="card-heading">
                  <div>
                    <h3> Customer Information</h3>
                    <p> Customer delivery details</p>
                  </div>
                </div>

                <div className="information-list">
                  <div className="information-item">
                    <span className="information-label"> Name </span>
                    <span className="information-value"> {order.name} </span>
                  </div>

                  <div className="information-item">
                    <span className="information-label">  Phone</span>
                    <span className="information-value"> {order.phoneNumber}</span>
                  </div>

                  <div className="information-item">
                    <span className="information-label"> Address </span>
                    <span className="information-value"> {order.address} </span>
                  </div>

                  <div className="information-item">
                    <span className="information-label">City</span>
                    <span className="information-value">{order.city}</span>
                  </div>

                  <div className="information-item">
                    <span className="information-label"> State</span>
                    <span className="information-value"> {order.state}
                    </span>
                  </div>

                  <div className="information-item">
                    <span className="information-label"> Postal Code</span>
                    <span className="information-value"> {order.postalCode} </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-6">
              <div className="information-card">
                <div className="card-heading">
                  <div>
                    <h3>Order Information</h3>
                    <p>  Payment and order summary </p>
                  </div>
                </div>

                <div className="information-list">
                  <div className="information-item">
                    <span className="information-label"> Order Date </span>
                    <span className="information-value">
                     {formatDate(order.orderDate)}
                    </span>
                  </div>


                  <div className="information-item">
                    <span className="information-label"> Payment Method </span>
                    <span className="information-value">{order.paymentMethod} </span>
                  </div>

                  <div className="information-item">
                    <span className="information-label">Total Amount</span>
                    <span className="information-value">
                      ₹{Number( order.totalAmount ).toFixed(2)}
                    </span>
                  </div>


                  <div className="information-item">
                    <span className="information-label"> Shipping </span>
                    <span className="information-value">
                      ₹{Number(order.shippingAmount).toFixed(2)}
                    </span>
                  </div>

                  <div className="grand-total-item">
                    <span>  Grand Total</span>
                    <strong>
                      ₹{Number(order.grandTotal).toFixed(2)}</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="products-card">
            <div className="products-card-header">
              <div>
                <h3>Ordered Products</h3>
                <p> Products included in this order</p>
              </div>

              <div className="product-count">
                {order.orderItems.length}{" "}
                {order.orderItems.length === 1 ? "Product": "Products"}
              </div>
            </div>


            <div className="table-responsive">
              <table className="order-products-table">
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

                      <td> <div className="product-name"> {item.productName} </div></td>
                      <td><span className="quantity-badge">{item.quantity}</span></td>

                      <td> ₹{Number(item.unitPrice).toFixed(2)}</td>

                      <td><strong> ₹{Number(item.subtotal).toFixed(2)}</strong>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="order-total-summary">
            <div className="summary-item">
              <span>Products Total</span>
              <strong> ₹{Number(order.totalAmount).toFixed(2)}</strong>
            </div>

            <div className="summary-item">
              <span> Shipping </span>
              <strong> ₹{Number(order.shippingAmount).toFixed(2)}</strong>
            </div>


            <div className="summary-grand-total">
              <span> Grand Total</span>
              <strong> ₹{Number(order.grandTotal).toFixed(2)} </strong>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default AdminOrderDetails;