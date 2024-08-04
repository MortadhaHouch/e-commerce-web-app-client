/* eslint-disable no-unused-vars */
import { useContext, useEffect, useState, useTransition } from "react";
import fetchData from "../../utils/fetchData"
import {useCookies} from "react-cookie"
import {loginState, themeContext} from "../App"
import {jwtDecode} from "jwt-decode"
import { store } from "../../reducers/store";
import { useDispatch } from "react-redux";
import { loginReducer } from "../../reducers/actions";
import { IoMan} from "react-icons/io5";
import { IoIosWoman, IoMdLogIn } from "react-icons/io";
import { LuUpload } from "react-icons/lu";
import fileReading from "../../utils/fileReading";
import sign from "jwt-encode"
import Loading from "./Loading";
export const Signup = () => {
    store.subscribe(()=>{
        console.log("local data store connected");
    })
    let [firstName,setFirstName] = useState("");
    let [lastName,setLastName] = useState("");
    let [email,setEmail] = useState("");
    let [password,setPassword] = useState("");
    let [isLoading,setIsLoading] = useState(false);
    let [emailError,setEmailError] = useState("");
    let [nameError,setNameError] = useState("");
    let [age,setAge] = useState("");
    let [isMale,setIsMale] = useState(null);
    let [avatar,setAvatar] = useState("");
    // eslint-disable-next-line no-unused-vars
    let [cookie,setCookie,removeCookie] = useCookies(["json_token"]);
    // eslint-disable-next-line no-unused-vars
    let {isLoggedIn,setIsLoggedIn} = useContext(loginState);
    let [isPending,startTransition] = useTransition();
    let dispatch = useDispatch();
    useEffect(()=>{
        setIsMale(isMale);
    },[isMale])
    useEffect(()=>{
        setAvatar(avatar)
    },[avatar])
    async function handleSubmit(e){
        e.preventDefault();
        try {
            let response = await fetchData("/user/signup","POST",{
                firstName:firstName.trim(),
                lastName:lastName.trim(),
                email:email.trim(),
                password:password.trim(),
                age,
                isMale,
                avatar
            },setIsLoading);
            console.log(response);
            if(jwtDecode(response.token).email_existence_error){
                setEmailError(jwtDecode(response.token).email_existence_error);
            }else{
                setEmailError("")
            }
            if(jwtDecode(response.token).firstName_existence_error){
                setNameError(jwtDecode(response.token).firstName_existence_error)
            }else{
                setNameError("")
            }
            if(!jwtDecode(response.token).email_existence_error && !jwtDecode(response.token).firstName_existence_error){
                localStorage.setItem("isLoggedIn",true);
                localStorage.setItem("firstName",jwtDecode(response.token).firstName);
                localStorage.setItem("lastName",jwtDecode(response.token).lastName);
                localStorage.setItem("isAdmin",jwtDecode(response.token).isAdmin);
                localStorage.setItem("email",jwtDecode(response.token).email);
                localStorage.setItem("avatar",jwtDecode(response.token).avatar);
                let maxAge=60*60*24*3;
                dispatch(loginReducer("LOGIN"));
                setIsLoggedIn(true);
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
    let {isDark,setIsDark} = useContext(themeContext);
    return (
        <>
            <main className="d-flex justify-content-center align-items-center signup-page" style={{
                background:(isDark || JSON.parse(localStorage.getItem("isDark")))?"#070F2B":"radial-gradient(circle at center, #fdfdfd 0%, #b4cbb7 100%)"
            }}>
                <section className="w-75 h-75 d-flex justify-content-center align-items-center">
                    <form action="" className="w-75 h-75 d-flex flex-column justify-content-center align-items-center" onSubmit={(e)=>{
                        startTransition(()=>handleSubmit(e))
                    }}>
                        <div className="mb-3 w-75 d-flex flex-column justify-content-start align-items-center">
                            <label htmlFor="first_name" className={`form-label ${(isDark || JSON.parse(localStorage.getItem("isDark")))?"text-light":"text-dark"}`}>first name</label>
                            <input
                                required
                                type="text"
                                className="form-control w-75"
                                name=""
                                id="first_name"
                                placeholder="name"
                                value={firstName}
                                onChange={(e)=>{
                                    setFirstName(e.target.value);
                                }}
                            />
                            <p style={{
                                color:(isDark || JSON.parse(localStorage.getItem("isDark")))?"rgb(255, 62, 62)":"rgb(255, 0, 0)"
                            }}>{nameError}</p>
                        </div>
                        <div className="mb-3 w-75 d-flex flex-column justify-content-start align-items-center">
                            <label htmlFor="last name" className={`form-label ${(isDark || JSON.parse(localStorage.getItem("isDark")))?"text-light":"text-dark"}`}>last name</label>
                            <input
                                required
                                type="text"
                                className="form-control w-75"
                                name=""
                                id="last name"
                                placeholder="last name"
                                value={lastName}
                                onChange={(e)=>{
                                    setLastName(e.target.value);
                                }}
                            />
                        </div>
                        <div className="d-flex justify-content-center align-items-center gap-2" data-bs-toggle="buttons">
                            <label className={"btn btn-outline-primary "+(isMale?"active":"")} onClick={()=>{
                                setIsMale(true);
                            }}>
                                <input type="radio" className="me-2 border-2 opacity-0" name="gender" autoComplete="off" width={0} height={0} required/>
                                <IoMan size={40}/>
                            </label>
                            <label className={"btn btn-outline-primary "+(isMale==false?"active":"")} onClick={()=>{
                                setIsMale(false);
                            }}>
                                <input type="radio" className="me-2 border-2 opacity-0" name="gender" autoComplete="off" width={0} height={0} required/>
                                <IoIosWoman size={40}/>
                            </label>
                        </div>
                        <div className="mb-3 w-75 d-flex flex-column justify-content-start align-items-center">
                            <label htmlFor="age" className={`form-label ${(isDark || JSON.parse(localStorage.getItem("isDark")))?"text-light":"text-dark"}`}>your birth date</label>
                            <input
                                required
                                type="date"
                                className="form-control w-75"
                                name=""
                                id="age"
                                placeholder="age"
                                value={age}
                                min={new Date((Date.now()- new Date(age))).getYear() < 18 ? 18 :null}
                                onChange={(e)=>{
                                    setAge(e.target.value);
                                }}
                            />
                        </div>
                        <div className="mb-3 w-75 d-flex flex-column justify-content-start align-items-center">
                            <div className="mb-3 file-upload-container">
                                <input
                                    title="add new destination"
                                    type="file"
                                    className="form-control"
                                    name="files"
                                    id=""
                                    placeholder=""
                                    aria-describedby="fileHelpId"
                                    accept="image/jpg, image/png, image/jpeg"
                                    required
                                    onChange={async (e)=>{
                                        let file = e.target.files[0];
                                        try {
                                            let dataURL = await fileReading(file);
                                            setAvatar(dataURL);
                                        } catch (error) {
                                            console.log(error);
                                        }
                                    }}
                                />
                                <LuUpload />
                            </div>
                            <div className="image-slide images-container">
                                {
                                    avatar && (<img src={avatar} alt="avatar" width={200} height={150} style={{borderRadius:15}}/>)
                                }
                            </div>
                        </div>
                        <div className="mb-3 w-75 d-flex flex-column justify-content-start align-items-center">
                            <label htmlFor="email" className={`form-label ${(isDark || JSON.parse(localStorage.getItem("isDark")))?"text-light":"text-dark"}`}>email</label>
                            <input
                                required
                                type="email"
                                className="form-control w-75"
                                name=""
                                id="email"
                                placeholder="abc@mail.com"
                                value={email}
                                onChange={(e)=>{
                                    setEmail(e.target.value);
                                }}
                            />
                            <p style={{
                                color:(isDark || JSON.parse(localStorage.getItem("isDark")))?"rgb(255, 62, 62)":"rgb(255, 0, 0)"
                            }}>{emailError}</p>
                        </div>
                        <div className="mb-3 w-75 d-flex flex-column justify-content-start align-items-center">
                            <label htmlFor="password" className={`form-label ${(isDark || JSON.parse(localStorage.getItem("isDark")))?"text-light":"text-dark"}`}>password</label>
                            <input
                                required
                                type="password"
                                className="form-control w-75"
                                name=""
                                id="password"
                                placeholder="password"
                                value={password}
                                onChange={(e)=>{
                                    setPassword(e.target.value);
                                }}
                            />
                        </div>
                        <button type="submit" className={`btn btn-primary ${isLoading?"disabled":""}`} disabled={(firstName=="" && lastName=="" && email=="" && password=="" && isLoading=="" && age=="" && isMale=="" && avatar=="") || isLoading==true}>
                        <IoMdLogIn/> Signup
                        </button>
                    </form>
                </section>
                {
                    isPending && (
                        <Loading/>
                    )
                }
            </main>
        </>
    )
}
