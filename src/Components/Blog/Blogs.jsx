import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const Blogs = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [blogs, setBlogs] = useState([]); // State to hold blogs fetched from API
  const [filteredBlogs, setFilteredBlogs] = useState([]); // State for filtered blogs
  const navigate = useNavigate();

  const truncateTitle = (title) => {
    return title.length > 40 ? title.substring(0, 40) + '...' : title;
  };

  // Fetch blogs from the API
  useEffect(() => {
    async function fetchBlogs() {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/blogs');
        if (!response.ok) {
          throw new Error('Failed to fetch blogs');
        }
        const data = await response.json();
        setBlogs(data);
        setFilteredBlogs(data); // Initially show all blogs
      } catch (error) {
        console.error('Error fetching blogs:', error);
      }
    }

    fetchBlogs();
  }, []);

  // Filter blogs based on the selected category
  useEffect(() => {
    if (selectedCategory === 'All') {
      setFilteredBlogs(blogs);
    } else {
      setFilteredBlogs(
          blogs.filter(blog => blog.categories_name === selectedCategory)
      );
    }
  }, [selectedCategory, blogs]);

  const handleBlogClick = (id) => {
    navigate(`/blog/${id}`);
  };

  return (
      <div className="Blogs container">
        <h4>Latest Articles</h4>
        <div className="filters">
          <span onClick={() => setSelectedCategory('All')}>All</span>
          {/* Dynamically generate categories based on blogs */}
          {Array.from(new Set(blogs.map(blog => blog.categories_name))).map(category => (
              <span key={category} onClick={() => setSelectedCategory(category)}>
            {category}
          </span>
          ))}
        </div>
        <div className="center">
          {filteredBlogs.map(blog => (
              <div key={blog.id} className="blog" onClick={() => handleBlogClick(blog.id)}>
                <img src={blog.imageUrl} alt={blog.title} />
                <span>{blog.categories_name}</span>
                <h4>{truncateTitle(blog.title)}</h4>
                <div className="data">
                  <img src="/default-author.png" alt="Author" />
                  <span>Admin</span>
                  <span>on {new Date(blog.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
          ))}
        </div>
      </div>
  );
};