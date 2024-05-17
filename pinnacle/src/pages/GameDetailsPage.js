import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Game_Edition_Card from "../components/Game_Edition_Card";
import polygon from "../assets/games/Rectangle115.png";
import "./styles/External.css";
import { useNavigate, useLocation, Link } from "react-router-dom";
import axios from "axios";
import SuccessPopup from "../components/SuccessPopup";

export default function GameDetailsPage() {
  const userEmail = localStorage.getItem('userEmail');
  const userId = localStorage.getItem('userId');
  var memberID = userId;
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const gameId = queryParams.get("gameid");
  const [gamedetail, setGameDetail] = useState([]);
  const [downloads, setDownloads] = useState([]);
  const [buyBtnEnable, setBuyBtnEnable] = useState(true);
  const [payError, setPayError] = useState(false);
  const [gameDetails, setGameDetails] = useState([]);
  const [filteredGames, setFilteredGames] = useState([]);

  const [gameName, setGameName] = useState("");
  const [gamePrice, setGamePrice] = useState(0);
  const [gameImageUrl, setGameImageUrl] = useState("");
  const [type, setType] = useState("");
  const [cartAvailability, setCartAvailability] = useState(false);

  const [createSuccessMessagechecked, setCreateSuccessMessagechecked] =
    useState(false);

  useEffect(() => {
    axios
      .get(`http://localhost:3001/getGamebyID/${gameId}`)
      .then((result) => {
        console.log(result.data);
        setGameDetail(result.data);
        setGameName(result.data.name);
        setGamePrice(result.data.price);
        setGameImageUrl(result.data.gameImageUrl);
        setType(result.data.type);
      })
      .catch((err) => console.log(err));
  }, [gameId]);

  useEffect(() => {
    axios
      .get(`http://localhost:3001/${"game"}`)
      .then((result) => setGameDetails(result.data))
      .catch((err) => console.log(err));
  }, []);

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

  useEffect(() => {
    downloads.forEach((item) => {
      if (item.gameid == gameId) {
        setBuyBtnEnable(false);
        setCartAvailability(true);
      }
    });

    const filtered = gameDetails.filter((game) =>game.name.toLowerCase().startsWith(gamedetail.name.toLowerCase().slice(0, 6)));
    setFilteredGames(filtered);
  }, [gameId, downloads, gameDetails]);

  const paymentValidationMessage = () => {
    setPayError(true);

    setTimeout(() => {
      setPayError(false);
    }, 5000);
  };

  useEffect(() => {
    axios
      .get(`http://localhost:3001/getCartItemByMemberID/${memberID}`)
      .then((result) => {
        console.log(result.data);

        const matchingCartItem = result.data.find(
          (item) => item.gameID === gameId
        );

        if (matchingCartItem) {
          setCartAvailability(true);
          console.log("Matching cart item found:", matchingCartItem);
        } else {
          setCartAvailability(false);
          console.log("No matching cart item found.");
        }
      })
      .catch((err) => console.log(err));
  }, [memberID, gameId]);

  useEffect(() => {
    console.log("Updated cartAvailability:", cartAvailability);
  }, [cartAvailability]);

  const AddtoCartByID = (e) => {
    e.preventDefault();

    if (cartAvailability === true) {
      alert("This game is already in your cart or already Downloaded.");
      return;
    }

    axios
      .post("http://localhost:3001/createCartItem", {
        memberID: memberID,
        gameID: gameId,
        game: gameName,
        image: gameImageUrl,
        price: gamePrice,
        ganre: type,
      })
      .then((result) => {
        console.log(result);
        setCreateSuccessMessagechecked(true);
        setCartAvailability(true);
      })
      .catch((err) => console.log(err));
  };

  const handleCreateCloseSuccessPopup = () => {
    setCreateSuccessMessagechecked(false);
  };

  return (
    <div className="text-white">
      <Header navid="games" />
      <div
        className=" w-full -z-10 relative h-[600px]"
        style={{ backgroundImage: `url(${gamedetail.gameImageUrl})` }}
      >
        <img className="w-full absolute bottom-[-5px]" src={polygon} />
      </div>
      <div className=" z-50 absolute top-[40%] w-full flex justify-around">
        {/* <div className="flex justify-around absolute bottom-4"> */}
        <div className=" w-[40%] z-10">
          <img src={gamedetail.gameImageUrl} className=" w-full rounded-lg" />
        </div>
        <div className="w-[40%] bg-white bg-opacity-10 bg-blur rounded-lg p-8 z-[500]">
          <h1 className="text-center text-[32px] font-bold mb-2 text-[#FE7804]">
            {gamedetail.name}
          </h1>
          <p className="text-[#ffffff73] text-[16px] text-center">
            <img
              className=" inline-block mr-2"
              width="25"
              height="25"
              src="https://img.icons8.com/glyph-neue/64/40C057/download--v1.png"
              alt="download--v1"
            />
            {gamedetail.downloadCount} Downloads
          </p>
          <div className=" bg-transparent flex items-center justify-center mb-2 mt-1">
            <select className=" bg-[#000000] bg-opacity-20 py-2 px-10 rounded-md">
              <option>Windows</option>
              <option>Linux</option>
            </select>
          </div>
          <p className="text-[#ffffff73] text-[16px] line-through text-center">
            {typeof gamedetail.price === "number"
              ? `$${(gamedetail.price + 5).toFixed(2)}`
              : ""}
          </p>
          <p className="text-[#FE7804] font-bold text-[25px] text-center">
            {typeof gamedetail.price === "number"
              ? `$${gamedetail.price.toFixed(2)}`
              : ""}
          </p>
          {cartAvailability && (
            <div className="my-4 mx-auto flex justify-around">
              <div
                onClick={AddtoCartByID}
                className=" bg-[#a7a29d] py-2 px-10 rounded-md mx-4 w-2/5 text-center font-semibold"
              >
                Add to Cart
              </div>
              {!buyBtnEnable && (
              <div
                onClick={paymentValidationMessage}
                className=" bg-[#858282] py-2 px-10 rounded-md mx-4 w-2/5 text-center z-50 font-semibold cursor-pointer"
              >
                Buy now
              </div>
            )}
            {buyBtnEnable && (
              <div className=" bg-[#FF451D] py-2 px-10 rounded-md mx-4 w-2/5 text-center z-50 font-semibold cursor-pointer">
                <Link to={`/payment?planId=${gamedetail._id}&page=G`}>
                  Buy now
                </Link>
              </div>
            )}
            </div>
          )}
          {!cartAvailability && (
            <div className="my-4 mx-auto flex justify-around">
              <div
                onClick={AddtoCartByID}
                className=" cursor-pointer bg-[#FE7804] py-2 px-10 rounded-md mx-4 w-2/5 text-center z-50 font-semibold"
              >
                Add to Cart
              </div>
              {!buyBtnEnable && (
              <div
                onClick={paymentValidationMessage}
                className=" bg-[#858282] py-2 px-10 rounded-md mx-4 w-2/5 text-center z-50 font-semibold cursor-pointer"
              >
                Buy now
              </div>
            )}
            {buyBtnEnable && (
              <div className=" bg-[#FF451D] py-2 px-10 rounded-md mx-4 w-2/5 text-center z-50 font-semibold cursor-pointer">
                <Link to={`/payment?planId=${gamedetail._id}&page=G`}>
                  Buy now
                </Link>
              </div>
            )}
            </div>
          )}
          {payError && (
            <div className=" w-full">
              <p className=" text-center text-[15px] text-red-600 font-semibold">
                This game is already downloaded to your account
              </p>
            </div>
          )}

          </div>
        </div>

        {/* </div> */}

        <div className="flex justify-between w-11/12 mx-auto py-10">
          <div className=" w-[60%]">
            <h1 className="text-[28px] font-bold">About</h1>
            <p className="mt-11 text-[#ffffff73] text-[16px]">
              {gamedetail.description}
            </p>
          </div>
          <div className="w-[30%]">
            <div className="flex">
              <div className=" bg-green-700 rounded-full p-[3px] mr-5">
                <div className=" bg-[#2A2B2F] rounded-full p-[3px]">
                  <div className=" bg-[#2A2B2F] text-green-700 rounded-full px-4 py-3 font-bold text-[18px] border-dotted border-2 border-green-700">
                    10
                  </div>
                </div>
              </div>

              <div className="flex flex-col justify-center">
                <p className="text-[#ffffff73] text-[16px]">Based on</p>
                <p>
                  <span className="text-[20px] font-bold">10</span> Reviews
                </p>
              </div>
            </div>

            <div>
              <ul className="mt-4">
                <li className="text-[#ffffff73] text-[18px]">
                  <span className=" font-bold text-white">Installation:</span>{" "}
                  How to activate your game
                </li>
                <li className="text-[#ffffff73] text-[18px]">
                  <span className=" font-bold text-white">Developer:</span>{" "}
                  {gamedetail.developer}
                </li>
                <li className="text-[#ffffff73] text-[18px]">
                  <span className=" font-bold text-white">Publisher:</span>{" "}
                  {gamedetail.publisher}
                </li>
                <li className="text-[#ffffff73] text-[18px]">
                  <span className=" font-bold text-white">Release date:</span>{" "}
                  25
                  {gamedetail.releasdate}
                </li>
                <li className="text-[#ffffff73] text-[18px]">
                  <span className=" font-bold text-white">Genre:</span>{" "}
                  Single-player, Action
                </li>
                <li className="text-[#ffffff73] text-[18px]">
                  <span className=" font-bold text-white">
                    Recent Steam reviews:
                  </span>{" "}
                  Very positive (84)
                </li>
                <li className="text-[#ffffff73] text-[18px]">
                  <span className=" font-bold text-white">
                    All Steam reviews:
                  </span>{" "}
                  Very positive (7190)
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className=" w-11/12 mx-auto mt-5">
          <h1 className=" font-bold text-[28px]">Configurations</h1>
          <div className="flex justify-between w-full mt-5">
            <div className="ml-8">
              <h1 className="text-[20px] font-bold">minimum*</h1>
              <ul className="mt-5 ml-8">
                <li className="text-[#ffffff73] text-[18px]">
                  <img
                    className=" inline-block mr-3"
                    width="12"
                    height="12"
                    src="https://img.icons8.com/tiny-glyph/32/FD7E14/checkmark.png"
                    alt="checkmark"
                  />
                  Internet (TCP/IP) and LAN (TCP/IP) play supported
                </li>
                <li className="text-[#ffffff73] text-[18px]">
                  <img
                    className=" inline-block mr-3"
                    width="12"
                    height="12"
                    src="https://img.icons8.com/tiny-glyph/32/FD7E14/checkmark.png"
                    alt="checkmark"
                  />
                  Internet play requires broadband connection and latest drivers
                </li>
                <li className="text-[#ffffff73] text-[18px]">
                  <img
                    className=" inline-block mr-3"
                    width="12"
                    height="12"
                    src="https://img.icons8.com/tiny-glyph/32/FD7E14/checkmark.png"
                    alt="checkmark"
                  />
                  LAN play requires network interface card and latest drivers
                </li>
                <li className="text-[#ffffff73] text-[18px]">
                  <img
                    className=" inline-block mr-3"
                    width="12"
                    height="12"
                    src="https://img.icons8.com/tiny-glyph/32/FD7E14/checkmark.png"
                    alt="checkmark"
                  />
                  ATI Radeon 8500
                </li>
                <li className="text-[#ffffff73] text-[18px]">
                  <img
                    className=" inline-block mr-3"
                    width="12"
                    height="12"
                    src="https://img.icons8.com/tiny-glyph/32/FD7E14/checkmark.png"
                    alt="checkmark"
                  />
                  ATI Radeon 9000
                </li>
                <li className="text-[#ffffff73] text-[18px]">
                  <img
                    className=" inline-block mr-3"
                    width="12"
                    height="12"
                    src="https://img.icons8.com/tiny-glyph/32/FD7E14/checkmark.png"
                    alt="checkmark"
                  />
                  ATI Radeon 9200
                </li>
                <li className="text-[#ffffff73] text-[18px]">
                  <img
                    className=" inline-block mr-3"
                    width="12"
                    height="12"
                    src="https://img.icons8.com/tiny-glyph/32/FD7E14/checkmark.png"
                    alt="checkmark"
                  />
                  ATI Radeon 9500
                </li>
                <li className="text-[#ffffff73] text-[18px]">
                  <img
                    className=" inline-block mr-3"
                    width="12"
                    height="12"
                    src="https://img.icons8.com/tiny-glyph/32/FD7E14/checkmark.png"
                    alt="checkmark"
                  />
                  ATI Radeon 9600
                </li>
                <li className="text-[#ffffff73] text-[18px]">
                  <img
                    className=" inline-block mr-3"
                    width="12"
                    height="12"
                    src="https://img.icons8.com/tiny-glyph/32/FD7E14/checkmark.png"
                    alt="checkmark"
                  />
                  ATI Radeon 9700
                </li>
                <li className="text-[#ffffff73] text-[18px]">
                  <img
                    className=" inline-block mr-3"
                    width="12"
                    height="12"
                    src="https://img.icons8.com/tiny-glyph/32/FD7E14/checkmark.png"
                    alt="checkmark"
                  />
                  ATI Radeon 9800
                </li>
                <li className="text-[#ffffff73] text-[18px]">
                  <img
                    className=" inline-block mr-3"
                    width="12"
                    height="12"
                    src="https://img.icons8.com/tiny-glyph/32/FD7E14/checkmark.png"
                    alt="checkmark"
                  />
                  ATI Radeon X300
                </li>
                <li className="text-[#ffffff73] text-[18px]">
                  <img
                    className=" inline-block mr-3"
                    width="12"
                    height="12"
                    src="https://img.icons8.com/tiny-glyph/32/FD7E14/checkmark.png"
                    alt="checkmark"
                  />
                  ATI Radeon X550
                </li>
              </ul>
            </div>
            <div>
              <h1 className="text-[20px] font-bold">recommended*</h1>
              <ul className="mt-5 ml-8">
                <li className="text-[#ffffff73] text-[18px]">
                  <img
                    className=" inline-block mr-3"
                    width="12"
                    height="12"
                    src="https://img.icons8.com/tiny-glyph/32/FD7E14/checkmark.png"
                    alt="checkmark"
                  />
                  <span className=" text-white font-bold">OS:</span> 64-bit
                  Windows 10
                </li>
                <li className="text-[#ffffff73] text-[18px]">
                  <img
                    className=" inline-block mr-3"
                    width="12"
                    height="12"
                    src="https://img.icons8.com/tiny-glyph/32/FD7E14/checkmark.png"
                    alt="checkmark"
                  />
                  <span className=" text-white font-bold">Processor:</span> AMD
                  Ryzen 5-1600 / Intel Core i5-7600K
                </li>
                <li className="text-[#ffffff73] text-[18px]">
                  <img
                    className=" inline-block mr-3"
                    width="12"
                    height="12"
                    src="https://img.icons8.com/tiny-glyph/32/FD7E14/checkmark.png"
                    alt="checkmark"
                  />
                  <span className=" text-white font-bold">Memory:</span> 8 GB
                  RAM
                </li>
                <li className="text-[#ffffff73] text-[18px]">
                  <img
                    className=" inline-block mr-3"
                    width="12"
                    height="12"
                    src="https://img.icons8.com/tiny-glyph/32/FD7E14/checkmark.png"
                    alt="checkmark"
                  />
                  <span className=" text-white font-bold">Graphics:</span>{" "}
                  Nvidia GTX 1060 6GB or better
                </li>
                <li className="text-[#ffffff73] text-[18px]">
                  <img
                    className=" inline-block mr-3"
                    width="12"
                    height="12"
                    src="https://img.icons8.com/tiny-glyph/32/FD7E14/checkmark.png"
                    alt="checkmark"
                  />
                  <span className=" text-white font-bold">DirectX:</span>{" "}
                  Version 11
                </li>
                <li className="text-[#ffffff73] text-[18px]">
                  <img
                    className=" inline-block mr-3"
                    width="12"
                    height="12"
                    src="https://img.icons8.com/tiny-glyph/32/FD7E14/checkmark.png"
                    alt="checkmark"
                  />
                  <span className=" text-white font-bold">Storage:</span> 90 GB
                  available space
                </li>
              </ul>
            </div>
          </div>
        </div>
{/* 
        <div className=" w-11/12 mx-auto mt-10">
          <h1 className=" font-bold text-[28px]">65 Reviews</h1>
        </div> */}

      <div className=" w-11/12 mx-auto my-10">
        <h1 className=" font-bold text-[28px]">Editions</h1>
        {filteredGames.length > 0 ? (
        <div className="flex justify-start my-4">
          {filteredGames.map((item) => {
              return (

                <div className="w-[25%] mx-[4%]">
                <Link to={`/gamedetail?gameid=${item._id}`}>
                  <Game_Edition_Card
                    name={item.name}
                    price={item.price}
                    image={item.gameImageUrl}
                    id = {item._id}
                  />
                </Link>
                </div>
              );
            })}</div>) : (<div className="flex justify-around my-4">
              <span className=" text-[#7e7a7a]">Currenly one edition available</span>
            </div>)}

      </div>
      {createSuccessMessagechecked && (
          <SuccessPopup
            type="Adde"
            item="Cart"
            onClose={handleCreateCloseSuccessPopup}
          />
        )}
      <Footer />
    </div>
  );
}
