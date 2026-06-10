import React, { useState, useEffect } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Header from "../header/header";
import Footer from "../footer/footer";
import { addTocart, getTotals } from "../cart/cartslice";
import { ShoppingCart, Zap, ChevronLeft, Search } from 'lucide-react';
import '../home/categories/categories.css';
import './alldish.css';

function Alldish() {
    const dispatch = useDispatch();
    const history = useHistory();
    const location = useLocation();
    const [detail, setdetail] = useState([]);
    const [loading, setLoading] = useState(true);
    const query = new URLSearchParams(location.search);
    const categoryQuery = query.get('category');
    const searchQuery = query.get('search');
    
    const bannerTitle = categoryQuery ? categoryQuery.replace('Food', ' Cuisine') : 
                        searchQuery ? `Search Results` : "All Dishes";
    
    const bannerSubtitle = searchQuery ? 
        `Found these delicious items for your search: "${searchQuery}"` :
        `Discover the finest ${(categoryQuery || "All Dishes").toLowerCase()} delights prepared just for you.`;

    useEffect(() => {
        setLoading(true);
        fetch('http://localhost:5000/food/getFoods')
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    const categoryQ = query.get('category');
                    const searchQ = query.get('search');
                    let filteredData = data.Foods;
                    
                    if (categoryQ) {
                        const searchLower = categoryQ.toLowerCase();
                        filteredData = data.Foods.filter((ele) =>
                            ele.category && (
                                ele.category.toLowerCase().includes(searchLower) || 
                                searchLower.includes(ele.category.toLowerCase())
                            )
                        );
                    } else if (searchQ) {
                        const searchLower = searchQ.toLowerCase();
                        filteredData = data.Foods.filter((ele) =>
                            (ele.name && ele.name.toLowerCase().includes(searchLower)) ||
                            (ele.category && ele.category.toLowerCase().includes(searchLower)) ||
                            (ele.ingredients && ele.ingredients.some(ing => ing.toLowerCase().includes(searchLower)))
                        );
                    }
                    setdetail(filteredData);
                }
            })
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, [location.search]);

    const cart = useSelector((state) => state.cart);

    function detailed(id) {
        history.push(`/singledish?id=${id}`);
    }

    function AddtoCart(ele) {
        dispatch(addTocart(ele));
    }

    function order() {
        history.push('/cart');
    }

    return (
        <div className="alldish-page">
            <Header />
            
            <div className="alldish-banner">
                <div className="banner-content">
                    <button className="back-link" onClick={() => history.push('/home')}>
                        <ChevronLeft size={20} /> Back to Menu
                    </button>
                    <h1>{bannerTitle}</h1>
                    <p>{bannerSubtitle}</p>
                </div>
            </div>

            <div className="alldish-container">
                {loading ? (
                    <div className="loader">Loading delicious food...</div>
                ) : detail.length === 0 ? (
                    <div className="no-food">
                        <Search size={48} />
                        <p>No dishes found in this category.</p>
                    </div>
                ) : (
                    <div className="All-dish-grid">
                        {detail.map((ele) => (
                            <div key={ele._id} className='food-card-modern'>
                                <div className="card-img-wrapper" onClick={() => detailed(ele._id)}>
                                    <img src={ele.image} alt={ele.name} onError={(e) => e.target.src = '/images/food-placeholder.jpg'} />
                                    <div className="card-overlay">
                                        <span>View Details</span>
                                    </div>
                                </div>
                                <div className="card-info">
                                    <div className="card-header">
                                        <h3>{ele.name}</h3>
                                        <span className="portion">[1 Portion]</span>
                                    </div>
                                    <p className="ingredients">
                                        {ele.ingredients && ele.ingredients.length > 0 ? ele.ingredients.join(', ') : 'Freshly prepared'}
                                    </p>
                                    <div className="card-footer">
                                        <span className="price">₹{ele.price}</span>
                                        <div className="card-btns">
                                            <button className="cart-btn-icon" onClick={() => AddtoCart(ele)} title="Add to Cart">
                                                <ShoppingCart size={18} />
                                            </button>
                                            <button className="order-btn-sm" onClick={order}>
                                                Order Now
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            
            <Footer />
        </div>
    );
}

export default Alldish;