import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Navbar from "../components/Navbar";
import "../styles/AdminCategories.css";
import Swal from "sweetalert2";
import fetchApi from "../services/fetchApi";

const categorySchema = yup.object({
  categoryName: yup
    .string()
    .trim()
    .required("Category name is required.")
    .matches( /^[A-Za-z ]+$/,"Category name can contain only letters and spaces.")
    .max(100, "Category name cannot exceed 100 characters."),

  description: yup
    .string()
    .trim()
    .required("Description is required.")
    .max(500, "Description cannot exceed 500 characters."),
});

function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [deletingCategory, setDeletingCategory] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const categoriesPerPage = 5;
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
      description: "",
    },
  });

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError("");
     const response = await fetchApi("/Categories", {
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

  const openAddModal = () => {
    setEditingCategory(null);
    reset({
      categoryName: "",
      description: "",
    });
    setError("");
    setShowCategoryModal(true);
  };

  const openEditModal = (category) => {
    setEditingCategory(category);
    reset({
      categoryName: category.categoryName,
      description: category.description || "",
    });
    setError("");
    setShowCategoryModal(true);
  };

  const closeCategoryModal = () => {
    setEditingCategory(null);
    reset({
      categoryName: "",
      description: "",
    });
    setError("");
    setShowCategoryModal(false);
  };

  const openDeleteModal = (category) => {
    setDeletingCategory(category);
    setError("");
  };

  const closeDeleteModal = () => {
    setDeletingCategory(null);
    setError("");
  };

  const handleAddCategory = async (data) => {
    try {
      setSubmitting(true);
      setError("");
     const response = await fetchApi("/Categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          categoryName: data.categoryName.trim(),
          description: data.description.trim(),
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
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: "Category added successfully",
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
        customClass: {
          container: "admin-swal-container",
        },
      });
    } catch (error) {
      console.error("Error adding category:", error);
      setError(error.message || "Unable to add category.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateCategory = async (data) => {
    try {
      setSubmitting(true);
      setError("");

     const response = await fetchApi(`/Categories/${editingCategory.categoryId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            categoryId: editingCategory.categoryId,
            categoryName: data.categoryName.trim(),
            description: data.description.trim(),
          }),
        }
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
            : category
        )
      );

      closeCategoryModal();

      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: "Category updated successfully",
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
        customClass: {
          container: "admin-swal-container",
        },
      });
    } catch (error) {
      console.error("Error updating category:", error);
      setError(error.message || "Unable to update category.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCategorySubmit = (data) => {
    if (editingCategory) {
      handleUpdateCategory(data);
    } else {
      handleAddCategory(data);
    }
  };

  const handleDeleteCategory = async () => {
    if (!deletingCategory) {
      return;
    }
    try {
      setDeleting(true);
      setError("");
    const response = await fetchApi(`/Categories/${deletingCategory.categoryId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}`,
          },
        }
      );
      const responseText = await response.text();
      if (!response.ok) {
        throw new Error(responseText || "Failed to delete category.");
      }

      setCategories((previousCategories) =>
        previousCategories.filter(
          (category) =>
            category.categoryId !== deletingCategory.categoryId
        )
      );
      setCurrentPage((page) => {
      const remainingCategories = categories.length - 1;
      const newTotalPages = Math.ceil(remainingCategories / categoriesPerPage);
      return Math.min(page, Math.max(newTotalPages, 1));
    });

      closeDeleteModal();

      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: "Category deleted successfully",
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
        customClass: {
          container: "admin-swal-container",
        },
      });
    } catch (error) {
      console.error("Error deleting category:", error);
      setError(error.message || "Unable to delete category.");
    } finally {
      setDeleting(false);
    }
  };

  const totalPages = Math.ceil(categories.length / categoriesPerPage);
  const startIndex = (currentPage - 1) * categoriesPerPage;
  const currentCategories = categories.slice(startIndex,startIndex + categoriesPerPage);
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <>
      <Navbar />
      <div className="admin-categories-page">
        <div className="container py-4">
          <div className="categories-header">
            <div>
              <h2>Category Management</h2>
              <p>Manage your product categories</p>
            </div>

            <button type="button" className="btn btn-primary" onClick={openAddModal}>
              <i className="bi bi-plus-circle me-1"></i>
              Add Category
            </button>
          </div>
          {error && !showCategoryModal && !deletingCategory && (
            <div className="alert alert-danger">
              {error}
            </div>
          )}

          <div className="card categories-card">
            <div className="card-body">
              {loading ? (
                <div className="text-center py-4">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">
                      Loading...
                    </span>
                  </div>
                  <p className="mt-2">
                    Loading categories...
                  </p>
                </div>

              ) : categories.length === 0 ? (
                <div className="empty-categories">
                  <h5>No categories found</h5>
                  <p> Start by adding your first product category. </p>
                  <button type="button" className="btn btn-primary" onClick={openAddModal} >
                    <i className="bi bi-plus-circle me-1"></i>
                    Add Category
                  </button>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover align-middle">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Category Name</th>
                        <th>Description</th>
                        <th>Action</th>
                      </tr>
                    </thead>

                    <tbody>
                      {currentCategories.map((category, index) => (
                        <tr key={category.categoryId}>
                          <td>{startIndex + index + 1}</td>
                          <td> <strong>{category.categoryName} </strong></td>
                          <td> {category.description}</td>
                          <td>
                            <button type="button" className="btn btn-sm btn-outline-secondary" onClick={() =>openEditModal(category)} >
                              <i className="bi bi-pencil-square me-1"></i>
                              Edit
                            </button>
                            <button type="button" className="btn btn-sm btn-outline-danger ms-2" onClick={() =>openDeleteModal(category)}>
                              <i className="bi bi-trash me-1"></i>
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {totalPages > 1 && (
                  <nav className="mt-3">
                    <ul className="pagination justify-content-center">
                      <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                        <button type="button" className="page-link" onClick={() => handlePageChange(currentPage - 1)}disabled={currentPage === 1}>
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
                        <button type="button" className="page-link" onClick={() => handlePageChange(currentPage + 1)}disabled={currentPage === totalPages}>
                          Next
                        </button>
                      </li>
                    </ul>
                  </nav>
                )}
                </div>
              )}
            </div>
          </div>
        </div>
        {showCategoryModal && (
          <>
            <div className="modal fade show d-block admin-category-modal-overlay" tabIndex="-1" role="dialog" aria-modal="true">
              <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">
                      {editingCategory ? "Edit Category": "Add Category"}
                    </h5>

                    <button type="button" className="btn-close" onClick={closeCategoryModal} disabled={submitting} aria-label="Close" ></button>
                  </div>
                  <form onSubmit={handleSubmit(handleCategorySubmit)}>
                    <div className="modal-body">
                      {error && (
                        <div className="alert alert-danger">
                          {error}
                        </div>
                      )}

                      <div className="mb-3">
                        <label htmlFor="categoryName" className="form-label"> Category Name</label>

                        <input type="text" id="categoryName" className={`form-control ${errors.categoryName ? "is-invalid" : ""}`}
                          placeholder="Enter category name"
                          {...register("categoryName")}
                        />
                        {errors.categoryName && (
                          <div className="invalid-feedback">
                            {errors.categoryName.message}
                          </div>
                        )}

                      </div>
                      <div className="mb-3">
                        <label htmlFor="description" className="form-label"> Description</label>
                        <textarea id="description" className={`form-control ${errors.description ? "is-invalid": "" }`}
                          rows="4" placeholder="Enter category description" {...register("description")}
                        ></textarea>
                        {errors.description && (
                          <div className="invalid-feedback">
                            {errors.description.message}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="modal-footer">
                      <button type="button" className="btn btn-secondary" onClick={closeCategoryModal} disabled={submitting}>
                        Cancel
                      </button>
                      <button type="submit" className="btn btn-primary" disabled={submitting}>
                        {submitting ? (
                          <>
                            <span  className="spinner-border spinner-border-sm me-2" role="status"></span>
                            {editingCategory ? "Updating..." : "Saving..."}
                          </>
                        ) : editingCategory ? (
                          <>
                            <i className="bi bi-check-circle me-1"></i>
                            Update Category
                          </>
                        ) : (
                          <>
                            <i className="bi bi-plus-circle me-1"></i>
                            Add Category
                          </>
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
        {deletingCategory && (
          <>
            <div className="modal fade show d-block admin-delete-category-modal-overlay" tabIndex="-1" role="dialog" aria-modal="true">
              <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title"> Delete Category </h5>
                    <button type="button" className="btn-close" onClick={closeDeleteModal} disabled={deleting} aria-label="Close"></button>
                  </div>

                  <div className="modal-body text-center">
                    <div className="delete-icon">
                      <span>!</span>
                    </div>
                    <h5 className="mt-3"> Are you sure? </h5>
                    <p className="text-muted">
                      You are about to delete the category{" "}
                      <strong>{deletingCategory.categoryName}</strong>
                      .
                    </p>
                    {error && (
                      <div className="alert alert-danger mt-3">
                        {error}
                      </div>
                    )}

                  </div>

                  <div className="modal-footer justify-content-center">
                    <button type="button" className="btn btn-secondary" onClick={closeDeleteModal} disabled={deleting}> Cancel</button>
                    <button type="button" className="btn btn-danger" onClick={handleDeleteCategory} disabled={deleting}>
                      {deleting ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                          Deleting...
                        </>
                      ) : (
                        <>
                          <i className="bi bi-trash me-1"></i>
                          Yes, Delete
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-backdrop fade show"></div>
          </>
        )}
      </div>
    </>
  );
}

export default AdminCategories;