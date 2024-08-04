import React from 'react'
import ReactDOM from 'react-dom/client'
import 'bootstrap/dist/css/bootstrap.min.css';
import "bootstrap/dist/js/bootstrap";
import {createBrowserRouter,Route,RouterProvider,createRoutesFromElements} from "react-router-dom"
import {Login} from "./pages/Login"
import {Signup} from "./pages/Signup"
import {Feedback} from "../src/pages/Feedback"
import {Faq} from "../src/pages/Faq"
import "./App.css"
import { Error } from './pages/Error';
import {App} from './App';
import { Home } from './pages/Home';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import { store } from '../reducers/store';
store.subscribe(()=>{
  console.log("local data store is connected");
})
let {isAdmin,isLoggedIn} = store.getState();
let router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='' element={<App/>}>
      <Route path='home' element={<Home/>}/>
      <Route path='feedback' element={<Feedback/>}/>
      <Route path='faq' element={<Faq/>}/>
      {
        ((isLoggedIn.isLoggedIn && isAdmin.isAdmin) || (JSON.parse(localStorage.getItem("isLoggedIn")) && JSON.parse(localStorage.getItem("isAdmin")))) && (
          <Route path='dashboard' element={<Dashboard/>}/>
        )
      }
      {
        ((isLoggedIn.isLoggedIn && isAdmin.isAdmin==false) || (JSON.parse(localStorage.getItem("isLoggedIn")) && JSON.parse(localStorage.getItem("isAdmin")))==false) && (
          <Route path='profile' element={<Profile/>}/>
        )
      }
      <Route path='user'>
        <Route path='login' element={<Login/>}/>
        <Route path='signup' element={<Signup/>}/>
      </Route>
      <Route path='*' element={<Error/>}/>
    </Route>  
  )
)
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router}/>
  </React.StrictMode>,
)
