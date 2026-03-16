import React from 'react';
import './accountBoxs.css'

import faceIcon from "/src/assets/face1.gif";

const AccountBoxs = () => {
    return (
        <div className="account-boxs">
            {/* 1 */}
            <div className="item-box">
                <div className="item-box-info">
                    <div className="text">Ôi không, bạn chưa cập nhật đủ thông tin!</div>

                    <div className="icon-info">
                        <div className="icon" style={{backgroundImage: `url(${faceIcon})`}}></div>
                        <div className="btn">Cập nhật ngay</div>
                    </div>
                </div>
            </div>

            {/* 2 */}
            <div className="item-box">
                <div className="item-box-info">
                    <div className="text">Bạn đang có 1 sản phẩm trong giỏ hàng!</div>

                    <div className="icon-info">
                        <div className="icon" style={{backgroundImage: `url(${faceIcon})`}}></div>
                        <div className="btn">Thanh toán ngay</div>
                    </div>
                </div>
            </div>

            {/* 3 */}
            <div className="item-box">
                <div className="item-box-info">
                    <div className="text">Ôi không, tạo đơn hàng đầu tiên ngay thôi!</div>

                    <div className="icon-info">
                        <div className="icon" style={{backgroundImage: `url(${faceIcon})`}}></div>
                        <div className="btn">Mua sắm ngay</div>
                    </div>
                </div>
            </div>

            {/* 4 */}
            <div className="item-box">
                <div className="item-box-info">
                    <div className="text">Chương trình khuyến mãi đang diễn ra!</div>

                    <div className="icon-info">
                        <div className="icon" style={{backgroundImage: `url(${faceIcon})`}}></div>
                        <div className="btn">Mua sắm ngay</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AccountBoxs;