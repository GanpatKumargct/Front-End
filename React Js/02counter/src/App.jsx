import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'

function App() {

  let [counter, setCounter] = useState(10)
  // let counter = 15

  const addValue = () => {
    console.log("clicked", counter)
    counter = counter + 1
    setCounter(counter)
  }

  const removeValue = () => {
    console.log("clicked", counter)

    if (counter <= 0) {
      counter = 0
    } else {
      counter = counter - 1
      setCounter(counter)
    }

  }

  return (
    <>

      <h1>Lets Learn React </h1>
      <h2> Aiise hi kuch </h2>



      <button onClick={addValue}>Add Value {counter}</button>
      <button onClick={removeValue}>Remove Value {counter}</button>
      <footer>footer : {counter}</footer>
      <div className="ticks">jgj</div>

    </>
  )
}

export default App
