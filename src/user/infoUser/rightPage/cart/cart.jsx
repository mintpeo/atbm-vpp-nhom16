import React, {useEffect, useState} from 'react';
import "./cart.css"
import {API_URL_BE} from "../../../../service/API_URL.jsx";
import {GetStoredUser} from "../../../../service/GetStoredUser.jsx";
import {data} from "react-router-dom";

const Cart = () => {
    const [user] = useState(GetStoredUser);
    const [orders, setOrders] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [orderItems, setOrderItems] = useState([]);
    const [verify, setVerify] = useState(false);
    const [privateKey, setPrivateKey] = useState("");

    const loadOrders = async () => {
        try {
            const res = await fetch(`${API_URL_BE}/order/show`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(user.id)
            })

            if (res.ok) {
                const data = await res.json();
                setOrders(data);
            }
        } catch (e) {
            console.log("Error Order", e);
        }
    }

    useEffect(() => {
        loadOrders();
    }, []);

    const openOrderDetail = async (orderId) => {
        try {
            const res = await fetch(`${API_URL_BE}/order/detail?orderId=${orderId}`);
            const data = await res.json();

            setSelectedOrder(orderId);
            setOrderItems(data);
            setShowModal(true);
        } catch (e) {
            console.log("Error Order Detail", e);
        }
    };

    // Verify Again
    const verifySignatureAgain = async (orderId) => {
        const signa = {
            userId: user.id,
            orderId: orderId,
            privateKey: privateKey.trim()
        }

        try {
            const res = await fetch(`${API_URL_BE}/signature/check`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(signa)
            });
            const data = await res.json();
            console.log(data)

            if (res.ok) {
                if (data) {
                    alert("Kí thành công!");
                    setShowModal(false);
                    window.location.reload();
                }
            } else alert("Vui lòng kiểm tra lại Private Key!")
        } catch (e) {
            console.log("Error Verify Again", e);
        }
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

    return (
        <div id="cart-right">
            <div className="container">
                {/* MODAL */}
                {
                    showModal && (
                        <div className="modal-overlay">
                            <div className="order-detail-modal">
                                <div className="modal-header">
                                    <h2>Mã đơn hàng #{selectedOrder}</h2>

                                    <button
                                        className="btn-close"
                                        onClick={() => {
                                            setShowModal(false);
                                            setOrderItems([]);
                                            setPrivateKey("");
                                        }}
                                    >✕</button>
                                </div>

                                <div className="modal-body">
                                    <div className="detail-header">
                                        <div>Mã sản phầm</div>
                                        <div>Loại</div>
                                        <div>Giá</div>
                                        <div>Số lượng</div>
                                        <div>Tổng</div>
                                    </div>

                                    {
                                        orderItems.map((item, index) => (
                                            <div
                                                key={index}
                                                className="detail-row"
                                            >
                                                <div>{item.productId}</div>
                                                <div>{item.type}</div>
                                                <div>{item.price?.toLocaleString()} ₫</div>
                                                <div>{item.quantity}</div>
                                                <div>{(item.price * item.quantity).toLocaleString()} ₫</div>
                                            </div>
                                        ))
                                    }
                                </div>

                                <div className="modal-footer">
                                    <div className="verify-again">
                                        {verify? (<></>) : (
                                            <div>
                                                <textarea
                                                    className="private-key-input"
                                                    placeholder="Nhập Private Key tại đây..."
                                                    value={privateKey}
                                                    onChange={(e) => setPrivateKey(e.target.value)}
                                                    cols="30" rows="1"></textarea>
                                                <div className="text-btn">
                                                    <input type="file" accept=".key,.txt" onChange={handleFile} />
                                                    <button onClick={() => verifySignatureAgain(selectedOrder)} className="verify">Verify</button>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                        <h3>
                                            Thành tiền:
                                        {orderItems.reduce((sum, item) =>
                                                        sum + item.price * item.quantity, 0)
                                            .toLocaleString()}₫
                                    </h3>
                                </div>
                            </div>
                        </div>
                    )
                }

                <div className="title">Đơn hàng của bạn</div>

                <div className="order-table">
                    <div className="order-row order-header" style={{cursor: "auto", background: "none"}}>
                        <div>Mã đơn hàng</div>
                        <div>Ngày đặt</div>
                        <div>Thành tiền</div>
                        <div>Verify</div>
                    </div>

                    {orders.length > 0 ? (
                        orders.sort((a, b) => b.id - a.id).map(item => (
                            <div onClick={() => {
                                setShowModal(true);
                                openOrderDetail(item.id);
                                setVerify(item.verify);
                            }} className={item.verify? `order-row` : `order-row order-fail`} key={item.id}>
                                <div>{item.id}</div>
                                <div style={{width: "200px"}}>{item.createdAt}</div>
                                <div>{item.totalPrice.toLocaleString()}₫</div>
                                <div>{item.verify? "Thành công" : "Thất bại"}</div>
                            </div>
                        ))
                    ) : (
                        <div className="order-empty">
                            Không có đơn hàng nào.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Cart;