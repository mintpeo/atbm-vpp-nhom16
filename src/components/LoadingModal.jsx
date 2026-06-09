import "./LoadingModal.css";

const LoadingModal = ({ isOpen, text = "Loading..." }) => {
    if (!isOpen) return null;

    return (
        <div className="loading-modal-overlay">
            <div className="loading-modal-box">
                <div className="loading-spinner"></div>
                <p>{text}</p>
            </div>
        </div>
    );
};

export default LoadingModal;