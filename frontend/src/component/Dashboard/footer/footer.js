import React from "react";
import '../footer/footer.css';
import { useHistory, Link } from "react-router-dom";

const logo = '/images/food.png';
const insta = '/images/instagram.png';
const whatsapp = '/images/whatsapp.png';
const linkedin = '/images/likedin.png';
const pintrest = '/images/pintrest.png';
const youtube = '/images/youtube.png';

function Footer(){
    
    let history=useHistory();
      function Alldish(titleId){
        history.push(`/alldish?id=${titleId}`)
    }
    return(
        <div className="footer">
              <img src={logo} className='flogo'></img>
              <div className="footer-main">
                <div>
                    <h4>Company</h4>
                    <ul>
                        <li><Link to="/about" className="linkto">About us</Link></li>
                        <li><Link to="/team" className="linkto">Team</Link></li>
                        <li><Link to="/support" className="linkto">Help & Support</Link></li>
                    </ul>
                </div>
                <div>
                    <h4>Pages</h4>
                    <ul>
                        <li><Link to={'/home'} className='linkto'>Home</Link></li>
                        <li> <Link to={'/cart'} className='linkto'>Cart</Link></li>
                        <li><Link to={'/profile'} className='linkto'>Profile</Link></li>
                    </ul>
                </div>
                <div>
                    <h4>Categories</h4>
                    <ul>
                        <li onClick={()=>history.push('/alldish?category=IndianFood')} className="footer-li" >Indian</li>
                        <li onClick={()=>history.push('/alldish?category=ItalianFood')} className="footer-li">Italian</li>
                        <li onClick={()=>history.push('/alldish?category=koreanfood')} className="footer-li">Korean</li>
                    </ul>
                </div>
                <div>
                    <h4>Places</h4>
                    <ul>
                        <li className="footer-li" onClick={() => window.open('https://www.google.com/maps/search/restaurants+in+Indore', '_blank')}>Indore</li>
                        <li className="footer-li" onClick={() => window.open('https://www.google.com/maps/search/restaurants+in+Rau', '_blank')}>Rau</li>
                        <li className="footer-li" onClick={() => window.open('https://www.google.com/maps/search/restaurants+in+Pithampur', '_blank')}>Pithampur</li>
                    </ul>
                </div>
                <div>
                    <h4>Contact us</h4>
                    <a href="#"><img src={insta} className='footerimg' ></img></a>
                    <a href="#"><img src={whatsapp}  className='footerimg'></img></a>
                    <a href="#"><img src={pintrest} className='footerimg' ></img></a>
                    <a href="#"><img src={linkedin} className='footerimg' ></img></a>
                    <a href="#"><img src={youtube} className='footerimg' ></img></a>
                </div>
              
              </div>
              <p>Copyrights@2023</p>
        </div>
    )
}

export default Footer