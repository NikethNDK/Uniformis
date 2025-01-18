import React, { useState, useEffect } from "react";
import { Search, Plus, Pencil, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { productApi } from "../../../adminaxiosconfig";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  // const [isFetched, setIsFetched] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await productApi.get("/items/");
      setProducts(response.data);
      console.log(products)
      // if (!isFetched) {
      //   toast.success("Products loaded successfully!");
      //   setIsFetched(true);
      // }
    } catch (error) {
      toast.error("Error fetching products.");
      console.error("Error fetching products:", error);
    }
  };
  console.log(products)
  // Filter products based on search term
  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.price.toString().includes(searchTerm)
  );

  const handleDelete = async (productId) => {
    try {
      // Using the ViewSet's destroy method which now performs soft delete
      await productApi.delete(`/items/${productId}/`);
      toast.success('Product deleted successfully');
      // Refresh the product list
      fetchProducts();
    } catch (error) {
      toast.error('Error deleting product');
    }
  };

  return (
    <div className="ml-64 px-8 py-6">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      
      {/* Header and Search Section */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-medium text-gray-800">Products</h1>
        <div className="flex items-center gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 rounded-lg border border-gray-200 w-64 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
          </div>
          
          <Link to="/admin/products/add">
          <button className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
            <Plus className="w-5 h-5" />
            ADD NEW PRODUCT
          </button>
          </Link>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-lg shadow">
        <table className="w-full">
          <thead>
            <tr className="text-left border-b">
              <th className="px-6 py-4">Image</th>
              <th className="px-6 py-4">Item Name</th>
              <th className="px-6 py-4">Category</th>
              <th className="px-6 py-4">Price</th>
              <th className="px-6 py-4">Stock</th>
              {/* <th className="px-6 py-4">View</th> */}
              <th className="px-6 py-4">Size</th>
              <th className="px-6 py-4">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((product) => (
              
              <tr key={product.id} className="border-b hover:bg-gray-50">
                <td className="px-6 py-4">
                  <img
                    src={`${product.images[0].image}`}
                    alt={product.name}
                    className="w-16 h-16 object-cover rounded"
                  />
                </td>
                <td className="px-6 py-4">{product.name}</td>
                <td className="px-6 py-4">{product.category.name}</td>
                <td className="px-6 py-4">₹{product.price}</td>
                <td className="px-6 py-4">{product.stock_quantity}</td>
                
                {/* <td className="px-6 py-4">
                  <button className="px-4 py-1 text-sm rounded bg-green-500 text-white hover:bg-green-600">
                    review
                  </button>
                </td> */}
                <td>
                {product.sizes.map((size) => (
                    <span key={size.id}>{size.name}</span>
                ))}
            </td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                  <Link to="/admin/products/edit">
                    <button className="p-1 rounded hover:bg-gray-100">
                      <Pencil className="w-4 h-4 text-gray-600" />
                    </button>
                    </Link>
                    <button onClick={() => handleDelete(product.id)} className="p-1 rounded hover:bg-gray-100">
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductList;