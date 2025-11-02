import React, { useState } from 'react';
import { Button, Radio, Modal } from 'antd';
import { FilterOutlined, UpOutlined, DownOutlined } from '@ant-design/icons';
import "./filterControl.css"

const FilterControls = ({ 
  showFilters, 
  onToggleFilters, 
  onSortChange 
}) => {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [mobileSortVisible, setMobileSortVisible] = useState(false);
  const [selectedSort, setSelectedSort] = useState("createdAt");

  const handleSortChange = (value) => {
    setSelectedSort(value);
    onSortChange(value);
    setDropdownVisible(false);
    setMobileSortVisible(false);
  };

  const sortOptions = [
    { value: "createdAt", label: "Newest" },
    { value: "priceAsc", label: "Price: Low to High" },
    { value: "priceDesc", label: "Price: High to Low" },
    { value: "name", label: "Name A-Z" },
    { value: "rating", label: "Highest Rated" }
  ];

  const selectedLabel = sortOptions.find(opt => opt.value === selectedSort)?.label || "Newest";

  return (
    <>
      <div className="controls-container">
        <div className="controls-row">
          <Button
            icon={<FilterOutlined />}
            onClick={onToggleFilters}
            className={`filter-toggle ${showFilters ? 'active' : ''}`}
          >
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </Button>
          
          {/* Desktop Sort */}
          <div className="desktop-sort-container">
            <div 
              className="sort-trigger"
              onClick={() => setDropdownVisible(!dropdownVisible)}
            >
              <span className="sort-label">
                {selectedSort === "createdAt" ? "Sort by" : selectedLabel}
              </span>
              {dropdownVisible ? <UpOutlined /> : <DownOutlined />}
            </div>
            
            {dropdownVisible && (
              <div className="sort-dropdown-panel">
                <Radio.Group 
                  value={selectedSort}
                  onChange={(e) => handleSortChange(e.target.value)}
                  className="sort-radio-group"
                >
                  {sortOptions.map(option => (
                    <div key={option.value} className="radio-option">
                      <Radio value={option.value}>{option.label}</Radio>
                    </div>
                  ))}
                </Radio.Group>
              </div>
            )}
          </div>

          {/* Mobile Sort Trigger */}
          <div 
            className="mobile-sort-trigger"
            onClick={() => setMobileSortVisible(true)}
          >
            <span>{selectedSort === "createdAt" ? "Sort by" : selectedLabel}</span>
            <DownOutlined />
          </div>
        </div>
      </div>

      {/* Mobile Sort Modal */}
      <Modal
        title="Sort by"
        open={mobileSortVisible}
        onCancel={() => setMobileSortVisible(false)}
        footer={null}
        className="sort-modal"
        closeIcon={<span className="modal-close">×</span>}
      >
        <Radio.Group 
          value={selectedSort}
          onChange={(e) => handleSortChange(e.target.value)}
          className="mobile-sort-radio-group"
        >
          {sortOptions.map(option => (
            <div key={option.value} className="mobile-radio-option">
              <Radio value={option.value}>{option.label}</Radio>
            </div>
          ))}
        </Radio.Group>
      </Modal>
    </>
  );
};

export default FilterControls;