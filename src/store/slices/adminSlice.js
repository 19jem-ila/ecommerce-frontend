import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { productService } from "../../services/productServices";
import { adminService } from "../../services/adminService";

// ================== ASYNC THUNKS ==================

// --- Products (Admin) ---
export const createProduct = createAsyncThunk(
  "admin/createProduct",
  async (productData, thunkAPI) => {
    try {
      return await productService.createProduct(productData);
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

export const updateProduct = createAsyncThunk(
  "admin/updateProduct",
  async ({ id, data }, thunkAPI) => {
    try {
      return await productService.updateProduct(id, data);
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

export const deleteProduct = createAsyncThunk(
  "admin/deleteProduct",
  async (id, thunkAPI) => {
    try {
      await productService.deleteProduct(id);
      return id; // return deleted product ID
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

// --- Admin Dashboard ---
export const getAdminStats = createAsyncThunk(
  "admin/getStats",
  async (_, thunkAPI) => {
    try {
      return await adminService.getStats();
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

export const getSalesTrends = createAsyncThunk(
  "admin/getSalesTrends",
  async (_, thunkAPI) => {
    try {
      return await adminService.getSalesTrends();
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

// ================== SLICE ==================
const adminSlice = createSlice({
  name: "admin",
  initialState: {
    products: [],
    stats: null,
    salesTrends: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearAdminError: (state) => {
      state.error = null;
    },
    resetAdminState: () => ({
      products: [],
      stats: null,
      salesTrends: [],
      loading: false,
      error: null,
    }),
  },
  extraReducers: (builder) => {
    // --- Product Cases ---
    builder
      .addCase(createProduct.pending, (state) => { state.loading = true; })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.products.push(action.payload);
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(updateProduct.fulfilled, (state, action) => {
        const index = state.products.findIndex((p) => p._id === action.payload._id);
        if (index !== -1) state.products[index] = action.payload;
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.error = action.payload;
      })

      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.products = state.products.filter((p) => p._id !== action.payload);
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.error = action.payload;
      });

    // --- Admin Stats Cases ---
    builder
      .addCase(getAdminStats.pending, (state) => { state.loading = true; })
      .addCase(getAdminStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload;
      })
      .addCase(getAdminStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // --- Sales Trends Cases ---
    builder
      .addCase(getSalesTrends.pending, (state) => { state.loading = true; })
      .addCase(getSalesTrends.fulfilled, (state, action) => {
        state.loading = false;
        state.salesTrends = action.payload;
      })
      .addCase(getSalesTrends.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearAdminError, resetAdminState } = adminSlice.actions;
export default adminSlice.reducer;
