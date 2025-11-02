import React from 'react';
import { Card, Typography, Rate, Tooltip } from 'antd';
import { EyeOutlined, HeartOutlined, HeartFilled } from '@ant-design/icons';
import CustomButton from '../ui/CustomButton';
import "./productCard.css"

const { Title, Text } = Typography;

const ProductCard = ({ 
  product, 
  isFavorite, 
  selectedColor, 
  selectedImage,
  onToggleFavorite, 
  onShowQuickView, 
  onColorSelect, 
  onProductClick 
}) => {
  return (
    <Card
      className="product-card-inlisting-page"
      cover={
        <div
          className="product-image-container"
          onMouseLeave={() => onColorSelect(product._id, product.colors?.[0], null, product)}
        >
          <img
            alt={product.name}
            src={selectedImage || product.images[0]}
            className="product-image main-image"
          />
          {product.images[1] && (
            <img
              alt={product.name}
              src={product.images[1]}
              className="product-image hover-image"
            />
          )}

          {/* Minimal Prescription Indicator */}
          {product.prescriptionEligible && (
            <Tooltip title="Prescription Eligible">
              <div className="prescription-indicator">
                <div className="indicator-icon">RX</div>
              </div>
            </Tooltip>
          )}

          {!product.inStock && (
            <div className="stock-badge">
              <span className="badge-text">Out of Stock</span>
            </div>
          )}

          <div className="product-actions">
            <Tooltip title="Quick View">
              <CustomButton
                variant="secondary"
                shape="circle"
                icon={<EyeOutlined />}
                onClick={(e) => onShowQuickView(product, e)}
                className="action-btn"
              />
            </Tooltip>
            <Tooltip
              title={isFavorite ? "Remove from favorites" : "Add to favorites"}
            >
              <CustomButton
                variant="secondary"
                shape="circle"
                icon={isFavorite ? <HeartFilled /> : <HeartOutlined />}
                className={`action-btn ${isFavorite ? "favorited" : ""}`}
                onClick={(e) => onToggleFavorite(product._id, e)}
              />
            </Tooltip>
          </div>
          
          <CustomButton 
            className="try-on-btn" 
            variant="primary"
            size="sm"
          >
            Live Try On
          </CustomButton>
        </div>
      }
      onClick={() => onProductClick(product._id)}
    >
      <div className="product-details">
        <Text className="product-brand">{product.brand}</Text>
        <Title level={5} className="product-name-inlisting-page">
          {product.name}
        </Title>
        <Text strong className="product-price">
          {product.price} ETB
        </Text>

        {product.colors && product.colors.length > 0 && (
          <div className="color-swatches">
            <Text className="color-label">Available Colors</Text>
            <div className="swatches-container">
              {product.colors.map((color) => (
                <Tooltip title={color} key={color}>
                  <div
                    className={`color-swatch ${selectedColor === color ? "selected" : ""}`}
                    style={{ backgroundColor: color.toLowerCase() }}
                    onClick={(e) => onColorSelect(product._id, color, e, product)}
                  />
                </Tooltip>
              ))}
            </div>
          </div>
        )}
{/* 
        <div className="product-rating">
          <Rate 
            disabled 
            defaultValue={product.rating || 4} 
            size="small" 
            className="rating-stars"
          />
          <Text type="secondary" className="review-count">({product.reviewCount || 0})</Text>
        </div> */}

        <div className="stock-status">
          <div className={`status-indicator ${product.inStock ? 'in-stock' : 'out-of-stock'}`} />
          <Text className="status-text">
            {product.inStock ? `In Stock` : "Out of Stock"}
          </Text>
        </div>
      </div>
    </Card>
  );
};

export default ProductCard;