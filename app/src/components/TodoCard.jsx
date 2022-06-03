import React from 'react'
import './todoCard.css'

const TodoCard = ({keyword, detail, timestamp}) => {
  return (
    <div className='todoCard'>
        <div className="todoDetail">
            <h3>keyword: {keyword}</h3>
            <p>Detail: {detail}</p>
            <p>Time: {timestamp}</p>
        </div>
    </div>
  )
}

export default TodoCard