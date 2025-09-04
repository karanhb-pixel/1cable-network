
import {Routes, Route } from 'react-router-dom';
import React from 'react';
import User from './User/Users/User';
import Home from './component/Home';
import Navbar from './component/Navbar/navbar';
import Footer from './component/footer/Footer';
import Add_User from './User/Add_User/Add_User';
import './App.css';
import { Add_Wifi_plans } from './component/Wifi_plan/Add_Wifi_plans/Add_Wifi_plans';
import { Show_Wifi_plans_2 } from './component/Wifi_plan/Show_Wifi_plans/Show_Wifi_plans_2';
import { UserProvider, useUser } from './UserContext';
import { Ott_plan } from './component/Ott_plan/Ott_plan';
function AppContent() {
  const { user, setUser } = useUser();

  return (
    <>
      <Navbar user={user} onLogout={() => setUser(null)} />
      <Routes>
        <Route path="/user" element={<User user={user} setUser={setUser} />} />
        <Route path="/" element={<Home user={user} />} />
        <Route path="/add_User" element={<Add_User user={user}/>}/>
        <Route path='/add_Wifi_plans' element={<Add_Wifi_plans/>} />
        <Route path='/show_Wifi_plans_2' element={<Show_Wifi_plans_2/>} />
        <Route path='/ott_plan' element={<Ott_plan/>} />
      </Routes>
      <Footer />
    </>
  );
}

function App() {
  return (
    <UserProvider>
      <AppContent />
    </UserProvider>
  );
}



export default App;
