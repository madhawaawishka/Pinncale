import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import Header from './components/Header';
import Footer from './components/Footer';
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

function UsersFeedback() {
    // State to hold feedback data
    const [feedbacks, setFeedbacks] = useState([]);

    // Fetch feedback data from server on component mount
    useEffect(() => {
        axios.get('http://localhost:3001/feedback')
            .then(result => setFeedbacks(result.data))
            .catch(err => console.log(err));
    }, []);

    // Handle delete feedback action
    const handleDelete = (id) => {
        // Display confirmation dialog using SweetAlert
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
                // Send delete request to server
                axios.delete(`http://localhost:3001/deleteFeedback/${id}`)
                    .then(res => {
                        // Show success message on successful delete
                        Swal.fire({
                            title: "Deleted!",
                            text: "Comment has been deleted.",
                            icon: "success"
                        }).then(() => {
                            // Reload page to reflect changes
                            window.location.reload();
                        });
                    })
                    .catch(err => {
                        // Log and display error message on delete failure
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

    const exportPdfHandler = () => {
        const doc = new jsPDF();
      
        // Add a header to the PDF
        const header = 'Users Feedbacks';
        const date = new Date().toLocaleDateString(); // Current date
        const time = new Date().toLocaleTimeString(); // Current time
      
        // Customize the header style (font size, alignment, etc.)
        doc.setFontSize(20);
        doc.text(header, 14, 20);
      
        doc.setFontSize(12);
        doc.text(`Date: ${date}`, 14, 30);
        doc.text(`Time: ${time}`, 14, 40); // Add current time
      
        // Increase the space between time and table
        const startY = 60; // Adjust this value to increase the vertical space
        const data = feedbacks.map(feedback => [
          feedback.name,
          feedback.email,
          feedback.feedback
        ]);
      
        doc.autoTable({
          startY: startY, // Position below the time
          head: [['Name', 'Email', 'Feedback']],
          body: data
        });
      
        doc.save('Feedbacks.pdf');
      };
      
    // Render component
    return (
        
        <div className="min-h-screen bg-[#2A2B2F]">
            <Header/>
            <div className="container px-8 mx-auto">
                <h1 className="mb-8 text-4xl font-semibold text-center text-orange-500">Users Feedbacks</h1>

                <table className="w-full overflow-hidden rounded-md shadow-md bg-neutral-800" id="product-table">
                    <thead className="text-xl leading-normal uppercase bg-neutral-900 text-gray-950">
                        <tr>
                            <th className="px-6 py-3 text-left text-slate-50">Name</th>
                            <th className="px-6 py-3 text-left text-slate-50">Email</th>
                            <th className="px-6 py-3 text-left text-slate-50">Feedback</th>
                            <th className="px-6 py-3 text-center text-slate-50">Action</th>
                        </tr>
                    </thead>
                    <tbody className="text-lg font-light text-white">
                        {/* Map through feedbacks array to render table rows */}
                        {feedbacks.map((feedback) => (
                            <tr key={feedback._id} className="border-b border-gray-200 hover:bg-neutral-900">
                                <td className="px-6 py-4 text-left whitespace-nowrap">{feedback.name}</td>
                                <td className="px-6 py-4 text-left whitespace-nowrap">{feedback.email}</td>
                                <td className="px-6 py-4 text-left">{feedback.feedback}</td>
                                <td className="px-6 py-4 text-center">
                                    {/* Link to update feedback */}
                                    <Link to={`/Adminfbupdate/${feedback._id}`}   className="inline-block px-4 py-2 mr-2 text-white transition-colors duration-300 bg-blue-600 border border-blue-600 rounded-md hover:bg-blue-800 hover:border-blue-800">Update</Link>
                                    {/* Button to delete feedback */}
                                    <button onClick={() => handleDelete(feedback._id)}   className="inline-block px-4 py-2 text-white transition-colors duration-300 bg-red-600 border border-red-600 rounded-md hover:bg-red-800 hover:border-red-800"
>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className="flex justify-end mt-4">
                 <button onClick={exportPdfHandler} className="px-4 py-2 font-bold text-white rounded bg-neutral-800 hover:bg-blue-700">Export PDF</button>
                </div>                
            </div>
            <Footer/>
        </div>
    );
}

export default UsersFeedback;
