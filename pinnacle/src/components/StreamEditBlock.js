//stream display block is used in my account channel page
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { HashLoader } from "react-spinners";
import DeleteWorning from "../assets/animations/deleteanimation.webm";
import SuccessPopup from "./SuccessPopup";

export default function StreamEditBlock(props) {
  const [formHandle, setFormHandle] = useState(false);
  const [streamDetailBox, setStreamDetailBox] = useState(false);
  const [streamItemDetails, setstreamItemDetails] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isDeleteWarning, setIsDeleteWarning] = useState(false);
  const [updateSuccessMessagechecked, setUpdateSuccessMessagechecked] =
    useState(false);
  const [deleteSuccessMessagechecked, setDeleteSuccessMessagechecked] =
    useState(false);

  const [name, setName] = useState("");
  const [video, setVideo] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const [description, setDescription] = useState("");
  const [viewCount, setViewCount] = useState(0);
  const [type, setType] = useState("action");
  const [gameType, setGameType] = useState("other");
  const [channel_ID, setChannel_ID] = useState("");
  const [secretVideoCode, setSecretVideoCode] = useState("");

  const navigate = useNavigate();

  // Read stream details using stream id
  useEffect(() => {
    axios
      .get(`http://localhost:3001/getStream/${props.id}`)
      .then((result) => {
        console.log(result);
        setstreamItemDetails(result.data);
        setName(result.name);
        setVideo(result.videoUrl);
        setThumbnail(result.thumbnailUrl);
        setDescription(result.description);
        setViewCount(result.viewCount);
        setType(result.type);
        setGameType(result.gameType);
        setChannel_ID(result.data.channel_ID);
        setSecretVideoCode(result.data.secretVideoCode);
      })
      .catch((err) => console.log(err));
  }, [props.id]);

  // Delete stream using stream id
  const handleDelete = (id) => {
    axios
      .delete("http://localhost:3001/deleteStream/" + id)
      .then((res) => {
        console.log(res);
       
      })
      .catch((errr) => console.log(errr));
    setDeleteSuccessMessagechecked(true);
    setStreamDetailBox(false);
  };
  // Function to upload file to Cloudinary
  const uploadFile = async (type, file, ftype) => {
    const data = new FormData();
    if (ftype === "stream") {
      data.append("file", file);
      data.append(
        "upload_preset",
        type === "image" ? "StreamThumbnail_Preset" : "Stream_Preset"
      );
    } else if (ftype === "channel") {
      data.append("file", file);
      data.append(
        "upload_preset",
        type === "image" ? "channelDP_Preset" : "Stream_Preset"
      );
    }

    try {
      let cloudName = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME;
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
  // Update stream details using stream id
  const streamUpdate = async (e) => {
    e.preventDefault();

    if (thumbnail && thumbnail.size > 10485760) {
      alert("Thumbnail must be less than 10 MB");
      return;
    }
    if (video && video.size > 104857600) {
      alert("Video must be less than 100 MB");
      return;
    }
    const codePattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!codePattern.test(secretVideoCode)) {
      alert("Secret Video Code must contain at least one uppercase letter, one lowercase letter, one number, one special character, and be at least 8 characters long");
      return;
    }
    setLoading(true);
    try {
      // Upload video file
      const videoUrl = video
        ? await uploadFile("video", video, "stream")
        : null;
      // Upload image file
      const thumbnailUrl = thumbnail
        ? await uploadFile("image", thumbnail, "stream")
        : null;

      const response = axios.put(
        "http://localhost:3001/updateStream/" + props.id,
        {
          name,
          videoUrl,
          thumbnailUrl,
          description,
          viewCount,
          type,
          channel_ID,
          secretVideoCode,
          gameType,
        }
      );
      console.log("Stream updated successfully:", response.data);
      // window.location.reload();
      setLoading(false);
      setFormHandle(false);
      setStreamDetailBox(false);
      setUpdateSuccessMessagechecked(true);
      
      // navigate("/stream");
    } catch (error) {
      console.error("Error updating stream:", error);
    }
  };

  const handleDeleteCloseSuccessPopup = () => {
    setDeleteSuccessMessagechecked(false);
  };

  const handleUpdateCloseSuccessPopup = () => {
    setUpdateSuccessMessagechecked(false);
  };

  return (
    <div className=" bg-black">
      {/* Display stream details */}
      <div  onClick={() => setStreamDetailBox(true)}>
        <div className=" ">
          <div className="relative w-full h-full overflow-hidden group">
            <img
              src={streamItemDetails.thumbnailUrl}
              alt="Thumbnail"
              className="w-full group-hover:opacity-0 transition-opacity duration-300"
            />
            <video
              autoPlay
              muted
              src={streamItemDetails.videoUrl}
              className="absolute top-0 left-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            />
          </div>
          <div className=" flex justify-between p-2">
            <h1 className=" text-lg font-bold">{streamItemDetails.name}</h1>
            <h1>{streamItemDetails.viewCount} Views</h1>
          </div>
        </div>
      </div>

      {/* disolay more details of stream  */}

      {streamDetailBox && (
        <div className=" fixed top-0 left-0 z-10 flex items-center justify-center w-full h-full backdrop-blur-lg">
          <div className="bg-[#1B1E20] rounded-2xl border-2 w-[70%] border-[#FE7804] px-10 py-8">
            <div>
              <h1 className=" inline-block text-[25px] font-bold mb-6">
                {streamItemDetails.name}
              </h1>
              <div className=" float-right cursor-pointer" >
              <img
              onClick={() => setStreamDetailBox(false)}

                width="25"
                height="25"
                src="https://img.icons8.com/ios-filled/50/FFFFFF/multiply.png"
                alt="multiply"
              />
              </div>

            </div>
            <div className=" flex justify-between">
              <div className="relative w-1/2 h-full p-2 overflow-hidden group">
                <img
                  src={streamItemDetails.thumbnailUrl}
                  alt="Thumbnail"
                  className="w-full group-hover:opacity-0 transition-opacity duration-300"
                />
                <video
                  autoPlay
                  muted
                  src={streamItemDetails.videoUrl}
                  className="absolute top-0 left-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                />
              </div>
              <div className=" w-[67%] pl-5 leading-8">
                <pre className=" text-[#ffffff73]">
                  <img
                    className=" inline-block mr-3"
                    width="12"
                    height="12"
                    src="https://img.icons8.com/tiny-glyph/32/FD7E14/checkmark.png"
                    alt="checkmark"
                  />
                  <span className=" text-white font-bold">Ganre</span> :{" "}
                  <span>{streamItemDetails.type} </span>
                </pre>
                <pre className=" text-[#ffffff73]">
                  <img
                    className=" inline-block mr-3"
                    width="12"
                    height="12"
                    src="https://img.icons8.com/tiny-glyph/32/FD7E14/checkmark.png"
                    alt="checkmark"
                  />
                  <span className=" text-white font-bold">Game Type</span> :{" "}
                  <span>{streamItemDetails.gameType} </span>
                  </pre>
                <pre className=" text-[#ffffff73]">
                  <img
                    className=" inline-block mr-3"
                    width="12"
                    height="12"
                    src="https://img.icons8.com/tiny-glyph/32/FD7E14/checkmark.png"
                    alt="checkmark"
                  />
                  <span className=" text-white font-bold">Views</span> :{" "}
                  <span>{streamItemDetails.viewCount} </span>
                </pre>
              </div>
            </div>

            <div className="flex justify-between">
              <div className=" w-[50%] p-5">
                <p>
                  <img
                    className=" inline-block mr-3"
                    width="12"
                    height="12"
                    src="https://img.icons8.com/tiny-glyph/32/FD7E14/checkmark.png"
                    alt="checkmark"
                  />
                  <span className=" text-white font-bold">
                    Secret Video Code
                  </span>
                  <br />
                  <span className=" text-[#ffffff73]">
                    {streamItemDetails.secretVideoCode}
                  </span>
                </p>
              </div>
              <div className=" w-[50%] p-5">
                <p>
                  <img
                    className=" inline-block mr-3"
                    width="12"
                    height="12"
                    src="https://img.icons8.com/tiny-glyph/32/FD7E14/checkmark.png"
                    alt="checkmark"
                  />
                  <span className=" text-white font-bold">Description</span>
                  <br />
                  <span className=" text-[#ffffff73]">
                    {streamItemDetails.description}
                  </span>
                </p>
              </div>
            </div>
            <div className="flex justify-end">
              <button
                onClick={() => {
                  setFormHandle(true);
                  setStreamDetailBox(false);
                  setName(streamItemDetails.name);
                  setVideo(streamItemDetails.videoUrl);
                  setThumbnail(streamItemDetails.thumbnailUrl);
                  setDescription(streamItemDetails.description);
                  setType(streamItemDetails.type);
                  setGameType(streamItemDetails.gameType);
                  setSecretVideoCode(streamItemDetails.secretVideoCode);
                }}
                className=" bg-transparent text-[#FE7804] border-2 border-[#FE7804] hover:bg-[#FE7804] hover:text-white rounded-lg px-5 py-2 text-[16px] font-bold"
              >
                Update
              </button>
              <button
              onClick={() => setIsDeleteWarning(true)}
                // onClick={(e) => handleDelete(props.id)}
                className=" bg-[#FE7804] hover:bg-[#FF451D] rounded-lg px-5 py-2 text-[16px] font-bold ml-5"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Stream details update form */}
      {formHandle && (
        <div className="fixed top-0 left-0 z-50 flex items-center justify-center w-full h-full backdrop-filter backdrop-blur-lg">
          <div>
            <form
              onSubmit={streamUpdate}
              className="relative z-50 p-8 border-2 border-[#FE7804] rounded-lg bg-[#2A2B2F]"
            >
              <button
                type="button"
                className="absolute top-0 right-0 m-4 text-white hover:text-gray-300"
                onClick={() => setFormHandle(false)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>

              <div>
                <label className="block text-white">Name:</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="block w-full mt-2 px-3 py-2 border border-gray-700 rounded-md bg-gray-800 text-white"
                />

                <label className="block text-white mt-4">Description:</label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  className="block w-full mt-2 px-3 py-2 border border-gray-700 rounded-md bg-gray-800 text-white"
                />
              </div>
              <div className="flex m-2">
                <div className=" border-4  rounded-lg  border-spacing-[50px] p-5 mx-1 border-dotted border-opacity-30 border-[#FE7804]  ">
                  <video
                    autoPlay
                    muted
                    src={video}
                    className="block w-40 h-25 mt-2"
                  />
                  <label className="block text-white mt-3">New Video:</label>
                  <input
                    type="file"
                    accept="video/*"
                    id="video"
                    onChange={(e) => setVideo(e.target.files[0])}
                    className="block w-full mt-2 px-3 py-2 border border-gray-700 rounded-md bg-gray-800 text-white"
                  />
                </div>

                <div className=" border-4  rounded-lg  border-spacing-[50px] p-5 mx-1  border-dotted border-opacity-30 border-[#FE7804]  ">
                  <img
                    src={thumbnail}
                    alt="Current Thumbnail"
                    className="block w-40 h-25 "
                  />
                  <label className="block text-white mt-3">
                    New Thumbnail:
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    id="thumbnail"
                    onChange={(e) => setThumbnail(e.target.files[0])}
                    className="block w-full mt-2 px-3 py-2 border border-gray-700 rounded-md bg-gray-800 text-white"
                  />
                </div>
              </div>
              <div className="flex justify-between w-full">
                <div className="flex flex-col w-1/3 mx-1">
                  <label className="block text-white mt-4">Type:</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    required
                    className="block w-full mt-2 px-3 py-2 border border-gray-700 rounded-md bg-gray-800 text-white"
                  >
                    <option value="action">Action</option>
                    <option value="racing">Racing</option>
                    <option value="adventure">Adventure</option>
                    <option value="shooter">Shooter</option>
                    <option value="sport">Sport</option>
                  </select>
                </div>
                <div className="flex flex-col w-1/3 mx-1">
                  <label className="block text-white mt-4">Game Type:</label>
                  <select
                    value={gameType}
                    onChange={(e) => setGameType(e.target.value)}
                    required
                    className="block w-full mt-2 px-3 py-2 border border-gray-700 rounded-md bg-gray-800 text-white"
                  >
                    <option value="other">Other</option>
                    <option value="CallOfDuty">Call Of Duty</option>
                    <option value="MobileLegends">Mobile Legends</option>
                    <option value="GtaTV">Gta TV</option>
                    <option value="Asphault8">Asphault 8</option>
                    <option value="PUBG">PUBG</option>
                    <option value="Warzone">Warzone</option>
                    <option value="Roblox">Roblox</option>
                  </select>
                </div>
                <div className="flex flex-col w-1/3 mx-1">
                  <label className="block text-white mt-4">
                    Secret Video Code:
                  </label>
                  <input
                    type="text"
                    value={secretVideoCode}
                    onChange={(e) => setSecretVideoCode(e.target.value)}
                    pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$"
                    title="The secret video code must include capital letters, simple letters, numbers, symbols, and should be 8 characters long."
                    required
                    maxLength={8}
                    className="block w-full mt-2 px-3 py-2 border border-gray-700 rounded-md bg-gray-800 text-white"
                  />
                </div>
              </div>

              {/* Form cancel button */}
              <button
                type="button"
                onClick={() => setFormHandle(false)}
                className=" bg-transparent text-[#FE7804] border-2 border-[#FE7804] hover:bg-[#FE7804] hover:text-white rounded-lg px-5 py-2 m-2 text-[16px] font-bold"
              >
                Cancel
              </button>

              <button
                type="submit"
                className=" bg-transparent text-[#FE7804] border-2 border-[#FE7804] hover:bg-[#FE7804] hover:text-white rounded-lg px-5 py-2 m-2 text-[16px] font-bold"
              >
                Submit
              </button>
            </form>
          </div>
        </div>
      )}
      
{isDeleteWarning && (
        <div className=" z-50 fixed top-0 left-0 w-full h-screen flex justify-center bg-black bg-opacity-80 items-center">
          <div className=" flex flex-col justify-center items-center w-[28%] border-2 border-[#FE7804] border-opacity-50 rounded-lg bg-[#1B1E20]">
            <div className="mt-6">
              <video autoPlay loop className="w-[150px] h-auto">
                <source src={DeleteWorning} type="video/webm" />
                Your browser does not support the video tag.
              </video>
            </div>
            <h1 className=" text-[#FE7804] text-[32px] font-bold">Warning!</h1>
            <p className=" mt-5 text-center text-[#b6b6b6] text-base">
              Once you delete record, thre's no getting it back.<br/>
              Make suer you want to do this.
            </p>
            <div className=" w-full mt-12 mb-5 flex justify-end px-8">
            <button
                onClick={() => setIsDeleteWarning(false)}
                className=" bg-transparent border-2 border-[#FE7804] text-[#FE7804] hover:bg-[#FE7804] hover:text-white rounded-lg py-2 px-5 mr-4 font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={(e) =>{ handleDelete(props.id);
                setIsDeleteWarning(false);}}
                className=" bg-[#FE7804] border-2 border-[#FE7804] hover:bg-[#FF451D] hover:border-[#FF451D] rounded-lg py-2 px-5 text-white font-semibold"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
      {loading && (
        <div className=" z-50 fixed top-0 left-0 w-full h-screen flex justify-center bg-black bg-opacity-50 items-center">
          <HashLoader size="75" color="#FE7804" />
        </div>
      )}

      {deleteSuccessMessagechecked && (
        <SuccessPopup
          type="Delete"
          item="Stream"
          onClose={handleDeleteCloseSuccessPopup}
        />
      )}

      {updateSuccessMessagechecked && (
        <SuccessPopup
          type="Update"
          item="Stream"
          onClose={handleUpdateCloseSuccessPopup}
        />
      )}
    </div>
  );
}
