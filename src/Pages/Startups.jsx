import React from 'react'
import { OnePage } from '../Components/Sturtups/OnePage'
import { TwoPage } from '../Components/Sturtups/TwoPage'
import ThreePage from '../Components/Sturtups/ThreePage'
import FourPage from '../Components/Sturtups/FourPage'
import FivePage from '../Components/Sturtups/FivePage'

const Startups = () => {
  return (
  <div className="startups">
    <OnePage />
    <TwoPage />
    <ThreePage />
    <FourPage/>
    <FivePage />
  </div>
  )
}

export default Startups