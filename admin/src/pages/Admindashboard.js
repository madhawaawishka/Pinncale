import React, { useState } from "react";
import GameManagement from "../components/GameManagement";
import StreamManagement from "../components/StreamManagement";
import MembershipManagement from "../components/MembershipManagement";
import CartManagement from "../components/CartManagement";
import PaymentManagement from "../components/PaymentManagement";
import CommunityManagement from "../components/CommunityManagement";
import FeedbackManagement from "../components/FeedbackManagement";
import LeaderboardManagement from "../components/LeaderboardManagement";
import "./styles/extarnal.css";
import Pinnaclelogo from "../assets/pinnaclelogo.png";

export default function Admindashboard() {
  const [isCheckedAdminWelcom, setIsCheckedAdminWelcom] = useState(true);
  const [isCheckedMembershipManagement, setIsCheckedMembershipManagement] = useState(false);
  const [isCheckedStreamManagement, setIsCheckedStreamManagement] = useState(false);
  const [isCheckedGameManagement, setIsCheckedGameManagement] = useState(false);
  const [isCheckedCartManagement, setIsCheckedCartManagement] = useState(false);
  const [isCheckedPaymentManagement, setIsCheckedPaymentManagement] = useState(false);
  const [isCheckedCommunityManagement, setIsCheckedCommunityManagement] = useState(false);
  const [isCheckedFeedbackManagement, setIsCheckedFeedbackManagement] = useState(false);
  const [isCheckedLeaderboardManagement, setIsCheckedLeaderboardManagement] = useState(false);

  const membershipManagementHandler = () => {
    setIsCheckedMembershipManagement(true);
    setIsCheckedStreamManagement(false);
    setIsCheckedGameManagement(false);
    setIsCheckedCartManagement(false);
    setIsCheckedPaymentManagement(false);
    setIsCheckedCommunityManagement(false);
    setIsCheckedFeedbackManagement(false);
    setIsCheckedLeaderboardManagement(false);
  };

  const streamManagementHandler = () => {
    setIsCheckedMembershipManagement(false);
    setIsCheckedStreamManagement(true);
    setIsCheckedGameManagement(false);
    setIsCheckedCartManagement(false);
    setIsCheckedPaymentManagement(false);
    setIsCheckedCommunityManagement(false);
    setIsCheckedFeedbackManagement(false);
    setIsCheckedLeaderboardManagement(false);
  };

  const gameManagementHandler = () => {
    setIsCheckedMembershipManagement(false);
    setIsCheckedStreamManagement(false);
    setIsCheckedGameManagement(true);
    setIsCheckedCartManagement(false);
    setIsCheckedPaymentManagement(false);
    setIsCheckedCommunityManagement(false);
    setIsCheckedFeedbackManagement(false);
    setIsCheckedLeaderboardManagement(false);
  };

  const cartManagementHandler = () => {
    setIsCheckedMembershipManagement(false);
    setIsCheckedStreamManagement(false);
    setIsCheckedGameManagement(false);
    setIsCheckedCartManagement(true);
    setIsCheckedPaymentManagement(false);
    setIsCheckedCommunityManagement(false);
    setIsCheckedFeedbackManagement(false);
    setIsCheckedLeaderboardManagement(false);
  };

  const paymentManagementHandler = () => {
    setIsCheckedMembershipManagement(false);
    setIsCheckedStreamManagement(false);
    setIsCheckedGameManagement(false);
    setIsCheckedCartManagement(false);
    setIsCheckedPaymentManagement(true);
    setIsCheckedCommunityManagement(false);
    setIsCheckedFeedbackManagement(false);
    setIsCheckedLeaderboardManagement(false);
  };

  const communityManagementHandler = () => {
    setIsCheckedMembershipManagement(false);
    setIsCheckedStreamManagement(false);
    setIsCheckedGameManagement(false);
    setIsCheckedCartManagement(false);
    setIsCheckedPaymentManagement(false);
    setIsCheckedCommunityManagement(true);
    setIsCheckedFeedbackManagement(false);
    setIsCheckedLeaderboardManagement(false);
  };

  const feedbackManagementHandler = () => {
    setIsCheckedMembershipManagement(false);
    setIsCheckedStreamManagement(false);
    setIsCheckedGameManagement(false);
    setIsCheckedCartManagement(false);
    setIsCheckedPaymentManagement(false);
    setIsCheckedCommunityManagement(false);
    setIsCheckedFeedbackManagement(true);
    setIsCheckedLeaderboardManagement(false);
  };

  const leaderboardManagementHandler = () => {
    setIsCheckedMembershipManagement(false);
    setIsCheckedStreamManagement(false);
    setIsCheckedGameManagement(false);
    setIsCheckedCartManagement(false);
    setIsCheckedPaymentManagement(false);
    setIsCheckedCommunityManagement(false);
    setIsCheckedFeedbackManagement(false);
    setIsCheckedLeaderboardManagement(true);
  };

  return (
    <div>
      {isCheckedAdminWelcom && (
        // <div className=" flex bg-gradient-to-tr from-[#FF451D] to-[#FE7804] absolute top-0 left-0 h-screen w-full items-center justify-center">
        <div className=" z-50 flex bg-gradient-to-tr from-[#000000] to-[#2A2B2F] absolute top-0 left-0 h-screen w-full items-center justify-center">
          <div className="text-center">
            <h1 className="text-white font-bold">
              <h1 className="text-white font-bold">
                <span className="text-[65px] bg-gradient-to-tr from-[#FF451D] to-[#FE7804] bg-clip-text text-transparent">
                  WELCOME TO PINNACLE
                </span>{" "}
                <br />
                <span className="text-[53px] bg-gradient-to-tr from-[#6a6966] to-[#E8E8E7] bg-clip-text text-transparent">
                  ADMIN DASHBOARD
                </span>
              </h1>
            </h1>
            <div className=" my-7 w-[28%] mx-auto">
              <div className="bg-[#FF451D] px-4 py-4 text-[#FF451D] text-[18px] font-semibold bg-opacity-20 text-opacity-0 mr-7 text-transparent bgdivbtn">
                Get Start
              </div>
              <div
                onClick={() => setIsCheckedAdminWelcom(false)}
                className="bg-[#FF451D] px-4 py-4 text-white text-[18px] font-semibold ml-7 mt-[-35px] superbtn cursor-pointer"
              >
                Get Start
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-between text-white">
        <div className=" w-1/5 py-4 px-3 bg-[#000000] fixed top-0" >
          <img src={Pinnaclelogo} className="w-[45px] h-[45px] inline-block " />
          <span className="text-[23px] font-bold">PINNACLE ADMIN</span>
          <div className=" mt-9 pl-5 h-screen text-[18px] font-semibold" >
            {/* <p onClick={membershipManagementHandler} className=" cursor-pointer py-3 hover:text-[#FF451D] hover:pl-1">Membership Management</p> */}
            <p onClick={streamManagementHandler} className=" cursor-pointer py-3 hover:text-[#FF451D] hover:pl-1">Stream Management</p>
            <p onClick={gameManagementHandler} className=" cursor-pointer py-3 hover:text-[#FF451D] hover:pl-1">Game Management</p>
            <p onClick={cartManagementHandler} className=" cursor-pointer py-3 hover:text-[#FF451D] hover:pl-1">Cart Management</p>
            <p onClick={paymentManagementHandler} className=" cursor-pointer py-3 hover:text-[#FF451D] hover:pl-1">Payment Management</p>
            <p onClick={communityManagementHandler} className=" cursor-pointer py-3 hover:text-[#FF451D] hover:pl-1">Community Management</p>
            <p onClick={feedbackManagementHandler} className=" cursor-pointer py-3 hover:text-[#FF451D] hover:pl-1">Feedback Management</p>
            <p onClick={leaderboardManagementHandler} className=" cursor-pointer py-3 hover:text-[#FF451D] hover:pl-1">Leaderboard Management</p>
          </div>
        </div>

        <div className=" w-4/5 ml-[20%]">
          {/* {isCheckedMembershipManagement && <MembershipManagement />} */}
          {isCheckedStreamManagement && <StreamManagement />}
          {isCheckedGameManagement && <GameManagement />}
          {isCheckedCartManagement && <CartManagement />}
          {isCheckedPaymentManagement && <PaymentManagement />}
          {isCheckedCommunityManagement && <CommunityManagement />}
          {isCheckedFeedbackManagement && <FeedbackManagement />}
          {isCheckedLeaderboardManagement && <LeaderboardManagement />}
        </div>
      </div>

    </div>
  );
}
