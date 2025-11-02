import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faBars, 
  faXmark, 
  faCartShopping, 
  faSearch,
  faUserCircle 
} from '@fortawesome/free-solid-svg-icons';
import { 
  faHeart, 
  faUser 
} from '@fortawesome/free-regular-svg-icons';
import { useSelector, useDispatch } from 'react-redux';
import { logoutUser, getCurrentUser } from '../../store/slices/authSlice'; 
import { clearCart } from '../../store/slices/cartSlice';
import {removeFromWishlist} from "../../store/slices/whishListSlice"


import './Header.css';
import MinaLogo from "../../assets/logo/Mina_optics-logo-2-removebg-preview.png"


const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Redux state
  const cartCount = useSelector(state => state.cart.items?.length || 0);
  const heartCount = useSelector(state => state.whishlist?.products?.length || 0);
  const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
  const user = useSelector(state => state.auth.user);

  // Fetch current user on mount if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      dispatch(getCurrentUser());
    }
  }, [dispatch, isAuthenticated]);

 
  

  // Toggle slide menu
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  // Toggle user dropdown
  const toggleUserDropdown = () => setIsUserDropdownOpen(!isUserDropdownOpen);

  // Handle search
  const handleSearch = async (e) => {
    if (e.key === "Enter" && searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };
  
  // Handle logout
  const handleLogout = () => {
    dispatch(logoutUser());
    dispatch(clearCart());
    dispatch(removeFromWishlist());
    setIsUserDropdownOpen(false);
    navigate('/');
  };

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMenuOpen && !event.target.closest('.slide-menu')) setIsMenuOpen(false);
      if (isUserDropdownOpen && !event.target.closest('.user-dropdown-container')) setIsUserDropdownOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMenuOpen, isUserDropdownOpen]);

  return (
    <>
      <header className="header container-fluid d-flex align-items-center justify-content-md-between justify-content-lg-center">
        <div className="container-lg header-div d-flex align-items-center gap-lg-4 gap-3  justify-content-md-between justify-content-lg-center">
          <div className="menu-bar" onClick={toggleMenu}>
            <FontAwesomeIcon icon={faBars} />
          </div>

          <Link to="/" className="logo d-flex justify-content-center align-items-center">
            <img src={MinaLogo} alt="Mina Optics Logo" />
          </Link>

          <div className="header-lists d-flex">
            <ul className="d-flex gap-4">
              <li><Link to="products/category/eyeglasses">Eyeglasses</Link></li>
              <li><Link to="products/category/sunglasses">Sunglasses</Link></li>
              <li><Link to="products/category/brands">Brands</Link></li>
              <li><Link to="products/category/sports">Sports</Link></li>
              <li><Link to="products/category/lenses">Lenses</Link></li>
            </ul>
          </div>

          <div className="search-container d-flex justify-content-center align-items-center">
            <FontAwesomeIcon icon={faSearch} />
            <input 
              type="text" 
              id="searchBar" 
              placeholder="I'm searching for..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleSearch}
            />
            <div id="searchResults"></div>
          </div>

          <div className="icons d-flex">
            <ul className="d-flex gap-4 justify-content-center align-items-center">
              <li className="left-icon heart-icon">
                <Link to="/favourite">
                  <FontAwesomeIcon icon={faHeart} className="icon" />
                  <span id="heart-count">{heartCount}</span>
                </Link>
              </li>
              <li className="left-icon cart-icon">
                <Link to="/cart">
                  <FontAwesomeIcon icon={faCartShopping} className="icon" />
                  <span id="cart-count">{cartCount}</span>
                </Link>
              </li>
              <li className="left-icon user-dropdown-container">
                <div onClick={toggleUserDropdown} style={{cursor: 'pointer'}}>
                  <FontAwesomeIcon icon={faUser} className="icon" />
                </div>
                {isUserDropdownOpen && (
                  <div className="user-dropdown">
                    {isAuthenticated ? (
                      <>
                        <div className="user-info">
                          <FontAwesomeIcon icon={faUserCircle} size="lg" />
                          <span>Hello, {user?.displayName || 'User'}</span>
                        </div>
                        <hr />
                        <Link to="/profile" onClick={() => setIsUserDropdownOpen(false)}>Profile</Link>
                        <Link to="/orders" onClick={() => setIsUserDropdownOpen(false)}>Orders</Link>
                        {user?.role === 'admin' && (
      <Link to="/AdminDashboard" onClick={() => setIsUserDropdownOpen(false)}>Dashboard</Link>
    )}


                        <button onClick={handleLogout}>Logout</button>
                      </>
                    ) : (
                      <>
                        <Link to="/login" onClick={() => setIsUserDropdownOpen(false)}>Login</Link>
                        <Link to="/register" onClick={() => setIsUserDropdownOpen(false)}>Register</Link>
                      </>
                    )}
                  </div>
                )}
              </li>
            </ul>
          </div>
        </div>
      </header>

      {/* Slide Menu */}
      <div className={`slide-menu ${isMenuOpen ? 'slide-menu-left' : ''}`}>
        <div className="d-flex justify-content-between align-items-center logo-x-container">
          <Link to="/" className="logo d-flex justify-content-center align-items-center" id="menu-logo">
            <img src={MinaLogo} alt="Mina Optics Logo" />
          </Link>
          <div className="x-icon-container" onClick={toggleMenu}>
            <FontAwesomeIcon icon={faXmark} className="x-icon" />
          </div>
        </div>
        <hr id="menu-horizontal" />
        <div className="slide-menu-list">
          <ul className="slide-list">
            <li><Link to="products/category/eyeglasses" onClick={() => setIsMenuOpen(false)}>Eyeglasses</Link></li>
            <li><Link to="products/category/sunglasses" onClick={() => setIsMenuOpen(false)}>Sunglasses</Link></li>
            <li><Link to="products/category/brands" onClick={() => setIsMenuOpen(false)}>Brands</Link></li>
            <li><Link to="products/category/sports" onClick={() => setIsMenuOpen(false)}>Sports</Link></li>
            <li><Link to="products/category/lenses" onClick={() => setIsMenuOpen(false)}>Lenses</Link></li>
            <hr />
            {isAuthenticated ? (
              <>
                <li><Link to="/profile" onClick={() => setIsMenuOpen(false)}>Profile</Link></li>
                <li><Link to="/orders" onClick={() => setIsMenuOpen(false)}>Orders</Link></li>
               
                <li><button onClick={handleLogout}>Logout</button></li>
              </>
            ) : (
              <>
                <li><Link to="/login" onClick={() => setIsMenuOpen(false)}>Login</Link></li>
                <li><Link to="/register" onClick={() => setIsMenuOpen(false)}>Register</Link></li>
              </>
            )}
          </ul>
        </div>
      </div>
    </>
  );
};

export default Header;
