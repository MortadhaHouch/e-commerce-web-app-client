/* eslint-disable no-unused-vars */
import { useTransition, Suspense, useContext, useEffect, useRef, useState } from "react";
import { store } from "../../reducers/store"
import { themeContext } from "../App";
import  fetchData from "../../utils/fetchData"
import { MdCollectionsBookmark, MdOutlineAlternateEmail, MdOutlineCancel, MdSchedule, MdUpdate, MdVisibility, MdVisibilityOff } from "react-icons/md";
import { AiFillDislike, AiFillEyeInvisible, AiFillLike, AiFillProfile, AiOutlineArrowLeft, AiOutlineArrowRight, AiOutlineComment, AiOutlineProfile, AiOutlineSend } from "react-icons/ai";
import { VscFeedback } from "react-icons/vsc";
import { jwtDecode } from "jwt-decode";
import { FaBookmark, FaEdit, FaEye, FaRegUser, FaUser } from "react-icons/fa";
import { BsCalendar2Date, BsPin, BsPinFill } from "react-icons/bs";
import moment from "moment";
import Loading from "./Loading";
import SwiperElement from "./SwiperElement";
import { IoNotifications } from "react-icons/io5";
import { DialogBox } from "./DialogBox";
import { gsapAnimationHandler } from "../../utils/animation";
import { LuUpload } from "react-icons/lu";
export default function Profile(){
    store.subscribe(()=>{
        console.log("local data store is connected");
    })
    let [userObjects,setUserObjects] = useState([]);
    let [userObject,setUserObject] = useState(null);
    let [componentName,setComponentName] = useState("planned-trips");
    let [tripsFilter,setTripsFilter] = useState("saved");
    let [isShown,setIsShown] = useState(false);
    let [isAsideShown,setIsAsideShown] = useState(false);
    let [faqObject, setFaqObject] = useState(null);
    let [feedbackObject,setFeedbackObject] = useState(null);
    let [savedTrips,setSavedTrips] = useState([]);
    let [comments,setComments] = useState([]);
    let [plannedTrips,setPlannedTrips] = useState([]);
    let [likedTrips,setLikedTrips] = useState([]);
    let [dislikedTrips,setDislikedTrips] = useState([]);
    let [postedFeedbacks,setPostedFeedbacks] = useState([]);
    let [postedFaqs,setPostedFaqs] = useState([]);
    let [notifications,setNotifications] = useState([]);
    let [isLoading,setIsLoading] = useState(false);
    let [numberOfPages,setNumberOfPages] = useState(0);
    let [numberOfNotifications,setNumberOfNotifications]=useState(0);
    let [unseenNotifications,setUnseenNotifications]=useState(0);
    let [pinnedNotifications,setPinnedNotifications]=useState([]);
    let [isPasswordVisible,setIsPasswordVisible]=useState(false);
    let [responseMessage,setResponseMessage]= useState("");
    let [firstName,setFirstName] = useState("");
    let [lastName,setLastName] = useState("");
    let [password,setPassword] = useState("");
    let [avatar,setAvatar] = useState("");
    let [editing,setEditing] = useState(false);
    let firstNameInputRef = useRef(null);
    let lastNameInputRef = useRef(null);
    let passwordInputRef = useRef(null);
    let [isPending,startTransition] = useTransition();
    let numberOfLikesPlannedTripsRef = useRef([]);
    let numberOfDisLikesPlannedTripsRef = useRef([]);
    let numberOfLikesSavedTripsRef = useRef([]);
    let numberOfDisLikesSavedTripsRef = useRef([]);
    let numberOfLikesLikedTripsRef = useRef([]);
    let numberOfDisLikesLikedTripsRef = useRef([]);
    let numberOfDisLikesDislikedTripsRef = useRef([]);
    let numberOfDisLikesFeedbacksRef = useRef([]);
    let numberOfLikesFeedbacksRef = useRef([]);
    let numberOfDisLikesFaqsRef = useRef([]);
    let numberOfLikesFaqsRef = useRef([]);
    let numberOfCommentsFaqRef = useRef([]);
    let numberOfCommentFeedbacksRef = useRef([]);
    let numberOfSavesPlannedTripsRef = useRef([]);
    let numberOfSavesSavedTripsRef = useRef([]);
    let numberOfSavesDislikedTripsRef = useRef([]);
    let numberOfSavesLikedTripsRef = useRef([]);
    let numberOfLikesDislikesTripsRef = useRef([]);
    let allNotificationsButtonsRef = useRef([]);
    let notificationRef = useRef();
    useEffect(()=>{
        setUserObjects(userObjects);
        return ()=>setUserObjects([]);
    },[userObjects])
    useEffect(()=>{
        setPlannedTrips(plannedTrips);
        console.log(plannedTrips)
        return ()=> setPlannedTrips([])
    },[plannedTrips])
    useEffect(()=>{
        setSavedTrips(savedTrips);
        console.log(savedTrips)
        return ()=> setSavedTrips([])
    },[savedTrips])
    useEffect(()=>{
        setLikedTrips(likedTrips)
        console.log(likedTrips)
        return ()=> setLikedTrips([])
    },[likedTrips])
    useEffect(()=>{
        setDislikedTrips(dislikedTrips)
        console.log(dislikedTrips)
        return ()=> setDislikedTrips([])
    },[dislikedTrips])
    useEffect(()=>{
        setPostedFeedbacks(postedFeedbacks)
        console.log(postedFeedbacks)
        return ()=> setPostedFeedbacks([])
    },[postedFeedbacks])
    useEffect(()=>{
        setPostedFaqs(postedFaqs)
        console.log(postedFaqs)
        return ()=> setPostedFaqs([])
    },[postedFaqs])
    useEffect(()=>{
        setComponentName(componentName);
        startTransition(getData);
        if(componentName.includes("trips")){
            gsapAnimationHandler("div.trip-details-container",{x:-20,filter:"blur(10px)",opacity:0},{x:0,filter:"blur(0px)",opacity:1},true)
        }else{
            gsapAnimationHandler("div.feedback-card",{x:-20,filter:"blur(10px)",opacity:0},{x:0,filter:"blur(0px)",opacity:1},true)
        }
        return ()=>setComponentName("");
    },[componentName]);
    useEffect(()=>{
        setTripsFilter(tripsFilter);
        return ()=>setTripsFilter([])
    },[tripsFilter])
    useEffect(()=>{
        setIsShown(isShown);
        return ()=>setIsShown(false);
    },[isShown])
    useEffect(()=>{
        setIsAsideShown(isAsideShown);
        return ()=>setIsAsideShown(false);
    },[isAsideShown])
    useEffect(()=>{
        setNotifications(notifications);
        console.log(notifications);
        return ()=>setNotifications([]);
    },[notifications]);
    useEffect(()=>{
        setComments(comments);
        return ()=>setComments([]);
    },[comments])
    useEffect(()=>{
        setUserObject(userObject);
        return ()=> setUserObject(null);
    },[userObject])
    useEffect(()=>{
        setFirstName(firstName);
        return ()=>setFirstName("");
    },[firstName])
    useEffect(()=>{
        setLastName(lastName);
        return ()=>setLastName("");
    },[lastName])
    useEffect(()=>{
        setPassword(password);
        return ()=>setPassword("");
    },[password]);
    let {isDark,setIsDark} = useContext(themeContext);
    async function getData(url){
        try {
            let request;
            switch (url){
                case "/trips/registered":
                    request = await fetchData(url,"GET",null,setIsLoading);
                    setPlannedTrips(jwtDecode(request.token).savedTrips);
                    break;
                case "/trips/saved":
                    request = await fetchData(url,"GET",null,setIsLoading);
                    setSavedTrips(jwtDecode(request.token).savedTrips);
                    break;
                case "/trips/liked":
                    request = await fetchData(url,"GET",null,setIsLoading);
                    break;
                case "/trips/disliked":
                    request = await fetchData(url,"GET",null,setIsLoading);
                    break;
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
        <main className="d-flex flex-column justify-content-center align-items-center" style={{
            backgroundColor:(isDark || JSON.parse(localStorage.getItem("isDark")))?"#070F2B":"#F2F1EB"
        }}>
            <ul className={`nav nav-tabs aside vertical ${isAsideShown?"shown":""}`} id="myTab" role="tablist">
                <button className="btn btn-primary tooltip-arrow" onClick={()=>setIsAsideShown(!isAsideShown)}>
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
                        className="nav-link active"
                        id="planned-trips-tab"
                        data-bs-toggle="tab"
                        data-bs-target="#planned-trips"
                        type="button"
                        role="tab"
                        aria-controls="planned-trips"
                        aria-selected="true"
                        onClick={()=>{
                            setComponentName("planned-trips");
                            getData("/trips/registered");
                        }}
                    >
                        <MdSchedule/><span className="mx-1">planned trips</span>
                    </button>
                </li>
                <li className="nav-item" role="presentation">
                    <button
                        className="nav-link"
                        id="saved-trips-tab"
                        data-bs-toggle="tab"
                        data-bs-target="#saved-trips"
                        type="button"
                        role="tab"
                        aria-controls="saved-trips"
                        aria-selected="false"
                        onClick={()=>{
                            setComponentName("saved-trips");
                            getData("/trips/saved");
                        }}
                    >
                        <MdCollectionsBookmark/><span className="mx-1">saved trips</span>
                    </button>
                </li>
                <li className="nav-item" role="presentation">
                    <button
                        className="nav-link"
                        id="liked-trips-tab"
                        data-bs-toggle="tab"
                        data-bs-target="#liked-trips"
                        type="button"
                        role="tab"
                        aria-controls="liked-trips"
                        aria-selected="false"
                        onClick={()=>{
                            setComponentName("liked-trips");
                            getData("/trips/liked");
                        }}
                    >
                        <AiFillLike/><span className="mx-1">liked trips</span>
                    </button>
                </li>
                <li className="nav-item" role="presentation">
                    <button
                        className="nav-link"
                        id="disliked-trips-tab"
                        data-bs-toggle="tab"
                        data-bs-target="#disliked-trips"
                        type="button"
                        role="tab"
                        aria-controls="disliked-trips"
                        aria-selected="false"
                        onClick={()=>{
                            setComponentName("disliked-trips");
                            getData("/trips/disliked");
                        }}
                    >
                        <AiFillDislike/><span className="mx-1">disliked trips</span>
                    </button>
                </li>
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
                        className="nav-link"
                        id="posted-faqs-tab"
                        data-bs-toggle="tab"
                        data-bs-target="#posted-faqs"
                        type="button"
                        role="tab"
                        aria-controls="posted-faqs"
                        aria-selected="false"
                        onClick={()=>{
                            setComponentName("notifications");
                            getData("/notifications");
                        }}
                    >
                        <IoNotifications/><span className="mx-1">notifications</span>
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
        {
            (isShown && faqObject) && (
                <DialogBox comments={comments} setComments={setComments} faqObject={faqObject} isShown={isShown} setIsShown={setIsShown}/>
            )
        }
        {
            (isShown && feedbackObject) && (
                <DialogBox feedbackObject={feedbackObject} comments={comments} setComments={setComments} isShown={isShown} setIsShown={setIsShown}/>
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
        {
            responseMessage && responseMessage.trim()!=="" && 
            (
                <div className={`notification`} ref={notificationRef} style={{
                    backgroundColor:(isDark || JSON.parse(localStorage.getItem("isDark")))?"rgb(59, 89, 152)":"rgb(0, 211, 63)"
                }}>
                    <p className={`form-label ${(isDark || JSON.parse(localStorage.getItem("isDark")))?"text-light":"text-dark"}`}>
                        {
                            responseMessage
                        }
                    </p>
                </div>
            )
        }
        </main>
    )
}
