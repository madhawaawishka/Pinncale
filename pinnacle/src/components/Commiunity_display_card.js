import React, {useState, useEffect} from "react";
import cod from "../assets/games/cod2.jpg";
import riban from "../assets/commiunity/riban.png";

export default function Commiunity_display_card(props) {
  const [dateDiff, setDateDiff] = useState(null);

  useEffect(() => {
    const currentDate = new Date();
    const futureDate = new Date(props.releasedate);

    // Calculate the difference in milliseconds
    const difference = futureDate.getTime() - currentDate.getTime();

    // Convert milliseconds to days
    const differenceInDays = Math.ceil(difference / (1000 * 3600 * 24));

    setDateDiff(differenceInDays);
  }, [props.releasedate]);

  return (
    <div className=" mt-8 p-4 relative text-white font-semibold">
      <div>
        <div className="absolute top-0 left-0 z-20">
          <img className=" w-[150px]" src={riban} />
          <p className=" absolute top-11 left-3 transform -rotate-45 text-[18px]">
           After {dateDiff} Days
          </p>
        </div>
        <img src={props.post} className=" rounded-lg" />
      </div>
      <div className=" bg-black p-7 z-10 w-[93%] h-[87%] absolute top-4 rounded-lg left-4 opacity-0 hover:opacity-90 text-center flex items-center">
        <div className=" w-full">
          <p className=" text-[18px] text-center w-full font-semibold mb-2">
            {props.name}
          </p>
          <p className=" text-center w-full text-[#ffffff64]">
            {props.description}
          </p>
        </div>
      </div>
    </div>
  );
}
