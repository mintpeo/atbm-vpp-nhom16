import React, {useEffect, useState} from 'react';
import './password.css';

import {GetStoredUser} from "../../../../service/GetStoredUser.jsx";
import {API_URL} from "../../../../service/API_URL.jsx";

const Password = () => {
    const API = API_URL;

    const [user] = useState(GetStoredUser);
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [newAgainPassword, setNewAgainPassword] = useState("");

    const [isValid, setIsValid] = useState(false);

    // VERIFY PASSWORD
    const verifyPassword = async () => {
        try {
            const res = await fetch(`${API}/users?email=${user.email}&password=${oldPassword}`);
            const checkPass = await res.json();

            return checkPass.length > 0;
        } catch (error) {
            console.log("Error Verify Password:", error);
            return false;
        }
    };

    // CHECK NEW PASSWORD AND NEW PASSWORD AGAIN
    useEffect(() => {
        const handler = setTimeout(() => {
           if (newPassword !== newAgainPassword) {
               setIsValid(true);
           } else setIsValid(false);
        }, 500);

        return () => clearTimeout(handler);
    }, [newPassword, newAgainPassword]);

    // UPDATE PASSWORD
    const updatePassword = async (e) => {
        e.preventDefault();
        // Check Password
        const isOldPassCorrect = await verifyPassword();
        if (!isOldPassCorrect) {
            alert("Mật khẩu cũ không đúng!");
            return;
        }

        const changePassword = {
            ...user,
            "password": newPassword
        }

        try {
            const res = await fetch(`${API}/users/${user.id}`, {
                method: "PATCH",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(changePassword),
            });

            if (res.ok) {
                alert("Đổi mật khẩu thành công!");
                window.location.reload();
            }

        } catch (e) {
            console.log("ERROR UPDATE_PASSWORD ", e);
        }
    };

    return (
        <div className="password">
            <div className="title">Mật khẩu tài khoản</div>

            <form className="extraInfo" onSubmit={updatePassword}>
                <div className="info">
                    <p>Mật khẩu cũ:</p>
                    <input className="form-control" type="password" required placeholder="Nhập mật khẩu cũ (*)" onChange={(e) => setOldPassword(e.target.value)}/>
                </div>

                <div className="info">
                    <p>Mật khẩu mới:</p>
                    <input className="form-control" type="password" required placeholder="Nhập mật khẩu mới (*)" onChange={(e) => setNewPassword(e.target.value)}/>
                </div>

                <div className="info">
                    <p>Nhập lại mật khẩu mới:</p>
                    <input className="form-control" type="password" required placeholder="Nhập lại mật khẩu mới (*)" onChange={(e) => setNewAgainPassword(e.target.value)}/>
                </div>

                {isValid && <p style={{ color: "red" }}>Mật khẩu mới không khớp!</p>}

                <div className="btn-update">
                    <button className="btn" disabled={isValid} type="sumbit">Đổi mật khẩu</button>
                </div>
            </form>
        </div>
    );
};

export default Password;