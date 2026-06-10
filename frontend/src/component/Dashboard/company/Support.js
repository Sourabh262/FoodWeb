import React, { useState } from "react";
import Header from "../header/header";
import Footer from "../footer/footer";
import './company.css';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import toast from 'react-hot-toast';

function Support() {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        toast.success("Support request sent! We will contact you soon.");
        setEmail("");
        setMessage("");
    };

    return (
        <div className="company-page">
            <Header />
            <div className="company-hero support-hero">
                <h1>Help & Support</h1>
                <p>Have a question or a problem? We're here to help you 24/7.</p>
            </div>

            <div className="company-container">
                <div className="support-grid">
                    <div className="support-info">
                        <h2>Get in Touch</h2>
                        <p>Whether you have a query about your order, feedback on our food, or need help with the table system, our team is just a message away.</p>
                        
                        <div className="contact-methods">
                            <div className="contact-item">
                                <Mail className="contact-icon" />
                                <div>
                                    <h4>Email Us</h4>
                                    <p>support@foodapp.com</p>
                                </div>
                            </div>
                            <div className="contact-item">
                                <Phone className="contact-icon" />
                                <div>
                                    <h4>Call Us</h4>
                                    <p>+91 98765 43210</p>
                                </div>
                            </div>
                            <div className="contact-item">
                                <MapPin className="contact-icon" />
                                <div>
                                    <h4>Visit Us</h4>
                                    <p>123 Gourmet Street, Food City</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="support-form-card">
                        <h3>Send a Message</h3>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>Your Email</label>
                                <input 
                                    type="email" 
                                    required 
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Enter your email" 
                                />
                            </div>
                            <div className="form-group">
                                <label>Message</label>
                                <textarea 
                                    required 
                                    rows="5"
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    placeholder="How can we help you?"
                                ></textarea>
                            </div>
                            <button type="submit" className="support-submit">
                                <Send size={18} /> Send Message
                            </button>
                        </form>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default Support;
