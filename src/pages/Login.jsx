import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();
  const[error,setError ]=useState("")
  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await axios.get(`http://localhost:3001/users?email=${email}&password=${password}`);
    if (res.data.length > 0) {
      login(res.data[0]);
      navigate('/dashboard');
    } else {
      setError('Invalid credentials');
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="p-8 max-w-md mx-auto">
      <h2 className="text-xl font-bold">Login</h2>
      {error && <h3 className='text-red-500'>{error}</h3>}
      <input className="border p-2 w-full my-2" placeholder="Email" required value={email} onChange={e => setEmail(e.target.value)} />
      <input className="border p-2 w-full my-2" placeholder="Password" required type="password" value={password} onChange={e => setPassword(e.target.value)} />
      <button className="bg-blue-500 text-white px-4 py-2">Login</button>
      <Link to={'/register'}>new user Register here...</Link>
    </form>
  );
}