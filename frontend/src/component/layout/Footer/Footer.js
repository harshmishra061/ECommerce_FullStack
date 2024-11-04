import React from 'react'
import playstore from '../../../images/playstore.png'
import appstore from '../../../images/Appstore.png'
import './Footer.css'
const Footer = () => {
    return (
        <footer id='footer'>
            <div className='leftFooter'>
                <h4>DOWNLOAD OUR APP</h4>
                <p>Download App for Android and IOS mobile phone</p>
                <img src={playstore} alt='playstore' />
                <img src={appstore} alt='playstore' />
            </div>
            <div className='midFooter'>
                <h1>SHOPPER</h1>
                <p>High Quality is our first priority</p>
                <p>Copyright 2024 &copy; Harsh Mishra</p>
            </div>
            <div className='rightFooter'>
                <h4>Follow Us</h4>
                <a href='https://www.instagram.com/harshmishra061'>Instagram</a>
                <a href='https://www.youtube.com/harshmishra061'>Youtube</a>
                <a href='https://www.fb.com'>Facebook</a>
            </div>
        </footer>
    )
}

export default Footer