import React, { useState, useEffect,useRef } from "react";
import axios from "axios";
import { HashLoader } from "react-spinners";
import DeleteWorning from "../assets/payment/deleteanimation.webm";
import SearchError from "../assets/payment/searchnotfound.webm";
import Header from "../components/Header";
import RankIcon from "../assets/myAccount/rankicon.png";
import XPIcon from "../assets/myAccount/xpicon.png";
import MembershipIcon from "../assets/myAccount/membershipicon.png";
import CrystalIcon from "../assets/myAccount/crystalicon.png";
import Mastre1Icon from "../assets/myAccount/master1.png";
import Mastre3Icon from "../assets/myAccount/master3.png";
import LegendIcon from "../assets/myAccount/legend.png";
import Payment_history_card from "../components/Payment_history_card";
import Game_download_card from "../components/Game_download_card";
import Channel from "../components/Channel";
import Subscribers from "../components/Subscribers";
import Footer from "../components/Footer";
import SuccessPopup from "../components/SuccessPopup";
import useSWR from 'swr';
import { useNavigate} from 'react-router-dom';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import RookieLeague from "../assets/myAccount/rookie_league.png";
import MasterLeague from "../assets/myAccount/master_league.png";
import LegendaryLeague from "../assets/myAccount/legendary_league.png";
import ViewBattle from "../components/ViewBattle";

export default function Myaccount() {

  const userEmail = localStorage.getItem('userEmail');
  const userId = localStorage.getItem('userId');
  //var memberID = "66118d9104fb9c92e1c7d980";
  var memberID = userId;
  // var memberID ="66202ae130ee8bb8602d92b6";
  const navigate = useNavigate();
  const imageInputRef = useRef(null);
  const [selectedDiv, setSelectedDiv] = useState("Dashboard");
  const [channelDiv, setChannelDiv] = useState("MyChannels");
  const [loading, setLoading] = useState(false);
  const [deleteSuccessMessagechecked, setDeleteSuccessMessagechecked] = useState(false);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');

  const [profileImage, setProfileImage] = useState(null);

  const [allUserData, setAllUserData] = useState([]);

  const [userData, setUserData] = useState('');
  const [reloadCount, setReloadCount] = useState(0);

  const handleDivClick = (divId) => {
    setSelectedDiv(divId === selectedDiv ? null : divId);
  };

  const handleChannel = (divId) => {
    setChannelDiv(divId === channelDiv ? null : divId);
  };

  var xpPoints = 90;

  const handleDeleteCloseSuccessPopup = () => {
    setDeleteSuccessMessagechecked(false);
  };
  {
    /* ################################################################### User management ######################################*/
  }

  const getCurrentDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    let month = today.getMonth() + 1;
    let day = today.getDate();

    // Add leading zero if month or day is less than 10
    month = month < 10 ? '0' + month : month;
    day = day < 10 ? '0' + day : day;

    return `${year}-${month}-${day}`;
  };
