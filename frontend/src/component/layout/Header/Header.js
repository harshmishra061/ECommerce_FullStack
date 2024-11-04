import React from 'react'
import { ReactNavbar } from 'overlay-navbar'
const Header = () => {
    return (
        <ReactNavbar
            link1Text='Home'
            link2Text='Product'
            link3Text='Contact'
            link4Text='About'
            link1Url='/'
            link2Url='/product'
            link3Url='/contact'
            link4Url='/about'
            navColor1='white'
        />
    )
}

export default Header