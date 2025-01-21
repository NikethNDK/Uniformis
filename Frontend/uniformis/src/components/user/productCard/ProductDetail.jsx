import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchProducts } from '../../../redux/product/userProductSlice';
import './ProductDetail.css'

const ImageMagnifier = ({ src }) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [showMagnifier, setShowMagnifier] = useState(false);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  
  const handleMouseEnter = (e) => {
    setShowMagnifier(true);
  };

  const handleMouseLeave = () => {
    setShowMagnifier(false);
  };

  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.target.getBoundingClientRect();
    const x = ((e.pageX - left) / width) * 100;
    const y = ((e.pageY - top) / height) * 100;
    setPosition({ x, y });
    setCursorPosition({ x: e.pageX - left, y: e.pageY - top });
  };

  return (
    <div className="relative">
      <img
        src={src}
        alt="Product"
        className="w-full h-auto cursor-crosshair"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onMouseMove={handleMouseMove}
      />
      {showMagnifier && (
        <div
          className="absolute left-full ml-4 border-2 border-gray-200 rounded-lg overflow-hidden"
          style={{
            width: '400px',
            height: '400px',
          }}
        >
          <img
            src={src}
            alt="Magnified"
            className="absolute"
            style={{
              width: '1000px',
              height: 'auto',
              transform: `translate(-${position.x}%, -${position.y}%)`,
            }}
          />
        </div>
      )}
    </div>
  );
};

const ProductDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const scrollRef = useRef(null);

  const { products, loading } = useSelector(state => state.userProducts);
  const product = products.find(p => p.id === parseInt(id));

  useEffect(() => {
    if (!products.length) {
      dispatch(fetchProducts());
    }
  }, [dispatch, products.length]);

  const handleThumbnailClick = (index) => {
    setCurrentImageIndex(index);
  };

  const scrollThumbnails = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -100 : 100;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  if (loading || !product) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Column - Images */}
        <div>
          <div className="mb-4">
            <ImageMagnifier src={product.images[currentImageIndex].image} />
          </div>
          
          {/* Thumbnails */}
          <div className="relative mt-4">
            <button 
              onClick={() => scrollThumbnails('left')}
              className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-md z-10"
            >
              ←
            </button>
            <div 
              ref={scrollRef}
              className="flex space-x-2 overflow-x-hidden relative mx-8 scroll-smooth"
              style={{ scrollBehavior: 'smooth' }}
            >
              {product.images.map((image, index) => (
                <button
                  key={index}
                  className={`flex-shrink-0 ${currentImageIndex === index ? 'border-2 border-blue-500' : 'border border-gray-200'}`}
                  onClick={() => handleThumbnailClick(index)}
                >
                  <img
                    src={image.image}
                    alt={`Thumbnail ${index + 1}`}
                    className="w-16 h-16 object-cover"
                  />
                </button>
              ))}
            </div>
            <button 
              onClick={() => scrollThumbnails('right')}
              className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-md z-10"
            >
              →
            </button>
          </div>
        </div>

        {/* Right Column - Product Details */}
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-4">{product.name}</h1>
          <div className="flex items-center mb-4">
            {[...Array(5)].map((_, index) => (
              <svg
                key={index}
                className={`w-5 h-5 ${
                  index < Math.round(product.average_rating) ? 'text-yellow-400' : 'text-gray-300'
                }`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          
          <div className="text-2xl font-bold text-green-600 mb-4">
            ₹{product.price}
          </div>

          <div className="mb-4">
            <span className="text-gray-600">Category: </span>
            <span className="font-medium">{product.category.name}</span>
          </div>

          <div className="mb-6">
            <h2 className="font-semibold mb-2">Description:</h2>
            <p className="text-gray-600">{product.description}</p>
          </div>

          {/* Size Selection */}
          <div className="mb-6">
            <h2 className="font-semibold mb-2">Size:</h2>
            <div className="flex space-x-2">
              {product.sizes.map((size) => (
                <button
                  key={size.id}
                  className="px-4 py-2 border rounded-md hover:border-blue-500 focus:outline-none focus:border-blue-500"
                >
                  {size.name}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity Selector */}
          <div className="flex items-center space-x-4 mb-6">
            <button 
              className="px-3 py-1 border rounded-md"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
            >
              -
            </button>
            <span className="w-12 text-center">{quantity}</span>
            <button 
              className="px-3 py-1 border rounded-md"
              onClick={() => setQuantity(quantity + 1)}
            >
              +
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-4">
            <button className="px-6 py-3 bg-orange-500 text-white rounded-md hover:bg-orange-600 flex-1">
              Add to Cart
            </button>
            <button className="px-6 py-3 bg-green-500 text-white rounded-md hover:bg-green-600 flex-1">
              Buy Now
            </button>
            <button className="p-3 border rounded-md hover:border-red-500">
              <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;