import React from 'react';
import './footer.css'

import logo from '../assets/logo-footer.png'
import logoPK from '../assets/logoPARKER.png'
import { FaFacebookF } from "react-icons/fa";
import { FaYoutube } from "react-icons/fa";

const Footer = () => {
    return (
        <div id="footer">
            <div className="container">
                {/*  LOGO  */}
                <div className="logo-footer">
                    <img src={logo} alt="logo"/>

                    <div className="about-company">
                        <p style={{fontWeight: "bold", color: "#fbe263"}}>Thienlong.vn - Website thương mại điện tử thuộc Công Ty TNHH MTV TM-DV Thiên Long Hoàn Cầu</p>
                        <p>Công Ty TNHH MTV TM-DV Thiên Long Hoàn Cầu</p>
                        <p>GPĐKKD số 0305341389 do Sở Kế Hoạch và Đầu Tư Thành Phố Hồ Chí Minh cấp ngày 15/11/2007</p>
                    </div>

                    <div className="input-mail">
                        <input type="text" className="mail" placeholder="Nhập địa chỉ email" required/>
                        <button className="btn-input" type="sumbit">Đăng ký</button>
                    </div>

                    <div className="line-parker">
                        <a href="#" title="Điểm phân phối Parker"><img src={logoPK} alt=""/> Điểm phân phối Parker</a>
                    </div>
                </div>

                {/*  ADDRESS  */}
                <div className="address">
                    <p className="title">ĐỊA CHỈ CÔNG TY</p>
                    <p><b>Head Office:</b> Tầng 10, Sofic Tower, Số 10 Đường Mai Chí Thọ, Phường An Khánh, Thành Phố Hồ Chí Minh, Việt Nam</p>
                    <p><b>Miền Bắc:</b> Số 38, đường Gamuda Gardens 2-5, Khu đô thị mới C2 - Gamuda Gardens, Phường Trần Phú, Thành phố Hà Nội, Việt Nam.</p>
                </div>

                {/*  CONTACT  */}
                <div className="contact">
                    <p className="title">HỖ TRỢ KHÁCH HÀNG</p>
                    <p className="font-contact">Hotline: <a href="#" className="font-contact" title="1900 866 819">1900 866 819</a></p>
                    <p className="font-contact">Thứ 2 - Thứ 6 (8h - 17h)</p>
                    <p className="font-contact">salesonline@thienlongvn.com</p>
                    
                    <div className="list-contact">
                        <ul className="list-item">
                            <li className="item"><a href="#" title="Hướng dẫn mua hàng">Hướng dẫn mua hàng</a></li>
                            <li className="item"><a href="#" title="Hướng dẫn thanh toán">Hướng dẫn thanh toán</a></li>
                            <li className="item"><a href="#" title="Chính sách giao hàng">Chính sách giao hàng</a></li>
                            <li className="item"><a href="#" title="Chính sách đổi trả & hoàn tiền">Chính sách đổi trả & hoàn tiền</a></li>
                            <li className="item"><a href="#" title="Khách hàng thân thiết">Khách hàng thân thiết</a></li>
                            <li className="item"><a href="#" title="Khách hàng ưu tiên">Khách hàng ưu tiên</a></li>
                            <li className="item"><a href="#" title="Phản ánh chất lượng sản phẩm">Phản ánh chất lượng sản phẩm</a></li>
                        </ul>
                    </div>
                </div>

                {/*  ABOUT  */}
                <div className="about">
                    <p className="title">VỀ THIENLONG.VN</p>

                    <div className="list-about">
                        <ul className="list-item">
                            <li className="item"><a href="#" title="Giới thiệu">Giới thiệu</a></li>
                            <li className="item"><a href="#" title="Dịch vụ in ấn quảng cáo">Dịch vụ in ấn quảng cáo</a></li>
                            <li className="item"><a href="#" title="Chính sách bảo mật chung">Chính sách bảo mật chung</a></li>
                            <li className="item"><a href="#" title="Chính sách bảo mật thông tin cá nhân">Chính sách bảo mật thông tin cá nhân</a></li>
                            <li className="item"><a href="#" title="Thông tin liên hệ">Thông tin liên hệ</a></li>
                            <li className="item"><a href="#" title="Chương trình Affiliate">Chương trình Affiliate</a></li>
                        </ul>
                    </div>

                    <div className="logo-about">
                        <a href="#" className="icon" title="Facebook social"><FaFacebookF /></a>
                        <a href="#" className="icon" title="Youtube social"><FaYoutube /></a>
                    </div>
                </div>
            </div>

            <div className="footer-bottom">
                <p>2025 © Thienlong.vn - Bản quyền thuộc Công Ty TNHH MTV TM-DV Thiên Long Hoàn Cầu</p>
            </div>
        </div>
    );
};

export default Footer;