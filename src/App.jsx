
import {Routes, Route } from 'react-router-dom';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setUser, selectUser } from './store/authSlice';
import User from './User/Users/User';
import Home from './component/Home';
import Navbar from './component/Navbar/navbar';
import Footer from './component/footer/Footer';
import Add_User from './User/Add_User/Add_User';
import './App.css';
import { Add_Wifi_plans } from './component/Wifi_plan/Add_Wifi_plans/Add_Wifi_plans';
import { Show_Wifi_plans_2 } from './component/Wifi_plan/Show_Wifi_plans/Show_Wifi_plans_2';

import { Ott_plan } from './component/Ott_plan/Ott_plan';
import Edit_User from './User/Edit_User/Edit_User';
import { Delete_User } from './User/Delete_User/Delete_User';
function AppContent() {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);

  useEffect(() => {
    const stored = sessionStorage.getItem('user');
    if (stored && !user) {
      try {
        dispatch(setUser(JSON.parse(stored)));
      } catch (error) {
        console.error("Failed to parse user from sessionStorage:", error);
        sessionStorage.removeItem('user');
      }
    }
  }, [dispatch, user]);

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/user" element={<User />} />
        <Route path="/" element={<Home />} />
        <Route path="/add_User" element={<Add_User />}/>
        <Route path='/add_Wifi_plans' element={<Add_Wifi_plans/>} />
        <Route path='/show_Wifi_plans_2' element={<Show_Wifi_plans_2/>} />
        <Route path='/ott_plan' element={<Ott_plan/>} />
        <Route path="/edit-user/:id" element={<Edit_User />} />
        <Route path="/delete-user/:id" element={<Delete_User />} />
      </Routes>
      <Footer />
    </>
  );
}

function App() {
  return <AppContent />;
}



export default App;
