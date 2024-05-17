import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import { Route } from "react-router-dom";
import Game_Block_Card from "../components/Game_Block_Card";
import Footer from "../components/Footer";
import axios from "axios";
import { Link } from "react-router-dom";
import SearchError from "../assets/animations/searchnotfound.webm";

export default function Gamepage() {
  
  var pageid = "game";
  const [isAllChecked, setIsAllCkecked] = useState(true);
  const [isActionChecked, setIsActionCkecked] = useState(false);
  const [isAdventureChecked, setIsAdventureCkecked] = useState(false);
  const [isRacingChecked, setIsRacingCkecked] = useState(false);
  const [isShootingChecked, setIsShootingCkecked] = useState(false);
  const [isSportChecked, setIsSportCkecked] = useState(false);
  const [gameDetails, setGameDetails] = useState([]);

  const [gameSearchResultArr, setGameSearchResultArr] = useState([]);
  const [gameSearch, setGameSearch] = useState(false);

  const populerGameDetails = [...gameDetails];
  const latestGameDetails = [...gameDetails];

  populerGameDetails.sort((a, b) => b.downloadCount - a.downloadCount);
  latestGameDetails.sort(
    (a, b) => new Date(b.releasdate) - new Date(a.releasdate)
  );

  const actionGames = gameDetails.filter((game) => game.type === "action");
  const adventureGames = gameDetails.filter(
    (game) => game.type === "adventure"
  );
  const racingGames = gameDetails.filter((game) => game.type === "racing");
  const shooterGames = gameDetails.filter((game) => game.type === "shooter");
  const sportsGames = gameDetails.filter((game) => game.type === "sports");

  const allGameHandler = () => {
    setGameSearch(false);
    setIsAllCkecked(true);
    setIsActionCkecked(false);
    setIsAdventureCkecked(false);
    setIsRacingCkecked(false);
    setIsShootingCkecked(false);
    setIsSportCkecked(false);
  };

  const actionGameHandler = () => {
    setGameSearch(false);
    setIsAllCkecked(false);
    setIsActionCkecked(true);
    setIsAdventureCkecked(false);
    setIsRacingCkecked(false);
    setIsShootingCkecked(false);
    setIsSportCkecked(false);
  };

  const adventureGameHandler = () => {
    setGameSearch(false);
    setIsAllCkecked(false);
    setIsActionCkecked(false);
    setIsAdventureCkecked(true);
    setIsRacingCkecked(false);
    setIsShootingCkecked(false);
    setIsSportCkecked(false);
  };

  const racingGameHandler = () => {
    setGameSearch(false);
    setIsAllCkecked(false);
    setIsActionCkecked(false);
    setIsAdventureCkecked(false);
    setIsRacingCkecked(true);
    setIsShootingCkecked(false);
    setIsSportCkecked(false);
  };

  const shootingGameHandler = () => {
    setGameSearch(false);
    setIsAllCkecked(false);
    setIsActionCkecked(false);
    setIsAdventureCkecked(false);
    setIsRacingCkecked(false);
    setIsShootingCkecked(true);
    setIsSportCkecked(false);
  };

  const sportGameHandler = () => {
    setGameSearch(false);
    setIsAllCkecked(false);
    setIsActionCkecked(false);
    setIsAdventureCkecked(false);
    setIsRacingCkecked(false);
    setIsShootingCkecked(false);
    setIsSportCkecked(true);
  };

  //read all game details
  useEffect(() => {
    axios
      .get(`http://localhost:3001/${pageid}`)
      .then((result) => setGameDetails(result.data))
      .catch((err) => console.log(err));
  }, [pageid]);

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

  return (
    <div className="text-white">
      <Header navid="games" />
      <div className="relative">
        <div
          className="flex flex-col items-center justify-center -z-10 h-2/5 "
          style={{
            backgroundImage: `url(${require("../assets/games/mobilelegends.jpg")})`,
          }}
        >
          <div className="bg-[rgba(0,0,0,0.9)] absolute top-0 left-0 h-full w-full"></div>
          <h1 className="text-white text-center text-[40px] font-semibold z-10 mt-14">
            Explore the{" "}
            <span className="text-[#FF451D] font-bold">PINNACLE</span> world{" "}
            <br />
            for your taste of games.
          </h1>
          <div className=" w-1/2 p-[2px] bg-gradient-to-l from-[#FE7804] to-[#FF451D] rounded-2xl z-10 my-10">
            <input
              id="gameSearchbar"
              className=" bg-[#262628] text-[#FE7804] rounded-2xl w-full  px-3 py-2 placeholder-[#FE7804]"
              type="search"
              placeholder="Search Games...."
              onKeyUp={gamesSearch}
            />
          </div>
          <div className="z-10 mb-14" onClick={gamesSearch}>
            <div className="bg-[#FF451D] px-12 py-3 text-[#FF451D] font-semibold bg-opacity-20 text-opacity-20 mr-8">
              Explore
            </div>
            <div className="bg-gradient-to-tr from-[#FF451D] to-[#FE7804] px-12 py-3 text-white font-semibold ml-8 mt-[-30px]">
              Explore
            </div>
          </div>
        </div>
      </div>

      <div className="flex w-11/12 mx-auto my-8">
        <div
          className=" mr-10 w-[10%] p-[2px] bg-gradient-to-t from-[#FF451D] to-[#FE7804] relative rounded-3xl cursor-pointer"
          onClick={allGameHandler}
        >
          <div className=" text-center text-[#FE7804] px-7 py-2 bg-[#2A2B2F] rounded-3xl hover:bg-transparent hover:text-white">
            All
          </div>
        </div>
        <div className=" mr-10 w-[10%] p-[2px] bg-gradient-to-t from-[#FF451D] to-[#FE7804] relative rounded-3xl cursor-pointer">
          <div className=" text-center text-[#FE7804] px-7 py-2 bg-[#2A2B2F] rounded-3xl hover:bg-transparent hover:text-white">
            Action
          </div>
        </div>
        <div
          className=" mr-10 w-[10%] p-[2px] bg-gradient-to-t from-[#FF451D] to-[#FE7804] relative rounded-3xl cursor-pointer"
          onClick={adventureGameHandler}
        >
          <div className=" text-center text-[#FE7804] px-7 py-2 bg-[#2A2B2F] rounded-3xl hover:bg-transparent hover:text-white">
            Adventure
          </div>
        </div>
        <div
          className=" mr-10 w-[10%] p-[2px] bg-gradient-to-t from-[#FF451D] to-[#FE7804] relative rounded-3xl cursor-pointer"
          onClick={racingGameHandler}
        >
          <div className=" text-center text-[#FE7804] px-7 py-2 bg-[#2A2B2F] rounded-3xl hover:bg-transparent hover:text-white">
            Racing
          </div>
        </div>
        <div
          className=" mr-10 w-[10%] p-[2px] bg-gradient-to-t from-[#FF451D] to-[#FE7804] relative rounded-3xl cursor-pointer"
          onClick={shootingGameHandler}
        >
          <div className=" text-center text-[#FE7804] px-7 py-2 bg-[#2A2B2F] rounded-3xl hover:bg-transparent hover:text-white">
            Shooter
          </div>
        </div>
        <div
          className=" mr-10 w-[10%] p-[2px] bg-gradient-to-t from-[#FF451D] to-[#FE7804] relative rounded-3xl cursor-pointer"
          onClick={sportGameHandler}
        >
          <div className=" text-center text-[#FE7804] px-7 py-2 bg-[#2A2B2F] rounded-3xl hover:bg-transparent hover:text-white">
            Sport
          </div>
        </div>
      </div>

      {gameSearch && (
        <div>
          {gameSearchResultArr.length > 0 ? (
            <div className="w-11/12 mx-auto">
              <div>
                <h1 className="text-[28px] font-bold">Searched Results</h1>
                <div className="flex justify-between mt-5">
                  {gameSearchResultArr.slice(0, 3).map((item) => {
                    return (
                      <div className="p-0 m-0 w-[30%] rounded-lg">
                        <Link to={`/gamedetail?gameid=${item._id}`}>
                          <Game_Block_Card
                            price={item.price}
                            image={item.gameImageUrl}
                            imgsize="30"
                          />
                        </Link>
                      </div>
                    );
                  })}
                </div>
                <div className="flex flex-wrap justify-between">
                  {gameSearchResultArr.slice(3).map((item) => {
                    return (
                      <div className="p-0 m-0 w-[22%]">
                        <Link to={`/gamedetail?gameid=${item._id}`}>
                          <Game_Block_Card
                            price={item.price}
                            image={item.gameImageUrl}
                            imgsize="25"
                          />
                        </Link>
                      </div>
                    );
                  })}
                </div>
              </div>
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
        <div className="w-11/12 mx-auto">
          {isAllChecked && (
            <div>
              <h1 className="text-[28px] font-bold">TOP GAMES</h1>
              <div className="flex justify-between mt-5">
                {gameDetails.slice(0, 3).map((item) => {
                  return (
                    <div className="p-0 m-0 w-[30%] rounded-lg">
                      <Link to={`/gamedetail?gameid=${item._id}`}>
                        <Game_Block_Card
                          price={item.price}
                          image={item.gameImageUrl}
                          imgsize="30"
                        />
                      </Link>
                    </div>
                  );
                })}
              </div>
              <div className="flex flex-wrap justify-between">
                {gameDetails.slice(3).map((item) => {
                  return (
                    <div className="p-0 m-0 w-[22%]">
                      <Link to={`/gamedetail?gameid=${item._id}`}>
                        <Game_Block_Card
                          price={item.price}
                          image={item.gameImageUrl}
                          imgsize="25"
                        />
                      </Link>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {isActionChecked && (
            <div>
              <h1 className="text-[28px] font-bold">Action Games</h1>
              <div className="flex justify-between mt-5">
                {actionGames.slice(0, 3).map((item) => {
                  return (
                    <div className="p-0 m-0 w-[30%] rounded-lg">
                      <Link to={`/gamedetail?gameid=${item._id}`}>
                        <Game_Block_Card
                          price={item.price}
                          image={item.gameImageUrl}
                          imgsize="30"
                        />
                      </Link>
                    </div>
                  );
                })}
              </div>
              <div className="flex flex-wrap justify-between">
                {actionGames.slice(3).map((item) => {
                  return (
                    <div className="p-0 m-0 w-[22%]">
                      <Link to={`/gamedetail?gameid=${item._id}`}>
                        <Game_Block_Card
                          price={item.price}
                          image={item.gameImageUrl}
                          imgsize="25"
                        />
                      </Link>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {isAdventureChecked && (
            <div>
              <h1 className="text-[28px] font-bold">Adventure Games</h1>
              <div className="flex justify-between mt-5">
                {adventureGames.slice(0, 3).map((item) => {
                  return (
                    <div className="p-0 m-0 w-[30%] rounded-lg">
                      <Link to={`/gamedetail?gameid=${item._id}`}>
                        <Game_Block_Card
                          price={item.price}
                          image={item.gameImageUrl}
                          imgsize="30"
                        />
                      </Link>
                    </div>
                  );
                })}
              </div>
              <div className="flex flex-wrap justify-between">
                {adventureGames.slice(3).map((item) => {
                  return (
                    <div className="p-0 m-0 w-[22%]">
                      <Link to={`/gamedetail?gameid=${item._id}`}>
                        <Game_Block_Card
                          price={item.price}
                          image={item.gameImageUrl}
                          imgsize="25"
                        />
                      </Link>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {isRacingChecked && (
            <div>
              <h1 className="text-[28px] font-bold">Racing Games</h1>
              <div className="flex justify-between mt-5">
                {racingGames.slice(0, 3).map((item) => {
                  return (
                    <div className="p-0 m-0 w-[30%] rounded-lg">
                      <Link to={`/gamedetail?gameid=${item._id}`}>
                        <Game_Block_Card
                          price={item.price}
                          image={item.gameImageUrl}
                          imgsize="30"
                        />
                      </Link>
                    </div>
                  );
                })}
              </div>
              <div className="flex flex-wrap justify-between">
                {racingGames.slice(3).map((item) => {
                  return (
                    <div className="p-0 m-0 w-[22%]">
                      <Link to={`/gamedetail?gameid=${item._id}`}>
                        <Game_Block_Card
                          price={item.price}
                          image={item.gameImageUrl}
                          imgsize="25"
                        />
                      </Link>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {isShootingChecked && (
            <div>
              <h1 className="text-[28px] font-bold">Shooting Games</h1>
              <div className="flex justify-between mt-5">
                {shooterGames.slice(0, 3).map((item) => {
                  return (
                    <div className="p-0 m-0 w-[30%] rounded-lg">
                      <Link to={`/gamedetail?gameid=${item._id}`}>
                        <Game_Block_Card
                          price={item.price}
                          image={item.gameImageUrl}
                          imgsize="30"
                        />
                      </Link>
                    </div>
                  );
                })}
              </div>
              <div className="flex flex-wrap justify-between">
                {shooterGames.slice(3).map((item) => {
                  return (
                    <div className="p-0 m-0 w-[22%]">
                      <Link to={`/gamedetail?gameid=${item._id}`}>
                        <Game_Block_Card
                          price={item.price}
                          image={item.gameImageUrl}
                          imgsize="25"
                        />
                      </Link>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {isSportChecked && (
            <div>
              <h1 className="text-[28px] font-bold">Sport Games</h1>
              <div className="flex justify-between mt-5">
                {sportsGames.slice(0, 3).map((item) => {
                  return (
                    <div className="p-0 m-0 w-[30%] rounded-lg">
                      <Link to={`/gamedetail?gameid=${item._id}`}>
                        <Game_Block_Card
                          price={item.price}
                          image={item.gameImageUrl}
                          imgsize="30"
                        />
                      </Link>
                    </div>
                  );
                })}
              </div>
              <div className="flex flex-wrap justify-between">
                {sportsGames.slice(3).map((item) => {
                  return (
                    <div className="p-0 m-0 w-[22%]">
                      <Link to={`/gamedetail?gameid=${item._id}`}>
                        <Game_Block_Card
                          price={item.price}
                          image={item.gameImageUrl}
                          imgsize="25"
                        />
                      </Link>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      <div
        className="flex justify-between w-11/12 mx-auto my-14"
        style={{
          backgroundImage: `url(${require("../assets/games/section3bg.png")})`,
        }}
      >
        <div className="p-12 w-[45%]">
          <span className="text-[25px] font-semibold">
            Experience Excellence of
          </span>
          <br />
          <span className="text-[48px] font-bold leading-[60px]">
            <span className="text-[#FF451D] ">Pinnacle</span> with <br />
            <span className="text-[#FF451D]">Exclusive Pricing</span>
          </span>
          <br />
          <span className="text-[25px] font-semibold">
            for Your Favorite Games
          </span>
          <br />
        </div>

        <div className="p-12 w-[50%]">
          <span className="text-[28px] font-semibold">
            {" "}
            Purchase your favorite streamed game for
          </span>
          <ul className="leading-10 ">
            <li>
              <img
                className="inline-block mr-3 "
                width="12"
                height="12"
                src="https://img.icons8.com/tiny-glyph/32/FD7E14/checkmark.png"
                alt="checkmark"
              />
              Best price deals
            </li>
            <li>
              <img
                className="inline-block mr-3 "
                width="12"
                height="12"
                src="https://img.icons8.com/tiny-glyph/32/FD7E14/checkmark.png"
                alt="checkmark"
              />
              Share your game with anyone
            </li>
            <li>
              <img
                className="inline-block mr-3 "
                width="12"
                height="12"
                src="https://img.icons8.com/tiny-glyph/32/FD7E14/checkmark.png"
                alt="checkmark"
              />
              Exclusive discounts for premium members
            </li>
            <li>
              <img
                className="inline-block mr-3 "
                width="12"
                height="12"
                src="https://img.icons8.com/tiny-glyph/32/FD7E14/checkmark.png"
                alt="checkmark"
              />
              Enhanced privacy
            </li>
          </ul>
        </div>
      </div>

      <div className="w-11/12 mx-auto mt-9 mb-9">
        <h1 className="text-[28px] font-bold ">NEW RELEASES</h1>
        <div className="flex justify-between mt-7">
          {latestGameDetails.slice(0, 3).map((item) => {
            return (
              <div className="p-0 m-0 w-[30%] rounded-lg">
                <Link to={`/gamedetail?gameid=${item._id}`}>
                  <Game_Block_Card
                    price={item.price}
                    image={item.gameImageUrl}
                    imgsize="30"
                  />
                </Link>
              </div>
            );
          })}
        </div>
      </div>

      <div className="py-4 bg-black">
        <div className="w-11/12 mx-auto mt-9">
          <h1 className="text-[28px] font-bold">POPULAR GAMES</h1>
          <div className="flex justify-between mt-7">
            {populerGameDetails.slice(0, 3).map((item) => {
              return (
                <div className="p-0 m-0 w-[30%] rounded-lg">
                  <Link to={`/gamedetail?gameid=${item._id}`}>
                    <Game_Block_Card
                      price={item.price}
                      image={item.gameImageUrl}
                      imgsize="30"
                    />
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="w-11/12 mx-auto mt-9 mb-9">
        <h1 className="text-[28px] font-bold">MOST WANTED GAMES</h1>
        <div className="flex justify-between mt-7">
        {latestGameDetails.slice(0, 3).map((item) => {
            return (
              <div className="p-0 m-0 w-[30%] rounded-lg">
                <Link to={`/gamedetail?gameid=${item._id}`}>
                <Game_Block_Card
                  price={item.price}
                  image={item.gameImageUrl}
                  imgsize="30"
                />
                </Link>
              </div>
            );
          })}
        </div>
      </div>

      <Footer />
    </div>
  );
}
