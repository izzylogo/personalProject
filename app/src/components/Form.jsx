import React, { useState, useRef, useEffect } from 'react'
import { SiEthereum } from 'react-icons/si'
import { BsInfoCircle } from 'react-icons/bs'
import { providers, Contract } from 'ethers'
import { TODO_CONTRACT_ADDRESS, ABI } from '../constants/index'
import './form.css'
import TodoCard from './TodoCard'

const { ethereum } = window

const getTodoContract = () => {
  const provider = new providers.Web3Provider(ethereum)
  const signer = provider.getSigner()
  const todoContract = new Contract(TODO_CONTRACT_ADDRESS, ABI, signer)

  return todoContract
}

const Form = ({ name }) => {
  const [currentAddress, setCurrentAddress] = useState('')
  const [formData, setFormData] = useState({ keyword: '', detail: '' })
  const [loading, setLoading] = useState(false)
  const [todos, setTodos] = useState([])
  const [todoCount, setTodoCount] = useState(localStorage.getItem('transactionCount'))

  // function to connect the wallet
  const connectWallet = async () => {
    try {
      // checking if the browser has a wallet
      if (!ethereum) return alert('Please install metamask')

      // getting a request to connect to the wallet
      const accounts = await ethereum.request({
        method: 'eth_requestAccounts',
      })

      // setting it to the first account that is to be connected
      setCurrentAddress(accounts[0])
    } catch (error) {
      console.error(error)
      throw new Error('No ethereum object..')
    }
  }

  // Add todo
  const addTodo = async () => {
    try {
      if (!ethereum) return alert('Install Metamask')

      // getting the data from the form
      const { keyword, detail } = formData
      const todoContract = getTodoContract()
      const tx = await todoContract.addTodo(keyword, detail)
      setLoading(true)
      console.log(`loading - ${tx.hash}`)
      await tx.wait()
      console.log(`Succeccful - ${tx.hash}`)
      setLoading(false)
    } catch (error) {
      console.error(error)
    }
  }

  // Getting todo
  const getAllTodos = async () => {
    try {
      if (!ethereum) return alert('Install Metamask')
      const todoContract = getTodoContract()
      const allTodos = await todoContract.getAllTodos()
      const structuredTodo = allTodos.map((todo) => ({
        timestamp: new Date(todo.timestamp.toNumber() * 1000).toLocaleString(),
        detail: todo.detail,
        keyword: todo.keyword,
      }))
      console.log(structuredTodo)
      setTodos(structuredTodo)
    } catch (error) {
      console.error(error)
    }
  }

  // Checking if wallet is connected
  const checkIfWalletisConnected = async () => {
    try {
      if (!ethereum) return alert('Please install metamask')
      const accounts = await ethereum.request({
        method: 'eth_accounts', // you can use (method: "eth_requestAccounts") to connect automatically
      })

      if (accounts.length) {
        setCurrentAddress(accounts[0])

        getAllTodos()
      } else {
        console.log('No accounts found')
      }
    } catch (error) {
      console.error(error)
      throw new Error('No ethereum object')
    }
    // console.log(accounts)
  }

  const checkIfTransactionsExist = async () => {
    try {
      const todoContract = getTodoContract()
      const todoCount = await todoContract.getTodoNum()

      window.localStorage.setItem('todoCount', todoCount)
    } catch (error) {
      console.error(error)
      throw new Error('No ethereum object..')
    }
  }

  const handleChanges = (e) => {
    setFormData((prevState) => ({ ...prevState, [e.target.name]: e.target.value }))
  }

  const shortenAddress = (address) => `${address.slice(0, 5)}....${address.slice(address.length - 4)}`

  const handleSubmit = (e) => {
    const {keyword, detail} = formData
    e.preventDefault()
    if(!keyword || !detail) return
    addTodo()
    console.log('me')
  }

  useEffect(() => {
    checkIfWalletisConnected()
    checkIfTransactionsExist()
  }, [])

  return (
    <div className="f-body">
      <div className="form">
        <h1>{`${name} Todo`}</h1>
        <div className="header">
          <div className="intro">
            <h2>
              Writing a Todo list <br /> in the blockchain
            </h2>
            <p>
              Have fun writing your todo list <br /> on the blockchain with
              IzZyTodo
            </p>
            {!currentAddress && (
              <button onClick={connectWallet} className="connect">
                Connect Wallet
              </button>
            )}
          </div>
          <div className="boxInfo">
            <div className="ethIcon">
              <SiEthereum color="white" className='icon' fontSize={20}/>
              <BsInfoCircle color="white" className='icon2' fontSize={14}/>
            </div>
            <div className="acctInfo">
              <p>Account : {shortenAddress(currentAddress)}</p>
              <p>Ethereumn</p>
              <br />
              <span>NB: You will not be able to delete any of the todo you added</span>
            </div>
          </div>
        </div>
      </div>

      {/* Form */}
      <form>
        <div className="inputBody">
          <div className="inputs">
            <input
              type="text"
              placeholder="Todo keypoint"
              name="keyword"
              onChange={handleChanges}
              value={formData.keyword}
              required
            />
            <textarea
              placeholder="Todo Detail"
              name="detail"
              onChange={handleChanges}
              value={formData.detail}
              cols="40"
              rows="5"
            />
          </div>
          <div className="submit">
              {loading ? (
                <div className='loading'></div>
              ) : (
                <button type="submit" className='submitBtn' onClick={handleSubmit}>Submit</button>
              )} 
          </div>
        </div>
      </form>
      <div>
        {todos.reverse().map((todo, i) => (
          <TodoCard
            key={i}
            {...todo}
            keyword={todo.keyword}
            detail={todo.detail}
            timestamp={todo.timestamp}
          />
        ))}
      </div>
    </div>
  )
}

