import React from "react";
import cod2 from "../assets/games/cod2.jpg";

export default function Game_Block_Card(props) {
  return (
    <div className="group rounded-lg mb-9 overflow-hidden bg-[#1B1E20] flex flex-col h-full shadow-lg hover:shadow-orange-500/20 transition-all duration-300 border border-[#2e3235]/40 hover:border-[#FF451D]/60">
      <div className="w-full aspect-[16/10] bg-[#121415] overflow-hidden relative">
        <img
          src={props.image || cod2}
          alt="game cover"
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = cod2;
          }}
        />
      </div>
      <div className="bg-[#1B1E20] py-2.5 px-4 flex items-center justify-between relative rounded-b-lg mt-auto min-h-[46px]">
        <div className="flex items-center">
          <img
            className="mr-3 opacity-80 group-hover:opacity-100 transition-opacity"
            width={props.imgsize || 24}
            height={props.imgsize || 24}
            src="https://img.icons8.com/ios-filled/50/FFFFFF/windows-10.png"
            alt="windows-10"
          />
          <img
            className="mr-3 opacity-80 group-hover:opacity-100 transition-opacity"
            width={props.imgsize || 24}
            height={props.imgsize || 24}
            src="https://img.icons8.com/ios-filled/50/FFFFFF/linux.png"
            alt="linux"
          />
        </div>
        <div className="text-right">
          <p className="text-[#ffffff73] text-xs line-through leading-none">
            {typeof props.price === "number" && props.price > 0
              ? `$${(props.price + 5).toFixed(2)}`
              : ""}
          </p>
          <p className="text-[#FF451D] text-sm font-semibold leading-tight">
            {typeof props.price === "number"
              ? props.price === 0
                ? "Free to Play"
                : `$${props.price.toFixed(2)}`
              : ""}
          </p>
        </div>
      </div>
    </div>
  );
}
