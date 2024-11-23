import React from 'react'

const Contact = () => {
  return (
   <div className="contact container">
    <div className="top">
        <div className="left">
            <h1>Got an idea?</h1>
            <h1>Let’s talk.</h1>
            <p>Leave us a note here, or give us a call at   <span>(312) 448-7405.</span></p>
        </div>
        <div className="right">
            <img src="/public/Vector 22.png" alt="" />
            <img src="/public/Burst-pucker-2.png" alt="" />
        </div>
    </div>
    <div className="bottom">
        <div className="bottom-top">
            <div className="left">
                <label htmlFor="name">First Name</label>
                <input type="text" name="" id="name"  placeholder='First Name'/>
            </div>
            <div className="right">
                <label htmlFor="lastname">Last Name</label>
                <input type="text" name="" id="lastname"  placeholder='Last Name'/>
            </div>
        </div>
        <div className="two">
            <label htmlFor="email">Email</label>
            <input type="text" name="" id="email"  placeholder='Your Email'/>
        </div>
        <div className="two">
            <label htmlFor="idea">Tell us about your idea</label>
            <textarea name="" id="idea">Note...</textarea>
        </div>
        <div className="button">
            <button>Send</button>
        </div>
    </div>

   </div>
  )
}

export default Contact