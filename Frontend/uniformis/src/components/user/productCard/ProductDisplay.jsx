import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../../../redux/product/userProductSlice';
import ProductCard from './ProductCard';

const ProductDisplay = () => {
  const dispatch = useDispatch();
  const { products, categories, loading, error } = useSelector(state => state.userProducts);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600 p-4">
        {error}
      </div>
    );
  }

  const productsByCategory = categories.reduce((acc, category) => {
    acc[category.id] = products.filter(product => product.category.id === category.id);
    return acc;
  }, {});

  return (
    <div className="container mx-auto px-4 py-8">
      {categories.map(category => (
        <div key={category.id} className="mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">{category.name}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {productsByCategory[category.id]?.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductDisplay;