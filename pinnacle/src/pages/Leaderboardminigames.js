import React, {useState} from "react";
import Header from "../components/Header";
import PongGame from "../minigames/PongGame";
import TicTacToe from "../minigames/TicTacToe"

import tikimage from "../assets/leaderBoard/tictactor.png"
import Cards from '../minigames/Cards'; 
import Rockpaper from "../minigames/Rockpaper";

export default function Leaderboardminigames() {
  const [pongGameChecked, setPongGameChecked] = useState(false);
  const [ticTacToeGameChecked, setTicTacToeGameChecked] = useState(false);
  const [memoryGameChecked, setMemoryGameChecked] = useState(false);



return(
    <div>
      <Header navid="home" />
      <h1 className=" text-center text-[32px] font-bold text-[#FE7804] mt-9 mb-5">
        Mini Games in pinnacle
      </h1>
        <div className="flex mb-4 justify-between w-11/12 mx-auto">
          <img
          className=" w-[30%]"
                src={tikimage}
                alt="mastercard"
                onClick={() => setPongGameChecked(true)}
              />
              <img
                className=" w-[30%]"
                src={tikimage}
                alt="mastercard"
                onClick={() => setTicTacToeGameChecked(true)}
              />
              <img
                className=" w-[30%]"
                src={tikimage}
                alt="mastercard"

                onClick={() => setMemoryGameChecked(true)}

              />
            </div>

            {pongGameChecked && (<div className=" fixed bg-black bg-opacity-90 top-0 left-0 z-50 w-full h-screen">
              <PongGame/>

            </div>)}

            {ticTacToeGameChecked && (<div className=" fixed bg-black bg-opacity-90 top-0 left-0 z-50 w-full h-screen">
            <div className=' absolute top-[50px] left-[50px]' >
            <img onClick={() => setTicTacToeGameChecked(false)} className=' inline-block cursor-pointer' width="35" height="35" src="https://img.icons8.com/pulsar-line/48/FAB005/chevron-left.png" alt="chevron-left"/>
            <span onClick={() => setTicTacToeGameChecked(false)} className=' className=" text-[#FAB005] w-[30%]" ml-2 text-[18px] cursor-pointer'>Back</span>
            </div>
            <TicTacToe/>

            </div>)}
           
            {memoryGameChecked && (<div className=" fixed bg-black bg-opacity-90 top-0 left-0 z-50 w-full h-screen">
            <div className=' absolute top-[50px] left-[50px]' >
            <img onClick={() => setMemoryGameChecked(false)} className=' inline-block cursor-pointer' width="35" height="35" src="https://img.icons8.com/pulsar-line/48/FAB005/chevron-left.png" alt="chevron-left"/>
            <span onClick={() => setMemoryGameChecked(false)} className=' className=" text-[#FAB005] w-[30%]" ml-2 text-[18px] cursor-pointer'>Back</span>
            </div>
            <h1>Memory Game - React</h1>
            <Cards />
            </div>)}

            {pongGameChecked && (<div className=" fixed bg-black bg-opacity-90 top-0 left-0 z-50 w-full h-screen">
            <div className=' absolute top-[50px] left-[50px]' >
            <img onClick={() => setPongGameChecked(false)} className=' inline-block cursor-pointer' width="35" height="35" src="https://img.icons8.com/pulsar-line/48/FAB005/chevron-left.png" alt="chevron-left"/>
            <span onClick={() => setPongGameChecked(false)} className=' className=" text-[#FAB005] w-[30%]" ml-2 text-[18px] cursor-pointer'>Back</span>
            </div>
            <h1>Memory Game - React</h1>
            <Rockpaper/>

            </div>)}
    </div>
)
}
