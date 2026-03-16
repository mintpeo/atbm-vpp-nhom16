import React, {useEffect, useState} from 'react';
import './cart.css';

import {Link, useNavigate} from "react-router-dom";
import { MdLocalShipping } from "react-icons/md";
import {API_URL, QUANTITY_CART} from "../service/API_URL.jsx";
import {GetStoredUser} from "../service/GetStoredUser.jsx";
import useFetch from "../hooks/useFetch.js";

const Cart = () => {
    const [user] = useState(GetStoredUser);
    // Load list carts
    const {data: carts}= useFetch(`${API_URL}/carts?userId=${user.id}`);
    const [selectedItems, setSelectedItems] = useState([]);

    const navigate = useNavigate();

    // Selected Item
    const toggleSelectItem = (item) => {
        const isExisted = selectedItems.some(selected => selected.id === item.id);

        if (isExisted) {
            setSelectedItems(selectedItems.filter(selected => selected.id !== item.id)); // Co Roi Thi Loai Bo
        } else {
            setSelectedItems([...selectedItems, item]); // Chua Thi Them Vao
        }
    };

    // Total Price In Cart
    const totalPrice = () => {
        let total = 0;
        let stringCur = "";

        selectedItems.forEach(itemSelected => {
            carts.forEach(itemCart => {
                if (itemSelected.id === itemCart.id) {
                    total += itemCart.price * itemCart.quantity;
                }
                stringCur = itemCart.currency;
            })
        });

        return total.toLocaleString() + " " + stringCur;
    };

    // Update Quantity Cart
    useEffect(() => {
        if (carts && carts.length > 0) {
            let quantity = carts.length;
            localStorage.setItem(QUANTITY_CART, quantity);
        } else if (carts.length < 0) localStorage.setItem(QUANTITY_CART, 0);
    });

    // Add or Sub Quantity
    const updateQuantity = async (num, id, quantity) => {
        let newQuantity = num + quantity;

        if (newQuantity < 1) return;

        try {
            const res = await fetch(`${API_URL}/carts/${id}`, {
                method: "PATCH",
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({"quantity": newQuantity}),
            });

            if (res.ok) loadCarts();
        } catch (e) {
            console.log("ERROR UPDATE_QUANTITY ", e);
        }
    };

    // Remove Product In Cart
    const removeProduct = async (id) => {
        const isConfirm = window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này khỏi giỏ hàng?");

        if (isConfirm) {
            try {
                const res = await fetch(`${API_URL}/carts/${id}`, {
                    method: "DELETE",
                });

                if (res.ok) {
                    loadCarts();
                    window.location.reload();
                }
            } catch (e) {
                console.log("ERROR REMOVE_FROM_CART ", e);
            }
        }
    };

    //  Calculate Dis %
    const calculateDiscountPercentage = (originalPrice, discountedPrice) => {
        let savings = originalPrice - discountedPrice;
        let percentage = (savings / originalPrice) * 100;

        return Math.trunc(percentage);
    }

    // Click Check Out
    const clickCheckOut = () => {
      if (selectedItems && selectedItems.length === 0) alert("Vui lòng chọn sản phẩm để tiến hành đặt hàng!");
      else navigate("/cart/checkout", {state: {products: selectedItems}});
    };

    return (
        <div id="cart">
            <div className="container">
                <div className="title">Giỏ hàng</div>
                {
                    carts && carts.length > 0 ? (
                        <div className="main-cart">
                            <div className="container-left">
                                {
                                    carts.map((item) => (
                                        <div className="list-cart">
                                            <input
                                                type="checkbox"
                                                checked={selectedItems.some(selected => selected.id === item.id)}
                                                onChange={() => toggleSelectItem(item)}
                                            />

                                            <img src={item.image} alt="" className="item-img"/>

                                            <div className="item-cart">
                                                <div className="item-left">
                                                    <div className="name" title="222">{item.name}</div>
                                                    <div className="type">Mực {item.color}</div>
                                                </div>

                                                <div className="item-middle">
                                                    <div className="price-dis">{item.price.toLocaleString()} {item.currency}</div>
                                                    <div className="price-noDis">{item.originalPrice.toLocaleString()} {item.currency}</div>
                                                    <div className="price-percent">-{calculateDiscountPercentage(item.originalPrice, item.price)}%</div>
                                                </div>

                                                <div className="item-right">
                                                    <button onClick={() => updateQuantity(-1, item.id, item.quantity)} className="btn">-</button>
                                                    <div className="quantity">{item.quantity}</div>
                                                    <button onClick={() => updateQuantity(+1, item.id, item.quantity)} className="btn" style={{borderRadius: "0 4px 4px 0"}}>+</button>
                                                </div>

                                                <button onClick={() => removeProduct(item.id)} className="btn-remove" title="Xoá">X</button>
                                            </div>
                                        </div>
                                    ))
                                }
                            </div>
                            <div className="container-right">
                                <div className="total-price">
                                    <div>Tổng tiền</div>
                                    <div className="price">{totalPrice()}</div>
                                </div>

                                <div className="note">
                                    <div className="title-note">Ghi chú đơn hàng <span>(Không hỗ trợ đổi hàng và màu sắc liên quan đơn hàng sản phẩm giao ngẫu nhiên)</span></div>
                                    <textarea className="input-note" rows="8"></textarea>
                                    <button onClick={clickCheckOut} className="btn-cart" title="Tiến hành đặt hàng">Tiến hành đặt hàng</button>
                                </div>
                            </div>
                            <div className="free-ship"><i><MdLocalShipping /></i>Miễn phí vận chuyển cho đơn hàng từ 100,000₫</div>
                        </div>
                    ) : (
                        <p>Chưa có sản phẩm nào trong giỏ hàng - quay về <Link to="/" style={{textDecoration: "none", color: "#007bff"}}>Trang Chủ</Link> để mua hàng</p>
                    )
                }
            </div>
        </div>
    );
};

export default Cart;