// backend password update
  // const onClickChangePass = async () => {
  //   const passValue = document.getElementById('newPassword').value;
  //   const confirmPassValue = document.getElementById('confirmPassword').value;

  //   if(passValue == '' || confirmPassValue == ''){
  //     alert('Fields cannot be empty.');
  //   }else if (passValue != confirmPassValue){
  //     alert('Passwords not matched. Please Check.')
  //   }else{
  //     let formData = {
  //       username : data?.user.username,
  //       email : data?.user.email,
  //       newPass : passValue,
  //       detail : "changePass"
  //     }
  //     try {
  //       const response = await axios.put(
  //         'http://localhost:3001/api/changeData',
  //         formData,
  //       );
  //       console.log('Response:', response.data);
  //       alert("Password Changed Successfully");
  //       setTimeout(() => {
  //         navigate('/login');
  //       }, 1000);
  //     } catch (error) {
  //       alert( error.response.data.error);
  //       console.error('Error:', error);
  //     }
  //   }
  // }
  //--new pasword validation start
  const onClickChangePass = async () => {
    const passValue = document.getElementById('newPassword').value;
    const confirmPassValue = document.getElementById('confirmPassword').value;

    // Regular expression to check the password strength
    const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{5,}$/;

    if (passValue === '' || confirmPassValue === '') {
        alert('Fields cannot be empty.');
    } else if (passValue !== confirmPassValue) {
        alert('Passwords do not match. Please check.');
    } else if (!passwordRegex.test(passValue)) {
        alert('Password must be at least 5 characters long and contain at least one number and one symbol character.');
    } else {
        let formData = {
            username: data?.user.username,
            email: data?.user.email,
            newPass: passValue,
            detail: "changePass"
        }
        try {
            const response = await axios.put(
                'http://localhost:3001/api/changeData',
                formData,
            );
            console.log('Response:', response.data);
            alert("Password Changed Successfully");
            setTimeout(() => {
                navigate('/login');
            }, 1000);
        } catch (error) {
            alert(error.response.data.error);
            console.error('Error:', error);
        }
    }
}

  //--new pasword validation end

  // const onClickUpdateDetails = async () => {

  //   const firstname = document.getElementById('firstName').value;
  //   const lastname = document.getElementById('lastName').value;

  //   if(firstname == '' || lastname == ''){
  //     alert('Fields cannot be empty.');
  //   }else{
  //     let updatedob = dateOfBirth == '' ? data?.user.dob : dateOfBirth;
  //     let formData = {
  //       username : data?.user.username,
  //       email : data?.user.email,
  //       firstName : firstname,
  //       lastName : lastname,
  //       dob : updatedob,
  //       detail : "updateDetails"
  //     }
  //     try {
  //       const response = await axios.put(
  //         'http://localhost:3001/api/changeData',
  //         formData,
  //       );
  //       console.log('Response:', response.data);
  //       alert("User Details Changed Successfully");
  //       setTimeout(() => {
  //         setReloadCount(reloadCount + 1);
  //       }, 1000);
  //     } catch (error) {
  //       alert( error.response.data.error);
  //       console.error('Error:', error);
  //     }
  //   }
  // }

  // ----- new firstname and lastname validation start
  const onClickUpdateDetails = async () => {
    const firstname = document.getElementById('firstName').value.trim();
    const lastname = document.getElementById('lastName').value.trim();

    // Regular expression to validate that the name fields contain only letters
    const nameRegex = /^[a-zA-Z]+$/;

    if (firstname === '' || lastname === '') {
        alert('Fields cannot be empty.');
    } else if (!nameRegex.test(firstname) || !nameRegex.test(lastname)) {
        alert('Names can only include alphabet letters.');
    } else {
        let updatedob = dateOfBirth === '' ? data?.user.dob : dateOfBirth;
        let formData = {
            username: data?.user.username,
            email: data?.user.email,
            firstName: firstname,
            lastName: lastname,
            dob: updatedob,
            detail: "updateDetails"
        }
        try {
            const response = await axios.put(
                'http://localhost:3001/api/changeData',
                formData,
            );
            console.log('Response:', response.data);
            alert("User Details Changed Successfully");
            setTimeout(() => {
                setReloadCount(reloadCount + 1);
            }, 1000);
        } catch (error) {
            alert(error.response.data.error);
            console.error('Error:', error);
        }
    }
}// ----- new firstname and lastname validation end


  const onClickLogout = () => {
    navigate('/login');
  }

  const onClickDelete = async () => {

    const isConfirmed = window.confirm("Are you sure you want to delete?");

    // Check user's response
    if (isConfirmed) {
      console.log("Deleting...");

      try {
        const response = await axios.delete(
          'http://localhost:3001/api/deleteAccount',
          {
            data: {
              username: data?.user.username,
              email: data?.user.email,
            }
          }
        );
        console.log('Response:', response.data);
        alert("User Deleted Successfully");
        setTimeout(() => {
          navigate('/login');
        }, 1000);
      } catch (error) {
        alert( error.response.data.error);
        console.error('Error:', error);
      }
    } else {
      console.log("Delete cancelled.");
    }
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setProfileImage(file);
  };

  const handleUpload = async () => {
    console.log("Selected image:", profileImage);

    const imageUrl = profileImage ? await uploadFile("image", profileImage ) : null;
    await updateProfileImage(imageUrl);
  };

  const updateProfileImage = async (imageUrl) => {
    try {

      let formData = {
        username : data?.user.username,
        email : data?.user.email,
        url: imageUrl,
        detail : "updateProfileImage"
      }

      const response = await axios.put('http://localhost:3001/api/changeData', formData);

      alert("User Image Updated Successfully");
      setTimeout(() => {
        imageInputRef.current.value = '';
        setReloadCount(reloadCount + 1);
      }, 1000);
      

    }catch (error) {
      console.error("Error creating game:", error);
      alert(error);
    }
  }
  

  const uploadFile = async (type, file) => {
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset",type === "image" ? "userProfile_Preset" : "Stream_Preset");

    try {
      let cloudName = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME;
      console.log("Cloudinary cloud name:", cloudName);
      let resourceType = type === "image" ? "image" : "video";
      let api = `https://api.cloudinary.com/v1_1/dg8cpnx1m/${resourceType}/upload`;

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

  const generatePDF = () => {

    const input = document.getElementById('pdf-table');
  
    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF();
      const imgWidth = 210;
      const pageHeight = 297;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;
  
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
  
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
  
      pdf.save('All Users.pdf');
    });
  }

  useEffect(() => {
    setTimeout(() => {
      const userEmail = data?.user.email;
      if (userEmail) { 
        console.log(userEmail);

        const fetchData = async () => {
          try {
            const response = await axios.get('http://localhost:3001/api/getuser?email=' + userEmail);
            setUserData(response.data);
          } catch (error) {
            console.error("Error fetching data:", error);
            alert(error.message);
          }
        };

        fetchData();
      }
  }, 1000);
  }, [reloadCount,selectedDiv]);
  

  const { data, isLoading } = useSWR('api/me');

  useEffect(() => {

    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/allUsers');
        setAllUserData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        alert(error.message);
      }
    };

    fetchData();

  }, [])

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedField, setSelectedField] = useState('username');

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value.toLowerCase());
  };

  const handleFieldChange = (event) => {
    setSelectedField(event.target.value);
  };

  const filteredData = allUserData.filter(user => {
    if (!user[selectedField]) return false;
    return user[selectedField].toString().toLowerCase().includes(searchQuery);
  });
  //Updated by Ishan
  useEffect(() => {
    setTimeout(() => {
      const userEmail = data?.user.email;
      const userId = data?.user.id;
      
      if (userEmail) { 
        const fetchData = async () => {
          try {
            const response = await axios.get('http://localhost:3001/api/getuser?email=' + userEmail);
            setUserData(response.data);
          } catch (error) {
            console.error("Error fetching data:", error);
            alert(error.message);
          }
        };

        fetchData();
      }
  }, 1000);
  }, [reloadCount,selectedDiv]);
  
  

  {
    /* ##################################################################### Payment management ######################################*/
  }
  const [purchaseHistory, setPurchaseHistory] = useState([]);
  const [searchedPayments, setSearchedPayments] = useState([]);
  const [isFilterDivCkecked, setIsFilterDivCkecked] = useState(false);
  const [isPaymentSearchCkecked, setIsPaymentSearchCkecked] = useState(false);
  const [isNewastPaymentCkecked, setIsNewastPaymentCkecked] = useState(true);
  const [isOldeststPaymentCkecked, setIsOldeststPaymentCkecked] =
    useState(false);
  const [isLargAmountCkecked, setIsLargAmountCkecked] = useState(false);
  const [isLowestAmountCkecked, setIsLowestAmountCkecked] = useState(false);
  const [AllDeleteConfirmMessage, setAllDeleteConfirmMessage] = useState(false);
  const [userDetails, setUserDetails] = useState([]);

  const sortedPaymentsDateAsc = purchaseHistory
    .slice()
    .sort((a, b) => new Date(a.date) - new Date(b.date));
  const sortedPaymentsDateDesc = purchaseHistory
    .slice()
    .sort((a, b) => new Date(b.date) - new Date(a.date));
  const sortedPaymentsAmountAsc = purchaseHistory
    .slice()
    .sort((a, b) => a.officialprice - b.officialprice);
  const sortedPaymentsAmountDesc = purchaseHistory
    .slice()
    .sort((a, b) => b.officialprice - a.officialprice);

  const searchPayment = () => {
    setIsPaymentSearchCkecked(true);
    setIsLargAmountCkecked(false);
    setIsLowestAmountCkecked(false);
    setIsNewastPaymentCkecked(false);
    setIsOldeststPaymentCkecked(false);
    const inputpaymentsearch =
      document.getElementById("SearchPaymentInput").value;
    const searchedGames = purchaseHistory.filter(
      (game) =>
        game.description &&
        game.description
          .toLowerCase()
          .includes(inputpaymentsearch.toLowerCase())
    );
    setSearchedPayments(searchedGames);
  };

  useEffect(() => {
    const fetchPaymentData = () => {
      axios
        .get(`http://localhost:3001/getPaymentRecodsByMemberID/${memberID}`)
        .then((result) => setPurchaseHistory(result.data))
        .catch((err) => console.log(err));
    };
    fetchPaymentData();
    const intervalId = setInterval(fetchPaymentData, 5000);
    return () => clearInterval(intervalId);
  }, [memberID]);

  const handleAllPaymentHistoryDelete = (id) => {
    setLoading(true);
    axios
      .delete("http://localhost:3001/deletePaymentHistoryRelatedToMember/" + id)
      .then((res) => {
        console.log(res);
        setLoading(false);
      })
      .catch((errr) => console.log(errr));
    setDeleteSuccessMessagechecked(true);
  };

  useEffect(() => {
    axios
      .get(`http://localhost:3001/getMemberById/${memberID}`)
      .then((result) => {
        setUserDetails(result.data);
      })
      .catch((err) => console.log(err));
  }, [memberID]);

  

  {
    /* ################################################################### download management ######################################*/
  }

  const [downloads, setDownloads] = useState([]);
  const [myGameSearchResult, setMyGameSearchResult] = useState([]);
  const [myGameSearchDivCheck, setMyGameSearchDivCheck] = useState(false);

  useEffect(() => {
    const fetchDownloadData = () => {
      axios
        .get(`http://localhost:3001/getDownloadbyMemberid/${memberID}`)
        .then((result) => {
          const data = result.data;
          if (Array.isArray(data)) {
            setDownloads(data);
          } else {
            setDownloads([]);
            console.log("Download data is not an array:", data);
          }
        })
        .catch((err) => console.log(err));
    };
    fetchDownloadData();
    const intervalId = setInterval(fetchDownloadData, 5000);
    return () => clearInterval(intervalId);
  }, [memberID]);

  const handleMyDownloadSearch = () => {
    setMyGameSearchDivCheck(true);
    const myGamesSearchInput = document.getElementById(
      "myDownloadGameSearch"
    ).value;

    const requests = downloads.map((item) =>
      axios.get(`http://localhost:3001/getGamebyID/${item.gameid}`)
    );

    Promise.all(requests)
      .then((results) => {
        const downloadGamesData = results.map((result) => result.data);
        const allDownloadGames = downloadGamesData.flat();
        const myGameSearchvar = allDownloadGames.filter(
          (item) =>
            item.name &&
            item.name.toLowerCase().includes(myGamesSearchInput.toLowerCase())
        );
        setMyGameSearchResult(myGameSearchvar);
      })
      .catch((err) => console.log(err));
  };
  const inputClasses = "bg-zinc-700 border-b border-orange-600 text-white p-2 w-full mt-3";
  const buttonClasses = "text-white font-bold py-2 px-4 bg-gradient-to-r from-[#FE7804] to-[#FF451D] rounded-lg";

  var xpPoints = 40;
  var pusername = userData ? userData.firstname + " " + userData.lastname : '';

  //  //feedback and faq
  // //  const streamid = queryParams.get("streamid");
  // //  const pageid='fblist';
  const [feedbacks, setFeedbacks] = useState([]); 
  // useEffect(() => {
  //   axios.get('http://localhost:3001/getallfeedbacks')
  //     .then(feedbacks =>setFeedbacks(feedbacks.data))
  //     .catch(err => console.log(err));
  // }, []);
 
  useEffect(() => {
    if (selectedDiv === "Reviews") {
      console.log('Fetching feedbacks...');
      axios.get('http://localhost:3001/getallfeedbacks')
        .then(response => {
          console.log('Feedbacks fetched:', response.data);
          setFeedbacks(response.data);
        })
        .catch(error => {
          console.error('Error fetching feedbacks:', error);
        });
    }
  }, [selectedDiv]);
  

  return (
    <div>
      <Header navid="home" key={`${reloadCount}-${selectedDiv}`}/>
      <div className="flex flex-row justify-center p-8 h-1/4">
        <div className="flex justify-center">
        <img
            className="w-32 h-32 rounded-full"
            src={userData ? (userData.image !== '' ? userData.image : 'https://cdn-icons-png.flaticon.com/512/149/149071.png') : 'https://cdn-icons-png.flaticon.com/512/149/149071.png'}
            alt="user"
          />
        </div>
        <div className="px-5">
          <h1 className="font-bold text-[40px] text-white">
          {pusername}
          </h1>
          <span className="bg-gradient-to-b from-[#FF451D] to-[#FE7804] text-white px-2 py-1 rounded-2xl text-[14px]">
            Primium
          </span>
          <span className="text-[20px] text-[#ffffff8d] ml-2">{userData?userData?.accountType:''}</span>
          <div className="pt-2">
            <span className="text-[16px] text-[#ffffff8d] font-bold ">
            Level {userData?.memberLevel}
            </span>
            <span className="text-[16px] text-[#ffffff8d] float-right">
            {userData?.xpCount} xp
            </span>
          </div>
          <div className="relative">
            <div className="bg-[#fe790460] w-full h-[3px] absolute top-[1px] left-0 rounded-sm"></div>
            <div className="bg-[#FF451D] h-[5px] w-28 absolute top-0 left-0 z-10 rounded-sm"></div>
          </div>
        </div>
      </div>

      <div className=" mx-auto pb-[2px] w-11/12 bg-gradient-to-r from-[#FF451D] to-[#FE7804]">
        <div className="flex flex-row w-full  relative bg-[#2A2B2F]">
          <div
            className={`py-2 px-5 rounded-t-[10px] ${
              selectedDiv === "Dashboard"
                ? "bg-gradient-to-t from-[#FF451D] to-[#FE7804]"
                : ""
            }`}
          >
            <input type="checkbox" id="dashboard" />
            <label
              htmlFor="dashboard"
              className="text-white font-medium hover:text-[#FF451D] cursor-pointer"
              onClick={() => handleDivClick("Dashboard")}
            >
              Dashboard
            </label>
          </div>
          <div
            className={`py-2 px-5 rounded-t-[10px] ${
              selectedDiv === "Channels"
                ? "bg-gradient-to-t from-[#FF451D] to-[#FE7804]"
                : ""
            }`}
          >
            <input type="checkbox" id="Channels" />
            <label
              htmlFor="Channels"
              className="text-white font-medium hover:text-[#FF451D] cursor-pointer"
              onClick={() => handleDivClick("Channels")}
            >
              Channels
            </label>
          </div>
          <div
            className={`py-2 px-5 rounded-t-[10px] ${
              selectedDiv === "Purchase"
                ? "bg-gradient-to-t from-[#FF451D] to-[#FE7804]"
                : ""
            }`}
          >
            <input type="checkbox" id="Purchase" />
            <label
              htmlFor="Purchase"
              className="text-white font-medium hover:text-[#FF451D] cursor-pointer"
              onClick={() => handleDivClick("Purchase")}
            >
              Purchases
            </label>
          </div>
          <div
            className={`py-2 px-5 rounded-t-[10px] ${
              selectedDiv === "Downloads"
                ? "bg-gradient-to-t from-[#FF451D] to-[#FE7804]"
                : ""
            }`}
          >
            <input type="checkbox" id="Downloads" />
            <label
              htmlFor="Downloads"
              className="text-white font-medium hover:text-[#FF451D] cursor-pointer"
              onClick={() => handleDivClick("Downloads")}
            >
              My Games
            </label>
          </div>
          <div
            className={`py-2 px-5 rounded-t-[10px] ${
              selectedDiv === "Reviews"
                ? "bg-gradient-to-t from-[#FF451D] to-[#FE7804]"
                : ""
            }`}
          >
            <input type="checkbox" id="Reviews" />
            <label
              htmlFor="Reviews"
              className="text-white font-medium hover:text-[#FF451D] cursor-pointer"
              onClick={() => handleDivClick("Reviews")}
            >
              Reviews
            </label>
          </div>
          <div
            className={`py-2 px-5 rounded-t-[10px] ${
              selectedDiv === "Events"
                ? "bg-gradient-to-t from-[#FF451D] to-[#FE7804]"
                : ""
            }`}
          >
            <input type="checkbox" id="Events" />
            <label
              htmlFor="Events"
              className="text-white font-medium hover:text-[#FF451D] cursor-pointer"
              onClick={() => handleDivClick("Events")}
            >
              Events
            </label>
          </div>
          <div
            className={`py-2 px-5 rounded-t-[10px]  ${
              selectedDiv === "Settings"
                ? "bg-gradient-to-t from-[#FF451D] to-[#FE7804]"
                : ""
            }`}
          >
            <input type="checkbox" id="Settings" />
            <label
              htmlFor="Settings"
              className="text-white font-medium hover:text-[#FF451D] cursor-pointer"
              onClick={() => handleDivClick("Settings")}
            >
              Settings
            </label>
          </div>
          {/* dasun admin part*/}
          {data?.user.type == 'admin' ? 
            <div
              className={`py-2 px-5 rounded-t-[10px]  ${
                selectedDiv === 'AllUsers'
                  ? 'bg-gradient-to-t from-[#FF451D] to-[#FE7804]'
                  : ''
              }`}
            >
              <input type="checkbox" id="AllUsers" />
              <label
                htmlFor="AllUsers"
                className="text-white font-medium hover:text-[#FF451D] cursor-pointer"
                onClick={() => handleDivClick('AllUsers')}
              >
                All Users
              </label>
            </div>
            :
            null
          }
        </div>
      </div>

            {/* ######################### Dashboard ########################   */}
            {selectedDiv === "Dashboard" && (

        <div className="flex w-11/12 mx-auto ">
          <div className="w-2/5 ">

            <div className="bg-[#ffffff1a] rounded-3xl mt-9 flex flex-col items-center pt-9 pb-5">
              <img
                className="h-[200px] w-[225px]"
                src={
                  userData?.memberLevel >= 1 &&  userData?.memberLevel < 5 ? RookieLeague :
                  userData?.memberLevel >= 5 &&  userData?.memberLevel < 10 ? MasterLeague :
                  LegendaryLeague
                }
                alt="rank-icon"
              />
              <span className=" text-[#FE7804] text-3xl font-bold mt-6">
                  {userData?.memberLevel >= 1 &&  userData?.memberLevel < 5? "Rookie" :
                  userData?.memberLevel >= 5 &&  userData?.memberLevel < 10? "Master" :
                  "Legendary"}
              </span>
              <span className=" text-[#ffffff8d] text-xl">League</span>

              <div className="w-full mt-9 px-9">
                <span className="w-full text-lg font-bold text-white ">

                  Leagues
                </span>
                <div className="flex items-center mt-5">
                  <img
                    className="h-[55px] w-[62px]"
                    src={RookieLeague}
                    alt="rank-icon"
                  />
                  <span className=" text-[#ffffff92] font-bold text-base pl-8">
                    Rookie(Lv 1 - Lv4)
                  </span>
                </div>
                <div className="flex items-center mt-5">
                  <img
                    className="h-[55px] w-[62px]"
                    src={MasterLeague}
                    alt="rank-icon"
                  />
                  <span className=" text-[#ffffff92] font-bold text-base pl-8">
                    Master(Lv 5 - Lv9)
                  </span>
                </div>
                <div className="flex items-center mt-5">
                  <img
                    className="h-[55px] w-[62px]"
                    src={LegendaryLeague}
                    alt="rank-icon"
                  />
                  <span className=" text-[#ffffff92] font-bold text-base pl-8">
                    Legendary(Lv 10 +)
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col w-3/5">
            <div className="flex justify-around w-full px-5 ">
              <div className="flex flex-col items-center  py-8 mt-9 bg-[#ffffff1a] w-5/12 rounded-3xl">
                <img
                  className="h-[70px] w-[70px]"
                  src={RankIcon}
                  alt="rank-icon"
                />
                <span className="text-[25px] text-white font-bold my-4">
                  Ranking
                </span>
                <div className="w-2/3 h-[2px] bg-[#ffffff50]"></div>
                <span className="text-[18px] text-white my-7">Level {userData?.memberLevel}</span>
              </div>

              <div className=" bg-[#ffffff1a] w-5/12 flex flex-col items-center py-8 mt-9 rounded-3xl">
                <img className="h-[65px] w-[65px]" src={XPIcon} alt="xp-icon" />
                <span className="text-[25px] text-white font-bold my-4">
                  Experience Points
                </span>
                <div className="w-2/3 h-[2px] bg-[#ffffff50]"></div>
                <span className="text-[18px] text-white my-7">{userData?.xpCount} Points</span>
                <div className="w-2/3">
                  <span className="text-[13px] text-[#ffffff8d]">{userData?.xpCount} xp</span>
                  <span className="text-[13px] text-[#ffffff8d] float-right">
                    Next Level
                  </span>
                </div>
                <div className="relative w-2/3">
                  <div className="bg-[#fe790460] w-full h-[3px] absolute top-[1px] left-0 rounded-sm"></div>
                  <div className="bg-[#FF451D] h-[5px] w-28 absolute top-0 left-0 z-10 rounded-sm"></div>
                </div>
              </div>
            </div>

            <div className="flex justify-around w-full px-5 ">
              <div className="flex flex-col items-center  py-8 mt-9 bg-[#ffffff1a] w-5/12 rounded-3xl">
                <img
                  className="h-[70px] w-[70px]"
                  src={CrystalIcon}
                  alt="crystal-icon"
                />
                <span className="text-[25px] text-white font-bold my-4">
                  Crystals
                </span>
                <div className="w-2/3 h-[2px] bg-[#ffffff50]"></div>
                <span className="text-[18px] text-white my-7">
                  {userData?.crystalCount} Crystals
                </span>
              </div>

              <div className=" bg-[#ffffff1a] w-5/12 flex flex-col items-center py-8 mt-9 rounded-3xl">
                <img
                  className="h-[65px] w-[65px]"
                  src={MembershipIcon}
                  alt="rank-icon"
                />
                <span className="text-[25px] text-white font-bold my-4">
                  Membership
                </span>
                <div className="w-2/3 h-[2px] bg-[#ffffff50]"></div>
                <span className="text-[18px] text-white my-7">Gold Member</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ######################### Channels ########################   */}
      {selectedDiv === "Channels" && (
        <div className="w-11/12 mx-auto mt-3">
          <div className="py-5">
            <span
              className=" py-2 px-4 border-2 border-[#FE7804] rounded-3xl text-[#FE7804] font-semibold mr-6 cursor-pointer hover:bg-gradient-to-t from-[#FF451D] to-[#FE7804] hover:text-white"
              onClick={() => handleChannel("MyChannels")}
            >
              My channel
            </span>
            <span
              className=" py-2 px-4 border-2 border-[#FE7804] rounded-3xl text-[#FE7804] font-semibold mr-6 cursor-pointer hover:bg-gradient-to-t from-[#FF451D] to-[#FE7804] hover:text-white"
              onClick={() => handleChannel("MySubcriptions")}
            >
              My Subscriptions
            </span>

            {/* ######################### MyChannels ########################   */}
            {channelDiv === "MyChannels" && (

              <div className="px-5 mt-3 text-white">

                <Channel reloadCount={reloadCount} setReloadCount={setReloadCount} memberID={memberID} crystalcount={userData?.crystalCount}/>

              </div>
            )}

            {/* ######################### MySubcriptions ########################   */}
            {channelDiv === "MySubcriptions" && (
              <div className="px-5 mt-3 text-white">
              <Subscribers memberID={memberID} />
              </div>
            )}
          </div>
        </div>
      )}

      {/* ######################### Purchases ########################   */}
      {selectedDiv === "Purchase" && (
        <div className="w-11/12 mx-auto mt-5">
          <h1 className="mb-6 text-2xl font-bold text-white">
            Purchase History
          </h1>
          <div className="flex ">
            <div className=" w-1/2 p-[2px] bg-gradient-to-l from-[#FE7804] to-[#FF451D] rounded-lg">
              <input
                className=" bg-[#2A2B2F] text-[#FE7804] rounded-lg w-full  px-3 py-2 placeholder-[#FE7804]"
                type="search"
                id="SearchPaymentInput"
                placeholder="Search Payment"
                onKeyUp={searchPayment}
              />
            </div>
            <div className="flex justify-between w-1/2 px-3">
              <div className="relative flex justify-end">
                <span className="h-full bg-gradient-to-r from-[#FE7804] to-[#FF451D] rounded-lg flex items-center px-8 text-white font-semibold">
                  Search
                </span>
                {isFilterDivCkecked && (
                  <div className=" absolute -right-[95%] top-0 z-10 bg-black bg-opacity-50 text-white py-3 px-5 rounded-lg leading-8">
                    <p
                      onClick={() => {
                        setIsLargAmountCkecked(false);
                        setIsLowestAmountCkecked(false);
                        setIsNewastPaymentCkecked(true);
                        setIsOldeststPaymentCkecked(false);
                        setIsPaymentSearchCkecked(false);
                        setIsFilterDivCkecked(false);
                      }}
                      className=" cursor-pointer font-semibold hover:text-[#FF451D]"
                    >
                      Latest
                    </p>
                    <p
                      onClick={() => {
                        setIsLargAmountCkecked(false);
                        setIsLowestAmountCkecked(false);
                        setIsNewastPaymentCkecked(false);
                        setIsOldeststPaymentCkecked(true);
                        setIsPaymentSearchCkecked(false);
                        setIsFilterDivCkecked(false);
                      }}
                      className=" cursor-pointer font-semibold hover:text-[#FF451D]"
                    >
                      Oldest
                    </p>
                    <p
                      onClick={() => {
                        setIsLargAmountCkecked(true);
                        setIsLowestAmountCkecked(false);
                        setIsNewastPaymentCkecked(false);
                        setIsOldeststPaymentCkecked(false);
                        setIsPaymentSearchCkecked(false);
                        setIsFilterDivCkecked(false);
                      }}
                      className=" cursor-pointer font-semibold hover:text-[#FF451D]"
                    >
                      Descending Price
                    </p>
                    <p
                      onClick={() => {
                        setIsLargAmountCkecked(false);
                        setIsLowestAmountCkecked(true);
                        setIsNewastPaymentCkecked(false);
                        setIsOldeststPaymentCkecked(false);
                        setIsPaymentSearchCkecked(false);
                        setIsFilterDivCkecked(false);
                      }}
                      className=" cursor-pointer font-semibold hover:text-[#FF451D]"
                    >
                      Ascending Price
                    </p>
                  </div>
                )}
                <img
                  onClick={() => setIsFilterDivCkecked(true)}
                  className="ml-5"
                  width="40"
                  height="40"
                  src="https://img.icons8.com/external-creatype-glyph-colourcreatype/64/FD7E14/external-descending-miscellaneous-user-interface-v1-creatype-glyph-colourcreatype-2.png"
                  alt="external-descending-miscellaneous-user-interface-v1-creatype-glyph-colourcreatype-2"
                />
              </div>
              <span
                onClick={() => setAllDeleteConfirmMessage(true)}
                className=" cursor-pointer h-full bg-transparent border-2 border-[#FE7804] rounded-lg flex items-center px-8 text-[#FE7804] font-semibold"
              >
                Clear All
              </span>
            </div>
          </div>

          <br />
          {isPaymentSearchCkecked && (
            <div className="w-full mt-8 mb-14">
              {searchedPayments.length > 0 ? (
                <div>
                  {searchedPayments.map((item) => (
                    <Payment_history_card
                      id={item._id}
                      reason={item.description}
                      amount={item.officialprice}
                      date={item.date}
                      crystaldiscount={item.crystaldiscount}
                      discount={item.discount}
                      paidamount={item.paidamount}
                      name={userData ? `${userData.firstname} ${userData.lastname}` : ''}
                    />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center w-full p-7 mb-9">
                  <video autoPlay loop className="w-[200px] h-auto">
                    <source src={SearchError} type="video/webm" />
                    Your browser does not support the video tag.
                  </video>
                  <p className=" text-[#ffffffa0] text-[18px]">
                    No results found
                  </p>
                </div>
              )}
            </div>
          )}

          {isNewastPaymentCkecked && (
            <div className="w-full mt-8 mb-14">
              {sortedPaymentsDateDesc.map((item) => {
                return (
                  <Payment_history_card
                    id={item._id}
                    reason={item.description}
                    amount={item.officialprice}
                    date={item.date}
                    crystaldiscount={item.crystaldiscount}
                    discount={item.discount}
                    paidamount={item.paidamount}
                    name={pusername}
                  />
                );
              })}
            </div>
          )}

          {isOldeststPaymentCkecked && (
            <div className="w-full mt-8 mb-14">
              {sortedPaymentsDateAsc.map((item) => {
                return (
                  <Payment_history_card
                    id={item._id}
                    reason={item.description}
                    amount={item.officialprice}
                    date={item.date}
                    crystaldiscount={item.crystaldiscount}
                    discount={item.discount}
                    paidamount={item.paidamount}
                  />
                );
              })}
            </div>
          )}

          {isLargAmountCkecked && (
            <div className="w-full mt-8 mb-14">
              {sortedPaymentsAmountDesc.map((item) => {
                return (
                  <Payment_history_card
                    id={item._id}
                    reason={item.description}
                    amount={item.officialprice}
                    date={item.date}
                    crystaldiscount={item.crystaldiscount}
                    discount={item.discount}
                    paidamount={item.paidamount}
                  />
                );
              })}
            </div>
          )}

          {isLowestAmountCkecked && (
            <div className="w-full mt-8 mb-14">
              {sortedPaymentsAmountAsc.map((item) => {
                return (
                  <Payment_history_card
                    id={item._id}
                    reason={item.description}
                    amount={item.officialprice}
                    date={item.date}
                    crystaldiscount={item.crystaldiscount}
                    discount={item.discount}
                    paidamount={item.paidamount}
                  />
                );
              })}
            </div>
          )}

          {AllDeleteConfirmMessage && (
            <div className="fixed top-0 left-0 z-50 flex items-center justify-center w-full h-screen bg-black bg-opacity-80">
              <div className=" flex flex-col justify-center items-center w-[28%] border-2 border-[#FE7804] border-opacity-50 rounded-lg bg-[#1B1E20]">
                <div className="mt-6">
                  <video autoPlay loop className="w-[150px] h-auto">
                    <source src={DeleteWorning} type="video/webm" />
                    Your browser does not support the video tag.
                  </video>
                </div>
                <h1 className=" text-[#FE7804] text-[32px] font-bold">
                  Warning!
                </h1>
                <p className=" mt-5 text-center text-[#b6b6b6] text-base">
                  Once you delete record, thre's no getting it back.
                  <br />
                  Make suer you want to do this.
                </p>
                <div className="flex justify-end w-full px-8 mt-12 mb-5 ">
                  <button
                    onClick={() => setAllDeleteConfirmMessage(false)}
                    className=" bg-transparent border-2 border-[#FE7804] text-[#FE7804] hover:bg-[#FE7804] hover:text-white rounded-lg py-2 px-5 mr-4 font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={(e) => {
                      handleAllPaymentHistoryDelete(memberID);
                      setAllDeleteConfirmMessage(false);
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
      )}

      {/* ######################### Downloads ########################   */}
      {selectedDiv === "Downloads" && (
        <div className="w-11/12 mx-auto mt-5">
          <h1 className="mb-6 text-2xl font-bold text-white">My Games</h1>
          <div className="flex mb-8">
            <div className=" w-1/2 p-[2px] bg-gradient-to-l from-[#FE7804] to-[#FF451D] rounded-lg">
              <input
                onKeyUp={handleMyDownloadSearch}
                id="myDownloadGameSearch"
                className=" bg-[#2A2B2F] text-[#FE7804] rounded-lg w-full  px-3 py-2 placeholder-[#FE7804]"
                type="search"
                placeholder="Search Games"
              />
            </div>
            <div className="px-3">
              <span className="h-full bg-gradient-to-r from-[#FE7804] to-[#FF451D] rounded-lg flex items-center px-8 text-white font-semibold">
                Search
              </span>
            </div>
          </div>

          {myGameSearchDivCheck && (
            <div>
              {myGameSearchResult.length > 0 ? (
                <div>
                  {myGameSearchResult.map((item) => {
                    return (
                      <Game_download_card id={item._id} gameid={item._id} />
                    );
                  })}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center w-full p-7 mb-9">
                  <video autoPlay loop className="w-[200px] h-auto">
                    <source src={SearchError} type="video/webm" />
                    Your browser does not support the video tag.
                  </video>
                  <p className=" text-[#ffffffa0] text-[18px]">
                    No results found
                  </p>
                </div>
              )}
            </div>
          )}

          {!myGameSearchDivCheck && (
            <div>
              {downloads.map((item) => {
                return (
                  <Game_download_card id={item._id} gameid={item.gameid} />
                );
              })}
            </div>
          )}
        </div>
      )}

     {/* ######################### Reviews ########################   */}
     {selectedDiv === "Reviews" && (
        <div className="w-11/12 mx-auto mt-3">
          <h1 className="mb-6 text-2xl font-bold text-white">Reviews</h1>
          <div className="flex flex-col space-y-4">
            {feedbacks.length > 0 ? (
              feedbacks.map(feedback => (
                <div key={feedback._id} className="p-4 bg-[#2A2B2F] text-white rounded-lg">
                  <p>{feedback.feedback}</p>
                </div>
              ))
            ) : (
              <p className="text-white">No feedbacks found.</p>
            )}
          </div>
        </div>
      )}

      {/* ######################### Events ########################   */}
      {selectedDiv === "Events" && (
        <div className="w-11/12 px-5 mx-auto mt-3">

          <ViewBattle />

        </div>
      )}

      {/* ######################### Settings dasun ########################   */}
      {selectedDiv === 'Settings' && (
        <div className="w-11/12 mx-auto mt-3">
          <div className="p-8 font-sans text-white">
            <div className="max-w-4xl mx-auto">
                <h1 className="mb-6 text-2xl font-bold">My Profile</h1>
                
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-[48%]">
                            <label htmlFor="firstName" className="block text-sm font-medium">First Name</label>
                            <input onChange={(e)=> setFirstName(e.target.value)} type="text" id="firstName" value={firstName == '' ? userData?.firstname : firstName} className={inputClasses} />
                        </div>
                        <div className="w-[48%]">
                            <label htmlFor="lastName" className="block text-sm font-medium">Last Name</label>
                            <input onChange={(e)=> setLastName(e.target.value)} type="text" id="lastName" value={lastName == '' ? userData?.lastname : lastName} className={inputClasses} />
                        </div>
                    </div>
                    <div className="mb-6">
                        <label htmlFor="email" className="block text-sm font-medium">Email</label>
                        <input readOnly type="email" id="email" defaultValue={data ? data?.user.email : ''} className={inputClasses} />
                    </div>
                    <div className="mb-6">
                        <label htmlFor="dateOfBirth" className="block text-sm font-medium">Date of Birth</label>
                        <input onChange={(e)=> setDateOfBirth(e.target.value)} type="date" id="dateOfBirth" value={dateOfBirth == '' ? userData?.dob : dateOfBirth} className={inputClasses} max={getCurrentDate()}/>
                    </div>
                    <button onClick={onClickUpdateDetails} className={`mt-4 bg-red-600 hover:bg-red-700 ${buttonClasses}`}>Update Details</button>
                </div>

                <hr/><br/>

                <div className="mb-8">
                    <h2 className="mb-4 text-xl font-semibold">Change Password</h2>
                    <div className="flex items-center justify-between">
                        <div className="w-full mr-4">
                            <label htmlFor="newPassword" className="block text-sm font-medium">Create Password</label>
                            <input type="password" id="newPassword" className={inputClasses}/>
                        </div>
                        <div className="w-full ml-4">
                            <label htmlFor="confirmPassword" className="block text-sm font-medium">Re-Enter Password</label>
                            <input type="password" id="confirmPassword" className={inputClasses}/>
                        </div>
                    </div>
                    <button onClick={onClickChangePass} className={`mt-8 bg-red-600 hover:bg-red-700 ${buttonClasses}`}>Change Password</button>
                </div>

                <hr/><br/>
                  <h2 className="mb-4 text-xl font-semibold">Change profile picture</h2>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className='p-2 text-white border border-orange-600'
                    ref={imageInputRef}
                  />
                  <button onClick={handleUpload} className='px-4 py-2 ml-10 font-bold text-white bg-green-600 rounded-lg hover:bg-green-700'>Upload Image</button>
                  <br/><br/>
                <hr/><br/>

                <button onClick={onClickLogout} className={`bg-red-600 hover:bg-red-700 ${buttonClasses}`}>Log Out</button>
                <button onClick={onClickDelete} className={`bg-red-600 hover:bg-red-700 ml-10 text-white font-bold py-2 px-4 rounded-lg`}>Delete Account</button>
            </div>
          </div>
        </div>
      )}

      {/* ######################### All Users ########################   */}
      {selectedDiv === 'AllUsers' && (
      <div className="w-11/12 mx-auto mt-5">
      <h1 className="mb-6 text-2xl font-bold text-white">All Users</h1>
      <div className="flex items-center gap-4 mb-8">
  <button onClick={generatePDF} className="float-right bg-gradient-to-tr from-[#FF451D] to-[#FE7804] px-4 py-2 text-[18px] font-semibold rounded-lg text-white">
    Generate PDF
  </button>

  <input
    type="text"
    className="bg-[#262628] text-[#FE7804] flex-grow px-4 py-2 rounded-lg placeholder-[#FE7804] h-10"
    placeholder="Search..."
    onChange={handleSearchChange}
  />

<select onChange={handleFieldChange} onFocus={(e) => e.target.style.backgroundColor = '#ff7f50'} // Change to your desired color on focus
  onBlur={(e) => e.target.style.backgroundColor = '#FF451D'}  // Reset to default color on blur
  style={{
    padding: '8px 16px', 
    borderRadius: '12px',
    backgroundImage: 'linear-gradient(to top right, #FF451D, #FE7804)',
    height: '40px', 
    color: 'white',
    borderColor: '#ddd' // Default border color, change as needed
  }} className="px-4 py-2 rounded-lg bg-gradient-to-tr from-[#FF451D] to-[#FE7804] h-10 text-white">
    <option value="username">Username</option>
    <option value="email">Email</option>
    <option value="firstname">First Name</option>
    <option value="lastname">Last Name</option>
    <option value="dob">DOB</option>
    <option value="accountType">Role</option>
  </select>
</div>

      
      <div id="pdf-table" className="overflow-x-auto">
        <table className="w-full border border-collapse border-gray-800 table-auto">
          <thead>
            <tr>
              <th className="border px-4 py-2 border-[#1F2937] bg-gradient-to-tr from-[#FF451D] to-[#FE7804] text-white">Username</th>
              <th className="border px-4 py-2 border-[#1F2937] bg-gradient-to-tr from-[#FF451D] to-[#FE7804] text-white">Email</th>
              <th className="border px-4 py-2 border-[#1F2937] bg-gradient-to-tr from-[#FF451D] to-[#FE7804] text-white">First Name</th>
              <th className="border px-4 py-2 border-[#1F2937] bg-gradient-to-tr from-[#FF451D] to-[#FE7804] text-white">Last Name</th>
              <th className="border px-4 py-2 border-[#1F2937] bg-gradient-to-tr from-[#FF451D] to-[#FE7804] text-white">DOB</th>
              <th className="border px-4 py-2 border-[#1F2937] bg-gradient-to-tr from-[#FF451D] to-[#FE7804] text-white">Role</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((user) => (
              <tr key={user._id}>
                <td className="border px-4 py-2 bg-[#262628] text-white border-[#1F2937]">{user.username}</td>
                <td className="border px-4 py-2 bg-[#262628] text-white border-[#1F2937]">{user.email}</td>
                <td className="border px-4 py-2 bg-[#262628] text-white border-[#1F2937]">{user.firstname}</td>
                <td className="border px-4 py-2 bg-[#262628] text-white border-[#1F2937]">{user.lastname}</td>
                <td className="border px-4 py-2 bg-[#262628] text-white border-[#1F2937]">{user.dob}</td>
                <td className="border px-4 py-2 bg-[#262628] text-white border-[#1F2937]">{user.accountType}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
      )}

      <div className="mt-10 ">
        <Footer />
      </div>

      {loading && (
        <div className="fixed top-0 left-0 z-50 flex items-center justify-center w-full h-screen bg-black bg-opacity-50 ">
          <HashLoader size="75" color="#FE7804" />
        </div>
      )}

      {deleteSuccessMessagechecked && (
        <SuccessPopup
          type="Delete"
          item="Community post"
          onClose={handleDeleteCloseSuccessPopup}
        />
      )}
    </div>
  );
}
