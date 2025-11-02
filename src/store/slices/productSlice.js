import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { productService } from "../../services/productServices";

// Fetch all products
export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async (params = {}, thunkAPI) => {
    try {
      console.log("Fetching all products with params:", params);
      const data = await productService.getProducts(params);
      console.log("DEBUG products response:", data);
      return data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Fetch products by category
export const fetchProductsByCategory = createAsyncThunk(
  "products/fetchProductsByCategory",
  async ({ category, params = {} }, thunkAPI) => {
    try {
      if (!category) throw new Error("Category is required");
      console.log("Fetching products by category:", category, params);
      const data = await productService.getProductsByCategory(category, params);
      return data;
      console.log("Thunk → API Response:", data); // 👈 log backend response
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Fetch single product
export const fetchProductById = createAsyncThunk(
  "products/fetchProductById",
  async (id, thunkAPI) => {
    try {
      const data = await productService.getProductById(id);
      return data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Initial state
const initialState = {
  products: [],
  product: null,
  categories: [],
  filters: {
    category: "",
    brand: [],
    minPrice: "",
    maxPrice: "",
    search: "",
    sortBy: "createdAt",
  },
  pagination: {
    currentPage: 1,
    totalPages: 1,
    total: 0,
  },
  loading: false,
  error: null,
};

const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
      state.pagination.currentPage = 1;
    },
    clearFilters: (state) => {
      state.filters = { ...initialState.filters, brand: [] };
      state.pagination.currentPage = 1;
    },
    setCurrentPage: (state, action) => {
      state.pagination.currentPage = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetch all products
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload?.success) {
          state.products = action.payload.products || [];
          state.pagination = {
            currentPage: action.payload.pagination?.currentPage || 1,
            totalPages: action.payload.pagination?.totalPages || 1,
            totalProducts: action.payload.pagination?.totalProducts || 0, // ✅ keep same key as backend
          };
          
        } else {
          state.products = [];
          state.pagination = initialState.pagination;
          state.error = action.payload?.error || "Failed to fetch products";
        }
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.products = [];
        state.error = action.payload || "Failed to fetch products";
      })

      // fetch products by category
      .addCase(fetchProductsByCategory.pending, (state) => {
       
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductsByCategory.fulfilled, (state, action) => {
        console.log("Slice → Action Payload:", action.payload); // 👈 log payload from thunk
        state.loading = false;
        if (action.payload?.success) {
          state.products = action.payload.products || [];
          state.pagination = {
            currentPage: action.payload.pagination?.currentPage || 1,
            totalPages: action.payload.pagination?.totalPages || 1,
            total: action.payload.pagination?.totalProducts || 0,
          };
          console.log("Slice → Products in state:", state.products);
        } else {
          state.products = [];
          state.pagination = initialState.pagination;
          state.error = "Failed to fetch products by category";
        }
      })
      .addCase(fetchProductsByCategory.rejected, (state, action) => {
        state.loading = false;
        state.products = [];
        state.error = action.payload || "Failed to fetch products by category";
      })

      // fetch single product
      .addCase(fetchProductById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload?.success) {
          state.product = action.payload.data || null;
        } else {
          state.product = null;
          state.error = action.payload?.error || "Product not found";
        }
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.loading = false;
        state.product = null;
        state.error = action.payload || "Failed to fetch product";
      });
  },
});

export const { setFilters, clearFilters, setCurrentPage } = productSlice.actions;
export default productSlice.reducer;
