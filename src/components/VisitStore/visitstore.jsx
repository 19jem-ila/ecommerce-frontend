import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faMapMarkerAlt, 
  faClock, 
  faPhone, 
  faCar, 
  faWheelchair,
  faWifi
} from '@fortawesome/free-solid-svg-icons';
import './visitstore.css';

// Import store images - you'll need to add these to your assets
import StoreInterior1 from '../../assets/images/store-1-photo.jpg';
import StoreInterior2 from '../../assets/images/store-2-photo.jpg';

const StoreVisit = () => {
  const storeFeatures = [
    {
      icon: faCar,
      title: 'Free Parking',
      description: 'Ample parking space available'
    },
    {
      icon: faWheelchair,
      title: 'Accessible',
      description: 'Wheelchair friendly facility'
    },
    {
      icon: faWifi,
      title: 'Free WiFi',
      description: 'Stay connected while you shop'
    },
    {
      icon: faClock,
      title: 'Express Service',
      description: 'Quick frame adjustments & repairs'
    }
  ];

  const storeLocations = [
    {
      id: 1,
      name: 'Mina Optics - 4kilo Branch',
      address: 'Near to Brhane Selam Printing Press',
      city: 'Addis Ababa, Ethiopia',
      phone: '+251922202929',
      hours: 'Mon-Sat: 9:00 AM - 8:00 PM, Sun: 10:00 AM - 6:00 PM',
      image: StoreInterior1
    },
    {
      id: 2,
      name: 'Mina Optics - City center',
      address: 'Mexico Square, Nib International Building',
      city: 'Addis Ababa, Ethiopia',
      phone: '+251911223344',
      hours: 'Mon-Sat: 9:00 AM - 9:00 PM, Sun: 11:00 AM - 7:00 PM',
      image: StoreInterior2
    }
  ];

  return (
    <section className="store-visit-section">
      <div className="container">
        {/* Section Header */}
        <div className="store-visit-header">
          <h2 className="store-visit-title">Visit Our Stores</h2>
          <p className="store-visit-subtitle">
            Experience premium eyewear in person with our expert fitting services and personalized consultations
          </p>
        </div>

        <div className="store-visit-content">
          {/* Store Locations */}
          <div className="store-locations">
            {storeLocations.map((store, index) => (
              <div key={store.id} className="store-card">
                <div className="store-image-container">
                  <img 
                    src={store.image} 
                    alt={`${store.name} interior`}
                    className="store-image"
                  />
                  <div className="store-badge">
                    <FontAwesomeIcon icon={faMapMarkerAlt} />
                    <span>Store {index + 1}</span>
                  </div>
                </div>
                
                <div className="store-info">
                  <h3 className="store-name">{store.name}</h3>
                  
                  <div className="store-details">
                    <div className="store-detail-item">
                      <div className="detail-icon">
                        <FontAwesomeIcon icon={faMapMarkerAlt} />
                      </div>
                      <div className="detail-content">
                        <p className="detail-title">Address</p>
                        <p className="detail-text">{store.address}</p>
                        <p className="detail-text">{store.city}</p>
                      </div>
                    </div>
                    
                    <div className="store-detail-item">
                      <div className="detail-icon">
                        <FontAwesomeIcon icon={faPhone} />
                      </div>
                      <div className="detail-content">
                        <p className="detail-title">Phone</p>
                        <p className="detail-text">{store.phone}</p>
                      </div>
                    </div>
                    
                    <div className="store-detail-item">
                      <div className="detail-icon">
                        <FontAwesomeIcon icon={faClock} />
                      </div>
                      <div className="detail-content">
                        <p className="detail-title">Opening Hours</p>
                        <p className="detail-text">{store.hours}</p>
                      </div>
                    </div>
                  </div>
                  
                  
                </div>
              </div>
            ))}
          </div>

          {/* Store Features */}
          <div className="store-features">
            <h3 className="features-title">Why Visit Our Store?</h3>
            <div className="features-grid">
              {storeFeatures.map((feature, index) => (
                <div key={index} className="feature-card">
                  <div className="feature-icon">
                    <FontAwesomeIcon icon={feature.icon} />
                  </div>
                  <h4 className="feature-title">{feature.title}</h4>
                  <p className="feature-description">{feature.description}</p>
                </div>
              ))}
            </div>

            {/* Additional Benefits */}
           
<div className="store-benefits-section" id="store-benefits">
  <h4 className="store-benefits-title">In-Store Exclusive Benefits</h4>
  <ul className="store-benefits-list">
    <li>Professional eye examinations available</li>
    <li>Expert frame fitting and adjustments</li>
    <li>Try before you buy - test multiple styles</li>
    <li>Same-day service for minor repairs</li>
    <li>Personalized style consultations</li>
    <li>Exclusive in-store promotions</li>
  </ul>
</div>
          </div>
        </div>

        {/* CTA Section */}
       
      </div>
    </section> 
  );
};

export default StoreVisit;