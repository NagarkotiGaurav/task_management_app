import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Tasks from './pages/Tasks';
import { AuthProvider, useAuth } from './context/AuthContext';
import DashboardContent from './components/DashboardContent';
import EditTask from './components/Edittask';
import ActivityLog from './components/ActivityLog';

function PrivateRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path='/' element={<PrivateRoute><Navigate to="dashboard"/> </PrivateRoute>} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} >
          <Route index element={<DashboardContent/>}/>
          <Route path="tasks" element={<Tasks />}/ >
          <Route path="tasks/edit/:id" element={<EditTask />} />
          <Route path="activitylog" element={<ActivityLog />} />

          </Route>

          {/* <Route path="*" element={<Navigate to="/dashboard" />} /> */}
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;