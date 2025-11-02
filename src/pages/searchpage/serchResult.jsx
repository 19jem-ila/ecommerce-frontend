import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { 
  Row, 
  Col, 
  Typography, 
  Spin, 
  Empty, 
  Pagination,
  Card,
  Tag,
  Space,
  Divider,
  Alert,
  Button,
  Grid
} from "antd";
import { 
  SearchOutlined, 
  FilterOutlined,
  SortAscendingOutlined,
  EyeOutlined 
} from "@ant-design/icons";
import { productService } from "../../services/productServices";
import ProductCard from "../../components/productComponents/ProductCard"; // Adjust path as needed
import "./serch.css";

const { Title, Text } = Typography;
const { useBreakpoint } = Grid;

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({});
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState("relevance");
  const [filters, setFilters] = useState({
    inStock: false,
    prescriptionEligible: false,
    category: ""
  });
  
  const screens = useBreakpoint();
  const limit = 20;

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!query) return;
      try {
        setLoading(true);
        const data = await productService.searchProducts(query, limit, page);
        setProducts(data.products || []);
        setPagination(data.pagination || {});
      } catch (err) {
        console.error("Search failed:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [query, page]);

  // Mock favorite functionality for ProductCard
  const [favorites, setFavorites] = useState({});
  const [selectedColors, setSelectedColors] = useState({});
  const [selectedImages, setSelectedImages] = useState({});

  const handleToggleFavorite = (productId, e) => {
    if (e) e.stopPropagation();
    setFavorites(prev => ({
      ...prev,
      [productId]: !prev[productId]
    }));
  };

  const handleColorSelect = (productId, color, e, product) => {
    if (e) e.stopPropagation();
    setSelectedColors(prev => ({
      ...prev,
      [productId]: color
    }));
    
    // Update image based on color selection
    if (product?.colorImages?.[color]) {
      setSelectedImages(prev => ({
        ...prev,
        [productId]: product.colorImages[color][0]
      }));
    }
  };

  const handleProductClick = (productId) => {
    // Navigate to product detail page
    window.location.href = `/product/${productId}`;
  };

  const handleShowQuickView = (product, e) => {
    if (e) e.stopPropagation();
    // Implement quick view modal
    console.log("Quick view:", product);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!query) {
    return (
      <div className="search-results-container">
        <div className="search-empty-state">
          <Empty 
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={
              <Text type="secondary">
                Please enter a search keyword to find products.
              </Text>
            }
          />
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="search-results-container">
        <div className="search-loading">
          <Spin size="large" />
          <Text className="loading-text">Searching for "{query}"...</Text>
        </div>
      </div>
    );
  }

  return (
    <div className="search-results-page">
     

      {/* Results Section */}
      <div className="search-results-container">
        {products.length === 0 ? (
          <div className="no-results-section">
            <Empty 
              description={
                <Space direction="vertical" size="middle">
                  <Text strong>No products found for "{query}"</Text>
                  <Text type="secondary">
                    Try adjusting your search terms or browse our categories
                  </Text>
                  <Button type="primary" onClick={() => window.location.href = '/home'}>
                    Browse All Products
                  </Button>
                </Space>
              }
            />
          </div>
        ) : (
          <>
            {/* Results Grid */}
            <div className="results-section">
              <Row gutter={[24, 24]}>
                {products.map((product) => (
                  <Col 
                    key={product._id} 
                    xs={24}
                    sm={12}
                    md={8}
                    lg={6}
                    xl={6}
                  >
                    <ProductCard
                      product={product}
                      isFavorite={favorites[product._id]}
                      selectedColor={selectedColors[product._id]}
                      selectedImage={selectedImages[product._id]}
                      onToggleFavorite={handleToggleFavorite}
                      onShowQuickView={handleShowQuickView}
                      onColorSelect={handleColorSelect}
                      onProductClick={handleProductClick}
                    />
                  </Col>
                ))}
              </Row>
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="pagination-section">
                <Divider />
                <div className="pagination-container">
                  <Pagination
                    current={page}
                    total={pagination.totalItems || 0}
                    pageSize={limit}
                    onChange={handlePageChange}
                    showSizeChanger={false}
                    showQuickJumper={screens.md}
                    showTotal={(total, range) => 
                      `${range[0]}-${range[1]} of ${total} items`
                    }
                    className="search-pagination"
                  />
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default SearchResults;