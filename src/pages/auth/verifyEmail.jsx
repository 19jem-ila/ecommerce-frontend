// import React, { useEffect, useState } from "react";
// import { useSearchParams, useNavigate } from "react-router-dom";
// import { Typography, Button, Spin, message } from "antd";
// import { authService } from "../../services/authService";

// const { Title, Text } = Typography;

// const VerifyEmailPage = () => {
//   const [searchParams] = useSearchParams();
//   const navigate = useNavigate();
//   const [loading, setLoading] = useState(true);
//   const [status, setStatus] = useState(""); // "success" | "error"
//   const [resending, setResending] = useState(false);

 
// const uid = searchParams.get("uid");


//   useEffect(() => {
//     if (!uid) {
//       setStatus("error");
//       setLoading(false);
//       return;
//     }

//     const verifyEmail = async () => {
//       try {
//         await authService.verifyEmail(uid);
//         setStatus("success");
//         message.success("Your email has been verified!");
//       } catch (err) {
//         console.error(err);
//         setStatus("error");
//         message.error(err.message || "Email verification failed");
//       } finally {
//         setLoading(false);
//       }
//     };

//     verifyEmail();
//   }, [uid]);

//   const handleLoginRedirect = () => {
//     navigate("/login");
//   };

//   const handleResendVerification = async () => {
//     setResending(true);
//     try {
//       await authService.resendVerification();
//       message.success("Verification email resent. Check your inbox!");
//     } catch (err) {
//       console.error(err);
//       message.error(err.message || "Failed to resend verification email");
//     } finally {
//       setResending(false);
//     }
//   };

//   return (
//     <div
//       style={{
//         maxWidth: 400,
//         margin: "50px auto",
//         padding: 20,
//         border: "1px solid #f0f0f0",
//         borderRadius: 8,
//         textAlign: "center",
//       }}
//     >
//       {loading ? (
//         <Spin size="large" />
//       ) : status === "success" ? (
//         <>
//           <Title level={2}>Email Verified!</Title>
//           <Text>Your email has been successfully verified.</Text>
//           <div style={{ marginTop: 20 }}>
//             <Button type="primary" onClick={handleLoginRedirect}>
//               Go to Login
//             </Button>
//           </div>
//         </>
//       ) : (
//         <>
//           <Title level={2}>Verification Failed</Title>
//           <Text>Invalid or expired verification link.</Text>
//           <div style={{ marginTop: 20, display: "flex", flexDirection: "column", gap: 10 }}>
//             <Button type="primary" onClick={handleLoginRedirect}>
//               Go to Login
//             </Button>
//             <Button type="default" loading={resending} onClick={handleResendVerification}>
//               Resend Verification Email
//             </Button>
//           </div>
//         </>
//       )}
//     </div>
//   );
// };

// export default VerifyEmailPage;

import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Typography, Spin, message } from "antd";
import { MailOutlined, CheckCircleFilled, CloseCircleFilled } from "@ant-design/icons";
import { authService } from "../../services/authService";
import CustomButton from "../../components/ui/CustomButton";

const { Title, Text } = Typography;

const VerifyEmailPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState(""); // "success" | "error"
  const [resending, setResending] = useState(false);

  const uid = searchParams.get("uid");

  useEffect(() => {
    if (!uid) {
      setStatus("error");
      setLoading(false);
      return;
    }

    const verifyEmail = async () => {
      try {
        await authService.verifyEmail(uid);
        setStatus("success");
        message.success("Your email has been verified successfully!");
      } catch (err) {
        console.error(err);
        setStatus("error");
        message.error(err.message || "Email verification failed. The link may be invalid or expired.");
      } finally {
        setLoading(false);
      }
    };

    verifyEmail();
  }, [uid]);

  const handleLoginRedirect = () => {
    navigate("/login");
  };

  const handleResendVerification = async () => {
    setResending(true);
    try {
      await authService.resendVerification();
      message.success("Verification email sent! Please check your inbox.");
    } catch (err) {
      console.error(err);
      message.error(err.message || "Failed to resend verification email");
    } finally {
      setResending(false);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        padding: "20px",
        backgroundColor: "#f8f9fa"
      }}
    >
      <div
        style={{
          background: "white",
          padding: "40px",
          borderRadius: "12px",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
          width: "100%",
          maxWidth: "480px",
          textAlign: "center"
        }}
      >
        {loading ? (
          <div style={{ padding: "40px 0" }}>
            <Spin size="large" style={{ marginBottom: "20px" }} />
            <Text style={{ color: "#666", fontSize: "16px" }}>Verifying your email...</Text>
          </div>
        ) : status === "success" ? (
          <>
            <div
              style={{
                color: "#52c41a",
                fontSize: "48px",
                marginBottom: "20px"
              }}
            >
              <CheckCircleFilled />
            </div>
            <Title level={2} style={{ color: "#333", marginBottom: "16px" }}>
              Email Verified Successfully!
            </Title>
            <Text style={{ color: "#666", fontSize: "16px", lineHeight: "1.5", display: "block", marginBottom: "30px" }}>
              Your email address has been successfully verified. You can now access all features of our platform.
            </Text>
            <CustomButton
              variant="primary"
              size="md"
              onClick={handleLoginRedirect}
              style={{ minWidth: "150px" }}
            >
              Continue to Login
            </CustomButton>
          </>
        ) : (
          <>
            <div
              style={{
                color: "#ff4d4f",
                fontSize: "48px",
                marginBottom: "20px"
              }}
            >
              <CloseCircleFilled />
            </div>
            <Title level={2} style={{ color: "#333", marginBottom: "16px" }}>
              Verification Failed
            </Title>
            <Text style={{ color: "#666", fontSize: "16px", lineHeight: "1.5", display: "block", marginBottom: "30px" }}>
              The verification link is invalid or has expired. Please request a new verification email or contact support if the issue persists.
            </Text>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "12px", maxWidth: "250px", margin: "0 auto" }}>
              <CustomButton
                variant="primary"
                size="md"
                onClick={handleLoginRedirect}
              >
                Go to Login
              </CustomButton>
              
              <CustomButton
                variant="outline"
                size="md"
                loading={resending}
                onClick={handleResendVerification}
                icon={<MailOutlined />}
              >
                Resend Verification
              </CustomButton>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default VerifyEmailPage;















