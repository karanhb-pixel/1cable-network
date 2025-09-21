import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import './index.css'
import App from './App.jsx'
import { BrowserRouter as Router} from 'react-router-dom';
import store, { persistor } from './store/index.js';
import LoadingSpinner from './components/LoadingSpinner';

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <PersistGate
      loading={<LoadingSpinner size="large" message="Restoring session..." />}
      persistor={persistor}
    >
      <Router>
        <App />
      </Router>
    </PersistGate>
  </Provider>
)
