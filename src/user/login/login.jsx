import React, { useState } from 'react';
import './login.css'

import { FaGoogle } from "react-icons/fa6";
import { FaFacebook } from "react-icons/fa";

import {API_URL, INFO_USER, KEY_LOGGED} from "../../service/API_URL.jsx";
import {useNavigate} from "react-router-dom";

const Login = () => {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const login = async (e) => {
        e.preventDefault();

        try {
            const res = await fetch(`${API_URL}/users?email=${email}&password=${password}`);
            const user = await res.json(); // array

            if (user.length > 0) {
                const publicInfo = {
                    id: user[0].id,
                    lastName: user[0].lastName,
                    firstName: user[0].firstName,
                    email: user[0].email,
                    phone: user[0].phone,
                    "dateOfBirth": user[0].dateOfBirth,
                    "address": user[0].address
                }

                // Save Info User
                localStorage.setItem(KEY_LOGGED, "true");
                localStorage.setItem(INFO_USER, JSON.stringify(publicInfo)); // array[0]

                alert("Đăng nhập thành công!");
                navigate("/");
            } else {
                alert("Sai thông tin tài khoản!");
            }
        } catch (error) {
            console.log("Error Login:", error);
        }
    };

    return (
        <div id="login">
           <div className="container">
               <form className="table-login" onSubmit={login}>
                   <div className="title">Đăng nhập</div>
                   <div className="form">
                       <div className="name">Email<span className="required">*</span></div>
                       <div className="input-form"><input type="email" placeholder="Nhập Email" onChange={(e) => setEmail(e.target.value)} required/></div>
                   </div>

                   <div className="form">
                       <div className="name">Mật khẩu<span className="required">*</span></div>
                       <div className="input-form"><input type="password" placeholder="Nhập Mật khẩu" onChange={(e) => setPassword(e.target.value)} required/></div>
                   </div>

                   <div className="forget-pass">Quên mật khẩu? Nhấn vào <b>đây</b></div>

                   <button className="btn-login" type="sumbit">Đăng nhập</button>

                   <div className="forget-pass">Bạn chưa có tài khoản <b>Đăng ký tại đây</b></div>

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

export default Login;