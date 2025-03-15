import React, { Fragment, useEffect } from 'react'
import './ProductDetails.css'
import { useSelector, useDispatch } from 'react-redux'
import { clearErrors, getProductDetails } from '../../actions/productAction'
import { useParams } from 'react-router-dom'
import ReactStars from 'react-rating-stars-component'
import Loader from '../layout/Loader/Loader'
import ReviewCard from './ReviewCard.js'
import showToast from '../../utils/toastUtils'
const ProductDetails = () => {
    const dispatch = useDispatch()
    const { id } = useParams()
    const { product, loading, error } = useSelector(
        (state) => state.productDetails
    )
    const options = {
        edit: false,
        color: 'rgba(20, 20, 20, 0.1)',
        activeColor: 'tomato',
        value: product.ratings,
        isHalf: true,
        size: window.innerWidth < 600 ? 10 : 15,
    }
    useEffect(() => {
        if (error) {
            showToast(error, 'error')
            dispatch(clearErrors())
        }
        dispatch(getProductDetails(id))
    }, [dispatch, id, error])

    useEffect(() => {
        console.log(product)
        const swiper = new window.Swiper('.swiper-container', {
            slidesPerView: 1,
            direction: 'horizontal',
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            },
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
        })

        // Clean up Swiper instance on unmount
        return () => {
            if (swiper) swiper.destroy()
        }
    }, [product]) // Re-initialize swiper when product changes

    if (loading) return <Loader />
    if (error) return <p>Error loading product details: {error}</p>

    return (
        <Fragment>
            {loading ? (
                <Loader />
            ) : (
                <Fragment>
                    <div className="productDetails">
                        {/* Start of carousel */}
                        <div className="swiper-container">
                            <div className="swiper-wrapper">
                                {product.images &&
                                    product.images.map((item, idx) => (
                                        <div className="swiper-slide" key={idx}>
                                            <img
                                                src={item.url}
                                                alt={`Slide ${idx + 1}`}
                                                className="slideImage"
                                            />
                                        </div>
                                    ))}
                            </div>
                            <div className="swiper-pagination"></div>
                        </div>
                        {/* End of carousel */}
                        <div>
                            <div className="detailsBlock-1">
                                <h2>{product.name}</h2>
                                <p>Product # {product._id}</p>
                            </div>
                            <div className="detailsBlock-2">
                                <ReactStars {...options} />
                                <span>({product.numberOfReviews} Reviews)</span>
                            </div>
                            <div className="detailsBlock-3">
                                <h1>{`₹${product.price}`}</h1>
                                <div className="detailsBlock-3-1">
                                    <div className="detailsBlock-3-1-1">
                                        <button>-</button>
                                        <input value={1} type="number" />
                                        <button>+</button>
                                    </div>
                                    <button>Add to Cart</button>
                                </div>
                                <p>
                                    Status :
                                    <b
                                        className={
                                            product.stock < 1
                                                ? 'redColor'
                                                : 'greenColor'
                                        }
                                    >
                                        {product.stock < 1
                                            ? 'Out of Stock'
                                            : 'In Stock'}
                                    </b>
                                </p>
                            </div>
                            <div className="detailsBlock-4">
                                Description :<p>{product.description}</p>
                            </div>
                            <button className="submitReview">
                                Submit Review
                            </button>
                        </div>
                    </div>
                    <h3 className="reviewsHeading">REVIEWS</h3>
                    {product.reviews && product.reviews[0] ? (
                        <div className="reviews">
                            {product.reviews &&
                                product.reviews.map((review) => {
                                    return <ReviewCard review={review} />
                                })}
                        </div>
                    ) : (
                        <p className="noReviews">No Reviews Yet</p>
                    )}
                </Fragment>
            )}
        </Fragment>
    )
}

export default ProductDetails
