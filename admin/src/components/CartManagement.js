import React, { useState, useEffect } from "react";
import axios from "axios";
import { Bar,Pie,Line } from "react-chartjs-2";
import { saveAs } from "file-saver";

export default function CartManagement() {
  var pageid = "cart";

  const [cartDetails, setCartDetails] = useState([]);
  const [genreCounts, setGenreCounts] = useState([]);

  useEffect(() => {
    axios
      .get(`http://localhost:3001/${pageid}`)
      .then((result) => {
        setCartDetails(result.data);
        // Calculate genre counts
        const counts = {};
        result.data.forEach((item) => {
          counts[item.ganre] = (counts[item.ganre] || 0) + 1;
        });
        setGenreCounts(counts);
      })
      .catch((err) => console.log(err));
  }, [pageid]);

  const GanreData = {
    datasets: [
      {
        data: [
          genreCounts["action"],
          genreCounts["adventure"],
          genreCounts["racing"],
          genreCounts["shooter"],
          genreCounts["sports"],
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

    labels: ["Action", "Adventure", "Racing", "Shooter", "Sports"],
  };
  const action = genreCounts["action"];
  const adventure = genreCounts["adventure"];
  const racing = genreCounts["racing"];
  const shooter = genreCounts["shooter"];
  const sports = genreCounts["sports"];

  //pdf
  const createAndDownloadPdf = () => {
    axios
      .post("http://localhost:3001/api/create-pdf/CartSummarySheet", {
        action,
        adventure,
        racing,
        shooter,
        sports,
      })
      .then(() =>
        axios.get("http://localhost:3001/api/fetch-pdf", {
          responseType: "blob",
        })
      )
      .then((res) => {
        const pdfBlob = new Blob([res.data], { type: "application/pdf" });
        saveAs(pdfBlob, "CartSummarySheet.pdf");
      })
      .catch((error) =>
        console.error("Error occurred while creating or fetching PDF:", error)
      );
  };

  return (
    <div className="py-5 px-7 text-white ">
      <h1 className=" text-[25px] font-bold mb-3">Cart Management</h1>

      <div className="flex justify-between ">
        <div>
          <h1 className=" text-[20px] font-semibold text-[#FE7804]">Summary</h1>
        </div>
        <div
          onClick={createAndDownloadPdf}
          className=" cursor-pointer  bottom-4 right-4 border-2 border-[#FD7E14] py-1 px-4 rounded-md"
        >
          <img
            className=" inline-block"
            width="23"
            height="23"
            src="https://img.icons8.com/ios-filled/50/FD7E14/pdf--v1.png"
            alt="pdf--v1"
          />
          <span className=" text-[#FD7E14] ml-2">Download Summary Sheet</span>
        </div>
      </div>
      <div className="flex mt-4 mx-2 w-[100%]">
        <div className=" w-[70%] h-[500px] bg-[#000000] bg-opacity-30 rounded-md px-5 py-3 m-1">
          <h1 className=" text-[23px] font-semibold text-[#ffffffb2]">
            Summary of Game Interests of Users According to their Carts.
          </h1>
          <div className=" w-[50%] h-[100%] mx-auto mt-5">
            <Pie data={GanreData} />
          </div>
        </div>
        <div className=" w-[30%] h-auto m-1 p-3 align-middle bg-[#000000] bg-opacity-30 rounded-md">
          <div>
            <h1 className=" text-[20px] font-semibold text-[#FE7804] p-2">
              Ganres and Number of Users with interest
            </h1>
          </div>
          <div className="mx-1 my-2">
            <div className="bg-[#000000] bg-opacity-30 rounded-md p-3 my-2">
              <h2>
                {" "}
                <span className="inline-block mr-2">&#10148;</span>Action Count:{" "}
                {genreCounts["action"] || 0} Users
              </h2>
            </div>
            <div className="bg-[#000000] bg-opacity-30 rounded-md p-3 my-2">
              <h2>
                {" "}
                <span className="inline-block mr-2">&#10148;</span>Adventure
                Count: {genreCounts["adventure"] || 0} Users
              </h2>
            </div>
            <div className="bg-[#000000] bg-opacity-30 rounded-md p-3 my-2">
              <h2>
                {" "}
                <span className="inline-block mr-2">&#10148;</span>Racing Count:{" "}
                {genreCounts["racing"] || 0} Users
              </h2>
            </div>
            <div className="bg-[#000000] bg-opacity-30 rounded-md p-3 my-2">
              <h2>
                {" "}
                <span className="inline-block mr-2">&#10148;</span>Shooter
                Count: {genreCounts["shooter"] || 0} Users
              </h2>
            </div>
            <div className="bg-[#000000] bg-opacity-30 rounded-md p-3 my-2">
              <h2>
                {" "}
                <span className="inline-block mr-2">&#10148;</span>Sports Count:{" "}
                {genreCounts["sports"] || 0} Users
              </h2>
            </div>
          </div>
        </div>
      </div>
      {/* <div className=" flex justify-between flex-wrap">
        {cartDetails.map((cartitem) => {
          return (
            <div className=" w-[30%]">
              <img src={cartitem.image} alt={cartitem.game} />
              <h1>Member ID: {cartitem.memberID}</h1>
              <h1>Game ID: {cartitem.gameID}</h1>
              <h1>Game: {cartitem.game}</h1>
              <h1>Price: {cartitem.price}</h1>
              <h1>Ganre: {cartitem.ganre}</h1>
            </div>
          );
        })}
      </div> */}
    </div>
  );
}
