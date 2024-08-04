/* eslint-disable react/prop-types */
import { Swiper, SwiperSlide, } from 'swiper/react';
import { EffectCoverflow, Pagination,Navigation,Parallax,A11y,Autoplay } from 'swiper/modules';
import { FaArrowRightLong } from "react-icons/fa6";
import { FaArrowLeftLong } from "react-icons/fa6";
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';
import { useState } from 'react';
export default function SwiperElement(props) {
    let [linkIndex,setLinkIndex] = useState(0);
    let [swiper,setSwiper] = useState(null);
    return (
        <>
            <Swiper
                effect={'coverflow'}
                grabCursor={true}
                centeredSlides={true}
                slidesPerView={3}
                coverflowEffect={{
                    stretch: 0,
                    depth: 50,
                    modifier: 1,
                    slideShadows: true,
                    
                }}
                pagination={{clickable:true,dynamicBullets:true}}
                navigation={{prevEl:".previous",nextEl:".next"}}
                modules={[EffectCoverflow, Pagination,Navigation,Parallax,A11y,Autoplay]}
                className="h-100 w-100"
                resizeObserver={true}
                onSwiper={(swiper)=>{
                    setSwiper(swiper)
                }}
                onSlideChange={(swiper)=>{
                    setLinkIndex(swiper.activeIndex);
                }}
            >
                <div className="btn-group navigation-button">
                    <button className="previous" onClick={()=>{
                        swiper.slidePrev()
                    }}><FaArrowLeftLong/></button>
                    <button className="next" onClick={()=>{
                        swiper.slideNext()
                    }}><FaArrowRightLong/></button>
                </div>
            {
                props.images && props.images.map((item,index)=>{
                    return(
                        <SwiperSlide key={index}>
                            <>
                                {
                                    props.stateName ? (
                                        <div className="d-flex justify-content-center align-items-center">
                                            <div className='description'>
                                                <p className="card-title text-info text-lg-start">DESTINATION</p>
                                                <h2 className="text-light form-control-lg">{props.stateName}</h2>
                                            </div>
                                            <div className="d-flex justify-content-center align-items-center destination-map">
                                            </div>
                                            <img src={item} alt="image" className="image-slide"/>
                                        </div>
                                    ):(
                                        <img src={item} alt="image" className="image-slide"/>
                                    )
                                }
                            </>
                        </SwiperSlide>
                    )
                })
            }
            {
                props.images &&(
                    <img src={props.images[linkIndex]} alt="" className="background"/>
                )
            }
            </Swiper>
        </>
    )
}