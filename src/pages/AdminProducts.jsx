import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { removeProduct } from "../features/slices/productSlice";
import { useDispatch } from "react-redux";
import Navbar from "../components/Navbar";
import "../styles/AdminProducts.css";
import Swal from "sweetalert2";

const schema = yup.object({
  productName: yup
    .string()
    .required("Product name is required."),

  description: yup
    .string()
    .required("Description is required."),

  price: yup
    .number()
    .typeError("Price must be a number.")
    .positive("Price must be greater than 0.")
    .required("Price is required."),

  stock: yup
    .number()
    .typeError("Stock must be a number.")
    .integer("Stock must be a whole number.")
    .min(0, "Stock cannot be negative.")
    .required("Stock is required."),

  categoryId: yup
    .number()
    .typeError("Please select a category.")
    .required("Category is required."),
});

const AdminProducts = () => {
  const dispatch = useDispatch();

  // Products and categories
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  // Loading states
  const [loading, setLoading] = useState(false);
  const [categoryLoading, setCategoryLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Error states
  const [error, setError] = useState("");
  const [categoryError, setCategoryError] = useState("");
  const [submitError, setSubmitError] = useState("");

  // Add/Edit modal
  const [showProductModal, setShowProductModal] = useState(false);

  // Product currently being edited
  const [editingProduct, setEditingProduct] = useState(null);

  // Product currently being deleted
  const [deletingProduct, setDeletingProduct] = useState(null);

  // Image states
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  const API_URL = process.env.REACT_APP_API_URL;

  const token = localStorage.getItem("token");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),

    defaultValues: {
      productName: "",
      description: "",
      price: "",
      stock: "",
      categoryId: "",
    },
  });

  // ==================================================
  // GET ALL PRODUCTS
  // ==================================================

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API_URL}/Products`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch products.");
      }

      const data = await response.json();

      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // ==================================================
  // GET ALL CATEGORIES
  // ==================================================

  const fetchCategories = async () => {
    try {
      setCategoryLoading(true);
      setCategoryError("");

      const response = await fetch(`${API_URL}/Categories`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch categories.");
      }

      const data = await response.json();

      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
      setCategoryError(error.message);
    } finally {
      setCategoryLoading(false);
    }
  };

  // ==================================================
  // LOAD PRODUCTS AND CATEGORIES
  // ==================================================

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  // ==================================================
  // OPEN ADD PRODUCT MODAL
  // ==================================================

  const openAddModal = () => {
    setEditingProduct(null);

    reset({
      productName: "",
      description: "",
      price: "",
      stock: "",
      categoryId: "",
    });

    setSelectedImage(null);
    setImagePreview("");
    setSubmitError("");
    setCategoryError("");

    setShowProductModal(true);
  };

  // ==================================================
  // OPEN EDIT PRODUCT MODAL
  // ==================================================

  const openEditModal = (product) => {
    setEditingProduct(product);

    reset({
      productName: product.productName,
      description: product.description,
      price: product.price,
      stock: product.stock,
      categoryId: product.categoryId,
    });

    setSelectedImage(null);
    setSubmitError("");
    setCategoryError("");

    if (product.imagePath) {
      setImagePreview(
        `${API_URL.replace("/api", "")}${product.imagePath}`
      );
    } else {
      setImagePreview("");
    }

    setShowProductModal(true);
  };

  // ==================================================
  // CLOSE ADD / EDIT MODAL
  // ==================================================

  const closeProductModal = () => {
    setEditingProduct(null);

    reset({
      productName: "",
      description: "",
      price: "",
      stock: "",
      categoryId: "",
    });

    setSelectedImage(null);
    setImagePreview("");
    setSubmitError("");

    setShowProductModal(false);
  };

  // ==================================================
  // IMAGE CHANGE
  // ==================================================

  const handleImageChange = (event) => {
    const file = event.target.files[0];

    if (!file) {
      setSelectedImage(null);

      // Keep existing image while editing
      if (editingProduct?.imagePath) {
        setImagePreview(
          `${API_URL.replace("/api", "")}${editingProduct.imagePath}`
        );
      } else {
        setImagePreview("");
      }

      return;
    }

    setSelectedImage(file);

    const previewUrl = URL.createObjectURL(file);

    setImagePreview(previewUrl);
  };

  // ==================================================
  // ADD PRODUCT
  // ==================================================

  const handleAddProduct = async (data) => {
    try {
      setSubmitting(true);
      setSubmitError("");

      const formData = new FormData();

      formData.append("ProductName", data.productName);
      formData.append("Description", data.description);
      formData.append("Price", data.price);
      formData.append("Stock", data.stock);
      formData.append("CategoryId", data.categoryId);

      // Image is optional
      if (selectedImage) {
        formData.append("Image", selectedImage);
      }

      const response = await fetch(`${API_URL}/Products`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        let errorMessage = "Failed to add product.";

        try {
          const errorData = await response.json();

          if (typeof errorData === "string") {
            errorMessage = errorData;
          } else if (errorData?.message) {
            errorMessage = errorData.message;
          }
        } catch {
          // Keep default error message
        }

        throw new Error(errorMessage);
      }

      const newProduct = await response.json();

      // Add new product to table
      setProducts((currentProducts) => [
        ...currentProducts,
        newProduct,
      ]);

      closeProductModal();

     Swal.fire({
  toast: true,
  position: "top-end",
  icon: "success",
  title: "Product added successfully",
  showConfirmButton: false,
  timer: 2000,
  timerProgressBar: true,
});
    } catch (error) {
      console.error("Error adding product:", error);
      setSubmitError(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  // ==================================================
  // UPDATE PRODUCT
  // ==================================================

  const handleUpdateProduct = async (data) => {
    try {
      setSubmitting(true);
      setSubmitError("");

      const formData = new FormData();

      formData.append("ProductName", data.productName);
      formData.append("Description", data.description);
      formData.append("Price", data.price);
      formData.append("Stock", data.stock);
      formData.append("CategoryId", data.categoryId);

      // Only send image if a new image is selected
      if (selectedImage) {
        formData.append("Image", selectedImage);
      }

      const response = await fetch(
        `${API_URL}/Products/${editingProduct.productId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        let errorMessage = "Failed to update product.";

        try {
          const errorData = await response.json();

          if (typeof errorData === "string") {
            errorMessage = errorData;
          } else if (errorData?.message) {
            errorMessage = errorData.message;
          }
        } catch {
          // Keep default error message
        }

        throw new Error(errorMessage);
      }

      const updatedProduct = await response.json();

      // Update product in table
      setProducts((currentProducts) =>
        currentProducts.map((product) =>
          product.productId === updatedProduct.productId
            ? updatedProduct
            : product
        )
      );

      closeProductModal();
