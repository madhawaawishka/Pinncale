import React from 'react'


export default function Button(props) {
  return (
    <div className="button">
            <div className='px-10 py-3 text-center text-white border-2 w-fit border-[#FE7804]'><span>{props.value}</span></div>
            <div className='px-10 py-3 text-center text-[#FE7804]  w-fit bg-[#FE7804] opacity-30'><span>{props.value}</span></div>
        </div>
  )
}
