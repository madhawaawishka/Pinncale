import React, {useState, useEffect} from "react";
import riban from "../assets/community/riban.png";
import axios from 'axios'
import { HashLoader } from "react-spinners";
import DeleteWorning from "../assets/animations/deleteanimation.webm";
import SuccessPopup from "./SuccessPopup";

export default function CommunityDetailCard(props) {

  const [isUpdateFormChecked, setIsUpdateFormChecked] = useState(false);
  const [isDeleteWarning, setIsDeleteWarning] = useState(false);
  const [loading, setLoading] = useState(false);
  const [updateSuccessMessagechecked, setUpdateSuccessMessagechecked] = useState(false);
  const [deleteSuccessMessagechecked, setDeleteSuccessMessagechecked] = useState(false);

  const [image, setImage] = useState(props.post);
  const [releasedate, setReleasedate] = useState(props.releasedate);
  const [description, setDescription] = useState(props.description);
  const [name, setName] = useState(props.name);
  const [type, setType] = useState(props.type);


  const [dateDiff, setDateDiff] = useState(null);
  const [releaseDateError, setReleaseDateError] = useState("");
  const [descriptionError, setDescriptionError] = useState('');


  useEffect(() => {
    const currentDate = new Date();
    const futureDate = new Date(props.releasedate);

    // Calculate the difference in milliseconds
    const difference = futureDate.getTime() - currentDate.getTime();
    
    // Convert milliseconds to days
    const differenceInDays = Math.ceil(difference / (1000 * 3600 * 24));

    setDateDiff(differenceInDays);
  }, [props.releasedate]);

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

  const updateCommunityPost = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
        // Upload image file
        const postUrl = image ? await uploadFile("image", image) : null;

        axios
            .put("http://localhost:3001/updateCommunityPost/" + props.id, {
                postUrl,
                description,
                name,
                releasedate,
                type,
            })
            .then((result) => {
                console.log(result);
                setLoading(false);
            })
            .catch((err) => console.log(err));
            setIsUpdateFormChecked(false);
            setUpdateSuccessMessagechecked(true);
    } catch (error) {
        console.error("Error creating community post:", error);
    }
};

const handleCommunityPostDelete = (id) => {
  axios
    .delete("http://localhost:3001/deleteCommunityPost/" + props.id)
    .then((res) => {
      console.log(res);
      // deleteSuccessMessagechecked(true);
    })
    .catch((errr) => console.log(errr));
    setDeleteSuccessMessagechecked(true);
};

const handleDeleteCloseSuccessPopup = () => {
  setDeleteSuccessMessagechecked(false);
};

const handleUpdateCloseSuccessPopup = () => {
  setUpdateSuccessMessagechecked(false);
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
    // Truncate the entered text to 150 characters
    setDescription(enteredDescription.slice(0, 150));
  } else {
    setDescriptionError('');
    setDescription(enteredDescription);
  }
};


  return (
    <div className=" mt-8 p-4 relative text-white font-semibold">
      <div>
        <div className="absolute top-0 left-0 z-20">
          <img className=" w-[150px]" src={riban} />
          <p className=" absolute top-11 left-3 transform -rotate-45 text-[18px]">
            After {dateDiff} Days
          </p>
        </div>
        <img src={props.post} className=" rounded-lg" />
      </div>
      <div className=" bg-black p-7 z-10 w-[91%] h-[85%] absolute top-4 rounded-lg left-4 opacity-0 hover:opacity-90 text-center flex items-center">
        <div className=" w-full">
        <p className=" text-[18px] text-center w-full font-semibold mb-2">{props.name}</p>      
        <p className=" text-center w-full text-[#ffffff64]">{props.description}</p>
        </div>
        <div className=" absolute top-3 right-1 z-40">
        <img onClick={() => setIsUpdateFormChecked(true)} className=" mr-3 inline-block cursor-pointer" width="28" height="28" src="https://img.icons8.com/sf-black-filled/64/FD7E14/edit.png" alt="edit"/>
        <img onClick={() => setIsDeleteWarning(true)} className=" mr-3 inline-block cursor-pointer" width="24" height="24" src="https://img.icons8.com/material-outlined/24/FD7E14/trash--v1.png" alt="trash--v1"/>
        </div>      
      </div>

      {isUpdateFormChecked && (
        <div className=" z-40 fixed top-0 left-0 flex items-center justify-center w-full h-full backdrop-blur-lg">
          <form onSubmit={updateCommunityPost} className="bg-[#1B1E20] rounded-2xl border-2 w-[40%] border-[#FE7804] px-10 py-8">
            <div className=" w-full">
              <h1 className=" inline-block text-[25px] font-bold">
                update {props.name}
              </h1>
              <div className="float-right">
                <img
                className=" cursor-pointer"
                  onClick={() => setIsUpdateFormChecked(false)}
                  width="25"
                  height="25"
                  src="https://img.icons8.com/ios-filled/50/FFFFFF/multiply.png"
                  alt="multiply"
                />
              </div>
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
              </div>
              <div className="w-[90%] mx-auto mt-5 flex justify-between">
                
              <div className=" w-[45%]" >
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
              <div className=" w-[45%]" >
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
              </div >
              <div className="w-[90%] mx-auto mt-5">
                <label>Post</label>
                <br />
                <input
                className="w-full p-1 text-[16px] rounded-lg bg-[#2A2B2F] border-2 border-[#D8DAE3] border-opacity-20 mt-2"
                type="file"
                accept="image/*"
                id="image"
                onChange={(e) => setImage(e.target.files[0])}
               
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
                  Update
                </button>
              </div>
            </div>
          </form>
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
                onClick={(e) => {handleCommunityPostDelete(props.id);
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
  <SuccessPopup  type="Delete" item="Community post" onClose={handleDeleteCloseSuccessPopup} /> 
)}

{updateSuccessMessagechecked && (
  <SuccessPopup  type="Update" item="Community post" onClose={handleUpdateCloseSuccessPopup} /> 
)}
    </div>
  );
}
