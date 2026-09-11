import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Navbar from "../components/Navbar";
import { getProductById } from "../services/productService";
import { addProductToCart } from "../features/slices/cartSlice";
import "../styles/ProductDetails.css";

const ProductDetails = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { role } = useSelector((state) => state.auth);

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getProductById(productId);

        setProduct(data);
      } catch (error) {
        setError(
          error.response?.data ||
            "Failed to load product details."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [productId]);

  const handleAddToCart = async () => {
    try {
      await dispatch(
        addProductToCart({
          productId: product.productId,
          quantity: 1,
        })
      ).unwrap();

      alert("Product added to cart successfully!");
    } catch (error) {
      alert(error || "Failed to add product to cart.");
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />

        <main className="product-details-page">
          <div className="container">
            <div className="product-details-loading">
              <div
                className="spinner-border text-primary"
                role="status"
              >
                <span className="visually-hidden">
                  Loading...
                </span>
              </div>

              <p>Loading product details...</p>
            </div>
          </div>
        </main>
      </>
    );
  }

  if (error || !product) {
    return (
      <>
        <Navbar />

        <main className="product-details-page">
          <div className="container">
            <div className="alert alert-danger">
              {error || "Product not found."}
            </div>

            <button
              className="btn btn-primary"
              onClick={() => navigate("/products")}
            >
              Back to Products
            </button>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <main className="product-details-page">
        <div className="container">

          <button
            className="btn btn-outline-secondary mb-4"
            onClick={() => navigate("/products")}
          >
            ← Back to Products
          </button>

          <div className="product-details-card">

            {/* Product Image */}
            <div className="product-details-image-section">
              {product.imagePath ? (
                <img
                  src={`https://localhost:7198${product.imagePath}`}
                  alt={product.productName}
                  className="product-details-image"
                />
              ) : (
                <div className="product-details-image-placeholder">
                  🛍️
                </div>
              )}
            </div>

            {/* Product Information */}
            <div className="product-details-content">

              <span className="product-details-category">
                {product.categoryName}
              </span>

              <h1 className="product-details-name">
                {product.productName}
              </h1>

              <p className="product-details-description">
                {product.description}
              </p>

              <div className="product-details-price">
                ₹{Number(product.price).toFixed(2)}
              </div>

              <div className="product-details-stock">
                {product.stock > 0 ? (
                  <span className="text-success">
                    ✓ In Stock ({product.stock} available)
                  </span>
                ) : (
                  <span className="text-danger">
                    ✕ Out of Stock
                  </span>
                )}
              </div>

              {role === "Customer" && (
                <button
                  className="btn btn-primary product-details-cart-button"
                  disabled={product.stock <= 0}
                  onClick={handleAddToCart}
                >
                  {product.stock > 0
                    ? "Add to Cart"
                    : "Out of Stock"}
                </button>
              )}

            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default ProductDetails;