import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;

export const placeOrder = createAsyncThunk(
  "order/placeOrder",
  async (orderData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(`${API_URL}/Orders`, orderData,
        {headers: {Authorization: `Bearer ${token}`,},}
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to place order."
      );
    }
  }
);

export const fetchOrderById = createAsyncThunk(
  "order/fetchOrderById",
  async (orderId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API_URL}/Orders/${orderId}`,
        {headers: {Authorization: `Bearer ${token}`,}, }
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to fetch order."
      );
    }
  }
);

export const fetchMyOrders = createAsyncThunk(
  "order/fetchMyOrders",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API_URL}/Orders/my-orders`,
        {headers: {Authorization: `Bearer ${token}`,},}
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to fetch orders."
      );
    }
  }
);

const orderSlice = createSlice({
  name: "order",
  initialState: {
    order: null,
    orders: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearOrder: (state) => {
      state.order = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(placeOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(placeOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.order = action.payload;
      })

      .addCase(placeOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

        .addCase(fetchOrderById.pending, (state) => {
        state.loading = true;
        state.error = null;
        })

        .addCase(fetchOrderById.fulfilled, (state, action) => {
        state.loading = false;
        state.order = action.payload;
        })

        .addCase(fetchOrderById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        })

        .addCase(fetchMyOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
        })
        .addCase(fetchMyOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
        })
        .addCase(fetchMyOrders.rejected, (state, action) => {
         state.loading = false;
        state.error = action.payload;
        })
  },
});

export const { clearOrder } = orderSlice.actions;

export default orderSlice.reducer;