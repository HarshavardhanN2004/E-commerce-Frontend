import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { fetchProducts } from "../features/slices/productSlice";
import { addProductToCart } from "../features/slices/cartSlice";
import "../styles/Products.css";
import Swal from "sweetalert2";

const API_URL = process.env.REACT_APP_API_URL;
const Products = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { role } = useSelector((state) => state.auth);
  const { products, loading, error } = useSelector(
    (state) => state.products
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 4;

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const categories = [ ...new Map(products.map((product) => [product.categoryId,
        {
          categoryId: product.categoryId,
          categoryName: product.categoryName,
        },
      ])
    ).values(),
  ];

  const filteredProducts = products.filter((product) => {
    const search = searchTerm.toLowerCase();
    const matchesSearch = product.productName?.toLowerCase().includes(search) || product.categoryName?.toLowerCase().includes(search);
    const matchesCategory = selectedCategory === "All" || product.categoryId === Number(selectedCategory);
    return matchesSearch && matchesCategory;
  });

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage;
  const currentProducts = filteredProducts.slice(startIndex,startIndex + productsPerPage);
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  useEffect(() => {
  setCurrentPage(1);
}, [searchTerm, selectedCategory]);

  const handleAddToCart = async (productId) => {
    try {
      await dispatch(addProductToCart({productId: productId,quantity: 1, })
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
        icon: "error",
        title: "Failed to add product to cart",
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
      });
    }
  };

  const handleViewDetails = (product) => {
    setSelectedProduct(product);
  };

  const handleCloseDetails = () => {
    setSelectedProduct(null);
  };

  return (
    <>
      <Navbar />
      <main className="products-page">
        <div className="container">
          <div className="products-header">
            <div>
              <h1>Discover Our Products</h1>
            </div>

            {role === "Admin" && (
              <button className="btn btn-primary" onClick={() => navigate("/admin/products")}> Manage Products</button>
            )}
          </div>

          <div className="products-toolbar">
            <div className="search-box">
              <input type="text" className="form-control" placeholder="Search products..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}/>
            </div>

            <div className="category-filter">
              <select className="form-select" value={selectedCategory} onChange={(e) =>setSelectedCategory(e.target.value) }>
                <option value="All">All Categories</option>
                {categories.map((category) => (
                  <option key={category.categoryId} value={category.categoryId}> {category.categoryName}</option>
                ))}
              </select>
            </div>

            <span className="product-count">
              {filteredProducts.length} products
            </span>
          </div>

          {loading && (
            <div className="products-loading">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden"> Loading...</span>
              </div>
              <p>Loading products...</p>
            </div>
          )}

          {error && (
            <div className="alert alert-danger"> {error} </div>
          )}

          {!loading &&
            !error &&
            filteredProducts.length === 0 && (
              <div className="empty-products">
                <h4>No products found</h4>
                <p> Try searching with a different product name or category. </p>
              </div>
            )}

          {!loading &&
            !error &&
            filteredProducts.length > 0 && (
              <>
              <div className="row g-4">
                {currentProducts.map((product) => (
                  <div className="col-sm-6 col-lg-4 col-xl-3" key={product.productId}>
                    <div className="product-card">
                      <div className="product-image-container">
                        {product.imagePath ? (
                        <img src={`${API_URL.replace("/api", "")}${product.imagePath}`}alt={product.productName} className="product-image"/>
                        ) : (
                          <div className="product-image-placeholder">
                            No image has found 
                          </div>
                        )}
                      </div>

                      <div className="product-content">
                        <span className="product-type"> {product.categoryName}</span>
                        <h5 className="product-name"> {product.productName}</h5>
                        <p className="product-description"> {product.description}</p>
                        <div className="product-bottom">
                          <span className="product-price"> ₹{Number(product.price).toFixed(2)}</span>
                          <span className="product-stock">
                            {product.stock > 0 ? "In Stock": "Out of Stock"}
                          </span>
                        </div>

                        <button className="btn btn-outline-primary w-100 mt-3" onClick={() =>handleViewDetails(product)}>View Details</button>

                        {role === "Customer" && (
                          <button className="btn btn-primary w-100 mt-3" disabled={product.stock <= 0} onClick={() =>handleAddToCart(product.productId)}>
                            {product.stock > 0 ? "Add to Cart" : "Out of Stock"}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {totalPages > 1 && (
              <nav className="mt-4">
                <ul className="pagination justify-content-center">
                  <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                    <button type="button" className="page-link" onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
                      Previous
                    </button>
                  </li>

                  {Array.from({ length: totalPages }, (_, index) => (
                    <li key={index + 1} className={`page-item ${currentPage === index + 1 ? "active" : ""}`}>
                      <button type="button" className="page-link" onClick={() => handlePageChange(index + 1)}>
                        {index + 1}
                      </button>
                    </li>
                  ))}
                  <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                    <button type="button" className="page-link" onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
                      Next
                    </button>
                  </li>

                </ul>
              </nav>
            )}
          </>
            )}
        </div>
      </main>

      {selectedProduct && (
        <div className="product-details-modal-overlay"onMouseDown={(event) => {
            if (event.target === event.currentTarget) { handleCloseDetails();}}}>

          <div className="product-details-modal">
            <div className="product-details-modal-header">
              <h4>Product Details</h4>
              <button type="button" className="product-details-close-button" onClick={handleCloseDetails}>
                ×
              </button>
            </div>

            <div className="product-details-modal-body">
              <div className="product-details-modal-image-section">
                {selectedProduct.imagePath ? (
                <img src={`${API_URL.replace("/api", "")}${selectedProduct.imagePath}`}alt={selectedProduct.productName}className="product-details-modal-image"/>
                ) : (
                  <div className="product-details-modal-image-placeholder">
                    No image found
                  </div>
                )}
              </div>

              <div className="product-details-modal-content">
                <span className="product-details-modal-category"> {selectedProduct.categoryName}</span>
                <h3> {selectedProduct.productName}</h3>
                <p className="product-details-modal-description">{selectedProduct.description}</p>
                <div className="product-details-modal-price"> ₹{Number(selectedProduct.price).toFixed(2)}</div>
                <div className="product-details-modal-stock">
                  {selectedProduct.stock > 0 ? (
                    <span className="text-success"> In Stock ({selectedProduct.stock} available)</span>
                  ) : (
                    <span className="text-danger"> Out of Stock </span>
                  )}
                </div>
              </div>
            </div>

            <div className="product-details-modal-footer">
              <button type="button" className="btn btn-secondary" onClick={handleCloseDetails}> Close</button>

              {role === "Customer" && (
                <button type="button" className="btn btn-primary" disabled={selectedProduct.stock <= 0} onClick={async () => {
                       await handleAddToCart(selectedProduct.productId);
                    handleCloseDetails();
                  }}>
                  {selectedProduct.stock > 0 ? "Add to Cart" : "Out of Stock"}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Products;