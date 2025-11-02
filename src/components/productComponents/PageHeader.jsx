import React from 'react';
import { Typography, Breadcrumb } from 'antd';
import { HomeOutlined } from '@ant-design/icons';
import "./PageHeader.css"

const { Title, Text } = Typography;

const PageHeader = ({ category, totalProducts }) => {
  return (
    <div className="page-header">
      <Breadcrumb className="breadcrumb">
        <Breadcrumb.Item href="/">
          <HomeOutlined />
        </Breadcrumb.Item>
       
        {category && (
          <Breadcrumb.Item>
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </Breadcrumb.Item>
        )}
      </Breadcrumb>
      
      <div className="header-content">
        <Title level={1} className="page-title">
          {category?.charAt(0).toUpperCase() + category?.slice(1) || "All Frames"}
        </Title>
        <Text className="product-count">
          {totalProducts} {totalProducts === 1 ? 'frame' : 'frames'} available
        </Text>
      </div>
    </div>
  );
};

export default PageHeader;