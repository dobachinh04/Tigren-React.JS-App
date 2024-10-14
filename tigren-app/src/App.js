import React from "react";
import "./App.css";
import './index.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Blog from './pages/Blog';
import About from './pages/About';
import Products from './pages/Products';
import Login from './pages/Login';
import UserDetail from './pages/UserDetail';
import Cart from './pages/Cart';

function App() {
    return (
        <Router>
            <Layout>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/products" element={<Products />} />
                    {/*<Route path="/blogs" element={<Blogs />} />*/}
                    {/*<Route path="/testimonial" element={<Testimonial />} />*/}
                    <Route path="/about" element={  <About />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/user-detail" element={<UserDetail />} />
                    <Route path="/cart" element={<Cart />} />
                </Routes>
            </Layout>
        </Router>
    );
}

export default App;
