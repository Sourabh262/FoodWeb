import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { Smile, Frown, Zap, PartyPopper, Flame } from 'lucide-react';
import './moodRecommender.css';

const moods = [
    { id: 'happy', label: 'Happy', icon: <Smile size={24} />, color: '#ffbdc3', bg: '#fff5f6' },
    { id: 'tired', label: 'Tired', icon: <Frown size={24} />, color: '#a29bfe', bg: '#f4f3ff' },
    { id: 'energetic', label: 'Energetic', icon: <Zap size={24} />, color: '#ffeaa7', bg: '#fffdf2' },
    { id: 'celebration', label: 'Party', icon: <PartyPopper size={24} />, color: '#55efc4', bg: '#f0fffb' },
    { id: 'spicy', label: 'Adventurous', icon: <Flame size={24} />, color: '#ff7675', bg: '#fff2f2' },
];

function MoodRecommender() {
    const [selectedMood, setSelectedMood] = useState(null);
    const [allFoods, setAllFoods] = useState([]);
    const [recommendations, setRecommendations] = useState([]);
    const history = useHistory();

    useEffect(() => {
        fetch('http://localhost:5000/food/getFoods')
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    setAllFoods(data.Foods);
                }
            })
            .catch(err => console.error(err));
    }, []);

    const getRecommendations = (moodId) => {
        setSelectedMood(moodId);
        let filtered = [];
        
        switch (moodId) {
            case 'happy':
                filtered = allFoods.filter(f => f.name.toLowerCase().includes('dosa') || f.name.toLowerCase().includes('sweet') || f.category === 'ItalianFood');
                break;
            case 'tired':
                filtered = allFoods.filter(f => f.name.toLowerCase().includes('soup') || f.category === 'IndianFood');
                break;
            case 'energetic':
                filtered = allFoods.filter(f => f.category === 'ItalianFood' || f.name.toLowerCase().includes('pasta'));
                break;
            case 'celebration':
                filtered = allFoods.filter(f => f.price > 150 || f.name.toLowerCase().includes('biryani'));
                break;
            case 'spicy':
                filtered = allFoods.filter(f => f.category === 'korean' || f.ingredients?.some(i => i.toLowerCase().includes('chilli') || i.toLowerCase().includes('spice')));
                break;
            default:
                filtered = allFoods.slice(0, 4);
        }
        setRecommendations(filtered.slice(0, 4));
    };

    return (
        <div className="mood-section">
            <div className="mood-header">
                <h2>How are you feeling today?</h2>
                <p>Tell us your mood, and we'll suggest the perfect meal!</p>
            </div>

            <div className="mood-selector">
                {moods.map((mood) => (
                    <button 
                        key={mood.id} 
                        className={`mood-btn ${selectedMood === mood.id ? 'active' : ''}`}
                        onClick={() => getRecommendations(mood.id)}
                        style={{ '--mood-color': mood.color, '--mood-bg': mood.bg }}
                    >
                        <div className="mood-icon">{mood.icon}</div>
                        <span>{mood.label}</span>
                    </button>
                ))}
            </div>

            {selectedMood && (
                <div className="recommendations-area">
                    <div className="rec-grid">
                        {recommendations.length > 0 ? (
                            recommendations.map((food) => (
                                <div key={food._id} className="rec-card" onClick={() => history.push(`/singledish?id=${food._id}`)}>
                                    <img src={food.image} alt={food.name} />
                                    <div className="rec-info">
                                        <h4>{food.name}</h4>
                                        <p>₹{food.price}</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="no-rec">Looking for the perfect match...</p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default MoodRecommender;
