import { useState,useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Navbar from './components/Navbar.jsx'
import axios from 'axios'



function App() {
  const [jokes, setJokes] = useState([]);
  
  useEffect(()=>{
     axios.get('http://localhost:5000/jokes')
     .then((response) =>{
      setJokes(response.data)
     })
     .catch((error)=>{
      console.log(error)
     })


  },[]);



  return (
    <>
    <h1>Charan kumar</h1>
    <p>Jokes:{jokes.length}</p>

    {
      jokes.map((jokes,index)=>(
        <div key = {jokes.id}>
          <h3>{jokes.title}</h3>
          <p>{jokes.joke}</p>
        </div>
      ))
    }



    </>
  )
}

export default App
