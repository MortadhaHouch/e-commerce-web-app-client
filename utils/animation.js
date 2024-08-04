import { gsap } from "gsap";
import { Flip, ScrollTrigger } from "gsap/all";
gsap.registerPlugin(Flip,ScrollTrigger);
function gsapAnimationHandler(className,from,to,scrollHandling){
    if(scrollHandling){
        gsap.from(className,{
            ...from,
            stagger:.5,
            ease:"back.inOut",
            scrollTrigger:{
                trigger:className,
            }
        },"-=.5")
        gsap.to(className,{
            ...to,
            stagger:.5,
            ease:"back.inOut",
            scrollTrigger:{
                trigger:className,
            }
        },"-=.5")
    }
}
function windowLoadingAnimation(){
    let paths = document.querySelectorAll("path")
    let animationProgress = 0;
    let main = document.querySelector("main.loading")
    let timeInterval =setInterval(()=>{
        paths.forEach((path)=>{
            if(document.readyState !== "complete" && animationProgress<100){
                path.style.strokeDasharray = path.getTotalLength()*animationProgress/100;
                path.style.strokeDashoffset = path.getTotalLength()*animationProgress/100;
                animationProgress++;
            }else if(document.readyState === "complete" && animationProgress>=100){
                path.style.strokeDasharray = path.getTotalLength();
                path.style.strokeDashoffset = 0;
                main.classList.add("paused");
                clearInterval(timeInterval);
                animationProgress = 0;
            }
        })
    },10)
}
export {gsapAnimationHandler,windowLoadingAnimation}