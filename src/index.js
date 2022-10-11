import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './index.css';

import App from './App';
import Browse from './pages/Browse'
import TopNav from './components/Navbar'

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
  <TopNav />
  <Routes>
    <Route path="/" element={<App />} />
    <Route path="/browse" element={<Browse />} />
  </Routes>
</BrowserRouter>


);

