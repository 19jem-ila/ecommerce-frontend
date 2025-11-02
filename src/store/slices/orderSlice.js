import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { orderService } from "../../services/orderService";

// ------------------- Thunks -------------------

// Create new order
export const createOrder = createAsyncThunk(
  "orders/createOrder",
  async (orderData, thunkAPI) => {
    try {
      return await orderService.createOrder(orderData);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// Get logged-in user's orders
export const getUserOrders = createAsyncThunk(
  "orders/getUserOrders",
  async ({ page = 1, limit = 10, status }, thunkAPI) => {
    try {
      return await orderService.getUserOrders(page, limit, status);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// Cancel an order
export const cancelOrder = createAsyncThunk(
  "orders/cancelOrder",
  async (orderId, thunkAPI) => {
    try {
      return await orderService.cancelOrder(orderId);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// Admin: Get all orders
export const getAllOrders = createAsyncThunk(
  "orders/getAllOrders",
  async ({ page = 1, limit = 20, status, paymentStatus }, thunkAPI) => {
    try {
      return await orderService.getAllOrders(page, limit, status, paymentStatus);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// Admin: Update order status
export const updateOrderStatus = createAsyncThunk(
  "orders/updateOrderStatus",
  async ({ orderId, data }, thunkAPI) => {
    try {
      return await orderService.updateOrderStatus(orderId, data);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// ------------------- Telebirr Payment Thunks -------------------

// Initiate Telebirr payment
export const initiatePayment = createAsyncThunk(
  "orders/initiatePayment",
  async (orderId, thunkAPI) => {
    try {
      return await orderService.initiatePayment(orderId);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// Confirm Telebirr payment
export const confirmPayment = createAsyncThunk(
  "orders/confirmPayment",
  async ({ transactionId, status, data }, thunkAPI) => {
    try {
      return await orderService.confirmPayment(transactionId, status, data);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// ------------------- Slice -------------------
const initialState = {
  userOrders: [],
  adminOrders: [],
  currentOrder: JSON.parse(localStorage.getItem("currentOrder")) || null,
  loading: false,
  error: null,

  // Payment related state
  paymentStatus: null,
  paymentId: null,
  telebirrTransactionId: null,
  paymentDetails: null,
  paymentExpiresAt: null,
  paymentLoading: false,
  paymentError: null,

  pagination: { currentPage: 1, totalPages: 1, totalOrders: 0 },
};

const orderSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    clearOrderError: (state) => {
      state.error = null;
    },
    clearPaymentError: (state) => {
      state.paymentError = null;
    },
    clearCurrentOrder: (state) => {
      state.currentOrder = null;
      state.paymentStatus = null;
      state.paymentId = null;
      state.telebirrTransactionId = null;
      state.paymentDetails = null;
      state.paymentExpiresAt = null;
      localStorage.removeItem("currentOrder");
    },
  },
  extraReducers: (builder) => {
    builder
      // ---- Create Order ----
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.currentOrder = action.payload.order;
        localStorage.setItem("currentOrder", JSON.stringify(action.payload.order));
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ---- Get User Orders ----
      .addCase(getUserOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.userOrders = action.payload.orders;
        state.pagination = action.payload.pagination;
      })
      .addCase(getUserOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ---- Cancel Order ----
      .addCase(cancelOrder.fulfilled, (state, action) => {
        state.userOrders = state.userOrders.map((order) =>
          order._id === action.meta.arg ? { ...order, orderStatus: "cancelled" } : order
        );
      })

      // ---- Admin Get All Orders ----
      .addCase(getAllOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.adminOrders = action.payload.orders;
        state.pagination = action.payload.pagination;
      })
      .addCase(getAllOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ---- Admin Update Order Status ----
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        state.adminOrders = state.adminOrders.map((order) =>
          order._id === action.meta.arg.orderId ? action.payload.order : order
        );
      })

      // ---- Telebirr Initiate Payment ----
      .addCase(initiatePayment.pending, (state) => {
        state.paymentLoading = true;
        state.paymentError = null;
      })
      .addCase(initiatePayment.fulfilled, (state, action) => {
        state.paymentLoading = false;
      
        const order = action.payload.order;
        state.telebirrTransactionId = order.telebirrTransactionId; // ✅ correct
        state.paymentDetails = action.payload; 
      
        if (state.currentOrder) {
          state.currentOrder.paymentId = order.paymentId;
          state.currentOrder.telebirrTransactionId = order.telebirrTransactionId;
          state.currentOrder.paymentExpiresAt = order.paymentExpiresAt;
          state.currentOrder.paymentDetails = action.payload;
          state.currentOrder.paymentStatus = order.paymentStatus;
      
          localStorage.setItem("currentOrder", JSON.stringify(state.currentOrder));
        }
      })
      
      .addCase(initiatePayment.rejected, (state, action) => {
        state.paymentLoading = false;
        state.paymentError = action.payload;
      })

      // ---- Telebirr Confirm Payment ----
      .addCase(confirmPayment.pending, (state) => {
        state.paymentLoading = true;
        state.paymentError = null;
      })
      .addCase(confirmPayment.fulfilled, (state, action) => {
        state.paymentLoading = false;
        if (state.currentOrder && action.payload.order) {
          const { paymentStatus, telebirrTransactionId, paymentDetails } = action.payload.order;
          state.currentOrder.paymentStatus = paymentStatus;
          state.currentOrder.telebirrTransactionId = telebirrTransactionId;
          state.currentOrder.paymentDetails = paymentDetails;

          localStorage.setItem("currentOrder", JSON.stringify(state.currentOrder));
        }
      })
      .addCase(confirmPayment.rejected, (state, action) => {
        state.paymentLoading = false;
        state.paymentError = action.payload;
      });
  },
});

export const { clearOrderError, clearPaymentError, clearCurrentOrder } = orderSlice.actions;
export default orderSlice.reducer;
