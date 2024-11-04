import { useEffect } from 'react';
import './App.css';
import Header from './component/layout/Header/Header'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import WebFont from 'webfontloader';
import Footer from './component/layout/Footer/Footer';
import Home from './component/Home/Home.js'


function App() {
  useEffect(() => {
    WebFont.load({
      google: { families: ['Roboto', 'Droid Sans', 'Chilanka', 'Lucida Sans'] }
    })
  }, [])

  return (
    <>

      <Router>
        <Header />
        <Routes>
          <Route path='/' element={<Home />}></Route>
        </Routes>
        <Footer />
      </Router>
    </>
  );
}

export default App;
