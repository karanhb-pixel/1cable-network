import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import usersReducer from './usersSlice';
import plansReducer from './plansSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    users: usersReducer,
    plans: plansReducer,
  },
});

export default store;