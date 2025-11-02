import React from 'react';
import { Row, Col, Spin, Pagination, Typography } from 'antd';
import { CameraOutlined } from '@ant-design/icons';
import ProductCard from './ProductCard';
import "./productGrid.css"
import minalogo from "../../assets/logo/Mina_optics-logo-2-removebg-preview.png"

const { Title, Text } = Typography;

const ProductGrid = ({ 
  products, 
  loading, 
  pagination, 
  favorites,
  selectedColors,
  selectedImages,
  onPageChange, 
  onToggleFavorite, 
  onShowQuickView, 
  onColorSelect, 
  onProductClick,
  sidebarVisible // Add this new prop
}) => {
  if (loading) {
    return (
      <div className="product-detail-loading">
        <div className="glasses-loading">
          <div className="glasses-frame">
            <div className="lens left-lens"></div>
            <div className="bridge"></div>
            <div className="lens right-lens"></div>
          </div>
          <Text className="loading-text">Finding your perfect fit...</Text>
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="no-products">
        <CameraOutlined style={{ fontSize: "48px", marginBottom: "16px" }} />
        <Title level={4}>No products found</Title>
        <Text>Try adjusting your filters or search term</Text>
      </div>
    );
  }

  return (
    <>
      <Row gutter={[24, 24]} className={sidebarVisible ? 'sidebar-visible' : 'sidebar-hidden'}>
        {products.map((product) => (
          <Col 
            key={product._id} 
            xs={24} 
            sm={12} 
            md={sidebarVisible ? 12 : 8} // Adjust medium screens
            lg={sidebarVisible ? 8 : 6}  // Adjust large screens
            xl={sidebarVisible ? 8 : 6}  // Adjust extra large screens
          >
            <ProductCard
              product={product}
              isFavorite={favorites.has(product._id)}
              selectedColor={selectedColors[product._id]}
              selectedImage={selectedImages[product._id]}
              onToggleFavorite={onToggleFavorite}
              onShowQuickView={onShowQuickView}
              onColorSelect={onColorSelect}
              onProductClick={onProductClick}
            />
          </Col>
        ))}
      </Row>

      <div className="pagination-container">
        <Pagination
          current={pagination.currentPage}
          total={pagination.total}
          pageSize={12}
          onChange={onPageChange}
          showSizeChanger={false}
        />
      </div>
    </>
  );
};

export default ProductGrid;