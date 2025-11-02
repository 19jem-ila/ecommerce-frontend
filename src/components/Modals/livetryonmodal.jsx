import React, { useRef, useEffect, useState } from "react";
import { Modal, Spin } from "antd";
import * as faceapi from "face-api.js";

const LiveTryOnModal = ({ visible, onClose, productImage }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!visible || !productImage) return;

    let animationFrameId;
    let lastDetections = null;

    const startLiveTryOn = async () => {
      try {
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
          faceapi.nets.faceLandmark68TinyNet.loadFromUri("/models"),
        ]);

        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }

        const img = new Image();
        img.src = productImage;
        await new Promise((resolve) => (img.onload = resolve));

        setLoading(false);

        const detectFace = async () => {
          if (!videoRef.current || !canvasRef.current) return;

          const detection = await faceapi
            .detectSingleFace(
              videoRef.current,
              new faceapi.TinyFaceDetectorOptions({ inputSize: 224, scoreThreshold: 0.5 })
            )
            .withFaceLandmarks(true);

          if (detection) lastDetections = detection;

          const canvas = canvasRef.current;
          const ctx = canvas.getContext("2d");
          if (!ctx) return;

          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.setTransform(-1, 0, 0, 1, canvas.width, 0); // mirror

          if (lastDetections) {
            const leftEye = lastDetections.landmarks.getLeftEye();
            const rightEye = lastDetections.landmarks.getRightEye();
            const nose = lastDetections.landmarks.getNose();

            // 1️⃣ Center between eyes
            const eyeCenterX = (leftEye[0].x + rightEye[3].x) / 2;
            const eyeCenterY = (leftEye[0].y + rightEye[3].y) / 2;

            // 2️⃣ Distance between eyes
            const dx = rightEye[3].x - leftEye[0].x;
            const dy = rightEye[3].y - leftEye[0].y;
            const eyeDistance = Math.sqrt(dx * dx + dy * dy);

            // 3️⃣ Nose bridge length (for better scaling)
            const noseTop = nose[0]; // top of nose
            const noseBottom = nose[6]; // tip of nose
            const noseLength = Math.sqrt(
              Math.pow(noseBottom.x - noseTop.x, 2) + Math.pow(noseBottom.y - noseTop.y, 2)
            );

            // 4️⃣ Glasses width & height
            const glassesWidth = eyeDistance * 2.5; // bigger scaling
            const glassesHeight = (img.height / img.width) * glassesWidth;

            // 5️⃣ Rotation
            const angle = Math.atan2(dy, dx);

            // 6️⃣ Draw glasses
            ctx.save();
            ctx.translate(canvas.width - eyeCenterX, eyeCenterY);
            ctx.rotate(angle);
            ctx.drawImage(
              img,
              -glassesWidth / 2,
              -glassesHeight / 2 - noseLength * 0.2, // adjust for nose
              glassesWidth,
              glassesHeight
            );
            ctx.restore();
          }

          animationFrameId = requestAnimationFrame(detectFace);
        };

        detectFace();
      } catch (err) {
        console.error("Live try-on error:", err);
      }
    };

    startLiveTryOn();

    return () => {
      if (videoRef.current?.srcObject) {
        videoRef.current.srcObject.getTracks().forEach((t) => t.stop());
      }
      cancelAnimationFrame(animationFrameId);
    };
  }, [visible, productImage]);

  return (
    <Modal
      title="Live Try-On"
      open={visible}
      onCancel={onClose}
      footer={null}
      width={500}
      bodyStyle={{ position: "relative", padding: 0, minHeight: 400 }}
    >
      {loading && (
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: 10,
          }}
        >
          <Spin size="large" tip="Loading models & camera..." />
        </div>
      )}
      <div style={{ position: "relative" }}>
        <video
          ref={videoRef}
          width="100%"
          autoPlay
          muted
          playsInline
          style={{ display: "block", transform: "scaleX(-1)" }}
        />
        <canvas
          ref={canvasRef}
          width={500}
          height={400}
          style={{ position: "absolute", top: 0, left: 0 }}
        />
      </div>
    </Modal>
  );
};

export default LiveTryOnModal;
