/* eslint-disable no-unused-vars */
import SwiperElement from "./SwiperElement"
import { store } from "../../reducers/store"
import { useContext } from "react"
import { themeContext } from "../App"
import Spline from "@splinetool/react-spline"
export const Home = () => {
    store.subscribe(()=>{
        console.log("local data store is connected");
    })
    let {isDark,setIsDark} = useContext(themeContext);
    return (
        <main className="d-flex flex-column justify-content-start align-items-center home" style={{
            backgroundColor:"#D8D7D8",
            minHeight:"200vh",
            width:"100vw",
            padding:0
        }}>
            <section>
                <SwiperElement images/>
            </section>
            <Spline scene="https://prod.spline.design/Pv-yvSAxsfzBiGUV/scene.splinecode"/>
        </main>
    )
}
