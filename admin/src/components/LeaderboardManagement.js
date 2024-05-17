import React, { useState, useEffect } from "react";
import Leaderboard_rank_card from "./Leaderboard_rank_card";
import axios from "axios";
import SearchError from "../assets/animations/searchnotfound.webm";
import SuccessPopup from "./SuccessPopup";

export default function LeaderboardManagement() {
  const pageid = "Aleaderboard";
  const [isFilterBtnChecked, setIsFilterBtnChecked] = useState(false);
  const [leaderboardDetails, setLeaderboardDetails] = useState([]);
  const [ascendingOrderbox, setascendingOrderbox] = useState(true);
  const [descendingOrderbox, setdescendingOrderbox] = useState(false);
  const [endDate, setEndDate] = useState([]);
  const [newEndDate, setNewEndDate] = useState([]);
  const [btn, setBtn] = useState(false);
  const [isearch, setsearch] = useState(false);
  const [differenceInDays, setdifferenceInDays] = useState(0);
  const [searchResultArr, setSearchResultArr] = useState([]);
  const [createSuccessMessagechecked, setCreateSuccessMessagechecked] = useState(false);

  const end = '66280fe4c73c5e6363e0ba46';

  useEffect(() => {
    axios
      .get(`http://localhost:3001/api/readSeason/${end}`)
      .then((result) => {
        setEndDate(result.data);
      })
      .catch((err) => console.log(err));
  }, [end]);

  useEffect(() => {
    const futureDate = new Date(endDate.endDate);
    const currentDate = new Date();
  
    const differenceInMs = futureDate - currentDate;
    const differenceInDays = Math.ceil(differenceInMs / (1000 * 60 * 60 * 24)); // Use Math.ceil to ensure non-negative result
    setdifferenceInDays(Math.max(differenceInDays, 0)); // Ensure non-negative result
    if (differenceInDays <= 0) {
      // If the future date is past or equal to the current date, set btn to true
      setBtn(true);
    } else {
      // If the future date is ahead of the current date, set btn to false
      setBtn(false);
    }
  
    // Use differenceInDays here if needed
}, [endDate.endDate]);


const Updatedate = (e) => {
  e.preventDefault();
  axios.put("http://localhost:3001/updateEndDate/"+end, { newEndDate })
  .then(result => {
      console.log(result);
      window.location.reload()
  })
  .catch(err => console.log(err));
}
    
 

  const filterBtnHandler = () => {
    setIsFilterBtnChecked(!isFilterBtnChecked);
  };

  useEffect(() => {
    axios
      .get(`http://localhost:3001/${pageid}`)
      .then((result) => {
        setLeaderboardDetails(result.data);
      })
      .catch((err) => console.log(err));
  }, [pageid]);

  const clearLeaderbord = () => {
    axios
    .delete("http://localhost:3001/deleteAllLeaderboardRecords/")
    .then((res) => console.log(res))
    .catch((errr) => console.log(errr));
    setCreateSuccessMessagechecked(true);
  }

  const ascendingOrder = leaderboardDetails.slice().sort((a, b) => a.viewcount - b.viewcount);
  const descendingOrder = leaderboardDetails.slice().sort((a, b) => b.viewcount - a.viewcount);
  
  
  const search = () => {
    setsearch(true);
    const input = document.getElementById("Searchbar").value;
    const result = leaderboardDetails.filter((item) => item.channelname && item.channelname.toLowerCase().includes(input.toLowerCase()));
    setSearchResultArr(result);
  }

  const handleCreateCloseSuccessPopup = () => {
    setCreateSuccessMessagechecked(false);
    window.location.reload();
  };

  
  

  return (
    <div className="py-5 px-7 text-white ">
      
      {/* <input type="date" onChange={(e)=> setEndDate(e.target.value)} /><span onClick={create}>sgsgdkahdkhskdj</span>       */}
      
      <h1 className=" text-[25px] font-bold mb-3">Leaderboard Management<span className=" float-right font-normal text-[16px]">Season ends in: {differenceInDays} Days</span></h1>
      <div className=" float-right flex justify-end ">
      <input className=" mr-4 bg-transparent" type="date" value={endDate.endDate} onChange={(e) => setNewEndDate(e.target.value)} min={new Date().toISOString().split("T")[0]} />
      <button className=" mr-4 rounded-lg border-2 border-[#FE7804] px-4 py-2 text-[#FE7804]" onClick={Updatedate}>Update Date</button>
      {!btn && (
      <button className=" bg-transparent text-[#b6b0b0] bg-[#514f4e] border-2 border-[#a19d9d] px-4 py-2 text-[18px] font-semibold rounded-lg">
      Clear Leaderboard
    </button>
    )} 
    {btn && (
      <button onClick={clearLeaderbord} className=" bg-transparent text-[#FE7804] hover:text-white hover:bg-[#FE7804] border-2 border-[#FE7804] px-4 py-2 text-[18px] font-semibold rounded-lg" disabled>
        Clear Leaderboard
      </button>
    )}</div>
      
      <div className="flex justify-start">
        <div className=" w-1/2 p-[2px] bg-gradient-to-l from-[#FE7804] to-[#FF451D] rounded-2xl">
          <input
            id="Searchbar"
            className=" bg-[#262628] text-[#FE7804] rounded-2xl w-full  px-3 py-2 placeholder-[#FE7804]"
            type="search"
            onKeyUp={search}
            placeholder="Search Channel...."
          />
        </div>
        <button className=" bg-gradient-to-tr from-[#FF451D] to-[#FE7804] px-4 py-2 text-[18px] font-semibold rounded-lg ml-3">
          Search
        </button>
        <div className=" relative ml-3">
          <button
            onClick={filterBtnHandler}
            className=" bg-gradient-to-tr from-[#FF451D] to-[#FE7804] h-full px-2 text-[18px] font-semibold rounded-lg "
          >
            <img
              width="30"
              height="30"
              src="https://img.icons8.com/pulsar-line/48/FFFFFF/vertical-settings-mixer.png"
              alt="vertical-settings-mixer"
            />
          </button>
          {isFilterBtnChecked && (
            <div className=" absolute z-10 bg-black bg-opacity-85 pl-5 pr-10 py-3 leading-7">
              <pre onClick={() => {setdescendingOrderbox(false); setascendingOrderbox(true); setIsFilterBtnChecked(false); setsearch(false);}}   className=" hover:text-[#FE7804] cursor-pointer">Lowest View Count</pre>
              <pre onClick={() => {setdescendingOrderbox(true); setascendingOrderbox(false); setIsFilterBtnChecked(false); setsearch(false);}}   className=" hover:text-[#FE7804] cursor-pointer">Most View Count</pre>
            </div>
          )}
        </div>
      </div>

      <div className=" mx-auto bg-gradient-to-b from-[#FE7804] to-[#FF451D] text-[#D9D9D9] text-[20px] font-semibold py-2 px-7 flex justify-between w-full mt-8">
        <div className="w-[15%]">Rank</div>
        <div className="w-[65%]">Streamer</div>
        <div className="w-[15%]">Total Views</div>
        <div className="w-[15%]">Subscribers</div>
      </div>

      {!isearch && (<div>
      {descendingOrderbox && (
  <div>
    {descendingOrder.map((item, index) => (
      <Leaderboard_rank_card
        key={index}
        rank={index + 1}
        streamer={item.channelname}
        views={item.viewcount}
        subscribers={item.subscribercount}
      />
    ))}
  </div>
)}

{ascendingOrderbox && (
  <div>
    {ascendingOrder.map((item, index) => (
      <Leaderboard_rank_card
        key={index}
        rank={index + 1}
        streamer={item.channelname}
        views={item.viewcount}
        subscribers={item.subscribercount}
      />
    ))}
  </div>
)}
</div>)}
{isearch && (<div>
  {searchResultArr.length > 0 ? (<div>
    {searchResultArr.map((item, index) => (
            <Leaderboard_rank_card
            key={index}
            rank={index + 1}
            streamer={item.channelname}
            views={item.viewcount}
            subscribers={item.subscribercount}
          />
        ))}
  </div>):(<div className=" w-full p-7 flex flex-col justify-center items-center mb-9">
        <video autoPlay loop className="w-[200px] h-auto">
          <source src={SearchError} type="video/webm" />
          Your browser does not support the video tag.
        </video>
        <p className=" text-[#ffffffa0] text-[18px]">
          No results found
        </p>
      </div>)}




</div>)}
{createSuccessMessagechecked && (
  <SuccessPopup  type="Delete" item="leaderboard" onClose={handleCreateCloseSuccessPopup} /> 
)}

    </div>
  );
}
