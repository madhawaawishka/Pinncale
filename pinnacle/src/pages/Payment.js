import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Bank_dtails_card from "../components/Bank_dtails_card";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import PaymentForm from "../components/PaymentForm";

const stripePromise = loadStripe(
  "pk_test_51P0Ggb02NNbm5Wjc4fHJd1dFUIwq7DjCAp3uWaQi1x767CNFTxoPaRZFrGrmEXfussceVZmUHi7625wUFMp5WUbY00SEFIQUWN"
);

export default function Payment() {
  const userEmail = localStorage.getItem('userEmail');
  const userId = localStorage.getItem('userId');
  var userid = userId;

  //usestate for read card details
  const [memberID, setMemberID] = useState('');
  const [cardNumber, setCardNumber] = useState();
  const [CardName, setCardName] = useState();
  const [expDate, setEXPDate] = useState();
  const [cvcNumber, setCVCNumber] = useState();

  //usestate for save card details
  const [creditCards, setCreditCards] = useState([]);

  // get details fronm url
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const itemId = queryParams.get("planId");
  const itemsTotalPrice = queryParams.get("totalprice");
  const SelectedItems = queryParams.get("sitems");
  const page = queryParams.get("page");
  const [premiumPlan, setPremiumPlan] = useState([]);
  const [cartItem, setCartItem] = useState([]);
  const [gameItem, setGameItem] = useState([]);

  const [officialPrice, setOfficialPrice] = useState(0);
  const [paymentDescription, setPaymentDescription] = useState("");
  const [paymentCategary, setPaymentCategary] = useState("");
  const [discount, setDiscount] = useState(0);
  const [subTotal, setSubTotal] = useState(0);
  const [crystalCount, setCrystalCount] = useState(0);
  const [crystalDiscount, setCrystalDiscount] = useState(0);
  const [userDetails, setUserDetails] = useState([]);

  //validation usestate
  const [paymentEmail, setPaymentEmail] = useState("");
  const [paymentName, setPaymentName] = useState("");
  const [paymentCountry, setPaymentCountry] = useState("");
  // const [payBtnEnable, setPayBtnEnable] = useState(false);
  // const [emaiIsValid, setEmaiIsValid] = useState(false);
  const [cardNameIsValide, setCardNameIsValide] = useState(false);
  const [countryIsValide, setCuntryIsValide] = useState(false);
  // const [clickemail, setclickemail] = useState(false);
  // const [clickname, setclickname] = useState(false);
  // const [clickcountry, setclickcountry] = useState(false);

  // set memberid to usestate
  useEffect(() => {
    setMemberID(userid);
  }, []);

  //read card data from db
  // useEffect(() => {
  //   axios
  //     .get("http://localhost:3001/getBankCardByUserID/" + userid)
  //     .then((result) => setCreditCards(result.data))
  //     .catch((err) => console.log(err));
  // }, []);

  //get details related to the url details
  useEffect(() => {
    if (page == "P") {
      axios
        .get(`http://localhost:3001/getPlanById/${itemId}`)
        .then((result) => {
          setPremiumPlan(result.data);
        })
        .catch((err) => console.log(err));
    } else if (page == "C") {
      axios
        .get(`http://localhost:3001/getCartItemById/${itemId}`)
        .then((result) => {
          setCartItem(result.data);
        })
        .catch((err) => console.log(err));
    } else if (page == "G") {
      axios
        .get(`http://localhost:3001/getGamebyID/${itemId}`)
        .then((result) => {
          setGameItem(result.data);
        })
        .catch((err) => console.log(err));
    }
  }, [page, itemId]);

  useEffect(() => {
    axios
      .get(`http://localhost:3001/getMemberById/${memberID}`)
      .then((result) => {
        setUserDetails(result.data);
      })
      .catch((err) => console.log(err));
  }, [memberID]);

  useEffect(() => {
    if (page === "P") {
      setOfficialPrice(premiumPlan.price);
      setPaymentDescription(premiumPlan.planType);
      setPaymentCategary(premiumPlan.planType)
    } else if (page === "C") {
      setOfficialPrice(cartItem.price);
      setPaymentDescription(cartItem.game);
      
    } else if (page === "G") {
      setOfficialPrice(gameItem.price);
      setPaymentDescription(gameItem.name);
      setPaymentCategary(gameItem.type)
    } else if (page === "CS") {
      setOfficialPrice(parseFloat(itemsTotalPrice));
      setPaymentDescription(SelectedItems);
    }
    setCrystalCount(userDetails.crystalCount);
  }, [page, premiumPlan, userDetails, itemsTotalPrice, SelectedItems]);

  const calcSubTotal = () => {
    console.log("officialPrice:", officialPrice);
    console.log("discount:", discount);
    console.log("crystalCount:", crystalCount);
    if (
      typeof officialPrice === "number" &&
      typeof discount === "number" &&
      typeof crystalCount === "number" &&
      typeof crystalDiscount === "number"
    ) {
      setSubTotal((officialPrice - (discount + crystalDiscount)).toFixed(2));
    }
  };

  // Watch for changes in officialPrice and call calcSubTotal when it changes
  useEffect(() => {
    calcSubTotal();
  }, [officialPrice, crystalCount, discount, crystalDiscount]);

  //usestate for crystal discount checkbox
  const [isCheckedCrystals, setIsCheckedCrystals] = useState(false);

  //usestate for add card form display
  const [showForm, setShowForm] = useState(false);

  //function for crystal discount checkbox
  const handleCrystalCheckboxChange = () => {
    if (isCheckedCrystals == false) {
      setIsCheckedCrystals(true);
      if (officialPrice * (60 / 100) <= crystalCount / 1000) {
        setCrystalDiscount(officialPrice * (60 / 100));
      } else {
        setCrystalDiscount(crystalCount / 1000);
      }
      calcSubTotal();
    } else {
      setIsCheckedCrystals(false);
      setCrystalDiscount(0);
      calcSubTotal();
    }
  };

  //post card data for index.js to create
  // const handleSubmitAndResetForm = () => {
  //   axios
  //     .post("http://localhost:3001/createBankCard", {
  //       memberID,
  //       cardNumber,
  //       CardName,
  //       expDate,
  //       cvcNumber,
  //     })
  //     .then((result) => {
  //       console.log(result);
  //       document.getElementById("paymentdetailsform").reset();
  //     })
  //     .catch((err) => console.log(err));
  // };

  //submit function for add card form
  // const Submit = (e) => {
  //   e.preventDefault();
  //   if (document.getElementById("savecheck").checked) {
  //     handleSubmitAndResetForm();
  //   }
  //   window.location.reload();
  // };

  //add card form submition
  const SubmitCard = (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:3001/createBankCard", {
        memberID,
        cardNumber,
        CardName,
        expDate,
        cvcNumber,
      })
      .then((result) => {
        console.log(result);
        document.getElementById("paymentdetailsform").reset();
      })
      .catch((err) => console.log(err));
    setShowForm(false);
    window.location.reload();
  };

  //when click add card btn set form true
  const addCardBtnCkeker = (e) => {
    setShowForm(true);
  };

  //when click cross btn set form false
  const addCardFormCloseBtnCkeker = (e) => {
    setShowForm(false);
  };

  // form validation___________________________________________________________________
  // card number validation
  // const cardNumberhandle = (event) => {
  //   const { value } = event.target;
  //   // check only numbers are input
  //   const sanitizedcardValue = value.replace(/\D/g, "").slice(0, 16);
  //   // dividet into groups
  //   const formattedCardValue = sanitizedcardValue
  //     .replace(/(\d{4})/g, "$1 ")
  //     .trim();
  //   setCardNumber(formattedCardValue);
  // };

  // card cvc validation
  // const cvcNumberHandle = (event) => {
  //   const { value } = event.target;

  //   const filteredCVCValue = value.replace(/\D/g, "").slice(0, 3);
  //   setCVCNumber(filteredCVCValue);
  // };

  // card name validation
  // const nickNamehandle = (event) => {
  //   const value = event.target.value;

  //   // Check if the input contains only letters
  //   if (/^[A-Za-z]+$/.test(value) || value === "") {
  //     setCardName(value);
  //   }
  // };

  //date validation
  // const expDatehandle = (event) => {
  //   const input = event.target.value;
  //   const formattedInput = input.replace(/\D/g, "");

  //   let formattedExpiryDate = "";

  //   if (formattedInput.length <= 2) {
  //     formattedExpiryDate = formattedInput;
  //   } else if (formattedInput.length > 2 && formattedInput.length <= 4) {
  //     formattedExpiryDate =
  //       formattedInput.substring(0, 2) + "/" + formattedInput.substring(2);
  //   } else if (formattedInput.length > 4) {
  //     formattedExpiryDate =
  //       formattedInput.substring(0, 2) + "/" + formattedInput.substring(2, 4);
  //   }

  //   setEXPDate(formattedExpiryDate);
  // };

  // email validation
  // const emailValidater = () => {
  //   const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  //   setEmaiIsValid(emailPattern.test(paymentEmail));
  //   setclickemail(!emailPattern.test(paymentEmail));
  // };

  // card validation
  // const cardNameValidater = () => {
  //   const onlyLettersRegex = /^[A-Za-z]+$/;
  //   setCardNameIsValide(onlyLettersRegex.test(paymentName));
  //   setclickname(!onlyLettersRegex.test(paymentName));

  // };
  const bankCardNameHandler = (event) => {
    const value = event.target.value;

    if (/^[A-Za-z]+$/.test(value) || value === "") {
      setPaymentName(value);
    }
    if(value.length > 0){
      setCardNameIsValide(true);
    }
    else{
      setCardNameIsValide(false);
    }
  };

  // card validation
  const bankCardCountryHandler = (event) => {
    // const lettersWithSpacesRegex = /^[A-Za-z\s]+$/;
    // setCuntryIsValide(lettersWithSpacesRegex.test(paymentCountry));
    // setclickcountry(!lettersWithSpacesRegex.test(paymentCountry));

    const value = event.target.value;

    if (/^[A-Za-z]+$/.test(value) || value === "") {
      setPaymentCountry(value);
      if(value.length > 0){
        setCuntryIsValide(true);
      }
      else{
        setCuntryIsValide(false);
      }
    }
    

  };

  // ###################### payment submit ##############################

  const [submitHandler, setSubmitHandler] = useState(null);
  const [loading, setLoading] = useState(false);

  const handlePaymentProcess = (handleSubmit) => {
    setSubmitHandler(() => handleSubmit);
  };

  const handleSubmit = async (stripe) => {
    setLoading(true);
    submitHandler && submitHandler();
    setLoading(false);
  };

  return (
    <div>
      <Header navid="home" />
      <div className="flex flex-row px-10 py-11">
        <div className="w-3/5 px-5">
          <h1 className="text-white text-[30px] font-bold">Payment Method</h1>

          <form
            className="px-10 pt-6 pb-10 bg-[#1B1E20] border-2 border-[#FE7804] rounded-3xl my-4"
            id="paymentdetailsform"
          >
            <div className="flex mb-4">
              <img
                width="60"
                height="60"
                src="https://img.icons8.com/color/48/visa.png"
                alt="visa"
              />
              <img
                width="60"
                height="60"
                src="https://img.icons8.com/color/48/mastercard.png"
                alt="mastercard"
              />
            </div>
            <div className="mb-5 ">
              <lable
                className="mx-1 my-2 text-lg text-white "
                htmlFor="paymentemail"
              >
                Email
              </lable>
              <br />
              <input
                id="paymentEmail"
                className={` h-[45px] w-full bg-[#4f5153d2] border-[#D8DAE3] border-2 border-opacity-20 rounded-[10px] pl-3 placeholder-[#9D9191] placeholder-opacity-50 `}
                type="email"
                name="paymentemail"
                placeholder="abc@gmail.com"
                value={userEmail}
                readOnly
                // onChange={(e) => setPaymentEmail(e.target.value)}
                // onKeyUp={emailValidater}
                // onClick={() => setclickemail(true)}
              />
              {/* {clickemail && (<p className=" text-[14px] text-red-500 pl-1 pt-1">Invalid email!</p>)} */}
            </div>

            <div className="mb-5 ">
              <span className="mx-1 my-2 text-lg text-white">Card Details</span>
              <br />
              <div className="!text-white h-[45px] w-full bg-[#4f5153d2] border-2 border-[#D8DAE3] border-opacity-20 rounded-[10px] pl-3 placeholder-[#9D9191] placeholder-opacity-50">
                <Elements stripe={stripePromise}>
                  <PaymentForm
                    subtotal={subTotal}
                    discount={discount}
                    officialprice={officialPrice}
                    crystaldiscount={crystalDiscount}
                    description={paymentDescription}
                    memberid={memberID}
                    pageid={page}
                    itemid={itemId}
                    email={paymentEmail}
                    crystalcount ={crystalCount}
                    name={paymentName}
                    type={paymentCategary}
                    handlePaymentProcess={handlePaymentProcess}
                  />
                </Elements>
              </div>
            </div>

            <div className="flex gap-5">
              <div className="flex-auto mb-5 ">
                <lable
                  className="mx-1 my-2 text-lg text-white "
                  htmlFor="cardname"
                >
                  Name on Card
                </lable>
                <br />
                <input
                  className={` pl-3 placeholder-[#9D9191] placeholder-opacity-50 h-[45px] w-full bg-[#4f5153d2] border-2 border-[#D8DAE3] border-opacity-20 rounded-[10px]`}
                  type="text"
                  name="cardname"
                  placeholder="jonathan"
                  value={paymentName}
                  onChange={bankCardNameHandler}
                  // onChange={(e) => setPaymentName(e.target.value)}
                  // onKeyUp={cardNameValidater}
                  // onClick={() => setclickname(true)}
                />
                {/* {clickname && (<p className=" text-[14px] text-red-500 pl-1 pt-1">Invalid input!</p>)} */}
                <br />
              </div>

              <div className="flex-auto mb-5 ">
                <lable
                  className="mx-1 my-2 text-lg text-white "
                  htmlFor="country"
                >
                  Country
                </lable>
                <br />
                <input
                  className={` h-[45px] pl-3 placeholder-[#9D9191] placeholder-opacity-50 w-full bg-[#4f5153d2] border-2 border-[#D8DAE3] border-opacity-20 rounded-[10px] ${countryIsValide ? "text-black" : " text-red-500"} `}
                  type="text"
                  name="country"
                  placeholder="Sri Lanka"
                  value={paymentCountry}
                  onChange={bankCardCountryHandler}
                  // onChange={(e) => setPaymentCountry(e.target.value)}
                  // onKeyUp={countryValidater}
                  // onClick={() => setclickcountry(true)}
                />
                {/* {clickcountry && (<p className=" text-[14px] text-red-500 pl-1 pt-1">Invalid input!</p>)} */}
                <br />
              </div>
            </div>

            {/* <div class="flex items-center">
              <input
                class="!block mr-2 w-4 h-4 "
                type="checkbox"
                id="savecheck"
                name="savecheck"
              />
              <label class="text-base text-white" htmlFor="savecheck">
                Save for your next purchase
              </label>
            </div> */}

            {/* <div className="flex justify-center mt-10">
              <input
                type="submit"
                className="bg-gradient-to-b from-[#FF451D] to-[#FE7804] text-white w-full h-10 rounded-[10px] text-xl font-bold"
                value="Pay now"
              ></input>
            </div> */}
          </form>
        </div>

        <div className="w-2/5 px-5">
          {/* <div> */}
            <h1 className="text-white text-[30px] font-bold">Invoice</h1>
            <div className="bg-[#202022] rounded-xl my-4 p-6">
              <div className="mb-1 text-[18px] font-semibold text-[#D9D9D9]">
                <span>Official Price</span>
                <span className="float-right">
                  ${" "}
                  {typeof officialPrice === "number"
                    ? officialPrice.toFixed(2)
                    : ""}
                </span>
              </div>
              <div className="px-4 mb-3">
                <span className="text-[14px] text-[#6b6767]">
                  {paymentDescription} -{" "}
                </span>
                <span className=" text-[14px] text-[#6b6767]">
                  ${" "}
                  {typeof officialPrice === "number"
                    ? officialPrice.toFixed(2)
                    : ""}
                </span>
              </div>

              <div className="mb-1 font-semibold text-[18px]">
                <span className="text-[#D9D9D9]">Seasonal Discount</span>
                <span className="float-right text-[#D9D9D9]">$ 0.00</span>
              </div>
              {isCheckedCrystals && (
                <div className="mb-1 font-semibold text-[18px]">
                  <span className="text-[#FE7804]">Crystal Discount</span>
                  <span className="float-right text-[#FE7804]">
                    ${" "}
                    {typeof crystalDiscount === "number"
                      ? crystalDiscount.toFixed(2)
                      : ""}
                  </span>
                </div>
              )}

              <br />

              <div className="flex mb-3 text-[15px] mt-9">
                <input
                  className="!block mr-3"
                  type="checkbox"
                  id="crystalcheck"
                  name="crystalcheck"
                  checked={isCheckedCrystals}
                  onChange={handleCrystalCheckboxChange}
                />
                <label
                  htmlFor="crystalcheck"
                  className="text-base text-[#D9D9D9] "
                >
                  Use Crystals as Discount
                </label>
              </div>

              <div className="mb-5 ">
                <span className="text-[28px] font-bold text-white">
                  Sub Total
                </span>
                <span className="float-right text-[28px] font-bold text-white">
                  $ {subTotal}
                </span>
              </div>
              {(cardNameIsValide && countryIsValide) && (<button
                id="MakePaymentbtn"
                onClick={handleSubmit}
                className="bg-gradient-to-b from-[#FF451D] to-[#FE7804] text-white w-full h-10 rounded-[10px] text-lg font-bold"
              >
                Make Payment
              </button>)}
              {!(cardNameIsValide && countryIsValide) && (<button
                className="bg-gradient-to-b from-[#6a6966] to-[#E8E8E7] text-[#545353] w-full h-10 rounded-[10px] text-lg font-bold"
              >
                Make Payment
              </button>)}
            </div>
          {/* </div> */}
          {/* <div>
            <h1 className="text-white text-[30px] font-bold">Saved Cards</h1>
            <div className="bg-[#202022] rounded-xl my-4 p-5">
              {creditCards.map((card) => {
                return (
                  <Bank_dtails_card
                    id={card._id}
                    cardnumber={card.cardNumber}
                    nickname={card.CardName}
                  />
                );
              })}

              <button
                className="bg-gradient-to-b from-[#FF451D] to-[#FE7804] text-white w-full h-10 rounded-[10px] text-lg font-bold"
                onClick={addCardBtnCkeker}
              >
                Add New Card
              </button>
            </div>
          </div> */}
        </div>
      </div>

      {/* {showForm && (
        <div className="absolute top-0 left-0 z-40 flex items-center justify-center w-full h-full backdrop-blur-lg">
          <form
            onSubmit={SubmitCard}
            className="p-10 border-2 border-[#FF451D] rounded-3xl my-4 bg-[#1B1E20] shadow-lg shadow-[#FE7804]"
            id="paymentdetailsform"
          >
            <img
              width="25"
              height="25"
              className="float-right mb-3"
              src="https://img.icons8.com/sf-black/64/EBEBEB/multiply.png"
              alt="multiply"
              onClick={addCardFormCloseBtnCkeker}
            />

            <div className="clear-right mb-5">
              <lable
                className="mx-1 my-2 text-lg text-white "
                htmlFor="cardnumber"
              >
                Card Number
              </lable>
              <br />
              <input
                className="text-white h-[45px] w-full bg-[#1B1E20] border-2 border-[#D8DAE3] border-opacity-20 rounded-[10px] pl-3 placeholder-[#9D9191] placeholder-opacity-50"
                type="text"
                name="cardnumber"
                placeholder="1234 4567 8901 2345"
                value={cardNumber}
                onChange={cardNumberhandle}
                maxLength={19}
                required
              />
              <br />
            </div>

            <div className="mb-5 ">
              <lable
                className="mx-1 my-2 text-lg text-white"
                htmlFor="cardname"
              >
                Card Name
              </lable>
              <br />
              <input
                className="text-white h-[45px] w-full bg-[#1B1E20] border-2 border-[#D8DAE3] border-opacity-20 rounded-[10px] pl-3 placeholder-[#9D9191] placeholder-opacity-50"
                type="text"
                name="cardname"
                placeholder="jonathan"
                onChange={nickNamehandle}
                value={CardName}
                required
              />
              <br />
            </div>

            <div className="flex gap-5">
              <div className="flex-auto mb-5 ">
                <lable
                  className="mx-1 my-2 text-lg text-white "
                  htmlFor="xepdate"
                >
                  Expiry Date
                </lable>
                <br />
                <input
                  className="text-white pl-3 placeholder-[#9D9191] placeholder-opacity-50 h-[45px] w-full bg-[#1B1E20] border-2 border-[#D8DAE3] border-opacity-20 rounded-[10px]"
                  type="text"
                  name="xepdate"
                  placeholder="06/24"
                  value={expDate}
                  onChange={expDatehandle}
                  maxLength={5}
                  minLength={5}
                  required
                />
                <br />
              </div>

              <div className="flex-auto mb-5 ">
                <lable className="mx-1 my-2 text-lg text-white " htmlFor="cvc">
                  Security Number
                </lable>
                <br />
                <input
                  className="text-white h-[45px] pl-3 placeholder-[#9D9191] placeholder-opacity-50 w-full bg-[#1B1E20] border-2 border-[#D8DAE3] border-opacity-20 rounded-[10px] "
                  type="text"
                  name="cvc"
                  placeholder="781"
                  value={cvcNumber}
                  onChange={cvcNumberHandle}
                  maxLength={3}
                  required
                />
                <br />
              </div>
            </div>

            <div className="flex justify-center mt-10">
              <input
                type="submit"
                className="bg-gradient-to-b from-[#FF451D] to-[#FE7804] text-white w-full h-10 rounded-[10px] text-xl font-bold"
                value="Save Card"
              ></input>
            </div>
          </form>
        </div>
      )} */}

      <Footer />
    </div>
  );
}
