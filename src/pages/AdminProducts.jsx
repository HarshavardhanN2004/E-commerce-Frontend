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
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [categoryLoading, setCategoryLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");
  const [categoryError, setCategoryError] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [deletingProduct, setDeletingProduct] = useState(null);
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

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

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

  const handleImageChange = (event) => {
    const file = event.target.files[0];

    if (!file) {
      setSelectedImage(null);
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
        }

        throw new Error(errorMessage);
      }

      const newProduct = await response.json();
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
        }

        throw new Error(errorMessage);
      }

      const updatedProduct = await response.json();
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

  const handleProductSubmit = (data) => {
    if (editingProduct) {
      handleUpdateProduct(data);
    } else {
      handleAddProduct(data);
    }
  };

  const openDeleteModal = (product) => {
    setDeletingProduct(product);
    setError("");
  };

  const closeDeleteModal = () => {
    setDeletingProduct(null);
    setError("");
  };

  const handleDeleteProduct = async () => {
    if (!deletingProduct) {
      return;
    }

    try {
      setDeleting(true);
      setError("");
      await dispatch(
        removeProduct(deletingProduct.productId)
      ).unwrap();
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


  const getImageUrl = (imagePath) => {
    if (!imagePath) {
      return "";
    }

    return `${API_URL.replace("/api", "")}${imagePath}`;
  };

  return (
    <>
      <Navbar />

      <main className="admin-products-page">
        <div className="container">
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
          {error && !deletingProduct && (
            <div className="alert alert-danger">
              {error}
            </div>
          )}

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
                      <td colSpan="7" className="text-center"> No products found. </td>
                    </tr>
                  ) : (
                    products.map((product) => (
                      <tr key={product.productId}>
                        <td> {product.productId}</td>

                        <td>
                          {product.imagePath ? (
                            <img
                              src={getImageUrl(product.imagePath)}
                              alt={product.productName}
                              className="admin-product-image"
                            />
                          ) : (
                            <span>  No image</span>
                          )}

                        </td>
                        <td> {product.productName} </td>
                        <td> {product.categoryName}</td>
                        <td> ₹ {Number(product.price).toFixed(2)} </td>
                        <td> {product.stock}</td>
                        <td>
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-primary me-2"
                            onClick={() =>
                              openEditModal(product)
                            }
                          >
                            Edit
                          </button>
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
                <form
                  onSubmit={handleSubmit(handleProductSubmit)}
                >
                  <div className="modal-body">
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
                    <div className="mb-3">
                      <label className="form-label"> Description  </label>
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
                    <div className="mb-3">
                      <label className="form-label"> Price </label>

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
                    <div className="mb-3">
                      <label className="form-label"> Stock</label>
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
                    {categoryError && (
                      <div className="alert alert-danger">
                        {categoryError}
                      </div>
                    )}
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
                    {submitError && (
                      <div className="alert alert-danger">
                        {submitError}
                      </div>
                    )}

                  </div>
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
          <div className="modal-backdrop fade show"></div>

        </>
      )}

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
                <div className="modal-header">
                  <h5 className="modal-title">  Delete Product </h5>

                  <button
                    type="button"
                    className="btn-close"
                    onClick={closeDeleteModal}
                    disabled={deleting}
                    aria-label="Close"
                  ></button>

                </div>
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

                  {error && (
                    <div className="alert alert-danger mt-3">
                      {error}
                    </div>
                  )}

                </div>
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
          <div className="modal-backdrop fade show"></div>
        </>
      )}

    </>
  );
};

export default AdminProducts;