import React, { useState, useEffect, useRef } from "react";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import { HashLoader } from "react-spinners";
import Paymentsuccess from "../assets/payment/paymentsuccessanimation.webm";
import Paymenterror from "../assets/payment/paymenterroranimation.webm";
import axios from "axios";
import { saveAs } from 'file-saver';

const PaymentForm = ({
  clientSecret,
  subtotal,
  description,
  discount,
  officialprice,
  crystaldiscount,
  memberid,
  pageid,
  itemid,
  email,
  name,
  crystalcount,
  type,
  handlePaymentProcess,
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [paymentSuccessMessage, setPaymentSuccessMessage] = useState(false);
  const [paymentErrorMessage, setPaymentErrorMessage] = useState(false);
  const [pid, setpid] = useState("");

  const handleSubmit = async (event) => {
    if (event) {
      event.preventDefault();
    }

    if (!stripe || !elements) {
      return;
    }

    setLoading(true);

    try {
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: "card",
        card: elements.getElement(CardElement),
      });

      if (error) {
        console.error("Error creating PaymentMethod:", error);
        setError(error.message);
        setLoading(false);
        setPaymentErrorMessage(true);
        return;
      }

      const response = await fetch("http://localhost:3001/api/payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          payment_method_id: paymentMethod.id,
          clientSecret,
          subtotal,
          description,
        }),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.error || "Failed to process payment.");
      }

      console.log("Payment successful:", responseData.paymentIntent);
      setPaymentSuccessMessage(true);
      paymentRecodHandler();
      crystalCountUpdater();
      
      if (pageid == "G" || pageid == "C" ) {
        downloadRecodHandler();
      }
    } catch (error) {
      console.error("Error processing payment:", error.message);
      setError("Error processing payment. Please try again.");
    }

    setLoading(false);
  };

  useEffect(() => {
    handlePaymentProcess(handleSubmit);
  }, [handleSubmit, handlePaymentProcess]);

  const paymentRecodHandler = () => {
    const date = new Date();
    const paidamount = subtotal;
    axios
      .post("http://localhost:3001/createPaymnetRecod", {
        description,
        officialprice,
        paidamount,
        discount,
        crystaldiscount,
        date,
        memberid,
        email,
        type,
      })
      .then((result) => {
        console.log(result);
        document.getElementById("paymentdetailsform").reset();
      })
      .catch((err) => console.log(err));
      
  };

  const [gamedetails, setGameDetails] = useState([]);

  const downloadCountUpdater = () => {
      axios
      .get("http://localhost:3001/getGamebyID/" + itemid)
      .then((result) => {
        setGameDetails(result.data.downloadCount);
        console.log(result.data.downloadCount);
      })
      .catch((err) => console.log(err));

      const newDownloadcount = gamedetails + 1;
    
      axios.put("http://localhost:3001/updateDownloadCount/"+itemid, { newDownloadcount })
      .then(result => {
          console.log(result);
      })
      .catch(err => console.log(err));
    
  }

  const crystalCountUpdater = () => {
    const newCrystalcount = crystalcount- (crystaldiscount*1000) + officialprice;
    axios.put(`http://localhost:3001/updateDownloadCount/${memberid}`, { newCrystalcount })
      .then(result => {
          console.log(result);
      })
      .catch(err => console.log(err));
  }

  const downloadRecodHandler = () => {
    const date = new Date();
    const gameid = itemid;
    //Get User Id
    const userId = localStorage.getItem('userId');
    setTimeout(() => {
      axios
      .get(`http://localhost:3001/getlatestPayment/${memberid}`)
      .then((result) => {
        const paymentid = result.data[0]._id;
        setpid(paymentid);

        axios
          .post("http://localhost:3001/createdounloadRecod", {
            memberid,
            gameid,
            paymentid,
            date,
            userId
          })
          .then((result) => {
            console.log(result);
            sendEmail();
            downloadCountUpdater();
          })
          .catch((err) => console.log(err));
      })
      .catch((err) => console.log(err));
    }, 1000);
};


