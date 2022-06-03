import React from 'react'
import './beginForm.css'
import {BsFillArrowRightCircleFill} from 'react-icons/bs'

const BeginForm = ({ inputText, inputTextHandler, handleSubmit }) => {
  return (
    <div className="beginForm">
      <h1>Welcome To Block Todo</h1>
      <h3>Please Insert Your name</h3>
      <form>
        <div className="beginInput">
          <input
            onChange={inputTextHandler}
            className="beginTodo"
            type="text"
            value={inputText}
            placeholder="Your name here"
            required
          />
          <button onClick={handleSubmit} type='submit' className='icon' fontSize={50}>{<BsFillArrowRightCircleFill/>}</button>
          {/* <div onClick={handleSubmit}>
            <input  className='btn' type="submit" value='' />
            <BsFillArrowRightCircleFill fontSize={50} className='icon'/>
          </div> */}
        </div>
      </form>
    </div>
  )
}

export default BeginForm
