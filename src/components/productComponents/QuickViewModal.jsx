import React from 'react';
import { Modal, Row, Col, Typography, Rate, Divider, Space } from 'antd';
import { CheckCircleOutlined, ZoomInOutlined } from '@ant-design/icons';
import "./quickModal.css"
import CustomButton from "../ui/CustomButton"

const { Title, Text } = Typography;

const QuickViewModal = ({ 
  visible, 
  product, 
  selectedColor, 
  selectedImage,
  onClose, 
  onColorSelect, 
  onProductDetailClick 
}) => {
  const [currentImageIndex, setCurrentImageIndex] = React.useState(0);
  const [zoomMode, setZoomMode] = React.useState(false);

  if (!product) return null;

  // Get the correct image based on selected color or current index
  const displayImage = selectedImage && currentImageIndex === 0 
  ? selectedImage 
  : product.images[currentImageIndex] || product.images[0];

  const handleColorSelect = (color) => {
    onColorSelect(product._id, color);
    setCurrentImageIndex(0); // Reset to first image when color changes
  };

  const nextImage = () => {
    onColorSelect(product._id, null); // Clear selected image
    setCurrentImageIndex((prev) => (prev + 1) % product.images.length);
  };
  
  const prevImage = () => {
    onColorSelect(product._id, null); // Clear selected image
    setCurrentImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length);
  };

  return (
    <Modal
      title={null}
      visible={visible}
      onCancel={onClose}
      footer={null}
      width={900}
      className="quick-view-modal"
      closeIcon={<span className="modal-close-icon">×</span>}
    >
      <div className="modal-content">
        <Row gutter={32}>
          <Col span={12}>
            <div className="modal-image-section">
              <div className="image-container">
                <img
                  alt={product.name}
                  src={displayImage}
                  className={`modal-product-image ${zoomMode ? 'zoomed' : ''}`}
                  onClick={() => setZoomMode(!zoomMode)}
                />
                
                {product.images.length > 1 && (
                  <div className="image-navigation">
                    <button className="nav-btn prev-btn" onClick={prevImage}>
                      ‹
                    </button>
                    <button className="nav-btn next-btn" onClick={nextImage}>
                      ›
                    </button>
                  </div>
                )}
                
                <button 
                  className="zoom-btn"
                  onClick={() => setZoomMode(!zoomMode)}
                >
                  <ZoomInOutlined />
                </button>
                
                <div className="image-counter">
                  {currentImageIndex + 1} / {product.images.length}
                </div>
              </div>

              {product.colors?.length > 0 && (
                <div className="modal-color-section">
                  <Text className="color-section-label">Select Color</Text>
                  <div className="modal-color-swatches">
                    {product.colors.map((color) => (
                      <div
                        key={color}
                        className={`color-swatch ${selectedColor === color ? "selected" : ""}`}
                        style={{ backgroundColor: color.toLowerCase() }}
                        onClick={() => handleColorSelect(color)}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Col>
          <Col span={12}>
            <div className="modal-details-section">
              <div className="modal-header">
                <div> <Text className="modal-brand">{product.brand}</Text>
                <Title level={4} className="modal-title">{product.name}</Title>
                <Text strong className="modal-price">{product.price} ETB</Text></div>
               <div> {product.prescriptionEligible && (
                  <div className="prescription-badge-modal">
                    <CheckCircleOutlined />
                    <span>Prescription Eligible</span>
                  </div>
                )}</div>
                
               
              </div>

              <div className="modal-rating-section">
                <Rate disabled defaultValue={product.rating || 4} className="rating-stars" />
                <Text className="review-count">({product.reviewCount || 0} reviews)</Text>
              </div>

              <Divider className="modal-divider" />

             
              <div className="modal-specs-section">
                <Space direction="vertical" size="middle" className="specs-list">
                  <div className="spec-item">
                    <div className="spec-content">
                      <Text strong>Frame Material</Text>
                      <Text className="spec-value">{product.frameMaterial || "Premium Acetate"}</Text>
                    </div>
                  </div>
                  <div className="spec-item">
                    <div className="spec-content">
                      <Text strong>Lens Type</Text>
                      <Text className="spec-value">{product.lensType || "Standard CR-39"}</Text>
                    </div>
                  </div>
                  <div className="spec-item">
                    <div className="spec-content">
                      <Text strong>Frame Width</Text>
                      <Text className="spec-value">{product.frameWidth || "140mm"}</Text>
                    </div>
                  </div>
                  <div className="spec-item">
                    <div className="spec-content">
                      <Text strong>Availability</Text>
                      <Text className={`spec-value ${product.inStock ? 'in-stock' : 'out-of-stock'}`}>
                        {product.inStock ? `In Stock (${product.stockQuantity} available)` : "Out of Stock"}
                      </Text>
                    </div>
                  </div>
                </Space>
              </div>

              <Divider className="modal-divider" />

              <div className="modal-actions">
                <CustomButton
                  variant="primary"
                  size="lg"
                  block
                  onClick={() => {
                    onClose();
                    onProductDetailClick(product._id);
                  }}
                  className="view-details-btn"
                >
                  View Full Details
                </CustomButton>
               
                
                
              </div>
            </div>
          </Col>
        </Row>
      </div>
    </Modal>
  );
};

export default QuickViewModal;