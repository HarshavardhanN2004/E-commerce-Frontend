import api from "./api";

export const loginUser = async (loginData) => {
  const response = await api.post("/Auth/login", loginData);

  return response.data;
};

export const getProfile = async () => {
  const response = await api.get("/Auth/profile");

  return response.data;
};

export const updateProfile = async (profileData) => {
  const response = await api.put("/Auth/profile", profileData);

  return response.data;
};