import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  token: localStorage.getItem("token") || null,
  userId: localStorage.getItem("userId") || null,
  name: localStorage.getItem("name") || null,
  email: localStorage.getItem("email") || null,
  role: localStorage.getItem("role") || null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      const { token, userId, name, email, role } = action.payload;

      state.token = token;
      state.userId = userId;
      state.name = name;
      state.email = email;
      state.role = role;

      localStorage.setItem("token", token);
      localStorage.setItem("userId", userId);
      localStorage.setItem("name", name);
      localStorage.setItem("email", email);
      localStorage.setItem("role", role);
    },

    logout: (state) => {
      state.token = null;
      state.userId = null;
      state.name = null;
      state.email = null;
      state.role = null;

      localStorage.clear();
    },
  },
});

export const { loginSuccess, logout } = authSlice.actions;

export default authSlice.reducer;