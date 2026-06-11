import React, {useEffect, useState} from 'react';
import './cart.css';

import {Link, useNavigate} from "react-router-dom";
import { MdLocalShipping } from "react-icons/md";
import {API_URL, API_URL_BE, QUANTITY_CART} from "../service/API_URL.jsx";
import {GetStoredUser} from "../service/GetStoredUser.jsx";

const Cart = () => {
    const navigate = useNavigate();
    const [user] = useState(GetStoredUser);
    const [carts, setCarts] = useState([]);
    const [products, setProducts] = useState({});
    const [selectedItems, setSelectedItems] = useState([]);

    // Load list carts
    const loadCarts = async () => {
        const userCart = {
            userId: user.id
        };

        try {
            const res = await fetch(`${API_URL_BE}/cart/show`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(userCart),
            })

            const data = await res.json();
            setCarts(data);
        } catch (e) {
            console.log("Error Cart", e);
        }
    }

    useEffect(() => {
        loadCarts();
    }, []);

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

    console.log(carts);

    // Selected Item
    const toggleSelectItem = (id) => {
        if (selectedItems.includes(id)) {
            setSelectedItems(selectedItems.filter(selectedId => selectedId !== id)); // Co Roi Thi Loai Bo
        } else {
            setSelectedItems([...selectedItems, id]); // Chua Thi Them Vao
        }
    };

    // Total Price In Cart
    const totalPrice = () => {
        let total = 0;
        let stringCur = "";

        selectedItems.forEach(itemSelectedId => {
            const itemCart = carts.find(cart => cart.id === itemSelectedId);

            if (itemCart) {
                const product = products[itemCart.productId];
                total += Number(product?.price || 0) * Number(itemCart.quantity || 0);
                stringCur = product?.currency || "";
            }
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
      else navigate("/cart/checkout", {state: {selected: selectedItems}});
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
                                                checked={selectedItems.includes(item.id)}
                                                onChange={() => toggleSelectItem(item.id)}
                                            />

                                            <img src={item.image} alt="" className="item-img"/>

                                            <div className="item-cart">
                                                <div className="item-left">
                                                    <div className="name" title="222">{products[item.productId]?.name}</div>
                                                    <div className="type">Loại: {item.type}</div>
                                                </div>

                                                <div className="item-middle">
                                                    <div className="price-dis">{products[item.productId]?.price.toLocaleString()} {products[item.productId]?.currency}</div>
                                                    <div className="price-noDis">{products[item.productId]?.originalPrice.toLocaleString()} {products[item.productId]?.currency}</div>
                                                    <div className="price-percent">-{calculateDiscountPercentage(products[item.productId]?.originalPrice, products[item.productId]?.price)}%</div>
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