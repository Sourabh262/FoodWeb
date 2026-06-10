import React from "react";
import '../categories/categories.css';
import { useHistory } from "react-router-dom";

const indian = '/images/indianfood.jpg';
const italian = '/images/italianfood.jpg';
const korean = '/images/korean.png';

function Categories(){
    const history=useHistory()
    
    function Alldish(category){
        history.push(`/alldish?category=${category}`)
    }
    return (
        <div className="category-list">
           <h2>Explore Cuisines</h2>
           <div className="category-main">
                <div className="category-item">
                    <img src={indian} alt='Indian' onClick={()=>Alldish('IndianFood')} ></img>
                    <p>Indian Cuisine</p>
                </div> 
                <div className="category-item">
                    <img src={italian} alt='italian' onClick={()=>Alldish('ItalianFood') }  ></img>
                    <p>Italian Cuisine</p>
                </div> 
                <div className="category-item">
                    <img src={korean} alt='korean'  onClick={()=>Alldish('koreanfood') } ></img>
                    <p>Korean Cuisine</p>
                </div>
           </div>
        </div>
    )
}
export default Categories