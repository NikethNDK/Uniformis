import React, { useState, useEffect } from "react";
import { productApi } from "../../../adminaxiosconfig";

import { Form, Button, Card } from "react-bootstrap";
import { Pencil, Trash2, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import Sidebar from "../Sidebar/Sidebar";
import "./ProductList.css";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await productApi.get("/items/");
      setProducts(response.data);
      console.log(response.data)
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Products</h1>
          <div className="flex gap-4">
            <Form.Control
              type="search"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-64"
            />
           
              <Button className="w-4 h-4 mr-2 mt-2"> <Link
              to="/admin/products/add"
              className="bg-blue-600 text-white d-flex align-items-center btn-style"
            > ADD NEW PRODUCT</Link></Button>
            
          </div>
        </div>
        <Card>
          <Card.Body className="p-0">
            <table className="table">
              <thead>
                <tr className="border-bottom">
                  <th className="px-4 py-2">Image</th>
                  <th className="px-4 py-2">Item Name</th>
                  <th className="px-4 py-2">Category</th>
                  <th className="px-4 py-2">Price</th>
                  <th className="px-4 py-2">Stock</th>
                  <th className="px-4 py-2">View</th>
                  <th className="px-4 py-2">Size</th>
                  <th className="px-4 py-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id} className="border-bottom">
                    <td className="px-4 py-2">
                      <img
                        src={`${product.images[0].image}`}
                        alt={product.name}
                        className="w-16 h-16 object-cover"
                      />
                    </td>
                    <td className="px-4 py-2">{product.name}</td>
                    <td className="px-4 py-2">{product.category}</td>
                    <td className="px-4 py-2">₹{product.price}</td>
                    <td className="px-4 py-2">{product.stock_quantity}</td>
                    <td className="px-4 py-2">
                      <Button variant="secondary" size="sm">
                        Review
                      </Button>
                    </td>
                    <td className="px-4 py-2">
                      <Button variant="secondary" size="sm">
                        Size
                      </Button>
                    </td>
                    <td className="px-4 py-2">
                      <div className="d-flex gap-2">
                        <Button variant="light" size="sm">
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="light"
                          size="sm"
                          className="text-danger"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
};

export default ProductList;
