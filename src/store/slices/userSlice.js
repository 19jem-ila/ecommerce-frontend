import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { userService } from "../../services/userService";

// ================== ASYNC THUNKS ==================

// --- Profile ---
export const getProfile = createAsyncThunk("user/getProfile", async (_, thunkAPI) => {
  try {
    const response = await userService.getProfile()
    return response.user
  } catch (err) {
    return thunkAPI.rejectWithValue(err.message);
  }
});

export const updateProfile = createAsyncThunk("user/updateProfile", async (data, thunkAPI) => {
  try {
    return await userService.updateProfile(data);
  } catch (err) {
    return thunkAPI.rejectWithValue(err.message);
  }
});

// --- Addresses ---
export const addAddress = createAsyncThunk("user/addAddress", async (data, thunkAPI) => {
  try {
    return await userService.addAddress(data);
  } catch (err) {
    return thunkAPI.rejectWithValue(err.message);
  }
});

export const updateAddress = createAsyncThunk("user/updateAddress", async ({ addressId, data }, thunkAPI) => {
  try {
    return await userService.updateAddress(addressId, data);
  } catch (err) {
    return thunkAPI.rejectWithValue(err.message);
  }
});

export const deleteAddress = createAsyncThunk("user/deleteAddress", async (addressId, thunkAPI) => {
  try {
    return await userService.deleteAddress(addressId);
  } catch (err) {
    return thunkAPI.rejectWithValue(err.message);
  }
});

// --- Preferences ---
export const updatePreferences = createAsyncThunk("user/updatePreferences", async (data, thunkAPI) => {
  try {
    return await userService.updatePreferences(data);
  } catch (err) {
    return thunkAPI.rejectWithValue(err.message);
  }
});

// ================== ADMIN ONLY ==================

// Get all users
export const getAllUsers = createAsyncThunk("user/getAllUsers", async (_, thunkAPI) => {
  try {
    return await userService.getAllUsers();
  } catch (err) {
    return thunkAPI.rejectWithValue(err.message);
  }
});

// Update user role
export const updateUserRole = createAsyncThunk(
  "user/updateUserRole",
  async ({ userId, role }, thunkAPI) => {
    try {
     
     const res = await userService.updateUserRole(userId, role);
     return res.user; // ✅ only return the updated user object
    } catch (err) {
      console.error("THUNK ERROR in updateUserRole:", err); // 👈 log error
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);



// Get single user (Admin)
export const getUserById = createAsyncThunk("user/getUserById", async (userId, thunkAPI) => {
  try {
    const res= await userService.getUserById(userId);
    console.log("individual user", res );
    return res
   
    
  } catch (err) {
    return thunkAPI.rejectWithValue(err.message);
  }
});



// Delete user (Admin)
export const deleteUser = createAsyncThunk("user/deleteUser", async (userId, thunkAPI) => {
  try {
    return await userService.deleteUser(userId);
  } catch (err) {
    return thunkAPI.rejectWithValue(err.message);
  }
});

// ================== SLICE ==================
const userSlice = createSlice({
  name: "user",
  initialState: {
    profile: null,
    addresses: [],
    preferences: {},
    users: [], // admin list
    singleUser: null, // admin single user
    loading: false,
    error: null,
  },
  reducers: {
    clearUserError: (state) => {
      state.error = null;
    },
    resetUserState: () => ({
      profile: null,
      addresses: [],
      preferences: {},
      users: [],
      singleUser: null,
      loading: false,
      error: null,
    }),
  },
  extraReducers: (builder) => {
    // --- Profile ---
    builder
      .addCase(getProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(getProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(getProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(updateProfile.fulfilled, (state, action) => {
        state.profile = action.payload;
      })

      // --- Addresses ---
      .addCase(addAddress.fulfilled, (state, action) => {
        state.addresses.push(action.payload);
      })
      .addCase(updateAddress.fulfilled, (state, action) => {
        const index = state.addresses.findIndex((a) => a._id === action.payload._id);
        if (index !== -1) state.addresses[index] = action.payload;
      })
      .addCase(deleteAddress.fulfilled, (state, action) => {
        state.addresses = state.addresses.filter((a) => a._id !== action.meta.arg);
      })

      // --- Preferences ---
      .addCase(updatePreferences.fulfilled, (state, action) => {
        state.preferences = action.payload;
      })

      // --- Admin Only ---
      .addCase(getAllUsers.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(getAllUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(updateUserRole.fulfilled, (state, action) => {
        const updatedUser = action.payload;
        // Make sure state.users is a proper array
        if (!Array.isArray(state.users)) state.users = [];
        const index = state.users.findIndex((u) => u._id === updatedUser._id || u.id === updatedUser.id);
        if (index !== -1) {
          state.users[index] = updatedUser;
        } else {
          // If the user is not found, optionally add them
          state.users.push(updatedUser);
        }
      })
      
  
      .addCase(getUserById.fulfilled, (state, action) => {
       
        state.singleUser = action.payload; // or action.payload if you return only the user
      })
      
    .addCase(deleteUser.fulfilled, (state, action) => {
        if (Array.isArray(state.users)) {
          state.users = state.users.filter(u => u._id !== action.payload);
        } else {
          state.users = [];
        }
      });
      
  },
});

export const { clearUserError, resetUserState } = userSlice.actions;
export default userSlice.reducer;
