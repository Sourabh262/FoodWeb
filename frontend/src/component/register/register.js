import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import "../register/register.css"
import toast from 'react-hot-toast';

function Register(){
    const [username,setUsername]=useState('')
    const [email,setEmail]=useState('')
    const [password,setpassword]=useState('')
    const [nameErr,setnameErr]=useState(false)
    const history=useHistory()
    async function registerUser(){
        if((username.trim().length===0)||(password.trim().length===0)||(email.trim().length===0)){
                setnameErr(true)
        }
        else if(!email.includes('@') || !email.includes('.')){
            toast.error('Please enter a valid email address');
        }
        else if(password.length<5){
            toast.error('Please enter a password with more than five characters');
        }
        else{
            setnameErr(false)
            try {
                const response = await fetch('http://localhost:5000/user/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, email, password })
                });
                const data = await response.json();
                if (response.ok) {
                    toast.success('Registration successful! Please login.');
                    history.push('/login');
                } else {
                    toast.error(data.message || 'Registration failed');
                }
            } catch (err) {
                console.error(err);
                toast.error('Error registering user');
            }
        }
    }
    return(
        <div className="register-body">
        <div className="register-main">
            <h1>Create Account</h1>
            {nameErr&& <p className="errP">*Please fill all fields*</p>}
            <br />
            <p>Username</p>
            <input type='text' value={username} onChange={(e)=>{setUsername(e.target.value)}} placeholder="Enter your name"></input>
            <br />
            <p>Email Address</p>
            <input type='text'value={email} onChange={(e)=>{setEmail(e.target.value)}} placeholder="Enter your email"></input>
            <br />
            <p>Password</p>
            <input type='password'value={password} onChange={(e)=>{setpassword(e.target.value)}} placeholder="Create a password"></input>
            <br /><br />
            <button onClick={registerUser}>Sign Up</button>
            <p className="toggle-text">Already have an account? <Link to='/login'>Login here</Link></p>
        </div>
        </div>
    )
}
export default Register