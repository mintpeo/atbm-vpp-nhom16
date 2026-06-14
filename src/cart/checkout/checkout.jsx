import React, {useEffect, useState} from 'react';
import './checkout.css';
import './checkoutModal.css';

import { FaRegUser } from "react-icons/fa";
import { LuTicket } from "react-icons/lu";

import logoTL from '/src/assets/logoTL-checkout.png'
import {Link, useLocation, useNavigate} from "react-router-dom";
import {API_URL, API_URL_BE} from "../../service/API_URL.jsx";
import {GetStoredUser} from "../../service/GetStoredUser.jsx";

const Checkout = () => {
    const location = useLocation();
    const selected = location.state.selected;
    const navigate = useNavigate();
    const [user] = useState(GetStoredUser);

    const [carts, setCarts] = useState([]);
    const [products, setProducts] = useState({});
    const [showModal, setShowModal] = useState(false);
    const [privateKey, setPrivateKey] = useState("");

    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);

    // Verify private key
    const verify = async (orderId) => {
        try {
            const res = await fetch(`${API_URL_BE}/signature/verify`, {
                method: "Post",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    "orderId": orderId
                })
            });
            const data = await res.json();
            if (data) alert("TRUE");
            else alert("False");
        } catch (e) {
            console.log("Error Verify Order", e);
        }
    }

    // Btn CheckOut
    const btnCheckOut = async () => {
        const total = carts.reduce((sum, item) => {
            const product = products[item.productId];
            return sum + (Number(item.quantity || 0) * Number(product?.price || 0));
        }, 0);

        const order = {
            userId: user.id,
            totalPrice: total,
            privateKey: privateKey.trim(),
            items: orderItems
        }

        try {
            const res = await fetch(`${API_URL_BE}/signature/sign`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(order),
            });

            if (res.ok) {
                alert("Kí thành công!");
            } else {
                alert("Vui lòng kiểm tra lại Private Key!");
            }
            navigate("/user/info");
        } catch (e) {
            console.log("Error Check Out", e);
        }
    }

    const orderItems = carts.map(item => {
        const product = products[item.productId];

        return {
            productId: item.productId,
            quantity: item.quantity,
            type: item.type,
            price: product?.price
        };
    });

    // Load list carts
    const loadCarts = async () => {
        try {
            const res = await fetch(`${API_URL_BE}/cart/showSelected`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(selected),
            })

            const data = await res.json();
            setCarts(data);
        } catch (e) {
            console.log("Error Cart CheckOut", e);
        }
    }

    // Load product item
    useEffect(() => {
        const fetchProducts = async () => {
            const productMap = {};

            for (const item of carts) {
                const res = await fetch(`${API_URL}/products/${item.productId}`);
                const product = await res.json();

                productMap[item.productId] = product;
            }

            setProducts(productMap);
        };

        if (carts.length > 0) {
            fetchProducts();
        }
    }, [carts]);

    // console.log(carts);

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

    // Total Price In Cart
    const totalPrice = () => {
        let total = 0;
        let stringCur = "";

        selected.forEach(itemSelectedId => {
            const itemCart = carts.find(cart => cart.id === itemSelectedId);

            if (itemCart) {
                const product = products[itemCart.productId];
                total += Number(product?.price || 0) * Number(itemCart.quantity || 0);
                stringCur = product?.currency || "";
            }
        });

        return total.toLocaleString() + " " + stringCur;
    };

    const handleFile = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            const privateKey = event.target.result;
            setPrivateKey(privateKey);
        };

        reader.readAsText(file);
    };

    useEffect(() => {
        loadCarts();
        loadProvinces();
        loadDistricts();
        loadWards();
    }, []);

    return (
        <div id="check-out">
            <div className="container">
                {/* MODAL */}
                {
                    showModal && (
                        <div className="modal-overlay">
                            <div className="modal-content">
                                <h2>Chữ ký điện tử</h2>

                                <p>Vui lòng nhập Private Key vào!</p>

                                <textarea
                                    className="private-key-input"
                                    placeholder="Nhập Private Key tại đây..."
                                    value={privateKey}
                                    onChange={(e) => setPrivateKey(e.target.value)}
                                />

                                <div className="modal-actions">
                                    <input type="file" accept=".key,.txt" onChange={handleFile} />

                                    <button
                                        className="btn-cancel"
                                        onClick={() => {
                                            setShowModal(false);
                                            setPrivateKey("");
                                        }}
                                    >
                                        Huỷ
                                    </button>

                                    <button
                                        className="btn-confirm"
                                        onClick={() => {
                                            btnCheckOut();
                                            setShowModal(false);
                                        }}
                                    >
                                        Kí
                                    </button>
                                </div>
                            </div>
                        </div>
                    )
                }

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
                            <button className="btn-checkout" onClick={() => setShowModal(true)}>Thanh toán</button>
                        </div>
                    </div>
                </div>

                {/* RIGHT */}
                <div className="side-right">
                    {/* LIST CART */}
                    <ul className="list-cart">
                        {carts.map((item) => (
                            <li className="item-cart">
                                <div className="item-container">
                                    <img className="item-img" src={item.image} alt=""/>

                                    <div className="item-info">
                                        <div className="name">{products[item.productId]?.name}</div>
                                        <div className="type">Loại: {item.type}</div>
                                        <div className="type">Số lượng: {item.quantity}</div>
                                    </div>

                                    <div className="item-price">{products[item.productId]?.price.toLocaleString()} {products[item.productId]?.currency}</div>
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