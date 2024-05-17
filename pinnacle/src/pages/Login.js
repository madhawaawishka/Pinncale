import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const navigate = useNavigate(); // Initialize useNavigate

  const [formData, setFormData] = useState({
    password: '',
    email: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,}$/;

    if (!passwordRegex.test(formData.password)) {
      alert('Password must be at least 6 characters long and contain at least one number and one special character.');
      return;
    }

    try {
      const response = await axios.post(
        'http://localhost:3001/api/login',
        formData,
        {
          withCredentials: true,
        }
      );
      console.log('Response:', response.data);
      localStorage.setItem('userEmail', formData.email);
      localStorage.setItem('userId', response.data.user.id);
      navigate('/'); // Navigate to the account page upon successful login
    } catch (error) {
      alert(error.response?.data?.error || "An error occurred during login.");
      console.error('Error:', error);
    }
  };

  const inputClasses = "bg-zinc-700 border-b border-orange-600 text-white p-2 w-full mt-3";
  const buttonClasses = "text-white font-bold py-2 px-4 bg-gradient-to-r from-[#FE7804] to-[#FF451D] rounded-lg";


  const goToRegister = () => {
    navigate('/register'); // Function to navigate to the login page
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold mb-5 text-center text-white">Login</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
              className={inputClasses}
            />
          </div>
          <div>
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
              className={inputClasses}
            />
          </div>
          <div className='w-full flex justify-center'>
          <button type="submit" className={buttonClasses}>
            Login
          </button></div>
          <p className="text-xl text-center text-[#FE7804] mt-4 cursor-pointer hover:text-[#FF451D]" onClick={goToRegister}>
          Don't Have an Account?
          </p>
        </form>
      </div>
    </div>
  );
}
