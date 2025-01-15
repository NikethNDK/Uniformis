import React, { useState,useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { Bell, ShoppingCart, Heart, User, LogOut } from 'lucide-react';
import { clearAuthData } from '../../../redux/auth/authSlice';
import logo from '../../../assets/logo.png';
import './Navbar.css';
import { fetchUserProfile } from '../../../redux/profile/profileSlice';
const Navbar = () => {
  const user = useSelector((state) => state.auth.user);
  const { data: profile } = useSelector((state) => state.profile);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  useEffect(() => {
    dispatch(fetchUserProfile());
  }, [dispatch]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    dispatch(clearAuthData());
    navigate('/login');
    setShowProfileMenu(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    console.log('Searching for:', searchQuery);
  };

  const ProfileMenu = () => (
    <div className="profile-menu">
      <Link to="/user-profile" className="profile-menu-item">
        <User size={18} />
        <span>Profile</span>
      </Link>
      <button onClick={handleLogout} className="profile-menu-item logout-btn">
        <LogOut size={18} />
        <span>Logout</span>
      </button>
    </div>
  );

  return (
    <div className="navbar-wrapper fixed-top">
      {/* Main Navbar */}
      <nav className="navbar navbar-expand-lg navbar-light bg-white">
        <div className="container">
          {/* Logo */}
          <Link to="/" className="navbar-brand">
            <img src={logo} alt="Uniformis Shoppe" className="logo-img" />
          </Link>

          {/* Search Bar */}
          <form className="search-form d-flex" onSubmit={handleSearch}>
            <div className="input-group">
              <input
                type="text"
                className="form-control"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
             <button className="btn btn-dark" type="submit">
                Search
              </button>
            </div>
          </form>

          {/* Right Icons */}
          <div className="nav-icons">
            <Link to="/notifications" className="nav-icon">
              <Bell size={24} />
            </Link>
            <Link to="/cart" className="nav-icon">
              <ShoppingCart size={24} />
            </Link>
            <Link to="/wishlist" className="nav-icon">
              <Heart size={24} />
            </Link>
            
            {user ? (
              <div className="profile-section" onClick={() => setShowProfileMenu(!showProfileMenu)}>
                <div className="profile-trigger">
                  {profile?.profile_picture ? (
                    <img
                      src={profile.profile_picture}
                      alt="Profile"
                      className="profile-img"
                    />
                  ) : (
                    <div className="profile-initial">
                      {user?.first_name?.[0]}
                    </div>
                  )}
                </div>
                {showProfileMenu && <ProfileMenu />}
              </div>
            ) : (
              <Link to="/login" className="btn btn-login">
                Login
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* Categories Navbar */}
      <nav className="navbar navbar-expand-lg navbar-light bg-light categories-nav">
        <div className="container">
          <div className="collapse navbar-collapse" id="navbarContent">
            <ul className="navbar-nav mx-auto">
              <li className="nav-item">
                <Link to="/" className="nav-link">Home</Link>
              </li>
              <li className="nav-item">
                <Link to="/about" className="nav-link">About</Link>
              </li>
              <li className="nav-item">
                <Link to="/school-uniform" className="nav-link">School uniform</Link>
              </li>
              <li className="nav-item">
                <Link to="/hospital-uniform" className="nav-link">Hospital Uniform</Link>
              </li>
              <li className="nav-item">
                <Link to="/industrial-uniform" className="nav-link">Industrial Uniform</Link>
              </li>
              <li className="nav-item">
                <Link to="/security" className="nav-link">Security</Link>
              </li>
              {/* <li className="nav-item">
                <Link to="/cadet" className="nav-link">Cadet</Link>
              </li> */}
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;