import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import Header from './components/Header';
import Footer from './components/Footer';

// Component for managing and displaying user feedback
function UsersFeedback() {
    const memberId = '66200f2d894831ba8d3c21cd';
    const [feedbacks, setFeedbacks] = useState([]); // State to hold feedback data
    const [searchQuery, setSearchQuery] = useState(''); // State for search input
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [feedback, setFeedback] = useState('');
    const [errors, setErrors] = useState({}); // State to manage form validation errors
    const [selectedFeedback, setSelectedFeedback] = useState(null); // Track selected feedback
    const navigate = useNavigate(); // Hook to enable navigation

    // Function to handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();

        // Validate form fields
        const newErrors = {};
        if (!name) {
            newErrors.name = 'Name is required';
        }
        if (!email) {
            newErrors.email = 'Email is required';
        }
        if (!feedback) {
            newErrors.feedback = 'Feedback is required';
        }

        // If there are errors, set them and prevent form submission
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        // If no errors, submit the form
        axios.post("http://localhost:3001/createfeedback", { name, email, feedback })
            .then(result => {
                console.log(result);
                Swal.fire({
                    title: "Good job!",
                    text: "Comment submitted successfully!",
                    icon: "success"
                }).then(() => {
                    // navigate('/fblist'); // Navigate to feedback list
                    // window.location.reload(); // Reload the page to reflect changes
                });
            })
            .catch(err => console.log(err));
    };

    // Fetch all feedbacks from the server on component mount
    useEffect(() => {
        axios.get('http://localhost:3001/feedback')
            .then(result => setFeedbacks(result.data))
            .catch(err => console.log(err));
    }, []);

    // Function to handle feedback deletion
    const handleDelete = (id) => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        }).then((result) => {
            if (result.isConfirmed) {
                axios.delete(`http://localhost:3001/deleteFeedback/${id}`)
                    .then(res => {
                        Swal.fire({
                            title: "Deleted!",
                            text: "Your file has been deleted.",
                            icon: "success"
                        }).then(() => {
                            window.location.reload(); // Reload the page after deletion
                        });
                    })
                    .catch(err => {
                        console.error("Error deleting feedback:", err);
                        Swal.fire({
                            title: "Error!",
                            text: "Failed to delete feedback.",
                            icon: "error"
                        });
                    });
            }
        });
    };

    // Function to toggle dropdown menu for each feedback item
    const toggleMenu = (feedbackId) => {
        if (selectedFeedback === feedbackId) {
            setSelectedFeedback(null); // Hide menu if already selected
        } else {
            setSelectedFeedback(feedbackId); // Show menu for the selected feedback
        }
    };

    // Filter feedbacks based on search query
    const filteredFeedbacks = feedbacks.filter(feedback =>
        feedback.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen text-white bg-[#2A2B2F]">
            <Header/>
            <div className="container py-8 mx-auto">
                <h1 className="text-xl font-bold">{filteredFeedbacks.length} Comments</h1>
                <input
                    type="text"
                    placeholder="Search comments by name"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-3 py-2 mt-4 mb-8 text-white bg-[#2A2B2F] border border-gray-300 rounded"
                />

                <div className="flex flex-col space-y-4">
                    {filteredFeedbacks.map((feedback, index) => (
                        <div key={feedback._id} className={`p-6 rounded-lg shadow-md ${feedback._id === memberId ? 'bg-gradient-to-r from-orange-600 to-orange-400' : 'bg-[#2A2B2F]'} border-2 border-orange-500 ${index !== filteredFeedbacks.length - 1 ? 'mb-4' : ''}`}>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="orange" className="w-6 h-6 mr-2">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                                    </svg>
                                    <h3 className="text-lg font-semibold">{feedback.name}</h3>
                                </div>
                                {feedback._id === memberId && (
                                    <button onClick={() => toggleMenu(feedback._id)} className="text-white">
                                        {/* Three-dot menu icon */}
                                        <span className="text-3xl">&#8230;</span>
                                    </button>
                                )}
                            </div>
                            <p className='text-xs'>{feedback.email}</p>
                            <p className='text-xl'>Feedback: {feedback.feedback}</p>
                            {selectedFeedback === feedback._id && (
                                <div className="mt-4">
                                <Link to={`/updatefeedback/${feedback._id}`} className="inline-block px-4 py-2 mr-2 text-white bg-blue-500 border border-blue-500 rounded hover:bg-blue-600">
                                    Update
                                </Link>
                                <button onClick={() => handleDelete(feedback._id)} className="inline-block px-4 py-2 text-white bg-red-500 border border-red-500 rounded hover:bg-red-600">
                                    Delete
                                </button>
                            </div>
                            )}
                        </div>
                    ))}
                </div>

                <div className="mt-8">
                    <form onSubmit={handleSubmit}>
                        <h2 className="mb-4 text-xl">Add Comment</h2>
                        <div className="mb-4">
                            <label htmlFor="name">Name</label>
                            <input
                                type='text'
                                id="name"
                                placeholder='Enter Name'
                                className="w-full px-3 py-2 mt-1 text-white bg-[#2A2B2F] border rounded"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                            {errors.name && <p className="text-red-500">{errors.name}</p>}
                        </div>
                        <div className="mb-4">
                            <label htmlFor="email">Email</label>
                            <input
                                type='email'
                                id="email"
                                placeholder='Enter Email'
                                className="w-full px-3 py-2 mt-1 text-white bg-[#2A2B2F] border rounded"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            {errors.email && <p className="text-red-500">{errors.email}</p>}
                        </div>
                        <div className="mb-4">
                            <label htmlFor='feedback'>Feedback</label>
                            <input
                                type='text'
                                id="feedback"
                                placeholder='Enter Feedback'
                                className="w-full px-3 py-2 mt-1 text-white bg-[#2A2B2F] border rounded"
                                value={feedback}
                                onChange={(e) => setFeedback(e.target.value)}
                            />
                            {errors.feedback && <p className="text-red-500">{errors.feedback}</p>}
                        </div>
                        <button
                            type='submit'
                            className="px-4 py-2 text-orange-500 border border-orange-500 rounded hover:bg-orange-500 hover:text-white hover:border-range-600">
                            Submit
                        </button>
                    </form>
                </div>
            </div>
            <Footer/>
        </div>
    );
}

export default UsersFeedback;
