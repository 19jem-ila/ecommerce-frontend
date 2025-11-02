import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Card, 
  Rate, 
  Button, 
  Input, 
  Avatar, 
  List, 
  Typography, 
  Space, 
  Modal, 
  Form,
  Divider,
  Empty,
  Spin
} from 'antd';
import { 
  StarFilled, 
  EditOutlined, 
  DeleteOutlined, 
  UserOutlined,
  SendOutlined
} from '@ant-design/icons';
import { addOrUpdateReview, deleteReview } from '../../store/slices/reviewSlice';
import './review.css'; 

const { TextArea } = Input;
const { Text, Title } = Typography;
const { confirm } = Modal;

const ReviewSection = ({ productId, reviews = [], userReview, loading }) => {
  const dispatch = useDispatch();
  const [reviewForm] = Form.useForm();
  const [editing, setEditing] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmitReview = async (values) => {
    setSubmitting(true);
    try {
      await dispatch(addOrUpdateReview({
        productId,
        rating: values.rating,
        comment: values.comment,
        reviewId: userReview?._id
      })).unwrap();
      
      reviewForm.resetFields();
      setEditing(false);
    } catch (error) {
      console.error('Failed to submit review:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteReview = () => {
    confirm({
      title: 'Delete Review',
      content: 'Are you sure you want to delete your review?',
      okText: 'Yes, Delete',
      cancelText: 'Cancel',
      okButtonProps: {
        className: 'delete-confirm-btn'
      },
      onOk() {
        dispatch(deleteReview(userReview._id));
      },
    });
  };

  const averageRating = reviews.length > 0 
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
    : 0;

  return (
    <div className="review-section">
      {/* Review Header */}
      <div className="review-header">
        <div className="rating-summary">
          <Title level={2} className="average-rating">{averageRating.toFixed(1)}</Title>
          <Rate disabled value={averageRating} character={<StarFilled />} className="rating-stars" />
          <Text type="secondary" className="review-count">Based on {reviews.length} reviews</Text>
        </div>
        
        {!userReview && !editing && (
          <Button 
            type="primary" 
            icon={<EditOutlined />}
            onClick={() => setEditing(true)}
            className="write-review-btn"
          >
            Write a Review
          </Button>
        )}
      </div>

      <Divider className="review-divider" />

      {/* Review Form */}
      {editing && (
        <Card className="review-form-card">
          <Form
            form={reviewForm}
            onFinish={handleSubmitReview}
            initialValues={{
              rating: userReview?.rating || 5,
              comment: userReview?.comment || ''
            }}
          >
            <Form.Item
              name="rating"
              rules={[{ required: true, message: 'Please select a rating' }]}
            >
              <Rate character={<StarFilled />} className="form-rating-stars" />
            </Form.Item>
            
            <Form.Item
              name="comment"
              rules={[{ required: true, message: 'Please write your review' }]}
            >
              <TextArea
                rows={4}
                placeholder="Share your experience with this product..."
                maxLength={500}
                showCount
                className="review-textarea"
              />
            </Form.Item>
            
            <Space>
              <Button 
                type="primary" 
                htmlType="submit" 
                loading={submitting}
                icon={<SendOutlined />}
                className="submit-review-btn"
              >
                {userReview ? 'Update Review' : 'Submit Review'}
              </Button>
              <Button 
                onClick={() => {
                  setEditing(false);
                  reviewForm.resetFields();
                }}
                className="cancel-review-btn"
              >
                Cancel
              </Button>
            </Space>
          </Form>
        </Card>
      )}

      {/* User's Review */}
      {userReview && !editing && (
        <Card 
          className="user-review-card"
          title="Your Review"
          extra={
            <Space>
              <Button 
                icon={<EditOutlined />} 
                onClick={() => setEditing(true)}
                className="edit-review-btn"
              >
                Edit
              </Button>
              <Button 
                icon={<DeleteOutlined />} 
                danger 
                onClick={handleDeleteReview}
                className="delete-review-btn"
              >
                Delete
              </Button>
            </Space>
          }
        >
          <div className="review-content">
            <Rate disabled value={userReview.rating} character={<StarFilled />} className="user-rating-stars" />
            <Text className="review-comment">{userReview.comment}</Text>
            <Text type="secondary" className="review-date">
              Reviewed on {new Date(userReview.createdAt).toLocaleDateString()}
            </Text>
          </div>
        </Card>
      )}

      {/* Reviews List */}
      <div className="reviews-list">
        <Title level={4} className="reviews-title">Customer Reviews ({reviews.length})</Title>
        
        {loading ? (
          <div className="reviews-loading">
            <Spin size="large" />
          </div>
        ) : reviews.length > 0 ? (
          <List
            dataSource={reviews.filter(review => !userReview || review._id !== userReview._id)}
            renderItem={(review) => (
              <List.Item className="review-list-item">
                <Card size="small" className="review-card">
                  <div className="review-header">
                    <Space>
                      <Avatar icon={<UserOutlined />} className="review-avatar" />
                      <div className="reviewer-info">
                        <Text strong className="reviewer-name">{review.user?.name || 'Anonymous'}</Text>
                        <div className="review-meta">
                          <Rate 
                            disabled 
                            value={review.rating} 
                            character={<StarFilled />} 
                            className="customer-rating-stars"
                          />
                          <Text type="secondary" className="review-date">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </Text>
                        </div>
                      </div>
                    </Space>
                  </div>
                  <Text className="review-comment">{review.comment}</Text>
                </Card>
              </List.Item>
            )}
          />
        ) : (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description="No reviews yet"
            className="no-reviews-empty"
          />
        )}
      </div>
    </div>
  );
};

export default ReviewSection;