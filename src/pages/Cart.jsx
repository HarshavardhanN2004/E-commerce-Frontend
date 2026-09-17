import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchCart, updateProductQuantity, deleteCartItem, removeAllCartItems } from "../features/slices/cartSlice";
import { placeOrder } from "../features/slices/orderSlice";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Navbar from "../components/Navbar";
import Swal from "sweetalert2";
import "../styles/Cart.css";

const checkoutSchema = yup.object({

  name: yup
    .string()
    .required("Name is required.")
    .matches( /^[A-Za-z ]+$/, "Name can contain only letters and spaces."),

  address: yup
    .string()
    .required("Address is required."),

  city: yup
    .string()
    .required("City is required.")
    .matches(/^[A-Za-z ]+$/,"City can contain only letters and spaces."),

  state: yup
    .string()
    .required("State is required.")
    .matches(/^[A-Za-z ]+$/, "State can contain only letters and spaces."),

  postalCode: yup
    .string()
    .required("Postal code is required.")
    .matches( /^[0-9]{6}$/,"Postal code must contain exactly 6 digits."),

  phoneNumber: yup
    .string()
    .required("Phone number is required.")
    .matches(/^[6-9][0-9]{9}$/,"Phone number must contain 10 digits and start with 6-9."),

  paymentMethod: yup
    .string()
    .required("Please select a payment method."),
});


