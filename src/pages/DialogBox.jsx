/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { Suspense, useContext, useEffect, useRef, useState } from "react";
import { themeContext } from "../App";
import fetchData from "../../utils/fetchData"
import {jwtDecode} from "jwt-decode"
import { AiFillDislike, AiFillEyeInvisible, AiFillLike, AiOutlineComment, AiOutlineSend } from "react-icons/ai";
import { FaArrowRight, FaEdit, FaEye, FaFemale, FaMale, FaRegUser } from "react-icons/fa";
import { MdAddComment, MdOutlineAlternateEmail } from "react-icons/md";
import { BsArrowDownRight, BsArrowDownRightCircleFill, BsCalendar2Date, BsFillArrowDownRightCircleFill, BsSend } from "react-icons/bs";
import moment from "moment";
import { LiaBirthdayCakeSolid } from "react-icons/lia";
function DialogBox(props) {
    let {isDark,setIsDark} = useContext(themeContext);
    let ref = useRef();
    return (
        // eslint-disable-next-line react/prop-types
        <section className={"dialog "+(props.isShown?"shown":"hidden")} ref={ref} style={{
            boxShadow:" 0px 0px 80px -30px rgba(0,0,0,0.75)",
            backgroundColor: (isDark || JSON.parse(localStorage.getItem("isDark")))? "rgba(25,25,25,0.75)" : "rgba(242, 241, 235, 0.25)",
        }}>
        </section>
    );
}

export {DialogBox};