import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUserOrders } from "../../store/slices/orderSlice";
import { Table, Typography, Button, Spin, Space, Tag, message, Card, Row, Col, Statistic } from "antd";
import { useNavigate } from "react-router-dom";
import { 
  ShoppingOutlined, 
  CheckCircleOutlined, 
  ClockCircleOutlined, 
  CloseCircleOutlined,
  EyeOutlined,
  RocketOutlined,
  FileTextOutlined
} from "@ant-design/icons";

const { Title, Text } = Typography;

const OrderHistoryPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.auth);
  const { userOrders, loading, error, pagination } = useSelector((state) => state.orders);

  useEffect(() => {
    if (!user) {
      message.warning("You need to log in to view your orders.");
      return navigate("/login");
    }
    dispatch(getUserOrders({ page: 1, limit: 20 }));
  }, [dispatch, user, navigate]);

  // Calculate order statistics
  const orderStats = {
    total: userOrders?.length || 0,
    delivered: userOrders?.filter(order => order.orderStatus === 'delivered')?.length || 0,
    pending: userOrders?.filter(order => order.orderStatus === 'pending')?.length || 0,
    cancelled: userOrders?.filter(order => order.orderStatus === 'cancelled')?.length || 0,
  };

  const columns = [
    {
      title: "ORDER ID",
      dataIndex: "_id",
      key: "_id",
      render: (text) => (
        <Text strong style={{ fontFamily: 'monospace', color: '#2e7d32' }}>
          #{text.slice(-8).toUpperCase()}
        </Text>
      ),
      width: 120,
    },
    {
      title: "DATE",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (text) => (
        <Space direction="vertical" size={0}>
          <Text strong style={{ color: '#1b5e20' }}>
            {new Date(text).toLocaleDateString()}
          </Text>
          <Text style={{ color: '#81c784', fontSize: '12px' }}>
            {new Date(text).toLocaleTimeString()}
          </Text>
        </Space>
      ),
      width: 130,
    },
    {
      title: "TOTAL AMOUNT",
      dataIndex: "total",
      key: "total",
      render: (amount) => (
        <Text strong style={{ color: '#1b5e20', fontSize: '15px', fontWeight: 600 }}>
          ETB {amount.toFixed(2)}
        </Text>
      ),
      align: 'right',
      width: 120,
    },
    {
      title: "STATUS",
      dataIndex: "orderStatus",
      key: "orderStatus",
      render: (status) => {
        const statusConfig = {
          pending: { color: 'rgb(212, 131, 9)', icon: <ClockCircleOutlined />, text: 'PENDING' },
          processing: { color: '#0288d1', icon: <RocketOutlined />, text: 'PROCESSING' },
          shipped: { color: '#7b1fa2', icon: <RocketOutlined />, text: 'SHIPPED' },
          delivered: { color: '66bb6a', icon: <CheckCircleOutlined />, text: 'DELIVERED' },
          cancelled: { color: 'rgb(240, 119, 119)', icon: <CloseCircleOutlined />, text: 'CANCELLED' },
        };
        
        const config = statusConfig[status] || statusConfig.pending;
        
        return (
          <Tag 
            color={config.color} 
            style={{ 
              padding: '6px 12px', 
              borderRadius: '6px',
              border: 'none',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              minWidth: '120px',
              justifyContent: 'center',
              color: 'white',
              fontSize: '12px'
            }}
            icon={config.icon}
          >
            {config.text}
          </Tag>
        );
      },
      width: 140,
    },
    
  ];

  if (loading) {
    return (
      <div style={{ 
        textAlign: "center", 
        padding: 80,
        background: 'linear-gradient(135deg, #f1f8e9 0%, #e8f5e8 100%)',
        minHeight: '100vh'
      }}>
        <Spin size="large" style={{ marginBottom: 16, color: '#4caf50' }} />
        <Text style={{ 
          fontSize: '16px', 
          color: '#2e7d32',
          display: 'block'
        }}>
          Loading your order history...
        </Text>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ 
        textAlign: "center", 
        padding: 80,
        maxWidth: 600,
        margin: '0 auto',
        background: 'linear-gradient(135deg, #f1f8e9 0%, #e8f5e8 100%)',
        minHeight: '100vh'
      }}>
        <CloseCircleOutlined style={{ fontSize: 48, color: '#d32f2f', marginBottom: 16 }} />
        <Title level={3} style={{ color: '#d32f2f', marginBottom: 8 }}>
          Unable to Load Orders
        </Title>
        <Text style={{ color: '#d32f2f', fontSize: '16px', marginBottom: 24, display: 'block' }}>
          {error}
        </Text>
        <Button 
          type="primary" 
          onClick={() => dispatch(getUserOrders({ page: 1, limit: 20 }))}
          style={{
            background: '#4caf50',
            borderColor: '#4caf50',
            borderRadius: '6px'
          }}
        >
          Try Again
        </Button>
      </div>
    );
  }

  if (!userOrders || userOrders.length === 0) {
    return (
      <div style={{ 
        textAlign: "center", 
        padding: 80,
        background: 'linear-gradient(135deg, #f1f8e9 0%, #e8f5e8 100%)',
        minHeight: '100vh'
      }}>
        <FileTextOutlined style={{ fontSize: 64, color: '#4caf50', marginBottom: 24 }} />
        <Title level={3} style={{ color: '#1b5e20', marginBottom: 16 }}>
          No Orders Yet
        </Title>
        <Text style={{ 
          fontSize: '16px', 
          color: '#388e3c',
          marginBottom: 32,
          display: 'block'
        }}>
          Start shopping to see your order history here
        </Text>
        <Button 
          type="primary" 
          size="large"
          onClick={() => navigate("/")}
          style={{
            background: 'linear-gradient(135deg, #4caf50 0%, #2e7d32 100%)',
            border: 'none',
            borderRadius: '8px',
            padding: '0 32px',
            height: '44px',
            fontWeight: '600',
            boxShadow: '0 4px 12px rgba(76, 175, 80, 0.3)'
          }}
        >
          Start Shopping
        </Button>
      </div>
    );
  }

  return (
    <div style={{ 
      maxWidth: 1400, 
      margin: "0 auto", 
      padding: "32px 24px",
      background: 'linear-gradient(135deg, #f1f8e9 0%, #e8f5e8 100%)',
      minHeight: '100vh'
    }}>
      {/* Header Section */}
      <div style={{ marginBottom: 40, textAlign: 'center' }}>
        <Title level={1} style={{ 
          color: '#1b5e20',
          marginBottom: 12,
          fontWeight: 700,
          fontSize: '2.5rem'
        }}>
          Order History
        </Title>
        <Text style={{ 
          fontSize: '16px', 
          color: '#388e3c',
          maxWidth: '500px',
          display: 'block',
          margin: '0 auto'
        }}>
          Track and manage all your orders in one convenient place
        </Text>
      </div>

      
      {/* Orders Table */}
      <Card
        bordered={false}
        style={{
          borderRadius: '12px',
          boxShadow: '0 8px 32px rgba(76, 175, 80, 0.1)',
          border: '1px solid #c8e6c9',
          background: 'white',
          overflow: 'hidden'
        }}
        bodyStyle={{ padding: 0 }}
      >
        <div style={{ 
          background: 'linear-gradient(135deg, #1b5e20 0%, #2e7d32 100%)', 
          padding: '20px 24px',
          borderBottom: '1px solid #e8f5e8'
        }}>
          <Title level={4} style={{ color: 'white', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FileTextOutlined />
            Recent Orders
          </Title>
        </div>
        
        <Table
          rowKey="_id"
          columns={columns}
          dataSource={userOrders}
          pagination={{
            current: pagination.currentPage,
            total: pagination.totalOrders,
            pageSize: 20,
            onChange: (page) => dispatch(getUserOrders({ page, limit: 20 })),
            showSizeChanger: false,
            showQuickJumper: true,
            showTotal: (total, range) => (
              <Text style={{ color: '#388e3c', fontWeight: 500 }}>
                Showing {range[0]}-{range[1]} of {total} orders
              </Text>
            ),
            style: { 
              padding: '20px 24px',
              borderTop: '1px solid #e8f5e8',
              background: '#f9fdf9'
            }
          }}
          scroll={{ x: 800 }}
          style={{
            border: 'none'
          }}
          rowClassName={() => 'order-table-row'}
        />
      </Card>

      <style jsx>{`
        :global(.order-table-row:hover td) {
          background-color: #f1f8e9 !important;
          transition: background-color 0.3s ease;
        }
        :global(.ant-table-thead > tr > th) {
          background: #f9fdf9 !important;
          color: #1b5e20 !important;
          font-weight: 600 !important;
          border-bottom: 2px solid #c8e6c9 !important;
        }
      `}</style>
    </div>
  );
};

export default OrderHistoryPage;