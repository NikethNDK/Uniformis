// import React, {useState,useEffect} from 'react';
// import { productApi } from '../../../adminaxiosconfig';
// import {FaTrash,FaPlus} from 'react-icons/fa'


// const CategoryManagement=()=>{
//     const [category,setCategory]=useState([]);
//     const [newCategory,setNewCategory]=useState('')


// useEffect(()=>{
//     fetchCategory();
// },[]);

// const fetchCategory =async () =>{
//     try{
//         const response = await productApi.get('/categories/');
//         setCategory(response.data)
//     }catch(error){
//         console.error("Failed to fetch sizes: ",error)
//     }
// };

// const handleSubmit=async(e)=>{
//     try{
//         await productApi.post('/categories/' ,{name:newCategory})
//         setNewCategory('');
//         fetchCategory();
//     }catch(error){
//         console.error('Failed to add category',error)
//     }
// };

// const handleDelete = async (categoryId)=>{}


// return (
//     <div className="ml-[280px] p-6 bg-gray-100 min-h-screen">
//       <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md">
//         <div className="p-6">
//           <h1 className="text-2xl font-bold mb-6">Category Management</h1>
          
//           <div className="overflow-x-auto">
//             <table className="min-w-full divide-y divide-gray-200">
//               <thead className="bg-gray-50">
//                 <tr>
//                   <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Category
//                   </th>
//                   <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Actions
//                   </th>
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200">
//                 {category.map((cat) => (
//                   <tr key={cat.id}>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
//                       {cat.name}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                       <button
//                         onClick={() => handleDelete(cat.id)}
//                         className="text-red-600 hover:text-red-900"
//                       >
//                         <FaTrash />
//                       </button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>

//           <form onSubmit={handleSubmit} className="mt-6 flex items-center">
//             <input
//               type="text"
//               value={newCategory}
//               onChange={(e) => setNewCategory(e.target.value)}
//               placeholder="Enter category"
//               className="flex-grow border rounded-l-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//             <button 
//               type="submit" 
//               className="bg-blue-500 text-white p-2 rounded-r-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
//             >
//               <FaPlus className="inline mr-2" /> Add Category
//             </button>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };
// export default CategoryManagement

import React, { useState, useEffect } from "react"
import { productApi } from "../../../adminaxiosconfig"
import { FaTrash, FaPlus } from "react-icons/fa"

const CategoryManagement = () => {
  const [categories, setCategories] = useState([])
  const [newCategory, setNewCategory] = useState("")

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const response = await productApi.get("/categories/")
      setCategories(response.data)
    } catch (error) {
      console.error("Failed to fetch categories: ", error)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await productApi.post("/categories/", { name: newCategory })
      setNewCategory("")
      fetchCategories()
    } catch (error) {
      console.error("Failed to add category", error)
    }
  }

  const handleDelete = async (categoryId) => {
    try {
      await productApi.delete(`/categories/${categoryId}/`)
      fetchCategories()
    } catch (error) {
      console.error("Failed to delete category", error)
    }
  }

  const toggleCategoryStatus = async (categoryId, currentStatus) => {
    try {
      await productApi.patch(`/categories/${categoryId}/`, { is_active: !currentStatus })
      setCategories(categories.map((cat) => (cat.id === categoryId ? { ...cat, is_active: !currentStatus } : cat)))
    } catch (error) {
      console.error("Failed to toggle category status", error)
    }
  }

  return (
    <div className="ml-[280px] p-6 bg-gray-100 min-h-screen">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md">
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-6">Category Management</h1>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Category
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Status
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {categories.map((cat) => (
                  <tr key={cat.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{cat.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${cat.is_active ? "bg-green-200 text-green-800" : "bg-red-200 text-red-800"}`}
                      >
                        {cat.is_active ? "Enabled" : "Disabled"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <button
                        onClick={() => toggleCategoryStatus(cat.id, cat.is_active)}
                        className={`mr-2 px-3 py-1 rounded text-white ${cat.is_active ? "bg-yellow-500 hover:bg-yellow-600" : "bg-blue-500 hover:bg-blue-600"}`}
                      >
                        {cat.is_active ? "Disable" : "Enable"}
                      </button>
                      <button onClick={() => handleDelete(cat.id)} className="text-red-600 hover:text-red-900">
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <form onSubmit={handleSubmit} className="mt-6 flex items-center">
            <input
              type="text"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              placeholder="Enter category"
              className="flex-grow border rounded-l-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="bg-blue-500 text-white p-2 rounded-r-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <FaPlus className="inline mr-2" /> Add Category
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default CategoryManagement


