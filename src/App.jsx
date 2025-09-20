import React, { useEffect, lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setUser, selectUser } from './store/authSlice';
import Navbar from './component/Navbar/navbar';
import Footer from './component/footer/Footer';
import './App.css';

// Dynamically import components that are not needed on initial page load
const User = lazy(() => import('./User/Users/User'));
const Home = lazy(() => import('./component/Home'));
const Add_User = lazy(() => import('./User/Add_User/Add_User'));
const Add_Wifi_plans = lazy(() => import('./component/Wifi_plan/Add_Wifi_plans/Add_Wifi_plans'));
const Show_Wifi_plans_2 = lazy(() => import('./component/Wifi_plan/Show_Wifi_plans/Show_Wifi_plans_2'));
const Ott_plan = lazy(() => import('./component/Ott_plan/Ott_plan'));
const Edit_User = lazy(() => import('./User/Edit_User/Edit_User'));
const Delete_User = lazy(() => import('./User/Delete_User/Delete_User'));

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
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/user" element={<User />} />
          <Route path="/" element={<Home />} />
          <Route path="/add_User" element={<Add_User />} />
          <Route path='/add_Wifi_plans' element={<Add_Wifi_plans />} />
          <Route path='/show_Wifi_plans_2' element={<Show_Wifi_plans_2 />} />
          <Route path='/ott_plan' element={<Ott_plan />} />
          <Route path="/edit-user/:id" element={<Edit_User />} />
          <Route path="/delete-user/:id" element={<Delete_User />} />
        </Routes>
      </Suspense>
      <Footer />
    </>
  );
}

function App() {
  return <AppContent />;
}

export default App;