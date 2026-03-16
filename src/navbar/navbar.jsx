import React, {useEffect, useState} from 'react';
import './navbar.css';

import logo from '../assets/logoTL.png';
import iconXmas from '../assets/icon-xmas.png';
import iconXmas2 from '../assets/icon-xmas2.png';

import { FaSearch } from "react-icons/fa";
import { BiSolidPhoneCall } from "react-icons/bi";
import { FaUser } from "react-icons/fa";
import { BsFillBagFill } from "react-icons/bs";
import { FaChevronDown } from "react-icons/fa";

import {API_URL, INFO_USER, KEY_LOGGED, QUANTITY_CART} from "../service/API_URL.jsx";
import {GetStoredUser} from '../service/GetStoredUser.jsx';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const Navbar = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const [cates, setCates] = useState([]);
    const [loginStatus, setLoginStatus] = useState("");
    const [user, setUser] = useState();

    useEffect(() => {
        // Load Data Categories
        const loadCates = async () => {
            try {
                const res = await fetch(`${API_URL}/categories`);
                const data = await res.json();
                setCates(data);
            } catch (e) {
                console.log("Load Categories: ", e);
            }
        }
        loadCates();
    }, []);

    // Login Status
    useEffect(() => {
        const status = localStorage.getItem(KEY_LOGGED);
        if (status) {
            setLoginStatus("true");
            setUser(GetStoredUser());
        }
    }, [location]);

    // Button Logout
    const logout = () => {
      localStorage.removeItem(KEY_LOGGED);
      localStorage.removeItem(INFO_USER);
      localStorage.removeItem(QUANTITY_CART);
      navigate("/");
      window.location.reload();
    };

    // Add icon-down
    const renderIconDown = (cateId) => {
        if (cateId !== "cate6") return <FaChevronDown />;
        return null;
    };

    // Add position
    const position = (cateId) => {
      if (cateId === "cate1") return {position: "relative"};
      return {};
    };

    // Load cate.items by cate.id
    const getCateById = (cateId) => {
      return cates.find(c => c.id === cateId)?.items ?? null;
    };

    // Load cate.banner by cate.id
    const getCateBannerById = (cateId) => {
        return cates.find(c => c.id === cateId)?.banner ?? null;
    };

    // No Login When Click Cart
    const clickCart = () => {
      if (user?.id) return navigate("/cart");
      else {
          alert("Bạn chưa đăng nhập tài khoản!");
          navigate("/user/login");
      }
    };

    return (
        <div id="navbar">
            {/*  HEADER  */}
            <div className="header">
                <div className="logo">
                    <Link to="/"><img src={logo} alt="ThienLong"/></Link>

                    <div className="icon-xmas2">
                        <img src={iconXmas2} alt=""/>
                    </div>
                </div>

                <div className="search">
                    <input className="search-input" type="text" placeholder="Tìm kiếm sản phẩm..." required></input>
                    <div className="right-icon flex-center"><FaSearch /></div>
                </div>

                <div className="contact-user">
                    <div className="icon-xmas">
                        <img src={iconXmas} alt="iconXmax"/>
                    </div>
                    
                    <ul className="list-contact-user">
                        <li className="item-contact-user" style={{width: 100}}></li>

                        <li className="item-contact-user margin">
                            <div className="icon"><BiSolidPhoneCall /></div>
                            <div className="name">
                                <a className="first" href="#" title="1900 866 819">1900 866 819</a>
                                <span className="second">Hỗ trợ khách hàng</span>
                            </div>
                        </li>

                        <li className="item-contact-user margin">
                            <div className="icon"><FaUser /></div>
                            <div className="name">
                                <span>
                                    {
                                        loginStatus === "true" ? (<Link to="/user/info"><p className="first" title="Tài khoản">Hi, {user.lastName}</p></Link>)
                                            : (<Link to="/user/login"><p className="first" title="Đăng nhập">Đăng nhập</p></Link>)
                                    }
                                </span>
                                {
                                 loginStatus === "true" ? (<p style={{cursor: "pointer"}} onClick={logout} className="second" title="Đăng xuất">Đăng xuất</p>)
                                     : (<Link to="/user/sign"><p className="second" title="Đăng ký">Đăng ký</p></Link>)
                                }
                            </div>
                        </li>

                        <li className="item-contact-user">
                            <div onClick={clickCart} className="cart flex-center" title="Giỏ hàng">
                                <BsFillBagFill />
                                <div className="count flex-center">{localStorage.getItem(QUANTITY_CART) || 0}</div>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>

            {/*  CATEGORY  */}
            <div className="cate">
                <ul className="list-cate">
                    {/*  Map data categories  */}
                    {cates && cates.length > 0 ? (
                            cates.map((cate) => (
                                <li key={cate.id} className="item-cate flex-center">
                                    <div className="icon flex-center" style={position(cate.id)}><img src={cate.image} alt="icon-menu"/></div>
                                    <div className="name">{cate.name}</div>
                                    <div className="iconDown flex-center">{renderIconDown(cate.id)}</div>

                                    {/*  DROP DOWN CONTENT  */}
                                    {getCateById(cate.id) && getCateById(cate.id).length > 0 ? (
                                            <div className="dropdown-content">
                                                <div className="content">
                                                    <div className="content-left">
                                                        <ul className="menu-list">
                                                            {/*  Map item from cate.items  */}
                                                            {getCateById(cate.id).map((item) => (
                                                                <li className="menu-item">
                                                                    <a className="item-name" href="#" title={item}>{item}</a>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>

                                                    <div className="content-right">
                                                        <img src={getCateBannerById(cate.id)} alt=""/>
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (<></>)
                                    }
                                </li>
                            ))
                        ) : (<h2>Đang tải...</h2>)
                    }
                </ul>
            </div>
        </div>
    );
};

export default Navbar;