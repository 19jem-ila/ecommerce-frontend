// import React, { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useNavigate } from "react-router-dom";
// import {
//   Row,
//   Col,
//   Card,
//   Button,
//   Typography,
//   InputNumber,
//   Divider,
//   Image,
//   Space,
//   Spin,
//   Alert,
//   Empty,
//   Popconfirm,
//   message,
//   Input,
//   Badge
// } from "antd";
// import {
//   DeleteOutlined,
//   ShoppingCartOutlined,
//   ArrowLeftOutlined,
//   HeartOutlined,
//   LockOutlined,
//   PlusOutlined,
//   MinusOutlined
// } from "@ant-design/icons";
// import {
//   getCart,
//   updateCartItem,
//   removeCartItem,
//   clearCart
// } from "../../store/slices/cartSlice";
// import { fetchProductById } from "../../store/slices/productSlice";
// import { logoutUser } from "../../store/slices/authSlice";
// import "./Cart.css";

// const { Title, Text } = Typography;

// const CartPage = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const { items, loading: cartLoading, error: cartError } = useSelector((state) => state.cart);
//   const { user, isAuthenticated, isLoading: authLoading } = useSelector((state) => state.auth);
//   const { product, loading: productLoading, error: productError } = useSelector((state) => state.products);
//   const [updatingItem, setUpdatingItem] = useState(null);
//   const [removingItem, setRemovingItem] = useState(null);
//   const [couponCode, setCouponCode] = useState("");
//   const [appliedCoupon, setAppliedCoupon] = useState(null);
//   const [productDetails, setProductDetails] = useState({});
//   const [loadingProducts, setLoadingProducts] = useState(false);

//   // Debug auth state
//   useEffect(() => {
//     console.log("Auth state:", { isAuthenticated, authLoading, user: user ? true : false });
//   }, [isAuthenticated, authLoading, user]);

//   // Simplified authentication check
//   useEffect(() => {
//     // If auth is still loading, wait
//     if (authLoading) return;
    
//     // If not authenticated, redirect to login
//     if (!isAuthenticated) {
//       navigate("/login", { state: { from: "/cart" } });
//       return;
//     }
    
//     // If authenticated, fetch cart
//     dispatch(getCart());
//   }, [dispatch, isAuthenticated, authLoading, navigate]);

//   // Fetch product details for items in cart
//   useEffect(() => {
//     if (!items || typeof items !== 'object' || Object.keys(items).length === 0) return;
    
//     const fetchProductDetails = async () => {
//       setLoadingProducts(true);
//       try {
//         const productIds = Object.keys(items);
//         const productDetailsMap = {};
        
//         // Fetch each product by ID
//         for (const productId of productIds) {
//           try {
//             const result = await dispatch(fetchProductById(productId)).unwrap();
//             if (result && result.success) {
//               productDetailsMap[productId] = result.data;
//             }
//           } catch (error) {
//             console.error(`Failed to fetch product ${productId}:`, error);
//             // Create a fallback product object if fetch fails
//             productDetailsMap[productId] = {
//               _id: productId,
//               name: `Product ${productId}`,
//               price: 0,
//               images: ["/images/placeholder-product.jpg"],
//               brand: "Unknown Brand"
//             };
//           }
//         }
        
//         setProductDetails(productDetailsMap);
//       } catch (error) {
//         console.error("Failed to fetch product details:", error);
//         message.error("Failed to load product details");
//       } finally {
//         setLoadingProducts(false);
//       }
//     };

//     fetchProductDetails();
//   }, [items, dispatch]);

//   // Convert the cart items object to an array with product details
//   const cartItems = React.useMemo(() => {
//     if (!items || typeof items !== 'object') return [];
    
//     return Object.entries(items).map(([productId, quantity]) => {
//       const productInfo = productDetails[productId] || {};
      
//       return {
//         productId,
//         quantity,
//         name: productInfo.name || `Product ${productId}`,
//         price: productInfo.price || 0,
//         image: productInfo.images && productInfo.images.length > 0 
//           ? productInfo.images[0] 
//           : "/images/placeholder-product.jpg",
//         brand: productInfo.brand || "Brand"
//       };
//     });
//   }, [items, productDetails]);

