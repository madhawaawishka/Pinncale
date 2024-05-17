import React, { useState, useEffect } from 'react';
import axios from 'axios';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export default function StreamManagement() {
  const [streams, setStreams] = useState([]);
  const [countsByType, setCountsByType] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedField, setSelectedField] = useState('name');
  const [selectedChannel, setSelectedChannel] = useState('');
  const [channels, setChannels] = useState([]); // Define the state for channels here

  useEffect(() => {
    const fetchChannels = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/channels');
        setChannels(response.data); // Store the fetched data in the channels state
      } catch (error) {
        console.error("Error fetching channels:", error);
        alert(error.message);
      }
    };

    fetchChannels();
  }, []);


  useEffect(() => {
    const fetchStreams = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/streams');

        if (response.data) {
          setStreams(response.data);
          countStreamsByType(response.data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        alert(error.message);
      }
    };

    fetchStreams();
  }, []);


  const countStreamsByType = (streams) => {
    const counts = {};
    streams.forEach(stream => {
      const type = stream.type || "unknown";  // Handle potentially undefined types
      counts[type] = counts[type] + 1 || 1;
    });
    setCountsByType(counts);
  };

  const generatePDF = () => {
    const input = document.getElementById('pdf-table');
    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF();
      const imgWidth = 210;
      const pageHeight = 297;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save('All Streams.pdf');
    });
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value.toLowerCase());
  };

  const handleFieldChange = (event) => {
    const value = event.target.value;
    if (value.startsWith("channel-")) {
      setSelectedChannel(value.split("channel-")[1]);
      setSelectedField('channel_ID.channelName');  // Assuming this field is used for filtering by channel name
      setSearchQuery('');  // Clear other search queries
    } else {
      setSelectedField(value);
      setSelectedChannel('');  // Clear channel filter when other fields are selected
    }
  };


  const filteredData = streams.filter(stream => {
    if (selectedChannel && selectedField === 'channel_ID.channelName') {
      return stream.channel_ID && stream.channel_ID.channelName === selectedChannel;
    } else {
      const fieldValue = stream[selectedField] || "";
      return fieldValue.toString().toLowerCase().includes(searchQuery);
    }
  });


  useEffect(() => {
    const fetchStreamCountsByType = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/streams/count-by-type');
        if (response.data) {
          setCountsByType(response.data); // Assuming you have a useState to hold this
        }
      } catch (error) {
        console.error("Error fetching stream counts by type:", error);
        alert(error.message);
      }
    };

    fetchStreamCountsByType();
  }, []);


  return (
    <div className="bg-gray-900 min-h-screen p-5 text-white">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold text-center mb-6">Stream Counts by Type</h1>


        <div className="grid md:grid-cols-3 gap-4">
          {Object.entries(countsByType).map(([type, count]) => (
            <div key={type} className="bg-gray-800 shadow-lg rounded-lg p-4">
              <h2 className="text-xl font-semibold">{type.toUpperCase()}</h2>
              <p className="text-lg">Count: {count}</p>
            </div>
          ))}
        </div>


        <div className="w-11/12 mx-auto mt-5">
          <h1 className="text-white text-2xl font-bold mb-6">All Streams</h1>
          <div className="mb-8 flex gap-4 items-center">
            <button onClick={generatePDF} className="float-right bg-gradient-to-tr from-[#FF451D] to-[#FE7804] px-4 py-2 text-[18px] font-semibold rounded-lg">
              Generate PDF
            </button>
            <input
              type="text"
              className="bg-[#262628] text-[#FE7804] rounded-2xl flex-grow px-4 py-2 rounded-lg placeholder-[#FE7804] h-10 text-white  px-3 py-2 "

              placeholder="Search..."
              onChange={handleSearchChange}
            />
            <select onChange={handleFieldChange} onFocus={(e) => e.target.style.backgroundColor = '#ff7f50'} // Change to your desired color on focus
              onBlur={(e) => e.target.style.backgroundColor = '#FF451D'}  // Reset to default color on blur
              style={{
                padding: '8px 16px',
                borderRadius: '12px',
                backgroundImage: 'linear-gradient(to top right, #FF451D, #FE7804)',
                height: '40px',
                color: 'white',
                borderColor: '#ddd' // Default border color, change as needed
              }} className="px-4 py-2 rounded-lg bg-gradient-to-tr from-[#FF451D] to-[#FE7804] h-10 text-white">
              <optgroup label="Stream Fields">
                <option value="name">Name</option>
                <option value="videoUrl">Video URL</option>
                <option value="thumbnailUrl">Thumbnail URL</option>
                <option value="description">Description</option>
                <option value="viewCount">View Count</option>
                <option value="type">Type</option>
                <option value="secretVideoCode">Secret Video Code</option>
              </optgroup>
              <optgroup label="Channels">
                {channels.map(channel => (
                  <option key={channel._id} value={`channel-${channel.channelName}`}>{channel.channelName}</option>
                ))}
              </optgroup>
            </select>


          </div>

          <div id="pdf-table" className="overflow-x-auto">
            <table className="table-auto w-full border-collapse border border-gray-800">
              <thead>
                <tr>
                  <th className="border px-4 py-2 border-[#1F2937] bg-gradient-to-tr from-[#FF451D] to-[#FE7804] text-white">Name</th>
                  <th className="border px-4 py-2 border-[#1F2937] bg-gradient-to-tr from-[#FF451D] to-[#FE7804] text-white">Video</th>
                  <th className="border px-4 py-2 border-[#1F2937] bg-gradient-to-tr from-[#FF451D] to-[#FE7804] text-white">Thumbnail</th>
                  <th className="border px-4 py-2 border-[#1F2937] bg-gradient-to-tr from-[#FF451D] to-[#FE7804] text-white">Description</th>
                  <th className="border px-4 py-2 border-[#1F2937] bg-gradient-to-tr from-[#FF451D] to-[#FE7804] text-white">View Count</th>
                  <th className="border px-4 py-2 border-[#1F2937] bg-gradient-to-tr from-[#FF451D] to-[#FE7804] text-white">Type</th>
                  {/* <th className="border px-4 py-2 border-[#1F2937] bg-gradient-to-tr from-[#FF451D] to-[#FE7804] text-white">Channel ID</th>  */}
                  <th className="border px-4 py-2 border-[#1F2937] bg-gradient-to-tr from-[#FF451D] to-[#FE7804] text-white">Secret Video Code</th>
                  <th className="border px-4 py-2 border-[#1F2937] bg-gradient-to-tr from-[#FF451D] to-[#FE7804] text-white">Channel Name</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((stream) => (
                  <tr key={stream._id}>
                    <td className="border px-4 py-2 bg-[#262628] text-white border-[#1F2937]">{stream.name}</td>
                    <td className="border px-4 py-2 bg-[#262628] text-white border-[#1F2937]">
                      <video controls src={stream.videoUrl} style={{ width: '100%', maxHeight: '100px' }} />
                    </td>
                    <td className="border px-4 py-2 bg-[#262628] text-white border-[#1F2937]">
                      <img src={stream.thumbnailUrl} alt="thumbnail" style={{ width: '100%', maxHeight: '100px' }} />
                    </td>
                    <td className="border px-4 py-2 bg-[#262628] text-white border-[#1F2937]">{stream.description}</td>
                    <td className="border px-4 py-2 bg-[#262628] text-white border-[#1F2937]">{stream.viewCount}</td>
                    <td className="border px-4 py-2 bg-[#262628] text-white border-[#1F2937]">{stream.type}</td>
                    {/* <td className="border px-4 py-2 bg-[#262628] text-white border-[#1F2937]">
                      {stream.channel_ID ? stream.channel_ID._id : 'No Channel'}
                    </td>  */}
                    <td className="border px-4 py-2 bg-[#262628] text-white border-[#1F2937]">{stream.secretVideoCode}</td>
                    <td className="border px-4 py-2 bg-[#262628] text-white border-[#1F2937]">
                      {stream.channel_ID ? stream.channel_ID.channelName : 'No Channel'}
                    </td>
                  </tr>
                ))}
              </tbody>

            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
