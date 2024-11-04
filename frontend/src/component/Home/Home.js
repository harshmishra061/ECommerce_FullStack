import React, { Fragment, useEffect } from 'react'
import { CgMouse } from 'react-icons/cg'
import './Home.css'
import Product from './Product'
import MetaData from '../layout/MetaData'
import { getProduct } from '../../actions/productAction'
import { useSelector, useDispatch } from 'react-redux'
import Loader from '../layout/Loader/Loader'

const Home = () => {
    const dispatch = useDispatch();
    const { products, loading, productsCount } = useSelector(state => state.products)
    useEffect(() => {
        dispatch(getProduct());
    }, [dispatch])
    if (loading) return <Loader />
    return (
        <Fragment>
            <MetaData title={'Shopper'} />
            <div className='banner'>
                <p>Welcome to Shopper</p>
                <h1>FIND AMAZING PRODUCTS BELOW</h1>
                <a href='#container'>
                    <button>
                        Scroll <CgMouse />
                    </button>
                </a>
            </div>
            <h2 className='homeHeading'>Featured Products</h2>
            <div className='container' id='container'>
                {products?.map(product => <Product product={product} />)}
            </div>
        </Fragment>
    )
}

export default Home