export default Form

// const [walletConnected, setWalletConnected] = useState(false)
// const [address, setAddress] = useState('')
// const [formData, setFormData] = useState({keyword: '', detail: ''})
// const [loading, setLoading] = useState(false)
// const [todoNum, setTodoNum] = useState('')
// const [todos, setTodos] = useState([])
// const web3ModalRef = useRef()

// // Handling the change in the input
// const handleChanges = (e, name) => {
//   setFormData((prevState) => ({...prevState, [name]: e.target.value}))
// }

// // Geeting the providers and the signers
// const getProviderOrSigner = async (needSigner = false) => {
//   // Connect to Metamask
//   const provider = await web3ModalRef.current.connect();
//   const web3Provider = new providers.Web3Provider(provider);

//   // If user is not connected to the Rinkeby network, let them know and throw an error
//   const { chainId } = await web3Provider.getNetwork();
//   if (chainId !== 4) {
//     window.alert("Change the network to Rinkeby");
//     throw new Error("Change network to Rinkeby");
//   }
//   if (needSigner) {
//     const signer = web3Provider.getSigner();
//     return signer;
//   }
//   return web3Provider;
// };

// // getting the todos
// const getAllTodo = async() => {
//   try {
//     const signer = await getProviderOrSigner(true)

//     const todoListContract = new Contract(
//       TODO_CONTRACT_ADDRESS,
//       ABI,
//       signer
//     )

//     const availableTodo = await todoListContract.getAllTodos()
//     const structuredTodo = availableTodo.map((todo) => ({
//       keyword: todo.keyword,
//       detail: todo.detail,
//       timestamp: new Date(todo.timestamp.toNumber() * 1000)
//     }))
//     console.log(structuredTodo)
//     setTodos(structuredTodo)
//   } catch (error) {
//     console.error(error)
//   }
// }

// // Adding the todoList
// const addTodos = async () => {
//   try {
//     const signer = await getProviderOrSigner(true);
//     const {keyword, detail} = formData
//     const todoListContract = new Contract(
//       TODO_CONTRACT_ADDRESS,
//       ABI,
//       signer
//     )

//     const tx = await todoListContract.addTodo(keyword, detail);
//     setLoading(true)
//     console.log(`loading - ${tx.hash}`)
//     await tx.wait()
//     setLoading(false)
//     console.log(`loading - ${tx.hash}`)

//     await getTodoNum()
//   } catch (error) {
//     console.error(error)
//   }
// }

// // Handling Submission
// const handleSubmit = (e) => {
//   e.preventDefault()
//   console.log('me')
//   addTodos()
// }

// //  Geeting the Number of todos
// const getTodoNum = async () => {
//   try {
//     const provider = await getProviderOrSigner()
//     const todoListContract = new Contract(
//       TODO_CONTRACT_ADDRESS,
//       ABI,
//       provider
//     )

//     const todoCount = todoListContract.getTodoNum()
//   setTodoNum(todoCount.toNumber())
//   } catch (error) {
//     console.error(error)
//   }
// }

//   // Getting the address of the wallet connected
//   const getAddress = async () => {
//     const provider = await web3ModalRef.current.connect();
//     const short = provider.selectedAddress
//     setAddress(`${short.slice(0, 5)}....${short.slice(short.length - 4)}`)
//     console.log(setAddress)
//   }

//   // Connecting the wallet
//   const connectWallet = async () => {
//     try {
//       await getProviderOrSigner();
//       setWalletConnected(true);
//       getAddress()
//       getAllTodo()

//       console.log(address)
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   // Using the useeffect hook so as the page renders it can call the function in the useEffect
//   useEffect(() => {
//     // if wallet is not connected, create a new instance of Web3Modal and connect the MetaMask wallet
//     if (!walletConnected) {
//       // Assign the Web3Modal class to the reference object by setting it's `current` value
//       // The `current` value is persisted throughout as long as this page is open
//       web3ModalRef.current = new Web3Modal({
//         network: "rinkeby",
//         providerOptions: {},
//         disableInjectedProvider: false,
//       });
//       connectWallet();
//     }
//   }, [walletConnected]);
