import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
// import Header from './components/Header';
// import Footer from './components/Footer';

function CreateFAQ() {
  // State variables to hold question and answer input values
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  
  // React Router hook for navigation
  const navigate = useNavigate();

  // Function to handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    // Making POST request to the backend server with FAQ data
    axios.post("http://localhost:3001/createfaq", { question, answer })
      .then(result => {
        // Log the result and navigate to '/adminfaq' upon successful submission
        console.log(result);
         navigate('/');
      })
      .catch(err => console.log(err));
  };

  return (
    <div>
      
    <div className="min-h-screen px-4 py-8 bg-[#2A2B2F]">
      <div className="max-w-md p-6 mx-auto rounded-lg bg-neutral-800">
        <form onSubmit={handleSubmit}>
          <h2 className="mb-4 text-2xl font-bold text-white">Add FAQ</h2>
          <div className="mb-4">
            <label htmlFor="question" className="block mb-1 text-white">Question</label>
            {/* Input field for the question */}
            <input
              id="question"
              type="text"
              placeholder="Enter Question"
              className="w-full px-3 py-2 text-white bg-gray-700 rounded"
              onChange={(e) => setQuestion(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="answer" className="block mb-1 text-white">Answer</label>
            {/* Input field for the answer */}
            <input
              id="answer"
              type="text"
              placeholder="Enter Answer"
              className="w-full px-3 py-2 text-white bg-gray-700 rounded"
              onChange={(e) => setAnswer(e.target.value)}
            />
          </div>
          {/* Submit button */}
          <button
            type="submit"
            className="px-4 py-2 text-orange-500 border border-orange-500 rounded hover:bg-orange-500 hover:text-white hover:border-range-600"
          >
            Submit
          </button>
        </form>
        
      </div>
      
    </div>
    
    </div>
    

  );
}

export default CreateFAQ;
