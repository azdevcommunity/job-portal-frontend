import React from 'react'
import { useNavigate } from 'react-router-dom';
const ThreePage = () => {
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      };
    const navigate = useNavigate();
    const handleSeeAllClick = () => {
        navigate('/browsestartups'); 
        scrollToTop()
      };
  return (
    <div className="Three">
        <h2>What You Get</h2>
        <img src="/Vector 1.png" alt="" />
        <div className="centers">
            <div className="center1">
                <img src="/user.png" alt="" />
                <span>Maximise exposure</span>
                <p>Be visible to high-potential startups looking for funding in your region, exclusively. Let the Unicorns, the Zebras and the species of tomorrow come to you</p>
            </div>
            <div className="center2">
                <img src="/bell.png" alt="" />
                <span>Free referrals</span>
                <p>Let your portfolio startups walk the talk for you by adding you as their trusted investor</p>
            </div>
            <div className="center3">
                <img src="/airplay1.png" alt="" />
                <span>Free matchmaking</span>
                <p>Startups get matched with you based on stage, industry, location, business model and ticket size</p>
            </div>
            <div className="center4">
                <img src="/bell.png" alt="" />
                <span>Startup browsing</span>
                <p>The Hub is where startups grow! Take a look yourself and bookmark your favorites for future reference</p>
            </div>
        </div>
        <button onClick={handleSeeAllClick}>Browse Startups</button>
    </div>
  )
}

export default ThreePage