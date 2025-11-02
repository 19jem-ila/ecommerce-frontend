import React, { useState, useMemo, useEffect,useRef} from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { 
  Card, 
  Typography, 
  Input, 
  Space, 
  Divider, 
  message, 
  Image, 
  Spin, 
  Radio,
  Modal,
  Steps,
  Alert,
  Button
} from "antd";
import { 
  createOrder, 
  initiatePayment, 
  confirmPayment,
  clearCurrentOrder 
} from "../../store/slices/orderSlice";
import { clearCart } from "../../store/slices/cartSlice";
import "./checkout.css"
import telebirLogo from "../../assets/logo/telebirr logo.png"

const { Title, Text } = Typography;
const { Step } = Steps;

const CheckoutPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { items, loading: cartLoading } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);
  const { 
    currentOrder, 
    loading: orderLoading, 
    paymentLoading,
    paymentError,
    telebirrTransactionId,
    paymentDetails
  } = useSelector((state) => state.orders);

  const [shippingAddress, setShippingAddress] = useState({
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
    phone: ""
  });

  const [paymentMethod, setPaymentMethod] = useState("telebirr");
  const [placingOrder, setPlacingOrder] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [paymentInitiated, setPaymentInitiated] = useState(false);

 

  // Handle payment errors
  useEffect(() => {
    if (paymentError) {
      message.error(`Payment Error: ${paymentError}`);
    }
  }, [paymentError]);

  const cartItemsDetails = useMemo(() => {
    if (!items || !Array.isArray(items)) return [];
    return items.map((item) => ({
      product: item.product._id,
      quantity: item.quantity,
      price: item.product.price,
      color: item.color || "default",
      name: item.product.name,
      image: item.product.images?.[0] || "/images/placeholder-product.jpg",
    }));
  }, [items]);

  const subtotal = cartItemsDetails.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * 0.08;
  const shippingCost = subtotal > 50 ? 0 : 4.99;
  const total = subtotal + tax + shippingCost;

  const validateForm = () => {
    const { street, city, state, zipCode, country, phone } = shippingAddress;
    
    if (!street || !city || !state || !zipCode || !country) {
      message.error("Please fill in all shipping address fields!");
      return false;
    }
    
    if (paymentMethod === "telebirr" && !phone) {
      message.error("Phone number is required for Telebirr payment");
      return false;
    }
    
    return true;
  };

  


  const handlePaymentModalCancel = () => {
    if (paymentInitiated && !currentOrder?.paymentStatus === "completed") {
      Modal.confirm({
        title: "Cancel Payment?",
        content: "Your payment is in progress. Are you sure you want to cancel?",
        onOk: () => {
          setShowPaymentModal(false);
          dispatch(clearCurrentOrder());
        }
      });
    } else {
      setShowPaymentModal(false);
    }
  };

  const paymentStartedRef = useRef(false); // prevents double-starts across re-renders

  // -------------------------
  // SAFE useEffect: only show modal for pending order on mount/resume,
  // but DO NOT re-start initiation multiple times.
  // -------------------------
  useEffect(() => {
    if (!currentOrder) return;

    if (currentOrder.paymentStatus === "pending") {
      setShowPaymentModal(true);
      setPaymentInitiated(true);

      // If there's already a telebirrTransactionId (i.e. payment initiated by previous session),
      // we may want to resume confirmation automatically — but only once:
      if (
        currentOrder.paymentMethod === "telebirr" &&
        currentOrder.telebirrTransactionId &&
        !paymentStartedRef.current
      ) {
        paymentStartedRef.current = true;
        // Instead of re-calling initiatePayment (which creates a new transaction),
        // call simulateConfirmation directly using the existing transactionId:
        simulatePaymentConfirmation(currentOrder.telebirrTransactionId, currentOrder._id);
      }
    }
  }, [currentOrder]); // no handler calls here that would create state-change-loop

  // -------------------------
  // Start Telebirr payment and get transactionId, ALWAYS pass transactionId onwards
  // -------------------------
  const handleTelebirrPayment = async (orderId) => {
    try {
      // Call initiatePayment with the specific orderId that was returned from createOrder
      const resp = await dispatch(initiatePayment(orderId)).unwrap();

      // The backend payload shape (based on your earlier logs) looks like:
      // { success:true, paymentUrl, order: { telebirrTransactionId, ... } }
      const transactionId =
        resp?.order?.telebirrTransactionId ??
        resp?.telebirrTransactionId ??
        telebirrTransactionId; // fallback to slice value if available

      if (!transactionId) {
        message.error("Payment initiation succeeded but no transaction ID was returned.");
        return null;
      }

      // mark we started payment (prevents other triggers)
      paymentStartedRef.current = true;
      setPaymentInitiated(true);

      message.info("Redirecting to Telebirr payment...");

      // Instead of relying on currentOrder inside simulate, pass transactionId + orderId.
      setTimeout(() => {
        simulatePaymentConfirmation(transactionId, orderId);
      }, 3000);

      return transactionId;
    } catch (error) {
      console.error("Failed to initiate payment:", error);
      message.error("Failed to initiate payment: " + (error.message || error));
      return null;
    }
  };

  // -------------------------
  // Confirm payment (accept transactionId and orderId explicitly)
  // -------------------------
  const simulatePaymentConfirmation = async (transactionId, orderId) => {
    try {
      if (!transactionId) {
        console.error("No transactionId passed to simulatePaymentConfirmation");
        message.error("No transaction ID found, please try again.");
        return;
      }

      console.log("Simulate confirm. Transaction ID:", transactionId, "Order ID:", orderId);

      // Confirm payment; backend may expect only transactionId, or also orderId.
      // Ensure your orderService.confirmPayment signature matches this usage.
      const result = await dispatch(
        confirmPayment({ transactionId, status: "success", data: {} })
      ).unwrap();

      console.log("Confirm payment result:", result);

      message.success("Payment successful!");
      setCurrentStep(2);

      // Clear cart immediately
      dispatch(clearCart());

      // Navigate to confirmation using the explicit orderId so we don't rely on currentOrder existance
      setTimeout(() => {
        navigate("/order-confirmation", { state: { orderId: orderId } });

       
      }, 1000);
    } catch (error) {
      console.error("Payment confirmation error:", error);
      message.error("Payment confirmation failed: " + (error.message || error));
      setCurrentStep(1);
      paymentStartedRef.current = false;
    }
  };

  // -------------------------
  // handlePlaceOrder: capture createOrder response and pass its orderId forward
  // -------------------------
  const handlePlaceOrder = async () => {
    if (!validateForm()) return;
    if (!user) return navigate("/login");

    setPlacingOrder(true);

    try {
      const orderData = {
        items: cartItemsDetails,
        user: user._id,
        shippingAddress,
        paymentMethod,
        subtotal,
        shippingCost,
        tax,
        total,
      };

      // Capture the createOrder result so we have the created orderId immediately
      const createResp = await dispatch(createOrder(orderData)).unwrap();
      // depending on your service, createResp might be { order: {...} } or order object itself
      const createdOrder = createResp?.order ?? createResp;
      const orderId = createdOrder?._id;

      // Open the payment modal
      setCurrentStep(1);
      setShowPaymentModal(true);

      if (paymentMethod === "telebirr") {
        // Pass orderId to handleTelebirrPayment so it can call initiatePayment(orderId)
        await handleTelebirrPayment(orderId);
      } else if (paymentMethod === "cod") {
        message.success("Order placed successfully!");
        dispatch(clearCart());
        navigate("/order-confirmation", { state: { orderId } });
      }
    } catch (err) {
      console.error("Failed to place order:", err);
      message.error("Failed to place order. Please try again.");
    } finally {
      setPlacingOrder(false);
    }
  };

  if (cartLoading) {
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>
        <Spin size="large" />
        <Text>Loading checkout details...</Text>
      </div>
    );
  }

  if (cartItemsDetails.length === 0 && !currentOrder) {
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>
        <Title level={3}>Your cart is empty</Title>
        <CustomButton 
          variant="primary" 
          size="lg"
          onClick={() => navigate("/")}
        >
          Continue Shopping
        </CustomButton>
      </div>
    );
  }

  return (
    <div className="checkout-page" style={{ maxWidth: "1200px", margin: "0 auto", padding: "20px" }}>
      <Title level={2} style={{ color: '#333', marginBottom: '30px' }}>Checkout</Title>

      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        {/* Shipping Address */}
        <Card 
          title="Shipping Address" 
          headStyle={{ fontSize: '18px', fontWeight: '600' }}
          style={{ borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
        >
          <Input
            placeholder="Street"
            value={shippingAddress.street}
            onChange={(e) => setShippingAddress({ ...shippingAddress, street: e.target.value })}
            style={{ marginBottom: 10, borderRadius: '6px' }}
          />
          <Input
            placeholder="City"
            value={shippingAddress.city}
            onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
            style={{ marginBottom: 10, borderRadius: '6px' }}
          />
          <Input
            placeholder="State"
            value={shippingAddress.state}
            onChange={(e) => setShippingAddress({ ...shippingAddress, state: e.target.value })}
            style={{ marginBottom: 10, borderRadius: '6px' }}
          />
          <Input
            placeholder="Zip Code"
            value={shippingAddress.zipCode}
            onChange={(e) => setShippingAddress({ ...shippingAddress, zipCode: e.target.value })}
            style={{ marginBottom: 10, borderRadius: '6px' }}
          />
          <Input
            placeholder="Country"
            value={shippingAddress.country}
            onChange={(e) => setShippingAddress({ ...shippingAddress, country: e.target.value })}
            style={{ marginBottom: 10, borderRadius: '6px' }}
          />
          <Input
            placeholder="Phone Number (required for Telebirr)"
            value={shippingAddress.phone}
            onChange={(e) => setShippingAddress({ ...shippingAddress, phone: e.target.value })}
            style={{ borderRadius: '6px' }}
          />
        </Card>

        {/* Payment Method */}
        <Card 
          title="Payment Method" 
          headStyle={{ fontSize: '18px', fontWeight: '600' }}
          style={{ borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
        >
          <Radio.Group 
            value={paymentMethod} 
            onChange={(e) => setPaymentMethod(e.target.value)}
            style={{ width: "100%" }}
             className="custom-radio"
          >
            <Space direction="vertical" style={{ width: "100%" }}>
              <Radio 
                value="telebirr" 
                style={{ 
                  padding: "15px", 
                  width: "100%", 
                  borderRadius: '8px',
                  border: paymentMethod === 'telebirr' ? '1px solid #53E458' : '1px solid #d9d9d9'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <div style={{
                    width: 40,
                    height: 40,
                    backgroundColor: '#53E458',
                    borderRadius: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: '10px'
                  }}>
                      <img
  src={telebirLogo}
  alt="Telebirr"
  style={{
    width: '40px',
    height: '40px',
    objectFit: 'contain',
    verticalAlign: 'middle'
  }}
/>
                  </div>
                  <div>
                    <Text strong style={{ color: paymentMethod === 'telebirr' ? '#53E458' : '#333' }}>
                      Telebirr
                    </Text>
                    <br />
                    <Text type="secondary">Pay securely with Telebirr mobile payment</Text>
                  </div>
                </div>
              </Radio>
              <Radio 
                value="cod" 
                style={{ 
                  padding: "15px", 
                  width: "100%", 
                  borderRadius: '8px',
                  border: paymentMethod === 'cod' ? '1px solid #53E458' : '1px solid #d9d9d9'
                }}
              >
                <div>
                  <Text strong style={{ color: paymentMethod === 'cod' ? '#53E458' : '#333' }}>
                    Cash on Delivery
                  </Text>
                  <br />
                  <Text type="secondary">Pay when you receive your order</Text>
                </div>
              </Radio>
            </Space>
          </Radio.Group>
        </Card>

        {/* Order Summary */}
        <Card 
          title="Order Summary" 
          headStyle={{ fontSize: '18px', fontWeight: '600' }}
          style={{ borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
        >
          {cartItemsDetails.map((item) => (
            <div key={item.product} style={{ display: "flex", justifyContent: "space-between", marginBottom: 15, padding: '10px', backgroundColor: '#f9f9f9', borderRadius: '6px' }}>
              <Space>
                <Image 
                  width={60} 
                  height={60}
                  src={item.image} 
                  preview={false} 
                  fallback="/images/placeholder-product.jpg"
                  style={{ objectFit: 'cover', borderRadius: '4px' }}
                />
                <div>
                  <Text strong>{item.name}</Text>
                  <br />
                  <Text type="secondary">Quantity: {item.quantity}</Text>
                  {item.color && item.color !== "default" && (
                    <>
                      <br />
                      <Text type="secondary">Color: {item.color}</Text>
                    </>
                  )}
                </div>
              </Space>
              <Text strong>{(item.price * item.quantity).toFixed(2)} ETB</Text>
            </div>
          ))}

          <Divider style={{ margin: '20px 0' }} />

          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
            <Text>Subtotal:</Text>
            <Text>{subtotal.toFixed(2)} ETB</Text>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
            <Text>Tax (8%):</Text>
            <Text>{tax.toFixed(2)} ETB</Text>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
            <Text>Shipping:</Text>
            <Text>{shippingCost === 0 ? "Free" : `${shippingCost.toFixed(2)} ETB`}</Text>
          </div>
          <Divider style={{ margin: '20px 0' }} />
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
            <Text strong style={{ fontSize: '16px' }}>Total:</Text>
            <Text strong style={{ fontSize: '16px', color: '#53E458' }}>{total.toFixed(2)} ETB</Text>
          </div>

          <Button
  type="primary"
  size="large"
  block
  loading={placingOrder || orderLoading}
  onClick={handlePlaceOrder}
  style={{
    backgroundColor: '#53E458',
    borderColor: '#53E458',
    color: 'white',
  }}
>
  {paymentMethod === "telebirr" ? "Proceed to Payment" : "Place Order"}
</Button>

        </Card>
      </Space>

      {/* Payment Processing Modal */}
      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center', color: '#53E458' }}>
            <div style={{
              width: 60,
              height: 60,
              backgroundColor: '#53E458',
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: '10px'
            }}>
              <img
  src={telebirLogo}
  alt="Telebirr"
  style={{
    width: '50px',
    height: '50px',
    objectFit: 'contain',
    verticalAlign: 'middle'
  }}
/>

            </div>
            <span>Telebirr Payment Processing</span>
          </div>
        }
        visible={showPaymentModal}
        onCancel={handlePaymentModalCancel}
        footer={null}
        width={600}
        closable={currentStep < 2}
        maskClosable={false}
        bodyStyle={{ padding: '24px' }}
      >
        <Steps current={currentStep} style={{ marginBottom: 30 }}>
          <Step title="Order Created" />
          <Step title="Payment" />
          <Step title="Complete" />
        </Steps>
        
        {currentStep === 0 && (
          <div style={{ textAlign: "center", padding: '20px 0' }}>
            <Spin size="large" />
            <p style={{ marginTop: 15 }}>Preparing your order...</p>
          </div>
        )}
        
        {currentStep === 1 && (
          <div>
            {paymentMethod === "telebirr" ? (
              <div style={{ textAlign: "center", padding: '10px 0' }}>
                <div style={{ 
                  backgroundColor: '#f0f9f0', 
                  padding: '20px', 
                  borderRadius: '8px',
                  border: '1px solid #e1f3e1',
                  marginBottom: '20px'
                }}>
                  <div style={{
                    width: 60,
                    height: 60,
                    backgroundColor: '#53E458',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 15px'
                  }}>
                    <span style={{ color: 'white', fontWeight: 'bold', fontSize: '24px' }}>T</span>
                  </div>
                  <Spin size="large" style={{ color: '#53E458' }} />
                  <p style={{ marginTop: 15, fontWeight: '500' }}>Redirecting to Telebirr payment gateway...</p>
                  <Alert 
                    message="Please complete the payment in the Telebirr app"
                    type="info"
                    style={{ marginTop: 16, backgroundColor: '#e6f7ff' }}
                  />
                  <div style={{ marginTop: 16 }}>
                    <Text type="secondary">
                      If you are not redirected automatically, check your phone for a payment request.
                    </Text>
                  </div>
                </div>
              </div>
            ) : (
              <div style={{ textAlign: "center", padding: '20px 0' }}>
                <p>Preparing your order for cash on delivery...</p>
              </div>
            )}
          </div>
        )}
        
        {currentStep === 2 && (
          <div style={{ textAlign: "center", padding: '20px 0' }}>
            <div style={{
              width: 60,
              height: 60,
              backgroundColor: '#53E458',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 15px'
            }}>
              <span style={{ color: 'white', fontWeight: 'bold', fontSize: '24px' }}>✓</span>
            </div>
            <Alert
              message="Payment Successful!"
              description="Your order has been placed successfully. Redirecting to order confirmation..."
              type="success"
              style={{ backgroundColor: '#f6ffed', borderColor: '#b7eb8f' }}
            />
          </div>
        )}
      </Modal>
    </div>
  );
};

export default CheckoutPage;
