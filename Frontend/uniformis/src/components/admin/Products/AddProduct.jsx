import React, { useState, useEffect, useCallback } from "react"
import { productApi } from "../../../adminaxiosconfig"
import { Link, useNavigate } from "react-router-dom"
import Button from "react-bootstrap/Button"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { Modal } from "../../ui/modal"
import ImageCropper from "./ImageCropper"

const AddProduct = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    title: "",
    price: "",
    category: "",
    description: "",
    size: "",
    stock: "",
  })
  const [categories, setCategories] = useState([])
  const [sizes, setSizes] = useState([])
  const [loading, setLoading] = useState(false)
  const [currentImage, setCurrentImage] = useState(null)
  const [cropModalOpen, setCropModalOpen] = useState(false)
  const [croppedImages, setCroppedImages] = useState([])

  useEffect(() => {
    fetchCategories()
    fetchSizes()
  }, [])

  const fetchCategories = async () => {
    try {
      const response = await productApi.get("/categories/", {
        params: { active_only: true },
      })
      setCategories(response.data)
      console.log(response.data)
    } catch (error) {
      toast.error("Error fetching categories")
    }
  }

  const fetchSizes = async () => {
    try {
      const response = await productApi.get("/size/")
      setSizes(response.data)
    } catch (error) {
      toast.error("Error fetching sizes")
    }
  }

  const handleImageUpload = useCallback((e) => {
    const files = Array.from(e.target.files)
    
    if (files.length === 0) return;
    
    if (croppedImages.length + files.length > 5) {
      toast.error("Maximum 5 images allowed")
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      setCurrentImage(reader.result)
      setCropModalOpen(true)
    }
    reader.readAsDataURL(files[0])
  }, [croppedImages.length])

  const handleCropComplete = useCallback((croppedImage) => {
    setCroppedImages((prev) => [...prev, croppedImage])
    setCropModalOpen(false)
    setCurrentImage(null)
  }, [])

  const handleCropCancel = useCallback(() => {
    setCropModalOpen(false)
    setCurrentImage(null)
  }, [])

  const handleRemoveImage = (index) => {
    setCroppedImages((prev) => prev.filter((_, i) => i !== index))
  }

  const handleStockChange = (e) => {
    const value = Number.parseInt(e.target.value)
    if (value < 0) {
      toast.error("Stock cannot be negative")
      return
    }
    setFormData({ ...formData, stock: value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (croppedImages.length === 0) {
      toast.error("Please add at least one image")
      return
    }

    const formDataToSend = new FormData()
    Object.keys(formData).forEach((key) => {
      formDataToSend.append(key, formData[key])
    })

    croppedImages.forEach((image, index) => {
      formDataToSend.append("images", image, `image-${index}.jpg`)
    })
    setLoading(true)

    try {
      const response = await productApi.post("/addproduct/", formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })

      if (response.data) {
        toast.success("Product added successfully!")
        setTimeout(() => navigate("/admin/products"), 1500)
      }
    } catch (error) {
      const errorMessage = error.response?.data?.error || "Error adding product"
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

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
                    console.log("Selected category:", e.target.value) // Debug log
                    setFormData({ ...formData, category: e.target.value })
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
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={croppedImages.length >= 5}
                />
                <small className="text-gray-500">
                  Maximum 5 images allowed. Images will be cropped to 800x800 pixels.
                </small>

                {croppedImages.length > 0 && (
                  <div className="mt-4 grid grid-cols-5 gap-2">
                    {croppedImages.map((image, index) => (
                      <div key={index} className="relative">
                        <img
                          src={URL.createObjectURL(image)}
                          alt={`Product ${index + 1}`}
                          className="w-full h-20 object-cover rounded"
                        />
                        <button
                          type="button"
                          className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center"
                          onClick={() => handleRemoveImage(index)}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="form-group">
                <label className="block text-sm font-medium mb-1">Stock</label>
                <input
                  type="number"
                  className="form-control w-full"
                  value={formData.stock}
                  onChange={handleStockChange}
                  min="0"
                  onKeyDown={(e) => {
                    if (e.key === "-") {
                      e.preventDefault()
                    }
                  }}
                  required
                />
                <small className="text-gray-500">Stock must be 0 or greater</small>
              </div>

              <div className="space-y-2">
                <button type="submit" className="btn btn-primary w-full" disabled={loading}>
                  {loading ? "Adding Product..." : "Add Product"}
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
      <Modal isOpen={cropModalOpen} onClose={handleCropCancel}>
        {currentImage && (
          <ImageCropper
            image={currentImage}
            onCropComplete={handleCropComplete}
            onCropCancel={handleCropCancel}
          />
        )}
      </Modal>
    </div>
  )
}

export default AddProduct





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