//   // Handle API errors including 401 Unauthorized
//   useEffect(() => {
//     const error = cartError || productError;
//     if (error) {
//       if (error.includes("401") || error.includes("Unauthorized") || error.includes("authenticat")) {
//         message.error("Your session has expired. Please login again.");
//         dispatch(logoutUser());
//         navigate("/login", { state: { from: "/cart" } });
//       } else if (!error.includes("404")) { // Don't show error for product not found
//         message.error(error);
//       }
//     }
//   }, [cartError, productError, dispatch, navigate]);

//   const handleQuantityChange = async (productId, newQuantity, variant = {}) => {
//     if (newQuantity <= 0) return;
    
//     setUpdatingItem(productId);
//     try {
//       await dispatch(updateCartItem({ productId, quantity: newQuantity, variant })).unwrap();
//       message.success("Cart updated successfully");
//     } catch (error) {
//       if (error.includes("401") || error.includes("Unauthorized") || error.includes("authenticat")) {
//         message.error("Please login again to update your cart");
//         dispatch(logoutUser());
//         navigate("/login", { state: { from: "/cart" } });
//       } else {
//         message.error("Failed to update cart");
//       }
//     } finally {
//       setUpdatingItem(null);
//     }
//   };

//   const handleRemoveItem = async (productId, variant = {}) => {
//     setRemovingItem(productId);
//     try {
//       await dispatch(removeCartItem({ productId, variant })).unwrap();
//       message.success("Item removed from cart");
//     } catch (error) {
//       if (error.includes("401") || error.includes("Unauthorized") || error.includes("authenticat")) {
//         message.error("Please login again to remove items");
//         dispatch(logoutUser());
//         navigate("/login", { state: { from: "/cart" } });
//       } else {
//         message.error("Failed to remove item");
//       }
//     } finally {
//       setRemovingItem(null);
//     }
//   };

//   const handleClearCart = async () => {
//     try {
//       await dispatch(clearCart()).unwrap();
//       message.success("Cart cleared successfully");
//     } catch (error) {
//       if (error.includes("401") || error.includes("Unauthorized") || error.includes("authenticat")) {
//         message.error("Please login again to clear cart");
//         dispatch(logoutUser());
//         navigate("/login", { state: { from: "/cart" } });
//       } else {
//         message.error("Failed to clear cart");
//       }
//     }
//   };

//   const applyCoupon = () => {
//     const validCoupons = {
//       "SAVE10": { discount: 10, type: "percentage" },
//       "FREESHIP": { discount: 4.99, type: "fixed", minOrder: 50 },
//       "WELCOME15": { discount: 15, type: "percentage", maxDiscount: 20 }
//     };

//     if (validCoupons[couponCode]) {
//       setAppliedCoupon({
//         code: couponCode,
//         ...validCoupons[couponCode]
//       });
//       message.success("Coupon applied successfully!");
//     } else {
//       message.error("Invalid coupon code");
//     }
//   };

//   const calculateDiscount = (subtotal) => {
//     if (!appliedCoupon) return 0;

//     const { discount, type, maxDiscount } = appliedCoupon;
    
//     if (type === "percentage") {
//       const discountAmount = (subtotal * discount) / 100;
//       return maxDiscount ? Math.min(discountAmount, maxDiscount) : discountAmount;
//     }
    
//     return discount;
//   };

//   const calculateTotals = () => {
//     const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
//     const discount = calculateDiscount(subtotal);
//     const shipping = subtotal > 50 ? 0 : 4.99;
//     const tax = subtotal * 0.08;
//     const total = subtotal - discount + shipping + tax;

//     return {
//       subtotal: subtotal.toFixed(2),
//       discount: discount.toFixed(2),
//       shipping: shipping.toFixed(2),
//       tax: tax.toFixed(2),
//       total: total.toFixed(2)
//     };
//   };

//   const { subtotal, discount, shipping, tax, total } = calculateTotals();

