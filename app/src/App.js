import './App.css';
import BeginForm from './components/BeginForm';
import Form from './components/Form';
import {useState} from 'react'

function App() {
  const [inputText, setInputText] = useState('')
  const [name, setName] = useState('')
  const [start, setStart] = useState(true)

  const inputTextHandler = (e) => {
    setInputText(e.target.value)
  }

  const handleSubmit = (e) => {
      e.preventDefault()
      setName(inputText)
      setInputText('')
      setStart(true)
  }

  return (
    <div className='App'> 
      {start ? (
        <Form
          name={name}
          inputText={inputText}
          inputTextHandler={inputTextHandler}
          handleSubmit={handleSubmit}
          start={start}
        />
        ) : (
        <BeginForm
          inputText={inputText}
          inputTextHandler={inputTextHandler}
          handleSubmit={handleSubmit} 
        />
        )}
        
      
    </div>
  );
}

export default App;
