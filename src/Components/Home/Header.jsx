import React, { useState, useEffect } from 'react';
import sponsorImages from './Home-Json/sponsorImages.json';

const Header = () => {
  const [images, setImages] = useState([]);
  useEffect(() => { setImages(sponsorImages); }, []);

  return (
    <div className='header'>
      <div className="header-left container" >
        <span>2886 open positions</span>
        <h1>
          Find your next{' '}
          <img src="/Burst-pucker-2.png" alt="" />
          exciting startup job
        </h1>
        <p>
          Lorem ipsum dolor sit amet consectetur. Orci augue eu a et tincidunt.
          Fringilla tincidunt tempor euismod porttitor quis id ame.
        </p>
        <div className="search">
          <img src="/search.png" alt="" />
          <input type="text" name="search" id="search" placeholder="Company, Job Title..." />
          <img src="/map-pin-3.png" alt="" />
          <input type="text" name="map" id="map" placeholder="City, State, or Country"
          />
          <button>Search</button>
        </div>
        <div className="sponsor">
          {images.map((sponsor) => (
            <img key={sponsor.id} src={sponsor.image} alt={`sponsor-${sponsor.id}`} />
          ))}
        </div>
      </div>
      <div className="header-right">
        <img src="/image 104.png" alt="" />
      </div>
    </div>
  );
};

export default Header;
