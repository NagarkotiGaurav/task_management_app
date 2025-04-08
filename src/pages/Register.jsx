// src/pages/Register.jsx
import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'member' });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) {
      return alert('All fields are required!');
    }
    const res = await axios.post('http://localhost:3001/users', form);
    if (res.status === 201) {
      alert('Registration successful!');
      navigate('/login');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded shadow">
      <h2 className="text-2xl font-bold mb-4 text-center">Register</h2>
      <form onSubmit={handleRegister} className="space-y-4">
        <input type="text" name="name" placeholder="Full Name" required onChange={handleChange} className="w-full border p-2 rounded" />
        <input type="email" name="email" placeholder="Email" required onChange={handleChange} className="w-full border p-2 rounded" />
        <input type="password" name="password" placeholder="Password" required onChange={handleChange} className="w-full border p-2 rounded" />
        <select name="role" onChange={handleChange} className="w-full border p-2 rounded">
          <option value="member">Team Member</option>
          <option value="admin">Admin</option>
        </select>
        <button className="bg-green-600 text-white px-4 py-2 rounded w-full">Register</button>
      </form>
    </div>
  );
};

export default Register;
