import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Logout = ({ onLogout }) => {
    const navigate = useNavigate();

    useEffect(() => {
        // Remove JWT and any other user data from localStorage
        localStorage.removeItem("token");
        // Optionally clear user data in parent/global state
        if (onLogout) onLogout();
        // Redirect to login
        navigate("/login", { replace: true });
    }, [navigate, onLogout]);

    return null; // No UI needed
};

export default Logout;