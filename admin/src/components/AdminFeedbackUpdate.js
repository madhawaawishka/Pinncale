import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';


// Component for updating feedback details
function AdminFeedbackUpdate() {
    const { id } = useParams(); // Get the feedback ID from the route parameters
    const [name, setName] = useState(''); // State for name input
    const [email, setEmail] = useState(''); // State for email input
    const [feedback, setFeedback] = useState(''); // State for feedback input
    const navigate = useNavigate(); // Hook to enable navigation

    // Fetch feedback data based on the ID from the server
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`http://localhost:3001/getFeedback/${id}`);
                setName(response.data.name); // Set the name state with fetched name
                setEmail(response.data.email); // Set the email state with fetched email
                setFeedback(response.data.feedback); // Set the feedback state with fetched feedback
            } catch (error) {
                console.error('Error fetching feedback:', error);
            }
        };

        fetchData(); // Call the fetchData function on component mount with ID dependency
    }, [id]);

    // Function to handle feedback update
    const handleUpdate = async (e) => {
        e.preventDefault();

        try {
            // Send updated feedback data to the server
            await axios.put(`http://localhost:3001/updatefeedback/${id}`, { name, email, feedback });
            navigate('/'); // Navigate back to the home page after successful update
        } catch (error) {
            console.error('Error updating feedback:', error);
        }
    };

    return (
        <div className="min-h-screen bg-[#2A2B2F]"> {/* Apply bg-gray-900 and min-h-screen to ensure it covers the entire page */}
        
            <h1 className='mb-3 text-3xl font-bold text-center text-orange-500'>Update Feedbacks</h1>
            <div className="container mx-auto">
                <div className="max-w-lg p-8 mx-auto rounded-lg shadow-md bg-neutral-800">
                    <h2 className="mb-4 text-2xl font-semibold text-center text-orange-600">Update Feedback Form</h2>
                    <form onSubmit={handleUpdate}>
                        <div className="mb-4">
                            <label htmlFor="name" className="block text-sm font-medium text-zinc-400">Name</label>
                            <input 
                                type="text" 
                                id="name" 
                                placeholder="Enter Name" 
                                value={name} 
                                onChange={(e) => setName(e.target.value)} 
                                className="w-full p-2 mt-1 border rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="email" className="block text-sm font-medium text-zinc-400">Email</label>
                            <input 
                                type="email" 
                                id="email" 
                                placeholder="Enter Email" 
                                value={email} 
                                onChange={(e) => setEmail(e.target.value)} 
                                className="w-full p-2 mt-1 border rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="feedback" className="block text-sm font-medium text-zinc-400 ">Feedback</label>
                            <input 
                                type="text" 
                                id="feedback" 
                                placeholder="Enter Feedback" 
                                value={feedback} 
                                onChange={(e) => setFeedback(e.target.value)} 
                                className="w-full p-2 mt-1 border rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                        <button type="submit" className="px-4 py-2 text-orange-500 border border-orange-500 rounded hover:bg-orange-500 hover:text-white hover:border-range-600">Update</button>
                    </form>
                </div>
            </div>
            
        </div>
    );
}

export default AdminFeedbackUpdate;
