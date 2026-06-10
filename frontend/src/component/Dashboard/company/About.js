import React from "react";
import Header from "../header/header";
import Footer from "../footer/footer";
import './company.css';
import { Utensils, Award, Users, Heart } from 'lucide-react';

function About() {
    return (
        <div className="company-page">
            <Header />
            <div className="company-hero about-hero">
                <h1>Our Culinary Journey</h1>
                <p>Bringing authentic flavors from across the globe to your table.</p>
            </div>

            <div className="company-container">
                <div className="about-grid">
                    <div className="about-text">
                        <h2>The Story Behind Our Kitchen</h2>
                        <p>Founded in 2023, our mission was simple: to create a dining experience that feels like home but tastes like a world-class adventure. We believe that food is not just about eating; it's about the memories we create and the cultures we share.</p>
                        <p>Every dish we serve is a testament to our commitment to quality, freshness, and the passion of our chefs who spend hours perfecting the balance of spices and textures.</p>
                    </div>
                    <div className="about-image">
                        <img src="https://images.unsplash.com/photo-1552566626-52f8b828add9?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" alt="Restaurant interior" />
                    </div>
                </div>

                <div className="stats-grid">
                    <div className="stat-card">
                        <Utensils size={40} />
                        <h3>100+</h3>
                        <p>Exotic Dishes</p>
                    </div>
                    <div className="stat-card">
                        <Users size={40} />
                        <h3>50k+</h3>
                        <p>Happy Customers</p>
                    </div>
                    <div className="stat-card">
                        <Award size={40} />
                        <h3>15+</h3>
                        <p>Culinary Awards</p>
                    </div>
                    <div className="stat-card">
                        <Heart size={40} />
                        <h3>100%</h3>
                        <p>Fresh Ingredients</p>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default About;
