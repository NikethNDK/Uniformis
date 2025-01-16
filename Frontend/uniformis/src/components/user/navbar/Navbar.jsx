import React, { useState } from 'react';
import { Search, Bell, ShoppingCart, Heart, User, Menu, X,LogOut } from 'lucide-react';
import logo from '../../../assets/logo.png'
import { clearAuthData } from '../../../redux/auth/authSlice';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const dispatch=useDispatch()
  const navigate=useNavigate()

  const menuItems = ['Home', 'About', 'School uniform', 'Hospital Uniform', 'Industrial Uniform', 'Security', 'Cadet'];
  const handleLogout = () => {
    dispatch(clearAuthData())
    navigate("/login")
  }
  return (
    <nav className="w-full bg-white shadow-sm">
      {/* Top bar */}
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo and hamburger */}
          <div className="flex items-center gap-4">
            <button
              className="lg:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="w-6 h-6 text-gray-600" />
              ) : (
                <Menu className="w-6 h-6 text-gray-600" />
              )}
            </button>
            {/* Logo placeholder */}
            <div className="w-32 lg:w-40">
            <img src={logo} alt="Company Logo" height="auto"/>
            </div>
          </div>

          {/* Search bar - desktop */}
          <div className="hidden md:flex flex-1 max-w-xl mx-8">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search"
                className="w-full px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:border-gray-400"
              />
              <button className="absolute right-3 top-1/2 -translate-y-1/2 bg-[#222222] text-white px-6 py-1 rounded-full">
                Search
              </button>
            </div>
          </div>

          {/* Icons */}
          <div className="flex items-center gap-4 lg:gap-6">
            <button
              className="md:hidden"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
            >
              <Search className="w-6 h-6 text-gray-600" />
            </button>
            <Bell className="hidden sm:block w-6 h-6 text-gray-600 cursor-pointer hover:text-gray-800" />
            <ShoppingCart className="w-6 h-6 text-gray-600 cursor-pointer hover:text-gray-800" />
            <Heart className="hidden sm:block w-6 h-6 text-gray-600 cursor-pointer hover:text-gray-800" />
            <User className="w-6 h-6 text-gray-600 cursor-pointer hover:text-gray-800" />
            <button 
              onClick={handleLogout} 
              className="text-gray-700 hover:text-gray-900"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>

        {/* Mobile search */}
        {isSearchOpen && (
          <div className="mt-3 md:hidden">
            <div className="relative">
              <input
                type="text"
                placeholder="Search"
                className="w-full px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:border-gray-400"
              />
              <button className="absolute right-3 top-1/2 -translate-y-1/2 bg-[#222222] text-white px-6 py-1 rounded-full">
                Search
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Bottom menu - desktop */}
      <div className="hidden lg:block border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4">
          <ul className="flex flex-wrap space-x-8">
            {menuItems.map((item) => (
              <li key={item}>
                <a
                  href="#"
                  className="inline-block py-4 text-gray-600 hover:text-gray-900 whitespace-nowrap"
                >
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="lg:hidden border-t border-gray-100">
          <div className="px-4 py-2">
            <ul className="space-y-2">
              {menuItems.map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="block py-2 px-4 text-gray-600 hover:bg-gray-50 rounded-lg"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;