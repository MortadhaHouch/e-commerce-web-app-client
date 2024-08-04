/* eslint-disable no-unused-vars */
import { useContext } from "react"
import { themeContext } from "../App"
export const Error = () => {
    let {isDark,setIsDark} = useContext(themeContext);
    return (
        <>
            <main className="d-flex flex-column justify-content-center align-items-center" style={{
                backgroundColor:(isDark || JSON.parse(localStorage.getItem("isDark")))?"#070F2B":"#F2F1EB"
            }}>
            </main>
        </>
    )
}
