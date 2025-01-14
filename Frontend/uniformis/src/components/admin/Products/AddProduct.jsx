import React, { useState, useEffect } from 'react';
import { productApi } from '../../../adminaxiosconfig';
import { Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
const AddProduct = () => {
  const [formData, setFormData] = useState({
    title: '',
    price: '',
    category: '',
    description: '',
   
    stock: '',
    images: []
  });
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await productApi.get('/categories/');
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleImageUpload = (e) => {
    // Update the images in formData for  preview purposes
    setFormData({ ...formData, images: [...e.target.files] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Create a FormData object to handle file uploads
    const data = new FormData();
    
    data.append('title', formData.title);
    data.append('price', formData.price);
    data.append('category', formData.category);
    data.append('description', formData.description);
    data.append('stock', formData.stock);
    console.log("formData.category:", formData.category); 
    // Append multiple images
    for (let i = 0; i < formData.images.length; i++) {
      data.append('images', formData.images[i]);
    }

    try {
      await productApi.post('/addproduct/', data,  {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      window.location.href = '/admin/products';
    } catch (error) {
      console.error('Error adding product:', error);
    }
  };
  return (
    <div className="container mt-5">
      <h1 className="mb-4">Add Product</h1>
      <div className="card">
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Title</label>
              <input
                type="text"
                className="form-control"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label>Price</label>
              <input
                type="number"
                className="form-control"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label>Category</label>
              <select
                className="form-control"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                required
              >
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea
                className="form-control"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label>Images</label>
              <input
                type="file"
                className="form-control"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                required
              />
            </div>

            <div className="form-group">
              <label>Stock</label>
              <input
                type="number"
                className="form-control"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                required
              />
            </div>

            <button type="submit" className="btn btn-primary w-100 mt-2">
              Add Product
            </button>
            <Link to="/products">
              <Button variant="danger" className="w-100 mt-2">
                Cancel
              </Button>
            </Link>
          </form>
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
