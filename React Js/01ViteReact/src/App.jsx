import React from "react"
import Hgrd from "./hgrd"

const reactElement = React.createElement(

  'a', {href : 'https://goggle.com', target:'_blank'}, 'click me'
)

function App() {


  return (
    // reactElement
    <>
      reactElement
      <Hgrd />
      <h1>Hello World </h1>
    </>
  )
}

export default App
