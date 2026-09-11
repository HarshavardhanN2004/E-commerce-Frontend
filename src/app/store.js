import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/slices/authSlice";
import productReducer from "../features/slices/productSlice";
import cartReducer from "../features/slices/cartSlice";
import orderReducer from "../features/slices/orderSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    products: productReducer,
    cart: cartReducer,
    order: orderReducer,
  },
});

export default store;