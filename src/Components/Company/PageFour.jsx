import React from 'react'
import images from './sponsorImages.json';

const PageFour = () => {
    return (
        <div className="PageFour">
            <div className="Pone">
                <h4>Our Partners</h4>
                <p>Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet.</p>
            </div>
            <div className="sponsor3">
                {images.map((sponsor) => (
                    <img key={sponsor.id} src={sponsor.image} alt={`sponsor-${sponsor.id}`} />
                ))}
            </div>
            <button>Let’s Partner</button>
        </div>
    )
}

export default PageFour 