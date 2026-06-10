import React from "react";
import Header from "../header/header";
import Footer from "../footer/footer";
import './company.css';
import { Globe, MessageSquare, Users } from 'lucide-react';

const teamMembers = [
    {
        name: "Chef Marco Rossi",
        role: "Executive Head Chef",
        image: "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
        bio: "With 20 years of experience in Michelin-star restaurants, Marco brings the soul of Italy to our menu."
    },
    {
        name: "Chef Ananya Sharma",
        role: "Indian Cuisine Specialist",
        image: "https://images.unsplash.com/photo-1583394838336-acd977736f90?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
        bio: "Ananya is a master of spices, ensuring every Indian dish tells a story of tradition."
    },
    {
        name: "Chef Ji-Hun Kim",
        role: "Korean Culinary Lead",
        image: "https://images.unsplash.com/photo-1595273670150-bd0c3c392e46?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
        bio: "Ji-Hun specializes in modern fermentation techniques and authentic Korean street food."
    }
];

function Team() {
    return (
        <div className="company-page">
            <Header />
            <div className="company-hero team-hero">
                <h1>Meet Our Experts</h1>
                <p>The passionate individuals behind every delicious bite.</p>
            </div>

            <div className="company-container">
                <div className="team-grid">
                    {teamMembers.map((member, index) => (
                        <div key={index} className="team-card">
                            <div className="team-image">
                                <img src={member.image} alt={member.name} />
                            </div>
                            <div className="team-info">
                                <h3>{member.name}</h3>
                                <span className="team-role">{member.role}</span>
                                <p>{member.bio}</p>
                                <div className="team-social">
                                    <Globe size={18} />
                                    <MessageSquare size={18} />
                                    <Users size={18} />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default Team;
