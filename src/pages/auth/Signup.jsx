// src/pages/SignupPage.jsx
import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Input, Typography, message, Spin, Checkbox, Divider } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../../store/slices/authSlice";
import { authService } from "../../services/authService";
import googleIcon from "../../assets/logo/google_icon-icons.webp";
import CustomButton from "../../components/ui/CustomButton";
import { Link } from "react-router-dom";
import { UserOutlined, MailOutlined, LockOutlined } from "@ant-design/icons";
import "./signup.css";

const { Title, Text } = Typography;

// 🔹 Validation schema matching backend Joi
const SignupSchema = Yup.object().shape({
  displayName: Yup.string()
    .min(3, "Display name must be at least 3 characters")
    .max(30, "Display name cannot be more than 30 characters")
    .optional(),

  email: Yup.string()
    .email("Please enter a valid email address")
    .required("Email is required"),

  password: Yup.string()
    .min(8, "Password must be at least 8 characters long")
    .max(64, "Password cannot be longer than 64 characters")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).*$/,
      "Password must include at least 1 uppercase, 1 lowercase, 1 number, and 1 special character"
    )
    .required("Password is required"),

  termsAccepted: Yup.boolean()
    .oneOf([true], "You must accept the terms and privacy policy")
    .required("You must accept the terms and privacy policy"),
});

const SignupPage = () => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);

  const handleSubmit = async (values, { resetForm }) => {
    try {
      const payload = {
        displayName: values.displayName || undefined, // avoid sending empty string
        email: values.email,
        password: values.password,
        termsAccepted: values.termsAccepted,
      };
      console.log("Sending payload to backend:", payload);

      const resultAction = await dispatch(registerUser(payload));
  
      if (registerUser.fulfilled.match(resultAction)) {
        message.success(
          "Registration successful! Please check your email to verify your account."
        );
        resetForm();
      } else {
        message.error(resultAction.payload || "Registration failed");
      }
    } catch (err) {
      console.error(err);
      message.error("Something went wrong");
    }
  };

  const handleGoogleSignup = async () => {
    try {
      const response = await authService.loginWithGoogle();
  
      if (response.user && !response.user.emailVerified) {
        message.warning("Your email is not verified. Please check your inbox for the verification link.");
        return;
      }
  
      message.success("Signed up with Google!");
      
    } catch (err) {
      console.error(err);
      message.error(err.message || "Google signup failed");
    }
  };
  

  return (
    <div className="signup-container">
      <div className="signup-card">
        <Title level={2} className="signup-title">
          Create Your Account
        </Title>
        <Text className="signup-subtitle">
          Join us to start shopping
        </Text>

        <Formik
          initialValues={{
            displayName: "",
            email: "",
            password: "",
            termsAccepted: false,
          }}
          validationSchema={SignupSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, values, setFieldValue }) => (
            <Form className="signup-form">
              <div className="form-group">
                <label>Full Name</label>
                <Field 
                  name="displayName" 
                  as={Input} 
                  placeholder="Enter your name" 
                  prefix={<UserOutlined />}
                  className="form-input"
                />
                <ErrorMessage name="displayName" component="div" className="error-message" />
              </div>

              <div className="form-group">
                <label>Email</label>
                <Field 
                  name="email" 
                  type="email" 
                  as={Input} 
                  placeholder="Enter email" 
                  prefix={<MailOutlined />}
                  className="form-input"
                />
                <ErrorMessage name="email" component="div" className="error-message" />
              </div>

              <div className="form-group">
                <label>Password</label>
                <Field 
                  name="password" 
                  type="password" 
                  as={Input.Password} 
                  placeholder="Enter password" 
                  prefix={<LockOutlined />}
                  className="form-input"
                />
                <ErrorMessage name="password" component="div" className="error-message" />
              </div>

              <div className="form-group checkbox-group">
                <Checkbox
                  checked={values.termsAccepted}
                  onChange={(e) => setFieldValue("termsAccepted", e.target.checked)}
                  className="custom-checkbox"
                >
                  I accept the <a href="/terms" className="terms-link">terms and conditions</a> and <a href="/privacy" className="terms-link">privacy policy</a>
                </Checkbox>
                <ErrorMessage name="termsAccepted" component="div" className="error-message" />
              </div>

              <CustomButton
                variant="primary"
                size="md"
                block
                htmlType="submit"
                disabled={loading || isSubmitting}
                className="signup-button"
              >
                {loading ? <Spin /> : "Create Account"}
              </CustomButton>
              
              {error && <div className="error-message server-error">{error}</div>}
            </Form>
          )}
        </Formik>
        
        <div className="login-redirect">
          Already have an account? <Link to="/login" className="login-link">Log In</Link>
        </div>
        
        <Divider className="divider">Or continue with</Divider>
  
        <CustomButton
          variant="google"
          size="md"
          block
          onClick={handleGoogleSignup}
          className="google-button"
          icon={
            <img
              src={googleIcon}
              alt="Google"
              className="google-icon"
            />
          }
        >
          Sign up with Google
        </CustomButton>
      </div>
    </div>
  );
};

export default SignupPage;