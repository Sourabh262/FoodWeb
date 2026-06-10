import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import Header from "../header/header";
import Footer from "../footer/footer";
import toast from 'react-hot-toast';
import { Receipt, CreditCard, ChevronLeft, Package, Clock } from 'lucide-react';
import './bill.css';

function Bill() {
    const history = useHistory();
    const [billData, setBillData] = useState(null);
    const [loading, setLoading] = useState(true);
    const tableNumber = sessionStorage.getItem('activeTable');

    useEffect(() => {
        if (!tableNumber) {
            setLoading(false);
            return;
        }
        fetchBill();
    }, [tableNumber]);

    const fetchBill = async () => {
        try {
            const res = await fetch(`http://localhost:5000/order/bill/${tableNumber}`);
            const data = await res.json();
            if (data.success) {
                setBillData(data.order);
            } else {
                setBillData(null);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handlePayment = async () => {
        if (!billData) return;
        try {
            const res = await fetch(`http://localhost:5000/order/pay/${billData._id}`, {
                method: 'PUT'
            });
            const data = await res.json();
            if (data.success) {
                toast.success('Payment Successful! Thank you for dining with us.');
                sessionStorage.removeItem('activeTable'); // Clear table for next use
                history.push('/home');
            } else {
                toast.error(data.message);
            }
        } catch (err) {
            toast.error('Payment failed');
        }
    };

    if (loading) return <div className="loading-spinner">Loading Bill...</div>;

    return (
        <div className="bill-page">
            <Header />
            <div className="bill-container">
                <button className="back-btn" onClick={() => history.push('/home')}>
                    <ChevronLeft size={20} /> Back to Menu
                </button>

                {!tableNumber || !billData ? (
                    <div className="no-bill-card">
                        <Receipt size={64} color="#dfe6e9" />
                        <h2>No Active Bill</h2>
                        <p>You haven't ordered anything yet or your previous bill was settled.</p>
                        <button className="order-now-btn" onClick={() => history.push('/home')}>Order Now</button>
                    </div>
                ) : (
                    <div className="bill-card">
                        <div className="bill-header">
                            <div className="receipt-icon">
                                <Receipt size={32} color="#fff" />
                            </div>
                            <h2>Dining Receipt</h2>
                            <div className="table-tag">Table: {tableNumber}</div>
                        </div>

                        <div className="bill-meta">
                            <div className="meta-item">
                                <Clock size={16} />
                                <span>{new Date(billData.createdAt).toLocaleTimeString()}</span>
                            </div>
                            <div className="meta-item">
                                <Package size={16} />
                                <span>Order ID: {billData._id.slice(-6).toUpperCase()}</span>
                            </div>
                        </div>

                        <div className="bill-items-list">
                            <div className="list-header">
                                <span>Item</span>
                                <span>Qty</span>
                                <span>Price</span>
                            </div>
                            {billData.items.map((item, index) => (
                                <div key={index} className="bill-item-row">
                                    <div className="item-name-col">
                                        <p>{item.foodId?.name || 'Dish'}</p>
                                    </div>
                                    <div className="item-qty-col">x{item.quantity}</div>
                                    <div className="item-price-col">₹{item.price * item.quantity}</div>
                                </div>
                            ))}
                        </div>

                        <div className="bill-footer">
                            <div className="summary-row">
                                <span>Subtotal</span>
                                <span>₹{billData.totalPrice}</span>
                            </div>
                            <div className="summary-row">
                                <span>GST (5%)</span>
                                <span>₹{Math.round(billData.totalPrice * 0.05)}</span>
                            </div>
                            <div className="total-row">
                                <span>Grand Total</span>
                                <span>₹{Math.round(billData.totalPrice * 1.05)}</span>
                            </div>
                        </div>

                        <div className="payment-actions">
                            <button className="pay-btn" onClick={handlePayment}>
                                <CreditCard size={20} /> Complete Payment & Checkout
                            </button>
                            <p className="payment-note">Please pay at the counter or use digital payment</p>
                        </div>
                    </div>
                )}
            </div>
            <Footer />
        </div>
    );
}

export default Bill;
