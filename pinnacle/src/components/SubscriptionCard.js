import React, { useState, useEffect } from "react";
import axios from "axios";
import DeleteWarning from "../assets/animations/deleteanimation.webm";
import SuccessPopup from "./SuccessPopup";


export default function SubscriptionCard(props) {
  const [channelDetails, setChannelDetails] = useState([]);
  const [deleteSuccessMessagechecked, setDeleteSuccessMessagechecked] = useState(false);
  const [isDeleteWarning, setIsDeleteWarning] = useState(false);

  // Read channel details using channel id
  useEffect(() => {
    axios
      .get(`http://localhost:3001/getChannelByChannelID/${props.channelID}`)
      .then((result) => {
        console.log(result);
        setChannelDetails(result.data);
      })
      .catch((err) => console.log(err));
  }, [props.channelID]);

  const handleDelete = (id) => {
    axios
      .delete("http://localhost:3001/deleteSubscription/" + id)
      .then((res) => {
        console.log(res);
        window.location.reload();
      })
      .catch((err) => console.log(err));
    setDeleteSuccessMessagechecked(true);
    updateUnSubscribeCountofChannel(channelDetails.subscribercount);
  };

  const handleDeleteCloseSuccessPopup = () => {
    setDeleteSuccessMessagechecked(false);
  };
  const updateUnSubscribeCountofChannel = (subcount) => {
    // Ensure subscriber count doesn't go below 0
    const subscriberCount = Math.max(subcount - 1, 0);
    console.log("Current subscribers count:", subcount);
    console.log("Updated subscribers count:", subscriberCount);
    axios
      .put(
        `http://localhost:3001/updateSubscriberCountofChannel/${channelDetails._id}`,
        { subscriberCount }
      )
      .then((result) => {
        console.log("Update result:", result);
      })
      .catch((err) => console.log(err));
  };
  
  return (
    <div className=" bg-gradient-to-b from-[#2A2B2F] to-[#00000094] text-[#D9D9D9] text-[20px] font-semibold py-3 px-7 flex justify-between items-center ">
      <div className="w-[15%]">
        <img
          className=" inline-block mr-1 rounded-full w-[70px] h-[70px]"

          src={channelDetails.channelDp}
          alt="external-design-web-design-device-solid-style-set-2-solid-style-bomsymbols-"
        />
      </div>
      <div className="w-[50%]">{channelDetails.channelName}</div>
      <div className="w-[15%]">{channelDetails.subscribercount} Subscribers</div>
      <div className="w-[15%]">
        <div 
        onClick={() => setIsDeleteWarning(true)}
        className=" py-1 px-3 border-2 text-center text-[18px] border-[#FE7804] rounded-3xl text-[#FE7804]  mr-6 cursor-pointer hover:bg-gradient-to-t from-[#FF451D] to-[#FE7804] hover:text-white">
          Unsubscribe
        </div>
      </div>
      {deleteSuccessMessagechecked && (
        <SuccessPopup
          type="UnSubscribe"
          item="Unsubscribtion"
          onClose={handleDeleteCloseSuccessPopup}
        />
      )}
      {isDeleteWarning && (
        <div className=" z-50 fixed top-0 left-0 w-full h-screen flex justify-center bg-black bg-opacity-80 items-center">
          <div className=" flex flex-col justify-center items-center w-[28%] border-2 border-[#FE7804] border-opacity-50 rounded-lg bg-[#1B1E20]">
            <div className="mt-6">
              <video autoPlay loop className="w-[150px] h-auto">
                <source src={DeleteWarning} type="video/webm" />
                Your browser does not support the video tag.
              </video>
            </div>
            <h1 className=" text-[#FE7804] text-[32px] font-bold">Warning!</h1>
            <p className=" mt-5 text-center text-[#b6b6b6] text-base">
              Once you Unsubscribe, there's no getting back.
              <br />
              Make sure you want to do this.
            </p>
            <div className=" w-full mt-12 mb-5 flex justify-end px-8">
              <button
                onClick={() => setIsDeleteWarning(false)}
                className=" bg-transparent border-2 border-[#FE7804] text-[#FE7804] hover:bg-[#FE7804] hover:text-white rounded-lg py-2 px-5 mr-4 font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={(e) => {
                  handleDelete(props.subscriberID);
                  setIsDeleteWarning(false);
                }}
                className=" bg-[#FE7804] border-2 border-[#FE7804] hover:bg-[#FF451D] hover:border-[#FF451D] rounded-lg py-2 px-5 text-white font-semibold"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
