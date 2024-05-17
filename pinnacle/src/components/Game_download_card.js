import React, { useState, useEffect } from "react";
import COD2 from "../assets/games/cod2.jpg";
import axios from 'axios';
import SuccessPopup from "../components/SuccessPopup";
import DeleteWorning from "../assets/payment/deleteanimation.webm";
import { HashLoader } from "react-spinners";

export default function Game_download_card(props) {
  const [gameDetail, setGameDetail] = useState([]);
  const [deleteConfirmMessage, setDeleteConfirmMessage] = useState(false);
  const [deleteSuccessMessagechecked, setDeleteSuccessMessagechecked] = useState(false);
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    axios
        .get(`http://localhost:3001/getGamebyID/${props.gameid}`)
        .then((result) => {
          setGameDetail(result.data);
        })
        .catch((err) => console.log(err));
  }, []);

  const handleDownloadGameDelete = (id) =>{
    setLoading(true);
    axios.delete('http://localhost:3001/deleteDownloadGame/'+id)
    .then(res => {
      console.log(res);
      setLoading(false);
    setDeleteSuccessMessagechecked(true);
  })
    .catch(errr => console.log(errr))
  }

  const handleDeleteCloseSuccessPopup = () => {
    setDeleteSuccessMessagechecked(false);
  };

  return (
    <div className="flex justify-between items-center py-5 px-10 my-3 bg-[#1B1E20] rounded-lg shadow-lg shadow-[#ffffff1a]">
      <div className="flex items-center h-full">
        <img className="h-[70px] w-[125px]" src={gameDetail.gameImageUrl} alt="game-image" />
        <span className="font-semibold text-white text-xl ml-10 ">{gameDetail.name}</span>
      </div>
      <div className="flex h-full items-center">
        <span className=" bg-gradient-to-tr from-[#FE7804] to-[#FF451D] rounded-lg text-white font-semibold py-2 px-8">Install now</span>
        <img
        onClick={() => setDeleteConfirmMessage(true)}
          className=" cursor-pointer float-right ml-14"
          width="24px"
          height="24px"
          src="https://img.icons8.com/material-outlined/24/FFFFFF/trash--v1.png"
          alt="trash--v1"
        />
      </div>

      {deleteConfirmMessage && (
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
                onClick={() => setDeleteConfirmMessage(false)}
                className=" bg-transparent border-2 border-[#FE7804] text-[#FE7804] hover:bg-[#FE7804] hover:text-white rounded-lg py-2 px-5 mr-4 font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={(e) => {handleDownloadGameDelete(props.id);
                setDeleteConfirmMessage(false);}}
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
  <SuccessPopup  type="Delete" item="Game" onClose={handleDeleteCloseSuccessPopup} /> 
)}
    </div>
  );
}
