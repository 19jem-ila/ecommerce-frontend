import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Row,
  Col,
  Card,
  Typography,
  Space,
  Spin,
  Alert,
  Empty,
  Modal,
  message,
  Grid,
  Tag,
  Divider,
} from "antd";
import {
  ShoppingCartOutlined,
  DeleteOutlined,
  EyeOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons";
import { 
  getWishlist, 
  removeFromWishlist, 
  moveToCart 
} from "../../store/slices/whishListSlice";
import { addToCart } from "../../store/slices/cartSlice";
import CustomButton from "../../components/ui/CustomButton";
import "./favourite.css";

const { Title, Text, Paragraph } = Typography;
const { useBreakpoint } = Grid;

const WishlistPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const screens = useBreakpoint(); 
  const { products, loading, error } = useSelector((state) => state.whishlist);
  const { isAuthenticated } = useSelector((state) => state.auth);

  const [removingItem, setRemovingItem] = useState(null);
  const [movingToCart, setMovingToCart] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [previewVisible, setPreviewVisible] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login", { state: { from: "/wishlist" } });
      return;
    }
    dispatch(getWishlist());
  }, [dispatch, isAuthenticated, navigate]);

  const handleRemoveFromWishlist = async (productId) => {
    setRemovingItem(productId);
    try {
      await dispatch(removeFromWishlist(productId)).unwrap();
      message.success("Removed from favorites");
    } catch (error) {
      message.error("Failed to remove from favorites");
    } finally {
      setRemovingItem(null);
    }
  };

  const handleMoveToCart = async (product) => {
    setMovingToCart(product._id);
    try {
      // First add to cart
      await dispatch(addToCart({
        productId: product._id,
        quantity: 1,
        variant: {}
      })).unwrap();
      
      // Then remove from wishlist using removeFromWishlist slice function
      await dispatch(removeFromWishlist(product._id)).unwrap();
      
      message.success("Moved to cart successfully");
    } catch (error) {
      message.error("Failed to move to cart");
    } finally {
      setMovingToCart(null);
    }
  };

  const handleQuickView = (product) => {
    setSelectedProduct(product);
    setPreviewVisible(true);
  };

  const handleViewDetails = (productId) => {
    navigate(`/product/${productId}`);
  };

  if (loading) {
    return (
      <div className="wishlist-loading">
        <Spin size="large" />
        <Text>Loading your favorites...</Text>
      </div>
    );
  }

  if (error) {
    return (
      <div className="wishlist-error">
        <Alert
          message="Error"
          description={error}
          type="error"
          showIcon
        />
        <CustomButton 
          variant="primary" 
          onClick={() => dispatch(getWishlist())}
          style={{ marginTop: 16 }}
        >
          Try Again
        </CustomButton>
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="empty-wishlist">
        <Empty
          image={<div className="empty-heart-icon">❤️</div>}
          description={
            <div>
              <Title level={4}>Your wishlist is empty</Title>
              <Text>Save your favorite items here for easy access later.</Text>
            </div>
          }
        >
          <CustomButton 
            variant="primary" 
            icon={<ArrowLeftOutlined />} 
            onClick={() => navigate("/products/category/eyeglasses")}
          >
            Browse Products
          </CustomButton>
        </Empty>
      </div>
    );
  }

  return (
    <div className="wishlist-page">
      <div className="wishlist-header">
        <div className="header-content">
          <Title level={2} className="wishlist-title">
            My Favorites
          </Title>
          <Text className="wishlist-subtitle">
            Your curated collection of preferred items
          </Text>
        </div>
        <div className="wishlist-meta">
          <Tag color="blue" className="item-count-tag">
            {products.length} {products.length === 1 ? "item" : "items"}
          </Tag>
        </div>
      </div>

      <Divider className="section-divider" />

      <Row gutter={[24, 24]}>
        {products.map((product) => (
          <Col 
            key={product._id} 
            xs={24} 
            sm={12} 
            lg={8} 
            xl={6}
          >
            <Card className="wishlist-item-card" hoverable>
              <div className="product-image-container">
                <img
                  src={product.images?.[0] || "/images/placeholder-product.jpg"}
                  alt={product.name}
                  className="product-image"
                  onError={(e) => {
                    e.target.src = "/images/placeholder-product.jpg";
                  }}
                />
                <div className="product-actions">
                  <CustomButton
                    variant="secondary"
                    shape="circle"
                    icon={<EyeOutlined />}
                    onClick={() => handleQuickView(product)}
                    className="action-btn"
                    tooltip="Quick view"
                  />
                  <CustomButton
                    variant="secondary"
                    shape="circle"
                    icon={<DeleteOutlined />}
                    loading={removingItem === product._id}
                    onClick={() => handleRemoveFromWishlist(product._id)}
                    className="action-btn"
                    tooltip="Remove from wishlist"
                  />
                </div>
                {product.discountPercentage && (
                  <div className="discount-badge">
                    Save {product.discountPercentage}%
                  </div>
                )}
              </div>

              <div className="product-content">
                <div className="product-brand">{product.brand}</div>
                <Title level={5} className="product-name" ellipsis={{ rows: 2 }}>
                  {product.name}
                </Title>
                
                <div className="product-price">
                  <Text strong className="current-price">
                    ${product.price}
                  </Text>
                  {product.originalPrice && (
                    <Text delete type="secondary" className="original-price">
                      ${product.originalPrice}
                    </Text>
                  )}
                </div>

                <div className="product-rating">
                  <Space>
                    <div className="rating-badge">{product.rating || 4.5}</div>
                    <Text type="secondary">
                      ({product.reviewCount || 0} reviews)
                    </Text>
                  </Space>
                </div>

                <div className="product-actions-bottom">
                  <CustomButton
                    variant="primary"
                    icon={<ShoppingCartOutlined />}
                    loading={movingToCart === product._id}
                    onClick={() => handleMoveToCart(product)}
                    block
                    className="move-to-cart-btn"
                  >
                    Add to Cart
                  </CustomButton>
                  <CustomButton
                    variant="secondary"
                    onClick={() => handleViewDetails(product._id)}
                    block
                    className="view-details-btn"
                  >
                    View Details
                  </CustomButton>
                </div>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Quick View Modal */}
      <Modal
        title="Product Preview"
        visible={previewVisible}
        onCancel={() => setPreviewVisible(false)}
        footer={[
          <CustomButton
            key="close"
            variant="secondary"
            onClick={() => setPreviewVisible(false)}
          >
            Close
          </CustomButton>,
          <CustomButton
            key="details"
            variant="primary"
            onClick={() => {
              setPreviewVisible(false);
              handleViewDetails(selectedProduct?._id);
            }}
          >
            View Full Details
          </CustomButton>
        ]}
        className="preview-modal"
        width={400}
      >
        {selectedProduct && (
          <div className="preview-content">
            <img
              src={selectedProduct.images?.[0] || "/images/placeholder-product.jpg"}
              alt={selectedProduct.name}
              className="preview-image"
            />
            <div className="preview-details">
              <div className="preview-brand">{selectedProduct.brand}</div>
              <Title level={5}>{selectedProduct.name}</Title>
              <div className="preview-price">
                <Text strong>{selectedProduct.price} ETB</Text>
                {selectedProduct.originalPrice && (
                  <Text delete type="secondary">
                    {selectedProduct.originalPrice} ETB
                  </Text>
                )}
              </div>
              <Paragraph ellipsis={{ rows: 3 }}>
                {selectedProduct.description || "No description available."}
              </Paragraph>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default WishlistPage;