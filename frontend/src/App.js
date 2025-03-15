import { useEffect } from 'react'
import './App.css'
import Header from './component/layout/Header/Header'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import WebFont from 'webfontloader'
import Footer from './component/layout/Footer/Footer'
import Home from './component/Home/Home.js'
import ProductDetails from './component/Product/ProductDetails.js'
import Products from './component/Products/Products.js'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

function App() {
    useEffect(() => {
        WebFont.load({
            google: {
                families: ['Roboto', 'Droid Sans', 'Chilanka', 'Lucida Sans'],
            },
        })
    }, [])

    return (
        <>
            <Router>
                <Header />
                <Routes>
                    <Route path="/" element={<Home />}></Route>
                    <Route
                        path="/product/:id"
                        element={<ProductDetails />}
                    ></Route>
                    <Route path="products" element={<Products />}></Route>
                    {/* <Route path="search" element={<Search />}></Route> */}
                </Routes>
                <Footer />
                <ToastContainer />
            </Router>
        </>
    )
}

export default App
