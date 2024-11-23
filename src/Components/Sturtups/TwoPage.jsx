import React from 'react'
import images from './sponsorImages.json';

export const TwoPage = () => {
    return (
        <div className="Two">
            <div className="sponsor2">
                {images.map((sponsor) => (
                    <img key={sponsor.id} src={sponsor.image} alt={`sponsor-${sponsor.id}`} />
                ))}
            </div>
            <div className="center">
                <h4>Getting started is
                    as easy as 1, 2, 3...</h4>
                <div className="numbers">
                    <div className="number">
                        <div className="top">
                            <span>01</span>
                            <img src="/Rating.png" alt="" />
                        </div>
                        <span>Create startup profile</span>
                        <p>In less than 7 minutes, you’ll get a sleek profile helping you attract talent and potential investors.</p>
                    </div>
                    <div className="number">
                        <div className="top">
                            <span>02</span>
                            <img src="/Button.png" alt="" />
                        </div>
                        <span>Post jobs for free</span>
                        <p>Reach entrepreneurial and tech talent, exclusively! 170,000+ candidates and thousands more every week.</p>
                    </div>
                    <div className="number">
                        <div className="top">
                            <span>03</span>
                            <img src="/Rating1.png" alt="" />
                        </div>
                        <span>Hire the perfect match</span>
                        <p>Let our free applicant management system help you catch the Ninja in
                        the dark.</p>
                    </div>


                </div>
            </div>
        </div>
    )
}
