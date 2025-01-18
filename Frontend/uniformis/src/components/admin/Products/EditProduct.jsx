import React, { useState, useEffect } from 'react';
import { productApi } from '../../../adminaxiosconfig';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const EditProduct = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category_id: '',
    description: '',
    size_ids: [],
    stock_quantity: '',
    images: []
  });
  const [categories, setCategories] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentImages, setCurrentImages] = useState([]);

  useEffect(() => {
    fetchProduct();
    fetchCategories();
    fetchSizes();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const response = await productApi.get(`/updateproduct/${product.id}/`);
      const product = response.data;
      setFormData({
        name: product.name,
        price: product.price,
        category_id: product.category.id,
        description: product.description,
        size_ids: product.sizes.map(size => size.id),
        stock_quantity: product.stock_quantity,
        images: []
      });
      setCurrentImages(product.images);
    } catch (error) {
      toast.error('Error fetching product details');
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await productApi.get('/categories/');
      setCategories(response.data);
    } catch (error) {
      toast.error('Error fetching categories');
    }
  };

  const fetchSizes = async () => {
    try {
      const response = await productApi.get('/size/');
      setSizes(response.data);
    } catch (error) {
      toast.error('Error fetching sizes');
    }
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 5) {
      toast.warning('Maximum 5 images allowed');
      return;
    }
    setFormData({ ...formData, images: files });
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();
    data.append('name', formData.name);
    data.append('price', formData.price);
    data.append('category_id', formData.category_id);
    data.append('description', formData.description);
    data.append('stock_quantity', formData.stock_quantity);
    formData.size_ids.forEach(sizeId => {
      data.append('size_ids', sizeId);
    });

    formData.images.forEach(image => {
      data.append('images', image);
    });

    try {
        const response = await productApi.put(`/updateproduct/${id}/`, data, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        
        if (response.data) {
          toast.success('Product updated successfully!');
          setTimeout(() => navigate('/admin/products'), 1500);
        }
      } catch (error) {
        const errorMessage = error.response?.data?.error || 'Error updating product';
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };

  return (
    <div className="ml-64 p-8">
      <ToastContainer position="top-right" />
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Edit Product</h1>
        <div className="bg-white rounded-lg shadow-md">
          <div className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="form-group">
                <label className="block text-sm font-medium mb-1">Name</label>
                <input
                  type="text"
                  className="form-control w-full"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="block text-sm font-medium mb-1">Price</label>
                <input
                  type="number"
                  className="form-control w-full"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="block text-sm font-medium mb-1">Category</label>
                <select
                  className="form-control w-full"
                  value={formData.category_id}
                  onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                  required
                >
                  <option value="">Select Category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="block text-sm font-medium mb-1">Sizes</label>
                <select
                  className="form-control w-full"
                  multiple
                  value={formData.size_ids}
                  onChange={(e) => {
                    const selectedSizes = Array.from(e.target.selectedOptions, option => option.value);
                    setFormData({ ...formData, size_ids: selectedSizes });
                  }}
                  required
                >
                  {sizes.map((size) => (
                    <option key={size.id} value={size.id}>
                      {size.name}
                    </option>
                  ))}
                </select>
                <small className="text-gray-500">Hold Ctrl/Cmd to select multiple sizes</small>
              </div>

              <div className="form-group">
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  className="form-control w-full"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                  rows="4"
                />
              </div>

              <div className="form-group">
                <label className="block text-sm font-medium mb-1">Current Images</label>
                <div className="grid grid-cols-5 gap-2">
                  {currentImages.map((image, index) => (
                    <img 
                      key={index} 
                      src={image.image || "/placeholder.svg"} 
                      alt={`Product ${index + 1}`} 
                      className="w-full h-20 object-cover rounded"
                    />
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label className="block text-sm font-medium mb-1">New Images</label>
                <input
                  type="file"
                  className="form-control w-full"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                />
                <small className="text-gray-500">Maximum 5 images allowed</small>
              </div>

              <div className="form-group">
                <label className="block text-sm font-medium mb-1">Stock</label>
                <input
                  type="number"
                  className="form-control w-full"
                  value={formData.stock_quantity}
                  onChange={(e) => setFormData({ ...formData, stock_quantity: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <button
                  type="submit"
                  className="btn btn-primary w-full"
                  disabled={loading}
                >
                  {loading ? 'Updating Product...' : 'Update Product'}
                </button>
                <Link to="/admin/products">
                  <Button variant="danger" className="w-full mt-2">
                    Cancel
                  </Button>
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProduct;

