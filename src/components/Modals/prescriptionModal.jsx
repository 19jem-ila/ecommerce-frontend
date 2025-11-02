import React, { useState } from "react";
import { Modal, Upload, message } from "antd";
import { UploadOutlined, CloseOutlined } from "@ant-design/icons";
import CustomButton from "../ui/CustomButton";
import "./Modal.css";

const { Dragger } = Upload;

const PrescriptionModal = ({ visible, onClose, product }) => {
  const [uploadedFiles, setUploadedFiles] = useState([]);

  const uploadProps = {
    name: 'file',
    multiple: true,
    accept: '.pdf,.jpg,.jpeg,.png,.doc,.docx',
    beforeUpload: (file) => {
      const isLt5M = file.size / 1024 / 1024 < 5;
      if (!isLt5M) {
        message.error('File must be smaller than 5MB!');
        return Upload.LIST_IGNORE;
      }
      setUploadedFiles(prev => [...prev, file]);
      return false;
    },
    fileList: uploadedFiles,
    onRemove: (file) => {
      setUploadedFiles(prev => prev.filter(f => f.uid !== file.uid));
    }
  };

  const handleSubmit = () => {
    if (uploadedFiles.length > 0) {
      message.success('Prescription uploaded successfully!');
      onClose();
      setUploadedFiles([]);
    } else {
      message.warning('Please upload at least one prescription file');
    }
  };

  const handleCancel = () => {
    setUploadedFiles([]);
    onClose();
  };

  return (
    <Modal
      title="Upload Your Prescription"
      visible={visible}
      onCancel={handleCancel}
      footer={[
        <CustomButton 
          key="cancel" 
          variant="secondary" 
          onClick={handleCancel}
        >
          Cancel
        </CustomButton>,
        <CustomButton 
          key="submit" 
          variant="primary" 
          onClick={handleSubmit}
        >
          Submit Prescription
        </CustomButton>
      ]}
      className="prescription-modal"
      width={600}
    >
      <div className="prescription-modal-content">
        <div className="upload-section">
          <Dragger {...uploadProps} className="prescription-upload">
            <p className="ant-upload-drag-icon">
              <UploadOutlined />
            </p>
            <p className="ant-upload-text">Click or drag files to upload your prescription</p>
            <p className="ant-upload-hint">
              Supported formats: PDF, JPG, PNG, DOC, DOCX (Max 5MB per file)
            </p>
          </Dragger>
        </div>
        
        {uploadedFiles.length > 0 && (
          <div className="uploaded-files">
            <h4>Uploaded Files:</h4>
            <div className="file-list">
              {uploadedFiles.map((file, index) => (
                <div key={index} className="file-item">
                  <span className="file-name">{file.name}</span>
                  <span className="file-size">({(file.size / 1024).toFixed(1)} KB)</span>
                  <CloseOutlined 
                    className="remove-file" 
                    onClick={() => {
                      setUploadedFiles(prev => prev.filter(f => f.uid !== file.uid));
                    }} 
                  />
                </div>
              ))}
            </div>
          </div>
        )}
        
        <div className="prescription-info">
          <h4>Prescription Guidelines:</h4>
          <ul>
            <li>Ensure your prescription is clear and readable</li>
            <li>Include both eyes (OD and OS) measurements</li>
            <li>Make sure the expiration date is visible if applicable</li>
            <li>Include your personal information and doctor's details</li>
          </ul>
        </div>
      </div>
    </Modal>
  );
};

export default PrescriptionModal;