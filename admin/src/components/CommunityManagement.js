import React, { useState, useEffect } from "react";
import CommunityDetailCard from "./CommunityDetailCard";
import axios from "axios";
import { HashLoader } from "react-spinners";
import SearchError from "../assets/animations/searchnotfound.webm";
import SuccessPopup from "./SuccessPopup";


import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';


export default function CommunityManagement() {
  var pageid = "Community";
  const [isFilterBtnChecked, setIsFilterBtnChecked] = useState(false);
  const [isPostAddFormChecked, setIsPostAddFormChecked] = useState(false);
  const [isFilterChecked, setIsFilterChecked] = useState(false);
  const [isSearchCommunityChecked, setIsSearchCommunityChecked] =useState(false);
  const [loading, setLoading] = useState(false);
  const [createSuccessMessagechecked, setCreateSuccessMessagechecked] = useState(false);

  const [image, setImage] = useState("");
  const [releasedate, setReleasedate] = useState("");
  const [description, setDescription] = useState("");
  const [name, setName] = useState("");
  const [type, setType] = useState("action");
  const [CommunityPosts, setCommunityPosts] = useState([]);
  const [filteredCommunityPosts, setFilterdCommunityPosts] = useState([]);
  const [searchedCommunityPosts, setSearchedCommunityPosts] = useState([]);

  const [releaseDateError, setReleaseDateError] = useState("");
  const [descriptionError, setDescriptionError] = useState("");
  const [nameError, setNameError] = useState("");

  const filterhandler = (type) => {
    setIsFilterChecked(true);
    const filterdPosts = CommunityPosts.filter((post) => post.type === type);
    setFilterdCommunityPosts(filterdPosts);
  };

  const searchCommunityPost = () => {
    setIsSearchCommunityChecked(true);
    const inputcommunitysearch = document.getElementById(
      "SearchCommunityInput"
    ).value;
    const searchedPosts = CommunityPosts.filter(
      (game) =>
        game.name &&
        game.name.toLowerCase().includes(inputcommunitysearch.toLowerCase())
    );
    setSearchedCommunityPosts(searchedPosts);
  };

  //read community post details
  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await axios.get(`http://localhost:3001/${pageid}`);
        setCommunityPosts(result.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();

    const interval = setInterval(() => {
      fetchData();
    }, 5000);

    return () => clearInterval(interval);
  }, [pageid]);

  const uploadFile = async (type, file) => {
    const data = new FormData();
    data.append("file", file);
    data.append(
      "upload_preset",
      type === "image" ? "community_Posts_Preset" : "Stream_Preset"
    );

    try {
      let cloudName = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME;
      console.log("Cloudinary cloud name:", cloudName);
      let resourceType = type === "image" ? "image" : "video";
      let api = `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`;

      const res = await axios.post(api, data);
      const { secure_url } = res.data;
      console.log(`${type} uploaded successfully:`, secure_url);

      return secure_url;
    } catch (error) {
      console.error(
        "Error uploading file to Cloudinary:",
        error.response?.data
      );
      throw new Error("Failed to upload file to Cloudinary");
    }
  };

  const createCommunityPost = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      // Check if name field is empty
    if (!name.trim()) {
      // Set error message if name is empty
      setNameError("Post name cannot be empty");
      setLoading(false);
      return; // Return to prevent further execution
    }

    // Reset name error if it was previously set
    setNameError("");

      // Upload image file
      const postUrl = image ? await uploadFile("image", image) : null;

      // Send backend API request
      const response = await axios.post(
        "http://localhost:3001/createCommunityPost",
        {
          postUrl,
          description,
          name,
          releasedate,
          type,
        }
      );

      const newPost = response.data; // Assuming response contains the created post details

      // Send notification to all users about the new post
      await axios.post(
        "http://localhost:3001/api/sendCommunityPostNotification",
        newPost
      );

      console.log(
        "Community post created and notification sent successfully:",
        newPost
      );

      // Reset form state
      setLoading(false);
      setIsPostAddFormChecked(false);
      setCreateSuccessMessagechecked(true);
      setImage("");
      setDescription("");
      setName("");
      setType("");
      setReleasedate("");
    } catch (error) {
      console.error(
        "Error creating community post or sending notification:",
        error
      );
      setLoading(false);
    }
  };

  const handleCreateCloseSuccessPopup = () => {
    setCreateSuccessMessagechecked(false);
  };

  const handleReleaseDateChange = (e) => {
    const selectedDate = e.target.value;
    const today = new Date().toISOString().split("T")[0]; // Get today's date in YYYY-MM-DD format

    if (selectedDate < today) {
      setReleaseDateError("Please select a future date");
      setReleasedate("");
    } else {
      setReleaseDateError("");
      setReleasedate(selectedDate);
    }
  };

  const handleDescriptionChange = (e) => {
    const enteredDescription = e.target.value;
    if (enteredDescription.length > 150) {
      setDescriptionError('Maximum 150 characters allowed');
    } else {
      setDescriptionError('');
      setDescription(enteredDescription);
    }
  };


  const [searchQuery, setSearchQuery] = useState("");
