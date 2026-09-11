import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import "../styles/AdminCategories.css";

const API_URL = process.env.REACT_APP_API_URL;

// Validation schema
const categorySchema = yup.object({
  categoryName: yup
    .string()
    .trim()
    .required("Category name is required.")
    .matches(
      /^[A-Za-z ]+$/,
      "Category name can contain only letters and spaces.",
    )
    .max(100, "Category name cannot exceed 100 characters."),
});

function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showCategoryModal, setShowCategoryModal] = useState(false);

  // Stores the category currently being edited
  const [editingCategory, setEditingCategory] = useState(null);

  // Stores the category selected for deletion
  const [deletingCategory, setDeletingCategory] = useState(null);

  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const token = localStorage.getItem("token");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(categorySchema),
    defaultValues: {
      categoryName: "",
    },
  });

  // Get all categories
  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError("");

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
      setError("Unable to load categories.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Open modal for adding category
  const openAddModal = () => {
    setEditingCategory(null);

    reset({
      categoryName: "",
    });

    setError("");
    setShowCategoryModal(true);
  };

  // Open modal for editing category
  const openEditModal = (category) => {
    setEditingCategory(category);

    reset({
      categoryName: category.categoryName,
    });

    setError("");
    setShowCategoryModal(true);
  };

  // Close add/edit modal
  const closeCategoryModal = () => {
    setEditingCategory(null);

    reset({
      categoryName: "",
    });

    setError("");
    setShowCategoryModal(false);
  };

  // Open delete confirmation modal
  const openDeleteModal = (category) => {
    setDeletingCategory(category);
    setError("");
  };

  // Close delete confirmation modal
  const closeDeleteModal = () => {
    setDeletingCategory(null);
    setError("");
  };

  // Add category
  const handleAddCategory = async (data) => {
    try {
      setSubmitting(true);
      setError("");

      const response = await fetch(`${API_URL}/Categories`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          categoryName: data.categoryName.trim(),
        }),
      });

      const responseText = await response.text();

      if (!response.ok) {
        throw new Error(responseText || "Failed to add category.");
      }

      const newCategory = JSON.parse(responseText);

      setCategories((previousCategories) => [
        ...previousCategories,
        newCategory,
      ]);

      closeCategoryModal();
    } catch (error) {
      console.error("Error adding category:", error);
      setError(error.message || "Unable to add category.");
    } finally {
      setSubmitting(false);
    }
  };

  // Update category
  const handleUpdateCategory = async (data) => {
    try {
      setSubmitting(true);
      setError("");

      const response = await fetch(
        `${API_URL}/Categories/${editingCategory.categoryId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            categoryId: editingCategory.categoryId,
            categoryName: data.categoryName.trim(),
          }),
        },
      );

      const responseText = await response.text();

      if (!response.ok) {
        throw new Error(responseText || "Failed to update category.");
      }

      const updatedCategory = JSON.parse(responseText);

      setCategories((previousCategories) =>
        previousCategories.map((category) =>
          category.categoryId === updatedCategory.categoryId
            ? updatedCategory
            : category,
        ),
      );

      closeCategoryModal();
    } catch (error) {
      console.error("Error updating category:", error);
      setError(error.message || "Unable to update category.");
    } finally {
      setSubmitting(false);
    }
  };

  // Decide whether to add or update
  const handleCategorySubmit = (data) => {
    if (editingCategory) {
      handleUpdateCategory(data);
    } else {
      handleAddCategory(data);
    }
  };

  // Delete category
  const handleDeleteCategory = async () => {
    if (!deletingCategory) {
      return;
    }

    try {
      setDeleting(true);
      setError("");

      const response = await fetch(
        `${API_URL}/Categories/${deletingCategory.categoryId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const responseText = await response.text();

      if (!response.ok) {
        throw new Error(responseText || "Failed to delete category.");
      }

      // Remove deleted category from the table
      setCategories((previousCategories) =>
        previousCategories.filter(
          (category) => category.categoryId !== deletingCategory.categoryId,
        ),
      );

      closeDeleteModal();
    } catch (error) {
      console.error("Error deleting category:", error);
      setError(error.message || "Unable to delete category.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="admin-categories-page">
      <div className="container py-4">
        {/* Page Header */}
        <div className="categories-header">
          <div>
            <h2>Category Management</h2>
            <p>Manage your product categories</p>
          </div>

          <button
            type="button"
            className="btn btn-primary"
            onClick={openAddModal}
          >
            + Add Category
          </button>
        </div>

        {/* Error Message */}
        {error && !showCategoryModal && !deletingCategory && (
          <div className="alert alert-danger">{error}</div>
        )}

        {/* Categories Table */}
        <div className="card categories-card">
          <div className="card-body">
            {loading ? (
              <div className="text-center py-4">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>

                <p className="mt-2">Loading categories...</p>
              </div>
            ) : categories.length === 0 ? (
              <div className="empty-categories">
                <h5>No categories found</h5>

                <p>Start by adding your first product category.</p>

                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={openAddModal}
                >
                  + Add Category
                </button>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover align-middle">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Category Name</th>
                      <th>Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {categories.map((category, index) => (
                      <tr key={category.categoryId}>
                        <td>{index + 1}</td>

                        <td>
                          <strong>{category.categoryName}</strong>
                        </td>

                        <td>
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-secondary"
                            onClick={() => openEditModal(category)}
                          >
                            Edit
                          </button>

                          <button
                            type="button"
                            className="btn btn-sm btn-outline-danger ms-2"
                            onClick={() => openDeleteModal(category)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add / Edit Category Modal */}
      {showCategoryModal && (
        <>
          <div
            className="modal fade show d-block"
            tabIndex="-1"
            role="dialog"
            aria-modal="true"
          >
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                {/* Modal Header */}
                <div className="modal-header">
                  <h5 className="modal-title">
                    {editingCategory ? "Edit Category" : "Add Category"}
                  </h5>

                  <button
                    type="button"
                    className="btn-close"
                    onClick={closeCategoryModal}
                    aria-label="Close"
                  ></button>
                </div>

                {/* Modal Form */}
                <form onSubmit={handleSubmit(handleCategorySubmit)}>
                  <div className="modal-body">
                    {error && <div className="alert alert-danger">{error}</div>}

                    <div className="mb-3">
                      <label htmlFor="categoryName" className="form-label">
                        Category Name
                      </label>

                      <input
                        type="text"
                        id="categoryName"
                        className={`form-control ${
                          errors.categoryName ? "is-invalid" : ""
                        }`}
                        placeholder="Enter category name"
                        {...register("categoryName")}
                      />

                      {errors.categoryName && (
                        <div className="invalid-feedback">
                          {errors.categoryName.message}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Modal Footer */}
                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={closeCategoryModal}
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
                          ></span>

                          {editingCategory ? "Updating..." : "Saving..."}
                        </>
                      ) : editingCategory ? (
                        "Update Category"
                      ) : (
                        "Add Category"
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>

          {/* Modal Backdrop */}
          <div className="modal-backdrop fade show"></div>
        </>
      )}

      {/* Delete Confirmation Modal */}
      {deletingCategory && (
        <>
          <div
            className="modal fade show d-block"
            tabIndex="-1"
            role="dialog"
            aria-modal="true"
          >
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                {/* Modal Header */}
                <div className="modal-header">
                  <h5 className="modal-title">Delete Category</h5>

                  <button
                    type="button"
                    className="btn-close"
                    onClick={closeDeleteModal}
                    disabled={deleting}
                    aria-label="Close"
                  ></button>
                </div>

                {/* Modal Body */}
                <div className="modal-body text-center">
                  <div className="delete-icon">
                    <span>!</span>
                  </div>

                  <h5 className="mt-3">Are you sure?</h5>

                  <p className="text-muted">
                    You are about to delete the category{" "}
                    <strong>{deletingCategory.categoryName}</strong>.
                  </p>

                  <p className="text-danger mb-0">
                    This action cannot be undone.
                  </p>

                  {error && (
                    <div className="alert alert-danger mt-3">{error}</div>
                  )}
                </div>

                {/* Modal Footer */}
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
                    onClick={handleDeleteCategory}
                    disabled={deleting}
                  >
                    {deleting ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
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

          {/* Modal Backdrop */}
          <div className="modal-backdrop fade show"></div>
        </>
      )}
    </div>
  );
}

export default AdminCategories;
