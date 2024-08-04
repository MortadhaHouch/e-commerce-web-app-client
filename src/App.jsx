import './App.css'
import {HomeLayout} from "../src/pages/HomeLayout"
import {CookiesProvider} from "react-cookie"
import { createContext, useState } from 'react';
import { Provider } from "react-redux";
import {store} from "../reducers/store"
let loginState = createContext();
let themeContext = createContext();
function App() {
  let [isLoggedIn,setIsLoggedIn] = useState(false);
  let [isAdmin,setIsAdmin] = useState(false);
  let [isDark,setIsDark] = useState(false);
  return (
    <>
      <CookiesProvider>
        <Provider store={store}>
          <themeContext.Provider value={{isDark,setIsDark}}>
            <loginState.Provider value={{isLoggedIn,setIsLoggedIn,isAdmin,setIsAdmin}}>
              <HomeLayout/>
            </loginState.Provider>
          </themeContext.Provider>
        </Provider>
      </CookiesProvider>
    </>
  )
}
// eslint-disable-next-line react-refresh/only-export-components
export {App,loginState,themeContext}