import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { wishlistService } from "../../services/WhishlistService";

// --- Async Thunks ---

// Get Wishlist
export const getWishlist = createAsyncThunk(
  "wishlist/getWishlist",
  async (_, thunkAPI) => {
    try {
      return await wishlistService.getWishlist();
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message || error.toString());
    }
  }
);

// Add to Wishlist
export const addToWishlist = createAsyncThunk(
  "wishlist/addToWishlist",
  async (productId, thunkAPI) => {
    try {
      return await wishlistService.addToWishlist(productId);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message || error.toString());
    }
  }
);

// Remove from Wishlist
export const removeFromWishlist = createAsyncThunk(
  "wishlist/removeFromWishlist",
  async (productId, thunkAPI) => {
    try {
      return await wishlistService.removeFromWishlist(productId);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message || error.toString());
    }
  }
);

// Move to Cart
export const moveToCart = createAsyncThunk(
  "wishlist/moveToCart",
  async (productIds, thunkAPI) => {
    try {
      return await wishlistService.moveToCart(productIds);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message || error.toString());
    }
  }
);

// --- Initial State ---
const initialState = {
  products: [], // will hold wishlist products
  loading: false,
  error: null,
};

// --- Slice ---
const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setWishlist: (state, action) => {
      state.products = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get Wishlist
      .addCase(getWishlist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getWishlist.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.wishlist?.products || [];
      })
      .addCase(getWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Add to Wishlist
      .addCase(addToWishlist.fulfilled, (state, action) => {
        state.products = action.payload.wishlist?.products || state.products;
      })
      .addCase(addToWishlist.rejected, (state, action) => {
        state.error = action.payload;
      })

      // Remove from Wishlist
      .addCase(removeFromWishlist.fulfilled, (state, action) => {
        state.products = action.payload.wishlist?.products || state.products;
      })
      .addCase(removeFromWishlist.rejected, (state, action) => {
        state.error = action.payload;
      })

      // Move to Cart
      .addCase(moveToCart.fulfilled, (state, action) => {
        const movedIds = action.payload.productIds || [];
        state.products = state.products.filter(
          (item) => !movedIds.includes(item._id)
        );
      })
      .addCase(moveToCart.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { clearError, setWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;
