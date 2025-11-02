import React from 'react';
import { Link } from 'react-router-dom';
import './Brands.css';


import OakleyLogo from '../../assets/images/oakley-logo.jpg';
import RayBanLogo from '../../assets/images/ray-ban-logo.jpg';
import GucciLogo from '../../assets/images/gucci.jpg';
import PradaLogo from '../../assets/images/prada.jpg';
import VersaceLogo from '../../assets/images/versace-logo.jpg';
import ArmaniLogo from '../../assets/images/Armania-logo.jpg';
import DiorLogo from '../../assets/images/Dior-logo.jpg';


const Brands = () => {
  const brands = [
    {
      id: 1,
      name: 'Oakley',
      logo: OakleyLogo,
      description: 'Performance eyewear for athletes',
      products: '120+ products',
      link: 'products/category/brands'
    },
    {
      id: 2,
      name: 'Ray-Ban',
      logo: RayBanLogo,
      description: 'Iconic sunglasses since 1937',
      products: '95+ products',
      link: 'products/category/brands'
    },
    {
      id: 3,
      name: 'Gucci',
      logo: GucciLogo,
      description: 'Luxury Italian fashion house',
      products: '75+ products',
      link: 'products/category/brands'
    },
    {
      id: 4,
      name: 'Prada',
      logo: PradaLogo,
      description: 'Sophisticated Italian design',
      products: '60+ products',
      link: 'products/category/brands'
    },
    {
      id: 5,
      name: 'Versace',
      logo: VersaceLogo,
      description: 'Bold and luxurious eyewear',
      products: '55+ products',
      link: 'products/category/brands'
    },
    {
      id: 6,
      name: 'Armani',
      logo: ArmaniLogo,
      description: 'Elegant and timeless designs',
      products: '70+ products',
      link: 'products/category/brands'
    },
    {
      id: 7,
      name: 'Dior',
      logo: DiorLogo,
      description: 'French luxury and sophistication',
      products: '65+ products',
      link: 'products/category/brands'
    },
   
  ];

  return (
    <section className="brands-section">
      <div className="container">
        {/* Section Header */}
        <div className="brands-header">
          <h2 className="brands-title">Featured Brands</h2>
          <p className="brands-subtitle">
            Discover premium eyewear from world-renowned brands
          </p>
        </div>

        {/* Brands Grid */}
        <div className="brands-grid">
          {brands.map((brand) => (
            <Link 
              key={brand.id} 
              to={brand.link} 
              className="brand-card"
            >
              <div className="brand-card-inner">
                <div className="brand-logo-container">
                  <img 
                    src={brand.logo} 
                    alt={`${brand.name} logo`}
                    className="brand-logo"
                  />
                </div>
                <div className="brand-info">
                  <h3 className="brand-name">{brand.name}</h3>
                  <p className="brand-description">{brand.description}</p>
                  <span className="product-count">{brand.products}</span>
                </div>
                <div className="brand-overlay">
                  <span className="view-brand-text">View Collection</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* View All Brands CTA */}
        <div className="brands-cta">
          <Link to="products/category/brands" className="view-all-brands-btn">
            View All Brands
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Brands;