//   // Show loading while auth is being checked or cart is loading
//   if (authLoading || cartLoading || loadingProducts) {
//     return (
//       <div className="cart-loading">
//         <Spin size="large" />
//         <Text>Loading your cart...</Text>
//       </div>
//     );
//   }

//   // Show error if exists (excluding auth errors)
//   if ((cartError || productError) && 
//       !cartError?.includes("401") && 
//       !cartError?.includes("Unauthorized") && 
//       !cartError?.includes("authenticat") &&
//       !productError?.includes("404")) {
//     return (
//       <div className="cart-error">
//         <Alert
//           message="Error"
//           description={cartError || productError}
//           type="error"
//           showIcon
//         />
//         <Button 
//           type="primary" 
//           onClick={() => dispatch(getCart())}
//           style={{ marginTop: 16 }}
//         >
//           Try Again
//         </Button>
//       </div>
//     );
//   }

//   // Show empty cart if no items
//   if (cartItems.length === 0) {
//     return (
//       <div className="empty-cart">
//         <Empty
//           image={<ShoppingCartOutlined style={{ fontSize: '64px', color: '#ddd' }} />}
//           description={
//             <div>
//               <Title level={4}>Your cart is empty</Title>
//               <Text>Looks like you haven't added anything to your cart yet.</Text>
//             </div>
//           }
//         >
//           <Button 
//             type="primary" 
//             icon={<ArrowLeftOutlined />}
//             onClick={() => navigate("/products")}
//           >
//             Continue Shopping
//           </Button>
//         </Empty>
//       </div>
//     );
//   }

//   return (
//     <div className="cart-page">
//       <div className="cart-header">
//         <Title level={2}>Your Shopping Cart</Title>
//         <Text>{cartItems.length} {cartItems.length === 1 ? 'item' : 'items'}</Text>
//       </div>

//       <Row gutter={[24, 24]}>
//         <Col xs={24} lg={16}>
//           <Card className="cart-items-card">
//             <div className="cart-items-header">
//               <Text strong>Product</Text>
//               <Text strong>Price</Text>
//               <Text strong>Quantity</Text>
//               <Text strong>Total</Text>
//               <Text strong>Action</Text>
//             </div>

//             <Divider />

//             {cartItems.map((item) => (
//               <div key={item.productId} className="cart-item">
//                 <div className="item-info">
//                   <Image
//                     src={item.image}
//                     alt={item.name}
//                     width={80}
//                     height={80}
//                     preview={false}
//                     fallback="/images/placeholder-product.jpg"
//                     onClick={() => navigate(`/product/${item.productId}`)}
//                     style={{ cursor: 'pointer' }}
//                   />
//                   <div className="item-details">
//                     <div 
//                       className="item-name"
//                       onClick={() => navigate(`/product/${item.productId}`)}
//                       style={{ cursor: 'pointer' }}
//                     >
//                       {item.name}
//                     </div>
//                     <Text type="secondary">{item.brand}</Text>
//                   </div>
//                 </div>

//                 <div className="item-price">
//                   <Text>${item.price.toFixed(2)}</Text>
//                 </div>

//                 <div className="item-quantity">
//                   <Space>
//                     <Button
//                       size="small"
//                       icon={<MinusOutlined />}
//                       onClick={() => handleQuantityChange(
//                         item.productId, 
//                         item.quantity - 1
//                       )}
//                       disabled={item.quantity <= 1 || updatingItem === item.productId}
//                     />
//                     <InputNumber
//                       min={1}
//                       max={10}
//                       value={item.quantity}
//                       onChange={(value) => handleQuantityChange(
//                         item.productId, 
//                         value
//                       )}
//                       disabled={updatingItem === item.productId}
//                     />
//                     <Button
//                       size="small"
//                       icon={<PlusOutlined />}
//                       onClick={() => handleQuantityChange(
//                         item.productId, 
//                         item.quantity + 1
//                       )}
//                       disabled={item.quantity >= 10 || updatingItem === item.productId}
//                     />
//                   </Space>
//                   {updatingItem === item.productId && (
//                     <Spin size="small" style={{ marginLeft: 8 }} />
//                   )}
//                 </div>

