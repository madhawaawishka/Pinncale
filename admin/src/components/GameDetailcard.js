import React from 'react'

export default function GameDetailcard(props) {
  return (
    <div className="rounded-lg mb-9">
      <img src={props.image} alt="game image" className="rounded-t-lg"/>
      <div className="bg-[#1B1E20] py-2 px-4 flex relative rounded-b-lg">
        <div>
          <p className="text-white text-sm font-medium">
            {props.name}
          </p>
          </div>
        <div className=" absolute right-4 top-[2px]">
          
          
        </div>
      </div>
    </div>
  )
}
