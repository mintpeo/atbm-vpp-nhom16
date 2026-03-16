import { Outlet } from 'react-router-dom';
import Navbar from './navbar/navbar.jsx'
import Footer from './footer/footer.jsx'
import Snowfall from "react-snowfall";

const MainLayout = () => {
    return (
        <>
            <Snowfall color="#82C3D9" style={{position: "fixed", zIndex: 99999}} />
            <Navbar />
            <main className="main-content">
                <Outlet />
            </main>
            <Footer />
        </>
    );
};

export default MainLayout;