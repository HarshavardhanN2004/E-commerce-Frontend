import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Navbar from "../components/Navbar";
import { fetchCart } from "../features/slices/cartSlice";
import { placeOrder } from "../features/slices/orderSlice";
import Swal from "sweetalert2";


const checkoutSchema = yup.object({
  name: yup
    .string()
    .required("Name is required.")
    .matches( /^[A-Za-z ]+$/, "Name can contain only letters and spaces." ),

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
    .matches(/^[A-Za-z ]+$/,"State can contain only letters and spaces."),

  postalCode: yup
    .string()
    .required("Postal code is required.")
    .matches(/^[0-9]{6}$/,"Postal code must contain exactly 6 digits."),

  phoneNumber: yup
    .string()
    .required("Phone number is required.")
    .matches(/^[6-9][0-9]{9}$/,"Phone number must contain 10 digits and start with 6-9."),

  paymentMethod: yup
    .string()
    .required("Please select a payment method."),
});

const Checkout = () => {
   const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cart, loading } = useSelector((state) => state.cart);
    useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(checkoutSchema),
  });

 const onSubmit = async (data) => {
  try {
    const result = await dispatch(placeOrder(data)).unwrap();
    console.log("Order placed successfully:", result);
    navigate(`/orders/${result.orderId}`);
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "Order Failed",
      text: error || "Unable to place your order.",
    });
  }
};

  if (loading) {
  return (
    <>
      <Navbar />

      <main className="checkout-page">
        <div className="container">

          <div className="checkout-loading">
            <div
              className="spinner-border text-primary"
              role="status"
            >
              <span className="visually-hidden">
                Loading...
              </span>
            </div>

            <p>Loading your checkout...</p>
          </div>

        </div>
      </main>
    </>
  );
}

  if (!cart || !cart.cartItems || cart.cartItems.length === 0) {
    return (
      <>
        <Navbar />
        <main className="checkout-page">
          <div className="container">

            <div className="empty-checkout">
              <div className="empty-checkout-icon">
                🛒
              </div>
              <h4>Your cart is empty</h4>
              <p> Add products to your cart before proceeding to checkout. </p>
              <button className="btn btn-primary" onClick={() => navigate("/products")}>Continue Shopping</button>
            </div>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="checkout-page">
        <div className="container">

          <div className="checkout-header">
            <h1>Checkout</h1>
            <p className="checkout-description"> Enter your delivery details to place your order. </p>
          </div>

          <div className="checkout-container">
            <div className="checkout-form-card">
              <h4>Delivery Information</h4>
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Name</label>

                    <input type="text" className={`form-control ${errors.name ? "is-invalid" : ""}`} {...register("name")}/>

                    {errors.name && (
                      <div className="invalid-feedback">{errors.name.message} </div>
                    )}
                  </div>

                  <div className="col-md-6 mb-3">
                    <label className="form-label"> Phone Number </label>

                    <input type="text" className={`form-control ${errors.phoneNumber ? "is-invalid" : ""}`}
                      {...register("phoneNumber")}
                    />

                    {errors.phoneNumber && (
                      <div className="invalid-feedback"> {errors.phoneNumber.message} </div>
                    )}
                  </div>

                </div>

                <div className="mb-3">
                  <label className="form-label"> Address</label>

                  <textarea rows="3" className={`form-control ${errors.address ? "is-invalid" : "" }`}
                    {...register("address")}
                  ></textarea>

                  {errors.address && (
                    <div className="invalid-feedback">{errors.address.message}</div>
                  )}
                </div>

                <div className="row">
                  <div className="col-md-4 mb-3">
                    <label className="form-label"> City </label>

                    <input type="text" className={`form-control ${errors.city ? "is-invalid" : "" }`}
                      {...register("city")}
                    />

                    {errors.city && (
                      <div className="invalid-feedback"> {errors.city.message} </div>
                    )}
                  </div>

                  <div className="col-md-4 mb-3">
                    <label className="form-label"> State </label>

                    <input type="text" className={`form-control ${errors.state ? "is-invalid" : "" }`}
                      {...register("state")}
                    />

                    {errors.state && (
                      <div className="invalid-feedback">{errors.state.message}</div>
                    )}
                  </div>

                  <div className="col-md-4 mb-3">
                    <label className="form-label"> Postal Code</label>

                    <input type="text" className={`form-control ${errors.postalCode ? "is-invalid" : "" }`}
                      {...register("postalCode")}
                    />

                    {errors.postalCode && (
                      <div className="invalid-feedback">
                        {errors.postalCode.message}
                      </div>
                    )}
                  </div>

                </div>

                <div className="mb-4">
                  <label className="form-label">
                    Payment Method
                  </label>

                  <select
                    className={`form-select ${
                      errors.paymentMethod ? "is-invalid" : ""
                    }`}
                    {...register("paymentMethod")}
                  >
                    <option value="">
                      Select payment method
                    </option>

                    <option value="Cash on Delivery">
                      Cash on Delivery
                    </option>
                  </select>

                  {errors.paymentMethod && (
                    <div className="invalid-feedback">
                      {errors.paymentMethod.message}
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  className="btn btn-primary checkout-button"
                >
                  Place Order
                </button>

              </form>

            </div>

          </div>

        </div>
      </main>
    </>
  );
};

export default Checkout;