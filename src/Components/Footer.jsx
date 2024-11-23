import React from 'react'
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const navigate = useNavigate();
  const handleSeeAllClick = () => {
    navigate('/seekfunding'); 
    scrollToTop();
  };


  return (
    <div className='footer'>
        <img src="/Vector 2.png" alt=""  className='absolute1'/>
        <img src="/Vector 3.png" alt="" className='absolute2'/>
        <img src="/Burst-pucker-2.png" alt="" className='absolute3' />
        <img src="/Burst-pucker-2.png" alt="" className='absolute4' />
        <h1>Explore a
        Job Now! <img src="/Burst-pucker-2.png" /> </h1>
        <p>Hoob is the platform, startups can get assistance with their recruitment<br></br>
        of talent as well as connection with investors.</p>
        <button onClick={handleSeeAllClick}>Explore Jobs</button>

        <div className="footer-boottom">
            <div className="footer-bottom-left">
                <span>© 2022 Hoob. All rights reserved  </span>
                <div className="link">
                <Link to="/"  onClick={scrollToTop}>Home</Link>
                <Link to="/privacy">Privacy</Link>
                <Link to="/terms">Terms</Link>
                <Link to="/tools">Tools</Link>
                <Link to="/blog"  onClick={scrollToTop}>Blog</Link>
                <Link to="/partners">Partners</Link>
                <Link to="/contact"  onClick={scrollToTop}>Contact</Link>
                    
                </div>
            </div>
            <div className="footer-bottom-right">
                <Link to='/privacy-policy'>Privacy Policy</Link>
                <Link to='/condition'>Terms & Condition</Link>
            </div>
        </div>
    </div>
  )
}

export default Footer