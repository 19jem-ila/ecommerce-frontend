import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import  productReducer from "./slices/productSlice"
import  cartReducer from "./slices/cartSlice"
import whishlistReducer from "./slices/whishListSlice"
import orderReducer from "./slices/orderSlice"
import reviewReducer from "./slices/reviewSlice"
import adminReducer from "./slices/adminSlice"
import userReducer from "./slices/userSlice"


const store = configureStore({
  reducer: {
    auth: authReducer,        // now auth state is available at state.auth
    products:productReducer,
    cart:cartReducer,
    whishlist:whishlistReducer,
    orders:orderReducer,
    review:reviewReducer,
    admin:adminReducer,
    user:userReducer,
  },
});

export default store;
