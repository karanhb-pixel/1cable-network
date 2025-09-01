
import {Routes, Route } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import User from './Users/User';
import Home from './Home';
import Navbar from './Navbar/navbar';
import Footer from './footer/Footer';
import Posts from './Posts/Posts';
import Single from './Single';

import './App.css';

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
        <Route path="/posts" element={<Posts/>} />
        <Route path="/posts/:id" element={<Single />} />
      </Routes>
      <Footer />
    </>
   
  );
}



export default App;
