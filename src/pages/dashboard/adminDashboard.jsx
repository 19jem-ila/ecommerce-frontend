import React, { useState, useMemo, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Layout,
  Card,
  Statistic,
  Table,
  Tag,
  Tabs,
  Form,
  Input,
  Select,
  InputNumber,
  Modal,
  Space,
  Row,
  Col,
  Avatar,
  List,
  Progress,
  message,
  Spin,
  Upload,
  Button,
  Checkbox,
  Typography
} from "antd";
import {
  UserOutlined,
  ShoppingCartOutlined,
  DollarOutlined,
  ProductOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  BarChartOutlined,
  TeamOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
} from "@ant-design/icons";

import { getAllUsers, updateUserRole, deleteUser, getUserById } from "../../store/slices/userSlice";
import { getAllOrders, updateOrderStatus } from "../../store/slices/orderSlice";
import { createProduct, deleteProduct, updateProduct, getAdminStats, getSalesTrends } from "../../store/slices/adminSlice";
import { fetchProducts} from "../../store/slices/productSlice"
import {authService} from "../../services/authService"
import CustomButton from "../../components/ui/CustomButton";

const { Header, Content } = Layout;
const { Option } = Select;
const { TextArea } = Input;
const { Title, Text } = Typography;

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  
  const users = useSelector((state) => state.user?.users?.users || []);
  const usersLoading = useSelector((state) => state.user?.loading || false);
  
  const adminOrders = useSelector((state) => state.orders?.adminOrders || []);
  const ordersLoading = useSelector((state) => state.orders?.loading || false);

  console.log("admin orders", adminOrders);
  
  
  const stats = useSelector((state) => state.admin?.stats || {});
  const trends = useSelector((state) => state.admin?.trends || {});

  const products = useSelector((state) => state.products?.products || []);
  const adminLoading = useSelector((state) => state.products?.loading || false);

  const [activeTab, setActiveTab] = useState("overview");
  const [isProductModalVisible, setIsProductModalVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isUserModalVisible, setIsUserModalVisible] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const singleUser = useSelector((state) => state.user.singleUser);
  const userLoading = useSelector((state) => state.user.loading);
  const [isAdminModalVisible, setIsAdminModalVisible] = useState(false);

  useEffect(() => {
    dispatch(getAllUsers({ page: 1, limit: 20 }));
    dispatch(getAllOrders({ page: 1, limit: 20 }));
    dispatch(getAdminStats({ page: 1, limit: 20 }));
    dispatch(getSalesTrends({ page: 1, limit: 20 }));
    dispatch(fetchProducts({ page: 1, limit: 20 })); 
  }, [dispatch]);

  const dashboardMetrics = useMemo(() => {
    return {
      totalRevenue: stats?.totalRevenue || 0,
      totalOrders: stats?.totalOrders || adminOrders.length,
      totalUsers: stats?.totalUsers || users.length,
      totalProducts: stats?.totalProducts || products.length,
      monthlyGrowth: stats?.monthlyGrowth || 0
    };
  }, [stats, users.length, products.length]);

  const handleCreateAdmin = async (values) => {
    try {
      setLoading(true);
      const { email, password, displayName } = values;
      const result = await authService.createAdmin({ email, password, displayName });
      message.success("Admin created successfully!");
      setIsAdminModalVisible(false);
    } catch (error) {
      message.error(error.message || "Failed to create admin");
    } finally {
      setLoading(false);
    }
  };

  const handleUserRoleUpdate = async (userId, newRole) => {
    try {
      const updatedUser = await dispatch(updateUserRole({ userId, role: newRole })).unwrap();
      message.success(`User role updated to ${updatedUser.role}`);
    } catch (error) {
      message.error("Failed to update user role");
    }
  };
  
  const handleViewUser = async (userId) => {
    setSelectedUserId(userId);
    try {
      await dispatch(getUserById(userId)).unwrap();
      setIsUserModalVisible(true);
    } catch (err) {
      console.error(err);
      message.error("Failed to load user");
    }
  };

  const handleOrderStatusUpdate = async (orderId, newStatus) => {
    try {
      await dispatch(updateOrderStatus({ orderId, status: newStatus })).unwrap();
      message.success("Order status updated successfully");
    } catch (error) {
      message.error("Failed to update order status");
    }
  };

  const handleProductSubmit = async (values) => {
    console.log("Raw form values (from Form):", values);
    setLoading(true);
  
    try {
      const formData = new FormData();
  
      ['name','category','description','brand','frameMaterial','lensType'].forEach(k => {
        if (values[k] !== undefined && values[k] !== null && values[k] !== '') {
          formData.append(k, String(values[k]));
        }
      });
  
      if (values.price !== undefined) formData.append('price', String(values.price));
      if (values.stockQuantity !== undefined) formData.append('stockQuantity', String(values.stockQuantity));
  
      formData.append('prescriptionEligible', values.prescriptionEligible ? 'true' : 'false');
      formData.append('includeLenses', values.includeLenses ? 'true' : 'false');
  
      if (values.colors) {
        const colorsArr = String(values.colors).split(',').map(c => c.trim()).filter(Boolean);
        formData.append('colors', JSON.stringify(colorsArr));
      }
  
      if (Array.isArray(values.images) && values.images.length > 0) {
        values.images.forEach((uploadFile) => {
          const fileObj = uploadFile.originFileObj || uploadFile;
          if (fileObj) {
            formData.append('images', fileObj);
          }
        });
      }
  
      if (editingProduct) {
        await dispatch(updateProduct({ id: editingProduct._id, data: formData })).unwrap();
        message.success("Product updated successfully");
      } else {
        await dispatch(createProduct(formData)).unwrap();
        message.success("Product created successfully");
      }
  
      setIsProductModalVisible(false);
      setEditingProduct(null);
      form.resetFields();
  
    } catch (err) {
      console.error("Product save failed:", err);
      message.error("Failed to save product");
    } finally {
      setLoading(false);
    }
  };

  const handleProductDelete = async (productId) => {
    Modal.confirm({
      title: "Are you sure you want to delete this product?",
      content: "This action cannot be undone.",
      okText: "Yes, Delete",
      okType: "danger",
      cancelText: "Cancel",
      onOk: async () => {
        try {
          await dispatch(deleteProduct(productId)).unwrap();
          message.success("Product deleted successfully");
        } catch (error) {
          message.error("Failed to delete product");
        }
      }
    });
  };

  const userColumns = [
    {
      title: 'User',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <Space>
          <Avatar icon={<UserOutlined />} src={record.avatar} />
          <span>{record.displayName || 'No Name'}</span>
        </Space>
      ),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      render: (role, record) => (
        <Select
          defaultValue={role || 'user'}
          style={{ width: 120 }}
          onChange={(value) => handleUserRoleUpdate(record._id, value)}
        >
          <Option value="customer">Customer</Option>
          <Option value="admin">Admin</Option>
        </Select>
      ),
    },
    {
      title: 'Joined Date',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => date ? new Date(date).toLocaleDateString() : 'N/A',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <CustomButton
            variant="secondary"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => handleViewUser(record._id)}
          >
            View
          </CustomButton>
          <CustomButton
            variant="danger"
            size="small"
            icon={<DeleteOutlined />}
            onClick={() => {
              Modal.confirm({
                title: "Are you sure you want to delete this user?",
                content: "This action cannot be undone.",
                okText: "Yes, Delete",
                okType: "danger",
                cancelText: "Cancel",
                onOk: async () => {
                  try {
                    await dispatch(deleteUser(record._id)).unwrap();
                    message.success("User deleted successfully");
                  } catch (err) {
                    console.error("Delete user failed:", err);
                    message.error("Failed to delete user");
                  }
                }
              });
            }}
          >
            Delete
          </CustomButton>
        </Space>
      ),
    },
  ];

  const orderColumns = [
    {
      title: 'Order ID',
      dataIndex: '_id',
      key: '_id',
      render: (id) => id ? `#${id.slice(-6)}` : 'N/A',
    },
    {
      title: 'Customer',
      dataIndex: 'user',
      key: 'customer',
      render: (user) => user?.displayName || 'Guest',
    },
    {
      title: 'Amount',
      dataIndex: 'total',
      key: 'total',
      render: (amount) => amount ? `ETB ${amount.toFixed()}` : 'ETB0',
    },
    {
      title: 'Status',
      dataIndex: 'orderStatus',
      key: 'orderStatus',
      render: (status) => {
        const color =
          status === 'delivered' ? 'green' :
          status === 'pending' ? 'orange' :
          status === 'cancelled' ? 'red' : 'blue';
        return <Tag color={color}>{(status || 'pending').toUpperCase()}</Tag>;
      },
    },
    {
      title: 'Date',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => date ? new Date(date).toLocaleDateString() : 'N/A',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Select
            defaultValue={record.orderStatus || 'pending'}
            style={{ width: 120 }}
            onChange={(value) => handleOrderStatusUpdate(record._id, value)}
          >
            <Option value="pending">Pending</Option>
            <Option value="confirmed">Confirmed</Option>
            <Option value="shipped">Shipped</Option>
            <Option value="delivered">Delivered</Option>
            <Option value="cancelled">Cancelled</Option>
          </Select>
        </Space>
      ),
    },
  ];

  const productColumns = [
    {
      title: 'Product Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      render: (category) => <Tag color="blue">{category || 'Uncategorized'}</Tag>,
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      render: (price) => price ? `ETB${price}` : 'ETB0',
    },
    {
      title: 'Stock',
      dataIndex: 'stockQuantity',
      key: 'stockQuantity',
      render: (stockQuantity) => (
        <Progress 
          percent={Math.min(((stockQuantity || 0) / 100) * 100, 100)} 
          size="small" 
          status={(stockQuantity || 0) > 20 ? 'active' : 'exception'}
        />
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <CustomButton
            variant="secondary"
            size="small"
            icon={<EditOutlined />}
            onClick={() => {
              setEditingProduct(record);
              setIsProductModalVisible(true);
              form.setFieldsValue({
                ...record,
                colors: record.colors ? record.colors.join(", ") : "",
                images: [], 
              });
            }}
          >
            Edit
          </CustomButton>
          <CustomButton 
            variant="danger" 
            size="small" 
            icon={<DeleteOutlined />}
            onClick={() => handleProductDelete(record._id)}
          >
            Delete
          </CustomButton>
        </Space>
      ),
    },
  ];

  const recentOrders = useMemo(() => adminOrders.slice(0, 5), [adminOrders]);
  const topProducts = useMemo(() => products.slice(0, 5), [products]);

  if (usersLoading || ordersLoading || adminLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Spin size="large" tip="Loading Dashboard..." />
      </div>
    );
  }

  // Green color variants
  const primaryGreen = '#53E458';
  const darkGreen = '#0d9412';
  const lightGreen = '#e8f5e9';

  return (
    <Layout style={{ minHeight: '100vh', background: '#f8fafc' }}>
      <Header style={{ 
        background: `linear-gradient(135deg, ${primaryGreen} 0%, ${darkGreen} 100%)`,
        padding: '20px 24px', 
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        borderBottom: 'none',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: 40,
              height: 40,
              background: 'rgba(255,255,255,0.2)',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backdropFilter: 'blur(10px)'
            }}>
              <BarChartOutlined style={{ fontSize: '20px', color: 'white' }} />
            </div>
            <div>
              <Title level={3} style={{ 
                margin: 0, 
                color: 'white',
                fontWeight: 700,
                fontSize: '24px'
              }}>
                Mina Optics Admin Dashboard
              </Title>
            </div>
          </div>
          <CustomButton 
            variant="secondary" 
            onClick={() => navigate("/")}
            icon={<EyeOutlined />}
          >
            View Storefront
          </CustomButton>
        </div>
      </Header>

      <Content style={{ padding: '24px', background: '#f8fafc' }}>
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={[
            {
              key: 'overview',
              label: (
                <span style={{ fontWeight: 600 }}>
                  <BarChartOutlined />
                  Overview
                </span>
              ),
            },
            {
              key: 'users',
              label: (
                <span style={{ fontWeight: 600 }}>
                  <TeamOutlined />
                  Users
                </span>
              ),
            },
            {
              key: 'orders',
              label: (
                <span style={{ fontWeight: 600 }}>
                  <ShoppingCartOutlined />
                  Orders
                </span>
              ),
            },
            {
              key: 'products',
              label: (
                <span style={{ fontWeight: 600 }}>
                  <ProductOutlined />
                  Products
                </span>
              ),
            },
          ]}
          style={{
            background: 'white',
            padding: '0 16px',
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
          }}
        />

        {activeTab === 'overview' && (
          <div style={{ marginTop: 16 }}>
            {/* Key Metrics Cards - All Green Theme */}
            <Row gutter={[20, 20]}>
              <Col xs={24} sm={12} lg={6}>
                <Card 
                  style={{ 
                    background: `linear-gradient(135deg, ${primaryGreen} 0%, ${darkGreen} 100%)`,
                    border: 'none',
                    borderRadius: '12px',
                    boxShadow: `0 4px 12px ${primaryGreen}40`
                  }}
                  bodyStyle={{ padding: '20px' }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Statistic
                      title={
                        <Text style={{ color: 'rgba(255,255,255,0.9)', fontSize: '14px', fontWeight: 600 }}>
                          Total Revenue
                        </Text>
                      }
                      value={dashboardMetrics.totalRevenue}
                      precision={2}
                      prefix="$"
                      valueStyle={{ 
                        color: 'white', 
                        fontSize: '28px',
                        fontWeight: 700
                      }}
                    />
                    <div style={{
                      width: 48,
                      height: 48,
                      background: 'rgba(255,255,255,0.2)',
                      borderRadius: '10px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <DollarOutlined style={{ fontSize: '24px', color: 'white' }} />
                    </div>
                  </div>
                  
                </Card>
              </Col>
              
              <Col xs={24} sm={12} lg={6}>
                <Card 
                  style={{ 
                    background: `linear-gradient(135deg, ${primaryGreen} 0%, ${darkGreen} 100%)`,
                    border: 'none',
                    borderRadius: '12px',
                    boxShadow: `0 4px 12px ${primaryGreen}40`
                  }}
                  bodyStyle={{ padding: '20px' }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Statistic
                      title={
                        <Text style={{ color: 'rgba(255,255,255,0.9)', fontSize: '14px', fontWeight: 600 }}>
                          Total Orders
                        </Text>
                      }
                      value={dashboardMetrics.totalOrders}
                      valueStyle={{ 
                        color: 'white', 
                        fontSize: '28px',
                        fontWeight: 700
                      }}
                    />
                    <div style={{
                      width: 48,
                      height: 48,
                      background: 'rgba(255,255,255,0.2)',
                      borderRadius: '10px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <ShoppingCartOutlined style={{ fontSize: '24px', color: 'white' }} />
                    </div>
                  </div>
                  
                </Card>
              </Col>
              
              <Col xs={24} sm={12} lg={6}>
                <Card 
                  style={{ 
                    background: `linear-gradient(135deg, ${primaryGreen} 0%, ${darkGreen} 100%)`,
                    border: 'none',
                    borderRadius: '12px',
                    boxShadow: `0 4px 12px ${primaryGreen}40`
                  }}
                  bodyStyle={{ padding: '20px' }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Statistic
                      title={
                        <Text style={{ color: 'rgba(255,255,255,0.9)', fontSize: '14px', fontWeight: 600 }}>
                          Total Users
                        </Text>
                      }
                      value={dashboardMetrics.totalUsers}
                      valueStyle={{ 
                        color: 'white', 
                        fontSize: '28px',
                        fontWeight: 700
                      }}
                    />
                    <div style={{
                      width: 48,
                      height: 48,
                      background: 'rgba(255,255,255,0.2)',
                      borderRadius: '10px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <UserOutlined style={{ fontSize: '24px', color: 'white' }} />
                    </div>
                  </div>
                  
                </Card>
              </Col>
              
              <Col xs={24} sm={12} lg={6}>
                <Card 
                  style={{ 
                    background: `linear-gradient(135deg, ${primaryGreen} 0%, ${darkGreen} 100%)`,
                    border: 'none',
                    borderRadius: '12px',
                    boxShadow: `0 4px 12px ${primaryGreen}40`
                  }}
                  bodyStyle={{ padding: '20px' }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Statistic
                      title={
                        <Text style={{ color: 'rgba(255,255,255,0.9)', fontSize: '14px', fontWeight: 600 }}>
                          Total Products
                        </Text>
                      }
                      value={dashboardMetrics.totalProducts}
                      valueStyle={{ 
                        color: 'white', 
                        fontSize: '28px',
                        fontWeight: 700
                      }}
                    />
                    <div style={{
                      width: 48,
                      height: 48,
                      background: 'rgba(255,255,255,0.2)',
                      borderRadius: '10px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <ProductOutlined style={{ fontSize: '24px', color: 'white' }} />
                    </div>
                  </div>
                  
                </Card>
              </Col>
            </Row>

            {/* Charts and Recent Activity */}
            <Row gutter={[20, 20]} style={{ marginTop: 20 }}>
              <Col xs={24} lg={12}>
                <Card 
                  title={
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <ShoppingCartOutlined style={{ color: primaryGreen }} />
                      <Text strong style={{ fontSize: '16px' }}>Recent Orders</Text>
                    </div>
                  }
                  extra={
                    <CustomButton 
                      variant="secondary" 
                      size="small"
                      onClick={() => setActiveTab('orders')}
                    >
                      View All
                    </CustomButton>
                  }
                  style={{
                    borderRadius: '12px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                    border: 'none'
                  }}
                  headStyle={{ borderBottom: '1px solid #f0f0f0' }}
                >
                  <Table
                    columns={orderColumns.slice(0, -1)}
                    dataSource={recentOrders}
                    rowKey="_id"
                    pagination={false}
                    size="small"
                    locale={{ emptyText: 'No orders found' }}
                    style={{ marginTop: 8 }}
                  />
                </Card>
              </Col>
              
              <Col xs={24} lg={12}>
                <Card 
                  title={
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <ProductOutlined style={{ color: primaryGreen }} />
                      <Text strong style={{ fontSize: '16px' }}>Top Products</Text>
                    </div>
                  }
                  style={{
                    borderRadius: '12px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                    border: 'none'
                  }}
                  headStyle={{ borderBottom: '1px solid #f0f0f0' }}
                >
                  <List
                    dataSource={topProducts}
                    renderItem={(item, index) => (
                      <List.Item 
                        style={{ 
                          padding: '12px 0',
                          borderBottom: '1px solid #f5f5f5'
                        }}
                      >
                        <List.Item.Meta
                          avatar={
                            <Avatar 
                              size="large" 
                              style={{ 
                                backgroundColor: primaryGreen,
                                color: 'white',
                                fontWeight: 'bold'
                              }}
                            >
                              {index + 1}
                            </Avatar>
                          }
                          title={
                            <Text strong style={{ fontSize: '14px' }}>
                              {item.name}
                            </Text>
                          }
                          description={
                            <div>
                              <Text type="secondary" style={{ fontSize: '12px' }}>
                                Category: {item.category} 
                              </Text>
                              <br />
                              <Text strong style={{ color: primaryGreen, fontSize: '13px' }}>
                                Price: ETB {item.price}
                              </Text>
                            </div>
                          }
                        />
                        <div>
                          <Tag 
                            color={item.stockQuantity > 20 ? 'green' : 'orange'}
                            style={{ borderRadius: '6px' }}
                          >
                            Stock: {item.stockQuantity}
                          </Tag>
                        </div>
                      </List.Item>
                    )}
                    locale={{ emptyText: 'No products found' }}
                  />
                </Card>
              </Col>
            </Row>

            {/* Quick Stats Row - All Green Progress Circles */}
            <Row gutter={[20, 20]} style={{ marginTop: 20 }}>
              <Col xs={24} lg={8}>
                <Card 
                  style={{
                    background: 'white',
                    borderRadius: '12px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                    border: 'none'
                  }}
                  bodyStyle={{ padding: '20px' }}
                >
                  <div style={{ textAlign: 'center' }}>
                    <Progress
                      type="circle"
                      percent={85}
                      strokeColor={primaryGreen}
                      format={percent => (
                        <div>
                          <Text strong style={{ fontSize: '24px', color: primaryGreen }}>
                            {percent}%
                          </Text>
                          <br />
                          <Text type="secondary" style={{ fontSize: '12px' }}>
                            Order Completion
                          </Text>
                        </div>
                      )}
                    />
                  </div>
                </Card>
              </Col>
              
              <Col xs={24} lg={8}>
                <Card 
                  style={{
                    background: 'white',
                    borderRadius: '12px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                    border: 'none'
                  }}
                  bodyStyle={{ padding: '20px' }}
                >
                  <div style={{ textAlign: 'center' }}>
                    <Progress
                      type="circle"
                      percent={72}
                      strokeColor={primaryGreen}
                      format={percent => (
                        <div>
                          <Text strong style={{ fontSize: '24px', color: primaryGreen }}>
                            {percent}%
                          </Text>
                          <br />
                          <Text type="secondary" style={{ fontSize: '12px' }}>
                            Customer Satisfaction
                          </Text>
                        </div>
                      )}
                    />
                  </div>
                </Card>
              </Col>
              
              <Col xs={24} lg={8}>
                <Card 
                  style={{
                    background: 'white',
                    borderRadius: '12px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                    border: 'none'
                  }}
                  bodyStyle={{ padding: '20px' }}
                >
                  <div style={{ textAlign: 'center' }}>
                    <Progress
                      type="circle"
                      percent={63}
                      strokeColor={primaryGreen}
                      format={percent => (
                        <div>
                          <Text strong style={{ fontSize: '24px', color: primaryGreen }}>
                            {percent}%
                          </Text>
                          <br />
                          <Text type="secondary" style={{ fontSize: '12px' }}>
                            Monthly Growth
                          </Text>
                        </div>
                      )}
                    />
                  </div>
                </Card>
              </Col>
            </Row>
          </div>
        )}

        {/* Other tabs remain unchanged */}
        {activeTab === 'users' && (
          <Card
            title="User Management"
            extra={
              <CustomButton
                variant="primary"
                icon={<PlusOutlined />}
                onClick={() => setIsAdminModalVisible(true)}
              >
                Create Admin
              </CustomButton>
            }
          >
            <Table
              columns={userColumns}
              dataSource={users}
              rowKey="_id"
              scroll={{ x: 800 }}
              locale={{ emptyText: 'No users found' }}
            />

            <Modal
              title="User Details"
              open={isUserModalVisible}
              onCancel={() => setIsUserModalVisible(false)}
            >
              {userLoading || !singleUser ? (
                <Spin tip="Loading user..." />
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                    <Avatar size={64} icon={<UserOutlined />} src={singleUser.photoURL} />
                    <div>
                      <h2 style={{ margin: 0 }}>{singleUser.displayName}</h2>
                      <p style={{ margin: 0 }}>{singleUser.email}</p>
                      <Tag color={singleUser.role === "admin" ? "red" : "blue"}>
                        {singleUser.role.toUpperCase()}
                      </Tag>
                      <p style={{ marginTop: 4, color: "#888" }}>
                        Joined:{" "}
                        {singleUser.createdAt
                          ? new Date(singleUser.createdAt).toLocaleDateString()
                          : "N/A"}
                      </p>
                    </div>
                  </div>

                  {singleUser.addresses?.length > 0 && (
                    <div>
                      <h3>Addresses</h3>
                      <List
                        dataSource={singleUser.addresses}
                        renderItem={(addr, idx) => (
                          <List.Item>
                            <List.Item.Meta
                              title={`Address ${idx + 1}`}
                              description={`${addr.street || ""}, ${addr.city || ""}, ${addr.state || ""}, ${addr.zip || ""}, ${addr.country || ""}`}
                            />
                          </List.Item>
                        )}
                      />
                    </div>
                  )}

                  {singleUser.preferences &&
                    Object.keys(singleUser.preferences).length > 0 && (
                      <div>
                        <h3>Preferences</h3>
                        <List
                          dataSource={Object.entries(singleUser.preferences)}
                          renderItem={([key, value]) => (
                            <List.Item>
                              <strong>{key}:</strong> {String(value)}
                            </List.Item>
                          )}
                        />
                      </div>
                    )}
                </div>
              )}
            </Modal>

            <Modal
              title="Create Admin"
              open={isAdminModalVisible}
              onCancel={() => setIsAdminModalVisible(false)}
              footer={null}
            >
              <Form layout="vertical" onFinish={handleCreateAdmin}>
                <Form.Item
                  name="displayName"
                  label="Full Name"
                  rules={[{ required: true, message: "Please enter a name" }]}
                >
                  <Input placeholder="Enter full name" />
                </Form.Item>

                <Form.Item
                  name="email"
                  label="Email"
                  rules={[{ required: true, message: "Please enter an email" }]}
                >
                  <Input placeholder="Enter email" />
                </Form.Item>

                <Form.Item
                  name="password"
                  label="Password"
                  rules={[{ required: true, message: "Please enter a password" }]}
                >
                  <Input.Password placeholder="Enter password" />
                </Form.Item>

                <CustomButton
                  variant="primary"
                  htmlType="submit"
                  loading={loading}
                  block
                >
                  Create
                </CustomButton>
              </Form>
            </Modal>
          </Card>
        )}

        {activeTab === 'orders' && (
          <Card title="Order Management">
            <Table
              columns={orderColumns}
              dataSource={adminOrders}
              rowKey="_id"
              scroll={{ x: 1000 }}
              locale={{ emptyText: 'No orders found' }}
            />
          </Card>
        )}

        {activeTab === 'products' && (
          <div>
            <Card
              title="Product Management"
              extra={
                <CustomButton 
                  variant="primary" 
                  icon={<PlusOutlined />}
                  onClick={() => setIsProductModalVisible(true)}
                >
                  Add Product
                </CustomButton>
              }
            >
              <Table
                columns={productColumns}
                dataSource={products}
                rowKey="_id"
                scroll={{ x: 800 }}
                locale={{ emptyText: 'No products found' }}
              />
            </Card>

            <Modal
              title={editingProduct ? "Edit Product" : "Add New Product"}
              open={isProductModalVisible}
              onCancel={() => {
                setIsProductModalVisible(false);
                setEditingProduct(null);
                form.resetFields();
              }}
              footer={null}
              width={700}
            >
              <Form
                form={form}
                layout="vertical"
                onFinish={handleProductSubmit}
              >
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item name="name" label="Product Name" rules={[{ required: true }]}>
                      <Input placeholder="Enter product name" />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item name="category" label="Category" rules={[{ required: true }]}>
                      <Select placeholder="Select category">
                        <Option value="sunglasses">Sunglasses</Option>
                        <Option value="eyeglasses">Eyeglasses</Option>
                        <Option value="sports">Sports</Option>
                        <Option value="brands">Brands</Option>
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item name="price" label="Price" rules={[{ required: true }]}>
                      <InputNumber style={{ width: '100%' }} min={0} placeholder="Enter price" />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item name="stockQuantity" label="Stock Quantity" rules={[{ required: true }]}>
                      <InputNumber style={{ width: '100%' }} min={0} placeholder="Enter stock quantity" />
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item name="colors" label="Colors (comma separated)" rules={[{ required: true }]}>
                      <Input placeholder="e.g., red, blue, black" />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item name="brand" label="Brand">
                      <Input placeholder="Enter brand" />
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item name="frameMaterial" label="Frame Material">
                      <Select placeholder="Select frame material">
                        <Option value="Metal">Metal</Option>
                        <Option value="Plastic">Plastic</Option>
                        <Option value="Titanium">Titanium</Option>
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item name="lensType" label="Lens Type">
                      <Select placeholder="Select lens type">
                        <Option value="Standard">Standard</Option>
                        <Option value="Polarized">Polarized</Option>
                        <Option value="Photochromic">Photochromic</Option>
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item name="prescriptionEligible" valuePropName="checked">
                      <Checkbox>Prescription Eligible</Checkbox>
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item name="includeLenses" valuePropName="checked">
                      <Checkbox>Include Lenses</Checkbox>
                    </Form.Item>
                  </Col>
                </Row>

                <Form.Item name="description" label="Description" rules={[{ required: true }]}>
                  <Input.TextArea rows={4} placeholder="Enter product description" />
                </Form.Item>

                <Form.Item
                  name="images"
                  label="Product Images"
                  valuePropName="fileList"
                  getValueFromEvent={(e) => e && e.fileList ? e.fileList : []}
                  rules={[{ required: true, message: 'Upload at least one image' }]}
                >
                  <Upload listType="picture-card" beforeUpload={() => false} multiple accept="image/*">
                    <div>
                      <PlusOutlined />
                      <div style={{ marginTop: 8 }}>Upload</div>
                    </div>
                  </Upload>
                </Form.Item>

                <Form.Item>
                  <Space>
                    <Button type="primary" htmlType="submit" loading={loading}>
                      {editingProduct ? "Edit Product" : "Create Product"}
                    </Button>
                    <Button onClick={() => setIsProductModalVisible(false)}>Cancel</Button>
                  </Space>
                </Form.Item>
              </Form>
            </Modal>
          </div>
        )}
      </Content>
    </Layout>
  );
};

export default AdminDashboard;