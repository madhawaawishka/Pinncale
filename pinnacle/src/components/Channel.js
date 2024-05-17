import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import StreamEditBlock from "./StreamEditBlock";
import SuccessPopup from "./SuccessPopup";
import { HashLoader } from "react-spinners";
import DeleteWarning from "../assets/animations/deleteanimation.webm";

export default function Channel(props) {
  var viewCount = 0;
  var pageid = "stream";

  const [name, setName] = useState("");
  const [video, setVideo] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const [description, setDescription] = useState("");
  const [type, setType] = useState("action");
  const [gameType, setGameType] = useState("other");
  const [secretVideoCode, setSecretVideoCode] = useState("");

  const [channelName, setChannelName] = useState("");
  const [channelDescription, setChannelDescription] = useState("");
  const [channelDp, setChannelDp] = useState(null);
  const [channelViewCount, setChannelViewCount] = useState(0);
  const [subscribercount, setSubscribercount] = useState(0);

  const navigate = useNavigate();
  const [isChannelUpdateClicked, setIsChannelUpdateClicked] = useState(false);
  const [streamDetails, setStreamDetails] = useState([]);
  const [channelDetails, setChannelDetails] = useState([]);
  const [channelDiv, setChannelDiv] = useState("channelVideos");

  const [createSuccessMessagechecked, setCreateSuccessMessagechecked] =
    useState(false);
  const [updateSuccessMessagechecked, setUpdateSuccessMessagechecked] =
    useState(false);
  const [deleteSuccessMessagechecked, setDeleteSuccessMessagechecked] =
    useState(false);
    const [isDeleteWarning, setIsDeleteWarning] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChannelfunction = (divId) => {
    setChannelDiv(divId === channelDiv ? null : divId);
  };

  // Read channel details using member id
  useEffect(() => {
    axios
      .get(`http://localhost:3001/getChannelByMemberID/${props.memberID}`)
      .then((result) => {
        console.log(result);
        const channelData = result.data;
        setChannelDetails(result.data);
        setChannelName(channelData.channelName);
        setChannelDescription(channelData.channelDescription);
        setChannelDp(channelData.channelDp);
        setChannelViewCount(channelData.channelViewCount);
        setSubscribercount(channelData.subscribercount);
      })
      .catch((err) => console.log(err));
  }, [props.memberID]);

  // Read all stream details
  useEffect(() => {
    const fetchstreamData = () => {
      // Check if channelDetails is not null before accessing its _id property
      if (channelDetails && channelDetails._id) {
        axios
          .get(
            `http://localhost:3001/getStreamByChannelID/${channelDetails._id}`
          )
          .then((result) => setStreamDetails(result.data))
          .catch((err) => console.log(err));
      }
    };
    fetchstreamData();
    const intervalId = setInterval(fetchstreamData, 5000);
    return () => clearInterval(intervalId);
  }, [channelDetails?._id]); // Using optional chaining to access _id property

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

  const createStream = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      alert("Name is required");
      return;
    }
    if (!description.trim()) {
      alert("Description is required");
      return;
    }

    if (thumbnail && thumbnail.size > 10485760) {
      alert("Thumbnail must be less than 10 MB");
      return;
    }
    if (video && video.size > 104857600) {
      alert("Video must be less than 100 MB");
      return;
    }

    const codePattern =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!codePattern.test(secretVideoCode)) {
      alert(
        "Secret Video Code must contain at least one uppercase letter, one lowercase letter, one number, one special character, and be at least 8 characters long"
      );
      return;
    }
    try {
      setLoading(true);
      // Upload video file
      const videoUrl = video
        ? await uploadFile("video", video, "stream")
        : null;
      // Upload image file
      const thumbnailUrl = thumbnail
        ? await uploadFile("image", thumbnail, "stream")
        : null;
      //Get User Id
      const userId = localStorage.getItem('userId');
      // Send backend API request
      const response = await axios.post("http://localhost:3001/createStream", {
        name,
        videoUrl,
        thumbnailUrl,
        description,
        viewCount,
        type,
        channel_ID: channelDetails._id,
        secretVideoCode,
        gameType,
        userId
      });

      crystalCountUpdater();

      //-------dasun notification
      const newStream = response.data; // Assuming response contains the created stream details
  
      // Send notification to all users about the new stream
      await axios.post("http://localhost:3001/api/sendStreamNotification", newStream);
  
      console.log("Stream created and notification sent successfully:", newStream);
  

      // Reset form state
      setLoading(false);
      setCreateSuccessMessagechecked(true);
      handleChannelfunction("channelVideos");
      setName("");
      setVideo("");
      setThumbnail("");
      setDescription("");
      setType("action");
      setSecretVideoCode("");
      setGameType("other");
      //props.setReloadCount(prevCount => prevCount + 1);
  
    } catch (error) {
      console.error("Error creating stream or sending notification:", error);
      setLoading(false);
    }
  };

  //fucntion to create a channel
  const createNewChannel = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Upload DP file
      const dpUrl = channelDp? await uploadFile("image", channelDp, "channel"): null;

      // Send backend API request
      const response = await axios.post("http://localhost:3001/createChannel", {
        channelName,
        channelDescription,
        channelDp: dpUrl,
        memberID: props.memberID,
        viewCount: channelViewCount,
        subscribercount,
      });
      console.log("Channel created successfully:", response.data);
      setCreateSuccessMessagechecked(true);
      handleChannelfunction("channelVideos");
      setLoading(false);
      // window.location.reload();
    } catch (error) {
      console.error("Error creating Channel:", error);
    }
  };

  const crystalCountUpdater = () => {
    const newCrystalcount = props.crystalcount + 100;
    axios.put(`http://localhost:3001/updateCrystalCount/${props.memberID}`, { newCrystalcount })
      .then(result => {
          console.log(result);
      })
      .catch(err => console.log(err));
  }

  const channelUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Upload DP file
      const dpUrl = channelDp? await uploadFile("image", channelDp, "channel"): null;

      const response = await axios.put(
        "http://localhost:3001/updateChannelData/" + channelDetails._id,
        {
          channelName,
          channelDescription,
          channelDp: dpUrl,
        }
      );
      console.log("Channel updated successfully:", response.data);
      setCreateSuccessMessagechecked(true);
      handleChannelfunction("channelVideos");
      setLoading(false);
      window.location.reload();
    } catch (error) {
      console.error("Error creating Channel:", error);
    }
  };
  // Delete channel using stream id
  const handleDelete = (id) => {
    axios
      .delete("http://localhost:3001/deleteChannel/" + id)
      .then((res) => {
        console.log(res);
      })
      .catch((errr) => console.log(errr));
    setDeleteSuccessMessagechecked(true);
  };

  // Function to handle channel update click
  const handleChannelUpdateClick = () => {
    setIsChannelUpdateClicked(true);
  };
  
  const handleDeleteCloseSuccessPopup = () => {
    setDeleteSuccessMessagechecked(false);
  };

  const handleUpdateCloseSuccessPopup = () => {
    setUpdateSuccessMessagechecked(false);
  };

  const handleCreateCloseSuccessPopup = () => {
    setCreateSuccessMessagechecked(false);
  };
  return (
    <div>
      {channelDetails === null && (
        <div className="w-full h-[300px] justify-center items-center flex flex-col  ">
          <div className=" border-4  rounded-lg  border-spacing-[50px] p-10 border-dotted border-opacity-30 border-[#FE7804]  justify-center items-center flex flex-col">
            <div
              className=" my-5 mr-5 bg-gradient-to-tr from-[#FF451D] to-[#FE7804] px-8 py-3 text-[18px] font-semibold rounded-lg"
              onClick={() => handleChannelfunction("createChannel")}
              style={{ cursor: "pointer" }}
            >
              <h1>Create Channel</h1>
            </div>

            <h1 className="text-[#ffffff9d]">
              Stream your videos on Pinnacle by creating your own channel.
            </h1>
          </div>
        </div>
      )}
      {!(channelDetails === null) && (
        <div>
          <div className="relative flex justify-start my-10">
            <div className="mr-10 ">
              <img
                src={channelDetails.channelDp}
                alt="channelDp"
                className="rounded-full p-1 bg-gradient-to-tr from-[#FF451D] to-[#FE7804] shadow-xl"
                style={{ width: "200px", height: "200px" }}
              />
            </div>
            <div className="flex flex-col item-center">
              <h1 className="font-extrabold  text-[56px]  ">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#FF451D] to-[#FE7804]">
                  {channelDetails.channelName}
                </span>
              </h1>

              <h1 className="text-[22px] mb-4 text-[#ffffff93] ">
                {channelDetails.channelDescription}
              </h1>
              <h1 className="text-[25px] mb-4 text-[#ffffff93] ">
                {subscribercount} Subscribers
              </h1>
            </div>
            <div className="absolute bottom-0 right-0 ">
              <div
                className="my-3 mx-2 py-1 px-5 border-2 border-[#FE7804] rounded-3xl text-[#FE7804] font-semibold  cursor-pointer hover:bg-gradient-to-t from-[#FF451D] to-[#FE7804] hover:text-white text-[16px]"
                onClick={handleChannelUpdateClick}
              >
                <h1>Update Channel</h1>
              </div>
              <div
                className="my-3 mx-2 py-1 px-5 border-2 border-[#FE7804] rounded-3xl text-[#FE7804] font-semibold  cursor-pointer hover:bg-gradient-to-t from-[#FF451D] to-[#FE7804] hover:text-white text-[16px]"
                onClick={() => setIsDeleteWarning(true)}
              >
                <h1>Delete Channel</h1>
              </div>
              <div
                className="cursor-pointer m-2 bg-gradient-to-tr from-[#FF451D] to-[#FE7804] px-4 py-2 text-[18px] font-semibold rounded-lg"
                onClick={() => handleChannelfunction("addStream")}
              >
                <h1>Add new Stream</h1>
              </div>
            </div>
          </div>

          {channelDiv === "channelVideos" && (
            <div>
              {/* Display all streams in the streamDetails */}
              <div className="flex flex-wrap">
                {streamDetails.map((stream) => (
                  <div key={stream._id} className="w-1/3 p-4">
                    <StreamEditBlock id={stream._id} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
      <div>
        {channelDiv === "createChannel" && (
          <div className="fixed top-0 left-0 z-50 flex items-center justify-center w-full h-screen backdrop-blur-lg bg-opacity-80">
            <form
              onSubmit={createNewChannel}
              className="relative z-50 p-8 w-[30%] border-2 border-[#FE7804] rounded-lg bg-[#1B1E20]"
            >
              <div className="float-right cursor-pointer ">
                <img
                  onClick={() => setChannelDiv(false)}
                  width="25"
                  height="25"
                  src="https://img.icons8.com/ios-filled/50/FFFFFF/multiply.png"
                  alt="multiply"
                />
              </div>
              <h1 className="mt-2 mb-10 text-2xl font-bold text-center text-white">
                Create Your Own Channel
              </h1>
              <label className="block mb-2 text-white">Channel Name:</label>
              <input
                type="text"
                value={channelName}
                onChange={(e) => setChannelName(e.target.value)}
                required
                className="text-white h-[45px] w-full bg-[#2A2B2F] border-2 border-[#D8DAE3] border-opacity-20 rounded-[10px] pl-3 placeholder-[#9D9191] placeholder-opacity-50"
              />

              <label className="block mt-4 mb-2 text-white">
                Description about channel:
              </label>
              <input
                type="text"
                value={channelDescription}
                onChange={(e) => setChannelDescription(e.target.value)}
                required
                className="text-white h-[45px] w-full bg-[#2A2B2F] border-2 border-[#D8DAE3] border-opacity-20 rounded-[10px] pl-3 placeholder-[#9D9191] placeholder-opacity-50"
              />

              <label className="block mt-4 mb-2 text-white">
                Display Picture(Dp):
              </label>
              <input
                type="file"
                accept="image/*"
                id="channelDp"
                onChange={(e) => setChannelDp(e.target.files[0])}
                required
                className="text-white h-[45px] w-full bg-[#2A2B2F] py-2 rounded-[10px] pl-3 placeholder-[#9D9191] placeholder-opacity-50"
              />

              <div className="flex justify-end mt-7">
                <button
                  type="submit"
                  className="bg-[#FE7804]  border-2 border-[#FE7804]  text-white hover:bg-[#FF451D] rounded-lg px-5 py-2 mx-2 text-[16px] font-semibold"
                >
                  Submit
                </button>
              </div>
            </form>
            {/* </div> */}
          </div>
        )}
        {channelDiv === "addStream" && (
          <div className="items-center justify-center w-1/2 h-full mx-auto">
            <h1 className="mb-4 text-2xl text-center text-white">
              Add new Stream
            </h1>
            <form
              onSubmit={createStream}
              className="relative z-50 p-8 border-2 border-[#FE7804] rounded-lg bg-[#2A2B2F]"
            >
              <label className="block text-white">Name:</label>
              <input
                type="text"
                value={name} 
                onChange={(e) => setName(e.target.value)}
                required
                className="block w-full px-3 py-2 mt-2 text-white bg-gray-800 border border-gray-700 rounded-md"
              />

              <label className="block mt-4 text-white">Description:</label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                className="block w-full px-3 py-2 mt-2 text-white bg-gray-800 border border-gray-700 rounded-md"
              />
              <div className="flex">
                <div className="mx-1 my-2">
                  <label className="block mt-4 text-white">Stream:</label>
                  <input
                    type="file"
                    accept="video/*"
                    id="video"
                    onChange={(e) => setVideo(e.target.files[0])}
                    required
                    className="block w-full px-3 py-2 mt-2 text-white bg-gray-800 border border-gray-700 rounded-md"
                  />
                </div>
                <div className="mx-1 my-2">
                  <label className="block mt-4 text-white">Thumbnail:</label>
                  <input
                    type="file"
                    accept="image/*"
                    id="thumbnail"
                    onChange={(e) => setThumbnail(e.target.files[0])}
                    required
                    className="block w-full px-3 py-2 mt-2 text-white bg-gray-800 border border-gray-700 rounded-md"
                  />
                </div>
              </div>
              <div className="flex">
                <div className="w-1/3 mx-1">
                  <label className="block mt-4 text-white">Type:</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    required
                    className="block w-full px-3 py-2 mt-2 text-white bg-gray-800 border border-gray-700 rounded-md"
                  >
                    <option value="action">Action</option>
                    <option value="racing">Racing</option>
                    <option value="adventure">Adventure</option>
                    <option value="shooter">Shooter</option>
                    <option value="sport">Sport</option>
                  </select>
                </div>
                <div className="w-1/3 mx-1">
                  <label className="block mt-4 text-white">Game Type:</label>
                  <select
                    value={gameType}
                    onChange={(e) => setGameType(e.target.value)}
                    required
                    className="block w-full px-3 py-2 mt-2 text-white bg-gray-800 border border-gray-700 rounded-md"
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
                <div className="w-1/3 mx-1">
                  <label className="block mt-4 text-white">Secret Code:</label>
                  <input
                    type="text"
                    value={secretVideoCode}
                    onChange={(e) => setSecretVideoCode(e.target.value)}
                    pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$"
                    title="The secret video code must include capital letters, simple letters, numbers, symbols, and should be 8 characters long."
                    required
                    maxLength={8}
                    className="block w-full px-3 py-2 mt-2 text-white bg-gray-800 border border-gray-700 rounded-md"
                  />
                </div>
              </div>
              <div className="flex justify-end mt-4">
                <button
                  type="submit"
                  className="bg-transparent text-[#FE7804] border-2 border-[#FE7804] hover:bg-[#FE7804] hover:text-white rounded-lg px-5 py-2 mx-2 text-[16px] font-bold"
                >
                  Submit
                </button>
                <button
                  onClick={() => handleChannelfunction("channelVideos")}
                  className="bg-transparent text-[#FE7804] border-2 border-[#FE7804] hover:bg-[#FE7804] hover:text-white rounded-lg px-5 py-2 text-[16px] font-bold"
                >
                  Close
                </button>
              </div>
            </form>
          </div>
        )}
        {isChannelUpdateClicked && (
          <div className="fixed top-0 left-0 z-50 flex items-center justify-center w-full h-screen backdrop-blur-lg bg-opacity-80">
            <form
              onSubmit={channelUpdate}
              className="relative z-50 p-8 w-[30%] border-2 border-[#FE7804] rounded-lg bg-[#1B1E20]"
            >
              <div className="float-right cursor-pointer ">
                <img
                  onClick={() => setIsChannelUpdateClicked(false)}
                  width="25"
                  height="25"
                  src="https://img.icons8.com/ios-filled/50/FFFFFF/multiply.png"
                  alt="multiply"
                />
              </div>
              <h1 className="mt-2 mb-10 text-2xl font-bold text-center text-white">
                Update Your Channel
              </h1>
              <label className="block mb-2 text-white">Channel Name:</label>
              <input
                type="text"
                value={channelName}
                onChange={(e) => setChannelName(e.target.value)}
                required
                className="text-white h-[45px] w-full bg-[#2A2B2F] border-2 border-[#D8DAE3] border-opacity-20 rounded-[10px] pl-3 placeholder-[#9D9191] placeholder-opacity-50"
              />

              <label className="block mt-4 mb-2 text-white">
                Description about channel:
              </label>
              <input
                type="text"
                value={channelDescription}
                onChange={(e) => setChannelDescription(e.target.value)}
                required
                className="text-white h-[45px] w-full bg-[#2A2B2F] border-2 border-[#D8DAE3] border-opacity-20 rounded-[10px] pl-3 placeholder-[#9D9191] placeholder-opacity-50"
              />

              <label className="block mt-4 mb-2 text-white">
                Display Picture(Dp):
              </label>
              <input
                type="file"
                accept="image/*"
                id="channelDp"
                onChange={(e) => setChannelDp(e.target.files[0])}
                className="text-white h-[45px] w-full bg-[#2A2B2F] py-2 rounded-[10px] pl-3 placeholder-[#9D9191] placeholder-opacity-50"
              />

              <div className="flex justify-end mt-7">
                <button
                  type="submit"
                  className="bg-[#FE7804]  border-2 border-[#FE7804]  text-white hover:bg-[#FF451D] rounded-lg px-5 py-2 mx-2 text-[16px] font-semibold"
                >
                  Submit
                </button>
              </div>
            </form>
            {/* </div> */}
          </div>
        )}
        {/* {!isChannelUpdateClicked && (<div>
          setIsChannelUpdateClicked(false);
        </div>)} */}
        {loading && (
          <div className="fixed top-0 left-0 z-50 flex items-center justify-center w-full h-screen bg-black bg-opacity-50 ">
            <HashLoader size="75" color="#FE7804" />
          </div>
        )}

        {createSuccessMessagechecked && (
          <SuccessPopup
            type="Create"
            item="Stream"
            onClose={handleCreateCloseSuccessPopup}
          />
        )}
        {deleteSuccessMessagechecked && (
          <SuccessPopup
            type="Delete"
            item="Channel"
            onClose={handleDeleteCloseSuccessPopup}
          />
        )}

        {updateSuccessMessagechecked && (
          <SuccessPopup
            type="Update"
            item="Channel"
            onClose={handleUpdateCloseSuccessPopup}
          />
        )}
          
{isDeleteWarning && (
        <div className="fixed top-0 left-0 z-50 flex items-center justify-center w-full h-screen bg-black  bg-opacity-80">
          <div className=" flex flex-col justify-center items-center w-[28%] border-2 border-[#FE7804] border-opacity-50 rounded-lg bg-[#1B1E20]">
            <div className="mt-6">
              <video autoPlay loop className="w-[150px] h-auto">
                <source src={DeleteWarning} type="video/webm" />
                Your browser does not support the video tag.
              </video>
            </div>
            <h1 className=" text-[#FE7804] text-[32px] font-bold">Warning!</h1>
            <p className=" mt-5 text-center text-[#b6b6b6] text-base">
              Once you delete record, thre's no getting it back.<br/>
              Make suer you want to do this.
            </p>
            <div className="flex justify-end w-full px-8 mt-12 mb-5 ">
            <button
                onClick={() => setIsDeleteWarning(false)}
                className=" bg-transparent border-2 border-[#FE7804] text-[#FE7804] hover:bg-[#FE7804] hover:text-white rounded-lg py-2 px-5 mr-4 font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={(e) =>{ handleDelete(channelDetails._id);
                setIsDeleteWarning(false);}}
                className=" bg-[#FE7804] border-2 border-[#FE7804] hover:bg-[#FF451D] hover:border-[#FF451D] rounded-lg py-2 px-5 text-white font-semibold"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
}
