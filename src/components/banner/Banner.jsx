import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faChevronLeft, 
  faChevronRight,
  faTruck,
  faRotateLeft,
  faCalendarCheck
} from '@fortawesome/free-solid-svg-icons';
import './Banner.css';

// Import your banner images
import EyeGlassBanner from "../../assets/images/eye-glass-banner-removebg-preview.png";
import SunGlassBanner from '../../assets/images/sun-glass-banner-removebg-preview.png';
import BrandsBanner from '../../assets/images/brands-banner-removebg-preview.png';
import SportsBanner from '../../assets/images/sport-glass-bannner-removebg-preview.png';

const HomeBanner = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const banners = [
    {
      id: 1,
       background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
      // background: 'linear-gradient(135deg, #0f77a3 0%, #0a5a8a 100%)',
      image: EyeGlassBanner,
      title: 'Find the perfect eye wear',
      subtitle: 'Get up to 20% free',
      textColor: '#ffffff',
      link: 'products/category/eyeglasses'
    },
    {
      id: 2,
      background: 'linear-gradient(135deg, #7c3116 0%, #da7f61 100%)',
      image: SunGlassBanner,
      title: 'Shine brighter. See clearer.',
      subtitle: 'Summer shades now!',
      textColor: '#ffffff',
      link: 'products/category/sunglasses'
    },
    {
      id: 3,
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      image: BrandsBanner,
      title: 'Elevate Your Vision!',
      subtitle: 'Where Style Meets Craftsmanship',
      textColor: '#ffffff',
      link: 'products/category/brands'
    },
    {
      id: 4,
      background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
      image: SportsBanner,
      title: 'Unleash Your Game!',
      subtitle: 'Sport-Glasses Built For Champions',
      textColor: '#ffffff',
      link: 'products/category/sports'
    }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === banners.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? banners.length - 1 : prev - 1));
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  // Auto slide every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 5000);

    return () => clearInterval(interval);
  }, [currentSlide]);

  return (
    <section className="home-banner-section">
      {/* Banner Header */}
      <div className="banner-header">
        <p className="banner-promo-text">
          Buy one Get one for free!
        </p>
      </div>

      {/* Main Banner Slider */}
      <div className="banner-slider">
        <div 
          className="banner-slides-container"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {banners.map((banner, index) => (
            <div
              key={banner.id}
              className="banner-slide"
              style={{ 
                background: banner.background,
                color: banner.textColor
              }}
            >
              <div className="banner-content">
                <div className="banner-text">
                  <h2 className="banner-title">{banner.title}</h2>
                  <h3 className="banner-subtitle">{banner.subtitle}</h3>
                  <Link to={banner.link} className="banner-cta-btn">
                    Shop Now
                  </Link>
                </div>
                <div className="banner-image">
                  <img 
                    src={banner.image} 
                    alt={`${banner.title} banner`}
                    className="slide-image"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Arrows */}
        <button className="slider-arrow slider-arrow-left" onClick={prevSlide}>
          <FontAwesomeIcon icon={faChevronLeft} />
        </button>
        <button className="slider-arrow slider-arrow-right" onClick={nextSlide}>
          <FontAwesomeIcon icon={faChevronRight} />
        </button>

        {/* Slide Indicators */}
        <div className="slide-indicators">
          {banners.map((_, index) => (
            <button
              key={index}
              className={`indicator ${index === currentSlide ? 'active' : ''}`}
              onClick={() => goToSlide(index)}
            />
          ))}
        </div>
      </div>

      {/* Banner Footer */}
      <div className="banner-footer">
        <div className="footer-item">
          <div className="footer-icon" id ="banner-ship">
            <FontAwesomeIcon icon={faTruck} />
          </div>
          <p >Free shipping</p>
        </div>
        <div className="footer-item">
          <div className="footer-icon">
            <FontAwesomeIcon icon={faRotateLeft} />
          </div>
          <p>14 Days-free returns</p>
        </div>
        <div className="footer-item">
          <div className="footer-icon">
            <FontAwesomeIcon icon={faCalendarCheck} />
          </div>
          <p>365-Days warranty</p>
        </div>
      </div>
    </section>
  );
};

export default HomeBanner;