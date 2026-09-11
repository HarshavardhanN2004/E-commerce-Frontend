import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { fetchProducts } from "../features/slices/productSlice";
import { addProductToCart } from "../features/slices/cartSlice";
import "../styles/Products.css";
import Swal from "sweetalert2";

const Products = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { role } = useSelector((state) => state.auth);
  const { products, loading, error } = useSelector(
    (state) => state.products
  );

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  // Get unique categories from products
  const categories = [
    ...new Map(
      products.map((product) => [
        product.categoryId,
        {
          categoryId: product.categoryId,
          categoryName: product.categoryName,
        },
      ])
    ).values(),
  ];

  // Search + Category Filter
  const filteredProducts = products.filter((product) => {
    const search = searchTerm.toLowerCase();

    const matchesSearch =
      product.productName?.toLowerCase().includes(search) ||
      product.categoryName?.toLowerCase().includes(search);

    const matchesCategory =
      selectedCategory === "All" ||
      product.categoryId === Number(selectedCategory);

    return matchesSearch && matchesCategory;
  });

  const handleAddToCart = async (productId) => {
    try {
      await dispatch(
        addProductToCart({
          productId: productId,
          quantity: 1,
        })
      ).unwrap();

          Swal.fire({
       toast: true,
       position: "top-end",
       icon: "success",
       title: "Product added to cart successfully",
       showConfirmButton: false,
       timer: 2000,
       timerProgressBar: true,
     });
    } catch (error) {
           Swal.fire({
       toast: true,
       position: "top-end",
       icon: "success",
       title: "failed to add Product to cart ",
       showConfirmButton: false,
       timer: 2000,
       timerProgressBar: true,
     });
    }
  };

  return (
    <>
      <Navbar />

      <main className="products-page">
        <div className="container">

          {/* Products Header */}
          <div className="products-header">
            <div>
              <p className="products-subtitle">
                E-Commerce
              </p>

              <h1>
                Discover Our Products
              </h1>

              <p className="products-description">
                Search for the latest Products
              </p>
            </div>

            {role === "Admin" && (
              <button
                className="btn btn-primary"
                onClick={() => navigate("/admin/products")}
              >
                Manage Products
              </button>
            )}
          </div>

          {/* Search and Category Filter */}
          <div className="products-toolbar">

            <div className="search-box">
              <input
                type="text"
                className="form-control"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) =>
                  setSearchTerm(e.target.value)
                }
              />
            </div>

            <div className="category-filter">
              <select
                className="form-select"
                value={selectedCategory}
                onChange={(e) =>
                  setSelectedCategory(e.target.value)
                }
              >
                <option value="All">
                  All Categories
                </option>

                {categories.map((category) => (
                  <option
                    key={category.categoryId}
                    value={category.categoryId}
                  >
                    {category.categoryName}
                  </option>
                ))}
              </select>
            </div>

            <span className="product-count">
              {filteredProducts.length} products
            </span>
          </div>

          {/* Loading */}
          {loading && (
            <div className="products-loading">
              <div
                className="spinner-border text-primary"
                role="status"
              >
                <span className="visually-hidden">
                  Loading...
                </span>
              </div>

              <p>
                Loading products...
              </p>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="alert alert-danger">
              {error}
            </div>
          )}

          {/* No Products */}
          {!loading &&
            !error &&
            filteredProducts.length === 0 && (
              <div className="empty-products">

                <div className="empty-icon">
                  🛍️
                </div>

                <h4>
                  No products found
                </h4>

                <p>
                  Try searching with a different
                  product name or category.
                </p>

              </div>
            )}

          {/* Product List */}
          {!loading &&
            !error &&
            filteredProducts.length > 0 && (
              <div className="row g-4">

                {filteredProducts.map((product) => (
                  <div
                    className="col-sm-6 col-lg-4 col-xl-3"
                    key={product.productId}
                  >

                    <div className="product-card">

                      {/* Product Image */}
                      <div className="product-image-container">

                        {product.imagePath ? (
                          <img
                            src={`https://localhost:7198${product.imagePath}`}
                            alt={product.productName}
                            className="product-image"
                          />
                        ) : (
                          <div className="product-image-placeholder">
                            🛍️
                          </div>
                        )}

                      </div>

                      {/* Product Content */}
                      <div className="product-content">

                        <span className="product-type">
                          {product.categoryName}
                        </span>

                        <h5 className="product-name">
                          {product.productName}
                        </h5>

                        <p className="product-description">
                          {product.description}
                        </p>

                        <div className="product-bottom">

                          <span className="product-price">
                            ₹{Number(product.price).toFixed(2)}
                          </span>

                          <span className="product-stock">
                            {product.stock > 0
                              ? "In Stock"
                              : "Out of Stock"}
                          </span>

                        </div>

                        <button  className="btn btn-outline-primary w-100 mt-3"  onClick={() => navigate(`/products/${product.productId}`)}>
                          View Details
                        </button>

                        {/* Add To Cart */}
                        {role === "Customer" && (
                          <button
                            className="btn btn-primary w-100 mt-3"
                            disabled={product.stock <= 0}
                            onClick={() =>
                              handleAddToCart(
                                product.productId
                              )
                            }
                          >
                            {product.stock > 0
                              ? "Add to Cart"
                              : "Out of Stock"}
                          </button>
                        )}

                      </div>
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

export default Products;