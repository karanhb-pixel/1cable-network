import React, { useEffect, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setUser, selectUser } from './store/authSlice';
import ErrorBoundary from './components/ErrorBoundary';
import AsyncErrorBoundary from './components/AsyncErrorBoundary';
import PlansErrorBoundary from './components/PlansErrorBoundary';
import LoadingSpinner from './components/LoadingSpinner';
import { routeLoaders, preloadCriticalRoutes } from './utils/dynamicImports.jsx';
import './App.css';

// Get optimized lazy components with preloading
const {
  User: UserLoader,
  Home: HomeLoader,
  AddUser: AddUserLoader,
  AddWifiPlans: AddWifiPlansLoader,
  ShowWifiPlans: ShowWifiPlansLoader,
  OttPlans: OttPlansLoader,
  EditUser: EditUserLoader,
  DeleteUser: DeleteUserLoader,
  Navbar: NavbarLoader,
  Footer: FooterLoader
} = routeLoaders;

// Extract components from loaders
const User = UserLoader().Component;
const Home = HomeLoader().Component;
const Add_User = AddUserLoader().Component;
const Add_Wifi_plans = AddWifiPlansLoader().Component;
const Show_Wifi_plans_2 = ShowWifiPlansLoader().Component;
const Ott_plan = OttPlansLoader().Component;
const Edit_User = EditUserLoader().Component;
const Delete_User = DeleteUserLoader().Component;
const Navbar = NavbarLoader().Component;
const Footer = FooterLoader().Component;

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

  // Preload critical routes when component mounts
  useEffect(() => {
    preloadCriticalRoutes().catch(error => {
      console.warn("Failed to preload critical routes:", error);
    });
  }, []);

  // Preload likely routes based on current user state
  useEffect(() => {
    if (user) {
      // User is logged in, preload user-related routes
      routeLoaders.User().preload();
      routeLoaders.AddUser().preload();
    } else {
      // User is not logged in, preload public routes
      routeLoaders.Home().preload();
    }
  }, [user]);

  return (
    <ErrorBoundary
      showDetails={import.meta.env.DEV}
      title="Application Error"
      message="Something went wrong with the application. Please refresh the page to continue."
    >
      <Navbar />
      <ErrorBoundary
        showDetails={import.meta.env.DEV}
        title="Navigation Error"
        message="There was an issue with the navigation. Please try again."
      >
        <Suspense fallback={<LoadingSpinner size="large" message="Loading page..." />}>
          <Routes>
            <Route
              path="/user"
              element={
                <AsyncErrorBoundary>
                  <User />
                </AsyncErrorBoundary>
              }
            />
            <Route
              path="/"
              element={
                <AsyncErrorBoundary>
                  <Home />
                </AsyncErrorBoundary>
              }
            />
            <Route
              path="/add_User"
              element={
                <AsyncErrorBoundary>
                  <Add_User />
                </AsyncErrorBoundary>
              }
            />
            <Route
              path='/add_Wifi_plans'
              element={
                <PlansErrorBoundary>
                  <Add_Wifi_plans />
                </PlansErrorBoundary>
              }
            />
            <Route
              path='/show_Wifi_plans_2'
              element={
                <PlansErrorBoundary>
                  <Show_Wifi_plans_2 />
                </PlansErrorBoundary>
              }
            />
            <Route
              path='/ott_plan'
              element={
                <PlansErrorBoundary>
                  <Ott_plan />
                </PlansErrorBoundary>
              }
            />
            <Route
              path="/edit-user/:id"
              element={
                <AsyncErrorBoundary>
                  <Edit_User />
                </AsyncErrorBoundary>
              }
            />
            <Route
              path="/delete-user/:id"
              element={
                <AsyncErrorBoundary>
                  <Delete_User />
                </AsyncErrorBoundary>
              }
            />
          </Routes>
        </Suspense>
      </ErrorBoundary>
      <Footer />
    </ErrorBoundary>
  );
}

function App() {
  return <AppContent />;
}

export default App;