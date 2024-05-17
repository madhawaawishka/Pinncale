import React, { useEffect, useState, useRef } from 'react';
import emailjs from '@emailjs/browser';
import Swal from 'sweetalert2';
import axios from 'axios';
import Header from './components/Header';
import Footer from './components/Footer';

const ArrowIcon = ({ expanded }) => (
  <svg
    className={`w-6 h-6 ml-3 transition-transform ${
      expanded ? 'transform rotate-90 text-orange-500' : 'text-white'
    }`}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path
      fillRule="evenodd"
      d="M6.293 5.293a1 1 0 011.414 0L10 8.586l2.293-2.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
      clipRule="evenodd"
    />
  </svg>
);

export const ContactUs = () => {
  const form = useRef();
  const [faqs, setFaqs] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [messageError, setMessageError] = useState('');

  const validateForm = () => {
    let valid = true;

    if (!name.trim()) {
      setNameError('Name is required');
      valid = false;
    } else {
      setNameError('');
    }

    if (!email.trim()) {
      setEmailError('Email is required');
      valid = false;
    } else if (!/^\S+@\S+\.\S+$/.test(email)) {
      setEmailError('Invalid email format');
      valid = false;
    } else {
      setEmailError('');
    }

    if (!message.trim()) {
      setMessageError('Message is required');
      valid = false;
    } else {
      setMessageError('');
    }

    return valid;
  };

  const sendEmail = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return; // If form is not valid, prevent submission
    }

    emailjs
      .sendForm('service_ja39tf9', 'template_4n316zm', form.current, 'XYkfwJDieS29jvxIY')
      .then(
        () => {
          console.log('SUCCESS!');
          Swal.fire({
            title: 'Good job!',
            text: 'Your Email sent successfully!',
            icon: 'success',
          });
        },
        (error) => {
          console.log('FAILED...', error.text);
        }
      );
  };

  useEffect(() => {
    axios
      .get('http://localhost:3001/faqs')
      .then((result) => setFaqs(result.data))
      .catch((err) => console.log(err));
  }, []);

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div>
      <Header />
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#2A2B2F]">
        <h1 className="my-8 text-3xl font-bold text-center text-orange-500">
          Frequently Asked Questions
        </h1>
        <div className="w-full max-w-4xl overflow-hidden">
          {faqs.map((faq) => (
            <div key={faq._id} className="mb-4 border-b border-gray-700">
              <div
                className="flex items-center justify-between px-4 py-2 text-white cursor-pointer"
                onClick={() => toggleExpand(faq._id)}
              >
                <span>{faq.question}</span>
                <ArrowIcon expanded={expandedId === faq._id} />
              </div>
              {expandedId === faq._id && (
                <div className="px-4 py-2 text-orange-500">{faq.answer}</div>
              )}
            </div>
          ))}
        </div>
        <form
          ref={form}
          onSubmit={sendEmail}
          className="w-full max-w-md px-8 py-6 mb-8 text-white border-2 rounded-lg bg-neutral-800 shadow-x1 border-red-50"
        >
          <p className="text-2xl font-bold text-center">We value your input! Tell us how we're doing.</p>

          <div className="my-5">
  <label htmlFor="name" className="block mb-2 text-xl text-orange-500">
    Name
  </label>
  <input
    type="text"
    id="name"
    name="from_name"
    value={name}
    onChange={(e) => setName(e.target.value)}
    className="bg-gray-50 border border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
    placeholder="Bonnie Green"
  />
  {nameError && <p className="text-sm text-red-500">{nameError}</p>}
</div>

          <div className="my-5">
            <label htmlFor="email" className="block mb-2 text-xl text-orange-500">
              Email
            </label>
            <input
              type="text"
              id="email"
              name="from_email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="name@flowbite.com"
              />

            {emailError && <p className="text-sm text-red-500">{emailError}</p>}
          </div>
          <div className="my-5">
            <label htmlFor="message" className="block mb-2 text-xl text-orange-500">
              Message
            </label>
            <textarea
              id="message"
              name="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows="4"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 w-full dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Leave a comment..."
            ></textarea>
            {messageError && <p className="text-sm text-red-500">{messageError}</p>}
          </div>

          <input
            type="submit"
            value="Send"
            className="px-4 py-2 text-orange-500 border border-orange-500 rounded hover:bg-orange-500 hover:text-white hover:border-range-600"
          />
        </form>
        <Footer />
      </div>
    </div>
  );
};

export default ContactUs;
