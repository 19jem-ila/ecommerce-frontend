import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faShieldAlt, 
  faPhone, 
  faEnvelope,
  faCheck,
  faStar
} from '@fortawesome/free-solid-svg-icons';
import './lense.css';

// Import images
import LenseHero from '../../assets/images/lense-hero-5.jpg';
import BifocalLensImage from '../../assets/images/bifocal-lense-image.jpg';
import ProgressiveLensImage from '../../assets/images/progressive-lense.avif';
import ReaderLensImage from '../../assets/images/bifocal-lense-image.jpg';
import ContactLensImage from '../../assets/images/bifocal-lense-image.jpg';

const LensesPage = () => {
  const lenses = [
    {
      id: 37,
      name: 'Bifocal Lens',
      subtitle: 'Dual Vision Clarity',
      image: BifocalLensImage,
      category: 'lenses',
      features: [
        'Dual-power lenses for near & distance vision',
        'Lightweight & scratch-resistant material',
        'Anti-glare & UV protection'
      ],
      idealFor: [
        'People with presbyopia',
        'Daily use and professional use'
      ],
      includes: '1 pair of Bifocal lenses (Frame not included)'
    },
    {
      id: 38,
      name: 'Progressive Lenses',
      subtitle: 'Seamless Multi-Distance Vision',
      image: ProgressiveLensImage,
      category: 'lenses',
      features: [
        'No visible lines - smooth transition',
        'Wide field of view with natural focus',
        'Lightweight & scratch-resistant',
        'Available in various materials & coatings'
      ],
      idealFor: [
        'People with presbyopia',
        'Daily use and professional use'
      ],
      includes: '1 pair of Progressive lenses (Frame not included)'
    },
    {
      id: 39,
      name: 'Reader Lenses',
      subtitle: 'Enhanced Reading Experience',
      image: ReaderLensImage,
      category: 'lenses',
      features: [
        'Enhances near vision for reading',
        'Lightweight, durable and scratch resistant',
        'Available in multiple strengths & styles',
        'Optional anti-glare & blue light protection'
      ],
      idealFor: [
        'Reading, screen use & detailed work',
        'Anyone needing magnification for close-up vision'
      ],
      includes: '1 pair of Reader lenses (Frame not included)'
    },
    {
      id: 40,
      name: 'Contact Lenses',
      subtitle: 'Comfortable Daily Wear',
      image: ContactLensImage,
      category: 'lenses',
      features: [
        'Crystal-clear vision with a natural look',
        'Lightweight & comfortable for all day wear',
        'Available in daily, weekly and monthly options',
        'UV protection & moisture-lock technology'
      ],
      idealFor: [
        'People needing vision correction without glasses',
        'Active lifestyle & everyday use'
      ],
      includes: '1 pair of Contact lenses'
    }
  ];

  return (
    <div className="lenses-page">
      {/* Hero Section */}
      <section className="lenses-hero-section">
        <div 
          className="lenses-hero"
          style={{ backgroundImage: `url(${LenseHero})` }}
        >
          <div className="hero-overlay">
            <div className="hero-content">
              <h1 className="hero-title">Premium Vision Solutions</h1>
              <p className="hero-subtitle">
                Advanced lens technology for crystal-clear vision at every distance
              </p>
             
            </div>
          </div>
        </div>
      </section>

      {/* Introduction Section */}
      <section className="lenses-intro-section">
        <div className="container">
          <div className="intro-content">
            <h2 className="intro-title">Precision Crafted Lenses</h2>
            <p className="intro-description">
              Designed for all-day clarity, our bifocal and progressive lenses offer seamless vision correction 
              for both near and far distances. Bifocal lenses feature distinct zones for reading and distance, 
              while progressive lenses provide a smooth, line-free transition between multiple focal points—perfect 
              for everyday wear without compromising on style or comfort.
            </p>
          </div>
        </div>
      </section>

      {/* Lenses Grid Section */}
      <section className="lenses-grid-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Our Lens Collection</h2>
            <p className="section-subtitle">
              Choose from our premium range of vision solutions tailored to your needs
            </p>
          </div>

          <div className="lenses-grid">
            {lenses.map((lens) => (
              <div key={lens.id} className="lens-card" data-id={lens.id} data-category={lens.category}>
                <div className="lens-image-container">
                  <img src={lens.image} alt={lens.name} className="lens-image" />
                  <div className="lens-badge">Premium</div>
                </div>
                
                <div className="lens-content">
                  <h3 className="lens-name">{lens.name}</h3>
                  <p className="lens-subtitle">{lens.subtitle}</p>
                  
                  <div className="lens-property">
                    <div className="lens-property-group">
                      <h4 className="lens-property-title">Features</h4>
                      <ul className="lens-property-list">
                        {lens.features.map((feature, index) => (
                          <li key={index} className="lens-item">
                            <FontAwesomeIcon icon={faCheck} className="lens-property-icon" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="lens-property-group">
                      <h4 className="lens-property-title">Ideal For</h4>
                      <ul className="lens-property-list">
                        {lens.idealFor.map((item, index) => (
                          <li key={index} className="lens-property-item">
                            <FontAwesomeIcon icon={faStar} className="lens-property-icon" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="lens-property-group">
                      <h4 className="lens-property-title">Includes</h4>
                      <p className="includes-text">{lens.includes}</p>
                    </div>
                  </div>

                 
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="lenses-contact-section">
        <div className="container">
          <div className="contact-content">
            <div className="contact-info">
              <h2 className="contact-title">Need Professional Lens Advice?</h2>
              <p className="contact-description">
                Our optical experts are here to help you choose the perfect lenses for your vision needs. 
                Contact us for a personalized consultation and prescription verification.
              </p>
              
              <div className="lens-contact-methods">
                <div className="lens-contact-method">
                  <div className="lens-contact-icon">
                    <FontAwesomeIcon icon={faPhone} />
                  </div>
                  <div className="lens-contact-details">
                    <h4>Call Us</h4>
                    <p className="lens-contact-value">+251944939494</p>
                    <p className="lens-contact-note">Available 9AM - 8PM, Mon - Sat</p>
                  </div>
                </div>

                <div className="lens-contact-method">
                  <div className="lens-contact-icon">
                    <FontAwesomeIcon icon={faEnvelope} />
                  </div>
                  <div className="lens-contact-details">
                    <h4>Email Us</h4>
                    <p className="lens-contact-value">minaoptics@gmail.com</p>
                    <p className="lens-contact-note">Response within 2 hours</p>
                  </div>
                </div>
              </div>

              <div className="contact-features">
                <h4>Why Choose Our Lens Service?</h4>
                <div className="features-grid">
                  <div className="contact-feature">
                    <FontAwesomeIcon icon={faCheck} />
                    <span>Professional Prescription Verification</span>
                  </div>
                  <div className="contact-feature">
                    <FontAwesomeIcon icon={faCheck} />
                    <span>Custom Lens Recommendations</span>
                  </div>
                  <div className="contact-feature">
                    <FontAwesomeIcon icon={faCheck} />
                    <span>Free Digital Eye Test Available</span>
                  </div>
                  <div className="contact-feature">
                    <FontAwesomeIcon icon={faCheck} />
                    <span>Quick Delivery & Installation</span>
                  </div>
                </div>
              </div>
            </div>

           
          </div>
        </div>
      </section>

     
    </div>
  );
};

export default LensesPage; 