import api from "./api";

export const getProducts = async () => {
  const response = await api.get("/Products");

  return response.data;
};

export const getProductById = async (productId) => {
  const response = await api.get(`/Products/${productId}`);

  return response.data;
};

export const addProduct = async (productData) => {
  const response = await api.post("/Products", productData);

  return response.data;
};

export const updateProduct = async (productId, productData) => {
  const response = await api.put(
    `/Products/${productId}`,
    productData
  );

  return response.data;
};

export const deleteProduct = async (productId) => {
  const response = await api.delete(
    `/Products/${productId}`
  );

  return response.data;
};