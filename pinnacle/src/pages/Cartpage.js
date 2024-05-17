import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import CartItem from "../components/CartItem";
import axios from "axios";
import { Link } from "react-router-dom";
import Footer from "../components/Footer";
import SearchError from "../assets/animations/searchnotfound.webm";
import Game_Block_Card from "../components/Game_Block_Card";

export default function Cartpage() {
  const userEmail = localStorage.getItem("userEmail");
  const userId = localStorage.getItem("userId");
  const [selectedItems, setSelectedItems] = useState([]);
  const [ItemDetails, setItemDetails] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);

  const [isFilterBtnChecked, setIsFilterBtnChecked] = useState(false);
  const [isFilterChecked, setIsFilterChecked] = useState(false);
  const [filteredCart, setFilterdCart] = useState([]);
  const [isSearchCartChecked, setIsSearchCartChecked] = useState(false);
  const [searchedCart, setSearchedCart] = useState([]);
  const [checkAllButtonClicked, setcheckAllButtonClicked] = useState(false);
  const [genreCounts, setGenreCounts] = useState([]);
  const [mostCommonGenres, setMostCommonGenres] = useState([]);
  const [suggestedGames, setSuggestedGames] = useState([]);
  const [gameDetails, setGameDetails] = useState([]);

  const actionGames = gameDetails.filter((game) => game.type === "action");
  const adventureGames = gameDetails.filter(
    (game) => game.type === "adventure"
  );
  const racingGames = gameDetails.filter((game) => game.type === "racing");
  const shooterGames = gameDetails.filter((game) => game.type === "shooter");
  const sportsGames = gameDetails.filter((game) => game.type === "sports");

  let selecteditemsdescription = "";

  const handleSuggestion = (favGenres) => {
    const suggestedGames = [];

    favGenres.forEach((genre) => {
      switch (genre) {
        case "action":
          suggestedGames.push(...actionGames);
          break;
        case "adventure":
          suggestedGames.push(...adventureGames);
          break;
        case "racing":
          suggestedGames.push(...racingGames);
          break;
        case "shooter":
          suggestedGames.push(...shooterGames);
          break;
        case "sports":
          suggestedGames.push(...sportsGames);
          break;
        default:
          break;
      }
    });

    setSuggestedGames(suggestedGames);
  };

  var suggestid = "game";
  //read all game details
  useEffect(() => {
    axios
      .get(`http://localhost:3001/${suggestid}`)
      .then((result) => setGameDetails(result.data))
      .catch((err) => console.log(err));
  }, [suggestid]);

  // var memberID = "66118d9104fb9c92e1c7d980";
  // var memberID = "66202ae130ee8bb8602d92b6";
  // var memberID = userId;
  // const itemseter = () => {
  //   selectedItems.forEach((item, index) => {
  //     selecteditemsdescription += `${item.game} - ${item.price}`;
  //     if (index < selectedItems.length - 1) {
  //       selecteditemsdescription += ", ";
  //     }
  //   });
  // };

  const filterhandler = (ganre) => {
    setIsFilterChecked(true);
    const filterdItem = ItemDetails.filter((item) => item.ganre === ganre);
    setFilterdCart(filterdItem);
  };

  const searchCart = () => {
    setIsSearchCartChecked(true);
    const inputcartsearch = document.getElementById("SearchCartInput").value;
    const searchedCartItems = ItemDetails.filter(
      (game) =>
        game.game &&
        game.game.toLowerCase().includes(inputcartsearch.toLowerCase())
    );
    setSearchedCart(searchedCartItems);
  };
  const handleCheckAll = () => {
    if (!checkAllButtonClicked) {
      const updatedSelectedItems = ItemDetails.map((item) => ({
        id: item._id,
        price: item.price,
        game: item.game,
      }));
      setSelectedItems(updatedSelectedItems);
      const total = updatedSelectedItems.reduce(
        (acc, curr) => acc + curr.price,
        0
      );
      setTotalAmount(total);
    } else {
      setSelectedItems([]);
      setTotalAmount(0);
    }
    setcheckAllButtonClicked(!checkAllButtonClicked);
  };

  useEffect(() => {
    axios
      .get(`http://localhost:3001/getCartItemByMemberID/${userId}`)
      .then((result) => {
        setItemDetails(result.data);

        // Calculate genre counts
        const counts = {};
        result.data.forEach((item) => {
          counts[item.ganre] = (counts[item.ganre] || 0) + 1;
        });
        setGenreCounts(counts);

        let maxCount = 0;
        let genresWithMaxCount = [];
        for (const genre in counts) {
          const count = counts[genre];
          if (count > maxCount) {
            maxCount = count;
            genresWithMaxCount = [genre];
          } else if (count === maxCount) {
            genresWithMaxCount.push(genre);
          }
        }
        setMostCommonGenres(genresWithMaxCount);
        handleSuggestion(mostCommonGenres);
      })
      .catch((err) => console.log(err));
  }, [userId]);

  useEffect(() => {
    handleSuggestion(mostCommonGenres); // Call handleSeggestion when mostCommonGenres changes
  }, [mostCommonGenres]);

  // useEffect(() => {
  //   if (mostCommonGenres.length > 0) {
  //     axios
  //       .get(
  //         `http://localhost:3001/getSuggestedGameIds/${mostCommonGenres.join(",")}`
  //       )
  //       .then((result) => {
  //         setSuggestedGames(result.data);
  //       })
  //       .catch((err) => console.log(err));
  //   }
  // }, [mostCommonGenres]);

  console.log(mostCommonGenres);
  console.log(suggestedGames);

  // Function to handle checkbox change and update selected items
  const handleCheckboxChange = (itemId, isChecked, price, game) => {
    if (isChecked) {
      setSelectedItems([
        ...selectedItems,
        { id: itemId, price: price, game: game },
      ]);
      setTotalAmount(totalAmount + price);
      // Update total amount
    } else {
      setSelectedItems(selectedItems.filter((item) => item.id !== itemId));
      setTotalAmount(totalAmount - price);
      // Update total amount
    }
  };

  return (
    <div>
      <Header navid="home" />
      <div className="flex">
        <div className="flex mt-10 justify-between w-11/12 mx-auto text-white ">
          <div className="w-[70%] ">
            <h1 className="p-2  font-bold  text-[28px]">My Cart</h1>
            <div className="flex ml-1 mt-2 mr-8">
              <div className=" w-3/4 p-[2px] bg-gradient-to-l from-[#FE7804] to-[#FF451D] rounded-lg">
                <input
                  className=" bg-[#2A2B2F] text-[#FE7804] rounded-lg w-full  px-3 py-2 placeholder-[#FE7804]"
                  type="search"
                  id="SearchCartInput"
                  placeholder="Search Cart"
                  onKeyUp={searchCart}
                />
              </div>
              <div className="w-1/2 flex justify-between px-3">
                <div className="flex justify-start">
                  <div className=" relative ml-3">
                    <button>
                      <img
                        onClick={() => {
                          setIsFilterBtnChecked(!isFilterBtnChecked);
                          setIsSearchCartChecked(false);
                        }}
                        width="39"
                        height="39"
                        src="https://img.icons8.com/external-creatype-glyph-colourcreatype/64/FD7E14/external-descending-miscellaneous-user-interface-v1-creatype-glyph-colourcreatype-2.png"
                        alt="vertical-settings-mixer"
                      />
                    </button>
                    {isFilterBtnChecked && (
                      <div className=" absolute left-[80%] top-4 z-10 bg-black bg-opacity-50 text-white py-2 px-5 rounded-lg leading-8">
                        <p
                          onClick={() => {
                            setIsFilterChecked(false);
                            setIsFilterBtnChecked(false);
                          }}
                          className=" hover:text-[#FE7804] cursor-pointer"
                        >
                          All
                        </p>
                        <p
                          onClick={() => {
                            filterhandler("action");
                            setIsFilterBtnChecked(false);
                          }}
                          className=" hover:text-[#FE7804] cursor-pointer"
                        >
                          Action
                        </p>
                        <p
                          onClick={() => {
                            filterhandler("adventure");
                            setIsFilterBtnChecked(false);
                          }}
                          className=" hover:text-[#FE7804] cursor-pointer"
                        >
                          Adventure
                        </p>
                        <p
                          onClick={() => {
                            filterhandler("racing");
                            setIsFilterBtnChecked(false);
                          }}
                          className=" hover:text-[#FE7804] cursor-pointer"
                        >
                          Racing
                        </p>
                        <p
                          onClick={() => {
                            filterhandler("shooter");
                            setIsFilterBtnChecked(false);
                          }}
                          className=" hover:text-[#FE7804] cursor-pointer"
                        >
                          Shooter
                        </p>
                        <p
                          onClick={() => {
                            filterhandler("sport");
                            setIsFilterBtnChecked(false);
                          }}
                          className=" hover:text-[#FE7804] cursor-pointer"
                        >
                          Sport
                        </p>
                      </div>
                    )}
                  </div>
                </div>
                {!checkAllButtonClicked && (
                  <div>
                    <span
                      onClick={handleCheckAll}
                      className=" cursor-pointer h-full bg-transparent border-2 border-[#FE7804] rounded-lg flex items-center px-8 text-[#FE7804] font-semibold"
                    >
                      Select All
                    </span>
                  </div>
                )}
                {checkAllButtonClicked && (
                  <div>
                    <span
                      onClick={handleCheckAll}
                      className=" cursor-pointer h-full bg-transparent border-2 border-[#FE7804] rounded-lg flex items-center px-8 text-[#FE7804] font-semibold"
                    >
                      Select None
                    </span>
                  </div>
                )}
              </div>
            </div>
            {!isSearchCartChecked && (
              <div className="py-6 mt-3 text-white ">
                <h1 className=" text-[18px] font-bold">All Cart Items</h1>
                {!isFilterChecked && (
                  <div className="border-r border-gray-500 w-full h-full pr-10 pt-8">
                    {ItemDetails.map((item) => {
                      return (
                        <CartItem
                          id={item._id}
                          image={item.image}
                          game={item.game}
                          price={item.price}
                          ganre={item.ganre}
                          onCheckboxChange={handleCheckboxChange}
                          isAllChecked={checkAllButtonClicked}
                        />
                      );
                    })}
                    {console.log(
                      "all check button clicked" + checkAllButtonClicked
                    )}
                  </div>
                )}
                {isFilterChecked && (
                  <div className="border-r border-gray-500 w-full h-full pr-10 pt-8">
                    {filteredCart.map((item) => {
                      return (
                        <CartItem
                          id={item._id}
                          image={item.image}
                          game={item.game}
                          price={item.price}
                          ganre={item.ganre}
                          onCheckboxChange={handleCheckboxChange}
                          isAllChecked={checkAllButtonClicked}
                        />
                      );
                    })}
                    {console.log(
                      "all check button clicked" + checkAllButtonClicked
                    )}
                  </div>
                )}
              </div>
            )}
            {isSearchCartChecked && (
              <div className="py-6 mt-3 text-white ">
                <h1 className=" text-[18px] font-bold">Search Results</h1>
                {searchedCart.length > 0 ? (
                  <div className=" flex justify-between flex-wrap">
                    <div className="border-r border-gray-500 w-full h-full pr-10 pt-8">
                      {searchedCart.map((item) => {
                        return (
                          <CartItem
                            id={item._id}
                            image={item.image}
                            game={item.game}
                            price={item.price}
                            ganre={item.ganre}
                            onCheckboxChange={handleCheckboxChange}
                          />
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <div className=" w-full p-7 flex flex-col justify-center items-center mb-9">
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
          </div>

          <div className="w-[30%] pl-10">
            <h1 className=" p-2 font-bold text-[28px]">Selected Items</h1>
            <div className="pt-8">
              <div className="p-5 bg-[#202022] rounded-[10px] ">
                {/* <h1 className="text-[20px] font-semibold mb-5">Selected Items</h1> */}
                {selectedItems.length === 0 ? (
                  <p>
                    No item selected
                    <div className=" text-center text-[#D9D9D9] text-opacity-65 text-sm mt-5">
                      <span>
                        Please select required games inorder to make payment
                      </span>
                    </div>
                  </p>
                ) : (
                  selectedItems.map((item) => (
                    <p
                      key={item.id}
                      className="py-1  text-[#D9D9D9] text-opacity-65"
                    >
                      <span>{`${item.game}`}</span>
                      <span className="float-right">
                        {typeof item.price === "number"
                          ? `$${item.price.toFixed(2)}`
                          : ""}
                      </span>
                    </p>
                  ))
                )}

                <div className="flex justify-between mt-10 align-middle text-[18px] font-semibold">
                  <p>Sub Total :</p>
                  <p className="text-md">
                    {typeof totalAmount === "number"
                      ? `$${totalAmount.toFixed(2)}`
                      : ""}
                  </p>
                </div>
                {selectedItems.length === 0 ? (
                  <div>
                    <button className="basis-2/15 bg-gradient-to-b from-[rgb(102,100,100)] to-[#272725] text-white w-full  py-1 rounded-[10px] text-lg font-bold mt-6">
                      Buy Now
                    </button>
                  </div>
                ) : (
                  <div>
                    <Link
                      to={`/payment?totalprice=${totalAmount}&sitems=${selecteditemsdescription}&page=CS`}
                    >
                      <button className="basis-2/15 bg-gradient-to-b from-[#FF451D] to-[#FE7804] text-white w-full  py-1 rounded-[10px] text-lg font-bold mt-6">
                        Buy Now
                      </button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
            <div>
              <div className=" w-[100%] mt-5 ">
                <h1 className="py-3 font-bold  text-[20px]">
                  Suggestions for your favourite Genre
                </h1>
                {suggestedGames.length > 0 ? (
                  suggestedGames.slice(0, 2).map((game) => (
                    <div key={game._id} className="p-0 m-0 w-[100%] rounded-lg">
                      <Link to={`/gamedetail?gameid=${game._id}`}>
                        <Game_Block_Card
                          price={game.price}
                          image={game.gameImageUrl}
                          imgsize="30"
                        />
                      </Link>
                    </div>
                  ))
                ) : (
                  <div className="text-[#D9D9D9] text-opacity-65 text-center pl-3 pr-7 pb-5" >
                  Add items to your cart to receive personalized game recommendations.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
