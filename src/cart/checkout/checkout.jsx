import React, {useEffect, useState} from 'react';
import './checkout.css';

import { FaRegUser } from "react-icons/fa";
import { LuTicket } from "react-icons/lu";

import logoTL from '/src/assets/logoTL-checkout.png'
import {Link, useLocation} from "react-router-dom";
import {API_URL} from "../../service/API_URL.jsx";

const Checkout = () => {
    const location = useLocation();
    const products = location.state.products;

    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);

    const loadProvinces = async () => {
        try {
            const res = await fetch("https://provinces.open-api.vn/api/v1/?depth=1");
            const data = await res.json();
            setProvinces(data);
        } catch (e) {
            console.log("Fetch Provinces Error: ", e);
        }
    }

    const loadDistricts = async (code) => {
        try {
            const res = await fetch(`https://provinces.open-api.vn/api/v1/p/${code}?depth=2`);
            const data = await res.json();
            setDistricts(data.districts);
        } catch (e) {
            console.log("Fetch Districts Error: ", e);
        }
    }

    const loadWards = async (code) => {
        try {
            const res = await fetch(`https://provinces.open-api.vn/api/v1/d/${code}?depth=2`);
            const data = await res.json();
            setWards(data.wards);
        } catch (e) {
            console.log("Fetch Wards Error: ", e);
        }
    }

    useEffect(() => {
        loadProvinces();
        loadDistricts();
        loadWards();
    }, []);

    // Total Price In Cart
    const totalPrice = () => {
        let total = 0;
        let stringCur = "";

        products.forEach(item => {
            total += item.price * item.quantity;
            stringCur = item.currency;
        })

        return total.toLocaleString() + " " + stringCur;
    };

    return (
        <div id="check-out">
            <div className="container">
                {/* LEFT */}
                <div className="side-left">
                    <div className="container-left">
                        {/* LOGO */}
                        <div className="logo"><img src={logoTL} alt=""/></div>

                        {/* INFO CHECK OUT */}
                        <div className="info-checkout">
                            <h3 className="title">Thông tin giao hàng</h3>

                            {/* NAME - AVATAR */}
                            <div className="user">
                                <div className="icon"><FaRegUser /></div>
                                <div className="name">
                                    <p>Trần Minh (tranquocminh15981@gmail.com)</p>
                                    <div className="log-out"><p>Đăng xuất</p></div>
                                </div>
                            </div>

                            {/* ADDRESS */}
                            <div className="address">
                                <div className="item-input">
                                    <p>Thêm địa chỉ mới...</p>
                                    <select className="field-input">
                                        <option value="0">Địa chỉ đã lưu trữ</option>
                                    </select>
                                </div>

                                <div className="item-input">
                                    <p>Họ và tên</p>
                                    <input type="text" className="field-input" placeholder="Họ và tên"/>
                                </div>

                                <div className="item-input">
                                    <p>Số điện thoại</p>
                                    <input type="text" className="field-input" placeholder="Số điện thoại"/>
                                </div>

                                <div className="item-input">
                                    <p>Địa chỉ</p>
                                    <input type="text" className="field-input" placeholder="Địa chỉ"/>
                                </div>

                                <div className="select-address">
                                    <div className="item-input">
                                        <p>Tỉnh / thành</p>
                                        <select className="field-input" onChange={(e) => loadDistricts(e.target.value)}>
                                            <option value="0">Chọn tỉnh / thành</option>
                                            {provinces.map((item) => (<option key={item.code} value={item.code}>{item.name}</option>))}
                                        </select>
                                    </div>

                                    <div className="item-input">
                                        <p>Quận / huyện</p>
                                        <select className="field-input" onChange={(e) => loadWards(e.target.value)}>
                                            <option value="0">Chọn quận / huyện</option>
                                            {districts.map((item) => (<option key={item.code} value={item.code}>{item.name}</option>))}
                                        </select>
                                    </div>

                                    <div className="item-input">
                                        <p>Phường / xã</p>
                                        <select className="field-input">
                                            <option value="0">Chọn phường / xã</option>
                                            {wards.map((item) => (<option key={item.code} value={item.code}>{item.name}</option>))}
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* SELECT PAYS */}

                        {/* CHECK OUT */}
                        <div className="step-checkout">
                            {/* BACK CART */}
                            <Link to={"/cart"}><div className="back-cart">Giỏ hàng</div></Link>
                            <button className="btn-checkout">Thanh toán</button>
                        </div>
                    </div>
                </div>

                {/* RIGHT */}
                <div className="side-right">
                    {/* LIST CART */}
                    <ul className="list-cart">
                        {products.map((item) => (
                            <li className="item-cart">
                                <div className="item-container">
                                    <img className="item-img" src={item.image} alt=""/>

                                    <div className="item-info">
                                        <div className="name">{item.name}</div>
                                        <div className="type">{item.color}</div>
                                        <div className="type">Số lượng: {item.quantity}</div>
                                    </div>

                                    <div className="item-price">{item.price.toLocaleString()} {item.currency}</div>
                                </div>
                            </li>
                        ))}
                    </ul>

                    {/* VOUCHER */}
                    <div className="voucher">
                       <div className="apply-voucher">
                           <input className="input-voucher" type="text" placeholder="Mã giảm giá"/>
                           <button className="apply">Sử dụng</button>
                       </div>

                        <div className="more-vouchers">
                            <div className="title">
                                <i><LuTicket /></i>
                                <p>Xem thêm mã giảm giá</p>
                            </div>

                            <div className="select-vouchers">
                                <span className="select">Giảm 2%</span>
                                <span className="select">Giảm 3%</span>
                                <span className="select">Giảm 4%</span>
                                <span className="select">Giảm 5%</span>
                                <span className="select">Giảm 6%</span>
                            </div>
                        </div>
                    </div>

                    {/* TOTAL PRICE */}
                    <div className="price-container">
                        <div className="price-list">
                            <div className="price">
                                <p style={{color: "#717171"}}>Tạm tính</p>
                                <p>{totalPrice()}</p>
                            </div>

                            <div className="price">
                                <p style={{color: "#717171"}}>Phí vận chuyển</p>
                                <p>555,200₫</p>
                            </div>

                            <div className="price">
                                <p style={{color: "#717171"}}>Mã giảm giá</p>
                                <p>555,200₫</p>
                            </div>
                        </div>

                        <div className="price" style={{marginTop: "1rem"}}>
                            <p>Tổng cộng</p>
                            <p style={{fontWeight: "600", fontSize: "1.2rem"}}>{totalPrice()}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;