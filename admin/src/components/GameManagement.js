import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import GameDetailcard from "./GameDetailcard";
import SearchError from "../assets/animations/searchnotfound.webm";
import "../pages/styles/extarnal.css";
import { HashLoader } from "react-spinners";

import DeleteWorning from "../assets/animations/deleteanimation.webm";
import SuccessPopup from "./SuccessPopup";

//::::::::::::::::::::::::::::::::::::::::::::::Game Table::::::::::::::::::::::::::::::::::::::::::::::

import html2canvas from "html2canvas";
import jsPDF from "jspdf";

//::::::::::::::::::::::::::::::::::::::::::::::Game Table::::::::::::::::::::::::::::::::::::::::::::::

export default function GameManagement() {
  var pageid = "game";
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [configurations, setConfiguration] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [downloadCount, setDownloadCount] = useState(0);
  const [type, setType] = useState("action");
  const [developer, setDeveloper] = useState("");
  const [publisher, setPublisher] = useState("");
  const [releasdate, setReleasDate] = useState("");
  const navigate = useNavigate();

  const [itemId, setitemId] = useState("");
  const [itemname, setitemName] = useState("");
  const [itemgameImageUrl, setitemgameImageUrl] = useState("");
  const [itemconfigurations, setitemConfiguration] = useState("");
  const [itemdescription, setitemDescription] = useState("");
  const [itemprice, setitemPrice] = useState(0);
  const [itemdownloadCount, setitemDownloadCount] = useState(0);
  const [itemtype, setitemType] = useState("action");
  const [itemdeveloper, setitemDeveloper] = useState("");
  const [itempublisher, setitemPublisher] = useState("");
  const [itemreleasdate, setitemReleasDate] = useState("");

  const [isAllChecked, setIsAllCkecked] = useState(true);
  const [isActionChecked, setIsActionCkecked] = useState(false);
  const [isAdventureChecked, setIsAdventureCkecked] = useState(false);
  const [isRacingChecked, setIsRacingCkecked] = useState(false);
  const [isShootingChecked, setIsShootingCkecked] = useState(false);
  const [isSportChecked, setIsSportCkecked] = useState(false);
  const [isFilterBtnChecked, setIsFilterBtnChecked] = useState(false);
  const [isGameAddFormChecked, setIsGameAddFormChecked] = useState(false);
  const [isGameDetailCardCheked, setIsGameDetailCardCheked] = useState(false);
  const [isGameUpdateFormCheked, setIsGameUpdateFormCheked] = useState(false);
  const [gameDetails, setGameDetails] = useState([]);
  const [gameSearch, setGameSearch] = useState(false);
  const [gameSearchResultArr, setGameSearchResultArr] = useState([]);

  const [nameError, setNameError] = useState("");
  const [typeError, setTypeError] = useState("");
  const [priceError, setPriceError] = useState("");
  const [developerError, setDeveloperError] = useState("");
  const [publisherError, setPublisherError] = useState("");
  const [releaseDateError, setReleaseDateError] = useState("");
  const [descriptionError, setDescriptionError] = useState("");
  const [configurationsError, setConfigurationsError] = useState("");
  const [imageError, setImageError] = useState("");

  const [submitButtonEnable, setSubmitButtonEnable] = useState(false);
  const [loading, setLoading] = useState(false);

  const actionGames = gameDetails.filter((game) => game.type === "action");
  const adventureGames = gameDetails.filter(
    (game) => game.type === "adventure"
  );
  const racingGames = gameDetails.filter((game) => game.type === "racing");
  const shooterGames = gameDetails.filter((game) => game.type === "shooter");
  const sportsGames = gameDetails.filter((game) => game.type === "sports");

  const [isDeleteWarning, setIsDeleteWarning] = useState(false);
  const [deleteSuccessMessagechecked, setDeleteSuccessMessagechecked] =
    useState(false);

  //read game details
  // When the data is fetched successfully, it updates the state variable
  // gameDetails with the received data. If there's an error during the fetch,
  // it logs the error to the console.
  useEffect(() => {
    axios
      .get(`http://localhost:3001/${pageid}`)
      .then((response) => {
        console.log("Fetched game details:", response.data);
        setGameDetails(response.data); // Ensure the data format matches expected structure
      })
      .catch((error) => console.error("Failed to fetch game details:", error));
  }, [pageid]);

  // Function to upload file to Cloudinary
  const uploadFile = async (type, file) => {
    const data = new FormData();
    data.append("file", file);
    data.append(
      "upload_preset",
      type === "image" ? "Game_Preset" : "Stream_Preset"
    );

    try {
      let cloudName = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME;
      console.log("Cloudinary cloud name:", cloudName);
      let resourceType = type === "image" ? "image" : "video";
      let api = `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`;

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

  //create game
  const createGame = async (e) => {
    setLoading(true);
    e.preventDefault();
    try {
      // Upload image file
      const gameImageUrl = image ? await uploadFile("image", image) : null;

      // Send backend API request
      const response = await axios.post("http://localhost:3001/createGame", {
        name,
        gameImageUrl,
        configurations,
        description,
        price,
        downloadCount,
        type,
        developer,
        publisher,
        releasdate,
      });


     // Send email notification
      const newGame = response.data; // Assuming response contains created game details
      await axios.post(
        "http://localhost:3001/api/sendGameNotification",
        newGame
      );

      console.log("Game created and notification sent successfully:", newGame);

      setLoading(false);
      navigate("/");
      window.location.reload();
    } catch (error) {
      console.error("Error creating game or sending notification:", error);
      setLoading(false);
    }
  };

  const allGameHandler = () => {
    setIsAllCkecked(true);
    setIsActionCkecked(false);
    setIsAdventureCkecked(false);
    setIsRacingCkecked(false);
    setIsShootingCkecked(false);
    setIsSportCkecked(false);
    setIsFilterBtnChecked(false);
  };

  const actionGameHandler = () => {
    setIsAllCkecked(false);
    setIsActionCkecked(true);
    setIsAdventureCkecked(false);
    setIsRacingCkecked(false);
    setIsShootingCkecked(false);
    setIsSportCkecked(false);
    setIsFilterBtnChecked(false);
  };

  const adventureGameHandler = () => {
    setIsAllCkecked(false);
    setIsActionCkecked(false);
    setIsAdventureCkecked(true);
    setIsRacingCkecked(false);
    setIsShootingCkecked(false);
    setIsSportCkecked(false);
    setIsFilterBtnChecked(false);
  };

  const racingGameHandler = () => {
    setIsAllCkecked(false);
    setIsActionCkecked(false);
    setIsAdventureCkecked(false);
    setIsRacingCkecked(true);
    setIsShootingCkecked(false);
    setIsSportCkecked(false);
    setIsFilterBtnChecked(false);
  };

  const shootingGameHandler = () => {
    setIsAllCkecked(false);
    setIsActionCkecked(false);
    setIsAdventureCkecked(false);
    setIsRacingCkecked(false);
    setIsShootingCkecked(true);
    setIsSportCkecked(false);
    setIsFilterBtnChecked(false);
  };

  const sportGameHandler = () => {
    setIsAllCkecked(false);
    setIsActionCkecked(false);
    setIsAdventureCkecked(false);
    setIsRacingCkecked(false);
    setIsShootingCkecked(false);
    setIsSportCkecked(true);
    setIsFilterBtnChecked(false);
  };

  const filterBtnHandler = () => {
    setIsFilterBtnChecked(!isFilterBtnChecked);
  };

  const gameDeyailcardHandle = (id) => {
    setIsGameDetailCardCheked(true);
    axios
      .get(`http://localhost:3001/getGamebyID/${id}`)
      .then((result) => {
        console.log(result);
        setitemId(result.data._id);
        setitemName(result.data.name);
        setitemgameImageUrl(result.data.gameImageUrl);
        setitemConfiguration(result.data.configurations);
        setitemDescription(result.data.description);
        setitemPrice(result.data.price);
        setitemDownloadCount(result.data.downloadCount);
        setitemType(result.data.type);
        setitemDeveloper(result.data.developer);
        setitemPublisher(result.data.publisher);
        setitemReleasDate(
          new Date(result.data.releasdate).toISOString().split("T")[0]
        );
      })
      .catch((err) => console.log(err));
  };

  const gameUpdate = async (e) => {
    setLoading(true);
    e.preventDefault();
    try {
      const itemgameImageUrl = image ? await uploadFile("image", image) : null;

      axios
        .put("http://localhost:3001/updateGame/" + itemId, {
          itemname,
          itemgameImageUrl,
          itemconfigurations,
          itemdescription,
          itemprice,
          itemdownloadCount,
          itemtype,
          itemdeveloper,
          itempublisher,
          itemreleasdate,
        })
        .then((result) => {
          console.log(result);
          window.location.reload();
        })
        .catch((err) => console.log(err));
      setLoading(false);
    } catch (error) {
      console.error("Error updating game:", error);
    }
  };

  useEffect(() => {
    // Assuming `image` must not be empty to enable the submit button
    if (image) {
      setSubmitButtonEnable(true);
    } else {
      setSubmitButtonEnable(false);
    }
  }, [image]); // Dependency on `image` ensures this runs every time `image` changes

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]); // Update the image state with the new file
    }
  };

  // delete game using game id

  const promptDelete = (id) => {
    setitemId(id); // Set the item ID when the delete prompt is initiated
    setIsDeleteWarning(true); // Show the delete warning modal
  };

  const handleDelete = () => {
    if (!itemId) return; // Guard clause if itemId is somehow unset

    axios
      .delete(`http://localhost:3001/deleteGame/${itemId}`)
      .then((res) => {
        console.log("Game deleted:", res);
        handleDeleteGameinCart(itemId);
        setDeleteSuccessMessagechecked(true); // Show success message
        setIsDeleteWarning(false); // Close the warning modal
        window.location.reload(); // Refresh or use a better state management
      })
      .catch((error) => {
        console.error("Failed to delete game:", error);
        setIsDeleteWarning(false); // Ensure modal closes on error too
      });
  };

  const handleDeleteCloseSuccessPopup = () => {
    setDeleteSuccessMessagechecked(false);
  };
  
  const handleDeleteGameinCart = (id) => {
    axios
      .delete("http://localhost:3001/deleteCartItemWhenGameUnavailable/" + id)
      .then((res) => {
        console.log(res);
        window.location.reload();
      })
      .catch((err) => console.log(err));
  };


  const gamesSearch = () => {
    setGameSearch(true);
    const gameSearchInput = document.getElementById("gameSearchbar").value;
    const gameSearchResult = gameDetails.filter(
      (item) =>
        item.name &&
        item.name.toLowerCase().includes(gameSearchInput.toLowerCase())
    );
    setGameSearchResultArr(gameSearchResult);
  };

  // const handlePriceChange = (e) => {
  //   const enteredPrice = e.target.value;
  //   const isValid = /^\d*\.?\d*$/.test(enteredPrice); // Check if input contains only numbers

  //   if (!isValid) {
  //     setSubmitButtonEnable(false);
  //     setPriceError("Price cannot contain letters");
  //     document.getElementById("gameAddSubmit").disabled = true;
  //   } else {
  //     setPriceError("");
  //     document.getElementById("gameAddSubmit").disabled = false;
  //     setSubmitButtonEnable(true);
  //   }

  //   setPrice(enteredPrice);
  // };

  // const handleUpdatePriceChange = (e) => {
  //   const enteredPrice = e.target.value;
  //   const isValid = /^\d*\.?\d*$/.test(enteredPrice); // Check if input contains only numbers

  //   if (!isValid) {
  //     setSubmitButtonEnable(false);
  //     setPriceError("Price cannot contain letters");
  //     document.getElementById("gameUpdateSubmit").disabled = true;
  //   } else {
  //     setSubmitButtonEnable(true);
  //     setPriceError("");
  //     document.getElementById("gameUpdateSubmit").disabled = false;
  //   }

  //   setitemPrice(enteredPrice);
  // };

  const handleDeveloperChange = (e) => {
    const enteredDeveloper = e.target.value;

    // Check if the entered developer name exceeds the maximum limit of 10 characters
    if (enteredDeveloper.length > 25) {
      setDeveloperError("Maximum size limit should be 25 characters");
      setSubmitButtonEnable(false);
      document.getElementById("gameAddSubmit").disabled = true;
    } else {
      setDeveloperError("");
      setDeveloper(enteredDeveloper);
      document.getElementById("gameAddSubmit").disabled = false;
      setSubmitButtonEnable(true);
    }
  };

  const handleUpdateDeveloperChange = (e) => {
    const enteredDeveloper = e.target.value;

    // Check if the entered developer name exceeds the maximum limit of 10 characters
    if (enteredDeveloper.length > 25) {
      setDeveloperError("Maximum size limit should be 25 characters");
      setSubmitButtonEnable(false);
      document.getElementById("gameUpdateSubmit").disabled = true;
    } else {
      setDeveloperError("");
      setitemDeveloper(enteredDeveloper);
      setSubmitButtonEnable(true);
      document.getElementById("gameUpdateSubmit").disabled = false;
    }
  };

  const handlePublisherChange = (e) => {
    const enteredPublisher = e.target.value;

    // Check if the entered publisher name exceeds the maximum limit of 10 characters
    if (enteredPublisher.length > 10) {
      setPublisherError("Maximum size limit is 10 characters");
      setSubmitButtonEnable(false);
      document.getElementById("gameAddSubmit").disabled = true;
    } else {
      setPublisherError("");
      setPublisher(enteredPublisher);
      setSubmitButtonEnable(true);
      document.getElementById("gameAddSubmit").disabled = false;
    }
  };

  const handleUpdatePublisherChange = (e) => {
    const enteredPublisher = e.target.value;

    // Check if the entered publisher name exceeds the maximum limit of 10 characters
    if (enteredPublisher.length > 10) {
      setPublisherError("Maximum size limit is 10 characters");
      setSubmitButtonEnable(false);
      document.getElementById("gameUpdateSubmit").disabled = true;
    } else {
      setPublisherError("");
      setitemPublisher(enteredPublisher);
      setSubmitButtonEnable(true);
      document.getElementById("gameUpdateSubmit").disabled = false;
    }
  };

  const handleReleaseDateChange = (e) => {
    const selectedDate = e.target.value;
    const today = new Date().toISOString().split("T")[0]; // Get today's date in YYYY-MM-DD format

    if (selectedDate > today) {
      setReleaseDateError("Select a previous day from today");
      setSubmitButtonEnable(false);
      document.getElementById("gameAddSubmit").disabled = true;
    } else {
      setReleaseDateError("");
      setReleasDate(selectedDate);
      setSubmitButtonEnable(true);
      document.getElementById("gameAddSubmit").disabled = false;
    }
  };

  const handleUpdateReleaseDateChange = (e) => {
    const selectedDate = e.target.value;
    const today = new Date().toISOString().split("T")[0]; // Get today's date in YYYY-MM-DD format

    if (selectedDate > today) {
      setReleaseDateError("Select a previous day from today");
      setSubmitButtonEnable(false);
      document.getElementById("gameUpdateSubmit").disabled = true;
    } else {
      setReleaseDateError("");
      setitemReleasDate(selectedDate);
      setSubmitButtonEnable(true);
      document.getElementById("gameUpdateSubmit").disabled = false;
    }
  };

  const handleNameChange = (event) => {
    const newName = event.target.value;
    setName(newName);

    // You can add your validation logic here
    // For example, check if the name is empty
    if (newName.trim() === "") {
      setNameError("Name is required");
    } else {
      setNameError(""); // Clear the error if the name is not empty
    }
  };

  const handleUpdateNameChange = (event) => {
    const newName = event.target.value;
    setitemName(newName);

    // You can add your validation logic here
    // For example, check if the name is empty
    if (newName.trim() === "") {
      setNameError("Name is required");
    } else {
      setNameError(""); // Clear the error if the name is not empty
    }
  };

  //::::::::::::::::::::::::::::::::::::::::::::::Game Table::::::::::::::::::::::::::::::::::::::::::::::

  const [games, setGames] = useState([]);

  // State hooks for search and filtering
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedField, setSelectedField] = useState("name");

  // Handling search query updates
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value.toLowerCase());
  };

  // Handling changes in the field selected for searching
  const handleFieldChange = (event) => {
    setSelectedField(event.target.value);
  };

  // Generating PDF from the game table
  const generatePDF = () => {
    const input = document.getElementById("pdf-table");
    html2canvas(input, { useCORS: true }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF();
      const imgWidth = 210;
      const pageHeight = 297;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save("All Games.pdf");
    });
  };

  // Adjust the filtering logic to consider the selected field and search query
  const filteredData =
    games.length > 0
      ? games.filter((game) =>
          game[selectedField]?.toString().toLowerCase().includes(searchQuery)
        )
      : gameDetails.filter((game) =>
          game[selectedField]?.toString().toLowerCase().includes(searchQuery)
        );

  //::::::::::::::::::::::::::::::::::::::::::::::Game Table::::::::::::::::::::::::::::::::::::::::::::::

  return (
    <div className="py-5 text-white px-7 ">
      <h1 className=" text-[25px] font-bold mb-3">Game Management</h1>
      <button
        onClick={() => setIsGameAddFormChecked(true)}
        className=" float-right bg-gradient-to-tr from-[#FF451D] to-[#FE7804] px-4 py-2 text-[18px] font-semibold rounded-lg"
      >
        Add new game +
      </button>
      <div className="flex justify-start">
        <div className=" w-1/2 p-[2px] bg-gradient-to-l from-[#FE7804] to-[#FF451D] rounded-2xl">
          <input
            id="gameSearchbar"
            className=" bg-[#262628] text-[#FE7804] rounded-2xl w-full  px-3 py-2 placeholder-[#FE7804]"
            type="search"
            placeholder="Search Games...."
            onKeyUp={gamesSearch}
          />
        </div>
        <button className=" bg-gradient-to-tr from-[#FF451D] to-[#FE7804] px-4 py-2 text-[18px] font-semibold rounded-lg ml-3">
          Search
        </button>
        <div className="relative ml-3 ">
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
            <div className="absolute z-10 py-3 pl-5 pr-10 leading-7 bg-black bg-opacity-85">
              <p
                onClick={allGameHandler}
                className=" hover:text-[#FE7804] cursor-pointer"
              >
                All
              </p>
              <p
                onClick={actionGameHandler}
                className=" hover:text-[#FE7804] cursor-pointer"
              >
                Action
              </p>
              <p
                onClick={adventureGameHandler}
                className=" hover:text-[#FE7804] cursor-pointer"
              >
                Adventure
              </p>
              <p
                onClick={racingGameHandler}
                className=" hover:text-[#FE7804] cursor-pointer"
              >
                Racing
              </p>
              <p
                onClick={shootingGameHandler}
                className=" hover:text-[#FE7804] cursor-pointer"
              >
                Shooter
              </p>
              <p
                onClick={sportGameHandler}
                className=" hover:text-[#FE7804] cursor-pointer"
              >
                Sport
              </p>
            </div>
          )}
        </div>
      </div>

      {gameSearch && (
        <div className="mt-9">
          <h1 className="text-[18px] font-bold mb-5">Searched Results</h1>
          {gameSearchResultArr.length > 0 ? (
            <div className="flex flex-wrap justify-between">
              {gameSearchResultArr.map((item) => (
                <div
                  onClick={() => gameDeyailcardHandle(item._id)}
                  className="p-0 m-0 w-[22%]"
                >
                  <GameDetailcard
                    image={item.gameImageUrl}
                    name={item.name}
                    id={item._id}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center w-full p-7 mb-9">
              <video autoPlay loop className="w-[200px] h-auto">
                <source src={SearchError} type="video/webm" />
                Your browser does not support the video tag.
              </video>
              <p className=" text-[#ffffffa0] text-[18px]">No results found</p>
            </div>
          )}
        </div>
      )}
      {!gameSearch && (
        <div className="mt-9">
          {isAllChecked && (
            <div>
              <h1 className=" text-[18px] font-bold mb-5">All games</h1>
              <div className="flex flex-wrap justify-between">
                {gameDetails.map((item) => {
                  return (
                    <div
                      onClick={() => gameDeyailcardHandle(item._id)}
                      className="p-0 m-0 w-[22%]"
                    >
                      <GameDetailcard
                        image={item.gameImageUrl}
                        name={item.name}
                        id={item._id}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          {isActionChecked && (
            <div>
              <h1 className=" text-[18px] font-bold mb-5">Action games</h1>
              <div className="flex flex-wrap justify-between">
                {actionGames.map((item) => {
                  return (
                    <div
                      onClick={() => gameDeyailcardHandle(item._id)}
                      className="p-0 m-0 w-[22%]"
                    >
                      <GameDetailcard
                        image={item.gameImageUrl}
                        name={item.name}
                        id={item._id}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          {isAdventureChecked && (
            <div>
              <h1 className=" text-[18px] font-bold mb-5">Adventure games</h1>
              <div className="flex flex-wrap justify-between">
                {adventureGames.map((item) => {
                  return (
                    <div
                      onClick={() => gameDeyailcardHandle(item._id)}
                      className="p-0 m-0 w-[22%]"
                    >
                      <GameDetailcard
                        image={item.gameImageUrl}
                        name={item.name}
                        id={item._id}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          {isRacingChecked && (
            <div>
              <h1 className=" text-[18px] font-bold mb-5">Racing games</h1>
              <div className="flex flex-wrap justify-between">
                {racingGames.map((item) => {
                  return (
                    <div
                      onClick={() => gameDeyailcardHandle(item._id)}
                      className="p-0 m-0 w-[22%]"
                    >
                      <GameDetailcard
                        image={item.gameImageUrl}
                        name={item.name}
                        id={item._id}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          {isShootingChecked && (
            <div>
              <h1 className=" text-[18px] font-bold mb-5">Shooter games</h1>
              <div className="flex flex-wrap justify-between">
                {shooterGames.map((item) => {
                  return (
                    <div
                      onClick={() => gameDeyailcardHandle(item._id)}
                      className="p-0 m-0 w-[22%]"
                    >
                      <GameDetailcard
                        image={item.gameImageUrl}
                        name={item.name}
                        id={item._id}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          {isSportChecked && (
            <div>
              <h1 className=" text-[18px] font-bold mb-5">Sport games</h1>
              <div className="flex flex-wrap justify-between">
                {sportsGames.map((item) => {
                  return (
                    <div
                      onClick={() => gameDeyailcardHandle(item._id)}
                      className="p-0 m-0 w-[22%]"
                    >
                      <GameDetailcard
                        image={item.gameImageUrl}
                        name={item.name}
                        id={item._id}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Add new game */}
      {isGameAddFormChecked && (
        <div className="fixed top-0 left-0 z-10 flex items-center justify-center w-full h-full backdrop-blur-lg">
          <form
            onSubmit={createGame}
            className="bg-[#1B1E20] rounded-2xl border-2 w-[70%] border-[#FE7804] px-10 py-8"
          >
            <div className="w-full ">
              <h1 className=" inline-block text-[25px] font-bold">
                Add New Game
              </h1>
              <div className="float-right">
                <img
                  onClick={() => setIsGameAddFormChecked(false)}
                  width="25"
                  height="25"
                  src="https://img.icons8.com/ios-filled/50/FFFFFF/multiply.png"
                  alt="multiply"
                />
              </div>
            </div>

            <div className="flex justify-between mt-5 mb-8 ">
              <div className="w-[30%]">
                <label>Game Name</label>
                <br />
                <input
                  className={`w-full p-1 text-[16px] rounded-lg bg-[#2A2B2F] border-2 ${
                    nameError ? "border-red-500" : "border-[#D8DAE3]"
                  } border-opacity-20 mt-2`}
                  type="text"
                  value={name}
                  onChange={handleNameChange}
                  required
                />
                {nameError && <span className="text-red-500">{nameError}</span>}
              </div>

              <div className="w-[30%]">
                <label>Type</label>
                <br />
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full p-1 text-[16px] rounded-lg bg-[#2A2B2F] border-2 border-[#D8DAE3] border-opacity-20 mt-2"
                  required
                >
                  <option value="action">Action</option>
                  <option value="adventure">Adventure</option>
                  <option value="racing">Racing</option>
                  <option value="shooter">Shooter</option>
                  <option value="sports">Sports</option>
                </select>
              </div>

              {/* <div className="w-[30%]">
                <label>Price</label>
                <br />
                <input
                  className={`w-full p-1 text-[16px] rounded-lg bg-[#2A2B2F] border-2 ${
                    priceError ? "border-red-500" : "border-[#D8DAE3]"
                  } border-opacity-20 mt-2`}
                  type="text"
                  value={price}
                  onChange={handlePriceChange}
                  required
                />
                {priceError && (
                  <span className="text-red-500">{priceError}</span>
                )}
              </div> */}

              <div className="w-[30%]">
                <label>Price</label>
                <br />
                <input
                  className={`w-full p-1 text-[16px] rounded-lg bg-[#2A2B2F] border-2 ${
                    priceError ? "border-red-500" : "border-[#D8DAE3]"
                  } border-opacity-20 mt-2`}
                  type="text" // Change type to text
                  value={price}
                  onChange={(e) => {
                    const input = e.target.value;
                    // Filter out non-numeric characters
                    const filteredInput = input.replace(/[^0-9]/g, "");
                    setPrice(filteredInput);
                  }}
                  required
                />
              </div>
            </div>

            <div className="flex justify-between mb-8 ">
              <div className="w-[30%]">
                <label>Developer</label>
                <br />
                <input
                  className={`w-full p-1 text-[16px] rounded-lg bg-[#2A2B2F] border-2 ${
                    developerError ? "border-red-500" : "border-[#D8DAE3]"
                  } border-opacity-20 mt-2`}
                  type="text"
                  value={developer}
                  onChange={handleDeveloperChange}
                  required
                />
                {developerError && (
                  <span className="text-red-500">{developerError}</span>
                )}
              </div>

              <div className="w-[30%]">
                <label>Publisher</label>
                <input
                  className={`w-full p-1 text-[16px] rounded-lg bg-[#2A2B2F] border-2 ${
                    publisherError ? "border-red-500" : "border-[#D8DAE3]"
                  } border-opacity-20 mt-2`}
                  type="text"
                  value={publisher}
                  onChange={handlePublisherChange}
                  required
                />
                {publisherError && (
                  <span className="text-red-500">{publisherError}</span>
                )}
              </div>

              <div className="w-[30%]">
                <label>Released date</label>
                <input
                  className={`w-full p-1 text-[16px] rounded-lg bg-[#2A2B2F] border-2 ${
                    releaseDateError ? "border-red-500" : "border-[#D8DAE3]"
                  } border-opacity-20 mt-2`}
                  type="date"
                  value={releasdate}
                  onChange={handleReleaseDateChange}
                  required
                />
                {releaseDateError && (
                  <span className="text-red-500">{releaseDateError}</span>
                )}
              </div>
            </div>

            <div className="w-[30%] mb-8">
              <label>Image</label>
              <br />
              <input
                className="w-full p-1 text-[16px] rounded-lg bg-[#2A2B2F] border-2 border-[#D8DAE3] border-opacity-20 mt-2"
                type="file"
                accept="image/*"
                id="image"
                onChange={(e) => setImage(e.target.files[0])}
                required
              />
            </div>
            <div className="flex justify-between mb-8 ">
              <div className="w-[48%]">
                <label>Description</label>
                <br />
                <textarea
                  className=" w-full rounded-lg bg-[#2A2B2F] border-2 border-[#D8DAE3] border-opacity-20 mt-2"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                ></textarea>
              </div>
              <div className="w-[48%]">
                <label>Configurations:</label>
                <br />
                <textarea
                  className="rounded-lg bg-[#2A2B2F] border-2 border-[#D8DAE3] border-opacity-20 w-full mt-2"
                  type="text"
                  value={configurations}
                  onChange={(e) => setConfiguration(e.target.value)}
                  required
                ></textarea>
              </div>
            </div>
            <button
              id="gameAddSubmit"
              type="submit"
              className={`float-right bg-transparent rounded-lg px-5 py-2 text-[16px] font-bold ${
                !submitButtonEnable ? "btndisabled" : "btnenable"
              }`}
            >
              Submit
            </button>
          </form>
        </div>
      )}

      {/* update Game */}
      {isGameUpdateFormCheked && (
        <div className="absolute top-0 left-0 z-10 flex items-center justify-center w-full h-full backdrop-blur-lg">
          <form
            onSubmit={gameUpdate}
            className="bg-[#1B1E20] rounded-2xl border-2 w-[70%] border-[#FE7804] px-10 py-8"
          >
            <div className="w-full ">
              <h1 className=" inline-block text-[25px] font-bold">
                Update game details
              </h1>
              <div className="float-right">
                <img
                  onClick={() => setIsGameUpdateFormCheked(false)}
                  width="25"
                  height="25"
                  src="https://img.icons8.com/ios-filled/50/FFFFFF/multiply.png"
                  alt="multiply"
                />
              </div>
            </div>

            <div className="flex justify-between mt-5 mb-8 ">
              <div className="w-[30%]">
                <label>Game Name</label>
                <br />
                <input
                  className={`w-full p-1 text-[16px] rounded-lg bg-[#2A2B2F] border-2 ${
                    nameError ? "border-red-500" : "border-[#D8DAE3]"
                  } border-opacity-20 mt-2`}
                  type="text"
                  value={itemname}
                  onChange={handleUpdateNameChange}
                  required
                />
                {nameError && <span className="text-red-500">{nameError}</span>}
              </div>

              <div className="w-[30%]">
                <label>Type</label>
                <br />
                <select
                  value={itemtype}
                  onChange={(e) => setitemType(e.target.value)}
                  className="w-full p-1 text-[16px] rounded-lg bg-[#2A2B2F] border-2 border-[#D8DAE3] border-opacity-20 mt-2"
                  required
                >
                  <option value="action">Action</option>
                  <option value="adventure">Adventure</option>
                  <option value="racing">Racing</option>
                  <option value="shooter">Shooter</option>
                  <option value="sports">Sports</option>
                </select>
              </div>

              <div className="w-[30%]">
                <label>Price</label>
                <br />
                <input
                  className={`w-full p-1 text-[16px] rounded-lg bg-[#2A2B2F] border-2 border-[#D8DAE3] border-opacity-20 mt-2`}
                  type="text"
                  value={itemprice}
                  onChange={(event) => {
                    const enteredPrice = event.target.value.replace(/\D/g, ""); // Remove non-numeric characters
                    setitemPrice(enteredPrice); // Update the price state with the sanitized value
                  }}
                  required
                />
              </div>
            </div>

            <div className="flex justify-between mb-8 ">
              <div className="w-[30%]">
                <label>Developer</label>
                <br />
                <input
                  className={`w-full p-1 text-[16px] rounded-lg bg-[#2A2B2F] border-2 ${
                    developerError ? "border-red-500" : "border-[#D8DAE3]"
                  } border-opacity-20 mt-2`}
                  type="text"
                  value={itemdeveloper}
                  onChange={handleUpdateDeveloperChange}
                  required
                />
                {developerError && (
                  <span className="text-red-500">{developerError}</span>
                )}
              </div>

              <div className="w-[30%]">
                <label>Publisher</label>
                <input
                  className={`w-full p-1 text-[16px] rounded-lg bg-[#2A2B2F] border-2 ${
                    publisherError ? "border-red-500" : "border-[#D8DAE3]"
                  } border-opacity-20 mt-2`}
                  type="text"
                  value={itempublisher}
                  onChange={handleUpdatePublisherChange}
                  required
                />
                {publisherError && (
                  <span className="text-red-500">{publisherError}</span>
                )}
              </div>

              <div className="w-[30%]">
                <label>Released date</label>
                <input
                  className={`w-full p-1 text-[16px] rounded-lg bg-[#2A2B2F] border-2 ${
                    releaseDateError ? "border-red-500" : "border-[#D8DAE3]"
                  } border-opacity-20 mt-2`}
                  type="date"
                  value={itemreleasdate}
                  onChange={handleUpdateReleaseDateChange}
                  required
                />

                {releaseDateError && (
                  <span className="text-red-500">{releaseDateError}</span>
                )}
              </div>
            </div>

            <div className="flex mb-8 ">
              <div className="w-[30%]">
                <label>Image</label>
                <br />

                <input
                  className="w-full p-1 text-[16px] rounded-lg bg-[#2A2B2F] border-2 border-[#D8DAE3] border-opacity-20 mt-2"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  required
                />
              </div>
              <img className="h-[70px] ml-5" src={itemgameImageUrl} />
            </div>
            <div className="flex justify-between mb-8 ">
              <div className="w-[48%]">
                <label>Description</label>
                <br />
                <textarea
                  className=" w-full rounded-lg bg-[#2A2B2F] border-2 border-[#D8DAE3] border-opacity-20 mt-2"
                  onChange={(e) => setitemDescription(e.target.value)}
                  required
                >
                  {itemdescription}
                </textarea>
              </div>
              <div className="w-[48%]">
                <label>Configurations:</label>
                <br />
                <textarea
                  className="rounded-lg bg-[#2A2B2F] border-2 border-[#D8DAE3] border-opacity-20 w-full mt-2"
                  type="text"
                  onChange={(e) => setitemConfiguration(e.target.value)}
                  required
                >
                  {itemconfigurations}
                </textarea>
              </div>
            </div>
            <button
              id="gameUpdateSubmit"
              type="submit"
              className={`float-right bg-transparent rounded-lg px-5 py-2 text-[16px] font-bold ${
                !submitButtonEnable ? "btndisabled" : "btnenable"
              }`}
            >
              Update
            </button>
          </form>
        </div>
      )}

      {isGameDetailCardCheked && (
        <div className="absolute top-0 left-0 z-10 flex items-center justify-center w-full h-full backdrop-blur-lg">
          <div className="bg-[#1B1E20] rounded-2xl border-2 w-[70%] border-[#FE7804] px-10 py-8">
            <div>
              <h1 className=" inline-block text-[25px] font-bold mb-6">
                {itemname}
              </h1>
              <img
                onClick={() => setIsGameDetailCardCheked(false)}
                className="float-right "
                width="25"
                height="25"
                src="https://img.icons8.com/ios-filled/50/FFFFFF/multiply.png"
                alt="multiply"
              />
            </div>
            <div className="flex justify-between ">
              <img className="h-auto w-[30%]" src={itemgameImageUrl} />
              <div className=" w-[67%] pl-5 leading-8">
                <pre className=" text-[#ffffff73]">
                  <img
                    className="inline-block mr-3 "
                    width="12"
                    height="12"
                    src="https://img.icons8.com/tiny-glyph/32/FD7E14/checkmark.png"
                    alt="checkmark"
                  />
                  <span className="font-bold text-white ">Type</span> :{" "}
                  <span>{itemtype}</span>
                </pre>
                <pre className=" text-[#ffffff73]">
                  <img
                    className="inline-block mr-3 "
                    width="12"
                    height="12"
                    src="https://img.icons8.com/tiny-glyph/32/FD7E14/checkmark.png"
                    alt="checkmark"
                  />
                  <span className="font-bold text-white ">Price</span> :{" "}
                  <span>$ {itemprice}</span>
                </pre>
                <pre className=" text-[#ffffff73]">
                  <img
                    className="inline-block mr-3 "
                    width="12"
                    height="12"
                    src="https://img.icons8.com/tiny-glyph/32/FD7E14/checkmark.png"
                    alt="checkmark"
                  />
                  <span className="font-bold text-white ">Downloads</span> :{" "}
                  <span>{itemdownloadCount} Downloads</span>
                </pre>
                <pre className=" text-[#ffffff73]">
                  <img
                    className="inline-block mr-3 "
                    width="12"
                    height="12"
                    src="https://img.icons8.com/tiny-glyph/32/FD7E14/checkmark.png"
                    alt="checkmark"
                  />
                  <span className="font-bold text-white ">Developer</span> :{" "}
                  <span>{itemdeveloper}</span>
                </pre>
                <pre className=" text-[#ffffff73]">
                  <img
                    className="inline-block mr-3 "
                    width="12"
                    height="12"
                    src="https://img.icons8.com/tiny-glyph/32/FD7E14/checkmark.png"
                    alt="checkmark"
                  />
                  <span className="font-bold text-white ">Publisher</span> :{" "}
                  <span>{itempublisher}</span>
                </pre>
                <pre className=" text-[#ffffff73]">
                  <img
                    className="inline-block mr-3 "
                    width="12"
                    height="12"
                    src="https://img.icons8.com/tiny-glyph/32/FD7E14/checkmark.png"
                    alt="checkmark"
                  />
                  <span className="font-bold text-white ">Releas Date</span> :{" "}
                  <span>{itemreleasdate}</span>
                </pre>
              </div>
            </div>

            <div className="flex justify-between">
              <div className=" w-[50%] p-5">
                <p>
                  <img
                    className="inline-block mr-3 "
                    width="12"
                    height="12"
                    src="https://img.icons8.com/tiny-glyph/32/FD7E14/checkmark.png"
                    alt="checkmark"
                  />
                  <span className="font-bold text-white ">Configuration</span>
                  <br />
                  <span className=" text-[#ffffff73]">
                    {itemconfigurations}
                  </span>
                </p>
              </div>
              <div className=" w-[50%] p-5">
                <p>
                  <img
                    className="inline-block mr-3 "
                    width="12"
                    height="12"
                    src="https://img.icons8.com/tiny-glyph/32/FD7E14/checkmark.png"
                    alt="checkmark"
                  />
                  <span className="font-bold text-white ">Description</span>
                  <br />
                  <span className=" text-[#ffffff73]">{itemdescription}</span>
                </p>
              </div>
            </div>
            <div className="flex justify-end">
              <button
                onClick={() => {
                  setIsGameUpdateFormCheked(true);
                  setIsGameDetailCardCheked(false);
                }}
                className=" bg-transparent text-[#FE7804] border-2 border-[#FE7804] hover:bg-[#FE7804] hover:text-white rounded-lg px-5 py-2 text-[16px] font-bold"
              >
                Upgrade
              </button>
              <button
                onClick={() => promptDelete(itemId)}
                className="bg-[#FE7804] hover:bg-[#FF451D] rounded-lg px-5 py-2 text-[16px] font-bold ml-5"
              >
                Delete
              </button>

              {isDeleteWarning && (
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
                        onClick={() => setIsDeleteWarning(false)}
                        className=" bg-transparent border-2 border-[#FE7804] text-[#FE7804] hover:bg-[#FE7804] hover:text-white rounded-lg py-2 px-5 mr-4 font-semibold"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleDelete}
                        className="bg-[#FE7804] border-2 border-[#FE7804] hover:bg-[#FF451D] hover:border-[#FF451D] rounded-lg py-2 px-5 text-white font-semibold"
                      >
                        Confirm
                      </button>
                    </div>
                  </div>
                </div>
              )}

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
          </div>
        </div>
      )}

      {/* ::::::::::::::::::::::::::::::::::::::::::::::Game Table:::::::::::::::::::::::::::::::::::::::::::::: */}

      <div className="w-11/12 mx-auto mt-5">
        <h1 className="mb-6 text-2xl font-bold text-white">All Games</h1>
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={generatePDF}
            className="float-right bg-gradient-to-tr from-[#FF451D] to-[#FE7804] px-4 py-2 text-[18px] font-semibold rounded-lg"
          >
            Generate PDF
          </button>
          <input
            type="text"
            className="bg-[#262628] text-[#FE7804] rounded-2xl flex-grow px-4 py-2 rounded-lg placeholder-[#FE7804] h-10 text-white  px-3 py-2 "
            placeholder="Search Games..."
            onChange={handleSearchChange}
          />
          <select
            onChange={handleFieldChange}
            onFocus={(e) => (e.target.style.backgroundColor = "#ff7f50")} // Change to your desired color on focus
            onBlur={(e) => (e.target.style.backgroundColor = "#FF451D")} // Reset to default color on blur
            style={{
              padding: "8px 16px",
              borderRadius: "12px",
              backgroundImage:
                "linear-gradient(to top right, #FF451D, #FE7804)",
              height: "40px",
              color: "white",
              borderColor: "#ddd", // Default border color, change as needed
            }}
            className="px-4 py-2 rounded-lg bg-gradient-to-tr from-[#FF451D] to-[#FE7804] h-10 text-white"
          >
            <option value="name">Name</option>
            <option value="type">Type</option>
            <option value="price">Price</option>
            <option value="developer">Developer</option>
            <option value="publisher">Publisher</option>
            <option value="releaseDate">Release Date</option>
          </select>
        </div>

        <div id="pdf-table" className="overflow-x-auto">
          <table className="w-full border border-collapse border-gray-800 table-auto">
            <thead>
              <tr>
                <th className="border px-4 py-2 border-[#1F2937] bg-gradient-to-tr from-[#FF451D] to-[#FE7804] text-white">
                  Name
                </th>
                <th className="border px-4 py-2 border-[#1F2937] bg-gradient-to-tr from-[#FF451D] to-[#FE7804] text-white">
                  Image
                </th>
                <th className="border px-4 py-2 border-[#1F2937] bg-gradient-to-tr from-[#FF451D] to-[#FE7804] text-white">
                  Type
                </th>
                <th className="border px-4 py-2 border-[#1F2937] bg-gradient-to-tr from-[#FF451D] to-[#FE7804] text-white">
                  Price
                </th>
                <th className="border px-4 py-2 border-[#1F2937] bg-gradient-to-tr from-[#FF451D] to-[#FE7804] text-white">
                  Developer
                </th>
                <th className="border px-4 py-2 border-[#1F2937] bg-gradient-to-tr from-[#FF451D] to-[#FE7804] text-white">
                  Publisher
                </th>
                <th className="border px-4 py-2 border-[#1F2937] bg-gradient-to-tr from-[#FF451D] to-[#FE7804] text-white">
                  Release Date
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((game) => (
                <tr key={game._id}>
                  <td className="border px-4 py-2 bg-[#262628] text-white border-[#1F2937]">
                    {game.name}
                  </td>
                  <td className="border px-4 py-2 bg-[#262628] text-white border-[#1F2937]">
                    <img
                      src={game.gameImageUrl}
                      alt="Game Image"
                      style={{ width: "100%", maxHeight: "200px" }}
                    />
                  </td>
                  <td className="border px-4 py-2 bg-[#262628] text-white border-[#1F2937]">
                    {game.type}
                  </td>
                  <td className="border px-4 py-2 bg-[#262628] text-white border-[#1F2937]">
                    ${game.price}
                  </td>
                  <td className="border px-4 py-2 bg-[#262628] text-white border-[#1F2937]">
                    {game.developer}
                  </td>
                  <td className="border px-4 py-2 bg-[#262628] text-white border-[#1F2937]">
                    {game.publisher}
                  </td>
                  <td className="border px-4 py-2 bg-[#262628] text-white border-[#1F2937]">
                    {new Date(game.releasdate).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {loading && (
        <div className="fixed top-0 left-0 z-50 flex items-center justify-center w-full h-screen bg-black bg-opacity-50 ">
          <HashLoader size="75" color="#FE7804" />
        </div>
      )}
      {/* ::::::::::::::::::::::::::::::::::::::::::::::Game Table:::::::::::::::::::::::::::::::::::::::::::::: */}
    </div>
  );
}
