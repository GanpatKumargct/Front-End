import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom'
import Layout from './Layout'
import Home from './components/Home/Home'
import About from './components/About/About'
import Contact from './components/Contact/ContactUs'
import User from './components/User/User'


//route done by nested array
// const router = createBrowserRouter([
//   {
//     path: '/',
//     element: <Layout />,
//     children: [
//       {
//         path: "",
//         element: <Home />
        
//       }, 
//       {
//         path : "about",
//         element: <About />
//       }, 
//       {
//         path : "contactUs",
//         element: <Contact />
//       }
//     ]
//   }
// ])

// Route done by withour array, by using the createBrowserRoute
const router = createBrowserRouter(
  createRoutesFromElements (
    <Route path='/' element={<Layout/>}>
      <Route path='' element={<Home/>}/>
      <Route path='about' element={<About/>}/>
      <Route path='contactUs' element={<Contact/>}/>
      <Route path='user/:id' element={<User/>}/>

    </Route>
  )
)
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
