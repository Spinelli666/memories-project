import axios from "axios"

import { useState, useEffect } from "react"

import { Link } from "react-router-dom"

import "./Home.css"

const Home = () => {

  const [memories, setMemories] = useState([])

  useEffect(() => {

    const getMemories = async() => {
      const res = await axios.get("/memories")

      setMemories(res.data)
    }

    getMemories()
  }, [])

  return (

    <div className="home">
      Home
    </div>
  )
}

export default Home
