// src/pages/ForgotPasswordPage.jsx
import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Input, Typography, message, Spin } from "antd";
import { Link } from "react-router-dom";
import { MailOutlined } from "@ant-design/icons";
import CustomButton from "../../components/ui/CustomButton";
import authService from "../../services/authService"; 
import "./ForgetReset.css"; 

const { Title, Text } = Typography;

const ForgotPasswordSchema = Yup.object().shape({
  email: Yup.string()
    .email("Please enter a valid email address")
    .required("Email is required"),
});

const ForgotPasswordPage = () => {
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = async (values, { resetForm }) => {
    setLoading(true);
    try {
      await authService.forgotPassword(values.email);

      message.success("Password reset instructions sent to your email!");
      resetForm();
    } catch (err) {
      message.error(err.message || "Failed to send reset instructions");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <Title level={2} className="auth-title">
          Forgot Password
        </Title>
        <Text className="auth-subtitle">
          Enter your email address and we'll send you instructions to reset your password.
        </Text>

        <Formik
          initialValues={{ email: "" }}
          validationSchema={ForgotPasswordSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="auth-form">
              <div className="form-group">
                <label>Email Address</label>
                <Field 
                  name="email" 
                  type="email" 
                  as={Input} 
                  placeholder="Enter your email" 
                  prefix={<MailOutlined />}
                  className="form-input"
                />
                <ErrorMessage name="email" component="div" className="error-message" />
              </div>

              <CustomButton
                variant="primary"
                size="md"
                block
                htmlType="submit"
                disabled={loading || isSubmitting}
                className="auth-button"
              >
                {loading ? <Spin /> : "Send Reset Link"}
              </CustomButton>
            </Form>
          )}
        </Formik>

        <div className="auth-redirect">
          Remember your password? <Link to="/login" className="auth-link">Back to Login</Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
