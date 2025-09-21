import { configureStore } from '@reduxjs/toolkit';
import { createLogger } from 'redux-logger';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import authReducer from './authSlice';
import usersReducer from './usersSlice';
import plansReducer from './plansSlice';

// Redux Persist configuration
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth'], // Only persist auth state
  blacklist: ['users', 'plans'], // Don't persist these for performance
};

// Performance monitoring middleware
const performanceMiddleware = () => (next) => (action) => {
  const start = performance.now();

  // Log action for debugging
  if (import.meta.env.DEV) {
    console.log('🚀 Dispatching:', action.type, action);
  }

  const result = next(action);

  const end = performance.now();
  const duration = end - start;

  // Log slow actions in development
  if (import.meta.env.DEV && duration > 10) {
    console.warn(`⚠️ Slow action detected: ${action.type} took ${duration.toFixed(2)}ms`);
  }

  return result;
};

// Error handling middleware
const errorMiddleware = () => (next) => (action) => {
  try {
    return next(action);
  } catch (error) {
    console.error('❌ Redux Error:', error);
    console.error('Action that caused error:', action);

    // In production, you might want to send this to an error reporting service
    if (import.meta.env.PROD) {
      // Example: errorReportingService.captureException(error, { action });
    }

    throw error;
  }
};

// Create logger middleware (only in development)
const logger = createLogger({
  collapsed: true,
  duration: true,
  timestamp: true,
  colors: {
    title: () => '#139BFE',
    prevState: () => '#1C5E20',
    action: () => '#149945',
    nextState: () => '#2E7D32',
    error: () => '#FF5722',
  },
  predicate: () => import.meta.env.DEV,
  // Only log specific actions in production if needed
  actionTransformer: (action) => ({
    ...action,
    // Don't log sensitive data like passwords
    payload: action.type?.includes('LOGIN') && action.payload?.password
      ? { ...action.payload, password: '[REDACTED]' }
      : action.payload,
  }),
});

// Persisted auth reducer
const persistedAuthReducer = persistReducer(persistConfig, authReducer);

// Store configuration
const store = configureStore({
  reducer: {
    auth: persistedAuthReducer,
    users: usersReducer,
    plans: plansReducer,
  },
  middleware: (getDefaultMiddleware) => {
    const defaultMiddleware = getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
        ignoredPaths: ['register'],
      },
      immutableCheck: {
        ignoredPaths: ['auth.user'],
      },
    });

    // Add custom middleware
    const customMiddleware = [
      ...defaultMiddleware,
      performanceMiddleware,
      errorMiddleware,
    ];

    // Add logger only in development
    if (import.meta.env.DEV) {
      customMiddleware.push(logger);
    }

    return customMiddleware;
  },
  // Enable Redux DevTools in development
  devTools: import.meta.env.DEV ? {
    name: 'Cable Network App',
    trace: true,
    traceLimit: 25,
    actionCreators: {
      // You can add custom action creators here for DevTools
    },
  } : false,
  // Performance optimizations
  enhancers: (defaultEnhancers) => {
    return defaultEnhancers.concat(
      // Add any custom enhancers here if needed
    );
  },
});

// Persistor for redux-persist
export const persistor = persistStore(store);

// Custom hooks for better DX (ready for TypeScript migration)
export const useAppDispatch = () => store.dispatch;
export const useAppSelector = (selector) => selector(store.getState());

export default store;