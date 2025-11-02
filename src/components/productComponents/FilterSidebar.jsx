import React from 'react';
import { Typography, Slider, Checkbox, Button, Modal } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import "./filtersidebar.css";

const { Title, Text } = Typography;

const FilterSidebar = ({ 
  brands = [], 
  filters, 
  onFilterChange, 
  onPriceRangeChange, 
  onClearFilters,
  isMobileModalVisible,
  onMobileModalClose
}) => {
  // Safe price values for slider
  const minPrice = filters.minPrice ?? 0;
  const maxPrice = filters.maxPrice ?? 1000;

  // Sidebar content with mode
  const renderSidebarContent = (mode = "desktop") => (
    <>
      {/* Header */}
      <div className="sidebar-header">
        <Title level={4} className="sidebar-title">Filters</Title>
        
        {/* Desktop: optional clear icon, Mobile: close icon */}
        {mode === "mobile" ? (
          <Button 
            type="text" 
            icon={<CloseOutlined />} 
            className="close-filters" 
            onClick={onMobileModalClose}
          />
        ) : null}
      </div>

      {/* Brand Filter */}
      <div className="filter-category">
        <Text className="category-label">BRAND</Text>
        <div className="filter-options">
          {brands.map((brand) => (
            <div key={brand} className="filter-checkbox">
              <Checkbox
                checked={filters.brand.includes(brand)}
                onChange={(e) => {
                  const newBrands = e.target.checked
                    ? [...filters.brand, brand]
                    : filters.brand.filter((b) => b !== brand);
                  onFilterChange('brand', newBrands);
                }}
              >
                <span className="brand-name">{brand}</span>
              </Checkbox>
            </div>
          ))}
        </div>
      </div>

      {/* Price Filter */}
      <div className="filter-category">
        <Text className="category-label">PRICE RANGE</Text>
        <div className="filter-options">
          <Slider
            range
            min={0}
            max={1000}
            value={[minPrice, maxPrice]}
            onChange={(value) => onPriceRangeChange(value)}
            className="price-slider"
            tooltip={{ formatter: (value) => `$${value}` }}
          />
          <div className="price-range-display">
            <Text className="price-text">${minPrice} - ${maxPrice}</Text>
          </div>
        </div>
      </div>

      {/* Features Filter */}
      <div className="filter-category">
        <Text className="category-label">FEATURES</Text>
        <div className="filter-options">
          <Checkbox
            checked={filters.prescription}
            onChange={(e) => onFilterChange('prescription', e.target.checked)}
            className="feature-checkbox"
          >
            Prescription Eligible
          </Checkbox>
        </div>
      </div>

      {/* Clear Filters */}
      <Button 
        onClick={onClearFilters} 
        className="clear-filters"
        size="large"
      >
        Clear All Filters
      </Button>
    </>
  );

  // Mobile view → show modal
  if (isMobileModalVisible) {
    return (
      <Modal
        title={null} // remove duplicate title, since we have header inside
        open={isMobileModalVisible}
        onCancel={onMobileModalClose}
        footer={null}
        className="filters-modal"
        closeIcon={null} // handled by header button
        width="100%"
        style={{ top: 0 }}
        bodyStyle={{ padding: 0 }}
      >
        <div className="mobile-filters-content">
          {renderSidebarContent("mobile")}
        </div>
      </Modal>
    );
  }

  // Desktop view → show sidebar
  return (
    <div className="filters-sidebar desktop-sidebar">
      {renderSidebarContent("desktop")}
    </div>
  );
};

export default FilterSidebar;
