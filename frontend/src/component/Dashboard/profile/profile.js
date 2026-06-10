import React, { useState, useEffect } from "react";
import Footer from "../footer/footer";
import Header from "../header/header";
import '../profile/profilr.css'
import toast from 'react-hot-toast';

const profileImg = '/images/profile.png';

function Profile(){
    let sessionData = JSON.parse(sessionStorage.getItem('user')) || {};
    
    const [userData, setUserData] = useState({ name: sessionData.name || '', email: sessionData.email || '', phone: '' });
    const [inputValue, setInput] = useState('');
    const [inputErr, setinputErr] = useState(false);
    const [list, listvalue] = useState([]);
    const [isEditingPhone, setIsEditingPhone] = useState(false);
    const [phoneInput, setPhoneInput] = useState('');

    useEffect(() => {
        if(sessionData.id) {
            fetchProfile();
        }
    }, []);

    const fetchProfile = async () => {
        try {
            const response = await fetch(`http://localhost:5000/user/profile/${sessionData.id}`);
            const data = await response.json();
            if(data.success) {
                setUserData({
                    name: data.user.username,
                    email: data.user.email,
                    phone: data.user.phone || ''
                });
                setPhoneInput(data.user.phone || '');
                listvalue(data.user.address || []);
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to fetch profile");
        }
    };

    function AddEvent(){
        if(inputValue.trim().length === 0){
            setinputErr(true);
        } else {
            setinputErr(false);
            let newList = [...list, inputValue];
            listvalue(newList);
            setInput('');
        }
    }

    async function Saveprofile(){
        try {
            const response = await fetch(`http://localhost:5000/user/profile/${sessionData.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ phone: phoneInput, address: list })
            });
            const data = await response.json();
            if(data.success) {
                setUserData(prev => ({ ...prev, phone: phoneInput }));
                setIsEditingPhone(false);
                toast.success('Profile saved successfully!');
            } else {
                toast.error(data.message || 'Failed to save profile');
            }
        } catch (error) {
            console.error(error);
            toast.error("Something went wrong");
        }
    }

    function remove(listname){
       let removeList = list.filter((ele) => (ele !== listname));
       listvalue(removeList);
    }

    return (
        <div className="progile-bg">
            <Header />
            <div className="profile-main">
                <img src={profileImg} alt="profile" className='imge' /> <br />
                <label> UserName </label>
                : <p> {userData.name}</p><br />
                
                <label> Email </label>
                : <p> {userData.email}</p><br />

                <label> Phone no </label>
                : {isEditingPhone ? (
                    <input 
                        type="text" 
                        value={phoneInput} 
                        onChange={(e) => setPhoneInput(e.target.value)} 
                        placeholder="Enter phone number"
                        style={{marginLeft: '10px'}}
                    />
                ) : (
                    <p style={{display: 'inline-block', marginLeft: '10px'}}>
                        {userData.phone || "No phone added"} 
                        <span style={{marginLeft: '10px', color: 'blue', cursor: 'pointer', fontSize: '12px'}} onClick={() => setIsEditingPhone(true)}>(Edit)</span>
                    </p>
                )}
                <br /><br />

                <label>Address </label>
                <div style={{marginLeft:'208px',marginTop:'-32PX'}}> 
                 <textarea rows="4" cols="55" value={inputValue} onChange={(e)=>setInput(e.target.value)} placeholder='Enter Your Address...'></textarea>
                 {inputErr && <small style={{display:"block", color: "red"}}>You must write something</small>}
                     <button className="btne" onClick={AddEvent}>Add Address</button>
                  
                     <ul className="profile-ul">
                         {list.map((ele, index) => {
                             return (
                                <li key={index} className="profile-li">{ele} 
                                 <button onClick={()=>remove(ele)}>x</button></li>
                             );
                         })}
                    </ul>
                    <button onClick={Saveprofile} className='savebutton'>Save</button>
                 </div>
                    
            </div>
            <Footer />
        </div>
    )
}

export default Profile;