import { BrowserRouter, Route, Routes } from "react-router-dom"
import Login from "./components/login/Login"
import Signup from "./components/signup/Signup.jsx"
import Home from "./pages/user/Home.jsx"
import AdminLogin from "./components/admin/AdminLogin"
import AdminDashboard from "./components/admin/Dashboard/AdminDashboard.jsx"
import UserProfile from "./components/navbar/UserProfile.jsx"
import CreateUserPage from "./components/admin/CreateUserPage.jsx"
import AdminRedirect from "./components/defaultadmin/defaultadmin.jsx"
import AdminEditUser from "./components/admin/AdminEditUser.jsx"
import ProductList from "./components/admin/Products/ProductList.jsx"
import AddProduct from "./components/admin/Products/AddProduct.jsx"


function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Admin routes  */}
        <Route path="/admin/editUser" element={<AdminEditUser />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/create-user" element={<CreateUserPage />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/products" element={<ProductList />} />
        <Route path="/products/add" element={<AddProduct />} />
        
        {/* User routes */}
        <Route path="/user-profile" element={<UserProfile />} />
        <Route path="/home" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Login />} />
        <Route path="/defaultadmin" element={<AdminRedirect />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;