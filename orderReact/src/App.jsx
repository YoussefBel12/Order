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
import StockManagement from "./components/StockManagement"; 
import Layout from "./components/Layout";
import PurchaseProductComponent from "./components/PurchaseProductComponent";


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
            {/* 
        <div>
            {userData && isLoggedIn && < div > Welcome, { userData.email }({ userData.role })</div>}
           
        </div>

        */}


           
     
            


            {/*testing something delete later 
            {userData && userData.role === 'user' ? (
                <OrderManagement />
            ) : (
                <div style={{ padding: 32, textAlign: 'center', color: 'red', fontWeight: 'bold' }}>
                    Access denied. Only users with the 'user' role can view orders.
                </div>
            )}  */ }

            <Layout userData={userData}>
               
        <Routes>



                 <Route path="/Home" element={<Home />} />   
                   

            <Route path="/Order" element={<OrderManagement />} />
            <Route path="/Rules" element={<RulesManagement />} />
            <Route path="/Notification" element={<NotificationCenter />} />

                {/*added this*/}
                <Route path="/Stock" element={<StockManagement />} />
           <Route path="/purchase" element={<PurchaseProductComponent />} />

            
            <Route path="/Login" element={<Login  />} />
            <Route path="/Register" element={<Register />} /> 
            <Route path="/" element={<Navigate to="/login" />} />


          </Routes>

                </Layout >
          </>

       
       
    );
};

export default App;
