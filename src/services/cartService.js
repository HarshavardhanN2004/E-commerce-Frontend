import api from "./api";

export const getCart = async () => {
  const response = await api.get("/Cart");
  return response.data;
};

export const addToCart = async (cartData) => {
  const response = await api.post("/Cart/items", cartData);
  return response.data;
};

export const updateCartItem = async (cartItemId, quantity) => {
  const response = await api.put(`/Cart/items/${cartItemId}`,
    quantity,
    {
      headers: { "Content-Type": "application/json",},
    }
  );
  return response.data;
};

export const removeCartItem = async (cartItemId) => {
  const response = await api.delete(`/Cart/items/${cartItemId}`);
  return response.data;
};

export const clearCart = async () => {
  const response = await api.delete("/Cart");
  return response.data;
};