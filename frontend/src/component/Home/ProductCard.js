import React from 'react'
import { Link } from 'react-router-dom'
import ReactStars from 'react-rating-stars-component'

const ProductCard = ({ product }) => {
    const options = {
        edit: false,
        color: 'rgba(20, 20, 20, 0.1)',
        activeColor: 'tomato',
        value: product.ratings,
        isHalf: true,
        size: window.innerWidth < 600 ? 10 : 15,
    }
    return (
        <Link className="productCard" to={`product/${product._id}`}>
            <img src={product.images[0].url} alt={product.name}></img>
            <p>{product.name}</p>
            <div>
                <ReactStars {...options} />{' '}
                <span>{`( ${product.numberOfReviews} Reviews)`}</span>
            </div>
            <span>{`₹${product.price}`}</span>
        </Link>
    )
}

export default ProductCard
