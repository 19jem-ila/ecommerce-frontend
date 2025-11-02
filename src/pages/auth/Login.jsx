// src/pages/LoginPage.jsx
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Input, Typography, Divider, message, Spin } from "antd";
import { loginUser } from "../../store/slices/authSlice";
import { authService } from "../../services/authService";
import googleIcon from "../../assets/logo/google_icon-icons.webp";
import CustomButton from "../../components/ui/CustomButton";
import { MailOutlined, LockOutlined } from "@ant-design/icons";
import "./login.css"; 

const { Title, Text } = Typography;

// 🔹 Validation schema
const LoginSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
});

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { loading, error } = useSelector((state) => state.auth);
  const from = location.state?.from?.pathname || "/";

  // Email/password login
  const handleEmailLogin = async (values, { setSubmitting }) => {
    try {
      const resultAction = await dispatch(loginUser(values));

      if (loginUser.fulfilled.match(resultAction)) {
        const { user } = resultAction.payload;

        if (user && !user.emailVerified) {
          message.warning("Your email is not verified. Please check your inbox for the verification link.");
          return;
        }

        message.success("Logged in successfully!");
        navigate(from, { replace: true });
      } else {
        message.error(resultAction.payload || "Login failed");
      }
    } catch (err) {
      console.error(err);
      message.error(err.message || "Login failed");
    } finally {
      setSubmitting(false);
    }
  };

  // Google login
  const handleGoogleLogin = async () => {
    try {
      const response = await authService.loginWithGoogle();

      if (response.user && !response.user.emailVerified) {
        message.warning("Your email is not verified. Please check your inbox for the verification link.");
        return;
      }

      message.success("Logged in with Google!");
      navigate(from, { replace: true });
    } catch (err) {
      console.error(err);
      message.error(err.message || "Google login failed");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <Title level={2} className="login-title">
          Welcome Back
        </Title>
        <Text className="login-subtitle">
          Sign in to continue shopping
        </Text>

        <Formik
          initialValues={{ email: "", password: "" }}
          validationSchema={LoginSchema}
          onSubmit={handleEmailLogin}
        >
          {({ isSubmitting }) => (
            <Form className="login-form">
              <div className="form-group">
                <label>Email</label>
                <Field 
                  name="email" 
                  as={Input} 
                  placeholder="Enter your email" 
                  prefix={<MailOutlined />}
                  className="form-input"
                />
                <ErrorMessage name="email" component="div" className="error-message" />
              </div>

              <div className="form-group">
                <div className="password-label-container">
                  <label>Password</label>
                  <Link to="/forgot-password" className="forgot-password-link">
                    Forgot password?
                  </Link>
                </div>
                <Field 
                  name="password" 
                  as={Input.Password} 
                  placeholder="Enter your password" 
                  prefix={<LockOutlined />}
                  className="form-input"
                />
                <ErrorMessage name="password" component="div" className="error-message" />
              </div>

              <CustomButton
                variant="primary"
                size="md"
                block
                htmlType="submit"
                disabled={loading || isSubmitting}
                className="login-button"
              >
                {loading ? <Spin /> : "Sign In"}
              </CustomButton>

              {error && <div className="error-message server-error">{error}</div>}
            </Form>
          )}
        </Formik>

        <div className="signup-redirect">
          Don't have an account? <Link to="/" className="signup-link">Sign Up</Link>
        </div>

        <Divider className="divider">Or continue with</Divider>

        <CustomButton
          variant="google"
          size="md"
          block
          onClick={handleGoogleLogin}
          className="google-button"
          icon={
            <img
              src={googleIcon}
              alt="Google"
              className="google-icon"
            />
          }
        >
          Sign In with Google
        </CustomButton>
      </div>
    </div>
  );
};

export default LoginPage;