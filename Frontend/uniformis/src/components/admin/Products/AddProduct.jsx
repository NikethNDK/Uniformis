import React, { useState, useEffect } from 'react';
import { productApi } from '../../../adminaxiosconfig';
import { Link, useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AddProduct = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    price: '',
    category: '',
    description: '',
    size: '',
    stock: '',
    images: []
  });
  const [categories, setCategories] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCategories();
    fetchSizes();
  }, []);

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
    data.append('title', formData.title);
    data.append('price', formData.price);
    data.append('category', formData.category);  // This will now pass the category ID correctly
    data.append('description', formData.description);
    data.append('stock', formData.stock);
    data.append('sizes', formData.size);  // Changed to single size

    // Append images
    formData.images.forEach(image => {
      data.append('images', image);
    });

    try {
      const response = await productApi.post('/addproduct/', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      if (response.data) {
        toast.success('Product added successfully!');
        setTimeout(() => navigate('/admin/products'), 1500);
      }
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Error adding product';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ml-64 p-8">
      <ToastContainer position="top-right" />
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Add Product</h1>
        <div className="bg-white rounded-lg shadow-md">
          <div className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="form-group">
                <label className="block text-sm font-medium mb-1">Title</label>
                <input
                  type="text"
                  className="form-control w-full"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
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
                  value={formData.category}
                  onChange={(e) => {
                    console.log('Selected category:', e.target.value);  // Debug log
                    setFormData({ ...formData, category: e.target.value });
                  }}
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
                  className="form-control w-full"
                  value={formData.size}
                  onChange={(e) => setFormData({ ...formData, size: e.target.value })}
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
                <label className="block text-sm font-medium mb-1">Images</label>
                <input
                  type="file"
                  className="form-control w-full"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  required
                />
                <small className="text-gray-500">Maximum 5 images allowed</small>
              </div>

              <div className="form-group">
                <label className="block text-sm font-medium mb-1">Stock</label>
                <input
                  type="number"
                  className="form-control w-full"
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <button
                  type="submit"
                  className="btn btn-primary w-full"
                  disabled={loading}
                >
                  {loading ? 'Adding Product...' : 'Add Product'}
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

export default AddProduct;



  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   try {
  //     await productApi.post('/items/', formData);
  //     window.location.href = '/admin/products';
  //   } catch (error) {
  //     console.error('Error adding product:', error);
  //   }
  // };

  // const handleImageUpload = (e) => {
  //   const files = Array.from(e.target.files);
  //   const readers = files.map(file => {
  //     return new Promise((resolve) => {
  //       const reader = new FileReader();
  //       reader.onloadend = () => resolve(reader.result);
  //       reader.readAsDataURL(file);
  //     });
  //   });

  //   Promise.all(readers).then(images => {
  //     setFormData(prev => ({...prev, images}));
  //   });
  // };


//   return (
//     <div className="container mt-5">
//       <h1 className="mb-4">Add Product </h1>
//       <div className="card">
//         <div className="card-body">
//           <form onSubmit={handleSubmit}>
//             <div className="form-group">
//               <label>Title</label>
//               <input
//                 type="text"
//                 className="form-control"
//                 value={formData.title}
//                 onChange={(e) => setFormData({...formData, title: e.target.value})}
//                 required
//               />
//             </div>

//             <div className="form-group">
//               <label>Price</label>
//               <input
//                 type="number"
//                 className="form-control"
//                 value={formData.price}
//                 onChange={(e) => setFormData({...formData, price: e.target.value})}
//                 required
//               />
//             </div>

//             <div className="form-group">
//               <label>Category</label>
//               <select
//                 className="form-control"
//                 value={formData.category}
//                 onChange={(e) => setFormData({...formData, category: e.target.value})}
//                 required
//               >
//                 {categories.map(category => (
//                   <option key={category.id} value={category.id}>
//                     {category.name}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             <div className="form-group">
//               <label>Description</label>
//               <textarea
//                 className="form-control"
//                 value={formData.description}
//                 onChange={(e) => setFormData({...formData, description: e.target.value})}
//                 required
//               />
//             </div>

//             <div className="form-group">
//               <label>Images</label>
//               <input
//                 type="file"
//                 className="form-control"
//                 multiple
//                 accept="image/*"
//                 onChange={handleImageUpload}
//                 required
//               />
//             </div>

//             <div className="form-group">
//               <label>Stock</label>
//               <input
//                 type="number"
//                 className="form-control"
//                 value={formData.stock}
//                 onChange={(e) => setFormData({...formData, stock: e.target.value})}
//                 required
//               />
//             </div>

//             <button type="submit" className="btn btn-primary w-100 mt-2">Add Product</button>
//             <Link to={"/products"} ><Button variant='danger' className='w-100 mt-2'>Cancel</Button></Link>
//           </form>
          
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AddProduct;
