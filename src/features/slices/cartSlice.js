import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {getCart,addToCart,updateCartItem,removeCartItem, clearCart,} from "../../services/cartService";

const getErrorMessage = (error, defaultMessage) => {
  const data = error.response?.data;

  if (typeof data === "string") {
    return data;
  }

  if (data?.errors) {
    const firstError = Object.values(data.errors)[0];

    if (Array.isArray(firstError)) {
      return firstError[0];
    }
    return firstError;
  }

  if (data?.title) {
    return data.title;
  }

  if (data?.detail) {
    return data.detail;
  }
  return defaultMessage;
};

const initialState = {
  cart: null,
  loading: false,
  error: null,
};

export const fetchCart = createAsyncThunk(
  "cart/fetchCart",
  async (_, { rejectWithValue }) => {
    try {
      const data = await getCart();
      return data;
    } catch (error) {
  return rejectWithValue( getErrorMessage(error,"Failed to load cart"));
  }
  }
);

export const addProductToCart = createAsyncThunk(
  "cart/addProductToCart",
  async (cartData, { rejectWithValue }) => {
    try {
      const data = await addToCart(cartData);
      return data;
    } catch (error) {
  return rejectWithValue(getErrorMessage(error,"Failed to add product to cart"));
  }
  }
);

export const updateProductQuantity = createAsyncThunk(
  "cart/updateProductQuantity",
  async ({ cartItemId, cartData }, { rejectWithValue }) => {
    try {
      const data = await updateCartItem(cartItemId, cartData);
      return data;
  } catch (error) {
  return rejectWithValue(
    getErrorMessage(error,"Failed to update cart item"));
  }
 }
);

export const deleteCartItem = createAsyncThunk(
  "cart/deleteCartItem",
  async (cartItemId, { rejectWithValue }) => {
    try {
      await removeCartItem(cartItemId);
      return cartItemId;
    }  catch (error) {
  return rejectWithValue(getErrorMessage(error,"Failed to remove cart item"));
  }
  }
);

export const removeAllCartItems = createAsyncThunk(
  "cart/removeAllCartItems",
  async (_, { rejectWithValue }) => {
    try {
      await clearCart();
      return true;
    } catch (error) {
  return rejectWithValue(getErrorMessage(error,"Failed to clear cart"));
  }
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {},

  extraReducers: (builder) => {
    builder

      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.cart = action.payload;
      })

      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(addProductToCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(addProductToCart.fulfilled, (state, action) => {
        state.loading = false;
        state.cart = action.payload;
      })

      .addCase(addProductToCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(updateProductQuantity.fulfilled, (state, action) => {
        state.cart = action.payload;
      })

      .addCase(updateProductQuantity.rejected, (state, action) => {
        state.error = action.payload;
      })

      .addCase(deleteCartItem.fulfilled, (state, action) => {
        if (state.cart?.cartItems) {
          state.cart.cartItems = state.cart.cartItems.filter(
            (item) => item.cartItemId !== action.payload
          );
        }
      })

      .addCase(deleteCartItem.rejected, (state, action) => {
        state.error = action.payload;
      })

      .addCase(removeAllCartItems.fulfilled, (state) => {
        state.cart = null;
      })

      .addCase(removeAllCartItems.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export default cartSlice.reducer;