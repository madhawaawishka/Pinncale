import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

export default function StreamDisplayBlock(props) {
  const [formHandle, setFormHandle] = useState(false);
  const [name, setName] = useState("");
  const [video, setVideo] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const [description, setDescription] = useState("");
  const [viewCount, setViewCount] = useState(0);
  const [type, setType] = useState("action");
  const [gameType, setDameType] = useState("other");
  const [channel_ID, setChannel_ID] = useState("");
  const [secretVideoCode, setSecretVideoCode] = useState("");

  const navigate = useNavigate();

  //read stream details using stream id
  useEffect(() => {
    axios
      .get(`http://localhost:3001/getStream/${props.id}`)
      .then((result) => {
        console.log(result);
        setName(result.data.name);
        setVideo(result.data.video);
        setThumbnail(result.data.thumbnail);
        setDescription(result.data.description);
        setViewCount(result.data.viewCount);
        setType(result.data.type);
        setGameType(result.data.gameType);
        setChannel_ID(result.data.channel_ID);
        setSecretVideoCode(result.data.secretVideoCode);
      })
      .catch((err) => console.log(err));
  }, [props.id]);

  // delete stream using stream id
  const handleDelete = (id) => {
    axios
      .delete("http://localhost:3001/deleteStream/" + id)
      .then((res) => {
        console.log(res);
        window.location.reload();
      })
      .catch((errr) => console.log(errr));
  };

  //update stream details using stream id
  const streamUpdate = (e) => {
    e.preventDefault();
    axios
      .put("http://localhost:3001/updateStream/" + props.id, {
        name,
        video,
        thumbnail,
        description,
        viewCount,
        type,
        channel_ID,
        secretVideoCode,
        gameType
      })
      .then((result) => {
        console.log(result);
        setFormHandle(false);
        navigate("/stream");
        window.location.reload();
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="">
      <div className="">
        <Link
          to={`/streamdetail?streamId=${props._id}`}
          className="stream-link"
        >
          {/* display stream details */}
          <div className=" ">
            <h1 className="text-xl font-bold">{props.name}</h1>
            <div className="relative w-full h-full overflow-hidden group">
              <img
                src={props.thumbnail}
                alt="Thumbnail"
                className="w-full group-hover:opacity-0 transition-opacity duration-300"
              />
              <video
                autoPlay
                muted
                src={props.video}
                className="absolute top-0 left-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              />
            </div>
            <h1 className="text-lg">{props.description}</h1>
            <h1>{props.viewCount}</h1>
            <h1>{props.type}</h1>
            <h1>{props.gameType}</h1>
          </div>
        </Link>

        <button onClick={(e) => handleDelete(props.id)}>delete</button>
        <button onClick={(e) => setFormHandle(true)}>update</button>
      </div>
      {/*stream details update form */}
      {formHandle && (
        <div className="absolute top-0 left-0 z-40 flex items-center justify-center w-full h-full backdrop-filter backdrop-blur-lg">
          <div className="absolute top-0 left-0 w-full h-full bg-[#2A2B2F] opacity-50"></div>
          <form
            onSubmit={streamUpdate}
            className="relative z-50 p-8 border-2 border-gray-400 rounded-lg bg-[#2A2B2F]"
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

            <label className="block text-white">Name:</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="block w-full mt-2 px-3 py-2 border border-gray-700 rounded-md bg-gray-800 text-white"
            />

            <label className="block text-white mt-4">Description:</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="block w-full mt-2 px-3 py-2 border border-gray-700 rounded-md bg-gray-800 text-white"
            />
            <Link to={`/streamdetail?streamId=${props._id}`}>
              <label className="block text-white mt-4">Video:</label>
              <input
                type="file"
                accept="video/*"
                id="video"
                onChange={(e) => setVideo(e.target.files[0])}
                className="block w-full mt-2 px-3 py-2 border border-gray-700 rounded-md bg-gray-800 text-white"
              />

              <label className="block text-white mt-4">Thumbnail:</label>
              <input
                type="file"
                accept="image/*"
                id="thumbnail"
                onChange={(e) => setThumbnail(e.target.files[0])}
                className="block w-full mt-2 px-3 py-2 border border-gray-700 rounded-md bg-gray-800 text-white"
              />
            </Link>
            <label className="block text-white mt-4">Type:</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="block w-full mt-2 px-3 py-2 border border-gray-700 rounded-md bg-gray-800 text-white"
            >
              <option value="action">Action</option>
              <option value="racing">Racing</option>
            </select>

            <label className="block text-white mt-4">Game Type:</label>
            <select
              value={gameType}
              onChange={(e) => setGameType(e.target.value)}
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

            <label className="block text-white mt-4">Secret Video Code:</label>
            <input
              type="text"
              value={secretVideoCode}
              onChange={(e) => setSecretVideoCode(e.target.value)}
              className="block w-full mt-2 px-3 py-2 border border-gray-700 rounded-md bg-gray-800 text-white"
            />

            {/* form cancel button */}
            <button
              type="button"
              onClick={() => setFormHandle(false)}
              className="mt-8 mr-4 px-4 py-2 bg-red-500 rounded-md text-white hover:bg-red-600"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="mt-8 px-4 py-2 bg-green-500 rounded-md text-white hover:bg-green-600"
            >
              Submit
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
