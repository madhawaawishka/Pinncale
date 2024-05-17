import React from "react";
import cod2 from "../assets/games/cod2.jpg";

export default function Game_Block_Card(props) {
  return (
    <div className="rounded-lg mb-9">
      <img src={props.image} alt="game image" className="rounded-t-lg"/>
      <div className="bg-[#1B1E20] py-2 px-4 flex relative rounded-b-lg">
        <img
          className="mr-3"
          width={props.imgsize}
          height={props.imgsize}
          src="https://img.icons8.com/ios-filled/50/FFFFFF/windows-10.png"
          alt="windows-10"
        />
        <img
          className="mr-3"
          width={props.imgsize}
          height={props.imgsize}
          src="https://img.icons8.com/ios-filled/50/FFFFFF/linux.png"
          alt="linux"
        />
        <div className=" absolute right-4 top-[2px]">
          <p className="text-[#ffffff73] text-xs line-through">
            {typeof props.price === "number"
              ? `$${(props.price + 5).toFixed(2)}`
              : ""}
          </p>
          <p className="text-[#FF451D] text-sm font-medium">
            {typeof props.price === "number"
              ? `$${props.price.toFixed(2)}`
              : ""}
          </p>
        </div>
      </div>
    </div>
  );
}
