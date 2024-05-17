import React, {useState} from "react";
import axios from "axios";
import DeleteWorning from "../assets/payment/deleteanimation.webm";
import SuccessPopup from "../components/SuccessPopup";
import { HashLoader } from "react-spinners";
import { saveAs } from 'file-saver';


export default function Payment_history_card(props) {
  const userEmail = localStorage.getItem('userEmail');
  const userId = localStorage.getItem('userId');
  var id = props.id;
  const [deleteConfirmMessage, setDeleteConfirmMessage] = useState(false);
  const [deleteSuccessMessagechecked, setDeleteSuccessMessagechecked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [expanDivTage, setExpanDivTage] = useState(false);

  const handlePaymentHistoryDelete = (id) =>{
    setLoading(true);
    axios.delete('http://localhost:3001/deletePaymentHistory/'+id)
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

  const name = props.name;
  const email = userEmail;
  const description = props.reason;
  const officialpice = props.amount;
  const crystal = props.crystaldiscount;
  const discount = props.discount;
  const pid = props.id;
  const date = props.date;
  const subtotal = props.paidamount;

  var dateObject = new Date(props.date);
    var year = dateObject.getFullYear();
    var month = (dateObject.getMonth() + 1).toString().padStart(2, '0');
    var day = dateObject.getDate().toString().padStart(2, '0');
    var hours = dateObject.getHours().toString().padStart(2, '0');
    var minutes = dateObject.getMinutes().toString().padStart(2, '0');
    var seconds = dateObject.getSeconds().toString().padStart(2, '0');

    var formattedDateTime = `${year}.${month}.${day} H${hours}:${minutes}:${seconds}`;

  //pdf
const createAndDownloadPdf = () => {
  axios.post('http://localhost:3001/api/create-pdf/index', { name, email, description, officialpice, crystal, discount, pid, date, subtotal})
    .then(() => axios.get('http://localhost:3001/api/fetch-pdf', { responseType: 'blob' }))
    .then((res) => {
      const pdfBlob = new Blob([res.data], { type: 'application/pdf' });
      saveAs(pdfBlob, 'Payment_' + pid + '_invoice.pdf');
    })
    .catch((error) => console.error('Error occurred while creating or fetching PDF:', error));
};


  return (
    <div className="shadow-lg shadow-[#ffffff1a] my-3">
    <div className="py-5 px-10 bg-[#1B1E20] rounded-lg items-center flex justify-between ">
      <div className="">
        <span className="font-semibold text-[#FE7804] text-xl ">
          {props.reason}
        </span>
        <p className=" text-[#D9D9D9] text-opacity-60 text-base">
          {formattedDateTime}
        </p>
      </div>
      <div className="flex">
        <h1 className="font-semibold text-[#D9D9D9] text-xl">
        ${" "}{typeof props.amount === "number" ? props.amount.toFixed(2) : ""}
        </h1>
        <img
        onClick={() => setDeleteConfirmMessage(true)}
          className=" ml-9 mr-4 cursor-pointer"
          width="24"
          height="24"
          src="https://img.icons8.com/material-outlined/24/FFFFFF/trash--v1.png"
          alt="trash--v1"
        />
        {expanDivTage && (<img onClick={() => setExpanDivTage(!expanDivTage)} width="26" height="26" src="https://img.icons8.com/sf-black-filled/64/FD7E14/collapse-arrow.png" alt="collapse-arrow"/>)}
        {!expanDivTage && (<img onClick={() => setExpanDivTage(!expanDivTage)} width="26" height="26" src="https://img.icons8.com/ios-glyphs/90/FD7E14/chevron-down.png" alt="chevron-down"/>)}
      </div>
      </div>
      

      {expanDivTage && (<div className="py-5 px-10 bg-[#0000001c] rounded-b-xl text-white leading-7 relative">
        <p className=" font-bold"><img className=" inline-block mr-3" width="12" height="12" src="https://img.icons8.com/tiny-glyph/32/FD7E14/checkmark.png" alt="checkmark" /><span className=" font-normal mr-2">Transaction no:</span>pi_{props.id}</p>
        <p className=" font-bold"><img className=" inline-block mr-3" width="12" height="12" src="https://img.icons8.com/tiny-glyph/32/FD7E14/checkmark.png" alt="checkmark" /><span className=" font-normal mr-2">Official Price:</span>${" "}{typeof props.amount === "number" ? props.amount.toFixed(2) : ""}</p>
        <p className=" font-bold"><img className=" inline-block mr-3" width="12" height="12" src="https://img.icons8.com/tiny-glyph/32/FD7E14/checkmark.png" alt="checkmark" /><span className=" font-normal mr-2">Discount:</span>${" "}{typeof props.discount === "number" ? props.discount.toFixed(2) : ""}</p>
        <p className=" font-bold"><img className=" inline-block mr-3" width="12" height="12" src="https://img.icons8.com/tiny-glyph/32/FD7E14/checkmark.png" alt="checkmark" /><span className=" font-normal mr-2">Crystal Discount:</span>${" "}{typeof props.crystaldiscount === "number" ? props.crystaldiscount.toFixed(2) : ""}</p>
        <p className=" font-bold"><img className=" inline-block mr-3" width="12" height="12" src="https://img.icons8.com/tiny-glyph/32/FD7E14/checkmark.png" alt="checkmark" /><span className=" font-normal mr-2">Paid Amount:</span>${" "}{typeof props.paidamount === "number" ? props.paidamount.toFixed(2) : ""}</p>
        <div onClick={createAndDownloadPdf} className=" cursor-pointer absolute bottom-4 right-4 border-2 border-[#FD7E14] py-1 px-4 rounded-md"><img className=" inline-block"  width="23" height="23" src="https://img.icons8.com/ios-filled/50/FD7E14/pdf--v1.png" alt="pdf--v1"/><span className=" text-[#FD7E14] ml-2">Download invoice</span></div>
      </div>)}
      

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
                onClick={(e) => {handlePaymentHistoryDelete(props.id);
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
  <SuccessPopup  type="Delete" item="Community post" onClose={handleDeleteCloseSuccessPopup} /> 
)}
    </div>
  );
}
