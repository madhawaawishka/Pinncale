import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

export default function FeedbackManagement() {
       const pageid='fblist';
      // State to hold feedback data
      const [feedbacks, setFeedbacks] = useState([]);
     


      // Fetch feedback data from server on component mount
      useEffect(() => {
        axios.get(`http://localhost:3001/${pageid}`)
            .then(result => setFeedbacks(result.data))
            .catch(err => console.log(err));
    }, [pageid]);

    
  
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
          const data = filteredFeedbacks.map(feedback => [
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

        const [faqbutton,setfaqbutton]=useState(false);
        const [feedbackbutton,setfeedbackbutton]=useState(true);
        
        
        const [faqs, setFaqs] = useState([]);

        useEffect(() => {
          axios
            .get(`http://localhost:3001/${'faq'}`)
            .then((result) => setFaqs(result.data))
            .catch((err) => console.log(err));
        }, []);
      
        const handlefaqDelete = (id) => {
          // Display confirmation dialog using SweetAlert2
          Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
          }).then((result) => {
            if (result.isConfirmed) {
              // Proceed with deletion upon confirmation
              axios
                .delete(`http://localhost:3001/deletefaq/${id}`)
                .then((res) => {
                  console.log(res);
                  // Display success message upon successful deletion
                  Swal.fire({
                    title: 'Deleted!',
                    text: 'Your file has been deleted.',
                    icon: 'success'
                  });
                  // Reload the page to reflect changes after deletion
                  window.location.reload();
                })
                .catch((err) => {
                  console.log(err);
                  // Display error message upon deletion failure
                  Swal.fire({
                    title: 'Error!',
                    text: 'Failed to delete file.',
                    icon: 'error'
                  });
                });
            }
          });
        };
        
        const [searchQuery, setSearchQuery] = useState(''); // State for search input
        const filteredFeedbacks = feedbacks.filter(feedback =>
          feedback.name.toLowerCase().includes(searchQuery.toLowerCase())
      );

  return (
    
    <div>
      <h1 className='mb-4 text-2xl font-bold'>Feedback and FAQ managment</h1>
       <div className="container px-8 mx-auto">
       <div className="flex gap-4">
  <button
    onClick={() => {
      setfaqbutton(true);
      setfeedbackbutton(false);
    }}
    className="px-4 py-2 font-bold text-white bg-orange-600 rounded hover:bg-blue-700"
  >
    FAQ
  </button>

  <button
    onClick={() => {
      setfaqbutton(false);
      setfeedbackbutton(true);
    }}
    className="px-4 py-2 font-bold text-white bg-orange-600 rounded hover:bg-blue-700"
  >
    Feedback
  </button>
</div>
        {feedbackbutton && (<div>
                <h1 className="mb-8 text-4xl font-semibold text-center text-orange-500">Users Feedbacks</h1>

                <h1 className="text-xl font-bold">{filteredFeedbacks.length} Comments</h1>
                <input
                    type="text"
                    placeholder="Search comments"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-3 py-2 mt-4 mb-8 text-white bg-[#2A2B2F] border border-gray-300 rounded"
                />

                <table className="w-full overflow-hidden rounded-md shadow-md bg-neutral-800" id="product-table">
                    <thead className="text-xl leading-normal uppercase bg-neutral-900 text-gray-950">
                        <tr>
                            <th className="px-6 py-3 text-left text-slate-50">Name</th>
                            <th className="px-6 py-3 text-left text-slate-50">Email</th>
                            <th className="px-6 py-3 text-left text-slate-50">Feedback</th>
                            <th className="px-6 py-3 text-center text-slate-50">Stream Name</th>
                            <th className="px-6 py-3 text-center text-slate-50">Action</th>
                            
                        </tr>
                    </thead>
                    <tbody className="text-lg font-light text-white">
                        {/* Map through feedbacks array to render table rows */}
                        {filteredFeedbacks.map((feedback) => (
                            <tr key={feedback._id} className="border-b border-gray-200 hover:bg-neutral-900">
                                <td className="px-6 py-4 text-left whitespace-nowrap">{feedback.name}</td>
                                <td className="px-6 py-4 text-left whitespace-nowrap">{feedback.email}</td>
                                <td className="px-6 py-4 text-left">{feedback.feedback}</td>
                                {/* <td className="px-6 py-4 text-left">
                                  {streams.find(stream => streams._id === feedback.streamid)?.name || 'Unknown Stream'}
                                </td> */}
                                <td className="px-6 py-4 text-left">{feedback.streamid}</td>

                                <td className="px-6 py-4 text-center">
                                  {/* Link to update feedback */}
                                  <div className="inline-block mr-2">
                                  <Link to={`/Adminfbupdate/${feedback._id}`} className="px-4 py-2 font-bold text-white bg-orange-600 rounded hover:bg-blue-700">
                                      Update
                                    </Link>
                                    </div>
                                    </td><td>

                                  {/* Button to delete feedback */}
                                  <div className="inline-block">
                                    <button onClick={() => handleDelete(feedback._id)} className="px-4 py-2 text-white transition-colors duration-300 bg-red-600 border border-red-600 rounded-md hover:bg-red-800 hover:border-red-800">
                                      Delete
                                    </button>
                                  </div>
                                </td>

                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className="flex justify-end mt-4">
                 <button onClick={exportPdfHandler} className="px-4 py-2 font-bold text-white rounded bg-neutral-800 hover:bg-blue-700">Export PDF</button>
                </div> 
                </div>)}
                {faqbutton && (<div><div className="min-h-screen px-4 py-8 bg-[#2A2B2F]">
        <div className="max-w-4xl mx-auto">
          <table className="w-full mb-8 table-auto">
            <thead>
              <tr>
                <th className="px-4 py-2 text-white">Question</th>
                <th className="px-4 py-2 text-white">Answer</th>
                <th className="px-4 py-2"></th>
              </tr>
            </thead>
            <tbody>
              {faqs.map((faq) => (
                <tr key={faq._id} className="border-b border-gray-700">
                  <td className="px-4 py-2 text-white">{faq.question}</td>
                  <td className="px-4 py-2 text-white">{faq.answer}</td>
                  <td className="px-4 py-2">
                    <button
                      className="px-3 py-1 text-white bg-red-600 rounded hover:bg-red-700"
                      onClick={() => handlefaqDelete(faq._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <Link
            to="/createfaq"
            className="px-4 py-2 text-orange-500 border border-orange-500 rounded hover:bg-orange-500 hover:text-white hover:border-range-600"
          >
            Add New FAQ Section
          </Link>
        </div></div></div>)}               
            </div>
            
    </div>
  )
}
