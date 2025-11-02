import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Row,
  Col,
  Card,
  Typography,
  InputNumber,
  Divider,
  Image,
  Space,
  Spin,
  Alert,
  Empty,
  Popconfirm,
  message,
} from "antd";
import {
  DeleteOutlined,
  ShoppingCartOutlined,
  ArrowLeftOutlined,
  HeartOutlined,
  LockOutlined,
  PlusOutlined,
  MinusOutlined,
} from "@ant-design/icons";
import {
  getCart,
  updateCartItem,
  removeCartItem,
  clearCart,
} from "../../store/slices/cartSlice";
import { logoutUser } from "../../store/slices/authSlice";
import { addToWishlist } from "../../store/slices/whishListSlice";
import CustomButton from "../../components/ui/CustomButton";
import "./Cart.css";

const { Title, Text } = Typography;

const CartPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, loading, error } = useSelector((state) => state.cart);
  const { user, isAuthenticated, isLoading } = useSelector(
    (state) => state.auth
  );

  const [updatingItem, setUpdatingItem] = useState(null);
  const [removingItem, setRemovingItem] = useState(null);

  // Fetch cart after login check
  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated) {
      navigate("/login", { state: { from: "/cart" } });
      return;
    }
    dispatch(getCart());
  }, [dispatch, isAuthenticated, isLoading, navigate]);

  // Convert cart state to usable array
  const cartItems = useMemo(() => {
    if (!items || !Array.isArray(items)) return [];
    return items.map((item) => ({
      productId: item.product._id,
      name: item.product.name,
      price: item.product.price,
      quantity: item.quantity,
      image: item.product.images?.[0] || "/images/placeholder-product.jpg",
      brand: item.product.brand || "Brand",
      variant: item.variant,
    }));
  }, [items]);

  // Handle API errors including 401
  useEffect(() => {
    if (error) {
      if (
        error.includes("401") ||
        error.includes("Unauthorized") ||
        error.includes("authenticat")
      ) {
        message.error("Your session has expired. Please login again.");
        dispatch(logoutUser());
        navigate("/login", { state: { from: "/cart" } });
      } else {
        message.error(error);
      }
    }
  }, [error, dispatch, navigate]);

  // Quantity update
  const handleQuantityChange = async (productId, newQuantity) => {
    if (newQuantity <= 0) return;
    setUpdatingItem(productId);
    try {
      await dispatch(updateCartItem({ productId, quantity: newQuantity })).unwrap();
      message.success("Cart updated successfully");
    } catch {
      message.error("Failed to update cart");
    } finally {
      setUpdatingItem(null);
    }
  };

  // Remove item
  const handleRemoveItem = async (item) => {
    setRemovingItem(item.productId);
    try {
      await dispatch(removeCartItem({ 
        productId: item.productId, 
        variant: item.variant || {} 
      })).unwrap();
      message.success("Item removed from cart");
    } catch (error) {
      message.error("Failed to remove item");
    } finally {
      setRemovingItem(null);
    }
  };

  // Clear cart
  const handleClearCart = async () => {
    try {
      await dispatch(clearCart()).unwrap();
      message.success("Cart cleared successfully");
    } catch {
      message.error("Failed to clear cart");
    }
  };

  // Save for later → Wishlist
  const handleSaveForLater = async (productId) => {
    try {
      await dispatch(addToWishlist(productId)).unwrap();
      message.success("Product saved to wishlist!");
    } catch {
      message.error("Failed to save product to wishlist");
    }
  };

  // Calculate totals
  const totals = useMemo(() => {
    const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shipping = subtotal > 50 ? 0 : 4.99;
    const tax = subtotal * 0.08;
    const total = subtotal + shipping + tax;
    return {
      subtotal: subtotal.toFixed(2),
      shipping: shipping.toFixed(2),
      tax: tax.toFixed(2),
      total: total.toFixed(2),
    };
  }, [cartItems]);

  // Loading state
  if (isLoading || (loading && cartItems.length === 0)) {
    return (
      <div className="cart-loading">
        <Spin size="large" />
        <Text>Loading your cart...</Text>
      </div>
    );
  }

  // Error
  if (error && !error.includes("401")) {
    return (
      <div className="cart-error">
        <Alert message="Error" description={error} type="error" showIcon />
        <CustomButton 
          variant="primary" 
          onClick={() => dispatch(getCart())} 
          style={{ marginTop: 16 }}
        >
          Try Again
        </CustomButton>
      </div>
    );
  }

  // Empty cart
  if (cartItems.length === 0) {
    return (
      <div className="empty-cart">
        <Empty
          image={<ShoppingCartOutlined style={{ fontSize: "64px", color: "#ddd" }} />}
          description={
            <div>
              <Title level={4}>Your cart is empty</Title>
              <Text>Looks like you haven't added anything to your cart yet.</Text>
            </div>
          }
        >
          <CustomButton 
            variant="primary" 
            icon={<ArrowLeftOutlined />} 
            onClick={() => navigate("/")}
          >
            Continue Shopping
          </CustomButton>
        </Empty>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="cart-header">
        <Title level={2} className="cart-title">Your Shopping Cart</Title>
        <Text className="cart-item-count">{cartItems.length} {cartItems.length === 1 ? "item" : "items"}</Text>
      </div>

      <Row gutter={[24, 24]}>
        <Col xs={24} lg={16}>
          <Card className="cart-items-card">
            <div className="cart-items-header">
              <Text strong>Product</Text>
              <Text strong>Price</Text>
              <Text strong>Quantity</Text>
              <Text strong>Total</Text>
              <Text strong>Action</Text>
            </div>
            <Divider className="cart-divider" />
            
            {cartItems.map((item) => (
              <div key={item.productId} className="cart-item">
                <div className="item-info">
                  <Image
                    src={item.image}
                    alt={item.name}
                    width={80}
                    height={80}
                    preview={false}
                    fallback="/images/placeholder-product.jpg"
                    className="cart-item-image"
                  />
                  <div className="item-details">
                    <div className="item-name">{item.name}</div>
                    <Text type="secondary" className="item-brand">{item.brand}</Text>
                    {item.variant && item.variant.color && (
                      <div className="item-variant">
                        <div 
                          className="color-swatch" 
                          style={{ backgroundColor: item.variant.color.toLowerCase() }}
                        />
                        <Text type="secondary">{item.variant.color}</Text>
                      </div>
                    )}
                  </div>
                </div>

                <div className="item-price">
                  <Text className="price-text">{item.price.toFixed(2)} ETB</Text>
                </div>

                <div className="item-quantity">
                  <Space>
                    <CustomButton
                      variant="secondary"
                      size="small"
                      icon={<MinusOutlined />}
                      onClick={() => handleQuantityChange(item.productId, item.quantity - 1)}
                      disabled={item.quantity <= 1 || updatingItem === item.productId}
                    />
                    <InputNumber
                      min={1}
                      max={10}
                      value={item.quantity}
                      onChange={(value) => handleQuantityChange(item.productId, value)}
                      disabled={updatingItem === item.productId}
                      className="quantity-input"
                    />
                    <CustomButton
                      variant="secondary"
                      size="small"
                      icon={<PlusOutlined />}
                      onClick={() => handleQuantityChange(item.productId, item.quantity + 1)}
                      disabled={item.quantity >= 10 || updatingItem === item.productId}
                    />
                  </Space>
                  {updatingItem === item.productId && <Spin size="small" className="update-spinner" />}
                </div>

                <div className="item-total">
                  <Text strong className="total-text">{(item.price * item.quantity).toFixed(2)} ETB</Text>
                </div>

                <div className="item-actions">
                  <Popconfirm
                    title="Remove this item?"
                    description="Are you sure you want to remove this item from your cart?"
                    onConfirm={() => handleRemoveItem(item)}
                    okText="Yes"
                    cancelText="No"
                  >
                    <CustomButton
                      variant="text"
                      danger
                      icon={<DeleteOutlined />}
                      loading={removingItem === item.productId}
                      className="remove-btn"
                    />
                  </Popconfirm>
                  <CustomButton
                    variant="text"
                    icon={<HeartOutlined />}
                    title="Save for later"
                    onClick={() => handleSaveForLater(item.productId)}
                    className="wishlist-btn"
                  />
                </div>
              </div>
            ))}

            <Divider className="cart-divider" />
            <div className="cart-actions">
              <CustomButton 
                variant="secondary"
                icon={<ArrowLeftOutlined />} 
                onClick={() => navigate("/")}
                className="continue-shopping-btn"
              >
                Continue Shopping
              </CustomButton>
              <Popconfirm
                title="Clear your cart?"
                description="Are you sure you want to remove all items from your cart?"
                onConfirm={handleClearCart}
                okText="Yes"
                cancelText="No"
              >
                <CustomButton variant="primary" className="clear-cart-btn">
                  Clear Cart
                </CustomButton>
              </Popconfirm>
            </div>
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <Card className="order-summary-card" title={
            <div className="summary-title">
              <ShoppingCartOutlined /> Order Summary
            </div>
          }>
            <div className="summary-content">
              <div className="summary-row">
                <Text>Subtotal</Text>
                <Text>{totals.subtotal} ETB</Text>
              </div>
              
              <div className="summary-row">
                <Text>Shipping</Text>
                <Text className={totals.shipping === "0.00" ? "free-shipping" : ""}>
                  {totals.shipping === "0.00" ? "FREE" : `${totals.shipping} ETB`}
                </Text>
              </div>
              
              <div className="summary-row">
                <Text>Tax</Text>
                <Text>{totals.tax} ETB</Text>
              </div>
              
              <Divider className="summary-divider" />
              
              <div className="summary-row total-row">
                <Text strong>Total</Text>
                <Text strong className="total-amount">{totals.total} ETB</Text>
              </div>

              {totals.shipping !== "0.00" && (
                <div className="shipping-notice">
                  <Text type="secondary">
                    Add {(50 - parseFloat(totals.subtotal)).toFixed(2)} ETB more for free shipping!
                  </Text>
                </div>
              )}

              <CustomButton 
                variant="primary"
                size="lg" 
                block 
                className="checkout-btn"
                onClick={() => navigate("/checkout")}
              >
                Proceed to Checkout
              </CustomButton>
              
              <div className="security-section">
                <LockOutlined className="lock-icon" />
                <Text type="secondary" className="security-text">
                  Your payment information is secure and encrypted
                </Text>
              </div>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default CartPage;