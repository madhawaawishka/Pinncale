import React, { useState } from 'react';
import axios from 'axios';

export default function BankDetailsCard(props) {
    const numberString = props.cardnumber.toString();
    const formattedNumber = `${numberString.slice(0, 4)} xxxx xxxx ${numberString.slice(-4)}`;

    const [isChecked, setIsChecked] = useState(false);

    const handleCheckboxChange = () => {
    setIsChecked(true);
    };
    
    const uncheckMenu = () => {
    setIsChecked(false);
    };

    const handleCardDelete = (id) =>{
      axios.delete('http://localhost:3001/deleteCardDeatils/'+id)
      .then(res => {console.log(res)
          window.location.reload()
      })
      .catch(errr => console.log(errr))
    }

    const [editForm, setEditForm] = useState();
    

    const editFormHandel = () => {
      setEditForm(true);
      setIsChecked(false)
    }

    const [cardName, setCardName] = useState(props.nickname)

    const Update = (e) => {
      e.preventDefault();
      axios.put("http://localhost:3001/updateNickName/"+props.id, { cardName })
      .then(result => {
          console.log(result);
          window.location.reload()
      })
      .catch(err => console.log(err));
  }

  return (
    <div className='relative p-3 mb-5 bg-white rounded-lg bg-opacity-20 hover:bg-opacity-30' onClick={uncheckMenu}>
      {!editForm && (<h1 className='text-lg font-bold text-white'>{props.nickname}</h1>)}
      
      {editForm && (<input className='text-lg font-bold text-[#FE7804] bg-transparent outline-none border- border-bnone focus:ring-0 border-b border-[#FE7804]' type='text' value={cardName} onChange={(e) => setCardName(e.target.value)}
      //check if enter pressed 
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
            Update(e); 
          }
        }} 
        />
      )}
      
      <p className='text-[#D9D9D9] text-base'>{formattedNumber}</p>
      <input type='checkbox' id={props.id} name='cardmenu' checked={isChecked} onChange={handleCheckboxChange}/>
      <label htmlFor={props.id}>
        <img className='absolute cursor-pointer top-3 right-2' width="25" height="25" src="https://img.icons8.com/ios-glyphs/30/FFFFFF/menu-2.png" alt="menu-2"/>
      </label>
      
      {isChecked && ( <div className='bg-[#1B1E20] w-1/3 absolute top-4 right-8 py-2 px-3 rounded-md'>
          <span className='text-white hover:text-[#FE7804] cursor-pointer' onClick={editFormHandel}>Edit nickname</span><br/>
          <span className='text-white hover:text-[#FE7804] cursor-pointer' onClick={(e) => handleCardDelete(props.id)}>Remove card</span>
        </div>
      )}
      
    </div>
  );
}
