import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "../styles/Register.css";
import Navbar from "../components/Navbar";

const registerSchema = yup.object({
  name: yup
    .string()
    .trim()
    .required("Name is required")
    .min(3, "Name must be at least 3 characters")
    .matches(/^[A-Za-z\s]+$/, "Name can contain only letters and spaces"),

  email: yup
    .string()
    .trim()
    .email("Please enter a valid email address")
    .required("Email is required"),

   password: yup
     .string()
     .required("Password is required.")
     .min(8, "Password must be at least 8 characters.")
     .matches(/[A-Z]/,"Password must contain at least one uppercase letter.")
     .matches(/[a-z]/,"Password must contain at least one lowercase letter.")
     .matches(/[0-9]/,"Password must contain at least one number.")
     .matches(/[!@#$%^&*(),.?":{}|<>]/,"Password must contain at least one special character."),

    confirmPassword: yup
     .string()
     .required("Confirm Password is required.")
     .oneOf([yup.ref("password")],"Passwords must match.")
});

const Register = () => {
  const navigate = useNavigate();
  const [serverError, setServerError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(registerSchema),
    mode: "onBlur",
  });

  const onSubmit = async (data) => {
    setServerError("");
    setSuccessMessage("");

    try {
     const registerData = {
         name: data.name,
         email: data.email,
         password: data.password,
         confirmPassword: data.confirmPassword,
        };

      await api.post("/Auth/register", registerData);
      setSuccessMessage("Registration successful! You can now login.");
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (error) {
  const responseData = error.response?.data;

  if (responseData?.errors) {
    const validationErrors = Object.values(responseData.errors)
      .flat()
      .join(" ");

    setServerError(validationErrors);
  } else if (responseData?.message) {
    setServerError(responseData.message);
  } else if (typeof responseData === "string") {
    setServerError(responseData);
  } else {
    setServerError("Registration failed. Please try again.");
  }
}
  };

  return (
      <>
    <Navbar page="register" />
    <div className="register-page">
      <div className="register-card">
        <div className="register-header">
          <div className="register-logo">
            <i className="bi bi-person-plus-fill"></i>
          </div>
          <h1>Create Account</h1>
          <p> Join E-Commerce and start shopping today. </p>
        </div>

        {serverError && (
          <div className="alert alert-danger register-alert"role="alert" >{serverError}</div>
        )}

        {successMessage && (
          <div className="alert alert-success register-alert" role="alert"> {successMessage} </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="mb-3">
            <label htmlFor="name" className="form-label"> Full Name </label>

            <input type="text" id="name" placeholder="Enter your full name"
              className={`form-control ${
                errors.name ? "is-invalid" : ""
              }`}
              {...register("name")}
            />

            {errors.name && (
              <div className="invalid-feedback">{errors.name.message}</div>
            )}
          </div>

          <div className="mb-3">
            <label htmlFor="email" className="form-label"> Email Address </label>

            <input type="email" id="email" placeholder="Enter your email"
              className={`form-control ${
                errors.email ? "is-invalid" : ""
              }`}
              {...register("email")}
            />

            {errors.email && (
              <div className="invalid-feedback"> {errors.email.message} </div>
            )}
          </div>

          <div className="mb-3">
            <label htmlFor="password" className="form-label"> Password </label>

            <input type="password" id="password" placeholder="Enter your password"
              className={`form-control ${
                errors.password ? "is-invalid" : ""
              }`}
              {...register("password")}
            />

            {errors.password && (
              <div className="invalid-feedback"> {errors.password.message} </div>
            )}
          </div>

          <div className="mb-4">
            <label htmlFor="confirmPassword" className="form-label" > Confirm Password </label>
            <input type="password" id="confirmPassword" placeholder="Confirm your password"
              className={`form-control ${
                errors.confirmPassword ? "is-invalid" : ""
              }`}
              {...register("confirmPassword")}
            />

            {errors.confirmPassword && (
              <div className="invalid-feedback">{errors.confirmPassword.message} </div>
            )}
          </div>

          <button type="submit" className="btn btn-primary w-100 register-button" disabled={isSubmitting} >
            {isSubmitting ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" aria-hidden="true" ></span>
                Registering Account...
              </>
            ) : (
              "Register Account"
            )}
          </button>
        </form>

        <div className="register-footer">
          <p>
            Already have an account?{" "}
            <span onClick={() => navigate("/login")}> Login </span>
          </p>
        </div>
      </div>
    </div>
    </>
  );
};

export default Register;