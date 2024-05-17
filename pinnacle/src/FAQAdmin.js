import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Header from './components/Header';
import Footer from './components/Footer';
import Swal from 'sweetalert2';

function FAQAdmin() {
  const [faqs, setFaqs] = useState([]);
  const pageid='faq'

  useEffect(() => {
    axios
      .get(`http://localhost:3001/${pageid}`)
      .then((result) => setFaqs(result.data))
      .catch((err) => console.log(err));
  }, [pageid]);

  const handleDelete = (id) => {
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

  return (
    <div>
      <Header />
      <div className="min-h-screen px-4 py-8 bg-[#2A2B2F]">
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
                      onClick={() => handleDelete(faq._id)}
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
        </div>
        <Footer />
      </div>
    </div>
  );
}

export default FAQAdmin;
