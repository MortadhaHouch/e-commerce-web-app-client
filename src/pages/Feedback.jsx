/* eslint-disable no-unused-vars */
import { Suspense, useContext, useDeferredValue, useEffect, useRef, useState, useTransition } from "react";
import { store } from "../../reducers/store";
import { themeContext } from "../App";
import  fetchData  from "../../utils/fetchData";
import {jwtDecode} from "jwt-decode"
import { AiFillLike, AiOutlineComment, AiOutlineSend } from "react-icons/ai";
import { MdOutlineAlternateEmail } from "react-icons/md";
import { IoIosAddCircle } from "react-icons/io";
import { VscFeedback } from "react-icons/vsc";
import { AiFillDislike } from "react-icons/ai";
import { MdPostAdd } from "react-icons/md";
import { AiFillEyeInvisible } from "react-icons/ai";
import { FaEye } from "react-icons/fa";
import moment from "moment";
import { BsCalendar2Date } from "react-icons/bs";
import { FaEdit } from "react-icons/fa";
import FeedbackIllustration from "./FeedbackIllustration"
import { DialogBox } from "./DialogBox";
import Loading from "./Loading";
import { gsapAnimationHandler } from "../../utils/animation";
export const Feedback = () => {
    store.subscribe(()=>{
        console.log("local data store is connected");
    })
    let {isDark,setIsDark} = useContext(themeContext);
    let [feedback,setFeedback] = useState("");
    let [isLoading,setIsLoading] = useState(false);
    let [componentName,setComponentName] = useState("feedback");
    let [numberOfWords,setNumberOfWords] = useState(0);
    let [responseMessage,setResponseMessage]= useState("");
    let notificationRef = useRef();
    let [feedbacks,setFeedbacks] = useState([]);
    let [feedbackObject,setFeedbackObject] = useState(null);
    let [isVisibleByOther,setIsVisibleByOther] = useState(false);
    let [feedbacksCount,setFeedbacksCount] = useState(0);
    let [numberOfPages,setNumberOfPages] = useState(0);
    let [isPending,startTransition] = useTransition();
    let [isShown,setIsShown] = useState(false);
    let buttonsRef = useRef([]);
    let numberOfCommentRef = useRef([]);
    let numberOfLikesRef = useRef([]);
    let numberOfDislikesRef = useRef([]);
    let deferredValue = useDeferredValue(feedbacks);
    let [comments,setComments] = useState([]);
    async function handleSubmit(e){
        e.preventDefault();
        try {
            let request = await fetchData("/feedbacks/add","POST",{
                feedback:feedback.trim(),
                email:localStorage.getItem("email").trim(),
                isVisibleByOther
            },setIsLoading)
            if(jwtDecode(request.message).message){
                setResponseMessage(jwtDecode(request.message).message);
                setFeedback("");
                notificationRef?.current?.classList.remove("hidden");
                setTimeout(()=>{
                    notificationRef?.current?.classList.add("hidden");
                },4000)
            }
        } catch (error) {
            console.log(error);
        }
    }
    function getNumberOfWords(text){
        let words = []
        text.split(" ").forEach(element => {
            words.push(element.trim())
        });
        return words.filter(Boolean).length;
    }
    async function getData(){
        try {
            let request = await fetchData("/feedbacks","GET",null,setIsLoading);
            // console.log(request);
            setFeedbacks(jwtDecode(request.response).feedbacks);
            setFeedbacksCount(jwtDecode(request.response).feedbacksCount);
            setNumberOfPages(jwtDecode(request.response).numberOfPages);
            console.log(numberOfPages);
        } catch (error) {
            console.log(error);
        }
    }
    useEffect(()=>{
        setComponentName(componentName);
        startTransition(getData);
        gsapAnimationHandler("p.p-indicator",{x:-20,filter:"blur(10px)",opacity:0},{x:0,filter:"blur(0px)",opacity:1},true)
        gsapAnimationHandler("div.feedback-card",{x:-20,filter:"blur(10px)",opacity:0},{x:0,filter:"blur(0px)",opacity:1},true)
    },[componentName]);
    useEffect(()=>{
        setFeedbacks(deferredValue);
        return ()=>setFeedbacks([]);
    },[deferredValue])
    useEffect(()=>{
        setFeedbackObject(feedbackObject);
    },[feedbackObject])
    useEffect(()=>{
        setIsVisibleByOther(isVisibleByOther);
    },[isVisibleByOther])
    useEffect(()=>{
        setFeedbacksCount(feedbacksCount);
    },[feedbacksCount])
    useEffect(()=>{
        setNumberOfPages(numberOfPages);
        for (let index = 0; index < numberOfPages; index++) {
            buttonsRef.current.push(index);
        }
        return ()=> buttonsRef.current = [];
    },[numberOfPages])
    return (
        <>
            <main className="d-flex flex-column justify-content-start align-items-center w-100" style={{
                backgroundColor:(isDark || JSON.parse(localStorage.getItem("isDark")))?"#070F2B":"#F2F1EB"
            }}>
                <ul className="nav nav-tabs horizontal" id="myTab" role="tablist">
                    <li className="nav-item" role="presentation">
                        <button
                            className="nav-link active"
                            id="feedback-tab"
                            data-bs-toggle="tab"
                            data-bs-target="#feedback"
                            type="button"
                            role="tab"
                            aria-controls="feedback"
                            aria-selected="true"
                            onClick={()=>setComponentName("feedback")}
                        >
                            <IoIosAddCircle /> feedback
                        </button>
                    </li>
                    <li className="nav-item" role="presentation">
                        <button
                            className="nav-link"
                            id="feedbacks-tab"
                            data-bs-toggle="tab"
                            data-bs-target="#feedbacks"
                            type="button"
                            role="tab"
                            aria-controls="feedbacks"
                            aria-selected="false"
                            onClick={()=>{
                                setComponentName("feedbacks");
                                startTransition(getData);
                            }}
                        >
                            <VscFeedback /> feedbacks
                        </button>
                    </li>
                </ul>
                <div className="tab-content w-100 h-auto">
                    <section
                        className="tab-pane w-100 h-100 d-flex justify-content-center align-items-center flex-wrap active position-relative"
                        id="feedback-tab"
                        role="tabpanel"
                        aria-labelledby="feedback-tab"
                    >
                        <FeedbackIllustration/>
                        {
                            componentName == "feedback" && (
                                <form action="" method="post" className="d-flex flex-column justify-content-center align-items-center w-50 h-auto" onSubmit={handleSubmit}>
                                    <div className="dropdown open">
                                        <span
                                            className={`btn btn-secondary dropdown-toggle ${JSON.parse(localStorage.getItem("isLoggedIn"))?"":"disabled"}`}
                                            type="button"
                                            id="triggerId"
                                            data-bs-toggle="dropdown"
                                            aria-haspopup="true"
                                            aria-expanded="false"
                                        >
                                            {
                                                isVisibleByOther?(
                                                    <>
                                                        <FaEye /> everyone can see
                                                    </>
                                                ):(
                                                    <>
                                                        <AiFillEyeInvisible /> no one can see
                                                    </>
                                                )
                                            }
                                        </span>
                                        <div className="dropdown-menu" aria-labelledby="triggerId">
                                            <span className="dropdown-item" href="#"
                                                onClick={()=>{
                                                    setIsVisibleByOther(true);
                                                }}
                                            >
                                                <FaEye /> everyone
                                            </span>
                                            <span className="dropdown-item" href="#"
                                                onClick={()=>{
                                                    setIsVisibleByOther(false)
                                                }}
                                            >
                                                <AiFillEyeInvisible /> no one
                                            </span>
                                        </div>
                                    </div>
                                    <div className="mb-3 w-100 h-75 d-flex flex-column justify-content-start align-items-center">
                                        <label htmlFor="feedback" className={`form-label ${(isDark || JSON.parse(localStorage.getItem("isDark")))?"text-light":"text-dark"}`}>feedback</label>
                                        <textarea 
                                            name="feedback" 
                                            id="feedback" 
                                            cols="30" 
                                            rows="10" 
                                            required
                                            disabled={!JSON.parse(localStorage.getItem("isLoggedIn"))}
                                            className={`form-control w-75 h-100 ${(isDark || JSON.parse(localStorage.getItem("isDark")))?"bg-dark text-light":"bg-light text-dark"}`}
                                            value={feedback}
                                            onChange={(e)=>{
                                                setNumberOfWords(getNumberOfWords(feedback));
                                                setFeedback(e.target.value);
                                            }}
                                            onBlur={(e)=>{
                                                setNumberOfWords(getNumberOfWords(feedback));
                                            }}
                                        ></textarea>
                                        <p className={`${(isDark || JSON.parse(localStorage.getItem("isDark")))?"text-light":"text-dark"}`}>{numberOfWords} words</p>
                                    </div>
                                    <button
                                        type="submit"
                                        className="btn btn-primary"
                                        disabled={JSON.parse(localStorage.getItem("isLoggedIn"))==false || feedback.length == 0}
                                    >
                                        <MdPostAdd size={20}/> post feedback
                                    </button>
                                </form>
                            )
                        }
                    </section>
                    <section
                        className="tab-pane w-100 h-100 feedback-cards-container d-flex flex-column justify-content-center align-items-center"
                        id="feedbacks"
                        role="tabpanel"
                        aria-labelledby="feedbacks-tab"
                    >
                        <div className="d-flex flex-row justify-content-center align-items-center flex-wrap">
                            {
                                componentName == "feedbacks" && (
                                    isPending ?(
                                        <Loading/>
                                    ):
                                    feedbacks.length !== 0 ? feedbacks.map((item,index)=>{
                                        const formattedDate = moment(new Date(Number(item.addedOn))).format('MMMM Do YYYY, h:mm:ss a');
                                        return(
                                            <Suspense key={index} fallback={"loading..."}>
                                                <div className="feedback-card m-2" style={{
                                                    boxShadow:(isDark || JSON.parse(localStorage.getItem("isDark")))?"2px 2px 4px 1px rgba(0,0,100,0.2),-2px -2px 4px 1px rgba(0,0,0,.2)":"2px 2px 4px 1px rgba(0,0,0,.2),-2px -2px 4px 1px rgba(255,255,255,0.2)",
                                                }}>
                                                    <div>
                                                        <img src={item.userAvatar} alt="" style={{border:`3px solid ${item.isLoggedIn?"green":"red"}`}}/>
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
                                                    <div className="w-100 d-flex justify-content-between align-items-center">
                                                        <button className={`btn ${item.isLiked?'btn-primary':'btn-outline-primary'}`} disabled={!JSON.parse(localStorage.getItem("isLoggedIn"))}
                                                            onClick={async(e)=>{
                                                                try {
                                                                    let request = await fetchData("/feedbacks/react","PUT",{id:item.id,email:localStorage.getItem("email"),reaction:"like"},setIsLoading);
                                                                    numberOfDislikesRef.current[index].textContent=jwtDecode(request.token).responseObject.numberOfDislikes;
                                                                    numberOfLikesRef.current[index].textContent=jwtDecode(request.token).responseObject.numberOfLikes;
                                                                } catch (error) {
                                                                    console.log(error);
                                                                }
                                                            }}
                                                        >
                                                            <AiFillLike size={20}/> <span ref={(el)=>numberOfLikesRef.current.push(el)}>{item.numberOfLikes}</span>
                                                        </button>
                                                        <button className={`btn ${item.isDisliked?'btn-primary':'btn-outline-primary'}`} disabled={!JSON.parse(localStorage.getItem("isLoggedIn"))}
                                                            onClick={async(e)=>{
                                                                try {
                                                                    let request = await fetchData("/feedbacks/react","PUT",{id:item.id,email:localStorage.getItem("email"),reaction:"dislike"},setIsLoading);
                                                                    numberOfDislikesRef.current[index].textContent=jwtDecode(request.token).responseObject.numberOfDislikes;
                                                                    numberOfLikesRef.current[index].textContent=jwtDecode(request.token).responseObject.numberOfLikes;
                                                                } catch (error) {
                                                                    console.log(error);
                                                                }
                                                            }}>
                                                            <AiFillDislike size={20}/> <span ref={(el)=>numberOfDislikesRef.current.push(el)}>{item.numberOfDislikes}</span>
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
                                                            }}>
                                                            <AiOutlineComment/> <span ref={(el)=>numberOfCommentRef.current.push(el)}>{item.numberOfComments}</span>
                                                        </button>
                                                        <button 
                                                            className={`btn btn-outline-primary ${(JSON.parse(localStorage.getItem("isLoggedIn")) && item.feedbackIsMine) ? "" : "disabled"}`} 
                                                            disabled={!(JSON.parse(localStorage.getItem("isLoggedIn")) && item.feedbackIsMine)}>
                                                            <FaEdit />
                                                        </button>
                                                    </div>
                                                </div>
                                            </Suspense>
                                        )
                                    }):(
                                        <p className={`form-label ${(isDark || JSON.parse(localStorage.getItem("isDark")))?"text-light":"text-dark"}`}>No feedbacks are posted yet</p>
                                    )
                                )
                            }
                        </div>
                        {
                            componentName == "feedbacks" && feedbacksCount !== 0 && (
                                <div className="d-flex flex-row justify-content-center align-items-center">
                                    <ul className="nav nav-pills">
                                        {
                                            buttonsRef.current.map((_,index)=>{
                                                return(
                                                    <li className="nav-item" key={index}>
                                                        <button className="btn btn-info" onClick={async()=>{
                                                            try {
                                                                let request = await fetchData(`/feedbacks?p=${index}`,"GET",null,setIsLoading);
                                                                // console.log(request);
                                                                setFeedbacks(jwtDecode(request.response).feedbacks);
                                                                setFeedbacksCount(jwtDecode(request.response).feedbacksCount);
                                                                setNumberOfPages(jwtDecode(request.response).numberOfPages);
                                                            } catch (error) {
                                                                console.log(error);
                                                            }
                                                        }}>{index+1}</button>
                                                    </li>
                                                )
                                            })
                                        }
                                    </ul>
                                </div>
                            )
                        }
                    </section>
                </div>
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
                {
                    (isShown && feedbackObject) && (
                        <DialogBox feedbackObject={feedbackObject} comments={comments} setComments={setComments} isShown={isShown} setIsShown={setIsShown}/>
                    )
                }
            </main>
        </>
    )
}
