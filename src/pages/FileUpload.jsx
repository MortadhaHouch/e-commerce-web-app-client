/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { Suspense, useContext, useEffect, useState } from "react";
import { themeContext } from "../App";
import { LuUpload } from "react-icons/lu";
import fileReading from "../../utils/fileReading";
import  fetchData  from "../../utils/fetchData";
import Loading from "./Loading";
export default function FileUpload(props) {
    let {isDark,setIsDark} = useContext(themeContext);
    let [title,setTitle] = useState("");
    let [description,setDescription] = useState("");
    let [isLoading,setIsLoading] = useState(false);
    let [period,setPeriod] = useState("");
    let [date,setDate] = useState("");
    let [images,setImages] = useState([]);
    let [message,setMessage] = useState("");
    let [price,setPrice] = useState("");
    useEffect(()=>{
        setImages(images);
        return ()=> setImages([]); 
    },[images])
    useEffect(()=>{
        setPrice(price)
    },[price])
    async function handleSubmit(e){
        e.preventDefault();
        try {
            let request = await fetchData("/trips/add","POST",{
                images,
                title:title.trim(),
                description:description.trim(),
                period,
                date:Number(date),
                price:Number(price)
            },setIsLoading)
            setMessage(request.message);
            console.log(message);
        } catch (error) {
            console.log(error);
        }
    }
    return (
        <main  className={`d-flex flex-column justify-content-center align-items-center w-100 h-100 ${props.className}`}
            role={props.role}
            aria-labelledby={props.ariaLabelledby} style={{
                backgroundColor:(isDark || JSON.parse(localStorage.getItem("isDark")))?"#070F2B":"#F2F1EB"
            }}>
            <form action="" className="w-50 h-auto d-flex flex-column justify-content-center align-items-center" style={{
                    color:(isDark || JSON.parse(localStorage.getItem("isDark")))?"lightgrey":"#070F2B"
                }} onSubmit={handleSubmit}>
                <div className="mb-3 file-upload-container">
                <input
                    title="add new destination"
                    type="file"
                    className="form-control"
                    name="files"
                    id=""
                    placeholder=""
                    aria-describedby="fileHelpId"
                    required
                    multiple
                    accept="image/jpg, image/png, image/jpeg"
                    onChange={async (e)=>{
                        let {files} = e.target;
                        try {
                            let dataURLs = [];
                            for (const file of files) {
                                let dataURL = await fileReading(file);
                                dataURLs.push(dataURL);
                            }
                            setImages(dataURLs);
                        } catch (error) {
                            console.log(error);
                        }
                    }}
                />
                <LuUpload />
            </div>
            <div className="images-container w-100 h-auto d-flex flex-row justify-content-center align-items-center g-1">
                    {
                        images.length!==0 && images.map((item,index)=>{
                            return(
                                <div key={index}>
                                    <Suspense fallback={<Loading/>}>
                                        <img src={item} alt="image"/>
                                    </Suspense>
                                </div>
                            )
                        })
                    }
            </div>
            <div className="mb-3 w-75">
                <label htmlFor="title" className="form-label">add new destination title</label>
                <input
                    title="add title"
                    type="text"
                    className="form-control"
                    name="title"
                    id=""
                    placeholder="destination title"
                    aria-describedby="fileHelpId"
                    required
                    onChange={(e)=>{setTitle(e.target.value)}}
                    value={title}
                />
            </div>
            <div className="mb-3 w-75">
                <label htmlFor="period" className="form-label">add trip period</label>
                <input 
                    type="number"
                    className="form-control" 
                    name="period" 
                    id="trip period" 
                    onChange={(e)=>{setPeriod(e.target.value)}}
                    value={period}
                    required
                    placeholder="trip period"
                />
            </div>
            <div className="mb-3 w-75">
                <label htmlFor="date" className="form-label">add period date</label>
                <input 
                    type="date"
                    className="form-control" 
                    name="description" 
                    id="" 
                    onChange={(e)=>{setDate(e.target.value)}}
                    value={date}
                    required
                    placeholder="period date"
                />
            </div>
            <div className="mb-3 w-75">
                <label htmlFor="description" className="form-label">add trip description</label>
                <textarea 
                    className="form-control" 
                    name="description" 
                    id="" 
                    rows="3"
                    onChange={(e)=>{setDescription(e.target.value)}}
                    placeholder=""
                    value={description}
                    required
                ></textarea>
            </div>
            <div className="mb-3 w-75">
                <label htmlFor="price" className="form-label">add trip price</label>
                <input 
                    className="form-control" 
                    name="price" 
                    id="" 
                    rows="3"
                    onChange={(e)=>{setPrice(e.target.value)}}
                    value={price}
                    required
                    placeholder="price"
                />
            </div>
            <button type="submit" className="btn btn-info">add</button>
            </form>
        </main>
    )
}
