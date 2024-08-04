/* eslint-disable no-unused-vars */
import {NavLink} from "react-router-dom"
import Logo from "./Logo"
import {gsapAnimationHandler} from "../../utils/animation"
import { useContext } from "react"
import { loginState } from "../App"
import { useCookies } from "react-cookie"
import { useDispatch, useSelector } from "react-redux"
import { store } from "../../reducers/store"
import { loginReducer } from "../../reducers/actions"
import { MdDarkMode } from "react-icons/md";
import { IoSunnyOutline } from "react-icons/io5";
import {themeContext} from "../App";
import { FaHome } from "react-icons/fa";
import { FaDirections } from "react-icons/fa";
import { MdFeedback } from "react-icons/md";
import { FaQuestion } from "react-icons/fa";
import { FaUserAlt } from "react-icons/fa";
import { MdSpaceDashboard } from "react-icons/md";
import { IoMdLogIn } from "react-icons/io";
import { AiOutlineLogout } from "react-icons/ai";
import  fetchData  from "../../utils/fetchData"
export const Header = () => {
    store.subscribe(()=>{
        console.log("local data store is connected");
    })
    // eslint-disable-next-line no-unused-vars
    let {isLoggedIn,setIsLoggedIn,isAdmin} = useContext(loginState);
    let {isDark,setIsDark} = useContext(themeContext);
    let [cookies,setCookie,removeCookie]=useCookies(["json_token"]);
    let checkIsAdmin = store.getState().isAdmin
    let checkIsLoggedIn =store.getState().isLoggedIn
    let dispatch = useDispatch();
    return (
        <header className="container-fluid text-primary d-flex justify-content-evenly align-items-start"
            style={{
                backgroundColor:(isDark || JSON.parse(localStorage.getItem("isDark")))?"rgba(33,37,41,.6)":"rgba(247, 238, 221, 0.6)"
            }}>
            <div className='d-flex justify-content-between align-items-center g-1 w-auto'>
                <NavLink to="/home" className="navbar-brand d-flex justify-content-between align-items-center">
                    <Logo isDark={isDark}/>
                    <h1 style={{color:(isDark || JSON.parse(localStorage.getItem("isDark")))?"#EEEEEE":"rgba(64, 31, 113, 0.75)"}}>
                        Guide Me
                    </h1>
                </NavLink>
            </div>
            <nav className="navbar navbar-expand-sm navbar-dark">
                <button
                    className="navbar-toggler d-lg-none"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#collapsibleNavId"
                    onClick={()=>{
                        gsapAnimationHandler(".nav-item",{opacity:0,stagger:0.25,x:-20},{opacity:1,stagger:0.25,x:0},true)
                    }}
                ><span className="navbar-toggler-icon"></span></button>
                <div className="collapse navbar-collapse" id="collapsibleNavId">
                    <ul className="navbar-nav me-auto mt-2 mt-lg-0">
                        <li className="nav-item">
                            <NavLink className="nav-link" to="/home" 
                            style={{
                                color:(isDark || JSON.parse(localStorage.getItem("isDark")))?"rgba(247, 238, 221, 0.5)":"rgba(64, 31, 113, 0.75)",
                            }}><FaHome /> home</NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink className="nav-link" to="/feedback" 
                            style={{
                                color:((isDark || JSON.parse(localStorage.getItem("isDark"))) || JSON.parse(localStorage.getItem("isDark")))?"rgba(247, 238, 221, 0.5)":"rgba(64, 31, 113, 0.75)",
                            }}><MdFeedback /> feedback</NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink className="nav-link" to="/faq" 
                            style={{
                                color:(isDark || JSON.parse(localStorage.getItem("isDark")))?"rgba(247, 238, 221, 0.5)":"rgba(64, 31, 113, 0.75)",
                            }}><FaQuestion /> faq</NavLink>
                        </li>
                        {
                            ((checkIsLoggedIn && checkIsAdmin.isAdmin) || (JSON.parse(localStorage.getItem("isLoggedIn")) && JSON.parse(localStorage.getItem("isAdmin"))==false)) &&(
                                <li className="nav-item">
                                    <NavLink className="nav-link" to="/profile" 
                                        style={{
                                            color:(isDark || JSON.parse(localStorage.getItem("isDark")))?"rgba(247, 238, 221, 0.5)":"rgba(64, 31, 113, 0.75)"
                                        }}>
                                        <FaUserAlt /> profile</NavLink>
                                </li>
                            )
                        }
                        {
                            ((checkIsLoggedIn && checkIsAdmin.isAdmin) || (JSON.parse(localStorage.getItem("isLoggedIn")) && JSON.parse(localStorage.getItem("isAdmin")))) &&(
                                <li className="nav-item">
                                    <NavLink className="nav-link" to="/dashboard" 
                                        style={{
                                            color:(isDark || JSON.parse(localStorage.getItem("isDark")))?"rgba(247, 238, 221, 0.5)":"rgb(33,37,41)"
                                        }}>
                                        <MdSpaceDashboard /> dashboard</NavLink>
                                </li>
                            )
                        }
                        {
                            ((!checkIsLoggedIn.isLoggedIn && checkIsAdmin.isAdmin==false) || (!JSON.parse(localStorage.getItem("isLoggedIn")) && JSON.parse(localStorage.getItem("isAdmin"))==false)) &&(
                                <>
                                </>
                            )
                        }
                        {
                            (checkIsLoggedIn.isLoggedIn || JSON.parse(localStorage.getItem("isLoggedIn"))) &&(
                                <li className="nav-item m-1">
                                    <img src={localStorage.getItem("avatar")} alt="" width={50} height={50} style={{objectFit:"cover",borderRadius:"50%"}}/>
                                </li>
                            )
                        }
                        {
                            (checkIsLoggedIn.isLoggedIn || JSON.parse(localStorage.getItem("isLoggedIn")))?(
                                <button className="btn btn-danger m-1" onClick={async()=>{
                                    try {
                                        await fetchData("/user/logout","POST",{email:localStorage.getItem("email")},setIsLoggedIn);
                                        setIsLoggedIn(false);
                                        dispatch(loginReducer("LOGOUT"))
                                        localStorage.setItem("isLoggedIn",false);
                                        localStorage.setItem("isAdmin",false);
                                        localStorage.removeItem("firstName");
                                        localStorage.removeItem("lastName");
                                        localStorage.removeItem("email");
                                        localStorage.removeItem("avatar");
                                        location.assign("/home")
                                        removeCookie("json_token",{
                                            expires:0,
                                            path:"/"
                                        })
                                    } catch (error) {
                                        console.log(error);
                                    }
                                }}><AiOutlineLogout /> logout</button>
                            ):(
                                <>
                                    <li className="nav-item">
                                        <NavLink className="nav-link" to="/user/login" 
                                        style={{
                                            color:(isDark || JSON.parse(localStorage.getItem("isDark")))?"rgba(247, 238, 221, 0.5)":"rgba(64, 31, 113, 0.75)"
                                        }}><IoMdLogIn /> login</NavLink>
                                    </li>
                                    <li className="nav-item">
                                        <NavLink className="nav-link" to="/user/signup" style={{
                                            color:(isDark || JSON.parse(localStorage.getItem("isDark")))?"rgba(247, 238, 221, 0.5)":"rgba(64, 31, 113, 0.75)"
                                        }}>signup</NavLink>
                                    </li>
                                </>
                            )
                        }
                        <li className="nav-item">
                            <button className="btn" onClick={()=>{
                                setIsDark(!isDark);
                                localStorage.setItem("isDark",`${!isDark}`);
                            }}>
                                {
                                    isDark?(
                                        <IoSunnyOutline size={25} color={(isDark || JSON.parse(localStorage.getItem("isDark")))?"rgba(247, 238, 221, 0.5)":"rgb(33,37,41)"}/>
                                    ):(
                                        <MdDarkMode size={25} color={(isDark || JSON.parse(localStorage.getItem("isDark")))?"rgba(247, 238, 221, 0.5)":"rgb(33,37,41)"}/>
                                    )
                                }
                            </button>
                        </li>
                    </ul>
                </div>
            </nav>
        </header>
    )
}
