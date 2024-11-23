import React from 'react'
import Header from '../Components/Home/Header'
import Category from '../Components/Home/Category'
import Companies from '../Components/Home/Companies'
import Slider from '../Components/Home/Slider'

const Home = () => {
  return (
    <div>
       <Header />
      <Category />
      <Companies /> 
      <Slider />
    </div>
  )
}

export default Home