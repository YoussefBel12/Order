import OrderManagement from "./components/OrderManagement"; 
import "./App.css";
import RulesManagement from "./components/RulesManagement";
import { Routes, Route , Navigate} from 'react-router-dom';
import Home from "./components/Home";
import NotificationCenter from "./components/NotificationCenter";
//test imports
import Login from "./components/Login";
import Register from "./components/Register"; 
import { fetchUserData } from "./utils/auth";
import { useEffect, useState } from "react";

//function App() {
const App = () => {
    const [userData, setUserData] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const getUser = async () => {
            const user = await fetchUserData();
            setUserData(user);
            setIsLoggedIn(!!user);
        };
        getUser();
    }, []);

    return (

        <>
        <div>
            {userData && isLoggedIn && < div > Welcome, { userData.email }({ userData.role })</div>}
            {/* Render features based on userData.role */}
        </div>

        

        <Routes>

            <Route path="/Home" element={<Home />} />
            <Route path="/Order" element={<OrderManagement />} />
            <Route path="/Rules" element={<RulesManagement />} />
            <Route path="/Notification" element={<NotificationCenter />} />

          

            
            <Route path="/Login" element={<Login  />} />
            <Route path="/Register" element={<Register />} /> 
            <Route path="/" element={<Navigate to="/login" />} />


          </Routes>

      
          </>

       
       
    );
};

export default App;