const Cart = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cart, loading } = useSelector(
    (state) => state.cart
  );
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [placingOrder, setPlacingOrder] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(checkoutSchema),
  });

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  const handleQuantityChange = async (item, newQuantity) => {
    if (newQuantity < 1) {
      return;
    }
    
    try {
      await dispatch(
        updateProductQuantity({cartItemId: item.cartItemId,cartData: newQuantity,})
      ).unwrap();
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Unable to Update",
        text: error || "Failed to update quantity.",
        timer: 2000,
        showConfirmButton: false,
      });
    }
  };

  const handleRemoveItem = async (cartItemId) => {
    try {
      await dispatch( deleteCartItem(cartItemId)).unwrap();
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Unable to Remove",
        text: error || "Failed to remove item.",
        timer: 2000,
        showConfirmButton: false,
      });
    }
  };

  const handleClearCart = async () => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to clear all items from your cart?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Clear Cart",
      cancelButtonText: "Cancel",
      reverseButtons: true,
    });

    if (!result.isConfirmed) {
      return;
    }

    try {
      await dispatch(removeAllCartItems()).unwrap();
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Unable to Clear Cart",
        text: error || "Failed to clear cart.",
        timer: 2000,
        showConfirmButton: false,
      });
    }
  };

  const handleOpenCheckout = () => {
    reset();
    setShowCheckoutModal(true);
  };

  const handleCloseCheckout = () => {
    if (placingOrder) {
      return;
    }
    setShowCheckoutModal(false);
    reset();
  };

 const onSubmit = async (data) => {
  try {
    setPlacingOrder(true);
    const result = await dispatch(placeOrder(data)).unwrap();
    await Swal.fire({
      toast: true,
      position: "top-end",
      icon: "success",
      title: "Order placed successfully!",
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true,
    });
    setShowCheckoutModal(false);
    reset();
    navigate(`/orders/${result.orderId}`);
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "Order Failed",
      text: error || "Unable to place your order.",
    });
  } finally {
    setPlacingOrder(false);
  }
};

  return (
    <>
      <Navbar />
      <main className="cart-page">
        <div className="container">
          <div className="cart-header">
            <div>
              <h1> My Cart </h1>
              <p className="cart-description"> Review your products before placing your order.</p>
            </div>
          </div>

          {loading && (
            <div className="cart-loading">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden"> Loading... </span>
              </div>
              <p> Loading your cart... </p>
            </div>
          )}

          {!loading &&
            (!cart || !cart.cartItems ||
              cart.cartItems.length === 0) && (
              <div className="empty-cart">
                <h4> Your cart is empty</h4>
                <p> Add some products to your cart to get started. </p>
              </div>
            )}

          {!loading &&
            cart &&
            cart.cartItems &&
            cart.cartItems.length > 0 && (

              <div className="cart-container">
                <div className="cart-items">
                  {cart.cartItems.map((item) => (
                    <div className="cart-item" key={item.cartItemId}>
                      <div className="cart-item-info">
                        <h5> {item.productName} </h5>
                        <p> Unit Price: ₹ {Number(item.unitPrice).toFixed(2)} </p>
                      </div>

                      <div className="cart-quantity">
                        <button className="quantity-button" onClick={() =>handleQuantityChange(item,item.quantity - 1)}disabled={item.quantity <= 1}>
                          −
                        </button>
                        <span className="quantity-value"> {item.quantity}</span>
                        <button className="quantity-button" onClick={() =>handleQuantityChange(item,item.quantity + 1)}>
                          +
                        </button>
                      </div>

                      <div className="cart-item-subtotal"> ₹ {Number(item.subtotal).toFixed(2)} </div>
                      <button type="button" className="remove-button" onClick={() =>handleRemoveItem(item.cartItemId)}>Remove</button>
                    </div>
                  ))}
                  <button className="btn btn-outline-danger clear-cart-button" onClick={handleClearCart}>Clear Cart </button>
                </div>

                <div className="cart-summary">
                  <h4> Order Summary</h4>
                  <div className="summary-row">
                    <span> Total </span>
                    <strong> ₹ {Number(cart.totalAmount).toFixed(2)}</strong>
                  </div>
                  <button className="btn btn-primary checkout-button" onClick={handleOpenCheckout}>Proceed to Checkout </button>
                </div>
              </div>
            )}
        </div>
      </main>

      {showCheckoutModal && (
        <div className="checkout-modal-overlay" onMouseDown={(event) => {
            if (
              event.target === event.currentTarget &&
              !placingOrder
            ) { handleCloseCheckout();}
          }}>

          <div className="checkout-modal">
            <div className="checkout-modal-header">
              <div>
                <h4> Delivery Information</h4>
                <p> Enter your details to place your order. </p>
              </div>

              <button type="button" className="checkout-modal-close" onClick={handleCloseCheckout}disabled={placingOrder}>
                ×
              </button>
            </div>

            <div className="checkout-modal-body">
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label"> Name </label>
                    <input type="text" className={`form-control ${errors.name ? "is-invalid" : "" }`}
                      {...register("name", {
                        setValueAs: (value) =>value? value.charAt(0).toUpperCase() + value.slice(1): value,})}/>

                    {errors.name && (
                      <div className="invalid-feedback"> {errors.name.message}</div>
                    )}
                  </div>

                  <div className="col-md-6 mb-3">
                    <label className="form-label">Phone Number </label>
                    <input type="text" className={`form-control ${errors.phoneNumber ? "is-invalid" : "" }`}
                      {...register("phoneNumber")}/>

                    {errors.phoneNumber && (
                      <div className="invalid-feedback">{errors.phoneNumber.message}</div>
                    )}
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label">Address</label>

                  <textarea rows="3" className={`form-control ${errors.address ? "is-invalid" : ""}`}
                    {...register("address", {
                      setValueAs: (value) =>value? value.charAt(0).toUpperCase() + value.slice(1): value,})}></textarea>

                  {errors.address && (
                    <div className="invalid-feedback">{errors.address.message}</div>
                  )}

                </div>

                <div className="row">
                  <div className="col-md-4 mb-3">
                    <label className="form-label"> City </label>

                    <input type="text" className={`form-control ${errors.city? "is-invalid": ""}`}
                      {...register("city", {
                        setValueAs: (value) =>value? value.charAt(0).toUpperCase() +value.slice(1): value,})}/>

                    {errors.city && (
                      <div className="invalid-feedback">{errors.city.message}</div>
                    )}

                  </div>

                  <div className="col-md-4 mb-3">
                    <label className="form-label">State</label>

                    <input type="text" className={`form-control ${errors.state ? "is-invalid" : "" }`}
                      {...register("state", {
                        setValueAs: (value) => value? value.charAt(0).toUpperCase() +  value.slice(1): value, })}/>

                    {errors.state && (
                      <div className="invalid-feedback"> {errors.state.message} </div>
                    )}
                  </div>


                  <div className="col-md-4 mb-3">
                    <label className="form-label"> Postal Code </label>

                    <input type="text" className={`form-control ${errors.postalCode ? "is-invalid" : ""}`}
                      {...register("postalCode")}/>

                    {errors.postalCode && (
                      <div className="invalid-feedback">{errors.postalCode.message}</div>
                    )}
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label"> Payment Method </label>

                  <select className={`form-select ${errors.paymentMethod? "is-invalid": "" }`} {...register("paymentMethod")}>
                    <option value=""> Select payment method </option>
                    <option value="Cash on Delivery"> Cash on Delivery  </option>
                    <option value="Online Payment">Online Payment </option>
                  </select>

                  {errors.paymentMethod && (
                    <div className="invalid-feedback">{errors.paymentMethod.message} </div>)}
                </div>

                <div className="checkout-modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={handleCloseCheckout} disabled={placingOrder}> Cancel</button>
                  <button type="submit" className="btn btn-primary" disabled={placingOrder}>

                    {placingOrder ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" aria-hidden="true"></span>
                        Placing Order...
                      </>
                    ) : ("Place Order")}

                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Cart;