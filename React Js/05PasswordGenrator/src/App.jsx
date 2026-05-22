import { useCallback, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  const [length, setLength] = useState(8)
  const [numberAllowed, setNumber] = useState(false)
  const [characterAllowed, setChar] = useState(false)
  const [password, setPassword] = useState("")

  const passwordGenerator = useCallback(
    () => {
      let pass = ""
      let str = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrestuvwxyz"
      if (numberAllowed) str += "0123456789"
      if (characterAllowed) str += "`!@#$%^&*(){}[]/"

      for (let i = 1; i <= Array.length; i++) {
        let char = Math.floor(Math.random() * str.length + 1)

        pass = str.charAt(char)

      }

      setPassword(pass)
    }, [length, numberAllowed, characterAllowed, setPassword]
  )
  return (
    <>
      <h1 className='text-6xl text-center m-4 text-white'>Password Generator</h1>

      <div className="w-full max-w-md mx-auto shadow-md rounded-lg px-4 py-3 my-8 bg-blue-800 text-orange-500">
        <h1 className='text-white text-center my-3'>Password generator</h1>
        <div className="flex shadow rounded-lg overflow-hidden mb-4">
          <input
            type="text"
            value={password}
            className="outline-none w-full py-1 px-3"
            placeholder="Password"
            readOnly
            ref={passwordRef}
          />
          <button
            onClick={copyPasswordToClipboard}
            className='outline-none bg-blue-700 text-white px-3 py-0.5 shrink-0'
          >copy</button>

        </div>
      </div>
    </>
  )
}

export default App
