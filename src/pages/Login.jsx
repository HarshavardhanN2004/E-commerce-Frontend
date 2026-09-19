import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loginSuccess } from "../features/slices/authSlice";
import { loginUser } from "../services/authService";
import Navbar from "../components/Navbar";
import "../styles/Login.css";
import Swal from "sweetalert2";

const loginSchema = yup.object({
  email: yup
    .string()
    .trim()
    .email("Please enter a valid email address")
    .required("Email is required"),

  password: yup
    .string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters"),
});

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(loginSchema),
    mode: "onBlur",
  });

  const onSubmit = async (data) => {
    setServerError("");

    try {
      const response = await loginUser(data);
      dispatch(loginSuccess(response));
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: "Login Successful",
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
      }).then(() => {
        if (response.role === "Admin") {
          navigate("/admin");
        } else if (response.role === "Customer") {
          navigate("/products");
        }
      });
    } catch (error) {
      setServerError(
        error.response?.data?.message ||
        error.response?.data ||
        "Invalid email or password"
      );
    }
  };

  return (
    <>
    <Navbar page="login" />
    <div className="login-page">
      <div className="login-card">
        <div className="login-header">
         <div className="login-logo">
            <i className="bi bi-bag-check-fill"></i>
          </div>
          <h1>SIGN IN</h1>
        </div>

        {serverError && (
          <div className="alert alert-danger login-error" role="alert">{serverError} </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="mb-3">
            <label htmlFor="email" className="form-label"> Email Address </label>

            <input type="email" id="email" placeholder="Enter your email"
              className={`form-control ${
                errors.email ? "is-invalid" : ""
              }`}
              {...register("email")}
            />

            {errors.email && (
              <div className="invalid-feedback">
                {errors.email.message}
              </div>
            )}
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="form-label"> Password </label>

            <input type="password" id="password" placeholder="Enter your password"
              className={`form-control ${
                errors.password ? "is-invalid" : ""
              }`}
              {...register("password")}
            />

            {errors.password && (
              <div className="invalid-feedback">
                {errors.password.message}
              </div>
            )}
          </div>

          <button type="submit" className="btn btn-primary w-100 login-button" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" aria-hidden="true"></span>
                Logging in...
              </>
            ) : (
              "Login"
            )}
          </button>
        </form>
        <div className="login-footer">
          <p> Don't have an account?{" "}
            <span onClick={() => navigate("/register")}>Create Account </span>
          </p>
        </div>
      </div>
    </div>
    </>
  );
};

export default Login;