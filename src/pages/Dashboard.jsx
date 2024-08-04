/* eslint-disable no-unused-vars */
import { useContext, useState } from 'react';
import fetchData from "../../utils/fetchData"
import { store } from "../../reducers/store";
import { themeContext } from "../App";
import { DialogBox } from "./DialogBox";
import Aside from "./Aside";
export default function Dashboard() {
    let [isLoading,setIsLoading] = useState(false);
    let [isShown,setIsShown] = useState(false);
    let [itemToRemove,setItemToRemove]= useState(null);
    let [entity,setEntity] = useState("");
    store.subscribe(()=>{
        console.log("local data store is connected");
    })
    let {isDark,setIsDark} = useContext(themeContext);
    return (
        <main className="d-flex flex-column justify-content-center align-items-center" style={{
            backgroundColor:(isDark || JSON.parse(localStorage.getItem("isDark")))?"#070F2B":"#F2F1EB"
        }}>
            <Aside/>
            {
                (isShown && itemToRemove) && <DialogBox isShown={isShown} message="remove-item" callback={fetchData} setIsLoading={setIsLoading} setIsShown={setIsShown} entity={entity} data={itemToRemove}/>
            }
        </main>
    )
}