const [selectedField, setSelectedField] = useState("name");

const generatePDF = () => {
  const input = document.getElementById("pdf-table");
  html2canvas(input, { useCORS: true }).then((canvas) => {
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF();
    const imgWidth = 210;
    const pageHeight = 297;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    pdf.save("All Community Posts.pdf");
  });
};

const handleSearchChange = (e) => {
  setSearchQuery(e.target.value.toLowerCase());
};

const handleFieldChange = (e) => {
  setSelectedField(e.target.value);
};

// Filtered or searched posts
const filteredPosts = searchQuery
  ? CommunityPosts.filter(post => post[selectedField]?.toString().toLowerCase().includes(searchQuery))
  : CommunityPosts;
  



  return (
    <div className="py-5 px-7 text-white ">
      <h1 className=" text-[25px] font-bold mb-3">Community Management</h1>
      <button
        onClick={() => setIsPostAddFormChecked(true)}
        className=" float-right bg-gradient-to-tr from-[#FF451D] to-[#FE7804] px-4 py-2 text-[18px] font-semibold rounded-lg"
      >
        Add new post +
      </button>
      <div className="flex justify-start">
        <div className=" w-1/2 p-[2px] bg-gradient-to-l from-[#FE7804] to-[#FF451D] rounded-2xl">
          <input
            onKeyUp={searchCommunityPost}
            className=" bg-[#262628] text-[#FE7804] rounded-2xl w-full  px-3 py-2 placeholder-[#FE7804]"
            type="search"
            id="SearchCommunityInput"
            placeholder="Search Games...."
          />
        </div>
        <button className=" bg-gradient-to-tr from-[#FF451D] to-[#FE7804] px-4 py-2 text-[18px] font-semibold rounded-lg ml-3">
          Search
        </button>
        <div className=" relative ml-3">
          <button className=" bg-gradient-to-tr from-[#FF451D] to-[#FE7804] h-full px-2 text-[18px] font-semibold rounded-lg ">
            <img
              onClick={() => {
                setIsFilterBtnChecked(!isFilterBtnChecked);
                setIsSearchCommunityChecked(false);
              }}
              width="30"
              height="30"
              src="https://img.icons8.com/pulsar-line/48/FFFFFF/vertical-settings-mixer.png"
              alt="vertical-settings-mixer"
            />
          </button>
          {isFilterBtnChecked && (
            <div className=" absolute z-10 bg-black bg-opacity-85 pl-5 pr-10 py-3 leading-7">
              <p
                onClick={() => {
                  setIsFilterChecked(false);
                  setIsFilterBtnChecked(false);
                }}
                className=" hover:text-[#FE7804] cursor-pointer"
              >
                All
              </p>
              <p
                onClick={() => {
                  filterhandler("action");
                  setIsFilterBtnChecked(false);
                }}
                className=" hover:text-[#FE7804] cursor-pointer"
              >
                Action
              </p>
              <p
                onClick={() => {
                  filterhandler("adventure");
                  setIsFilterBtnChecked(false);
                }}
                className=" hover:text-[#FE7804] cursor-pointer"
              >
                Adventure
              </p>
              <p
                onClick={() => {
                  filterhandler("racing");
                  setIsFilterBtnChecked(false);
                }}
                className=" hover:text-[#FE7804] cursor-pointer"
              >
                Racing
              </p>
              <p
                onClick={() => {
                  filterhandler("shooter");
                  setIsFilterBtnChecked(false);
                }}
                className=" hover:text-[#FE7804] cursor-pointer"
              >
                Shooter
              </p>
              <p
                onClick={() => {
                  filterhandler("sport");
                  setIsFilterBtnChecked(false);
                }}
                className=" hover:text-[#FE7804] cursor-pointer"
              >
                Sport
              </p>
            </div>
          )}
        </div>
      </div>
      {!isSearchCommunityChecked && (
        <div className="py-6 mt-3 text-white ">
          <h1 className=" text-[18px] font-bold">All Posts</h1>
          {!isFilterChecked && (
            <div className=" flex justify-between flex-wrap">
              {CommunityPosts.map((item) => {
                return (
                  <div className=" w-[30%]">
                    <CommunityDetailCard
                      id={item._id}
                      post={item.postUrl}
                      description={item.description}
                      name={item.name}
                      releasedate={item.releasedate}
                    />
                  </div>
                );
              })}
            </div>
          )}
          {isFilterChecked && (
            <div className=" flex justify-between flex-wrap">
              {filteredCommunityPosts.map((item) => {
                return (
                  <div className=" w-[30%]">
                    <CommunityDetailCard
                      id={item._id}
                      post={item.postUrl}
                      description={item.description}
                      name={item.name}
                      releasedate={item.releasedate}
                    />
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {isSearchCommunityChecked && (
        <div className="py-6 mt-3 text-white ">
          <h1 className=" text-[18px] font-bold">Search Results</h1>
          {searchedCommunityPosts.length > 0 ? (
            <div className=" flex justify-between flex-wrap">
              {searchedCommunityPosts.map((item) => {
                return (
                  <div className=" w-[30%]">
                    <CommunityDetailCard
                      id={item._id}
                      post={item.postUrl}
                      description={item.description}
                      name={item.name}
                      releasedate={item.releasedate}
                    />
                  </div>
                );
              })}
            </div>
          ) : (
            <div className=" w-full p-7 flex flex-col justify-center items-center mb-9">
              <video autoPlay loop className="w-[200px] h-auto">
                <source src={SearchError} type="video/webm" />
                Your browser does not support the video tag.
              </video>
              <p className=" text-[#ffffffa0] text-[18px]">No results found</p>
            </div>
          )}
        </div>
      )}

      {isPostAddFormChecked && (
        <div className=" z-40 fixed top-0 left-0 flex items-center justify-center w-full h-full backdrop-blur-lg">
          <form
            onSubmit={createCommunityPost}
            className="bg-[#1B1E20] rounded-2xl border-2 w-[40%] border-[#FE7804] px-10 py-8"
          >
            <div className=" w-full">
              <h1 className=" inline-block text-[25px] font-bold">
                Add New Post
              </h1>
              <div className="float-right">
                <img
                  className=" cursor-pointer"
                  onClick={() => setIsPostAddFormChecked(false)}
                  width="25"
                  height="25"
                  src="https://img.icons8.com/ios-filled/50/FFFFFF/multiply.png"
                  alt="multiply"
                />
              </div>
              <div className="py-5 px-7 text-white "></div>
              <div className="w-[90%] mx-auto mt-5">
                <label>Post Name</label>
                <br />
                <input
                  className="w-full p-1 text-[16px] rounded-lg bg-[#2A2B2F] border-2 border-[#D8DAE3] border-opacity-20 mt-2"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
                 {nameError && <p className="text-red-500">{nameError}</p>}
              </div>
              <div className="w-[90%] mx-auto mt-5 flex justify-between">
                <div className=" w-[45%]">
                  <label>Releas Date</label>
                  <br />
                  <input
                    className="w-full p-1 text-[16px] rounded-lg bg-[#2A2B2F] border-2 border-[#D8DAE3] border-opacity-20 mt-2"
                    type="date"
                    value={releasedate}
                    onChange={handleReleaseDateChange}
                    min={new Date().toISOString().split("T")[0]} // Set min attribute to current date
                    required
                  />
                   {releaseDateError && <p className="text-red-500">{releaseDateError}</p>}
                </div>
                <div className=" w-[45%]">
                  <label>Game Type</label>
                  <br />
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="w-full px-1 py-[6px] text-[16px] rounded-lg bg-[#2A2B2F] border-2 border-[#D8DAE3] border-opacity-20 mt-2"
                    required
                  >
                    <option value="action">Action</option>
                    <option value="adventure">Adventure</option>
                    <option value="racing">Racing</option>
                    <option value="shooter">Shooter</option>
                    <option value="sports">Sports</option>
                  </select>
                </div>
              </div>
              <div className="w-[90%] mx-auto mt-5">
                <label>Post</label>
                <br />
                <input
                  className="w-full p-1 text-[16px] rounded-lg bg-[#2A2B2F] border-2 border-[#D8DAE3] border-opacity-20 mt-2"
                  type="file"
                  accept="image/*"
                  id="image"
                  onChange={(e) => setImage(e.target.files[0])}
                  required
                />
              </div>
              <div className="w-[90%] mx-auto mt-5">
                <label>Description</label>
                <br />
                <textarea
                  className="w-full p-1 text-[16px] rounded-lg bg-[#2A2B2F] border-2 border-[#D8DAE3] border-opacity-20 mt-2"
                  type="file"
                  value={description}
                  onChange={handleDescriptionChange}
                  required
                ></textarea>
{descriptionError && <p className="text-red-500">{descriptionError}</p>}
                <button
                  type="submit"
                  className=" mt-8 float-right bg-transparent text-[#FE7804] border-2 border-[#FE7804] hover:bg-[#FE7804] hover:text-white rounded-lg px-5 py-2 text-[16px] font-bold"
                >
                  Submit
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {loading && (
        <div className=" z-50 fixed top-0 left-0 w-full h-screen flex justify-center bg-black bg-opacity-50 items-center">
          <HashLoader size="75" color="#FE7804" />
        </div>
      )}

{createSuccessMessagechecked && (
  <SuccessPopup  type="Create" item="Community post" onClose={handleCreateCloseSuccessPopup} /> 
)}
    <div className="w-11/12 mx-auto mt-5">
        <h1 className="mb-6 text-2xl font-bold text-white">Manage Community Posts</h1>
        <div className="flex items-center gap-4 mb-8">
        <button onClick={generatePDF} className="float-right bg-gradient-to-tr from-[#FF451D] to-[#FE7804] px-4 py-2 text-[18px] font-semibold rounded-lg">
          Generate PDF
        </button>
        <input
          type="text"
          placeholder="Search Posts..."
          onChange={handleSearchChange}
          className="bg-[#262628] text-[#FE7804] rounded-2xl flex-grow px-4 py-2 rounded-lg placeholder-[#FE7804] h-10 text-white  px-3 py-2"
        />
        <select onChange={handleFieldChange}
            onFocus={(e) => (e.target.style.backgroundColor = "#ff7f50")} // Change to your desired color on focus
            onBlur={(e) => (e.target.style.backgroundColor = "#FF451D")} // Reset to default color on blur
            style={{
              padding: "8px 16px",
              borderRadius: "12px",
              backgroundImage:
                "linear-gradient(to top right, #FF451D, #FE7804)",
              height: "40px",
              color: "white",
              borderColor: "#ddd", // Default border color, change as needed
            }}
            className="px-4 py-2 rounded-lg bg-gradient-to-tr from-[#FF451D] to-[#FE7804] h-10 text-white">
          <option value="name">Name</option>
          <option value="name">Description</option>
          <option value="type">Type</option>
          <option value="releaseDate">Release Date</option>
        </select>

        </div>
        <div id="pdf-table" className="overflow-x-auto">
        <table id="community-table" className="w-full border border-collapse border-gray-800 table-auto">
          <thead>
            <tr>
              <th className="border px-4 py-2 border-[#1F2937] bg-gradient-to-tr from-[#FF451D] to-[#FE7804] text-white">Name</th>
              <th className="border px-4 py-2 border-[#1F2937] bg-gradient-to-tr from-[#FF451D] to-[#FE7804] text-white">Post Image</th>
              <th className="border px-4 py-2 border-[#1F2937] bg-gradient-to-tr from-[#FF451D] to-[#FE7804] text-white">Description</th>
              <th className="border px-4 py-2 border-[#1F2937] bg-gradient-to-tr from-[#FF451D] to-[#FE7804] text-white">Type</th>
              <th className="border px-4 py-2 border-[#1F2937] bg-gradient-to-tr from-[#FF451D] to-[#FE7804] text-white">Release Date</th>
            </tr>
          </thead>
          <tbody>
            {filteredPosts.map((post, index) => (
              <tr key={index}>
                <td className="border px-4 py-2 bg-[#262628] text-white border-[#1F2937]">{post.name}</td>
                <td className="border px-4 py-2 bg-[#262628] text-white border-[#1F2937]">
                    <img
                      src={post.postUrl}
                      alt="Post Image"
                      style={{ width: "100%", maxHeight: "100px" }}
                    />
                  </td>
                <td className="border px-4 py-2 bg-[#262628] text-white border-[#1F2937]">{post.description}</td>
                <td className="border px-4 py-2 bg-[#262628] text-white border-[#1F2937]">{post.type}</td>
                <td className="border px-4 py-2 bg-[#262628] text-white border-[#1F2937]">{new Date(post.releasedate).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </div>

{/*::::::::::::::::::::::::::::::::::::::::::::::Community Table::::::::::::::::::::::::::::::::::::::::::::::*/}

    </div>
  );
}
