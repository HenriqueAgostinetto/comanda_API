import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter as Router } from 'react-router-dom'; 
import { AuthProvider } from './context/AuthContext';
import { CustomThemeProvider } from './context/ThemeContext';
import './index.css';
// henrique agostinetto piva
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Router>
      <AuthProvider>
        <CustomThemeProvider>
          <App />
        </CustomThemeProvider>
      </AuthProvider>
    </Router>
  </React.StrictMode>
);
