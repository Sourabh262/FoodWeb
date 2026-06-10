import React, { useState } from "react";
import '../header/header.css';
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { ShoppingCart, User, Home, LogOut, Search, Receipt } from 'lucide-react';

const logo = '/images/food.png';

function Header(){
    const {cartTotalQUantity}=useSelector((state)=>state.cart)
    let history=useHistory()
    const [searchTerm, setSearchTerm] = useState('');

    function AddCart(){
        history.push('/cart')
    }
    function Profile(){
        history.push('/profile')
    }
    function gotoHome(){
        history.push('/home')
    }
    function Logout(){
        sessionStorage.clear();
        history.push('/login');
    }
    function viewBill(){
        history.push('/bill');
    }
    function handleSearch() {
        if (searchTerm.trim()) {
            history.push(`/alldish?search=${encodeURIComponent(searchTerm)}`);
        }
    }
    return(
        <div className="header">
            <div className="header-left">
                <img src={logo} className='logo' alt="Logo" onClick={gotoHome}></img>
            </div>

            <div className="header-center">
                <div className="search-container">
                    <input 
                        type='text' 
                        className="search-input" 
                        placeholder="Search for delicious food..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    />
                    <button className="search-btn" onClick={handleSearch}><Search size={18} /></button>
                </div>
            </div>

            <div className="header-right">
                <div className="cart-container" onClick={AddCart}>
                    <ShoppingCart color="white" size={24} />
                    {cartTotalQUantity > 0 && <span className="cart-badge">{cartTotalQUantity}</span>}
                </div>
                <button className="nav-btn" onClick={gotoHome} title="Home"><Home size={20}/></button>
                <button className="nav-btn" onClick={viewBill} title="My Bill"><Receipt size={20}/></button>
                <button className="nav-btn" onClick={Profile} title="Profile"><User size={20}/></button>  
                <button className="nav-btn logout" onClick={Logout} title="Logout"><LogOut size={20}/></button>  
            </div>
        </div>
    )
}

export default Header