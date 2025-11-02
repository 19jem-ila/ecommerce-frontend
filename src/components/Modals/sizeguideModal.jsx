import React from "react";
import { Modal, Table, Tabs } from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";
import CustomButton from "../ui/CustomButton";
import "./Modal.css";

const { TabPane } = Tabs;

const SizeGuideModal = ({ visible, onClose }) => {
  const sizeGuideData = {
    glasses: [
      { size: 'Small', lensWidth: '48-50mm', bridge: '16-18mm', temple: '135-140mm', fit: 'Petite faces' },
      { size: 'Medium', lensWidth: '51-53mm', bridge: '18-20mm', temple: '140-145mm', fit: 'Average faces' },
      { size: 'Large', lensWidth: '54-56mm', bridge: '20-22mm', temple: '145-150mm', fit: 'Larger faces' }
    ],
    sunglasses: [
      { size: 'Small', lensWidth: '55-57mm', bridge: '16-18mm', temple: '135-140mm', fit: 'Petite faces' },
      { size: 'Medium', lensWidth: '58-60mm', bridge: '18-20mm', temple: '140-145mm', fit: 'Average faces' },
      { size: 'Large', lensWidth: '61-63mm', bridge: '20-22mm', temple: '145-150mm', fit: 'Larger faces' }
    ],
    measurements: [
      { part: 'Lens Width', description: 'Horizontal width of each lens' },
      { part: 'Bridge', description: 'Distance between the lenses' },
      { part: 'Temple', description: 'Length of the arms from hinge to tip' },
      { part: 'Lens Height', description: 'Vertical height of each lens' }
    ]
  };

  const sizeColumns = [
    { title: 'Size', dataIndex: 'size', key: 'size' },
    { title: 'Lens Width (mm)', dataIndex: 'lensWidth', key: 'lensWidth' },
    { title: 'Bridge (mm)', dataIndex: 'bridge', key: 'bridge' },
    { title: 'Temple (mm)', dataIndex: 'temple', key: 'temple' },
    { title: 'Recommended Fit', dataIndex: 'fit', key: 'fit' }
  ];

  const measurementColumns = [
    { title: 'Measurement', dataIndex: 'part', key: 'part' },
    { title: 'Description', dataIndex: 'description', key: 'description' }
  ];

  return (
    <Modal
      title="Size Guide"
      visible={visible}
      onCancel={onClose}
      footer={[
        <CustomButton 
          key="close" 
          variant="primary" 
          onClick={onClose}
        >
          Close
        </CustomButton>
      ]}
      className="size-guide-modal"
      width={800}
    >
      <div className="size-guide-content">
        <Tabs defaultActiveKey="glasses" className="size-tabs">
          <TabPane tab="Eyeglasses" key="glasses">
            <div className="size-table-section">
              <h4>Eyeglasses Size Chart</h4>
              <Table 
                dataSource={sizeGuideData.glasses} 
                columns={sizeColumns} 
                pagination={false}
                size="small"
                className="size-table"
              />
            </div>
          </TabPane>
          
          <TabPane tab="Sunglasses" key="sunglasses">
            <div className="size-table-section">
              <h4>Sunglasses Size Chart</h4>
              <Table 
                dataSource={sizeGuideData.sunglasses} 
                columns={sizeColumns} 
                pagination={false}
                size="small"
                className="size-table"
              />
            </div>
          </TabPane>
          
          <TabPane tab="How to Measure" key="measurements">
            <div className="measurement-guide">
              <h4>How to Measure Your Glasses</h4>
              <div className="measurement-image-placeholder">
                <InfoCircleOutlined className="measurement-icon" />
                <p>Visual guide showing how to measure glasses</p>
              </div>
              
              <Table 
                dataSource={sizeGuideData.measurements} 
                columns={measurementColumns} 
                pagination={false}
                size="small"
                className="measurement-table"
              />
              
              <div className="measurement-tips">
                <h5>Tips for Finding Your Perfect Fit:</h5>
                <ul>
                  <li>Measure your current well-fitting glasses for reference</li>
                  <li>Consider your face shape when choosing sizes</li>
                  <li>Check the product description for specific measurements</li>
                  <li>Use our virtual try-on feature when available</li>
                </ul>
              </div>
            </div>
          </TabPane>
        </Tabs>
        
        <div className="size-guide-footer">
          <div className="need-help">
            <h4>Need Help Finding Your Size?</h4>
            <p>Contact our customer service team for personalized sizing assistance.</p>
            <CustomButton variant="primary">
              Contact Support
            </CustomButton>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default SizeGuideModal;