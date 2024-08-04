/* eslint-disable no-unused-vars */
import FileUpload from "./FileUpload"
import { Suspense, useContext, useEffect, useRef, useState, useTransition } from "react";
import { AiFillDislike, AiFillEyeInvisible, AiFillLike, AiOutlineArrowLeft, AiOutlineArrowRight, AiOutlineComment } from "react-icons/ai";
import { themeContext,loginState } from "../App";
import { VscFeedback } from "react-icons/vsc";
import { MdCancel, MdCollectionsBookmark, MdDescription, MdEventSeat, MdOutlineAlternateEmail, MdOutlineCancel, MdSchedule, MdUpdate, MdVisibility, MdVisibilityOff } from "react-icons/md";
import {jwtDecode} from "jwt-decode"
import  fetchData  from "../../utils/fetchData";
import { FaBookmark, FaDirections, FaEdit, FaEye, FaUser } from "react-icons/fa";
import { BsCalendar2Date, BsCheck, BsPin, BsPinFill } from "react-icons/bs";
import Loading from "./Loading";
import { IoNotifications, IoTimeOutline } from "react-icons/io5";
import moment from "moment"
import { DialogBox } from "./DialogBox";
import { LuUpload } from "react-icons/lu";
export default function Aside(props) {
    let [componentName,setComponentName] = useState("users");
    let {isDark,setIsDark} = useContext(themeContext);
    let [isShown,setIsShown] = useState(false);
    let [isAsideShown,setIsAsideShown] = useState(false);
    let [postedFeedbacks,setPostedFeedbacks] = useState([]);
    let [postedFaqs,setPostedFaqs] = useState([]);
    let [isLoading,setIsLoading] = useState(false);
    let [notifications,setNotifications] = useState([]);
    let [comments,setComments] = useState([]);
    let {isLoggedIn,setIsLogged} = useContext(loginState);
    let [faqObject, setFaqObject] = useState(null);
    let [feedbackObject,setFeedbackObject] = useState(null);
    let [userObject,setUserObject] = useState(null);
    let [numberOfPages,setNumberOfPages] = useState(0);
    let [numberOfNotifications,setNumberOfNotifications]=useState(0);
    let [unseenNotifications,setUnseenNotifications]=useState(0);
    let [pinnedNotifications,setPinnedNotifications]=useState([]);
    let [isPasswordVisible,setIsPasswordVisible]=useState(false);
    let [firstName,setFirstName] = useState("");
    let [lastName,setLastName] = useState("");
    let [password,setPassword] = useState("");
    let [avatar,setAvatar] = useState("");
    let [editing,setEditing] = useState(false);
    let [isPending,startTransition] = useTransition();
    let numberOfDisLikesFeedbacksRef = useRef([]);
    let numberOfLikesFeedbacksRef = useRef([]);
    let numberOfDisLikesFaqsRef = useRef([]);
    let numberOfLikesFaqsRef = useRef([]);
    let numberOfCommentsFaqRef = useRef([]);
    let numberOfCommentFeedbacksRef = useRef([]);
    let allNotificationsButtonsRef = useRef([]);
    let firstNameInputRef = useRef(null);
    let lastNameInputRef = useRef(null);
    let passwordInputRef = useRef(null);
    async function getData(url){
        try {
            let request;
            switch (url){
                case "/feedbacks/posted":
                    request = await fetchData(url,"GET",null,setIsLoading);
                    setPostedFeedbacks(jwtDecode(request.token).response);
                    break;
                case "/faqs/posted":
                    request = await fetchData(url,"GET",null,setIsLoading);
                    setPostedFaqs(jwtDecode(request.token).response);
                    break;
                case "/user/profile":
                    request = await fetchData(url,"GET",null,setIsLoading);
                    setUserObject(jwtDecode(request.token).responseObject);
                    break;
                case "/notifications":
                    request = await fetchData(url,"GET",null,setIsLoading);
                    setNotifications(jwtDecode(request.token).myNotifications);
                    setNumberOfPages(jwtDecode(request.token).numberOfPages);
                    setNumberOfNotifications(jwtDecode(request.token).numberOfNotifications);
                    setUnseenNotifications(jwtDecode(request.token).unseenNotifications);
                    setPinnedNotifications(jwtDecode(request.token).pinnedNotificationsArray);
                    break;
                default:
                    break;
            }
        } catch (error) {
            console.log(error);
        }
    }
    return (
        <main className="d-flex flex-column justify-content-start align-items-center">
            <ul className={`nav nav-tabs aside vertical ${isAsideShown?"shown":""}`} role="tablist">
                <button className="btn btn-info tooltip-arrow" onClick={()=>setIsAsideShown(!isAsideShown)}>
                    {
                        isAsideShown?(
                            <AiOutlineArrowLeft color={(isDark || JSON.parse(localStorage.getItem("isDark")))?"#F2F1EB":"#070F2B"}/>
                        ):(
                            <AiOutlineArrowRight color={(isDark || JSON.parse(localStorage.getItem("isDark")))?"#F2F1EB":"#070F2B"}/>
                        )
                    }
                </button>
                <li className="nav-item" role="presentation">
                    <button
                        className="nav-link"
                        id="posted-feedbacks-tab"
                        data-bs-toggle="tab"
                        data-bs-target="#posted-feedbacks"
                        type="button"
                        role="tab"
                        aria-controls="posted-feedbacks"
                        aria-selected="false"
                        onClick={()=>{
                            setComponentName("posted-feedbacks");
                            getData("/feedbacks/posted");
                        }}
                    >
                        <VscFeedback /><span className="mx-1">posted feedbacks</span>
                    </button>
                </li>
                <li className="nav-item" role="presentation">
                    <button
                        className="nav-link"
                        id="posted-faqs-tab"
                        data-bs-toggle="tab"
                        data-bs-target="#posted-faqs"
                        type="button"
                        role="tab"
                        aria-controls="posted-faqs"
                        aria-selected="false"
                        onClick={()=>{
                            setComponentName("posted-faqs");
                            getData("/faqs/posted");
                        }}
                    >
                        <VscFeedback /><span className="mx-1">posted faqs</span>
                    </button>
                </li>
                <li className="nav-item" role="presentation">
                    <button
                        className="nav-link position-relative"
                        id="notifications-tab"
                        data-bs-toggle="tab"
                        data-bs-target="#notifications"
                        type="button"
                        role="tab"
                        aria-controls="notifications"
                        aria-selected="false"
                        onClick={()=>{
                            setComponentName("notifications");
                            getData("/notifications");
                        }}
                    >
                        <>
                            <IoNotifications/><span className="mx-1">notifications</span>
                            {
                                unseenNotifications!==0 && (
                                    <span 
                                    className="mx-1 bg-danger text-light text-center" 
                                    style={{
                                        borderRadius:"50%",
                                        width:"20px",
                                        height:"20px",
                                        position:"absolute",
                                        right:10,
                                        top:"auto",
                                        bottom:"auto"
                                    }}>{Intl.NumberFormat().format(unseenNotifications)}</span>
                                )
                            }
                        </>
                    </button>
                </li>
                <li className="nav-item" role="presentation">
                    <button
                        className="nav-link"
                        id="profile-tab"
                        data-bs-toggle="tab"
                        data-bs-target="#profile"
                        type="button"
                        role="tab"
                        aria-controls="profile-tab"
                        aria-selected="false"
                        onClick={()=>{
                            getData("/user/profile");
                            setComponentName("profile");
                        }}
                    >
                        <FaUser/><span className="mx-1">profile</span>
                    </button>
                </li>
            </ul>
            <section className="tab-content w-100 h-100 d-flex flex-row justify-content-center align-items-center">
                {
                    componentName == "fileUpload" && 
                    <FileUpload
                        className="tab-pane d-flex flex-row justify-content-center align-items-center p-3"
                        id="upload"
                        role="tabpanel"
                        ariaLabelledby="upload-tab"
                    />
                }
                {
                    componentName == "posted-feedbacks" && (
                        <section
                            className="tab-pane d-flex flex-row justify-content-center align-items-center flex-wrap feedback-cards-container p-3"
                            id="posted-feedbacks"
                            role="tabpanel"
                            aria-labelledby="posted-feedbacks"
                        >
                            {
                                postedFeedbacks && postedFeedbacks.length !== 0 ? postedFeedbacks.map((item,index)=>{
                                    const formattedDate = moment(new Date(Number(item.addedOn))).format('MMMM Do YYYY, h:mm:ss a');
                                    return(
                                        <Suspense key={index} fallback={<Loading/>}>
                                            <div className="feedback-card m-2" style={{
                                                boxShadow:(isDark || JSON.parse(localStorage.getItem("isDark")))?"2px 2px 4px 1px rgba(0,0,100,0.2),-2px -2px 4px 1px rgba(0,0,0,.2)":"2px 2px 4px 1px rgba(0,0,0,.2),-2px -2px 4px 1px rgba(255,255,255,0.2)",
                                            }}>
                                                <div>
                                                    <img src={item.userAvatar} alt="" />
                                                    <h4 className={`${(isDark || JSON.parse(localStorage.getItem("isDark")))?"text-light":"text-dark"}`}>{item.userFirstName} {item.userLastName}</h4>
                                                    <h5 className={`${(isDark || JSON.parse(localStorage.getItem("isDark")))?"text-light":"text-dark"} opacity-50`}><MdOutlineAlternateEmail /> {item.userEmail}</h5>
                                                </div>
                                                <>
                                                    {
                                                        item.isVisibleByOthers?(
                                                            <div className="w-100 d-flex flex-row justify-content-center align-items-center">
                                                                <FaEye className={`${(isDark || JSON.parse(localStorage.getItem("isDark")))?"text-light":"text-dark"}`}/>
                                                                <span className={`${(isDark || JSON.parse(localStorage.getItem("isDark")))?"text-light":"text-dark"}`}><BsCalendar2Date /> {formattedDate}</span>
                                                            </div>
                                                        ):(
                                                            <div className="w-100 d-flex flex-row justify-content-center align-items-center">
                                                                <AiFillEyeInvisible className={`${(isDark || JSON.parse(localStorage.getItem("isDark")))?"text-light":"text-dark"}`}/>
                                                                <span className={`${(isDark || JSON.parse(localStorage.getItem("isDark")))?"text-light":"text-dark"}`}><BsCalendar2Date /> {formattedDate}</span>
                                                            </div>
                                                        )
                                                    }
                                                </>
                                                <p className={`${(isDark || JSON.parse(localStorage.getItem("isDark")))?"text-light":"text-dark"}`}>{item.content}</p>
                                                <div className="w-100 d-flex justify-content-center align-items-center">
                                                    <button className={`btn ${item.isLiked?'btn-primary':'btn-outline-primary'}`} disabled={!JSON.parse(localStorage.getItem("isLoggedIn"))}
                                                        onClick={async(e)=>{
                                                            try {
                                                                let request = await fetchData("/feedbacks/react","PUT",{id:item.id,email:localStorage.getItem("email"),reaction:"like"},setIsLoading);
                                                                numberOfDisLikesFeedbacksRef.current[index].textContent=jwtDecode(request.token).responseObject.numberOfDisLikes;
                                                                numberOfLikesFeedbacksRef.current[index].textContent=jwtDecode(request.token).responseObject.numberOfLikes;
                                                            } catch (error) {
                                                                console.log(error);
                                                            }
                                                        }}
                                                    >
                                                        <AiFillLike size={20}/> <span ref={(el)=>numberOfLikesFeedbacksRef.current.push(el)}>{item.numberOfLikes}</span>
                                                    </button>
                                                    <button className={`btn ${item.isDisliked?'btn-primary':'btn-outline-primary'}`} disabled={!JSON.parse(localStorage.getItem("isLoggedIn"))}
                                                        onClick={async(e)=>{
                                                            try {
                                                                let request = await fetchData("/feedbacks/react","PUT",{id:item.id,email:localStorage.getItem("email"),reaction:"dislike"},setIsLoading);
                                                                numberOfDisLikesFeedbacksRef.current[index].textContent=jwtDecode(request.token).responseObject.numberOfDislikes;
                                                                numberOfLikesFeedbacksRef.current[index].textContent=jwtDecode(request.token).responseObject.numberOfLikes;
                                                            } catch (error) {
                                                                console.log(error);
                                                            }
                                                        }}>
                                                        <AiFillDislike size={20}/> <span ref={(el)=>numberOfDisLikesFeedbacksRef.current.push(el)}>{item.numberOfDislikes}</span>
                                                    </button>
                                                    <button className="btn btn-outline-primary"
                                                            onClick={async()=>{
                                                                try {
                                                                    let request = await fetchData("/comments/feedback/"+item.id,"GET",null,setIsLoading);
                                                                    console.log(jwtDecode(request.token).response);
                                                                    setComments(jwtDecode(request.token).response);
                                                                    setIsShown(true);
                                                                    setFeedbackObject({...item,formattedDate});
                                                                } catch (error) {
                                                                    console.log(error);
                                                                }
                                                            }}
                                                        >
                                                        <AiOutlineComment/> <span ref={(el)=>numberOfCommentFeedbacksRef.current.push(el)}>{item.numberOfComments}</span>
                                                    </button>
                                                </div>
                                            </div>
                                        </Suspense>
                                    )
                                }):(
                                    <p className={`form-label ${(isDark || JSON.parse(localStorage.getItem("isDark")))?"text-light":"text-dark"}`}>No feedbacks are posted yet</p>
                                )
                            }
                        </section>
                    )
                }
                {
                    componentName == "posted-faqs" && (
                        <section
                            className="tab-pane d-flex flex-row justify-content-center align-items-center flex-wrap feedback-cards-container p-3"
                            id="posted-faqs"
                            role="tabpanel"
                            aria-labelledby="posted-faqs"
                        >
                            {
                                postedFaqs && postedFaqs.length !== 0 ? postedFaqs.map((item,index)=>{
                                let formattedDate = moment(new Date(Number(item.addedOn))).format('MMMM Do YYYY, h:mm:ss a');
                                    return(
                                        <Suspense key={index} fallback={<Loading/>}>
                                            <div className="feedback-card" style={{
                                                boxShadow:(isDark || JSON.parse(localStorage.getItem("isDark")))?"2px 2px 4px 1px rgba(0,0,100,0.2),-2px -2px 4px 1px rgba(0,0,0,.2)":"2px 2px 4px 1px rgba(0,0,0,.2),-2px -2px 4px 1px rgba(255,255,255,0.2)",
                                            }}>
                                                <div>
                                                    <img src={item.userAvatar} alt="" className="avatar"/>
                                                    <h4 className={`${(isDark || JSON.parse(localStorage.getItem("isDark")))?"text-light":"text-dark"}`}>{item.userFirstName} {item.userLastName}</h4>
                                                    <h5 className={`${(isDark || JSON.parse(localStorage.getItem("isDark")))?"text-light":"text-dark"} opacity-75`}><MdOutlineAlternateEmail /> {item.userEmail}</h5>
                                                </div>
                                            <>
                                                {
                                                    item.isVisibleByOthers?(
                                                        <div className="w-100 d-flex flex-row justify-content-center align-items-center">
                                                            <FaEye className={`${(isDark || JSON.parse(localStorage.getItem("isDark")))?"text-light":"text-dark"}`}/>
                                                            <span className={`${(isDark || JSON.parse(localStorage.getItem("isDark")))?"text-light":"text-dark"}`}><BsCalendar2Date /> {formattedDate}</span>
                                                        </div>
                                                        ):(
                                                        <div className="w-100 d-flex flex-row justify-content-center align-items-center">
                                                            <AiFillEyeInvisible className={`${(isDark || JSON.parse(localStorage.getItem("isDark")))?"text-light":"text-dark"}`}/>
                                                            <span className={`${(isDark || JSON.parse(localStorage.getItem("isDark")))?"text-light":"text-dark"}`}><BsCalendar2Date /> {formattedDate}</span>
                                                        </div>
                                                    )
                                                }
                                            </>
                                                <p className={`${(isDark || JSON.parse(localStorage.getItem("isDark")))?"text-light":"text-dark"}`}>{item.content}</p>
                                            <div className="w-100 d-flex justify-content-center align-items-center">
                                                <button className={`btn ${item.isLiked?'btn-primary':'btn-outline-primary'}`} disabled={!JSON.parse(localStorage.getItem("isLoggedIn"))}
                                                    onClick={async(e)=>{
                                                        try {
                                                            let request = await fetchData("/faqs/react","PUT",{id:item.id,email:localStorage.getItem("email"),reaction:"like"},setIsLoading);
                                                            numberOfDisLikesFaqsRef.current[index].textContent=jwtDecode(request.token).responseObject.numberOfDislikes;
                                                            numberOfLikesFaqsRef.current[index].textContent=jwtDecode(request.token).responseObject.numberOfLikes;
                                                        } catch (error) {
                                                            console.log(error);
                                                        }
                                                    }}
                                                    >
                                                        <AiFillLike size={20}/> <span ref={(el)=>numberOfLikesFaqsRef.current.push(el)}>{item.numberOfLikes}</span>
                                                    </button>
                                                    <button className={`btn ${item.isDisliked?'btn-primary':'btn-outline-primary'}`} disabled={!JSON.parse(localStorage.getItem("isLoggedIn"))}
                                                        onClick={async(e)=>{
                                                            try {
                                                                let request = await fetchData("/faqs/react","PUT",{id:item.id,email:localStorage.getItem("email"),reaction:"dislike"},setIsLoading);
                                                                numberOfDisLikesFaqsRef.current[index].textContent=jwtDecode(request.token).responseObject.numberOfDisLikes;
                                                                numberOfLikesFaqsRef.current[index].textContent=jwtDecode(request.token).responseObject.numberOfLikes;
                                                            } catch (error) {
                                                                console.log(error);
                                                            }
                                                        }}>
                                                        <AiFillDislike size={20}/> <span ref={(el)=>numberOfDisLikesFaqsRef.current.push(el)}>{item.numberOfDislikes}</span>
                                                    </button>
                                                <button className="btn btn-outline-primary"
                                                    onClick={async()=>{
                                                        try {
                                                            let request = await fetchData("/comments/faq/"+item.id,"GET",null,setIsLoading);
                                                            console.log(jwtDecode(request.token).response);
                                                            setComments(jwtDecode(request.token).response);
                                                            setIsShown(true);
                                                            setFaqObject({...item,formattedDate});
                                                        } catch (error) {
                                                            console.log(error);
                                                        }
                                                    }}>
                                                    <AiOutlineComment/> <span ref={(el)=>numberOfCommentsFaqRef.current.push(el)}>{item.numberOfComments}</span>
                                                </button>
                                            </div>
                                        </div>
                                        </Suspense>
                                    )
                                }):(
                                    <p className={`form-label ${(isDark || JSON.parse(localStorage.getItem("isDark")))?"text-light":"text-dark"}`}>No faqs are posted yet</p>
                                )
                            }
                        </section>
                    )
                }
                {
                    componentName == "notifications" && (
                        <section
                            className="tab-pane d-flex flex-row justify-content-center align-items-center flex-wrap feedback-cards-container p-3 position-relative"
                            id="notifications-tab"
                            role="tabpanel"
                            aria-labelledby="notifications"
                        >
                            <span 
                                className={`${(isDark || JSON.parse(localStorage.getItem("isDark")))?"text-light":"text-dark"}`}
                                style={{
                                    position:"absolute",
                                    top: -20,
                                    left:"auto",
                                    right:"auto",
                                }}
                            >{numberOfNotifications} notifications total</span>
                            {
                                notifications && notifications.length!==0 ?(
                                    notifications.map((item,index)=>{
                                        let formattedDate = moment(new Date(Number(item.addedOn))).format('MMMM Do YYYY, h:mm:ss a');
                                        return(
                                            <Suspense key={index} fallback="loading...">
                                                <div className="feedback-card" style={{
                                                    boxShadow:(isDark || JSON.parse(localStorage.getItem("isDark")))?"2px 2px 4px 1px rgba(0,0,100,0.2),-2px -2px 4px 1px rgba(0,0,0,.2)":"2px 2px 4px 1px rgba(0,0,0,.2),-2px -2px 4px 1px rgba(255,255,255,0.2)",
                                                    backgroundColor:(isDark || JSON.parse(localStorage.getItem("isDark")))?"rgb(7, 15, 43)":"rgb(242, 241, 235)",
                                                    opacity:item.isSeen?"1":".75"
                                                }}>
                                                    <span
                                                        style={{
                                                            position:"absolute",
                                                            top: 10,
                                                            right:10,
                                                            color:(isDark || JSON.parse(localStorage.getItem("isDark")))?"rgb(255,255,255)":"rgb(0,0,0)",
                                                        }}
                                                        onClick={async()=>{
                                                            request = await fetchData("/notifications/pin","PUT",{
                                                                email:localStorage.getItem("email"),
                                                                pin:item.id
                                                            },setIsLoading);
                                                        }}
                                                    >
                                                    {
                                                        item.isPinned?(
                                                            <BsPinFill/>
                                                        ):(
                                                            <BsPin/>
                                                        )
                                                    }
                                                    </span>
                                                    <div>
                                                        <img src={item.userAvatar} alt="" className="avatar"/>
                                                        <h4 className={`${(isDark || JSON.parse(localStorage.getItem("isDark")))?"text-light":"text-dark"}`}>{item.firstName} {item.lastName}</h4>
                                                        <h5 className={`${(isDark || JSON.parse(localStorage.getItem("isDark")))?"text-light":"text-dark"} opacity-75`}><MdOutlineAlternateEmail /> {item.userEmail}</h5>
                                                    </div>
                                                    <span className={`${(isDark || JSON.parse(localStorage.getItem("isDark")))?"text-light":"text-dark"} w-100 text-start`}><BsCalendar2Date /> {formattedDate}</span>
                                                    <p className={`${(isDark || JSON.parse(localStorage.getItem("isDark")))?"text-light":"text-dark"}`}>{item.content}</p>
                                                    <button className={`btn btn-info ${item.isPrivate?"disabled":""}`} disabled={item.isPrivate} title={item.isPrivate?"this profile is private":"view profile"} 
                                                        onClick={async()=>{
                                                        try {
                                                            let request = await fetchData("/user/users/"+item.userId,"GET",null,setIsLoading);
                                                            if(jwtDecode(request.token).responseObject){
                                                                setUserObject({...jwtDecode(request.token).responseObject,isMyProfile:item.isMyProfile,addedOn:formattedDate});
                                                                if(item.isMyProfile){
                                                                    setComponentName("profile");
                                                                    setIsShown(false);
                                                                }else{
                                                                    setIsShown(true);
                                                                }
                                                            }else{
                                                                setUserObject(null);
                                                            }
                                                        } catch (error) {
                                                            console.log(error);
                                                        }
                                                    }}>{item.isMyProfile?"view my profile":"view user profile"}</button>
                                                </div>
                                            </Suspense>
                                        )
                                    })
                                ):(
                                    <p className={`form-label ${(isDark || JSON.parse(localStorage.getItem("isDark")))?"text-light":"text-dark"}`}>
                                        no notifications to be shown
                                    </p>
                                )
                            }
                            {
                                allNotificationsButtonsRef.current.map((_,index)=>{
                                    return(
                                        <button key={index} className="btn btn-info" onClick={async()=>{
                                            try{
                                                let request = await fetchData("/notifications","GET",null,setIsLoading);
                                                setNotifications(jwtDecode(request.token).myNotifications);
                                                setNumberOfPages(jwtDecode(request.token).numberOfPages);
                                                setNumberOfNotifications(jwtDecode(request.token).numberOfNotifications);
                                                setUnseenNotifications(jwtDecode(request.token).unseenNotifications);
                                            } catch (error){
                                                console.log(error);
                                            }
                                        }}>{index+1}</button>
                                    )
                                })
                            }
                        </section>
                    )
                }
                {
                    componentName == "profile" && userObject && userObject.isMyProfile && (
                        <section id="profile" className="tab-pane d-flex flex-row justify-content-center align-items-center flex-wrap feedback-cards-container w-75 p-3">
                            {
                                editing ?(
                                    <div className="mb-3 w-50 d-flex flex-column justify-content-start align-items-center position-relative">
                                        <MdOutlineCancel style={{
                                            position:"absolute",
                                            top:-20,
                                            right:-20,
                                            color:(isDark || JSON.parse(localStorage.getItem("isDark")))?"#F2F1EB":"#070F2B",
                                            cursor:"pointer",
                                            transform:"scale(1.5)"
                                        }}
                                            onClick={()=>{
                                                setEditing(!editing);
                                            }}
                                        />
                                        <div className="mb-3 w-100 d-flex flex-column justify-content-center align-items-center position-relative">
                                            <label 
                                            htmlFor="firstName" 
                                            className={`text-dark w-auto`}
                                            ref={firstNameInputRef}
                                            style={{
                                                position:"absolute",
                                                top:0,
                                                left:0,
                                            }}
                                            >change first name</label>
                                            <input 
                                                type="text" 
                                                name="" 
                                                id="firstName"
                                                onChange={(e)=>setFirstName(e.target.value)}
                                                onFocus={()=>{
                                                    firstNameInputRef.current.classList.add("active")
                                                }}
                                                onBlur={()=>{
                                                    if(firstName.trim().length ===0){
                                                        firstNameInputRef.current.classList.remove("active")
                                                    }
                                                }}
                                                className="form-control w-100"
                                            />
                                        </div>
                                        <div className="mb-3 w-100 d-flex flex-column justify-content-center align-items-center position-relative">
                                            <label 
                                                htmlFor="lastName"
                                                className={`text-dark w-auto`}
                                                ref={lastNameInputRef}
                                                style={{
                                                    position:"absolute",
                                                    top:0,
                                                    left:0,
                                                }}>change last name</label>
                                            <input 
                                                type="text" 
                                                name="" 
                                                id="lastName" 
                                                onChange={(e)=>setLastName(e.target.value)}
                                                onFocus={()=>{
                                                    lastNameInputRef.current.classList.add("active")
                                                }}
                                                onBlur={()=>{
                                                    if(lastName.trim().length ===0){
                                                        lastNameInputRef.current.classList.remove("active")
                                                    }
                                                }}
                                                className="form-control w-100"
                                        />
                                        </div>
                                        <div className="mb-3 w-100 d-flex flex-column justify-content-center align-items-center position-relative">
                                            <label 
                                                htmlFor="password"
                                                ref={passwordInputRef}
                                                className={`text-dark w-auto`}
                                                style={{
                                                    position:"absolute",
                                                    top:0,
                                                    left:0,
                                                }}
                                            >change password</label>
                                            <input 
                                                type={isPasswordVisible?"text":"password"} 
                                                name="" 
                                                id="password"
                                                onChange={(e)=>setPassword(e.target.value)}
                                                onFocus={()=>{
                                                    passwordInputRef.current.classList.add("active")
                                                }}
                                                onBlur={()=>{
                                                    if(password.trim().length ===0){
                                                        passwordInputRef.current.classList.remove("active")
                                                    }
                                                }}
                                                className="form-control w-100"
                                            />
                                            {
                                                isPasswordVisible?(
                                                    <MdVisibility style={{
                                                        color:(isDark || JSON.parse(localStorage.getItem("isDark")))?"#F2F1EB":"#070F2B",
                                                        position:"absolute",
                                                        right:-20,
                                                        transform:"scale(1.5)",
                                                        cursor:"pointer"
                                                    }}
                                                        onClick={()=>setIsPasswordVisible(!isPasswordVisible)}
                                                    />
                                                ):(
                                                    <MdVisibilityOff style={{
                                                        color:(isDark || JSON.parse(localStorage.getItem("isDark")))?"#F2F1EB":"#070F2B",
                                                        position:"absolute",
                                                        right:-20,
                                                        transform:"scale(1.5)",
                                                        cursor:"pointer"
                                                    }}
                                                        onClick={()=>setIsPasswordVisible(!isPasswordVisible)}
                                                    />
                                                )
                                            }
                                        </div>
                                        <div className="mb-3 w-100 d-flex flex-column justify-content-start align-items-center">
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
                                        <div className="mb-3 w-100 d-flex flex-column justify-content-start align-items-center">
                                            <button 
                                                className={`btn btn-info
                                                    ${(
                                                        firstName.trim().length == 0 ||
                                                        lastName.trim().length == 0 ||
                                                        password.trim().length == 0 ||
                                                        avatar.trim().length == 0
                                                    )
                                                    ?"disabled":""}`
                                                }
                                                disabled={
                                                    firstName.trim().length == 0 ||
                                                    lastName.trim().length == 0 ||
                                                    password.trim().length == 0 ||
                                                    avatar.trim().length == 0
                                                }
                                                onClick={async()=>{
                                                try {
                                                    let response = await fetchData("/user/profile/update","PUT",{
                                                        firstName,
                                                        lastName,
                                                        password,
                                                        avatar,
                                                        email:localStorage.getItem("email"),
                                                    },setIsLoading);
                                                    if(jwtDecode(response.token).message){
                                                        setResponseMessage(jwtDecode(response.token).message);
                                                        notificationRef?.current?.classList.remove("hidden");
                                                        localStorage.setItem("firstName",jwtDecode(response.token).firstName);
                                                        localStorage.setItem("lastName",jwtDecode(response.token).lastName);
                                                        localStorage.setItem("email",jwtDecode(response.token).email);
                                                        localStorage.setItem("avatar",jwtDecode(response.token).path);
                                                        setTimeout(()=>{
                                                            notificationRef?.current?.classList.add("hidden");
                                                        },4000)
                                                    }
                                                } catch (error) {
                                                    console.log(error);
                                                }
                                            }}><MdUpdate/> <span>update data</span></button>
                                        </div>
                                    </div>
                                ):(
                                <div 
                                    className="feedback-card w-50 h-100" 
                                    style={{
                                    boxShadow:(isDark || JSON.parse(localStorage.getItem("isDark")))?"2px 2px 4px 1px rgba(0,0,100,0.2),-2px -2px 4px 1px rgba(0,0,0,.2)":"2px 2px 4px 1px rgba(0,0,0,.2),-2px -2px 4px 1px rgba(255,255,255,0.2)",
                                    backgroundColor:(isDark || JSON.parse(localStorage.getItem("isDark")))?"rgb(7, 15, 43)":"rgb(242, 241, 235)",
                                }}>
                                    <FaEdit 
                                        style={{
                                            position:"absolute",
                                            top:10,
                                            right:10,
                                            color:(isDark || JSON.parse(localStorage.getItem("isDark")))?"rgb(255,255,255)":"rgb(0,0,0)",
                                            cursor:"pointer"
                                        }}
                                            onClick={()=>{
                                                setEditing(!editing);
                                            }}
                                        />
                                    <div>
                                        <img src={userObject.userAvatar} alt="" className="avatar"/>
                                        <h4 className={`${(isDark || JSON.parse(localStorage.getItem("isDark")))?"text-light":"text-dark"}`}>{userObject.firstName} {userObject.lastName}</h4>
                                        <h5 className={`${(isDark || JSON.parse(localStorage.getItem("isDark")))?"text-light":"text-dark"} opacity-75`}><MdOutlineAlternateEmail /> {userObject.email}</h5>
                                    </div>
                                </div>
                                )
                            }
                        </section>
                    )
                }
            </section>
        {
            (isShown && faqObject) && (
                <DialogBox comments={comments} setFaqObject={setFaqObject} setComments={setComments} faqObject={faqObject} isShown={isShown} setIsShown={setIsShown}/>
            )
        }
        {
            (isShown && feedbackObject) && (
                <DialogBox feedbackObject={feedbackObject} setFeedbackObject={setFeedbackObject} comments={comments} setComments={setComments} isShown={isShown} setIsShown={setIsShown}/>
            )
        }
        {
            (isShown && userObject && !userObject.isMyProfile) && (
                <DialogBox userObject={userObject} isShown={isShown} setIsShown={setIsShown} setUserObject={setUserObject}/>
            )
        }
        {
            isPending && (
                <Loading/>
            )
        }
        </main>
    )
}
