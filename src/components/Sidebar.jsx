import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = () => {

  return (
    <div className="w-64 bg-white border-r p-6 hidden md:block">
      <h2 className="text-2xl font-bold mb-6">TaskManager</h2>
      <nav className="space-y-4">
        <Link to="/dashboard" className="block text-blue-600">Dashboard</Link>
        <Link to="/dashboard/tasks" className="block text-gray-700 hover:text-blue-500">Tasks</Link>
        <Link to="/dashboard/ActivityLog" className="block text-gray-700 hover:text-blue-500">Activity log</Link>
        <Link to="/logout" className="block text-gray-700 hover:text-red-500">Logout</Link>
      </nav>
    </div>
  );
};

export default Sidebar;
