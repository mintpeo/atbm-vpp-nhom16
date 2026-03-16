import React from 'react'
import './home.css'
import {API_URL} from "../service/API_URL.jsx";

import {Swiper, SwiperSlide} from "swiper/react";
import { Autoplay, Navigation, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/effect-fade";

import titleTL from  '../assets/titleTL.webp'
import btnBuy from '../assets/btn-buy.png'
import flashSale from '../assets/flashsale.webp'

import { AiOutlineStock } from "react-icons/ai";
import { IoIosStar } from "react-icons/io";
import { IoIosStarHalf } from "react-icons/io";
import { IoIosStarOutline } from "react-icons/io";
import { FaRegEye } from "react-icons/fa";
import useFetch from "../hooks/useFetch.js";
import {useNavigate} from "react-router-dom";

const Home = () => {
    const {data: products} = useFetch(`${API_URL}/products`);
    const {data: infoSales} = useFetch(`${API_URL}/infoSale`);
    const {data: banners} = useFetch(`${API_URL}/banner`);

    // Navigate to detail
    const navigate = useNavigate();
    const handleToDetail = (id) => {
        navigate(`/detail/${id}`);
    }

    //  Calculate Dis %
    const calculateDiscountPercentage = (originalPrice, discountedPrice) => {
        let savings = originalPrice - discountedPrice;
        let percentage = (savings / originalPrice) * 100;

        return Math.trunc(percentage);
    }

    //  Rating Star
    const RatingStars = (rating) => {
        // rating: 4.7
        let stars = [];
        for (let i = 1; i <= 5; i++) {
            if (i <= rating) {
                // Full star
                stars.push(<IoIosStar key={i} color="#ffc107"/>);
            } else if (i - 0.5 <= rating) {
                // Half star 4.3 đến 4.7
                stars.push(<IoIosStarHalf key={i} color="#ffc107"/>);
            } else {
                // Empty star
                stars.push(<IoIosStarOutline key={i} color="#ffc107"/>);
            }
        }
        return stars;
    }

    return (
        <div id="home">
            <div className="container">
                {/*  BANNER  */}
                <div className="banner-home">
                    <Swiper
                        modules={[Autoplay, Navigation, EffectFade]}
                        slidesPerView={2}
                        centeredSlides={true}
                        autoplay={{
                            delay: 10000,
                            disableOnInteraction: false,
                            pauseOnMouseEnter: true
                        }}
                        loop={true}
                        className="banner-slider"
                    >
                        {
                            banners.map((item) => (
                                <SwiperSlide><a className="banner-slider-img" href="#" title={item.name}><img src={item.image} alt="banner" /></a></SwiperSlide>
                            ))
                        }
                    </Swiper>
                </div>

                {/*  TL Doc Quyen  */}
                <div className="docQuyen">
                    <div className="img-docQuyen">
                        <img src={titleTL} alt="TL Doc Quyen"/>
                    </div>

                    <div className="product-docQuyen">
                        {
                            products && products.length > 0 ? (
                                products.slice(0, 5).map((item) => (
                                    <div className="container-product">
                                        <div className="name" onClick={() => handleToDetail(item.id)}><a title={item.name}>{item.name}</a></div>
                                        <div className="img" onClick={() => handleToDetail(item.id)}><a title={item.name}><img src={item.images[0]} alt=""/></a></div>
                                        <div className="price">
                                            <p className="price-dis">{item.price.toLocaleString()} {item.currency}</p>
                                            <p className="price-noDis">{item.originalPrice.toLocaleString()} {item.currency}</p>
                                            <div className="dis-per">-{calculateDiscountPercentage(item.originalPrice, item.price)}%</div>
                                        </div>
                                        <div className="buy">
                                            <img className="btn-buy" src={btnBuy} alt="btn-buy"/>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p>Loading...</p>
                            )
                        }
                    </div>
                </div>

                {/*  Info  */}
                <div className="info">
                    {infoSales.map((item) => (
                        <div className="container-sale">
                            <div className="item-sale">
                                <a href="#" title={item.name}>
                                    <img src={item.image} alt={item.sku}/>
                                    <p>{item.name}</p>
                                </a>
                            </div>
                        </div>
                    ))}
                </div>

                {/*  Flash Sale  */}
                <div className="flashSale">
                    <img className="img-flashSale" src={flashSale} alt="flash-sale"/>
                    <div className="list-product">
                        {
                            products.slice(0, 5).map((item) => (
                            <div className="item" onClick={() => handleToDetail(item.id)}>
                                <div className="item-img"><img src={item.images[0]} alt="item-img"/></div>
                                <div className="item-stock">
                                    <div className="icon"><AiOutlineStock />Số lượng: {item.stock}</div>
                                </div>
                                <div className="item-name"><p title={item.name}>{item.name}</p></div>
                                <div className="item-rating">
                                    <div className="icon-star">{RatingStars(item.rating)}</div>
                                    <div className="rating-star">({item.rating})</div>
                                </div>
                                <div className="item-price">
                                    <div className="price-dis">{item.price.toLocaleString()} {item.currency}</div>
                                    <div className="price-noDis">
                                        <div className="price-ori">
                                            {item.originalPrice.toLocaleString()} {item.currency}
                                        </div>
                                        <div className="dis-per">
                                            - {calculateDiscountPercentage(item.originalPrice, item.price)}%
                                        </div>
                                    </div>
                                </div>
                                <div className="btn-see">
                                    <a className="btn" href="" title="Xem nhanh">
                                        <i className="icon"><FaRegEye /></i>
                                        <span>Xem nhanh</span>
                                    </a>
                                </div>
                            </div>
                            ))
                        }
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;