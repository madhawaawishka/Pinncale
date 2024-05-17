import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const navigate = useNavigate(); // Initialize useNavigate

  const [formData, setFormData] = useState({
    username: '',
    firstname: '',
    lastname: '',
    password: '',
    confirmPassword: '',
    email: '',
    accountType: 'user',
    dob: '',
    crystalCount:100,
    primium:'',
    xpCount:20,
    memberLevel:1,
    league:'Rookie',

  });
  const [emailValid, setEmailValid] = useState(true);  

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [e.target.name]: e.target.value });

    // Validate email
    if (name === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      setEmailValid(emailRegex.test(value));
    }//end
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!emailValid) {
      alert('Please enter a valid email.');
      return;
    }
    //fiest name las name validation
    const nameRegex = /^[a-zA-Z ]*$/;
    if (!nameRegex.test(formData.firstname) || !nameRegex.test(formData.lastname)) {
      alert('First name and Last name should only contain letters and spaces.');
      return;
    }
    // Check if passwords match
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match.');
      return;
    }

    // Check for empty required fields
    const fields = ['username', 'firstname', 'lastname', 'password', 'email', 'accountType'];
    if (fields.some(field => formData[field] === '')) {
      alert("All fields must be filled out.");
      return;
    }

    // Validate password complexity
    const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{5,}$/;
    if (!passwordRegex.test(formData.password)) {
      alert('Password must be at least 5 characters long and contain at least one number and one symbol character.');
      return;
    }

    try {
      const response = await axios.post(
        'http://localhost:3001/api/signup',
        formData
      );
      console.log('Response:', response.data);
      navigate('/login'); // Redirect to login page upon successful registration
    } catch (error) {
      alert(error.response?.data?.error || "An error occurred during registration.");
      console.error('Error:', error);
    }
  };

  const goToLogin = () => {
    navigate('/login'); // Function to navigate to the login page
  };

  const inputClasses = "bg-zinc-700 border-b border-orange-600 text-white p-2 w-full mt-3";
  const buttonClasses = "text-white font-bold py-2 px-4 bg-gradient-to-r from-[#FE7804] to-[#FF451D] rounded-lg";
  
  //date validation
  const lastDayOfPreviousYear = new Date(new Date().getFullYear() - 1, 11, 31).toISOString().split('T')[0];
  
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="w-full max-w-md">
        <h1 className="mt-8 text-3xl font-bold mb-5 text-center text-white">Register</h1>
        <form onSubmit={handleSubmit} className="space-y-8">
  <div className="grid grid-cols-2 gap-4">
    {/* Map through the fields and generate inputs */}
    {['firstname', 'lastname', 'username', 'email', 'dob'].map(field => (
      <div key={field} className="flex flex-col">
        <label htmlFor={field} className="mt-4 mb-2 font-medium text-white">
          {field.charAt(0).toUpperCase() + field.slice(1)}
        </label>
        <input
          id={field}
          type={field === 'email' ? 'email' : (field === 'dob' ? 'date' : 'text')}
          name={field}
          placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
          value={formData[field]}
          onChange={handleChange}
          required
          className={inputClasses + (field === 'email' && !emailValid ? ' border-red-500' : '')}
          max={field === 'dob' ? lastDayOfPreviousYear : undefined} //date validation
        />
      </div>
    ))}

    {/* Account Type input spans both columns */}
    <div className="flex flex-col col-span-2 ">
      <label htmlFor="accountType" className="mt-4 mb-2 font-medium text-white hidden">Account Type</label>
      <input 
        id="accountType"
        type="hidden"
        name="accountType"
        placeholder="Account Type"
        value="user"  // Static and capitalized as necessary
        disabled
        required
        className={inputClasses}
      />
      {/*<input
        type="hidden"
        name="accountType"
        value="user"
  />*/}
    </div>

    {/* Password fields are each in one column */}
    <div className="flex flex-col">
      <label htmlFor="password" className="mt-4 mb-2 font-medium text-white">Password</label>
      <input
        id="password"
        type="password"
        name="password"
        placeholder="Password"
        value={formData.password}
        onChange={handleChange}
        required
        className={inputClasses}
      />
    </div>
    <div className="flex flex-col">
      <label htmlFor="confirmPassword" className="mt-4 mb-2 font-medium text-white">Confirm Password</label>
      <input
        id="confirmPassword"
        type="password"
        name="confirmPassword"
        placeholder="Confirm Password"
        value={formData.confirmPassword}
        onChange={handleChange}
        required
        className={inputClasses}
      />
    </div>
  </div>
  <div className='w-full flex justify-center'>
    <button type="submit" className={buttonClasses}>
      Create account
    </button>
  </div>
  <p className="text-xl text-center text-[#FE7804] mt-4 cursor-pointer hover:text-[#FF451D]" onClick={goToLogin}>
    Already have an account?
  </p>
</form>




      </div>
    </div>
  );
}
