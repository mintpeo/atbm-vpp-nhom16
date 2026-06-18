import React, { useState } from 'react';
import './sign.css'
import './signModal.css'
import {API_URL_BE, INFO_USER, KEY_LOGGED} from "../../service/API_URL.jsx";

import {FaGoogle} from "react-icons/fa6";
import {FaFacebook} from "react-icons/fa";

import { useNavigate } from "react-router-dom";
import LoadingModal from "../../components/LoadingModal.jsx";

const Sign = () => {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [lastName, setLastName] = useState("");
    const [firstName, setFirstName] = useState("");
    const [phone, setPhone] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [showKeyModal, setShowKeyModal] = useState(false);
    const [sendFile, setSendFile] = useState(true);
    const [sendEmail, setSendEmail] = useState(false);
    const [privateKey, setPrivateKey] = useState("");

    const sign = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        // Check duplication
        // const checkRes = await fetch(`${API}/users?email=${email}`);
        // const existUsers = await checkRes.json();

        // if (existUsers.length > 0) {
        //     alert("Email này đã có người sử dụng!");
        //     return;
        // }

        // Create new user
        const newUser = {
            email: email,
            password: password,
            // lastName: lastName,
            // firstName: firstName,
            // phone: phone,
            // dateOfBirth: "",
            // address: "",
            // role: "user"
        };

        try {
            const res = await fetch(`${API_URL_BE}/user/sign`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newUser),
            });
            const data = await res.json();
            if (data.privateKey) {
                setShowKeyModal(true);
                setPrivateKey(data.privateKey);
            }

            setIsLoading(false);
        } catch (error) {
            console.log("Error SignUp: ", error);
        }
    };

    // Handle Modal Private Key
    const handlePrivateKeyOption = async () => {
        if (sendFile) {
            downloadPrivateKey(privateKey);
        }

        const send = {
            email: email,
            privateKey: privateKey,
        }

        if (sendEmail) {
            await fetch(`${API_URL_BE}/user/send`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(send),
            });
        }

        setShowKeyModal(false);
        alert("Private key delivered successfully.");

        const login = {
            email: email,
            password: password,
        };

        const resLogin = await fetch(`${API_URL_BE}/user/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(login),
        });
        const user = await resLogin.json();
        localStorage.setItem(KEY_LOGGED, "true");
        localStorage.setItem(INFO_USER, JSON.stringify(user));
        alert("Đăng ký thành công.");
        navigate("/");
    };

    // Down File
    const downloadPrivateKey = (privateKey) => {
        const blob = new Blob(
            [privateKey],
            { type: "text/plain" }
        );

        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");

        a.href = url;
        a.download = "private-key.txt";

        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        URL.revokeObjectURL(url);
    };

    return (
        <div id="sign">
            <LoadingModal isOpen={isLoading}/>
            {showKeyModal && (
                <div className="modal-overlay">
                    <div className="modal-key">
                        <h2>Private Key</h2>
                        <p>Bạn muốn nhận Private Key như nào?</p>

                        <div className="option-group">
                            <label>
                                <input
                                    type="checkbox"
                                    checked={sendFile}
                                    onChange={(e) =>
                                        setSendFile(e.target.checked)
                                    }
                                />
                                Lưu về máy.
                            </label>

                            <label>
                                <input
                                    type="checkbox"
                                    checked={sendEmail}
                                    onChange={(e) =>
                                        setSendEmail(e.target.checked)
                                    }
                                />
                                Gửi qua Mail: {email}
                            </label>
                        </div>

                        <div className="modal-actions">
                            <button
                                className="btn-confirm"
                                onClick={handlePrivateKeyOption}
                                disabled={!sendFile && !sendEmail}
                            >
                                Xác nhận
                            </button>
                        </div>
                    </div>
                </div>
            )}
            <div className="container">
                <form className="table-login" onSubmit={sign}>
                    <div className="title">Đăng ký</div>
                    <div className="form-sign form">
                        <div className="item">
                            <div className="name">Họ<span className="required">(*)</span>:</div>
                            <div className="input-form"><input type="text" placeholder="Nhập Họ" onChange={(e) => setLastName(e.target.value)}/></div>
                        </div>

                        <div className="item">
                            <div className="name">Tên<span className="required">(*)</span>:</div>
                            <div className="input-form"><input type="text" placeholder="Nhập Tên" onChange={(e) => setFirstName(e.target.value)}/></div>
                        </div>

                        <div className="item">
                            <div className="name">Email cá nhân<span className="required">(*)</span>:</div>
                            <div className="input-form"><input type="email" placeholder="Nhập Email cá nhân" onChange={(e) => setEmail(e.target.value)} required/></div>
                        </div>

                        <div className="item">
                            <div className="name">Số điện thoại<span className="required">(*)</span>:</div>
                            <div className="input-form"><input type="text" placeholder="Nhập Số điện thoại" onChange={(e) => setPhone(e.target.value)}/></div>
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