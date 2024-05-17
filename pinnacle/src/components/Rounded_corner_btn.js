import React from 'react'
import './styles/Rounded_corner_btn.css'

export default function Rounded_corner_btn(props) {
  return (
    <div>
      <button className='btn'>{props.value}</button>
    </div>
  )
}
