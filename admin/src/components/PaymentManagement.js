import React, { useState, useEffect } from "react";
import Chart from "chart.js/auto";
import axios from "axios";
import { Tooltip, Title, ArcElement, LineElement, Legend } from "chart.js";
import { Doughnut, Pie, Line } from "react-chartjs-2";
Chart.register(Tooltip, Title, ArcElement, LineElement, Legend);

export default function PaymentManagement() {
  const [allPaymentHistory, setAllPaymentsHistory] = useState([]);
  const [allPayments, setAllPayments] = useState([]);
  const [allUsers, setAllUserData] = useState([]);
  const [paymentTotalOfficialPrice, setPaymentTotalOfficialPrice] = useState(0);
  const [paymentTotalDiscount, setPaymentTotalDiscount] = useState(0);
  const [paymentTotalCrystalDiscount, setPaymentTotalCrystalDiscount] = useState(0);
  const [filter, setFilter] = useState("week");
  const [isFiltechecked, setIsFiltechecked] = useState(false);

  const actionGames = allPayments.filter((game) => game.type === "action");
  const adventureGames = allPayments.filter((game) => game.type === "adventure");
  const racingGames = allPayments.filter((game) => game.type === "racing");
  const shooterGames = allPayments.filter((game) => game.type === "shooter");
  const sportsGames = allPayments.filter((game) => game.type === "sports");
  const platinumPlans = allPayments.filter((game) => game.type === "Platinum Plan");
  const goldPlans = allPayments.filter((game) => game.type === "Gold Plan");
  const silverPlans = allPayments.filter((game) => game.type === "Silver Plan");

  //filter as week
  const filterCurrentWeekPayments = () => {
    const today = new Date(); 
    const firstDayOfWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay()); 
    const lastDayOfWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay() + 6); 

    const currentWeekPayments = allPaymentHistory.filter(payment => {
        const paymentDate = new Date(payment.date); 
        return paymentDate >= firstDayOfWeek && paymentDate <= lastDayOfWeek;
    });

    return currentWeekPayments;
  };

  //filter as month
  const filterCurrentMonthPayments = () => {
    const today = new Date(); 
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0); 

    const currentMonthPayments = allPaymentHistory.filter(payment => {
        const paymentDate = new Date(payment.date);
        return paymentDate >= firstDayOfMonth && paymentDate <= lastDayOfMonth;
    });

    return currentMonthPayments;
  };

  //filter as year
  const filterCurrentYearPayments = () => {
    const today = new Date(); 
    const firstDayOfYear = new Date(today.getFullYear(), 0, 1); 
    const lastDayOfYear = new Date(today.getFullYear(), 11, 31); 

    const currentYearPayments = allPaymentHistory.filter(payment => {
        const paymentDate = new Date(payment.date); 
        return paymentDate >= firstDayOfYear && paymentDate <= lastDayOfYear;
    });

    return currentYearPayments;
  };

  //read payment details
  useEffect(() => {
    const fetchPaymentData = async () => {
    axios
      .get(`http://localhost:3001/api/adminAllPayment`)
      .then((result) => setAllPaymentsHistory(result.data))
      .catch((err) => console.log(err));
    }
    fetchPaymentData();
      const intervalId = setInterval(fetchPaymentData, 5000);
    return () => clearInterval(intervalId);
  }, []);

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

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const meridiem = hours >= 12 ? 'pm' : 'am';
    const formattedHours = hours % 12 || 12;
    return `${day}.${month}.${year} ${formattedHours}:${minutes}${meridiem}`;
  };

  useEffect(() => {
    const fetchData = async () => {

      if(filter === "week"){
        const currentWeekPayments = filterCurrentWeekPayments();
        setAllPayments(currentWeekPayments);
      }
      if(filter === "month"){
        const currentMonthPayments = filterCurrentMonthPayments();
        setAllPayments(currentMonthPayments);
      }
      if(filter === "year"){
        const currentYearPayments = filterCurrentYearPayments();
        setAllPayments(currentYearPayments);
      }

        const chartLabels = allPayments.map((item) => formatDate(item.date));
        const chartDataOfficialPrice = allPayments.map((item) => item.officialprice);
        const chartDataSesonalDiscount = allPayments.map((item) => item.discount);
        const chartDataCrystalDiscount = allPayments.map((item) => item.crystaldiscount);

        setLineChartData({
          labels: chartLabels,
          datasets: [
            {
              label: "Income",
              data: chartDataOfficialPrice,
              backgroundColor: "#FF451D60",
              fill: true,
            },
            {
              label: "Crystal discount",
              data: chartDataCrystalDiscount,
              backgroundColor: "#FE780475",
              fill: true,
            },
            {
              label: "Seasonal Discount",
              data: chartDataSesonalDiscount,
              backgroundColor: "#FFDECD75",
              fill: true,
            },
          ],
        });
     
    };
    fetchData();
    const intervalId = setInterval(fetchData, 5000);
    return () => clearInterval(intervalId);
  }, [allPayments]);

  useEffect(() => {
    const totalOfficialPrice = allPayments.reduce((total, payment) => total + (payment.officialprice || 0), 0);
    setPaymentTotalOfficialPrice(totalOfficialPrice);

    const totalDiscount = allPayments.reduce((total, payment) => total + (payment.discount || 0), 0);
    setPaymentTotalDiscount(totalDiscount);

    const totalCrystalDiscount = allPayments.reduce((total, payment) => total + (payment.crystaldiscount || 0), 0);
    setPaymentTotalCrystalDiscount(totalCrystalDiscount);

  }, [allPayments]);

  const gameData = {
    datasets: [
      {
        data: [
          actionGames.length,
          adventureGames.length,
          racingGames.length,
          shooterGames.length,
          sportsGames.length,
        ],
        backgroundColor: [
          "#7E0306",
          "#D63E0F",
          "#FA8743",
          "#FCAF67",
          "#FFDECD",
        ],
        borderWidth: 0,
      },
    ],

    labels: ["Action", "Adventure", "Racing", "Shooter", "Sport"],
  };

  const planeData = {
    datasets: [
      {
        data: [platinumPlans.length, goldPlans.length, silverPlans.length],
        backgroundColor: [
          "#7E0306",
          "#D63E0F",
          "#FA8743",
          "#FCAF67",
          "#FFDECD",
        ],
        borderWidth: 0,
      },
    ],

    labels: ["Platinum plane", "Gold Plane", "Silver plane"],
  };

  const [lineChartData, setLineChartData] = useState({
    labels: [0],
    datasets: [
      {
        label: "Income",
        data: [0],
        backgroundColor: "#FE780475",
        fill: true,
      },
    ],
  });

  const totalCrystal = allUsers.reduce((total, user) => {
    const crystalCount = parseFloat(user.crystalCount);
    if (!isNaN(crystalCount)) {
        return total + crystalCount;
    }
    return total;
}, 0);

  return (
    <div className="py-5 px-7 text-white ">
      <h1 className=" text-[25px] font-bold mb-3">Payment Management</h1>
      <div className="my-5 pr-6 flex justify-between">
        <div>
        <h1 className=" text-[20px] font-semibold text-[#FE7804]">Summary</h1>
        </div>
        <div className=" relative w-[10%]">
        <h1 onClick={() => setIsFiltechecked(true)} className=" float-right w-full cursor-pointer">This {filter}<img className=" inline-block ml-4" width="12" height="12" src="https://img.icons8.com/ios/50/FFFFFF/expand-arrow--v1.png" alt="expand-arrow--v1"/></h1>
        {isFiltechecked && (<div className=" absolute top-6 w-full bg-black bg-opacity-80 leading-8 text-white px-4 py-2 rounded-md">
        <span onClick={() => {setIsFiltechecked(false); setFilter("week");}} className=" hover:text-[#FE7804] cursor-pointer" >This week</span><br/>
        <span onClick={() => {setIsFiltechecked(false); setFilter("month");}} className="hover:text-[#FE7804] cursor-pointer " >This month</span><br/>
        <span onClick={() => {setIsFiltechecked(false); setFilter("year");}} className=" hover:text-[#FE7804] cursor-pointer" >This year</span><br/>
        </div>)}
        </div>
        {/* <select className=" float-right bg-transparent" onChange={(e) => setFilter(e.target.value)}>          
          <option value="week" className=" bg-transparent"><span className=" text-black" >This week</span></option>
          <option value="month" className=" bg-transparent"><span className=" text-black" >This month</span></option>
          <option value="year" className=" bg-transparent"><span className=" text-black" >This year</span></option>
        </select> */}

        
      </div>
      <div className=" w-full flex justify-between">
        <div className=" px-5 py-3 w-[23%] bg-[#ffffff] bg-opacity-10 rounded-md">
          <h1 className=" font-semibold text-[20px] mb-3 text-[#ffffffb2]">
            Income{" "}
          </h1>
          <div className=" my-7">
            <h1 className=" float-right text-[30px] font-bold">
              ${" "}
              {typeof paymentTotalOfficialPrice === "number"
                ? paymentTotalOfficialPrice.toFixed(2)
                : ""}
            </h1>
            <img
              width="45"
              height="45"
              src="https://img.icons8.com/external-yogi-aprelliyanto-basic-outline-yogi-aprelliyanto/64/FD7E14/external-income-advertising-yogi-aprelliyanto-basic-outline-yogi-aprelliyanto.png"
              alt="external-income-advertising-yogi-aprelliyanto-basic-outline-yogi-aprelliyanto"
            />
          </div>
        </div>
        <div className=" px-5 py-3 w-[23%] bg-[#ffffff] bg-opacity-10 rounded-md">
          <h1 className=" font-semibold text-[20px] mb-3 text-[#ffffffb2]">
            Seasonal Discounts
          </h1>
          <div className=" my-7">
            <h1 className=" float-right text-[30px] font-bold">
              ${" "}
              {typeof paymentTotalDiscount === "number"
                ? paymentTotalDiscount.toFixed(2)
                : ""}
            </h1>
            <img
              width="50"
              height="50"
              src="https://img.icons8.com/ios-filled/50/FD7E14/discount--v1.png"
              alt="discount--v1"
            />
          </div>
        </div>
        <div className=" px-5 py-3 w-[23%] bg-[#ffffff] bg-opacity-10 rounded-md">
          <h1 className=" font-semibold text-[20px] mb-3 text-[#ffffffb2]">
            Crystal Discounts
          </h1>
          <div className=" my-7">
            <h1 className=" float-right text-[30px] font-bold">
              ${" "}
              {typeof paymentTotalCrystalDiscount === "number"
                ? paymentTotalCrystalDiscount.toFixed(2)
                : ""}
            </h1>
            <img
              width="50"
              height="50"
              src="https://img.icons8.com/external-obvious-glyph-kerismaker/48/FD7E14/external-discount-online-shopping-glyph-obvious-glyph-kerismaker-2.png"
              alt="external-discount-online-shopping-glyph-obvious-glyph-kerismaker-2"
            />
          </div>
        </div>
        <div className=" px-5 py-3 w-[23%] bg-[#ffffff] bg-opacity-10 rounded-md">
          <h1 className=" font-semibold text-[20px] mb-3 text-[#ffffffb2]">
            Crystals in Platform
          </h1>
          <div className=" my-7 flex justify-between">
            <div>
              <img
                width="50"
                height="50"
                src="https://img.icons8.com/external-icongeek26-glyph-icongeek26/64/FD7E14/external-crystal-geography-icongeek26-glyph-icongeek26.png"
                alt="external-crystal-geography-icongeek26-glyph-icongeek26"
              />
            </div>
            <div className=" text-right">
              <h1 className=" text-[30px] font-bold">{totalCrystal}</h1>
              <span className=" text-[15px] font-semibold text-[#ffffff76]">
              ${" "}
              {typeof totalCrystal === "number"
                ? (totalCrystal/1000).toFixed(2)
                : ""}
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className=" w-full flex justify-between mt-8">
        <div className=" w-[48%] bg-[#000000] bg-opacity-30 rounded-md px-5 py-3">
          <h1 className=" text-[23px] font-semibold text-[#ffffffb2]">
          Summary of Game Purchases
          </h1>
          <div className=" w-[60%] mx-auto mt-5">
            <Doughnut data={gameData} />
          </div>
        </div>
        <div className=" w-[48%] bg-[#000000] bg-opacity-30 rounded-md px-5 py-3">
          <h1 className=" text-[23px] font-semibold text-[#ffffffb2]">
          Summary of Premium Plan Purchases
          </h1>
          <div className=" w-[60%] mx-auto mt-5">
            <Pie data={planeData} />
          </div>
        </div>
      </div>

      <div className=" mt-8 px-5 py-3 w-full bg-[#000000] bg-opacity-30 rounded-lg">
        <h1 className=" text-[23px] font-semibold text-[#ffffffb2]">
        Comparison of Revenue and Discounts
        </h1>

        <Line data={lineChartData} />
      </div>
    </div>
  );
}
