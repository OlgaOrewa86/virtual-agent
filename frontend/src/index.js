import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import OrderTracking from "./pages/OrderTracking";
import ErrorBoundary from "./components/ErrorBoundary";


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/orders/:orderId" element={<OrderTracking />} />
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  </React.StrictMode>
);


reportWebVitals();
