import { OnePage } from "../Components/Investor/OnePage"
import FivePage from "../Components/Sturtups/FivePage"
import FourPage from "../Components/Sturtups/FourPage"
import ThreePage from "../Components/Sturtups/ThreePage"
import { TwoPage } from "../Components/Sturtups/TwoPage"

const Investor = () => {
  return (
    <div className="investor">
      <OnePage/>
      <TwoPage />
      <ThreePage />
      <FourPage/>
      <FivePage/>
    </div>
  )
}

export default Investor