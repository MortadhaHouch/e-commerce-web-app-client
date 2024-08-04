/* eslint-disable no-unused-vars */
import "../App.css"
import fetchData from "../../utils/fetchData"
import { useContext, useEffect, useState, useTransition } from "react";
import {useCookies} from "react-cookie"
import {loginState, themeContext} from "../App"
import {jwtDecode} from "jwt-decode"
import { NavLink } from "react-router-dom";
import {useDispatch} from "react-redux";
import { loginReducer,checkIsAdmin } from "../../reducers/actions.js";
import { store } from "../../reducers/store.js";
import sign from "jwt-encode"
import { IoMdLogIn } from "react-icons/io";
import Loading from "./Loading.jsx";
export const Login = () => {
    let [isLoading,setIsLoading] = useState(false);
    let [email,setEmail] = useState("");
    let [password,setPassword] = useState("");
    let [emailError,setEmailError] = useState("");
    let [passwordError,setPasswordError] = useState("");
    let [securityIssue,setSecurityIssue] = useState("");
    // eslint-disable-next-line no-unused-vars
    let [cookie,setCookie,removeCookie] = useCookies(["json_token"]);
    let [isPending,startTransition] = useTransition();
    let [successMessage,setSuccessMessage] = useState("");
    let [errorMessage,setErrorMessage] = useState("");
    let dispatch = useDispatch();
    store.subscribe(()=>{
        console.log("local data store is connected");
    })
    let {setIsLoggedIn,setIsAdmin} = useContext(loginState);
    async function handleSubmit(e){
        e.preventDefault();
        try {
            let response = await fetchData("/user/login","POST",{
                email:email.trim(),
                password:password.trim()
            },setIsLoading);
            console.log(jwtDecode(response.token));
            if(jwtDecode(response.token).email_error){
                setEmailError(jwtDecode(response.token).email_error);
                setIsLoggedIn(false);
                setIsAdmin(false);
                dispatch(loginReducer("LOGOUT"));
            }else{
                setEmailError("");
                setIsLoggedIn(false);
                setIsAdmin(false);
                dispatch(loginReducer("LOGOUT"));
            }
            if(jwtDecode(response.token).password_error){
                setPasswordError(jwtDecode(response.token).password_error);
                setIsLoggedIn(false);
                setIsAdmin(false);
                dispatch(loginReducer("LOGOUT"));
            }else{
                setPasswordError("");
                setIsLoggedIn(false);
                setIsAdmin(false);
                dispatch(loginReducer("LOGOUT"));
            }
            if(jwtDecode(response.token).security_error){
                setSecurityIssue(jwtDecode(response.token).security_error);
            }else{
                setSecurityIssue("");
            }
            if(!jwtDecode(response.token).password_error && !jwtDecode(response.token).email_error){
                setIsLoggedIn(true);
                dispatch(loginReducer("LOGIN"));
                localStorage.setItem("isLoggedIn",true);
                localStorage.setItem("firstName",jwtDecode(response.token).firstName);
                localStorage.setItem("lastName",jwtDecode(response.token).lastName);
                localStorage.setItem("isAdmin",jwtDecode(response.token).isAdmin);
                localStorage.setItem("email",jwtDecode(response.token).email);
                localStorage.setItem("avatar",jwtDecode(response.token).avatar);
                if(jwtDecode(response.token).isAdmin){
                    localStorage.setItem("isAdmin",true);
                    setIsAdmin(true);
                    dispatch(checkIsAdmin("ADMIN"));
                }else{
                    localStorage.setItem("isAdmin",false);
                    setIsAdmin(false);
                    dispatch(checkIsAdmin("USER"));
                }
                let maxAge=60*60*24*3;
                console.log(jwtDecode(response.token));
                let {email,isAdmin,firstName,lastName} = jwtDecode(response.token)
                setCookie('json_token',sign({email,isAdmin,firstName,lastName},import.meta.env.VITE_SECRET_KEY),{
                    maxAge,
                    path:"/"
                })
                e.target.reset();
                location.assign("/home");
            }
        } catch (error) {
            console.log(error);
        }
    }
    useEffect(()=>{
        setSecurityIssue(securityIssue);
        return ()=> setSecurityIssue("");
    },[securityIssue])
    useEffect(()=>{
        setSuccessMessage(successMessage);
        return ()=> setSuccessMessage("");
    },[successMessage])
    useEffect(()=>{
        setErrorMessage(errorMessage);
        return ()=> setErrorMessage("");
    },[errorMessage])
    let {isDark,setIsDark} = useContext(themeContext);
    return (
        <>
            <main className="d-flex flex-column justify-content-center align-items-center login-page" style={{
                background:(isDark || JSON.parse(localStorage.getItem("isDark")))?"#070F2B":"radial-gradient(circle at center, #fdfdfd 0%, #b4cbb7 100%)"
            }}>
                <section className="w-75 h-75 d-flex justify-content-center align-items-center">
                    <form action="" className="w-75 h-75 d-flex flex-column justify-content-center align-items-center" onSubmit={(e)=>{
                        handleSubmit(e)
                    }}>
                        <div className="mb-3 w-75 d-flex flex-column justify-content-start align-items-center">
                            <label htmlFor="email" className={`form-label ${(isDark || JSON.parse(localStorage.getItem("isDark")))?"text-light":"text-dark"}`}>Email</label>
                            <input
                                required
                                type="email"
                                className="form-control w-75"
                                name=""
                                id="email"
                                aria-describedby="emailHelpId"
                                placeholder="abc@mail.com"
                                onChange={(e)=>{
                                    setEmail(e.target.value)
                                }}
                                />
                                <p style={{
                                    color:(isDark || JSON.parse(localStorage.getItem("isDark")))?"rgb(255, 62, 62)":"rgb(255, 0, 0)"
                                }}>{emailError}</p>
                            </div>
                            <div className="mb-3 w-75 d-flex flex-column justify-content-start align-items-center">
                            <label htmlFor="password" className={`form-label ${(isDark || JSON.parse(localStorage.getItem("isDark")))?"text-light":"text-dark"}`}>Password</label>
                            <input
                                required
                                type="password"
                                className="form-control w-75"
                                name=""
                                id="password"
                                placeholder="password"
                                onChange={(e)=>{
                                    setPassword(e.target.value);
                                }}
                            />
                            <p style={{
                                color:(isDark || JSON.parse(localStorage.getItem("isDark")))?"rgb(255, 62, 62)":"rgb(255, 0, 0)"
                            }}>{passwordError}</p>
                        </div>
                        <button type="submit" className={`btn btn-primary ${isLoading?"disabled":""}`}>
                            <IoMdLogIn/> Login
                        </button>
                        <div className="w-100 h-auto d-flex flex-column justify-content-center align-items-center">
                            {
                                emailError?(
                                    <>
                                        <p style={{
                                            color:(isDark || JSON.parse(localStorage.getItem("isDark")))?"rgb(255, 62, 62)":"rgb(255, 0, 0)"
                                        }}>not logged in?? please signup</p>
                                        <li className="nav-item list-unstyled btn btn-warning">
                                            <NavLink className="nav-link" to="/user/signup">signup</NavLink>
                                        </li>
                                    </>
                                ):""
                            }
                            {
                                securityIssue &&(
                                    <>
                                        <p style={{
                                            color:(isDark || JSON.parse(localStorage.getItem("isDark")))?"#F2F1EB":"#070F2B"
                                        }}>Was that you?</p>
                                        <button className="btn btn-success" onClick={async()=>{
                                            try {
                                                let response = await fetchData("/user/login/success","POST",{success_message:"It was me"},setIsLoading);
                                                setSuccessMessage(jwtDecode(response.token).success_message);
                                            } catch (error) {
                                                console.log(error);
                                            }
                                        }}>Yse It was me</button>
                                        <button className="btn btn-danger" onClick={async()=>{
                                            try {
                                                let request = await fetchData("/user/login/failure","POST",{error_message:"It was not me"},setIsLoading);
                                                setErrorMessage(jwtDecode(request.token).error_message);
                                            } catch (error){
                                                console.log(error);
                                            }
                                        }}>No it was not me</button>
                                    </>
                                )
                            }
                        </div>
                    </form>
                    {
                        isPending &&(
                            <Loading/>
                        )
                    }
                </section>
            </main>
        </>
    )
}
