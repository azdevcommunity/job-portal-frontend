import React, { useState } from 'react';

const FivePage = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const handleToggle = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const faqs = [
    {
      question: 'How come all of this is for free?',
      answer: 'At any point of time you are able to browse through 8,000+ Nordic scaling startups at thehub.io/startups. Based on country, industry, stage, size and funding status you can find the ones you find interesting. You can take a closer look at the startup profiles, find information like what they do, who they are, the team, key figures or if they have open positions. And you can bookmark your favourites for future reference.',
    },
    {
      question: 'Is the Hub open to all?',
      answer: 'At any point of time you are able to browse through 8,000+ Nordic scaling startups at thehub.io/startups. Based on country, industry, stage, size and funding status you can find the ones you find interesting. You can take a closer look at the startup profiles, find information like what they do, who they are, the team, key figures or if they have open positions. And you can bookmark your favourites for future reference.',
    },
    {
      question: 'What are startups looking for?',
      answer: 'At any point of time you are able to browse through 8,000+ Nordic scaling startups at thehub.io/startups. Based on country, industry, stage, size and funding status you can find the ones you find interesting. You can take a closer look at the startup profiles, find information like what they do, who they are, the team, key figures or if they have open positions. And you can bookmark your favourites for future reference.',
    },
    {
      question: 'How does the matchmaking with startups work?',
      answer: 'At any point of time you are able to browse through 8,000+ Nordic scaling startups at thehub.io/startups. Based on country, industry, stage, size and funding status you can find the ones you find interesting. You can take a closer look at the startup profiles, find information like what they do, who they are, the team, key figures or if they have open positions. And you can bookmark your favourites for future reference.',
    },
    {
      question: 'How can startups contact me?',
      answer: 'At any point of time you are able to browse through 8,000+ Nordic scaling startups at thehub.io/startups. Based on country, industry, stage, size and funding status you can find the ones you find interesting. You can take a closer look at the startup profiles, find information like what they do, who they are, the team, key figures or if they have open positions. And you can bookmark your favourites for future reference.',
    },
    {
      question: 'How can I scout startups?',
      answer: 'At any point of time you are able to browse through 8,000+ Nordic scaling startups at thehub.io/startups. Based on country, industry, stage, size and funding status you can find the ones you find interesting. You can take a closer look at the startup profiles, find information like what they do, who they are, the team, key figures or if they have open positions. And you can bookmark your favourites for future reference.',
    },
  ];

  return (
    <div className="Five">
      <h2>FAQs</h2>
      <div className="centers">
        {faqs.map((faq, index) => (
          <div key={index} className="q1">
            <div className="top" onClick={() => handleToggle(index)}>
              <h2>{faq.question}</h2>
              <img src="/arrow-chevron-down.png" alt="Toggle" className={activeIndex === index ? 'rotate' : ''}
              />
            </div>
            <p className={activeIndex === index ? 'visible' : 'hidden'}>{faq.answer}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FivePage;
