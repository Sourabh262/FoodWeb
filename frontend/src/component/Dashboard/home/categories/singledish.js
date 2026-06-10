import React, { useState, useEffect } from "react";
import { useLocation, useHistory } from "react-router-dom";
import Header from "../../header/header";
import Footer from "../../footer/footer";
import { useDispatch, useSelector } from "react-redux";
import { addTocart, getTotals } from "../../cart/cartslice";
import { ShoppingCart, Zap, Clock, Info, ChevronLeft, AlertCircle } from 'lucide-react';
import '../categories/categories.css';

function Singledish() {
    const dispatch = useDispatch();
    const location = useLocation();
    const history = useHistory();
    const [detail, setdetail] = useState({});
    
    let query = new URLSearchParams(location.search);
    
    useEffect(() => {
        fetch(`http://localhost:5000/food/${query.get('id')}/food`)
            .then(res => res.json())
            .then(data => {
                if (data.status) {
                    setdetail(data.food);
                }
            })
            .catch(err => console.error(err));
    }, [location.search]);

    const cart = useSelector((state) => state.cart);
    
    function AddtoCart(detail) {
        dispatch(addTocart(detail));
    }

    function order() {
        history.push('/cart');
    }

    const getAllergens = (ingredients = []) => {
        const allergens = {
            'Gluten/Wheat': ['wheat', 'flour', 'maida', 'pasta', 'bread', 'roti', 'noodles'],
            'Dairy': ['milk', 'cheese', 'paneer', 'butter', 'cream', 'curd', 'yogurt'],
            'Nuts/Peanuts': ['peanut', 'cashew', 'almond', 'nut', 'walnut'],
            'Soy': ['soy', 'tofu', 'soya'],
            'Egg': ['egg'],
            'Spicy': ['chilli', 'spice', 'pepper', 'hot']
        };

        let detected = [];
        ingredients.forEach(ing => {
            const lowerIng = ing.toLowerCase();
            for (const [allergen, keywords] of Object.entries(allergens)) {
                if (keywords.some(k => lowerIng.includes(k))) {
                    if (!detected.includes(allergen)) detected.push(allergen);
                }
            }
        });
        return detected;
    };

    const detectedAllergens = getAllergens(detail.ingredients);

    return (
        <div className="sfp-wrapper">
            <Header />
            
            <div className="sfp-container">
                <button className="back-btn" onClick={() => history.goBack()}>
                    <ChevronLeft size={20} /> Back
                </button>

                <div className="sfp-content">
                    <div className="sfp-image-section">
                        <div className="sfp-image-card">
                            <img src={detail.image} alt={detail.name} />
                        </div>
                    </div>

                    <div className="sfp-details-section">
                        <div className="sfp-header">
                            <span className="category-badge">{detail.category}</span>
                            <h1>{detail.name}</h1>
                            <div className="portion-tag">[1 Portion]</div>
                        </div>

                        <div className="sfp-price-row">
                            <span className="currency">₹</span>
                            <span className="price-value">{detail.price}</span>
                        </div>

                        {detectedAllergens.length > 0 && (
                            <div className="allergy-warning">
                                <div className="warning-title">
                                    <AlertCircle size={18} />
                                    <span>Allergy Advisory</span>
                                </div>
                                <p>This dish contains: <strong>{detectedAllergens.join(', ')}</strong></p>
                            </div>
                        )}

                        <div className="sfp-info-card">
                            <div className="info-item">
                                <Info size={20} className="info-icon" />
                                <div>
                                    <strong>Ingredients</strong>
                                    <p>{detail.ingredients ? detail.ingredients.join(', ') : 'Fresh ingredients only'}</p>
                                </div>
                            </div>

                            <div className="info-item">
                                <Clock size={20} className="info-icon" />
                                <div>
                                    <strong>Available Time</strong>
                                    <p>9:00 AM - 9:00 PM</p>
                                </div>
                            </div>
                        </div>

                        <div className="sfp-actions">
                            <button className="sfp-add-btn" onClick={() => AddtoCart(detail)}>
                                <ShoppingCart size={20} /> Add to Cart
                            </button>
                            <button className="sfp-order-btn" onClick={order}>
                                <Zap size={20} /> Order Now
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}

export default Singledish;