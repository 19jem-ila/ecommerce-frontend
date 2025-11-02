import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchProductsByCategory,
  setFilters,
  setCurrentPage,
  clearFilters,
} from "../../store/slices/productSlice";

import {
  addToWishlist,
  removeFromWishlist,
} from "../../store/slices/whishListSlice";

import PageHeader from "../../components/productComponents/PageHeader";
import FilterControls from "../../components/productComponents/FilterControl";
import FilterSidebar from "../../components/productComponents/FilterSidebar";
import ProductGrid from "../../components/productComponents/ProductGrid";
import QuickViewModal from "../../components/productComponents/QuickViewModal";
import "./ProductList.css";

const ProductListPage = () => {
  const { category } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { products, loading, pagination, filters } = useSelector(
    (state) => state.products
  );
  const wishlistItems = useSelector((state) => state.wishlist?.products || []);

  // -------------------- State --------------------
  const [showFilters, setShowFilters] = useState(false); // desktop sidebar
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false); // mobile modal
  const [isMobile, setIsMobile] = useState(window.innerWidth < 992);
  const [quickViewVisible, setQuickViewVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedColors, setSelectedColors] = useState({});
  const [selectedImages, setSelectedImages] = useState({});
  const [favorites, setFavorites] = useState(new Set());

  // -------------------- Handle screen resize --------------------
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 992);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // -------------------- Fetch products --------------------
  useEffect(() => {
    dispatch(fetchProductsByCategory({ category, params: { page: 1 } }));
  }, [category, dispatch]);

  useEffect(() => {
    dispatch(
      fetchProductsByCategory({
        category,
        params: { page: pagination.currentPage, ...filters },
      })
    );
  }, [filters, pagination.currentPage, category, dispatch]);

  // -------------------- Handlers --------------------
  // Filter button: single handler for desktop & mobile
  const handleFilterClick = () => {
    if (isMobile) {
      setIsFilterModalVisible(true);
    } else {
      setShowFilters((prev) => !prev);
    }
  };

  const handleMobileModalClose = () => {
    setIsFilterModalVisible(false);
  };

  const handleFilterChange = (key, value) => {
    dispatch(setFilters({ [key]: value }));
  };

  const handlePriceRangeChange = (value) => {
    dispatch(setFilters({ minPrice: value[0], maxPrice: value[1] }));
  };

  const handleClearFilters = () => {
    dispatch(clearFilters());
  };

  const handlePageChange = (page) => {
    dispatch(setCurrentPage(page));
    window.scrollTo(0, 0);
  };

  const goToProductDetail = (productId) => {
    navigate(`/product/${productId}`);
  };

  const toggleFavorite = (product, e) => {
    e.stopPropagation();
    if (wishlistItems.some((item) => item._id === product._id)) {
      dispatch(removeFromWishlist(product._id));
    } else {
      dispatch(addToWishlist(product));
    }
  };

  const showQuickView = (product, e) => {
    e?.stopPropagation();
    setSelectedProduct(product);
    setSelectedColors({ ...selectedColors, [product._id]: product.colors?.[0] || "" });
    setSelectedImages({ ...selectedImages, [product._id]: product.images?.[0] || "" });
    setQuickViewVisible(true);
  };

  const handleColorSelect = (productId, color, e, product) => {
    e?.stopPropagation();
    setSelectedColors({ ...selectedColors, [productId]: color });

    if (product) {
      const colorIndex = product.colors?.indexOf(color);
      setSelectedImages({
        ...selectedImages,
        [productId]: product.images?.[colorIndex] || product.images[0],
      });
    }
  };

  // -------------------- Derived data --------------------
  const brands = [...new Set(products.map((p) => p.brand))].filter(Boolean);

  // -------------------- Render --------------------
  return (
    <div className="product-list-page">
      <PageHeader category={category} totalProducts={pagination.total} />

      {/* Filter Controls with single button */}
      <FilterControls
        showFilters={showFilters}
        onToggleFilters={handleFilterClick} // ✅ single responsive handler
        onSortChange={(value) => handleFilterChange("sortBy", value)}
      />

      <div className="content-wrapper">
        {/* Desktop sidebar */}
        {showFilters && !isMobile && (
          <FilterSidebar
            brands={brands}
            filters={filters}
            onFilterChange={handleFilterChange}
            onPriceRangeChange={handlePriceRangeChange}
            onClearFilters={handleClearFilters}
          />
        )}

        {/* Product grid */}
        <div className="products-container">
          <ProductGrid
            products={products}
            loading={loading}
            pagination={pagination}
            onPageChange={handlePageChange}
            onToggleFavorite={toggleFavorite}
            onShowQuickView={showQuickView}
            onColorSelect={handleColorSelect}
            onProductClick={goToProductDetail}
            sidebarVisible={showFilters || isFilterModalVisible}
            favorites={favorites}
            selectedColors={selectedColors}
            selectedImages={selectedImages}
          />
        </div>
      </div>

      {/* Mobile modal */}
      {isMobile && (
        <FilterSidebar
          brands={brands}
          filters={filters}
          onFilterChange={handleFilterChange}
          onPriceRangeChange={handlePriceRangeChange}
          onClearFilters={handleClearFilters}
          isMobileModalVisible={isFilterModalVisible}
          onMobileModalClose={handleMobileModalClose}
        />
      )}

      {/* Quick View */}
      <QuickViewModal
        visible={quickViewVisible}
        product={selectedProduct}
        selectedColor={selectedProduct ? selectedColors[selectedProduct._id] : ""}
        selectedImage={selectedProduct ? selectedImages[selectedProduct._id] : ""}
        onClose={() => setQuickViewVisible(false)}
        onColorSelect={(productId, color) => {
          setSelectedColors({ ...selectedColors, [productId]: color });
          const product = products.find(p => p._id === productId);
          if (product) {
            const colorIndex = product.colors?.indexOf(color);
            setSelectedImages({
              ...selectedImages,
              [productId]: product.images?.[colorIndex] || product.images[0],
            });
          }
        }}
        onProductDetailClick={goToProductDetail}
      />
    </div>
  );
};

export default ProductListPage;
