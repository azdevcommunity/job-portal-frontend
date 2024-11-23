import React from 'react';
import slidesData from './Home-Json/slider.json'; 

const Slider = () => {
  return (
    <div className='Home-end '>
 <div className="title">
 <h1>Here, There, Everywhere</h1>
      <p>Audio is global, so we are too. Wherever in the world
      you’re looking for a new role, chances are, we’re there.</p>
      <button>See All Location</button>
 </div>

      <div className="slides">
        {slidesData.map((slide) => (
          <div key={slide.order} className="slide">
            <img src={slide.image} alt={slide.location} />
            <span className='location'>{slide.location}</span>
            <span className='order'>{slide.order}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Slider;
