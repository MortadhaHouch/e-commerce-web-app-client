/* eslint-disable no-unused-vars */
import { useContext, useRef, useState } from "react"
import { themeContext } from "../App";

export default function ScrollToTopArrow() {
    let [scrollPercentage,setScrollPercentage] = useState(0);
    let {isDark,setIsDark} = useContext(themeContext);
    let svgCircleRef = useRef();
    window.addEventListener("scroll",()=>{
        setScrollPercentage(1 - window.scrollY / document.documentElement.scrollHeight);
    })
    return (
        <svg xmlns="http://www.w3.org/2000/svg" id="Layer_2" data-name="Layer 2" width={30} height={30} viewBox="0 0 201 201">
            <g id="Layer_1-2" data-name="Layer 1">
                <g>
                    <circle ref={svgCircleRef} 
                        className="cls-2" 
                        fill={"transparent"} 
                        stroke={(isDark || JSON.parse(localStorage.getItem("isDark")))?"rgba(247, 238, 221, 0.5)":"rgb(33,37,41)"}  
                        strokeWidth={16} cx="100.5" cy="100.5" r="92.5" style={{
                            strokeDasharray:svgCircleRef.current?.getTotalLength(),
                            strokeDashoffset:scrollPercentage * svgCircleRef.current?.getTotalLength()
                    }}/>
                    <g>
                        <line 
                            className="cls-1" 
                            fill={"rgb(33,37,41)"} 
                            stroke={(isDark || JSON.parse(localStorage.getItem("isDark")))?"rgba(247, 238, 221, 0.5)":"rgb(33,37,41)"} 
                            strokeMiterlimit={10} 
                            strokeWidth={16} 
                            x1="100.5" 
                            y1="52.07" 
                            x2="100.5" 
                            y2="148.93"
                        />
                        <path 
                            className="cls-1" 
                            fill={(isDark || JSON.parse(localStorage.getItem("isDark")))?"rgb(33,37,41)":"rgba(247, 238, 221, 0.5)"} 
                            stroke={(isDark || JSON.parse(localStorage.getItem("isDark")))?"rgba(247, 238, 221, 0.5)":"rgb(33,37,41)"} 
                            strokeMiterlimit={10} 
                            strokeWidth={16} 
                            d="M47.11,95.31l36.06-36.06c9.57-9.57,25.08-9.57,34.65,0l36.06,36.06"
                        />
                    </g>
                </g>
            </g>
        </svg>
    )
}