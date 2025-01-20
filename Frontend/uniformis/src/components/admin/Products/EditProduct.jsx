import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { fetchProduct, updateProduct } from '../../../redux/product/productSlice';
import { productApi } from '../../../adminaxiosconfig';

const EditProduct = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const { currentProduct } = useSelector(state => state.products);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category_id: '',
    description: '',
    size_id: '',  // Changed from size_ids to size_id
    stock_quantity: '',
    is_deleted: false,
    images: []
  });
  const [categories, setCategories] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentImages, setCurrentImages] = useState([]);

  useEffect(() => {
    dispatch(fetchProduct(id));
    fetchCategories();
    fetchSizes();
  }, [id, dispatch]);

  useEffect(() => {
    if (currentProduct) {
      setFormData({
        name: currentProduct.name,
        price: currentProduct.price,
        category_id: currentProduct.category.id,
        description: currentProduct.description,
        size_id: currentProduct.sizes[0]?.id || '',  // Changed to size_id
        stock_quantity: currentProduct.stock_quantity,
        is_deleted: currentProduct.is_deleted,
        images: []
      });
      setCurrentImages(currentProduct.images);
    }
  }, [currentProduct]);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();
    Object.keys(formData).forEach(key => {
      if (key === 'size_id') {
        // Send size_ids as an array with a single value
        data.append('size_ids', [formData[key]]);
      } else if (key === 'images') {
        formData[key].forEach(image => data.append('images', image));
      } else {
        data.append(key, formData[key]);
      }
    });

    try {
      await dispatch(updateProduct({ id, data })).unwrap();
      toast.success('Product updated successfully!');
      setTimeout(() => navigate('/admin/products'), 1500);
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Error updating product';
      console.log('Error response:', error.response?.data);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
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

  const handleImageDelete = async (imageId) => {
    try {
      await productApi.delete(`/items/${id}/delete_image/`, { data: { image_id: imageId } });
      setCurrentImages(currentImages.filter(img => img.id !== imageId));
      toast.success('Image deleted successfully');
    } catch (error) {
      toast.error('Error deleting image');
    }
  };

  if (!currentProduct) {
    return <div>Loading...</div>;
  }

  return (
    <div className="ml-64 p-8">
      <ToastContainer position="top-right" />
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Edit Product</h1>
        <div className="bg-white rounded-lg shadow-md">
          <div className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="form-group">
                <label className="block text-sm font-medium mb-1">Product Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="form-control w-full"
                  required
                />
              </div>

              <div className="form-group">
                <label className="block text-sm font-medium mb-1">Category</label>
                <select
                  name="category_id"
                  value={formData.category_id}
                  onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                  className="form-control w-full"
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
                <label className="block text-sm font-medium mb-1">Size</label>
                <select
                  name="size_id"
                  value={formData.size_id}
                  onChange={(e) => setFormData({ ...formData, size_id: e.target.value })}
                  className="form-control w-full"
                  required
                >
                  <option value="">Select Size</option>
                  {sizes.map((size) => (
                    <option key={size.id} value={size.id}>
                      {size.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="block text-sm font-medium mb-1">Price</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="form-control w-full"
                  required
                />
              </div>

              <div className="form-group">
                <label className="block text-sm font-medium mb-1">Stock Quantity</label>
                <input
                  type="number"
                  name="stock_quantity"
                  value={formData.stock_quantity}
                  onChange={(e) => setFormData({ ...formData, stock_quantity: e.target.value })}
                  className="form-control w-full"
                  required
                />
              </div>

              <div className="form-group">
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="form-control w-full"
                  rows="4"
                  required
                />
              </div>

              <div className="form-group">
                <label className="block text-sm font-medium mb-1">Status</label>
                <select
                  name="is_deleted"
                  value={formData.is_deleted}
                  onChange={(e) => setFormData({ ...formData, is_deleted: e.target.value === 'true' })}
                  className="form-control w-full"
                >
                  <option value={false}>Available</option>
                  <option value={true}>Removed</option>
                </select>
              </div>

              <div className="form-group">
                <label className="block text-sm font-medium mb-1">Current Images</label>
                <div className="grid grid-cols-5 gap-2">
                  {currentImages.map((image) => (
                    <div key={image.id} className="relative">
                      <img 
                        src={image.image || "/placeholder.svg"} 
                        alt="Product"
                        className="w-full h-20 object-cover rounded"
                      />
                      <button
                        type="button"
                        onClick={() => handleImageDelete(image.id)}
                        className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center"
                      >
                        ×
                      </button>
                    </div>
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

              <div className="space-y-2">
                <button
                  type="submit"
                  className="btn btn-primary w-full"
                  disabled={loading}
                >
                  {loading ? 'Updating Product...' : 'Update Product'}
                </button>
                <Link to="/admin/products">
                  <button type="button" className="btn btn-secondary w-full">
                    Cancel
                  </button>
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