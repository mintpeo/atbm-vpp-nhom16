import React, {useState} from 'react';
import './user.css';
import {GetStoredUser} from "../../../../service/GetStoredUser.jsx";
import {API_URL, INFO_USER} from "../../../../service/API_URL.jsx";

const User = () => {
    const [user, setUser] = useState(GetStoredUser);
    const setLastName = (e) => {setUser({...user, lastName: e.target.value})};
    const setFirstName = (e) => {setUser({...user, firstName: e.target.value})};
    const setPhone = (e) => {setUser({...user, phone: e.target.value})};
    const setDateOfBirth = (e) => {setUser({...user, dateOfBirth: e.target.value})};
    const setAddress = (e) => {setUser({...user, address: e.target.value})};

    const updateUserInfo = async () => {
        const newInfo = {
            ...user,
            "lastName": user.lastName,
            "firstName": user.firstName,
            "phone": user.phone,
            "dateOfBirth": user.dateOfBirth,
            "address": user.address,
        }

        try {
            const res = await fetch(`${API_URL}/users/${user.id}`, {
                method: "PATCH",
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(newInfo),
            });

            if (res.ok) {
                const newUserInfo = await res.json();
                localStorage.setItem(INFO_USER, JSON.stringify(newUserInfo));
                alert("Cập nhật thông tin thành công!");
                window.location.reload();
            } else alert("Cập nhật thất bại!");

        } catch (e) {
            console.log("ERROR UPDATE_USER_INFO ", e);
        }
    };

    return (
        <div className="right-user">
            <div className="title">Thông tin tài khoản</div>

            <form className="extraInfo" onSubmit={updateUserInfo}>
                <div className="info">
                    <p>Họ:</p>
                    <input className="form-control" type="text" required placeholder="Nhập họ (*)" value={user?.lastName || ""}
                           onChange={setLastName}/>
                </div>

                <div className="info">
                    <p>Tên:</p>
                    <input className="form-control" type="text" required placeholder="Nhập tên (*)" value={user?.firstName || ""}
                           onChange={setFirstName}/>
                </div>

                <div className="info">
                    <p>Email: <b>{user.email}</b></p>
                </div>

                <div className="info">
                    <p>Số điện thoại:</p>
                    <input className="form-control" type="text" required placeholder="Số điện thoại (*)" value={user?.phone || ""}
                           onChange={setPhone}/>
                </div>

                <div className="info">
                    <p>Ngày sinh:</p>
                    <input className="form-control" type="date" required placeholder="Ngày sinh (dd/mm/yyyy) (*)" value={user?.dateOfBirth || ""}
                           onChange={setDateOfBirth}/>
                </div>

                <div className="info">
                    <p>Địa chỉ:</p>
                    <input className="form-control" type="text" required placeholder="Địa chỉ" value={user?.address || ""}
                           onChange={setAddress}/>
                </div>

                <div className="btn-update">
                    <button className="btn" type="sumbit">Cập nhật thông tin</button>
                </div>
            </form>
        </div>
    );
};

export default User;