//                 <div className="item-total">
//                   <Text strong>${(item.price * item.quantity).toFixed(2)}</Text>
//                 </div>

//                 <div className="item-actions">
//                   <Popconfirm
//                     title="Remove this item?"
//                     description="Are you sure you want to remove this item from your cart?"
//                     onConfirm={() => handleRemoveItem(item.productId)}
//                     okText="Yes"
//                     cancelText="No"
//                   >
//                     <Button
//                       type="text"
//                       danger
//                       icon={<DeleteOutlined />}
//                       loading={removingItem === item.productId}
//                     />
//                   </Popconfirm>
//                   <Button
//                     type="text"
//                     icon={<HeartOutlined />}
//                     title="Save for later"
//                   />
//                 </div>
//               </div>
//             ))}

//             <Divider />

//             <div className="cart-actions">
//               <Button 
//                 icon={<ArrowLeftOutlined />}
//                 onClick={() => navigate("/products")}
//               >
//                 Continue Shopping
//               </Button>
              
//               <Popconfirm
//                 title="Clear your cart?"
//                 description="Are you sure you want to remove all items from your cart?"
//                 onConfirm={handleClearCart}
//                 okText="Yes"
//                 cancelText="No"
//               >
//                 <Button danger>Clear Cart</Button>
//               </Popconfirm>
//             </div>
//           </Card>
//         </Col>

//         <Col xs={24} lg={8}>
//           <Card className="order-summary-card" title="Order Summary">
//             <div className="summary-row">
//               <Text>Subtotal</Text>
//               <Text>${subtotal}</Text>
//             </div>

//             {appliedCoupon && (
//               <div className="summary-row discount">
//                 <Text>
//                   Discount ({appliedCoupon.code})
//                   {appliedCoupon.type === 'percentage' && ` (${appliedCoupon.discount}%)`}
//                 </Text>
//                 <Text>-${discount}</Text>
//               </div>
//             )}

//             <div className="summary-row">
//               <Text>Shipping</Text>
//               <Text>{shipping === '0.00' ? 'Free' : `$${shipping}`}</Text>
//             </div>

//             <div className="summary-row">
//               <Text>Tax</Text>
//               <Text>${tax}</Text>
//             </div>

//             <Divider />

//             <div className="summary-row total">
//               <Text strong>Total</Text>
//               <Text strong>${total}</Text>
//             </div>

//             {parseFloat(subtotal) < 50 && (
//               <div className="shipping-notice">
//                 <Text type="secondary">
//                   Add ${(50 - parseFloat(subtotal)).toFixed(2)} more for free shipping!
//                 </Text>
//               </div>
//             )}

//             {!appliedCoupon ? (
//               <div className="coupon-section">
//                 <Text strong>Apply Coupon</Text>
//                 <Space.Compact style={{ width: '100%', marginTop: '8px' }}>
//                   <Input
//                     placeholder="Enter coupon code"
//                     value={couponCode}
//                     onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
//                   />
//                   <Button type="primary" onClick={applyCoupon}>
//                     Apply
//                   </Button>
//                 </Space.Compact>
//               </div>
//             ) : (
//               <div className="applied-coupon">
//                 <Text strong>Applied Coupon: {appliedCoupon.code}</Text>
//                 <Button 
//                   type="link" 
//                   size="small" 
//                   onClick={() => setAppliedCoupon(null)}
//                 >
//                   Remove
//                 </Button>
//               </div>
//             )}

//             <Button 
//               type="primary" 
//               size="large" 
//               block 
//               className="checkout-btn"
//               onClick={() => navigate("/checkout")}
//             >
//               Proceed to Checkout
//             </Button>

//             <Text type="secondary" className="security-notice">
//               <LockOutlined /> Your payment information is secure and encrypted
//             </Text>
//           </Card>
//         </Col>
//       </Row>
//     </div>
//   );
// };

// export default CartPage;