import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
import HeroFeatures from './hero'
import Card1 from './Components/Card1'

function App() {
  const [count, setCount] = useState(0)

  let myobjec = {
    username : "ganpat",
    age : 22
  }

  let myarr = [1,5,6,8]
  return (
    <>

      {/* <HeroFeatures/> */}
      
      <Card1 chaneel = "just checking" username="ganpat kumar" />
      <Card1 username="this is a fish"/>
      <Card1/>
      

    </>
  )
}

export default App
