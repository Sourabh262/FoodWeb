import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import Header from "../header/header";
import Footer from "../footer/footer";
import { clearCartItem } from "../cart/cartslice";
import toast from 'react-hot-toast';
import { User, Phone, Hash, ShoppingBag } from 'lucide-react';
import './checkout.css';

function Checkout() {
    const cart = useSelector((state) => state.cart);
    const dispatch = useDispatch();
    const history = useHistory();

    const [formData, setFormData] = useState({
        custName: "",
        custPhone: "",
        tableNumber: ""
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    // Redirect if cart is empty
    useEffect(() => {
        if (cart.cartItems.length === 0) {
            history.push('/cart');
        }
    }, [cart.cartItems, history]);

    if (cart.cartItems.length === 0) return null;

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        console.log(`Input Changed: ${name} = ${value}`); // Debugging
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handlePlaceOrder = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        const items = cart.cartItems.map(item => ({
            foodId: item._id,
            quantity: item.cartQuantity
        }));

        try {
            const response = await fetch('http://localhost:5000/order/orderFood', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    ...formData,
                    items
                })
            });
            const data = await response.json();
            
            if (data.success) {
                toast.success('Your order has been placed successfully!');
                sessionStorage.setItem('activeTable', formData.tableNumber); // Save table number
                dispatch(clearCartItem());
                history.push('/home');
            } else {
                toast.error(data.message || 'Failed to place order');
            }
        } catch (error) {
            console.error('Order error:', error);
            toast.error('Connection error. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="checkout-page">
            <Header />
            <div className="checkout-container">
                <div className="checkout-card">
                    <div className="checkout-header">
                        <ShoppingBag size={32} color="#ff4757" />
                        <h2>Complete Your Order</h2>
                        <p>Please provide your details to serve you better</p>
                    </div>

                    <form onSubmit={handlePlaceOrder} className="checkout-form">
                        <div className="input-group">
                            <label htmlFor="custName"><User size={18} /> Full Name</label>
                            <input 
                                id="custName"
                                type="text" 
                                name="custName" 
                                placeholder="Enter your name" 
                                value={formData.custName}
                                onChange={handleInputChange}
                                autoComplete="off"
                                required 
                            />
                        </div>

                        <div className="input-group">
                            <label htmlFor="custPhone"><Phone size={18} /> Phone Number</label>
                            <input 
                                id="custPhone"
                                type="tel" 
                                name="custPhone" 
                                placeholder="Enter your phone number" 
                                value={formData.custPhone}
                                onChange={handleInputChange}
                                autoComplete="off"
                                required 
                            />
                        </div>

                        <div className="input-group">
                            <label htmlFor="tableNumber"><Hash size={18} /> Table Number</label>
                            <input 
                                id="tableNumber"
                                type="text" 
                                name="tableNumber" 
                                placeholder="e.g. T1, T2..." 
                                value={formData.tableNumber}
                                onChange={handleInputChange}
                                autoComplete="off"
                                required 
                            />
                        </div>

                        <div className="order-summary-mini">
                            <div className="summary-row">
                                <span>Total Items:</span>
                                <span>{cart.cartTotalQUantity}</span>
                            </div>
                            <div className="summary-row total">
                                <span>Amount Payable:</span>
                                <span>₹{cart.totalAmount}</span>
                            </div>
                        </div>

                        <button type="submit" className="confirm-order-btn" disabled={isSubmitting}>
                            {isSubmitting ? "Placing Order..." : "Confirm & Place Order"}
                        </button>
                    </form>
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default Checkout;
