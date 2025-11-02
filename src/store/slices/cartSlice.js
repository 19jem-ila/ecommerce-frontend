
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { cartService } from "../../services/cartServices";

// --- Async Thunks ---

// Get user's cart
export const getCart = createAsyncThunk("cart/getCart", async (_, thunkAPI) => {
  try {
    return await cartService.getCart();
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message || error.toString());
  }
});

// Add item to cart
export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async ({ productId, quantity, variant }, thunkAPI) => {
    try {
      return await cartService.addToCart(productId, quantity, variant);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message || error.toString());
    }
  }
);

// Update item quantity
export const updateCartItem = createAsyncThunk(
  "cart/updateCartItem",
  async ({ productId, quantity, variant }, thunkAPI) => {
    try {
      return await cartService.updateCartItem(productId, quantity, variant);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message || error.toString());
    }
  }
);

// Remove item from cart
export const removeCartItem = createAsyncThunk(
  "cart/removeCartItem",
  async ({ productId, variant }, thunkAPI) => {
    try {
      return await cartService.removeCartItem(productId, variant);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message || error.toString());
    }
  }
);

// Clear entire cart
export const clearCart = createAsyncThunk("cart/clearCart", async (_, thunkAPI) => {
  try {
    return await cartService.clearCart();
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message || error.toString());
  }
});

// --- Initial State ---
const initialState = {
  items: JSON.parse(localStorage.getItem("cartItems")) || [],
  loading: false,
  error: null,
};

// --- Slice ---
const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    // Optional: manually clear error
    clearError: (state) => {
      state.error = null;
    },
    // Optional: manually set cart items
    setCartItems: (state, action) => {
      state.items = action.payload;
      localStorage.setItem("cartItems", JSON.stringify(state.items));
    },
    // Add a manual remove item reducer for immediate UI update
    removeItemLocally: (state, action) => {
      const { productId, variant } = action.payload;
      state.items = state.items.filter(item => 
        !(item.product._id === productId && 
          JSON.stringify(item.variant) === JSON.stringify(variant || {}))
      );
      localStorage.setItem("cartItems", JSON.stringify(state.items));
    },
  },
  extraReducers: (builder) => {
    builder
      // Get Cart
      .addCase(getCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCart.fulfilled, (state, action) => {
        state.loading = false;
        // Handle different API response structures
        if (Array.isArray(action.payload)) {
          state.items = action.payload;
        } else if (action.payload && Array.isArray(action.payload.items)) {
          state.items = action.payload.items;
        } else {
          state.items = [];
        }
        localStorage.setItem("cartItems", JSON.stringify(state.items));
      })
      .addCase(getCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Add to Cart
      .addCase(addToCart.fulfilled, (state, action) => {
        // Handle different API response structures
        if (Array.isArray(action.payload)) {
          state.items = action.payload;
        } else if (action.payload && Array.isArray(action.payload.items)) {
          state.items = action.payload.items;
        } else if (action.payload && action.payload.product) {
          // If it returns the added item, find and update or add it
          const existingItemIndex = state.items.findIndex(item => 
            item.product._id === action.payload.product._id && 
            JSON.stringify(item.variant) === JSON.stringify(action.payload.variant || {})
          );
          
          if (existingItemIndex >= 0) {
            state.items[existingItemIndex] = action.payload;
          } else {
            state.items.push(action.payload);
          }
        }
        localStorage.setItem("cartItems", JSON.stringify(state.items));
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.error = action.payload;
      })

      // Update Cart Item
      .addCase(updateCartItem.fulfilled, (state, action) => {
        // Handle different API response structures
        if (Array.isArray(action.payload)) {
          state.items = action.payload;
        } else if (action.payload && Array.isArray(action.payload.items)) {
          state.items = action.payload.items;
        } else if (action.payload && action.payload.product) {
          // Update specific item
          const index = state.items.findIndex(item => 
            item.product._id === action.payload.product._id && 
            JSON.stringify(item.variant) === JSON.stringify(action.payload.variant || {})
          );
          if (index >= 0) {
            state.items[index] = action.payload;
          }
        }
        localStorage.setItem("cartItems", JSON.stringify(state.items));
      })
      .addCase(updateCartItem.rejected, (state, action) => {
        state.error = action.payload;
      })

      // Remove Cart Item - FIXED VERSION
      .addCase(removeCartItem.pending, (state, action) => {
        // Optimistically remove the item from UI immediately
        const { productId, variant } = action.meta.arg;
        state.items = state.items.filter(item => 
          !(item.product._id === productId && 
            JSON.stringify(item.variant) === JSON.stringify(variant || {}))
        );
        localStorage.setItem("cartItems", JSON.stringify(state.items));
      })
      .addCase(removeCartItem.fulfilled, (state, action) => {
        // Server confirmed removal, update with final state
        if (Array.isArray(action.payload)) {
          state.items = action.payload;
        } else if (action.payload && Array.isArray(action.payload.items)) {
          state.items = action.payload.items;
        }
        localStorage.setItem("cartItems", JSON.stringify(state.items));
      })
      .addCase(removeCartItem.rejected, (state, action) => {
        state.error = action.payload;
        // If removal failed, reload the cart to get correct state
        state.items = JSON.parse(localStorage.getItem("cartItems")) || [];
      })

      // Clear Cart
      .addCase(clearCart.fulfilled, (state, action) => {
        state.items = [];
        localStorage.setItem("cartItems", JSON.stringify(state.items));
      })
      .addCase(clearCart.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { clearError, setCartItems, removeItemLocally } = cartSlice.actions;
export default cartSlice.reducer;