Swal.fire({
  toast: true,
  position: "top-end",
  icon: "success",
  title: "Product updated successfully",
  showConfirmButton: false,
  timer: 2000,
  timerProgressBar: true,
});
    } catch (error) {
      console.error("Error updating product:", error);
      setSubmitError(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  // ==================================================
  // ADD OR UPDATE PRODUCT
  // ==================================================

  const handleProductSubmit = (data) => {
    if (editingProduct) {
      handleUpdateProduct(data);
    } else {
      handleAddProduct(data);
    }
  };

  // ==================================================
  // OPEN DELETE MODAL
  // ==================================================

  const openDeleteModal = (product) => {
    setDeletingProduct(product);
    setError("");
  };

  // ==================================================
  // CLOSE DELETE MODAL
  // ==================================================

  const closeDeleteModal = () => {
    setDeletingProduct(null);
    setError("");
  };

  // ==================================================
  // DELETE PRODUCT
  // ==================================================

  const handleDeleteProduct = async () => {
    if (!deletingProduct) {
      return;
    }

    try {
      setDeleting(true);
      setError("");

      // Keep using Redux for delete
      await dispatch(
        removeProduct(deletingProduct.productId)
      ).unwrap();

      // Remove product from table
      setProducts((currentProducts) =>
        currentProducts.filter(
          (product) =>
            product.productId !== deletingProduct.productId
        )
      );

      closeDeleteModal();

     Swal.fire({
  toast: true,
  position: "top-end",
  icon: "success",
  title: "Product deleted successfully",
  showConfirmButton: false,
  timer: 2000,
  timerProgressBar: true,
});
    } catch (error) {
      console.error("Error deleting product:", error);

      setError(
        typeof error === "string"
          ? error
          : "Failed to delete product."
      );
    } finally {
      setDeleting(false);
    }
  };

  // ==================================================
  // IMAGE URL
  // ==================================================

  const getImageUrl = (imagePath) => {
    if (!imagePath) {
      return "";
    }

    return `${API_URL.replace("/api", "")}${imagePath}`;
  };

  // ==================================================
  // PAGE UI
  // ==================================================

  return (
    <>
      <Navbar />

      <main className="admin-products-page">
        <div className="container">

          {/* ==============================
              PAGE HEADER
              ============================== */}

          <div className="admin-products-header">

            <div>
              <h1>Manage Products</h1>

              <p>
                View and manage all products.
              </p>
            </div>

            <button
              type="button"
              className="btn btn-primary"
              onClick={openAddModal}
            >
              Add Product
            </button>

          </div>


          {/* ==============================
              PRODUCTS ERROR
              ============================== */}

          {error && !deletingProduct && (
            <div className="alert alert-danger">
              {error}
            </div>
          )}


          {/* ==============================
              PRODUCTS LOADING
              ============================== */}

          {loading && (
            <div className="text-center mt-4">

              <div
                className="spinner-border text-primary"
                role="status"
              >
                <span className="visually-hidden">
                  Loading...
                </span>
              </div>

              <p className="mt-2">
                Loading products...
              </p>

            </div>
          )}


          {/* ==============================
              PRODUCTS TABLE
              ============================== */}

          {!loading && (
            <div className="table-responsive">

              <table className="table table-bordered table-hover admin-products-table">

                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Image</th>
                    <th>Product</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Stock</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>

                  {products.length === 0 ? (

                    <tr>
                      <td
                        colSpan="7"
                        className="text-center"
                      >
                        No products found.
                      </td>
                    </tr>

                  ) : (

                    products.map((product) => (

                      <tr key={product.productId}>

                        <td>
                          {product.productId}
                        </td>


                        {/* IMAGE */}

                        <td>

                          {product.imagePath ? (

                            <img
                              src={getImageUrl(product.imagePath)}
                              alt={product.productName}
                              className="admin-product-image"
                            />

                          ) : (

                            <span>
                              No image
                            </span>

                          )}

                        </td>


                        {/* PRODUCT */}

                        <td>
                          {product.productName}
                        </td>


                        {/* CATEGORY */}

                        <td>
                          {product.categoryName}
                        </td>


                        {/* PRICE */}

                        <td>
                          ₹
                          {Number(product.price).toFixed(2)}
                        </td>


                        {/* STOCK */}

                        <td>
                          {product.stock}
                        </td>


                        {/* ACTIONS */}

                        <td>

                          {/* EDIT BUTTON */}

                          <button
                            type="button"
                            className="btn btn-sm btn-outline-primary me-2"
                            onClick={() =>
                              openEditModal(product)
                            }
                          >
                            Edit
                          </button>


                          {/* DELETE BUTTON */}

                          <button
                            type="button"
                            className="btn btn-sm btn-outline-danger"
                            onClick={() =>
                              openDeleteModal(product)
                            }
                          >
                            Delete
                          </button>

                        </td>

                      </tr>

                    ))

                  )}

                </tbody>

              </table>

            </div>
          )}

        </div>
      </main>


      {/* ==================================================
          ADD / EDIT PRODUCT MODAL
          ================================================== */}

      {showProductModal && (
        <>

          <div
            className="modal fade show admin-product-modal"
            tabIndex="-1"
            role="dialog"
            aria-modal="true"
          >

            <div className="modal-dialog modal-lg modal-dialog-centered">

              <div className="modal-content">

                {/* ==============================
                    MODAL HEADER
                    ============================== */}

                <div className="modal-header">

                  <h5 className="modal-title product-modal-title">

                    {editingProduct
                      ? "Edit Product"
                      : "Add Product"}

                  </h5>

                  <button
                    type="button"
                    className="btn-close"
                    onClick={closeProductModal}
                    disabled={submitting}
                    aria-label="Close"
                  ></button>

                </div>


                {/* ==============================
                    PRODUCT FORM
                    ============================== */}

                <form
                  onSubmit={handleSubmit(handleProductSubmit)}
                >

                  {/* MODAL BODY */}

                  <div className="modal-body">

                    {/* PRODUCT NAME */}

                    <div className="mb-3">

                      <label className="form-label">
                        Product Name
                      </label>

                      <input
                        type="text"
                        className="form-control"
                        {...register("productName")}
                      />

                      {errors.productName && (
                        <div className="text-danger">
                          {errors.productName.message}
                        </div>
                      )}

                    </div>


                    {/* DESCRIPTION */}

                    <div className="mb-3">

                      <label className="form-label">
                        Description
                      </label>

                      <textarea
                        className="form-control"
                        rows="4"
                        {...register("description")}
                      ></textarea>

                      {errors.description && (
                        <div className="text-danger">
                          {errors.description.message}
                        </div>
                      )}

                    </div>


                    {/* PRICE */}

                    <div className="mb-3">

                      <label className="form-label">
                        Price
                      </label>

                      <input
                        type="number"
                        className="form-control"
                        step="0.01"
                        {...register("price")}
                      />

                      {errors.price && (
                        <div className="text-danger">
                          {errors.price.message}
                        </div>
                      )}

                    </div>


                    {/* STOCK */}

                    <div className="mb-3">

                      <label className="form-label">
                        Stock
                      </label>

                      <input
                        type="number"
                        className="form-control"
                        {...register("stock")}
                      />

                      {errors.stock && (
                        <div className="text-danger">
                          {errors.stock.message}
                        </div>
                      )}

                    </div>


                    {/* CATEGORY */}

                    <div className="mb-3">

                      <label className="form-label">
                        Category
                      </label>

                      <select
                        className="form-select"
                        {...register("categoryId")}
                      >

                        <option value="">
                          Select Category
                        </option>

                        {categoryLoading ? (

                          <option disabled>
                            Loading categories...
                          </option>

                        ) : (

                          categories.map((category) => (

                            <option
                              key={category.categoryId}
                              value={category.categoryId}
                            >
                              {category.categoryName}
                            </option>

                          ))

                        )}

                      </select>

                      {errors.categoryId && (
                        <div className="text-danger">
                          {errors.categoryId.message}
                        </div>
                      )}

                    </div>


                    {/* CATEGORY ERROR */}

                    {categoryError && (
                      <div className="alert alert-danger">
                        {categoryError}
                      </div>
                    )}


                    {/* PRODUCT IMAGE */}

                    <div className="mb-3">

                      <label className="form-label">
                        Product Image
                      </label>

                      <input
                        type="file"
                        className="form-control"
                        accept="image/*"
                        onChange={handleImageChange}
                      />

                      <small className="text-muted">
                        Image is optional.
                      </small>

                    </div>


                    {/* IMAGE PREVIEW */}

                    {imagePreview && (

                      <div className="product-image-preview mb-3">

                        <p className="mb-2">
                          Image Preview
                        </p>

                        <img
                          src={imagePreview}
                          alt="Product Preview"
                        />

                      </div>

                    )}


                    {/* SUBMIT ERROR */}

                    {submitError && (
                      <div className="alert alert-danger">
                        {submitError}
                      </div>
                    )}

                  </div>


                  {/* ==============================
                      MODAL FOOTER
                      ============================== */}

                  <div className="modal-footer">

                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={closeProductModal}
                      disabled={submitting}
                    >
                      Cancel
                    </button>

                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={submitting}
                    >

                      {submitting ? (

                        <>
                          <span
                            className="spinner-border spinner-border-sm me-2"
                            role="status"
                            aria-hidden="true"
                          ></span>

                          Saving...
                        </>

                      ) : (

                        editingProduct
                          ? "Update Product"
                          : "Add Product"

                      )}

                    </button>

                  </div>

                </form>

              </div>

            </div>

          </div>


          {/* MODAL BACKDROP */}

          <div className="modal-backdrop fade show"></div>

        </>
      )}


      {/* ==================================================
          DELETE CONFIRMATION MODAL
          ================================================== */}

      {deletingProduct && (
        <>

          <div
            className="modal fade show d-block"
            tabIndex="-1"
            role="dialog"
            aria-modal="true"
          >

            <div className="modal-dialog modal-dialog-centered">

              <div className="modal-content">

                {/* ==============================
                    DELETE MODAL HEADER
                    ============================== */}

                <div className="modal-header">

                  <h5 className="modal-title">
                    Delete Product
                  </h5>

                  <button
                    type="button"
                    className="btn-close"
                    onClick={closeDeleteModal}
                    disabled={deleting}
                    aria-label="Close"
                  ></button>

                </div>


                {/* ==============================
                    DELETE MODAL BODY
                    ============================== */}

                <div className="modal-body text-center">

                  <div className="delete-product-icon">
                    <span>!</span>
                  </div>

                  <h5 className="mt-3">
                    Are you sure?
                  </h5>

                  <p className="text-muted">

                    You are about to delete the product{" "}

                    <strong>
                      {deletingProduct.productName}
                    </strong>

                    .

                  </p>

                  <p className="text-danger mb-0">
                    This action cannot be undone.
                  </p>


                  {/* DELETE ERROR */}

                  {error && (
                    <div className="alert alert-danger mt-3">
                      {error}
                    </div>
                  )}

                </div>


                {/* ==============================
                    DELETE MODAL FOOTER
                    ============================== */}

                <div className="modal-footer justify-content-center">

                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={closeDeleteModal}
                    disabled={deleting}
                  >
                    Cancel
                  </button>


                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={handleDeleteProduct}
                    disabled={deleting}
                  >

                    {deleting ? (

                      <>
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
                          aria-hidden="true"
                        ></span>

                        Deleting...
                      </>

                    ) : (

                      "Yes, Delete"

                    )}

                  </button>

                </div>

              </div>

            </div>

          </div>


          {/* DELETE MODAL BACKDROP */}

          <div className="modal-backdrop fade show"></div>

        </>
      )}

    </>
  );
};

export default AdminProducts;