import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import StreamDetailsPage from './pages/StreamDetailsPage';

// Component for creating new feedback
export default function CreateFeedback() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [feedback, setFeedback] = useState('');
    const navigate = useNavigate();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const streamid = queryParams.get("streamid");

    // Function to handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post('http://localhost:3001/createfeedback', { name, email, feedback,streamid })
            .then(result => {
                console.log(result); // Log the result
                navigate('/fblist'); // Redirect to feedback list page after successful submission
            })
            .catch(err => console.log(err)); // Log any errors
    }

    return (
        <div>
            <div>
                <form onSubmit={handleSubmit}>
                    <h2>Add Feedback</h2>
                    <div>
                        <label htmlFor="name">Name</label>
                        <input type='text' placeholder='Enter Name' onChange={(e) => setName(e.target.value)} />
                    </div>
                    <div>
                        <label htmlFor="email">Email</label>
                        <input type='email' placeholder='Enter Email' onChange={(e) => setEmail(e.target.value)} />
                    </div>
                    <div>
                        <label htmlFor="feedback">Feedback</label>
                        <input type='text' placeholder='Enter Feedback' onChange={(e) => setFeedback(e.target.value)} />
                    </div>
                    <button type='submit'>Submit</button>
                </form>
            </div>
        </div>
    );
}