const date = new Date();
const htmlContent = `<div>
        <br/>
        <div style="justify-content: center; display: flex;">     
            <img  width="120px" height="120px" style="margin: 0 auto" src="https://res.cloudinary.com/dg8cpnx1m/image/upload/v1715580950/channelDP/xd5ojhpnhumimaqbkmzv.png" />
        </div>
        <br/>
        <h1 style="color: green; text-align: center;">Payment Successful!</h1>
        <div style="padding: 0 10%;">
            <p>Your payment of <span style="font-weight: 600;">$`+officialprice+`.00</span> was Successfully processed.</p>
            <br/>
            <div style="padding: 0 15%; font-size: 17px;">
                <pre ><span style="font-weight: 600;">Description:</span>                                   <span>`+description+`</span></pre>
                <pre ><span style="font-weight: 600;">Amount Paid:</span>                                   <span>$ `+officialprice+`.00</span></pre>
                <pre ><span style="font-weight: 600;">Payor Name:</span>                                    <span>`+name+`</span></pre>
                <pre ><span style="font-weight: 600;">Payment Method:</span>                                <span>Visa</span></pre>
                <pre ><span style="font-weight: 600;">Payment Date/Time:</span>                             <span>`+date+`</span></pre>
                <br/>
            </div>
            <hr/>
        </div>
    </div>`;

const sendEmail = async () => {
  const userEmail = localStorage.getItem('userEmail');
  
  

  try {
    const response = await fetch('http://localhost:3001/send-paymentemail', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        to:  userEmail,
        subject: 'Payment successful',
        html: htmlContent
      })
    });
    const result = await response.text();
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

  return (
    <div className="text-white pt-3">
      <div>
        <CardElement />
      </div>
      {loading && (
        <div className=" z-20 fixed top-0 left-0 w-full h-screen flex justify-center bg-black bg-opacity-50 items-center">
          <HashLoader size="75" color="#FE7804" />
        </div>
      )}

      {/*payment success message box */}
      {paymentSuccessMessage && (
        <div className=" z-50 fixed top-0 left-0 w-full h-screen flex justify-center bg-black bg-opacity-80 items-center">
          <div className=" flex flex-col justify-center items-center w-[28%] border-2 border-[#39E75F] border-opacity-50 rounded-lg bg-[#1B1E20]">
            <div className="mt-6">
              <video autoPlay loop className="w-[300px] h-auto">
                <source src={Paymentsuccess} type="video/webm" />
                Your browser does not support the video tag.
              </video>
            </div>
            <h1 className=" text-[#39E75F] text-[32px] font-bold">
              Payment Success!
            </h1>
            <p className=" mt-5 text-center text-base">
              We are delighted to inform you that
              <br /> we received your payment.
            </p>
            <div className=" w-full mt-12 mb-5 flex justify-end px-8">
              {/* <button
                onClick={() => {setPaymentSuccessMessage(false);  window.location.href = '/account';}}
                className=" bg-transparent text-[#3ab755] border-2 border-[#3ab755] hover:bg-[#3ab755] hover:text-white rounded-lg py-2 px-5 mr-4"
              >
                Cancel
              </button> */}
              <button onClick={() => { setPaymentSuccessMessage(false); window.location.href = '/account';}} className=" bg-[#3ab755] border-2 border-[#3ab755] hover:bg-[#51d06b] rounded-lg py-2 px-5">
                Ok
              </button>
            </div>
          </div>
        </div>
      )}

      {/*error message box */}
      {paymentErrorMessage && (
        <div className=" z-50 fixed top-0 left-0 w-full h-screen flex justify-center bg-black bg-opacity-80 items-center">
          <div className=" flex flex-col justify-center items-center w-[28%] border-2 border-[#E53935] border-opacity-50 rounded-lg bg-[#1B1E20]">
            <div className="mt-6">
              <video autoPlay loop className="w-[300px] h-auto">
                <source src={Paymenterror} type="video/webm" />
                Your browser does not support the video tag.
              </video>
            </div>
            <h1 className=" text-[#E53935] text-[32px] font-bold">Error!</h1>
            <p className=" mt-5 text-center text-base">
              Unfortunately we have an issue with
              <br /> your payment, try again later.
            </p>
            <div className=" w-full mt-12 mb-5 flex justify-end px-8">
              <button
                onClick={() => {
                  setPaymentErrorMessage(false);
                  window.location.reload();
                }}
                className=" bg-[#E53935] border-2 border-[#E53935] hover:bg-[#cc4646] rounded-lg py-2 px-5"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentForm;
