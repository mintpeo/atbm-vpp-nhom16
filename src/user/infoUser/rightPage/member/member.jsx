import React from 'react';
import './member.css'

const Member = () => {
    return (
        <div className="member">
            <div className="title">Hạng thành viên</div>

            <div className="info-member">
                <div className="text">Tổng chi tiêu tích lũy: <span>0 VND</span></div>
                <div className="text">Hạng thành viên hiện tại: <span>Silver</span></div>
                <div className="text">Điểm thành viên khả dụng: <span>0</span></div>
                <div className="text">Điểm thành viên cần có để lên hạng: <span>0</span></div>
                <div className="text">Hạng thành viên tiếp theo:</div>
                <div className="text-more">Xem thêm thông tin Điểm thành viên và Hạng thành viên <span>tại đây</span></div>
            </div>
        </div>
    );
};

export default Member;