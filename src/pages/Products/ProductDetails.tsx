import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductById } from "../../store/slices/productSlice";
import { addToCart } from "../../store/slices/cartSlice";
import { addToWishlist, removeFromWishlist, getWishlist } from "../../store/slices/whishListSlice";
import { 
  getProductReviews, 
  getUserReview, 
  addOrUpdateReview, 
  deleteReview 
} from "../../store/slices/reviewSlice";
import CustomButton from "../../components/ui/CustomButton";
import PrescriptionModal from "../../components/Modals/prescriptionModal";
import SizeGuideModal from "../../components/Modals/sizeguideModal";
import ReviewSection from "../../components/productComponents/reviewSection";
import { 
  Row, 
  Col, 
  Typography, 
  Rate, 
  Divider, 
  InputNumber, 
  Image, 
  Spin, 
  Alert, 
  Badge, 
  List,
  Tabs,
  Tag,
  Space,
  Card,
  Tooltip
} from "antd";
import { 
  ShoppingCartOutlined, 
  HeartOutlined, 
  HeartFilled, 
  ArrowLeftOutlined, 
  CheckOutlined, 
  StarFilled,
  EyeOutlined,
  SafetyCertificateOutlined,
  TruckOutlined,
  UndoOutlined,
  InfoCircleOutlined,
  
  ClockCircleOutlined
} from "@ant-design/icons";
import "./ProductDetail.css";
import LiveTryOnModal from "../../components/Modals/livetryonmodal";

