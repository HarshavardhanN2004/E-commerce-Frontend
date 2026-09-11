import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Navbar from "../components/Navbar";
import {fetchCart, updateProductQuantity, deleteCartItem, removeAllCartItems,} from "../features/slices/cartSlice";
import Swal from "sweetalert2";
import "../styles/Cart.css";

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
 const { cart, loading } = useSelector(
  (state) => state.cart
);

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

 const handleQuantityChange = async (item, newQuantity) => {
  if (newQuantity < 1) {
    return;
  }
  try {
    await dispatch(
      updateProductQuantity({
        cartItemId: item.cartItemId,
        cartData: newQuantity,
      })
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
      await dispatch(
        deleteCartItem(cartItemId)
      ).unwrap();
    } catch (error) {
      alert(error || "Failed to remove item");
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
    await dispatch(
      removeAllCartItems()
    ).unwrap();
  } catch (error) {
    alert(error || "Failed to clear cart");
  }
};

  return (
    <>
      <Navbar />

      <main className="cart-page">
        <div className="container">
          <div className="cart-header">
            <div>
              <p className="cart-subtitle">ShopEase</p>
              <h1>My Cart</h1>
              <p className="cart-description"> Review  your products before placing your order. </p>
            </div>
          </div>

          {loading && (
            <div className="cart-loading">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden"> Loading... </span>
              </div>
              <p>Loading your cart...</p>
            </div>
          )}

               {!loading &&
               (!cart ||
               !cart.cartItems ||
               cart.cartItems.length === 0) && (
              <div className="empty-cart">
                <div className="empty-cart-icon">
                  🛒
                </div>
                <h4>Your cart is empty</h4>
                <p>Add some products to your cart to get started.</p>
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
                        <button className="quantity-button" onClick={() =>handleQuantityChange(item,item.quantity - 1)}
                          disabled={item.quantity <= 1}> −
                        </button>
                        <span className="quantity-value"> {item.quantity}</span>
                        <button className="quantity-button" onClick={() => handleQuantityChange(item,item.quantity + 1)}> +</button>
                      </div>

                      <div className="cart-item-subtotal"> ₹ {Number(item.subtotal).toFixed(2)} </div>
                      <button className="remove-button" onClick={() =>handleRemoveItem(item.cartItemId)}>🗑️</button>
                    </div>
                  ))}

                  <button className="btn btn-outline-danger clear-cart-button" onClick={handleClearCart}> Clear Cart </button>
                </div>

               <div className="cart-summary">
                    <h4>Order  Summary</h4>
                    <div className="summary-row">
                      <span>Total</span>
                      <strong> ₹ {Number(cart.totalAmount).toFixed(2)} </strong>
                    </div>

                    <button className="btn btn-primary checkout-button" onClick={() => navigate("/checkout")}> Proceed to Checkout</button>
                  </div>
              </div>
            )}
        </div>
      </main>
    </>
  );
};

export default Cart;