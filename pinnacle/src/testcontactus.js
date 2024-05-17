import axios from 'axios';
import React, { useEffect, useState } from 'react';

// Larger Arrow SVG icon components for indicating expand/collapse state
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

export default function TestContactUs() {
  const [faqs, setFaqs] = useState([]);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:3001/faqs')
      .then(result => setFaqs(result.data))
      .catch(err => console.log(err));
  }, []);

  const toggleExpand = (id) => {
    if (expandedId === id) {
      setExpandedId(null); // Collapse if already expanded
    } else {
      setExpandedId(id); // Expand if not already expanded
    }
  };

  return (
    <div className="min-h-screen px-4 py-8 bg-gray-900">
      <div className="max-w-4xl mx-auto">
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
    </div>
  );
}
