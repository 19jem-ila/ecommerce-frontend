import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faShieldAlt, 
  faCheck, 
  faPhone, 
  faEnvelope, 
  faChevronDown,
  faChevronUp,
  faMapMarkerAlt // Added location icon
} from '@fortawesome/free-solid-svg-icons';
import { 
  faFacebookF, 
  faInstagram, 
  faTelegram, 
  faTiktok 
} from '@fortawesome/free-brands-svg-icons';
import './Footer.css';
import CBELogo from "../../assets/logo/CBE-noor-logo.jpg";
import ZamazmLogo from "../../assets/logo/zamzam-bank-logo-removebg-preview.png";
import TelebirrLogo from "../../assets/logo/telebirr logo.png";
import ChapaLogo from "../../assets/logo/Chapa-Logo-2.png";

const FooterAndGuarantee = () => {
  const [activeSection, setActiveSection] = useState(null);

  const toggleSection = (section) => {
    if (activeSection === section) {
      setActiveSection(null);
    } else {
      setActiveSection(section);
    }
  };

  return (
    <>
      {/* Guarantee Section */}
      <section className="guarantee-section">
        <div className="container">
          <div className="guarantee-content">
            <div className="guarantee-icon">
              <FontAwesomeIcon icon={faShieldAlt} />
            </div>
            <h2>Perfect Pair Guarantee</h2>
            <p>As glasses wearers, we're committed to ensuring you the perfect pair, with stylish frames and premium quality lenses. Not satisfied? We offer free returns within 30 days.</p>
            <div className="guarantee-features">
              <div className="feature">
                <FontAwesomeIcon icon={faCheck} />
                <span>30-Day Free Returns</span>
              </div>
              <div className="feature">
                <FontAwesomeIcon icon={faCheck} />
                <span>Premium Lenses Included</span>
              </div>
              <div className="feature">
                <FontAwesomeIcon icon={faCheck} />
                <span>24-Month Warranty</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="footer">
        <div className="container">
          <div className="footer-top">
            <div className="footer-nav">
              <div className="nav-section">
                <div 
                  className="nav-header" 
                  onClick={() => toggleSection('company')}
                >
                  <h3>Company</h3>
                  <span className={`toggle-icon ${activeSection === 'company' ? 'active' : ''}`}>
                    <FontAwesomeIcon 
                      icon={activeSection === 'company' ? faChevronUp : faChevronDown} 
                    />
                  </span>
                </div>
                <ul className={`nav-links ${activeSection === 'company' ? 'active' : ''}`}>
                  <li><Link to="/about">About us</Link></li>
                  <li><Link to="/contact">Contact us</Link></li>
                  <li><Link to="/stores">Store locator</Link></li>
                </ul>
              </div>

              <div className="nav-section">
                <div 
                  className="nav-header" 
                  onClick={() => toggleSection('support')}
                >
                  <h3>Support</h3>
                  <span className={`toggle-icon ${activeSection === 'support' ? 'active' : ''}`}>
                    <FontAwesomeIcon 
                      icon={activeSection === 'support' ? faChevronUp : faChevronDown} 
                    />
                  </span>
                </div>
                <ul className={`nav-links ${activeSection === 'support' ? 'active' : ''}`}>
                  <li><Link to="/faq">FAQs</Link></li>
                  <li><Link to="/shipping">Shipping & Returns</Link></li>
                  <li><Link to="/warranty">Warranty & Repair</Link></li>
                </ul>
              </div>

              <div className="nav-section">
                <div 
                  className="nav-header" 
                  onClick={() => toggleSection('shop')}
                >
                  <h3>Shop</h3>
                  <span className={`toggle-icon ${activeSection === 'shop' ? 'active' : ''}`}>
                    <FontAwesomeIcon 
                      icon={activeSection === 'shop' ? faChevronUp : faChevronDown} 
                    />
                  </span>
                </div>
                <ul className={`nav-links ${activeSection === 'shop' ? 'active' : ''}`}>
                  <li><Link to="products/category/eyeglasses">Eyeglasses</Link></li>
                  <li><Link to="products/category/sunglasses">Sunglasses</Link></li>
                  <li><Link to="products/category/brands">Brands</Link></li>
                  <li><Link to="products/category/sports">Sports</Link></li>
                  <li><Link to="products/category/lenses">Lenses</Link></li>
                </ul>
              </div>
            </div>

            <div className="footer-contact">
              <div className="contact-info">
                <div className="contact-item">
                  <div className="contact-icon">
                    <FontAwesomeIcon icon={faPhone} />
                  </div>
                  <div className="contact-details">
                    <p>Call us</p>
                    <p className="contact-value">+251944939494</p>
                  </div>
                </div>

                <div className="contact-item">
                  <div className="contact-icon">
                    <FontAwesomeIcon icon={faEnvelope} />
                  </div>
                  <div className="contact-details">
                    <p>Email us</p>
                    <p className="contact-value">minaoptics@gmail.com</p>
                  </div>
                </div>

                {/* Location Section */}
                <div className="location-info">
                  <div className="location-item">
                    <div className="location-icon">
                      <FontAwesomeIcon icon={faMapMarkerAlt} />
                    </div>
                    <div className="location-details">
                      <p>Visit us</p>
                      <p className="location-value">Addis Ababa, Ethiopia<br/>4kilo Near To Birhane Selam Printing Press</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="social-media">
                <p>Follow us</p>
                <div className="social-links">
                  <a href="#" aria-label="Facebook">
                    <FontAwesomeIcon icon={faFacebookF} />
                  </a>
                  <a href="https://www.instagram.com/jemila770?igsh=ZXNoMXQ5M3h4amht" aria-label="Instagram">
                    <FontAwesomeIcon icon={faInstagram} />
                  </a>
                  <a href="https://t.me/Jem4494" aria-label="Telegram">
                    <FontAwesomeIcon icon={faTelegram} />
                  </a>
                  <a href="#" aria-label="TikTok">
                    <FontAwesomeIcon icon={faTiktok} />
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="footer-middle">
            <h5>Our Partners</h5>
            <div className="partner-logos">
              <div className="partner-logo">
                <img src={CBELogo} alt="CBE Noor Bank" />
              </div>
              <div className="partner-logo">
                <img src={TelebirrLogo} alt="Telebirr" />
              </div>
              <div className="partner-logo">
                <img src={ZamazmLogo} alt="Zamzam Bank" />
              </div>
              <div className="partner-logo">
                <img src={ChapaLogo} alt="Chapa" />
              </div>
            </div>
          </div>

          <div className="footer-bottom">
            <div className="legal-links">
              <Link to="/privacy">Privacy</Link>
              <Link to="/terms">Terms of use</Link>
              <Link to="/cookies">Cookie policy</Link>
            </div>
            <div className="copyright">
              &copy; 2025 Minaoptics.com. All Rights Reserved.
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default FooterAndGuarantee;