const { Title, Text } = Typography;
const { TabPane } = Tabs;

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [liveTryOnVisible, setLiveTryOnVisible] = useState(false);
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [sizeModalVisible, setSizeModalVisible] = useState(false);
  const [prescriptionModalVisible, setPrescriptionModalVisible] = useState(false);
  const [activeTab, setActiveTab] = useState("description");

  // Selectors
  const { product, loading, error } = useSelector((state) => state.products);
  const cartItems = useSelector((state) => state.cart.items || []);
  const wishlistItems = useSelector((state) => state.wishlist?.products || []);
  const { 
    productReviews, 
    userReview, 
    loading: reviewsLoading 
  } = useSelector((state) => state.review);

  useEffect(() => {
    if (id) {
      dispatch(fetchProductById(id));
      dispatch(getProductReviews(id));
      dispatch(getUserReview(id));
    }
  }, [id, dispatch]);

  useEffect(() => {
    if (product && product.colors && product.colors.length > 0) {
      setSelectedColor(product.colors[0]);
    }
  }, [product]);

  useEffect(() => {
    setSelectedImage(0);
  }, [selectedColor]);

  useEffect(() => {
    dispatch(getWishlist());
  }, [dispatch]);

  const getColorImages = () => {
    return product?.colorImages?.[selectedColor] || product?.images || [];
  };

  const handleAddToCart = () => {
    if (!product) return;
    
    dispatch(addToCart({
      productId: product._id,
      quantity,
      variant: { color: selectedColor }
    }));
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate("/cart");
  };

  const isInWishlist = product && wishlistItems.some(item => item._id === product._id);

  const handleToggleWishlist = () => {
    if (!product?._id) {
      console.error("Invalid product or missing _id:", product);
      return;
    }
    
    const productId = product._id;
    const isInWishlist = wishlistItems.some(item => item._id === productId);
    
    if (isInWishlist) {
      dispatch(removeFromWishlist(productId));
    } else {
      dispatch(addToWishlist(productId));
    }
  };

  const isInCart = product && cartItems.some(item => item.productId === product._id);

  const productImages = getColorImages();
  const productColors = product?.colors || [];
  const productRating = product?.rating || 4;
  const productReviewCount = product?.reviewCount || productReviews?.length || 0;

  // New product specifications
  const frameMaterial = product?.frameMaterial || "Acetate";
  const lensType = product?.lensType || "Single Vision";
  const frameWidth = product?.frameWidth || "140mm";
  const bridgeWidth = product?.bridgeWidth || "18mm";
  const templeLength = product?.templeLength || "145mm";

  if (loading) {
    return (
      <div className="product-detail-loading">
        <Spin size="large" />
        <Text style={{ marginTop: 16, display: 'block', textAlign: 'center' }}>
          Loading product details...
        </Text>
      </div>
    );
  }

  if (error) {
    return (
      <div className="product-detail-error">
        <Alert 
          message="Error Loading Product" 
          description={error} 
          type="error" 
          showIcon 
        />
        <CustomButton 
          variant="secondary" 
          onClick={() => navigate(-1)} 
          style={{ marginTop: 16 }}
        >
          Go Back
        </CustomButton>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="product-not-found">
        <Alert 
          message="Product Not Found" 
          description="The product you're looking for doesn't exist." 
          type="warning" 
          showIcon 
        />
        <CustomButton 
          variant="primary" 
          onClick={() => navigate("/products")} 
          style={{ marginTop: 16 }}
        >
          Browse Products
        </CustomButton>
      </div>
    );
  }

  return (
    <div className="product-detail-page">
      {/* Back Button */}
      <div className="back-button-container">
        <CustomButton 
          variant="text"
          icon={<ArrowLeftOutlined />} 
          onClick={() => navigate(-1)}
          className="back-button"
        >
          Back to Products
        </CustomButton>
      </div>

      {/* Main Product Section */}
      <Row gutter={[48, 32]} className="product-detail-container">
        {/* Product Images */}
        <Col xs={24} lg={12}>
          <div className="product-image-gallery">
            <div className="main-image-container">
              {productImages.length > 0 ? (
                <Image
                  src={productImages[selectedImage]}
                  alt={product.name}
                  className="main-product-image"
                  preview={false}
                />
              ) : (
                <div className="no-image-placeholder">
                  <EyeOutlined style={{ fontSize: 48, marginBottom: 16 }} />
                  <Text>No Image Available</Text>
                </div>
              )}
              
              {/* Badges */}
              <div className="product-badges">
                {product.includesLenses && (
                  <Tag color="green" className="product-badge">
                    <SafetyCertificateOutlined /> Includes Lenses
                  </Tag>
                )}
                {product.discountPercentage && (
                  <Tag color="#ff4d4f" className="product-badge">
                    {product.discountPercentage}% OFF
                  </Tag>
                )}
                {product.isNew && (
                  <Tag color="#1890ff" className="product-badge">
                    NEW
                  </Tag>
                )}
              </div>

              {/* Floating Actions */}
              <div className="floating-actions-detail-page">
                <CustomButton
                  variant="secondary"
                  icon={isInWishlist ? <HeartFilled /> : <HeartOutlined />}
                  onClick={handleToggleWishlist}
                  className={`favorite-btn-detail-page ${isInWishlist ? 'favorited' : ''}`}
                  shape="circle"
                />
              </div>
            </div>
            
            {/* Thumbnails */}
            {productImages.length > 1 && (
              <div className="thumbnail-container">
                {productImages.map((image, index) => (
                  <div 
                    key={index}
                    className={`thumbnail ${selectedImage === index ? 'active' : ''}`}
                    onClick={() => setSelectedImage(index)}
                  >
                    <img src={image} alt={`${product.name} view ${index + 1}`} />
                  </div>
                ))}
              </div>
            )}

            {/* Live Try On Button */}
            <CustomButton
              variant="primary"
              className="detail-live-btn"
              size="large"
              block
              onClick={() => setLiveTryOnVisible(true)}
            >
              <EyeOutlined /> Live Try On
            </CustomButton>
          </div>
        </Col>

        {/* Product Details */}
        <Col xs={24} lg={12}>
          <div className="product-details">
            {/* Product Header */}
            <div className="product-header">
              <Text className="product-category">{product.category}</Text>
              <Title level={1} className="product-name">{product.name}</Title>
              <Text className="product-brand">by {product.brand}</Text>
              
              <div className="product-rating-section">
                <div className="rating-display">
                  <Rate 
                    disabled 
                    value={productRating} 
                    character={<StarFilled />} 
                    className="product-rating-stars"
                  />
                  <Text className="rating-text">{productRating}/5</Text>
                </div>
                <Text className="review-count">({productReviewCount} reviews)</Text>
              </div>
            </div>
            
            {/* Price Section */}
            <div className="product-price-section">
              <div className="price-container">
                <Text className="current-price">ETB {product.price?.toLocaleString()}</Text>
                {product.originalPrice && (
                  <Text className="original-price">ETB {product.originalPrice?.toLocaleString()}</Text>
                )}
              </div>
              {product.discountPercentage && (
                <Text className="savings-text">
                  You save ETB {((product.originalPrice - product.price) * quantity).toLocaleString()}
                </Text>
              )}
            </div>

            <Divider className="custom-divider" />

            {/* Product Specifications */}
            <div className="specifications-section">
              <Title level={4} className="section-main-title">Product Specifications</Title>
              <Row gutter={[16, 16]} className="specs-grid">
                <Col xs={12}>
                  <div className="spec-item">
                    <Text strong className="spec-label">Frame Material</Text>
                    <Text className="spec-value">{frameMaterial}</Text>
                  </div>
                </Col>
                <Col xs={12}>
                  <div className="spec-item">
                    <Text strong className="spec-label">Lens Type</Text>
                    <Text className="spec-value">{lensType}</Text>
                  </div>
                </Col>
                <Col xs={8}>
                  <div className="spec-item">
                    <Text strong className="spec-label">Frame Width</Text>
                    <Text className="spec-value">{frameWidth}</Text>
                  </div>
                </Col>
                <Col xs={8}>
                  <div className="spec-item">
                    <Text strong className="spec-label">Bridge</Text>
                    <Text className="spec-value">{bridgeWidth}</Text>
                  </div>
                </Col>
                <Col xs={8}>
                  <div className="spec-item">
                    <Text strong className="spec-label">Temple</Text>
                    <Text className="spec-value">{templeLength}</Text>
                  </div>
                </Col>
              </Row>
            </div>

            

{/* Color Selection & Quantity - Side by side on large screens */}
<div className="selection-group-row">
  {productColors.length > 0 && (
    <div className="selection-section">
      <Text strong className="section-title">
        Color: <span className="selected-color">{selectedColor}</span>
      </Text>
      <div className="color-options-grid">
        {productColors.map((color) => (
          <Tooltip key={color} title={color}>
            <div
              className={`color-option ${selectedColor === color ? 'selected' : ''}`}
              onClick={() => setSelectedColor(color)}
            >
              <div 
                className="color-swatch"
                style={{ 
                  backgroundColor: color.toLowerCase(),
                  background: color.toLowerCase().includes('gradient') 
                    ? color 
                    : color.toLowerCase()
                }}
              >
                {selectedColor === color && <CheckOutlined />}
              </div>
              <Text className="color-name">{color}</Text>
            </div>
          </Tooltip>
        ))}
      </div>
    </div>
  )}
  
  <div className="selection-section">
    <Text strong className="section-title">Quantity</Text>
    <div className="quantity-controls">
      <InputNumber
        min={1}
        max={10}
        value={quantity}
        onChange={setQuantity}
        className="quantity-input"
        size="large"
        controls={true}
      />
      <Text type="secondary" className="stock-text">
        {product.inStock || 10} available in stock
      </Text>
    </div>
  </div>
</div>

{/* Prescription Options - Side by side on large screens */}
<div className="prescription-options-row">
  <CustomButton 
    variant={product.prescriptionEligible ? "primary" : "default"} 
    disabled={!product.prescriptionEligible}
    onClick={() => setPrescriptionModalVisible(true)}
    className="prescription-btn"
    block
    size="large"
  >
    {product.prescriptionEligible ? "Add Prescription" : "Prescription Not Available"}
  </CustomButton>
  <CustomButton
    variant="outlined"
    onClick={() => setSizeModalVisible(true)}
    className="size-guide-btn"
    block
    size="large"
  >
    Size Guide
  </CustomButton>
</div>

{/* Action Buttons - Side by side on large screens */}
<div className="action-buttons-row">
  <CustomButton 
    variant="primary" 
    size="large" 
    icon={<ShoppingCartOutlined />}
    onClick={handleAddToCart}
    disabled={isInCart}
    className={`add-to-cart-btn ${isInCart ? 'added' : ''}`}
    block
  >
    {isInCart ? 'Added to Cart' : 'Add to Cart'}
  </CustomButton>
  <CustomButton
    variant="secondary"
    size="large" 
    onClick={handleBuyNow}
    className="buy-now-btn"
    block
  >
    Buy Now • ETB {(product.price * quantity).toLocaleString()}
  </CustomButton>
</div>

            {/* Trust Features */}
            <Card className="trust-features-card" bordered={false}>
              <Row gutter={[16, 16]}>
                <Col xs={12}>
                  <div className="trust-feature">
                    <TruckOutlined className="feature-icon" />
                    <div>
                      <Text strong>Free Shipping</Text>
                      
                    </div>
                  </div>
                </Col>
                <Col xs={12}>
                  <div className="trust-feature">
                    <UndoOutlined className="feature-icon" />
                    <div>
                      <Text strong>Free Returns</Text>
                      <Text type="secondary">30-day trial</Text>
                    </div>
                  </div>
                </Col>
                <Col xs={12}>
                  <div className="trust-feature">
                    <SafetyCertificateOutlined className="feature-icon" />
                    <div>
                      <Text strong>1-Year Warranty</Text>
                      <Text type="secondary">Full coverage</Text>
                    </div>
                  </div>
                </Col>
                <Col xs={12}>
                  <div className="trust-feature">
                    <ClockCircleOutlined className="feature-icon" />
                    <div>
                      <Text strong>Same Day Dispatch</Text>
                      <Text type="secondary">Order by 2PM</Text>
                    </div>
                  </div>
                </Col>
              </Row>
            </Card>
          </div>
        </Col>
      </Row>

      {/* Product Description & Reviews Tabs */}
      <div className="product-tabs-section">
        <Tabs 
          activeKey={activeTab} 
          onChange={setActiveTab}
          className="product-detail-tabs"
        >
          <TabPane tab="Product Details" key="description">
            <div className="tab-content">
              <Title level={3}>Product Description</Title>
              <Text className="product-description">
                {product.description || "No description available for this product."}
              </Text>
              
              {/* Enhanced Specifications */}
              <div className="detailed-specs">
                <Title level={4} style={{ marginTop: 32 }}>Detailed Specifications</Title>
                <Row gutter={[32, 16]}>
                  <Col xs={24} md={12}>
                    <Card size="small" title="Frame Details" className="spec-card">
                      <List
                        size="small"
                        dataSource={[
                          `Material: ${frameMaterial}`,
                          `Width: ${frameWidth}`,
                          `Bridge: ${bridgeWidth}`,
                          `Temple: ${templeLength}`,
                          `Style: ${product.frameStyle || 'Full Rim'}`,
                          `Fit: ${product.frameFit || 'Universal'}`
                        ]}
                        renderItem={item => (
                          <List.Item className="spec-list-item">
                            <Text>{item}</Text>
                          </List.Item>
                        )}
                      />
                    </Card>
                  </Col>
                  <Col xs={24} md={12}>
                    <Card size="small" title="Lens Information" className="spec-card">
                      <List
                        size="small"
                        dataSource={[
                          `Type: ${lensType}`,
                          `Material: ${product.lensMaterial || 'CR-39'}`,
                          `Coating: ${product.lensCoating || 'Anti-Reflective'}`,
                          `Prescription Ready: ${product.prescriptionEligible ? 'Yes' : 'No'}`
                        ]}
                        renderItem={item => (
                          <List.Item className="spec-list-item">
                            <Text>{item}</Text>
                          </List.Item>
                        )}
                      />
                    </Card>
                  </Col>
                </Row>
              </div>

              {product.features && product.features.length > 0 && (
                <>
                  <Title level={4} style={{ marginTop: 32 }}>Key Features</Title>
                  <List
                    size="large"
                    dataSource={product.features}
                    renderItem={item => (
                      <List.Item className="feature-item">
                        <CheckOutlined className="feature-icon" />
                        <Text>{item}</Text>
                      </List.Item>
                    )}
                  />
                </>
              )}
            </div>
          </TabPane>
          
          <TabPane tab={`Reviews & Ratings (${productReviewCount})`} key="reviews">
            <div className="tab-content">
              <ReviewSection 
                productId={id}
                reviews={productReviews}
                userReview={userReview}
                loading={reviewsLoading}
              />
            </div>
          </TabPane>
          
          <TabPane tab="Shipping & Returns" key="shipping">
            <div className="tab-content">
              <Title level={3}>Shipping Information</Title>
              <List
                size="large"
                dataSource={[
                  'Free standard shipping ',
                  'Delivery within 3-5 business days',
                  'International shipping available',
                  'Same day dispatch for orders before 2PM'
                ]}
                renderItem={item => (
                  <List.Item>
                    <TruckOutlined style={{ color: '#10b981', marginRight: 12 }} />
                    {item}
                  </List.Item>
                )}
              />
              
              <Title level={4} style={{ marginTop: 24 }}>Return Policy</Title>
              <List
                size="large"
                dataSource={[
                  '30-day free returns for unworn glasses',
                  'Items must be in original condition with tags',
                  'Prescription items are final sale once lenses are cut',
                  'Free return shipping label included',
                  'Refund processed within 5-7 business days'
                ]}
                renderItem={item => (
                  <List.Item>
                    <UndoOutlined style={{ color: '#10b981', marginRight: 12 }} />
                    {item}
                  </List.Item>
                )}
              />
            </div>
          </TabPane>
        </Tabs>
      </div>

      {/* Modals */}
      <PrescriptionModal
        visible={prescriptionModalVisible}
        onClose={() => setPrescriptionModalVisible(false)}
        product={product}
      />
      
      <SizeGuideModal
        visible={sizeModalVisible}
        onClose={() => setSizeModalVisible(false)}
      />
      
      <LiveTryOnModal
        visible={liveTryOnVisible}
        onClose={() => setLiveTryOnVisible(false)}
        productImage={productImages[0]}
      />
    </div>
  );
};

export default ProductDetailPage;