import React from 'react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const {user} =useAuth();

  return (
    <div className="bg-white shadow px-6 py-4 flex justify-between items-center">
      <h1 className="text-xl font-semibold">Dashboard</h1>
      <div className="text-sm text-gray-500">Welcome, {user.name}!</div>
    </div>
  );
};

export default Navbar;
