import React, { useState } from "react";
import '../register/register.css'
import { Link, useHistory } from "react-router-dom";
function Login(){
    const [loginName,setLoginName]=useState('')
    const [loginPassword,setLoginPassword]=useState('')
    const [loginNameErr,setLoginNameErr]=useState(false)
    const [loginPasswordErr,setPasswordErr]=useState(false)
    const [incorrectErr,setincorrectErr]=useState(false)
   //  function showpassword(e){
   //    if(e.type === "password"){
   //       e.type='text'
   //    }
   //    else{
   //       e.type ="password"
   //    }
   //  }
      const history=useHistory()
    async function Loginvalidation() { 
         
             if(loginName.trim().length!==0){
                setLoginNameErr(false)
                }
                 else{ 
                setLoginNameErr(true)
                 }
                 if(loginPassword.trim().length!==0){
                    setPasswordErr(false)
                    }
                     else{ 
                        setPasswordErr(true)
                     }

        try {
            const response = await fetch('http://localhost:5000/user/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: loginName, password: loginPassword })
            });
            const data = await response.json();
            if (response.ok) {
                sessionStorage.setItem('user', JSON.stringify({ id: data.user.id, name: data.user.username, email: data.user.email, role: data.user.role }));
                sessionStorage.setItem('token', data.token);
                setincorrectErr(false);
                
                if (data.user.role && data.user.role.toLowerCase() === 'admin') {
                    history.push('/admin-dashboard');
                } else {
                    history.push('/home');
                }
            } else {
                setincorrectErr(true);
            }
        } catch (err) {
            console.error(err);
            setincorrectErr(true);
        }
}
    return(
        <div className="login-body">
        <div className="login-main">
            <h1>Welcome Back</h1>   
            {incorrectErr&& <div className="errP">Invalid email or password. Please try again.</div>}   
            
             <p>Email Address</p>
            <input type='text' value={loginName} onChange={(e)=>{setLoginName(e.target.value)}} placeholder="Enter your email"></input>
             {loginNameErr&& <small style={{color:'#ff7675', display:'block', marginTop:'-15px', marginBottom:'10px', fontSize:'12px'}}>Please enter your email</small>}

            <p>Password</p>
            <input type='password' value={loginPassword} onChange={(e)=>{setLoginPassword(e.target.value)}} placeholder="Enter your password"></input>
             {loginPasswordErr&& <small style={{color:'#ff7675', display:'block', marginTop:'-15px', marginBottom:'10px', fontSize:'12px'}}>Please enter your password</small>}

            <button onClick={Loginvalidation}>Login</button>
            <p className="toggle-text">Don't have an account? <Link to='/'>Sign up here</Link></p>
        </div>
        </div>
    )
}
export default Login