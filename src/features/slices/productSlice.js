import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getProducts, addProduct, updateProduct, deleteProduct,} from "../../services/productService";

const initialState = {
  products: [],
  loading: false,
  error: null,
};

export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async (_, { rejectWithValue }) => {
    try {
      const data = await getProducts();
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
        error.response?.data ||
        "Failed to fetch products"
      );
    }
  }
);

export const createProduct = createAsyncThunk(
  "products/createProduct",
  async (productData, { rejectWithValue }) => {
    try {
      const data = await addProduct(productData);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
        error.response?.data ||
        "Failed to add product"
      );
    }
  }
);

export const editProduct = createAsyncThunk(
  "products/editProduct",
  async ({ productId, productData }, { rejectWithValue }) => {
    try {
      const data = await updateProduct(productId, productData);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
        error.response?.data ||
        "Failed to update product"
      );
    }
  }
);

export const removeProduct = createAsyncThunk(
  "products/removeProduct",
  async (productId, { rejectWithValue }) => {
    try {
      await deleteProduct(productId);
      return productId;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
        error.response?.data ||
        "Failed to delete product"
      );
    }
  }
);

const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {},

  extraReducers: (builder) => {
    builder

      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })

      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(createProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(createProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.products.push(action.payload);
      })

      .addCase(createProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(editProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(editProduct.fulfilled, (state, action) => {
        state.loading = false;

        const index = state.products.findIndex(
          (product) => product.productId === action.payload.productId
        );

        if (index !== -1) {
          state.products[index] = action.payload;
        }
      })

      .addCase(editProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(removeProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(removeProduct.fulfilled, (state, action) => {
        state.loading = false;

        state.products = state.products.filter(
          (product) => product.productId !== action.payload
        );
      })

      .addCase(removeProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default productSlice.reducer;