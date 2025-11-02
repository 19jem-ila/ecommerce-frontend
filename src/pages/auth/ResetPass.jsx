// src/pages/ResetPasswordPage.jsx
import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Input, Typography, message, Spin } from "antd";
import { Link, useSearchParams } from "react-router-dom";
import { LockOutlined } from "@ant-design/icons";
import CustomButton from "../../components/ui/CustomButton";
import authService from "../../services/authService"; // ✅ import service
import "./ForgetReset.css";

const { Title, Text } = Typography;

const ResetPasswordSchema = Yup.object().shape({
  password: Yup.string()
    .min(8, "Password must be at least 8 characters long")
    .max(64, "Password cannot be longer than 64 characters")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).*$/,
      "Password must include at least 1 uppercase, 1 lowercase, 1 number, and 1 special character"
    )
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords must match")
    .required("Please confirm your password"),
});

const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const oobCode = searchParams.get("oobCode");
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    if (!oobCode) {
      message.error("Invalid reset password link");
    }
  }, [oobCode]);

  const handleSubmit = async (values, { resetForm }) => {
    if (!oobCode) {
      message.error("Invalid reset password link");
      return;
    }

    setLoading(true);
    try {
      await authService.resetPassword({
        oobCode,
        newPassword: values.password,
        confirmPassword: values.confirmPassword,
      });

      message.success("Password reset successfully!");
      resetForm();
    } catch (err) {
      console.error(err);
      message.error(err.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  if (!oobCode) {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <Title level={2} className="auth-title">Invalid Link</Title>
          <Text className="auth-subtitle">
            This reset password link is invalid or has expired.
          </Text>
          <div className="auth-redirect">
            <Link to="/forgot-password" className="auth-link">
              Request a new reset link
            </Link>
          </div>
          <div className="auth-redirect">
            <Link to="/login" className="auth-link">Back to Login</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <Title level={2} className="auth-title">
          Reset Password
        </Title>
        <Text className="auth-subtitle">
          Please enter your new password below.
        </Text>

        <Formik
          initialValues={{ password: "", confirmPassword: "" }}
          validationSchema={ResetPasswordSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="auth-form">
              <div className="form-group">
                <label>New Password</label>
                <Field
                  name="password"
                  type="password"
                  as={Input.Password}
                  placeholder="Enter new password"
                  prefix={<LockOutlined />}
                  className="form-input"
                />
                <ErrorMessage
                  name="password"
                  component="div"
                  className="error-message"
                />
              </div>

              <div className="form-group">
                <label>Confirm Password</label>
                <Field
                  name="confirmPassword"
                  type="password"
                  as={Input.Password}
                  placeholder="Confirm new password"
                  prefix={<LockOutlined />}
                  className="form-input"
                />
                <ErrorMessage
                  name="confirmPassword"
                  component="div"
                  className="error-message"
                />
              </div>

              <CustomButton
                variant="primary"
                size="md"
                block
                htmlType="submit"
                disabled={loading || isSubmitting}
                className="auth-button"
              >
                {loading ? <Spin /> : "Reset Password"}
              </CustomButton>
            </Form>
          )}
        </Formik>

        <div className="auth-redirect">
          <Link to="/login" className="auth-link">Back to Login</Link>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
