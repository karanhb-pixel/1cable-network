
import {Routes, Route } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import User from './User/Users/User';
import Home from './component/Home';
import Navbar from './component/Navbar/navbar';
import Footer from './component/footer/Footer';
import Add_User from './User/Add_User/Add_User';
import './App.css';
import { Add_Wifi_plans } from './component/Wifi_plan/Add_Wifi_plans/Add_Wifi_plans';
import { Show_Wifi_plans } from './component/Wifi_plan/Show_Wifi_plans/Show_Wifi_plans';

function App() {
  const [user, setUserState] = useState(null);

  // Load user from sessionStorage on mount
  useEffect(() => {
    const storedUser = sessionStorage.getItem('user');
    if (storedUser) {
      setUserState(JSON.parse(storedUser));
    }
  }, []);

  // Save user to sessionStorage on change
  useEffect(() => {
    if (user) {
      sessionStorage.setItem('user', JSON.stringify(user));
    } else {
      sessionStorage.removeItem('user');
    }
  }, [user]);

  // Wrapper to update user state
  const setUser = (u) => setUserState(u);

  return (
    <>
      <Navbar user={user} onLogout={() => setUser(null)} />
      <Routes>
        <Route path="/user" element={<User user={user} setUser={setUser} />} />
        <Route path="/" element={<Home user={user} />} />
        <Route path="/add_User" element={<Add_User/>}/>
        <Route path='/add_Wifi_plans' element={<Add_Wifi_plans/>} />
        <Route path='show_Wifi_plans' element={<Show_Wifi_plans/>} />
      </Routes>
      <Footer />
    </>
   
  );
}



export default App;
