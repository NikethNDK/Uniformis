import React from 'react';
import Sidebar from './Sidebar'; // Your existing sidebar component

const AdminLayout = ({ children }) => {
  return (
    <div className="dashboard-container">
      <Sidebar /> {/* This will be fixed on the left */}
      <main className="content">
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;