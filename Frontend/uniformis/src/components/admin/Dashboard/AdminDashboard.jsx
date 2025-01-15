import React, { useEffect, useState } from 'react';
import { FaSearch, FaUserAlt, FaBox, FaShoppingCart, FaSignOutAlt } from 'react-icons/fa';
import Sidebar from '../Sidebar/Sidebar';
import axios from 'axios';
import './AdminDashboard.css'


function Dashboard() {
  const [data, setData] = useState({
    totalUsers: 0,
    totalOrders: 0,
    totalSales: 0,
  });

  useEffect(() => {
    // Fetch the data from backend API
    axios.get('/api/admin/dashboard')
      .then(response => {
        setData(response.data);
        console.log(data)
      })
      .catch(error => {
        console.error('There was an error fetching the data!', error);
      });
  }, []);

  return (
   
     
      <div>
        <div className="top-bar">
          <div className="search-bar">
            <input type="text" placeholder="Search..." />
            <button><FaSearch /></button>
          </div>
          <button className="logout-button"><FaSignOutAlt /> Log out</button>
        </div>
        <div className="stats-cards">
          <div className="card">
            <FaUserAlt />
            <div>
              <h3>Total Users</h3>
              <p>{data.totalUsers}</p>
            </div>
          </div>
          <div className="card">
            <FaBox />
            <div>
              <h3>Total Orders</h3>
              <p>{data.totalOrders}</p>
            </div>
          </div>
          <div className="card">
            <FaShoppingCart />
            <div>
              <h3>Total Sales</h3>
              <p>₹{data.totalSales}</p>
            </div>
          </div>
        </div>

        <div className="sales-graph">
          <h2>Sales Details</h2>
          {/* Dummy graph for now */}
          <div className="graph-placeholder">Graph Placeholder</div>
        </div>

        <div className="sales-table">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Address</th>
                <th>Total Amount</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {/* Sample data for now */}
              <tr>
                <td>00001</td>
                <td>Pradeep</td>
                <td>08 Deepam, Kannur</td>
                <td>₹10,000</td>
                <td>29 Dec 2024</td>
                <td>Completed</td>
              </tr>
              {/* Add more rows as needed */}
            </tbody>
          </table>
        </div>
      </div>
   
  );
}

export default Dashboard;
