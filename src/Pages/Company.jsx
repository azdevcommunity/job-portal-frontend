import React from 'react'
import PageOne from '../Components/Company/PageOne'
import { PageTwo } from '../Components/Company/PageTwo'
import PageThree from '../Components/Company/PageThree'
import FourPage from '../Components/Sturtups/FourPage'
import PageFour from '../Components/Company/PageFour'

const Company = () => {
  return (
    <div className="Company container">
        <PageOne />
        <PageTwo />
        <PageThree />
        <FourPage />
        <PageFour />
    </div>
  )
}

export default Company