import React from 'react';
import { useNavigate } from 'react-router-dom';

const Category = () => {
  const navigate = useNavigate();
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const categories = [
    { id: 1, image: '/i1.png', title: 'Business Development' },
    { id: 2, image: '/i2.png', title: 'Customer Service' },
    { id: 3, image: '/i3.png', title: 'Design' },
    { id: 4, image: '/i4.png', title: 'Operations' },
    { id: 5, image: '/i5.png', title: 'Development' },
    { id: 6, image: '/i6.png', title: 'Mobile Development' }
  ];

  const handleSeeAllClick = () => {
    navigate('/seekfunding'); 
    scrollToTop()
  };

  return (
    <div className='category container'>
      <div className="category-left">
        <h1>Explore by Category</h1>
        <p>Nisl urna scelerisque id vel vitae at a mi nibh platea in.</p>
        <div className="see" onClick={handleSeeAllClick}>
          <span>See All Category</span>
          <img src="/arrow-right.png" alt="Arrow right" />
        </div>
      </div>
      <div className="category-right">
        {categories.map((category) => (
          <div key={category.id} className="one">
            <img src={category.image} alt={category.title} />
            <span>{category.title}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Category;
