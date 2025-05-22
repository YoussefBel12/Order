import OrderManagement from "./components/OrderManagement"; 
import "./App.css";
import RulesManagement from "./components/RulesManagement";
import { Routes, Route } from 'react-router-dom';
import Home from "./components/Home";
import NotificationCenter from "./components/NotificationCenter";

function App() {
    return (
      
        <Routes>

            <Route path="/" element={<Home />} />
            <Route path="/Order" element={<OrderManagement />} />
            <Route path="/Rules" element={<RulesManagement />} />
            <Route path="/Notification" element={<NotificationCenter />} />

          </Routes>

      
       
    );
};

export default App;
