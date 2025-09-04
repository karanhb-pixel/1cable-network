import React, { useState, useEffect } from 'react';
import { UserContext } from './context/UserContext';

// UserProvider component
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    // Initialize state from sessionStorage on component creation
    try {
      const storedUser = sessionStorage.getItem('user');
      return storedUser ? JSON.parse(storedUser) : null;
    } catch (error) {
      console.error("Failed to parse user from sessionStorage:", error);
      return null;
    }
  });

  // Save user to sessionStorage on change
  useEffect(() => {
    if (user) {
      sessionStorage.setItem('user', JSON.stringify(user));
    } else {
      sessionStorage.removeItem('user');
    }
  }, [user]);

  const value = {
    user,
    setUser,
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

