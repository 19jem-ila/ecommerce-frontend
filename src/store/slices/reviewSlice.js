import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { reviewService } from "../../services/reviewService";

// ---------------- Thunks ----------------

// Get all reviews for a product
export const getProductReviews = createAsyncThunk(
  "reviews/getProductReviews",
  async (productId, thunkAPI) => {
    try {
      return await reviewService.getProductReviews(productId);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// Get current user's review for a product
export const getUserReview = createAsyncThunk(
  "reviews/getUserReview",
  async (productId, thunkAPI) => {
    try {
      return await reviewService.getUserReview(productId);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// Add or update a review
export const addOrUpdateReview = createAsyncThunk(
  "reviews/addOrUpdateReview",
  async (reviewData, thunkAPI) => {
    try {
      return await reviewService.addOrUpdateReview(reviewData);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// Delete a review
export const deleteReview = createAsyncThunk(
  "reviews/deleteReview",
  async (reviewId, thunkAPI) => {
    try {
      return await reviewService.deleteReview(reviewId);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// ---------------- Slice ----------------
const reviewSlice = createSlice({
  name: "reviews",
  initialState: {
    productReviews: [],   // all reviews for a product
    userReview: null,     // current user's review
    loading: false,
    error: null,
  },
  reducers: {
    clearReviewError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // ---- Get Product Reviews ----
      .addCase(getProductReviews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getProductReviews.fulfilled, (state, action) => {
        state.loading = false;
        state.productReviews = action.payload.reviews;
      })
      .addCase(getProductReviews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ---- Get User Review ----
      .addCase(getUserReview.fulfilled, (state, action) => {
        state.userReview = action.payload.review;
      })

      // ---- Add / Update Review ----
      .addCase(addOrUpdateReview.fulfilled, (state, action) => {
        const updatedReview = action.payload.review;
        const existingIndex = state.productReviews.findIndex(
          (r) => r._id === updatedReview._id
        );
        if (existingIndex >= 0) {
          state.productReviews[existingIndex] = updatedReview;
        } else {
          state.productReviews.unshift(updatedReview);
        }
        state.userReview = updatedReview;
      })

      // ---- Delete Review ----
      .addCase(deleteReview.fulfilled, (state, action) => {
        const reviewId = action.meta.arg;
        state.productReviews = state.productReviews.filter(
          (r) => r._id !== reviewId
        );
        if (state.userReview && state.userReview._id === reviewId) {
          state.userReview = null;
        }
      });
  },
});

export const { clearReviewError } = reviewSlice.actions;
export default reviewSlice.reducer;
