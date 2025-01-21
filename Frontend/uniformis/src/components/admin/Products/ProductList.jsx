// import React, { useEffect } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { fetchProducts, updateProductStatus, deleteProduct } from '../../../redux/product/productSlice';
// import { Link } from 'react-router-dom';
// import { toast, ToastContainer } from 'react-toastify';
// import { FaToggleOn, FaToggleOff, FaTrash, FaEdit } from "react-icons/fa"
// import 'react-toastify/dist/ReactToastify.css';
// import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

// const ProductList = () => {
//   const dispatch = useDispatch();
//   const { items: products, status, error } = useSelector(state => state.products);
  
//   useEffect(() => {
//     dispatch(fetchProducts());
//   }, [dispatch]);

//   const handleStatusChange = async (id, isDeleted) => {
//     try {
//       await dispatch(updateProductStatus({ id, is_deleted: !isDeleted })).unwrap();
//       toast.success(`Product ${!isDeleted ? 'removed' : 'restored'} successfully`);
//     } catch (error) {
//       toast.error('Error updating product status');
//     }
//   };

//   const handleDelete = async (id) => {
//     if (window.confirm('Are you sure you want to permanently delete this product?')) {
//       try {
//         await dispatch(deleteProduct(id)).unwrap();
//         toast.success('Product deleted successfully');
//       } catch (error) {
//         toast.error('Error deleting product');
//       }
//     }
//   };

//   if (status === 'loading') {
//     return <div>Loading...</div>;
//   }

//   if (status === 'failed') {
//     return <div>Error: {error}</div>;
//   }

//   return (
//     <div className="ml-64 p-8">
//       <ToastContainer position="top-right" />
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-2xl font-bold">Products</h1>
//         <Link to="/admin/products/add" className="btn btn-primary">
//           Add New Product
//         </Link>
//       </div>
//       <div className="overflow-x-auto">
//         <table className="min-w-full bg-white">
//           <thead>
//             <tr>
//               <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
//                 Image
//               </th>
//               <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
//                 Item Name
//               </th>
//               <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
//                 Category
//               </th>
//               <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
//                 Price
//               </th>
//               <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
//                 Stock
//               </th>
//               <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
//                 Size
//               </th>
//               <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
//                 Status
//               </th>
//               <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
//                 Action
//               </th>
//             </tr>
//           </thead>
//           <tbody>
//             {Array.isArray(products) && products.length > 0 ? (
//               products.map((product) => (
//                 <tr key={product.id}>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <img
//                       src={product.images[0]?.image || "/placeholder.svg"}
//                       alt={product.name}
//                       className="h-10 w-10 rounded-full object-cover"
//                     />
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap">{product.name}</td>
//                   <td className="px-6 py-4 whitespace-nowrap">{product.category.name}</td>
//                   <td className="px-6 py-4 whitespace-nowrap">₹{product.price}</td>
//                   <td className="px-6 py-4 whitespace-nowrap">{product.stock_quantity}</td>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     {product.sizes.map(size => size.name).join(', ')}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <button
//                       onClick={() => handleStatusChange(product.id, product.is_deleted)}
//                       className={`px-2 py-1 rounded ${
//                         !product.is_deleted
//                           ? 'bg-red-500 text-white'
//                           : 'bg-green-500 text-white'
//                       }`}
//                     >
//                       {!product.is_deleted ? 'Remove' : 'Make Available'}
//                     </button>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <div className="flex items-center space-x-4">
//                       <Link to={`/admin/products/edit/${product.id}`}>
//                         <PencilIcon className="h-5 w-5 text-blue-500 hover:text-blue-700" />
//                       </Link>
//                       <button onClick={() => handleDelete(product.id)}>
//                         <TrashIcon className="h-5 w-5 text-red-500 hover:text-red-700" />
//                       </button>
//                     </div>
//                   </td>
//                 </tr>
//               ))
//             ) : (
//               <tr>
//                 <td colSpan="8" className="px-6 py-4 text-center">
//                   No products found
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default ProductList;



import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts, updateProductStatus, deleteProduct } from '../../../redux/product/productSlice';
import { Link } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import { FaToggleOn, FaToggleOff, FaTrash, FaEdit } from "react-icons/fa"
import 'react-toastify/dist/ReactToastify.css';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

const ProductList = () => {
  const dispatch = useDispatch();
  const { items: products, status, error } = useSelector(state => state.products);
  
  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchProducts())
    }
  }, [status, dispatch])

  const handleToggleStatus = (id, currentStatus) => {
    dispatch(updateProductStatus({ id, is_active: !currentStatus }))
  }

  // const handleStatusChange = async (id, isDeleted) => {
  //   try {
  //     await dispatch(updateProductStatus({ id, is_deleted: !isDeleted })).unwrap();
  //     toast.success(`Product ${!isDeleted ? 'removed' : 'restored'} successfully`);
  //   } catch (error) {
  //     toast.error('Error updating product status');
  //   }
  // };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to permanently delete this product?')) {
      try {
        await dispatch(deleteProduct(id)).unwrap();
        toast.success('Product deleted successfully');
      } catch (error) {
        toast.error('Error deleting product');
      }
    }
  };

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (status === 'failed') {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="ml-64 p-8">
      <ToastContainer position="top-right" />
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Products</h1>
        <Link to="/admin/products/add" className="btn btn-primary">
          Add New Product
        </Link>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Image
              </th>
              <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Item Name
              </th>
              <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Price
              </th>
              <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Stock
              </th>
              <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Size
              </th>
              <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(products) && products.length > 0 ? (
              products.map((product) => (
                <tr key={product.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <img
                      src={product.images[0]?.image || "/placeholder.svg"}
                      alt={product.name}
                      className="h-10 w-10 rounded-full object-cover"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{product.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{product.category.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">₹{product.price}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{product.stock_quantity}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {product.sizes.map(size => size.name).join(', ')}
                  </td>
                  {/* <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => handleStatusChange(product.id, product.is_deleted)}
                      className={`px-2 py-1 rounded ${
                        !product.is_deleted
                          ? 'bg-red-500 text-white'
                          : 'bg-green-500 text-white'
                      }`}
                    >
                      {!product.is_deleted ? 'Remove' : 'Make Available'}
                    </button>
                  </td> */}
                  <td></td>
                   {/* <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${cat.is_active ? "bg-green-200 text-green-800" : "bg-red-200 text-red-800"}`}
                      >
                        {cat.is_active ? "Active" : "Inactive"}
                      </span>
                    </td> */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-4">
                    <button
                        onClick={() => handleToggleStatus(product.id, product.is_active)}
                        className={`mr-2 text-2xl ${product.is_active ? "text-green-500" : "text-gray-400"}`}
                      >{product.is_active ? <FaToggleOn /> : <FaToggleOff />}
                      </button>
                      <Link to={`/admin/products/edit/${product.id}`}>
                        <PencilIcon className="h-5 w-5 text-blue-500 hover:text-blue-700" />
                      </Link>
                      <button onClick={() => handleDelete(product.id)}>
                        <TrashIcon className="h-5 w-5 text-red-500 hover:text-red-700" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="px-6 py-4 text-center">
                  No products found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductList;

