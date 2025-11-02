import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  getProfile, 
  updateProfile, 
  addAddress, 
  updateAddress, 
  deleteAddress,
  updatePreferences,
  clearUserError 
} from '../../store/slices/userSlice';
import CustomButton from '../../components/ui/CustomButton';
import { 
  UserOutlined, 
  MailOutlined, 
  PhoneOutlined, 
  EnvironmentOutlined,
  EditOutlined,
  SaveOutlined,
  CloseOutlined,
  PlusOutlined,
  DeleteOutlined,
  EyeOutlined,
  EyeInvisibleOutlined,
  SafetyCertificateOutlined
} from '@ant-design/icons';
import { 
  Card, 
  Form, 
  Input, 
  Button, 
  Row, 
  Col, 
  Typography, 
  Divider, 
  Avatar, 
  Spin, 
  Alert, 
  Modal, 
  message,
  Tabs,
  Switch,
  Select,
  Tag
} from 'antd';
import './profile.css';

const { Title, Text } = Typography;
const { Option } = Select;
const { TabPane } = Tabs;

const ProfilePage = () => {
  const dispatch = useDispatch();
  const { profile, preferences, loading, error } = useSelector((state) => state.user);
  
  const addresses = profile?.addresses || [];
  
  
  
  
  
  const [editMode, setEditMode] = useState(false);
  const [addressModalVisible, setAddressModalVisible] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [form] = Form.useForm();
  const [addressForm] = Form.useForm();

  useEffect(() => {
    dispatch(getProfile());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      message.error(error);
      dispatch(clearUserError());
    }
  }, [error, dispatch]);

  const handleProfileUpdate = async (values) => {
    try {
      await dispatch(updateProfile(values)).unwrap();
      message.success('Profile updated successfully!');
      setEditMode(false);
    } catch (error) {
      message.error('Failed to update profile');
    }
  };

  const handleAddressSubmit = async (values) => {
    try {
      if (editingAddress) {
        await dispatch(updateAddress({ addressId: editingAddress._id, data: values })).unwrap();
        message.success('Address updated successfully!');
      } else {
        await dispatch(addAddress(values)).unwrap();
        message.success('Address added successfully!');
      }
      setAddressModalVisible(false);
      setEditingAddress(null);
      addressForm.resetFields();
    } catch (error) {
      message.error('Failed to save address');
    }
  };

  const handleDeleteAddress = (addressId) => {
    Modal.confirm({
      title: 'Delete Address',
      content: 'Are you sure you want to delete this address?',
      onOk: async () => {
        try {
          await dispatch(deleteAddress(addressId)).unwrap();
          message.success('Address deleted successfully!');
        } catch (error) {
          message.error('Failed to delete address');
        }
      },
    });
  };

  const handleEditAddress = (address) => {
    setEditingAddress(address);
    setAddressModalVisible(true);
    addressForm.setFieldsValue(address);
  };

  const handlePreferencesUpdate = async (values) => {
    try {
      await dispatch(updatePreferences(values)).unwrap();
      message.success('Preferences updated successfully!');
    } catch (error) {
      message.error('Failed to update preferences');
    }
  };

  if (loading && !profile) {
    return (
      <div className="profile-loading">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="profile-header">
        <Title level={1}>My Profile</Title>
        <Text className="profile-subtitle">Manage your account settings and preferences</Text>
      </div>

      <Row gutter={[24, 24]}>
        {/* Profile Overview Card */}
        <Col xs={24} lg={8}>
          <Card className="profile-overview-card">
            <div className="profile-avatar-section">
              <Avatar 
                size={100} 
                icon={<UserOutlined />} 
                className="profile-avatar"
                src={profile?.avatar}
              />
              <Title level={3} className="profile-name">
                {profile?.displayName} 
              </Title>
              <Text className="profile-email">{profile?.email}</Text>
              <Tag color="blue" className="profile-role">
                {profile?.role || 'Customer'}
              </Tag>
            </div>
            
            <Divider />
            
            <div className="profile-stats">
              <div className="stat-item">
                <Text strong>Member Since</Text>
                <Text>{new Date(profile?.createdAt).getFullYear() || '2024'}</Text>
              </div>
              <div className="stat-item">
                <Text strong>last Login</Text>
                <Text>{profile?.
lastLogin || 0}</Text>
              </div>
              <div className="stat-item">
                <Text strong>Prescriptions</Text>
                <Text>{profile?.prescriptionCount || 0}</Text>
              </div>
            </div>
          </Card>
        </Col>

        {/* Main Profile Content */}
        <Col xs={24} lg={16}>
          <Card className="profile-content-card">
            <Tabs defaultActiveKey="profile" className="profile-tabs">
              
              {/* Personal Information Tab */}
              <TabPane 
                tab={
                  <span>
                    <UserOutlined />
                    Personal Information
                  </span>
                } 
                key="profile"
              >
                <div className="tab-header">
                  <Title level={4}>Personal Details</Title>
                  {!editMode ? (
                    <CustomButton
                      variant="primary" 
                      icon={<EditOutlined />}
                      onClick={() => setEditMode(true)}
                    >
                      Edit Profile
                    </CustomButton>
                  ) : (
                    <div className="edit-actions">
                      <CustomButton 
                        variant="primary" 
                        icon={<SaveOutlined />}
                        onClick={() => form.submit()}
                      >
                        Save Changes
                      </CustomButton>
                      <Button 
                        icon={<CloseOutlined />}
                        onClick={() => {
                          setEditMode(false);
                          form.resetFields();
                        }}
                        style={{ marginLeft: 8 }}
                      >
                        Cancel
                      </Button>
                    </div>
                  )}
                </div>

                <Form
                  form={form}
                  layout="vertical"
                  initialValues={profile}
                  onFinish={handleProfileUpdate}
                  disabled={!editMode}
                  className="profile-form"
                >
                  <Row gutter={16}>
                    <Col xs={24} md={12}>
                      <Form.Item
                        name="firstName"
                        label="First Name"
                        rules={[{ required: true, message: 'Please enter your first name' }]}
                      >
                        <Input 
                          prefix={<UserOutlined />} 
                          size="large"
                          placeholder="Enter your first name"
                        />
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                      <Form.Item
                        name="lastName"
                        label="Last Name"
                        rules={[{ required: true, message: 'Please enter your last name' }]}
                      >
                        <Input 
                          size="large"
                          placeholder="Enter your last name"
                        />
                      </Form.Item>
                    </Col>
                  </Row>

                  <Form.Item
                    name="email"
                    label="Email Address"
                    rules={[
                      { required: true, message: 'Please enter your email' },
                      { type: 'email', message: 'Please enter a valid email' }
                    ]}
                  >
                    <Input 
                      prefix={<MailOutlined />} 
                      size="large"
                      placeholder="Enter your email address"
                    />
                  </Form.Item>

                  <Form.Item
                    name="phone"
                    label="Phone Number"
                  >
                    <Input 
                      prefix={<PhoneOutlined />} 
                      size="large"
                      placeholder="Enter your phone number"
                    />
                  </Form.Item>
                </Form>
              </TabPane>

              {/* Addresses Tab */}
              <TabPane 
                tab={
                  <span>
                    <EnvironmentOutlined />
                    Addresses
                  </span>
                } 
                key="addresses"
              >
                <div className="tab-header">
                  <Title level={4}>Saved Addresses</Title>
                  <CustomButton
                    variant="primary" 
                    icon={<PlusOutlined />}
                    onClick={() => {
                      setEditingAddress(null);
                      setAddressModalVisible(true);
                      addressForm.resetFields();
                    }}
                  >
                    Add New Address
                  </CustomButton>
                </div>
                <div className="addresses-grid">
  {addresses?.map((address, index) => (
    <Card 
      key={address._id || index} 
      className="address-card"
      actions={[
        <EditOutlined key="edit" onClick={() => handleEditAddress(addresses[index])} />,
        <DeleteOutlined key="delete" onClick={() => handleDeleteAddress(addresses[index]._id)} />
      ]}
    >
      <div className="address-content">
        <Text>{addresses[index].street},
             {addresses[index].city}</Text>
        <Text>{addresses[index].state}, {addresses[index].zipCode}</Text>
        <Text>{addresses[index].country}</Text>
        {addresses[index].isDefault && (
          <Tag color="green" className="default-tag">Default</Tag>
        )}
      </div>
    </Card>
  ))}

  {(!addresses || addresses.length === 0) && (
    <div className="empty-address">
      <EnvironmentOutlined className="empty-icon" />
      <Text>No addresses saved yet</Text>
      <Text type="secondary">Add your first address to get started</Text>
    </div>
  )}
</div>

              </TabPane>

              {/* Preferences Tab */}
              <TabPane 
                tab={
                  <span>
                    <SafetyCertificateOutlined />
                    Preferences
                  </span>
                } 
                key="preferences"
              >
                <Title level={4}>Account Preferences</Title>
                
                <Form
                  layout="vertical"
                  initialValues={preferences}
                  onFinish={handlePreferencesUpdate}
                  className="preferences-form"
                >
                  <Card className="preference-section">
                    <Title level={5}>Communication Preferences</Title>
                    
                    <Form.Item name="emailNotifications" valuePropName="checked">
                      <Row justify="space-between" align="middle">
                        <Col>
                          <Text strong>Email Notifications</Text>
                          <div>
                            <Text type="secondary">Receive updates about orders and promotions</Text>
                          </div>
                        </Col>
                        <Col>
                          <Switch />
                        </Col>
                      </Row>
                    </Form.Item>

                    <Form.Item name="smsNotifications" valuePropName="checked">
                      <Row justify="space-between" align="middle">
                        <Col>
                          <Text strong>SMS Notifications</Text>
                          <div>
                            <Text type="secondary">Get text alerts about your orders</Text>
                          </div>
                        </Col>
                        <Col>
                          <Switch />
                        </Col>
                      </Row>
                    </Form.Item>
                  </Card>

                  <Card className="preference-section">
                    <Title level={5}>Prescription Preferences</Title>
                    
                    <Form.Item name="prescriptionReminders" valuePropName="checked">
                      <Row justify="space-between" align="middle">
                        <Col>
                          <Text strong>Prescription Reminders</Text>
                          <div>
                            <Text type="secondary">Get reminders when your prescription is due for renewal</Text>
                          </div>
                        </Col>
                        <Col>
                          <Switch />
                        </Col>
                      </Row>
                    </Form.Item>

                    <Form.Item name="preferredLensType" label="Preferred Lens Type">
                      <Select placeholder="Select your preferred lens type">
                        <Option value="single-vision">Single Vision</Option>
                        <Option value="progressive">Progressive</Option>
                        <Option value="bifocal">Bifocal</Option>
                        <Option value="blue-light">Blue Light Filter</Option>
                      </Select>
                    </Form.Item>
                  </Card>

                  <CustomButton variant="primary" htmlType="submit" size="large">
                    Save Preferences
                  </CustomButton>
                </Form>
              </TabPane>
            </Tabs>
          </Card>
        </Col>
      </Row>

      {/* Address Modal */}
      <Modal
        title={editingAddress ? 'Edit Address' : 'Add New Address'}
        open={addressModalVisible}
        onCancel={() => {
          setAddressModalVisible(false);
          setEditingAddress(null);
          addressForm.resetFields();
        }}
        footer={null}
        className="address-modal"
      >
        <Form
          form={addressForm}
          layout="vertical"
          onFinish={handleAddressSubmit}
        >
          <Form.Item
            name="name"
            label="Address Name"
            rules={[{ required: true, message: 'Please enter address name' }]}
          >
            <Input placeholder="e.g., Home, Office" />
          </Form.Item>

          <Form.Item
            name="street"
            label="Street Address"
            rules={[{ required: true, message: 'Please enter street address' }]}
          >
            <Input placeholder="Enter street address" />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="city"
                label="City"
                rules={[{ required: true, message: 'Please enter city' }]}
              >
                <Input placeholder="Enter city" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="state"
                label="State"
                rules={[{ required: true, message: 'Please enter state' }]}
              >
                <Input placeholder="Enter state" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="zipCode"
                label="ZIP Code"
                rules={[{ required: true, message: 'Please enter ZIP code' }]}
              >
                <Input placeholder="Enter ZIP code" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="country"
                label="Country"
                rules={[{ required: true, message: 'Please enter country' }]}
              >
                <Input placeholder="Enter country" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="isDefault" valuePropName="checked">
            <Switch /> Set as default address
          </Form.Item>

          <div className="modal-actions">
            <Button 
              onClick={() => {
                setAddressModalVisible(false);
                setEditingAddress(null);
              }}
            >
              Cancel
            </Button>
            <Button type="primary" htmlType="submit">
              {editingAddress ? 'Update Address' : 'Add Address'}
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default ProfilePage;