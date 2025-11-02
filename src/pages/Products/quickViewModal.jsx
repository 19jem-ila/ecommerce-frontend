
import React, { useState } from "react";
import { Modal, Row, Col, Typography, Divider, Space, Button, Rate } from "antd";
import { useDispatch } from "react-redux";
import { addToCart } from "../../store/slices/cartSlice";

const { Title, Text } = Typography;

const QuickViewModal = ({ visible, product, onClose }) => {
  const dispatch = useDispatch();
  const [selectedColor, setSelectedColor] = useState(product?.colors?.[0] || "");

  if (!product) return null;

  const handleColorSelect = (color) => setSelectedColor(color);

  const handleAddToCart = () => {
    dispatch(addToCart({ product, quantity: 1, color: selectedColor || "default" }));
    onClose();
  };

  return (
    <Modal
      title={product.name}
      visible={visible}
      onCancel={onClose}
      footer={null}
      width={800}
    >
      <Row gutter={24}>
        <Col span={12}>
          <img
            alt={product.name}
            src={product.images[0] || "https://via.placeholder.com/300x300"}
            style={{ width: "100%" }}
          />
        </Col>
        <Col span={12}>
          <Text strong>{product.brand}</Text>
          <Title level={3}>{product.name}</Title>
          <Text strong>${product.price}</Text>
          <Rate disabled defaultValue={product.rating || 4} />
          <Divider />
          <Text>{product.description}</Text>

          {product.colors && product.colors.length > 0 && (
            <div style={{ marginTop: "12px" }}>
              <Text strong>Colors: </Text>
              <Space size="small">
                {product.colors.map((color) => (
                  <div
                    key={color}
                    onClick={() => handleColorSelect(color)}
                    style={{
                      width: "24px",
                      height: "24px",
                      borderRadius: "50%",
                      backgroundColor: color.toLowerCase(),
                      border: selectedColor === color ? "2px solid #000" : "1px solid #ccc",
                      cursor: "pointer",
                    }}
                  />
                ))}
              </Space>
            </div>
          )}

          <Divider />
          <Button type="primary" block onClick={handleAddToCart}>
            Add to Cart
          </Button>
          <Button block style={{ marginTop: "8px" }}>
            Live Try On
          </Button>
        </Col>
      </Row>
    </Modal>
  );
};

export default QuickViewModal;
