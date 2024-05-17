import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import DeleteWarning from "../assets/animations/deleteanimation.webm";
import SuccessPopup from "./SuccessPopup";

export default function CartItem(props) {
  const [isChecked, setIsChecked] = useState(false);
  const [isAllChecked, setIsAllChecked] = useState(props.isAllChecked);
  const [deleteSuccessMessagechecked, setDeleteSuccessMessagechecked] = useState(false);
  const [isDeleteWarning, setIsDeleteWarning] = useState(false);

  useEffect(() => {
    setIsAllChecked(props.isAllChecked);
  }, [props.isAllChecked]);

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
    props.onCheckboxChange(props.id, !isChecked, props.price, props.game); // Call parent function to update selected items
  };

  const handleDelete = (id) => {
    axios
      .delete("http://localhost:3001/deleteCartItem/" + id)
      .then((res) => {
        console.log(res);
        window.location.reload();
      })
      .catch((err) => console.log(err));
    setDeleteSuccessMessagechecked(true);
  };

  const handleDeleteCloseSuccessPopup = () => {
    setDeleteSuccessMessagechecked(false);
  };

  return (
    <div className="text-white">
      {isAllChecked && (
        <div className="flex justify-between py-4 px-8 mb-4 rounded-[10px]  bg-[#1B1E20] shadow-lg shadow-[#ffffff1a] ">
          <div className="flex">
            <img src={props.image} alt="trash--v1" width="180" height="75" />
          </div>
          <div className="  w-[38%]  items-center flex ">
            <div>
              <p className=" text-lg font-bold">{props.game}</p>
              <p className="text-md">
                {typeof props.price === "number"
                  ? `$${props.price.toFixed(2)}`
                  : ""}
              </p>
            </div>
          </div>
          <div className="flex items-center">
            <Link to={`/payment?planId=${props.id}&page=C`}>
              <button className=" mr-8 px-12  py-2 bg-gradient-to-r from-[#FF451D] to-[#FE7804] text-white rounded-[10px] text-md  font-semibold">
                Buy Now
              </button>
            </Link>
            <div>
              <img
                width="28"
                height="28"
                src="https://img.icons8.com/material-outlined/24/Ffffff/trash--v1.png"
                alt="trash--v1"
                className="float-right cursor-pointer"
                onClick={() => setIsDeleteWarning(true)}
              />
            </div>
          </div>
        </div>
      )}
      {!isAllChecked && (
        <div className="flex justify-between py-4 px-8 mb-4 rounded-[10px]  bg-[#1B1E20] shadow-lg shadow-[#ffffff1a] ">
          <div className="flex">
            <input
              type="checkbox"
              className="mr-5 !block"
              checked={isChecked}
              onChange={handleCheckboxChange}
            />

            <img src={props.image} alt="trash--v1" width="180" height="75" />
          </div>
          <div className="  w-[38%]  items-center flex ">
            <div>
              <p className=" text-lg font-bold">{props.game}</p>
              <p className="text-md">
                {typeof props.price === "number"
                  ? `$${props.price.toFixed(2)}`
                  : ""}
              </p>
            </div>
          </div>
          <div className="flex items-center">
            <Link to={`/payment?planId=${props.id}&page=C`}>
              <button className=" mr-8 px-12  py-2 bg-gradient-to-r from-[#FF451D] to-[#FE7804] text-white rounded-[10px] text-md  font-semibold">
                Buy Now
              </button>
            </Link>
            <div>
              <img
                width="28"
                height="28"
                src="https://img.icons8.com/material-outlined/24/Ffffff/trash--v1.png"
                alt="trash--v1"
                className="float-right cursor-pointer"
                onClick={() => setIsDeleteWarning(true)}
              />
            </div>
          </div>
        </div>
      )}
      {deleteSuccessMessagechecked && (
        <SuccessPopup
          type="Delete"
          item="Cart Item"
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
              Once you delete record, there's no getting back.
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
                  handleDelete(props.id);
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
