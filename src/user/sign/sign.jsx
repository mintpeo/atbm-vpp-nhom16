import React, { useState } from 'react';
import './sign.css'
import {API_URL, INFO_USER, KEY_LOGGED} from "../../service/API_URL.jsx";

import {FaGoogle} from "react-icons/fa6";
import {FaFacebook} from "react-icons/fa";

import { useNavigate } from "react-router-dom";

const Sign = () => {
    const API = API_URL;

    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [lastName, setLastName] = useState("");
    const [firstName, setFirstName] = useState("");
    const [phone, setPhone] = useState("");

    const sign = async (e) => {
        e.preventDefault();

        // Check duplication
        const checkRes = await fetch(`${API}/users?email=${email}`);
        const existUsers = await checkRes.json();

        if (existUsers.length > 0) {
            alert("Email này đã có người sử dụng!");
            return;
        }

        // Create new user
        const newUser = {
            email: email,
            password: password,
            lastName: lastName,
            firstName: firstName,
            phone: phone,
            dateOfBirth: "",
            address: "",
            role: "user"
        };

        try {
            const res = await fetch(`${API}/users`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newUser),
            });

            if (res.ok) {
                const resLogin = await fetch(`${API}/users?email=${email}&password=${password}`);
                const user = await resLogin.json();
                localStorage.setItem(KEY_LOGGED, "true");
                localStorage.setItem(INFO_USER, JSON.stringify(user[0]));
                alert("Đăng ký thành công.");
                navigate("/");
            }
        } catch (error) {
            console.log("Error SignUp: ", error);
        }
    };

    return (
        <div id="sign">
            <div className="container">
                <form className="table-login" onSubmit={sign}>
                    <div className="title">Đăng ký</div>
                    <div className="form-sign form">
                        <div className="item">
                            <div className="name">Họ<span className="required">(*)</span>:</div>
                            <div className="input-form"><input type="text" placeholder="Nhập Họ" onChange={(e) => setLastName(e.target.value)} required/></div>
                        </div>

                        <div className="item">
                            <div className="name">Tên<span className="required">(*)</span>:</div>
                            <div className="input-form"><input type="text" placeholder="Nhập Tên" onChange={(e) => setFirstName(e.target.value)} required/></div>
                        </div>

                        <div className="item">
                            <div className="name">Email cá nhân<span className="required">(*)</span>:</div>
                            <div className="input-form"><input type="email" placeholder="Nhập Email cá nhân" onChange={(e) => setEmail(e.target.value)} required/></div>
                        </div>

                        <div className="item">
                            <div className="name">Số điện thoại<span className="required">(*)</span>:</div>
                            <div className="input-form"><input type="text" placeholder="Nhập Số điện thoại" onChange={(e) => setPhone(e.target.value)} required/></div>
                        </div>
                    </div>

                    <div className="form">
                        <div className="name">Mật khẩu<span className="required">(*)</span>:</div>
                        <div className="input-form"><input type="password" placeholder="Nhập Mật khẩu" onChange={(e) => setPassword(e.target.value)} required/></div>
                    </div>

                    <div className="forget-pass"></div>

                    <button className="btn-login" type="submit">Đăng ký</button>

                    <div className="forget-pass">Bạn đã có tài khoản <b>Đăng nhập tại đây</b></div>

                    <div className="login-more">
                        <div className="btn" style={{background: "#DE3F32"}}>
                            <div className="icon"><FaGoogle /></div>
                            <div className="name">Google</div>
                        </div>

                        <div className="btn" style={{background: "#49669C"}}>
                            <div className="icon"><FaFacebook /></div>
                            <div className="name">Facebook</div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Sign;