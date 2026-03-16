import React, {useEffect, useState} from 'react';
import './info.css'
import {INFO_USER, KEY_LOGGED} from "../../service/API_URL.jsx";

import { IoLogoAppleAr } from "react-icons/io5";
import { FaUser } from "react-icons/fa";
import { RiLockPasswordFill } from "react-icons/ri";
import { BsPostcardHeartFill } from "react-icons/bs";
import { BsBox2HeartFill } from "react-icons/bs";
import { BsFillPinMapFill } from "react-icons/bs";
import { IoLogOutOutline } from "react-icons/io5";
import {GetStoredUser} from "../../service/GetStoredUser.jsx";

import AccountBoxs from "./rightPage/boxs/accountBoxs.jsx";
import User from './rightPage/user/user.jsx';
import Password from './rightPage/password/password.jsx';
import Member from './rightPage/member/member.jsx';

import {useNavigate} from "react-router-dom";

const Info = () => {
    const KEYLOGGED = KEY_LOGGED;
    const INFOUSER = INFO_USER;
    const navigate = useNavigate();

    const [user] = useState(GetStoredUser);
    const [btnPage, setBtnPage] = useState(1);

    const Page = () => {
      switch (btnPage) {
          case 1: return <AccountBoxs />
          case 2: return <User />
          case 3: return <Password />
          case 4: return <Member />
      }
    };

    return (
        <div id="info">
            <div className="container">
                <div className="info-user">
                    <div className="ava"><div className="user-avatar">{user.lastName.charAt(0)}{user.firstName.charAt(0)}</div></div>
                    <div className="title"><i>Xin chào, <b>{user.lastName} {user.firstName}</b></i></div>

                    <div className="list-section">
                        <ul className="list-items">
                            <li className={btnPage === 1 ? "item active" : "item"}
                                onClick={() => setBtnPage(1)}>
                                <i><IoLogoAppleAr /></i>
                                <div className="name">Tổng quan tài khoản</div>
                            </li>

                            <li className={btnPage === 2 ? "item active" : "item"}
                                onClick={() => setBtnPage(2)}>
                                <i><FaUser /></i>
                                <div className="name">Thông tin tài khoản</div>
                            </li>

                            <li className={btnPage === 3 ? "item active" : "item"}
                                onClick={() => setBtnPage(3)}>
                                <i><RiLockPasswordFill /></i>
                                <div className="name">Đổi mật khẩu</div>
                            </li>

                            <li className={btnPage === 4 ? "item active" : "item"}
                                onClick={() => setBtnPage(4)}>
                                <i><BsPostcardHeartFill /></i>
                                <div className="name">Chương trình thành viên</div>
                            </li>

                            <li className={btnPage === 5 ? "item active" : "item"}
                                onClick={() => setBtnPage(5)}>
                                <i><BsBox2HeartFill /></i>
                                <div className="name">Danh sách đơn hàng</div>
                            </li>

                            <li className={btnPage === 6 ? "item active" : "item"}
                                onClick={() => setBtnPage(6)}>
                                <i><BsFillPinMapFill /></i>
                                <div className="name">Sổ địa chỉ</div>
                            </li>

                            <li className="item" onClick={() => {
                                localStorage.removeItem(KEYLOGGED);
                                localStorage.removeItem(INFOUSER);
                                navigate("/");
                                window.location.reload();
                            }}>
                                <i><IoLogOutOutline /></i>
                                <div className="name">Đăng xuất</div>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className={btnPage === 1 ? ("") : ("right-page")}>
                    {Page()}
                </div>
            </div>
        </div>
    );
};

export default Info;