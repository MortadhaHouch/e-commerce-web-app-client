/* eslint-disable no-unused-vars */
import { Suspense, useContext, useDeferredValue, useEffect, useRef, useState,useTransition } from "react";
import { store } from "../../reducers/store"
import { themeContext } from "../App";
import  fetchData  from "../../utils/fetchData";
import { jwtDecode } from "jwt-decode";
import { MdOutlineAlternateEmail, MdPostAdd } from "react-icons/md";
import { AiFillEyeInvisible, AiFillLike, AiOutlineComment, AiOutlineSend } from "react-icons/ai"
import { AiFillDislike } from "react-icons/ai";
import { IoIosAddCircle } from "react-icons/io";
import { FaEdit, FaEye, FaQuestion } from "react-icons/fa";
import FaqIllustration from "./FaqIllustration"
import { BsCalendar2Date } from "react-icons/bs";
import moment from "moment";
import { DialogBox } from "./DialogBox";
import { gsapAnimationHandler } from "../../utils/animation";
import Loading from "./Loading";
export const Faq = () => {
  let [faq,setFaq] = useState("");
  let [componentName,setComponentName] = useState("add-faq");
  let [numberOfWords,setNumberOfWords] = useState(0);
  let [responseMessage,setResponseMessage]= useState("");
  let [faqs,setFaqs] = useState([]);
  let [isLoading,setIsLoading] = useState(false);
  let notificationRef = useRef();
  let [faqsCount,setFaqsCount] = useState(0);
  let [numberOfPages,setNumberOfPages] = useState(0);
  let buttonsRef = useRef([]);
  let [isVisibleByOther,setIsVisibleByOther] = useState(false);
  let [isPending,startTransition] = useTransition();
  let numberOfLikesRef = useRef([]);
  let numberOfDislikesRef = useRef([]);
  let numberOfCommentRef = useRef([]);
  let deferredValue = useDeferredValue(faqs);
  let [isShown,setIsShown] = useState(false);
  let [comments,setComments] = useState([]);
  let [faqObject, setFaqObject] = useState(null);
  function getNumberOfWords(text){
    let words = []
    text.split(" ").forEach(element => {
      words.push(element.trim())
    });
    return words.filter(Boolean).length;
  }
  store.subscribe(()=>{
    console.log("local data store is connected");
  })
  let {isDark,setIsDark} = useContext(themeContext);
  async function handleSubmit(e){
    e.preventDefault()
    try {
      let request = await fetchData("/faqs/add","POST",{
        faq:faq.trim(),
        email:localStorage.getItem("email")
      },setIsLoading)
      if(jwtDecode(request.message).message){
        setResponseMessage(jwtDecode(request.message).message);
        setFaq("");
        notificationRef?.current?.classList.remove("hidden");
        setTimeout(()=>{
          notificationRef?.current?.classList.add("hidden");
        },4000)
      }
    } catch (error) {
      console.log(error);
    }
  }
  async function getData(){
    try {
      let request = await fetchData("/faqs","GET",null,setIsLoading);
      setFaqs(jwtDecode(request.token).faqs);
      setFaqsCount(jwtDecode(request.token).faqsCount);
      setNumberOfPages(jwtDecode(request.token).numberOfPages);
    } catch (error) {
      console.log(error);
    }
  }
  useEffect(()=>{
    setComponentName(componentName);
    gsapAnimationHandler("p.p-indicator",{x:-20,filter:"blur(10px)",opacity:0},{x:0,filter:"blur(0px)",opacity:1},true)
    gsapAnimationHandler("div.feedback-card",{x:-20,filter:"blur(10px)",opacity:0},{x:0,filter:"blur(0px)",opacity:1},true)
    return ()=> setComponentName("")
  },[componentName])
  useEffect(()=>{
    setFaqs(deferredValue)
  },[deferredValue])
  useEffect(()=>{
    setNumberOfPages(numberOfPages);
    for (let index = 0; index < numberOfPages; index++){
      buttonsRef.current.push(index);
    }
    return ()=> buttonsRef.current = [];
  },[numberOfPages])
  useEffect(()=>{
    setComments(comments);
    return ()=>setComments([]);
  },[comments])
  useEffect(()=>{
    setFaqs(faqs);
    return ()=>setFaqs([]);
  },[faqs])
  useEffect(()=>{
    setFaqObject(faqObject);
    return ()=>setFaqObject(null);
  },[faqObject])
  return (
    <>
      <main className="d-flex flex-column justify-content-start align-items-center" style={{
          backgroundColor:(isDark || JSON.parse(localStorage.getItem("isDark")))?"#070F2B":"#F2F1EB"
        }}>
        <ul className="nav nav-tabs horizontal" id="myTab" role="tablist">
          <li className="nav-item" role="presentation">
            <button
              className="nav-link active"
              id="add-faq-tab"
              data-bs-toggle="tab"
              data-bs-target="#add-faq"
              type="button"
              role="tab"
              aria-controls="add-faq"
              aria-selected="true"
              onClick={()=>setComponentName("add-faq")}
            >
              <IoIosAddCircle /> add-faq
            </button>
          </li>
          <li className="nav-item" role="presentation">
            <button
              className="nav-link"
              id="faqs-tab"
              data-bs-toggle="tab"
              data-bs-target="#see-faqs-tab"
              type="button"
              role="tab"
              aria-controls="see-faqs-tab"
              aria-selected="false"
              onClick={()=>{
                setComponentName("see-faqs-tab")
                startTransition(getData);
              }}
            >
              <FaQuestion /> see-faqs
            </button>
          </li>
        </ul>
        <div className="tab-content w-100 h-100">
          <section
            className="tab-pane active w-100 h-100 d-flex justify-content-center align-items-center flex-wrap position-relative"
            id="add-faq"
            role="tabpanel"
            aria-labelledby="faq-tab"
          >
            <FaqIllustration/>
            {
              componentName == "add-faq" &&
              (
                <form action="" method="post" className="d-flex flex-column justify-content-center align-items-center w-50 h-100" onSubmit={handleSubmit}>
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
                  <div className="mb-3 w-75 h-75 d-flex flex-column justify-content-start align-items-center">
                    <label htmlFor="faq" className={`form-label ${(isDark || JSON.parse(localStorage.getItem("isDark")))?"text-light":"text-dark"}`}>Faq</label>
                    <textarea 
                      name="" 
                      id="" 
                      cols="30" 
                      rows="10" 
                      required
                      className={`form-control w-75 h-100 ${(isDark || JSON.parse(localStorage.getItem("isDark")))?"bg-dark text-light":"bg-light text-dark"}`}
                      placeholder="faq"
                      value={faq}
                      onChange={(e)=>{
                        setFaq(e.target.value)
                        setNumberOfWords(getNumberOfWords(faq))
                      }}
                      onBlur={(e)=>{
                        setNumberOfWords(getNumberOfWords(faq))
                      }}
                    ></textarea>
                  </div>
                    <p className={`form-label ${(isDark || JSON.parse(localStorage.getItem("isDark")))?"text-light":"text-dark"}`}>{numberOfWords} words
                    </p>
                  <button className="btn btn-primary" type="submit" disabled={JSON.parse(localStorage.getItem("isLoggedIn"))==false || faq.length == 0}><MdPostAdd size={20}/> post Faq</button>
                </form>
              )
            }
          </section>
          <section
            className="tab-pane w-100 h-100 feedback-cards-container d-flex justify-content-center align-items-center flex-wrap"
            id="see-faqs-tab"
            role="tabpanel"
            aria-labelledby="see-faqs-tab"
          >
            {
              isPending ?(
                <Loading/>
              ):
              (componentName == "see-faqs-tab" && (
                faqs.length !== 0 ? faqs.map((item,index)=>{
                  let formattedDate = moment(new Date(Number(item.addedOn))).format('MMMM Do YYYY, h:mm:ss a');
                  return(
                    <Suspense key={index} fallback="loading...">
                      <div className="feedback-card" style={{
                        boxShadow:(isDark || JSON.parse(localStorage.getItem("isDark")))?"2px 2px 4px 1px rgba(0,0,100,0.2),-2px -2px 4px 1px rgba(0,0,0,.2)":"2px 2px 4px 1px rgba(0,0,0,.2),-2px -2px 4px 1px rgba(255,255,255,0.2)",
                      }}>
                        <div>
                          <img src={item.userAvatar} alt="" className="avatar" style={{border:`3px solid ${item.isLoggedIn?"green":"red"}`}}/>
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
                        <div className="w-100 d-flex justify-content-between align-items-center">
                          <button className={`btn ${item.isLiked?'btn-primary':'btn-outline-primary'}`} disabled={!JSON.parse(localStorage.getItem("isLoggedIn"))}
                            onClick={async(e)=>{
                              try {
                                let request = await fetchData("/faqs/react","PUT",{id:item.id,email:localStorage.getItem("email"),reaction:"like"},setIsLoading);
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
                                  let request = await fetchData("/faqs/react","PUT",{id:item.id,email:localStorage.getItem("email"),reaction:"dislike"},setIsLoading);
                                  numberOfDislikesRef.current[index].textContent=jwtDecode(request.token).responseObject.numberOfDislikes;
                                  numberOfLikesRef.current[index].textContent=jwtDecode(request.token).responseObject.numberOfLikes;
                                } catch (error) {
                                  console.log(error);
                                }
                              }}>
                              <AiFillDislike size={20}/> <span ref={(el)=>numberOfDislikesRef.current.push(el)}>{item.numberOfDislikes}</span>
                            </button>
                            <button 
                              className={`btn btn-outline-primary ${(JSON.parse(localStorage.getItem("isLoggedIn")) && item.faqIsMine) ? "" : "disabled"}`} 
                              disabled={!(JSON.parse(localStorage.getItem("isLoggedIn")) && item.faqIsMine)}>
                              <FaEdit />
                            </button>
                          <button className="btn btn-outline-primary"
                            onClick={async()=>{
                              try {
                                let request = await fetchData("/comments/faq/"+item.id,"GET",null,setIsLoading);
                                console.log(jwtDecode(request.token).response);
                                setComments(jwtDecode(request.token).response);
                                setIsShown(true);
                                setFaqObject(item);
                                setFaqObject({...item,formattedDate});
                              } catch (error) {
                                console.log(error);
                              }
                            }}>
                            <AiOutlineComment/> <span ref={(el)=>numberOfCommentRef.current.push(el)}>{item.numberOfComments}</span>
                          </button>
                        </div>
                      </div>
                    </Suspense>
                  )
                }):(
                  <p className={`form-label ${(isDark || JSON.parse(localStorage.getItem("isDark")))?"text-light":"text-dark"}`}>No faqs are posted yet</p>
                )
              ))
            }
          </section>
          <div className="d-flex flex-row justify-content-center align-items-center">
            <ul className="nav nav-pills">
              {
                buttonsRef.current.map((_,index)=>{
                  return(
                    <li className="nav-item" key={index}>
                      <button className="btn btn-info" onClick={async()=>{
                        try {
                          let request = await fetchData(`/faqs?p=${index}`,"GET",null,setIsLoading);
                          // console.log(request);
                          setFaqs(jwtDecode(request.response).faqs);
                          setFaqsCount(jwtDecode(request.response).faqsCount);
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
        </div>
        {
          responseMessage && responseMessage.trim()!=="" && 
          (
            <div className={`d-flex flex-column justify-content-center align-items-center notification`} ref={notificationRef} style={{
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
          (isShown && faqObject) && (
            <DialogBox comments={comments} setComments={setComments} faqObject={faqObject} isShown={isShown} setIsShown={setIsShown}/>
          )
        }
        {
          isPending && (
            <Loading/>
          )
        }
      </main>
    </>
  )
}