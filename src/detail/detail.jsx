import React, {useEffect, useState} from 'react';
import './detail.css';

import {useParams} from "react-router-dom";
import useFetch from "../hooks/useFetch.js";
import {API_URL} from "../service/API_URL.jsx";
import {Swiper, SwiperSlide} from "swiper/react";
import {Autoplay, Navigation} from "swiper/modules";

import { BsCart3 } from "react-icons/bs";
import { HiTicket } from "react-icons/hi2";

const Detail = () => {
    // Get id product from url
    const {id} = useParams();
    const {data: product, loading: loading} = useFetch(`${API_URL}/products/${id}`);

    // Save index img-main and img-sub
    const [activeIndex, setActiveIndex] = useState(0);
    const [numTypeCol, setNumTypeCol] = useState(0);

    // Quantity
    const [quantity, setQuantity] = useState(1);

    // Copy Voucher
    const [choose, setChoose] = useState(0);

    // Choose Type Col
    const handleTypeCol = (imgColo) => {
        const listImage = [...product.images];

        for (let i = 1; i < listImage.length; i++) {
            if (imgColo === listImage[i]) {
                setActiveIndex(i);
            }
        }
    }
    // Active Type Col
    const handleChooseType = (id) => {
        if (numTypeCol === id) return true;
    }

    // Date voucher
    const voucherList = [
        {id: 1, name: "Giảm 50.000đ", des: "Đơn hàng từ 300.000đ", code: "0326SALE50", date: "31/03/2026"},
        {id: 2, name: "Giảm 150.000đ", des: "Đơn hàng từ 1300.000đ", code: "0326SALE50", date: "31/03/2026"},
        {id: 3, name: "Giảm 250.000đ", des: "Đơn hàng từ 2300.000đ", code: "0326SALE50", date: "31/03/2026"},
        {id: 4, name: "Giảm 350.000đ", des: "Đơn hàng từ 3300.000đ", code: "0326SALE50", date: "31/03/2026"},
    ]

    // Choose Voucher
    const handleChooseVoucher = (id) => {
        if (choose === id) return true;
    }

    // Set quantity
    const handleBtnQuantity = (sign) => {
        if (quantity === 1 && sign === "-") return;

        if (sign === "-") setQuantity(quantity - 1);
        else setQuantity(quantity + 1);
    }

    console.log(product)

    // Wait to load data
    if (loading) {
        return (
            <div className="loading">
                <h1>Đang tải dữ liệu sản phẩm...</h1>
            </div>
        );
    }

    return (
        <div id="detail">
            <div className="container">
                {/* IMAGE */}
                <div className="img-dt">
                    <img src={product.images[activeIndex]} alt="" className="img-main"/>

                    {/* IMAGES SUB */}
                    <div className="img-sub">
                        <Swiper
                            modules={[Autoplay, Navigation]}
                            spaceBetween={10}
                            slidesPerView={3}
                            slidesPerGroup={1}
                            observer={true}
                            observeParents={true}
                            centerInsufficientSlides={true}
                            loop={false}

                            className="banner-slider"
                        >
                            {
                                product.images.map((item, index) => (
                                    <SwiperSlide key={index}>
                                        <div className="img-list" onClick={() => {
                                            setActiveIndex(index);
                                        }}>
                                            <img className={`img-item ${activeIndex === index ? 'active' : ''}`} src={item} alt="img-sub" />
                                        </div>
                                    </SwiperSlide>
                                ))
                            }
                        </Swiper>
                    </div>
                </div>

                {/* INFO */}
                <div className="info-dt">
                    {/* Text-main */}
                    <p className="text-main">{product.name}</p>

                    {/* Text-sub */}
                    <div className="text-sub">
                        <span className="text-left">Thương hiệu: <span>Thiên Long</span></span>
                        <span className="text-left">Tình trạng: <span>Còn hàng</span></span>
                        <span className="text-left text-last">Đơn vị chịu trách nhiệm: <span>Tập đoàn Thiên Long</span></span>
                    </div>

                    {/* Product-id */}
                    <p className="text-left">Mã sản phẩm: <span>{product.sku}</span></p>

                    {/* Price */}
                    <div className="price">
                        <div className="pri-con">
                            <div className="price-dis">{product.price.toLocaleString()}{product.currency}</div>
                            <div className="price-noDis">{product.originalPrice.toLocaleString()}{product.currency}</div>
                        </div>
                        <div className="dis-per">Tiết kiệm <strong>35%</strong></div>
                    </div>

                    {/* Type */}
                    <div className="type">Phân loại:
                        {product.colors.map((item, index) => (
                            <div onClick={() => {
                                handleTypeCol(item.image);
                                setNumTypeCol(index);
                            }} className={`type-color ${handleChooseType(index) ? 'active' : ''}`} style={{backgroundColor: item.code}}></div>
                        ))}
                    </div>

                    {/* Amount */}
                    <div className="amount">
                        <p>Số lượng:</p>
                        <div className="number">
                            <button className="btn" onClick={() => handleBtnQuantity("-")}>-</button>
                            <input type="text" value={quantity}/>
                            <button className="btn right" onClick={() => handleBtnQuantity("+")}>+</button>
                        </div>
                    </div>

                    <div className="addCart">
                        <button className="btnCart"><i className="icon"><BsCart3/></i> Thêm vào giỏ</button>
                        <button className="btnCart btnBlue">Mua ngay</button>
                    </div>
                </div>

                {/* COUPED */}
                <div className="voucher-dt">
                    <ul className="list-vou">
                        {voucherList.map((item) => (
                            <li className="item-vou" key={item.id}>
                                <div className="vou-left">
                                    <i className="icon"><HiTicket /></i>
                                </div>

                                <div className="vou-right">
                                    <div className="vou-info">
                                        <strong>{item.name}</strong>
                                        <p className="text-vou">{item.des}</p>
                                        <p className="text-vou">Mã: <span><strong>{item.code}</strong></span></p>
                                        <p className="text-vou">{item.date}</p>

                                        <div className="btn-vou">
                                            <button className="btn-copy" onClick={() => setChoose(item.id)}>{handleChooseVoucher(item.id) ? "Đã sao chép" : "Sao chép mã"}</button>
                                        </div>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Detail;