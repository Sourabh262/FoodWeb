import React, { useState, useEffect } from "react";
import '../categories.css';
import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addTocart } from "../../../cart/cartslice";
import '../../../header/header.css';
import { ShoppingCart, Zap, ChevronLeft, ChevronRight } from 'lucide-react';
function Indianfood(){
    const dispatch=useDispatch()
    const [Food1, setFood1] = useState([]);
    useEffect(() => {
        fetch('http://localhost:5000/food/getFoods')
            .then(res => res.json())
            .then(data => {
                if(data.success) {
                    setFood1(data.Foods.filter((ele)=>ele.category && ele.category.toLowerCase() === 'indianfood'));
                }
            })
            .catch(err => console.error(err));
    }, []);
    let history=useHistory();
    
    function AddtoCart(ele){
        dispatch(addTocart(ele))
    }
    function prevImage(){
        let box=document.querySelector('.card-image')
        let width = box.clientWidth;
        box.scrollLeft = box.scrollLeft - width;
    }
    function nextImage(){
        let box=document.querySelector('.card-image')
        let width=box.clientWidth;
        box.scrollLeft=box.scrollLeft+width;
    }
    function detail(id){
        history.push(`/singledish?id=${id}`)
    }
    function Alldish(category){
        history.push(`/alldish?category=${category}`)
    }
    function order(){
        history.push('/cart')
    }
    return(
        <div className="indi-css">
             {/* <h2>Categories</h2> */}
             <h3 >Indian Food</h3>
            
        <div className="main-image">
        <button className="leftImageArrowStyles" onClick={()=>prevImage()}> <ChevronLeft size={24} /></button>
            <button className="rightImageArrowStyles" onClick={()=>nextImage()}> <ChevronRight size={24} /></button>
        <div className="card-image" >
            {  
                Food1.map((ele)=>{
                    return <div key={ele._id} className='Perslide' onClick={()=>detail(ele._id)}>
                    <img src={ele.image} alt={ele.name} onError={(e) => e.target.src = '/images/food-placeholder.jpg'} />
                    <div style={{marginTop: '15px'}}>
                        <p style={{fontWeight: '600', fontSize: '1.1rem', marginBottom: '5px'}}>{ele.name}</p>
                        {ele.ingredients && ele.ingredients.length > 0 && <small style={{display:'block', color:'#777', fontSize:'0.8rem', marginBottom: '8px', height: '2.4em', overflow: 'hidden'}}>{ele.ingredients.join(', ')}</small>}
                        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px'}}>
                            <span style={{fontWeight: '700', fontSize: '1.2rem', color: '#2d3436'}}>₹{ele.price}</span>
                            <div style={{display: 'flex', gap: '5px'}}>
                                <button className="slide-cart-button" onClick={(e)=>{e.stopPropagation(); AddtoCart(ele)}} title="Add to Cart"><ShoppingCart size={16}/></button>
                                <button className="slide-cart-button" style={{background: 'linear-gradient(135deg, #ff7675, #d63031)'}} onClick={(e)=>{e.stopPropagation(); order()}} title="Order Now"><Zap size={16}/></button>
                            </div>
                        </div>
                    </div>
                </div>
                })
            }
            <button onClick={()=>Food1.length > 0 && Alldish(Food1[0].category) } className='imsa' >See more</button>
        </div>
        
        </div>
        
        </div>
    )
}

export default Indianfood