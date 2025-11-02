import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Typography, Card, Space, Divider, Button, List, Tag, Steps } from "antd";
import { useNavigate } from "react-router-dom";
import { clearCurrentOrder } from "../../store/slices/orderSlice";
import { 
  CheckCircleFilled, 
  HomeOutlined, 
  ShoppingOutlined,
  EnvironmentOutlined,
  CreditCardOutlined 
} from "@ant-design/icons";

const { Title, Text } = Typography;

const OrderConfirmationPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentOrder } = useSelector((state) => state.orders);
  console.log(" curent order" , currentOrder);
  

  if (!currentOrder) {
    return (
      <div style={{ textAlign: "center", padding: "40px" }}>
        <Title level={3}>No Order Found</Title>
        <Button type="primary" onClick={() => navigate("/")}>
          Go Back Home
        </Button>
      </div>
    );
  }

  const { items, shippingAddress, billingAddress, paymentMethod, total, orderStatus } = currentOrder;
  

  const orderSteps = [
    {
      title: 'Order Placed',
      description: 'Just now',
      status: 'finish'
    },
    {
      title: 'Processing',
      description: 'Soon',
      status: 'wait'
    },
    {
      title: 'Shipped',
      description: 'In 2-3 days',
      status: 'wait'
    },
    {
      title: 'Delivered',
      description: 'Estimated 5-7 days',
      status: 'wait'
    }
  ];

  return (
    <div style={{ 
      maxWidth: 900, 
      margin: "40px auto", 
      padding: "20px",
      background: "linear-gradient(135deg, #f8fff8 0%, #f0f9ff 100%)",
      minHeight: "100vh"
    }}>
      {/* Header Section */}
      <div style={{ textAlign: "center", marginBottom: "40px" }}>
        <div style={{
          background: "#53E458",
          borderRadius: "50%",
          width: "80px",
          height: "80px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "0 auto 20px",
          boxShadow: "0 4px 12px rgba(83, 228, 88, 0.3)"
        }}>
          <CheckCircleFilled style={{ fontSize: "40px", color: "white" }} />
        </div>
        <Title level={1} style={{ 
          color: "#53E458", 
          marginBottom: "8px",
          fontWeight: "700"
        }}>
          Order Confirmed!
        </Title>
        <Text style={{ 
          fontSize: "16px", 
          color: "#666",
          maxWidth: "500px",
          display: "block",
          margin: "0 auto"
        }}>
          Thank you for your purchase! We've sent a confirmation email with your order details.
        </Text>
      </div>

      {/* Progress Steps */}
      <Card 
        style={{ 
          marginBottom: "24px",
          borderRadius: "12px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.05)"
        }}
        bodyStyle={{ padding: "24px" }}
      >
        <Steps 
          current={0} 
          items={orderSteps}
          responsive={false}
          labelPlacement="vertical"
        />
      </Card>

      <Card
        style={{
          borderRadius: "16px",
          boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
          border: "1px solid #e8f5e8",
          overflow: "hidden"
        }}
        bodyStyle={{ padding: 0 }}
      >
        {/* Order Summary Section */}
        <div style={{ 
          background: "linear-gradient(135deg, #53E458 0%, #2ecc71 100%)", 
          padding: "24px",
          color: "white"
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <Title level={3} style={{ color: "white", margin: 0 }}>
                Order Summary
              </Title>
              <Text style={{ color: "rgba(255,255,255,0.9)" }}>
                {items.length} item{items.length > 1 ? 's' : ''} 
              </Text>
            </div>
            <Tag 
              color="white" 
              style={{ 
                color: "#53E458", 
                fontWeight: "bold",
                fontSize: "14px",
                padding: "4px 12px",
                borderRadius: "20px"
              }}
            >
              {orderStatus}
            </Tag>
          </div>
        </div>

        <div style={{ padding: "32px" }}>
          {/* Order Items */}
          <div style={{ marginBottom: "32px" }}>
            <div style={{ 
              display: "flex", 
              alignItems: "center", 
              marginBottom: "16px" 
            }}>
              <ShoppingOutlined style={{ 
                color: "#53E458", 
                fontSize: "18px", 
                marginRight: "8px" 
              }} />
              <Title level={4} style={{ margin: 0, color: "#333" }}>
                Order Items
              </Title>
            </div>
            <List
              itemLayout="horizontal"
              dataSource={items}
              renderItem={(item, index) => (
                <List.Item
                  style={{
                    padding: "16px",
                    border: "1px solid #f0f0f0",
                    borderRadius: "8px",
                    marginBottom: "8px",
                    background: index % 2 === 0 ? "#fafafa" : "white"
                  }}
                >
                  <List.Item.Meta
                    avatar={
                      <div style={{
                        width: "50px",
                        height: "50px",
                        background: "linear-gradient(135deg, #53E458, #2ecc71)",
                        borderRadius: "8px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "white",
                        fontWeight: "bold"
                      }}>
                        {item.product?.name?.charAt(0) || "P"}
                      </div>
                    }
                    title={
                      <Text strong style={{ fontSize: "16px" }}>
                        {item.product?.name || "Product"}
                      </Text>
                    }
                    description={
                      <Space>
                        <Tag color="#53E458" style={{ color: "white", border: "none" }}>
                          Qty: {item.quantity}
                        </Tag>
                        <Tag color="#e8f5e8" style={{ color: "#53E458" }}>
                          Color: {item.color}
                        </Tag>
                      </Space>
                    }
                  />
                  <Text strong style={{ color: "#53E458", fontSize: "16px" }}>
                    {(item.price * item.quantity).toFixed(2)} ETB
                  </Text>
                </List.Item>
              )}
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
            {/* Shipping Address */}
            <Card 
              size="small"
              style={{ 
                borderRadius: "12px",
                border: "2px solid #e8f5e8"
              }}
              title={
                <div style={{ display: "flex", alignItems: "center" }}>
                  <EnvironmentOutlined style={{ color: "#53E458", marginRight: "8px" }} />
                  <Text strong>Shipping Address</Text>
                </div>
              }
            >
              <Text>
                {shippingAddress.street}<br />
                {shippingAddress.city}, {shippingAddress.state} {shippingAddress.zipCode}<br />
                {shippingAddress.country}
              </Text>
            </Card>

            {/* Billing Address */}
            <Card 
              size="small"
              style={{ 
                borderRadius: "12px",
                border: "2px solid #e8f5e8"
              }}
              title={
                <div style={{ display: "flex", alignItems: "center" }}>
                  <CreditCardOutlined style={{ color: "#53E458", marginRight: "8px" }} />
                  <Text strong>Billing Address</Text>
                </div>
              }
            >
              <Text>
                {billingAddress.street}<br />
                {billingAddress.city}, {billingAddress.state} {billingAddress.zipCode}<br />
                {billingAddress.country}
              </Text>
            </Card>
          </div>

          {/* Payment & Total Section */}
          <div style={{ 
            background: "#f8fff8", 
            padding: "20px", 
            borderRadius: "12px",
            marginTop: "24px",
            border: "1px solid #e8f5e8"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <Text strong style={{ fontSize: "16px" }}>
                  Payment Method: 
                </Text>
                <Tag 
                  color="#53E458" 
                  style={{ 
                    color: "white", 
                    marginLeft: "8px",
                    border: "none",
                    fontSize: "14px"
                  }}
                >
                  {paymentMethod.toUpperCase()}
                </Tag>
              </div>
              
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ 
            display: "flex", 
            justifyContent: "center", 
            gap: "16px", 
            marginTop: "32px",
            paddingTop: "24px",
            borderTop: "1px solid #f0f0f0"
          }}>
            <Button 
              type="primary" 
              size="large"
              style={{
                background: "#53E458",
                borderColor: "#53E458",
                borderRadius: "8px",
                padding: "0 32px",
                height: "44px",
                fontWeight: "600",
                boxShadow: "0 4px 12px rgba(83, 228, 88, 0.3)"
              }}
              onClick={() => navigate("/")}
              icon={<HomeOutlined />}
            >
              Continue Shopping
            </Button>
            <Button 
              danger 
              size="large"
              style={{
                borderRadius: "8px",
                padding: "0 32px",
                height: "44px",
                fontWeight: "600"
              }}
              onClick={() => dispatch(clearCurrentOrder())}
            >
              Clear Order
            </Button>
          </div>
        </div>
      </Card>

      {/* Footer Note */}
      <div style={{ 
        textAlign: "center", 
        marginTop: "32px",
        padding: "16px"
      }}>
        <Text type="secondary" style={{ fontSize: "14px" }}>
          Need help? Contact our support team at support@MinaOptics.com
        </Text>
      </div>
    </div>
  );
};

export default OrderConfirmationPage;