import { useDispatch, useSelector } from 'react-redux';
import './RestaurantCarousel.css';
import { getRestaurants, restaurantUrl, useRestaurants } from '../../store/restaurantSlice';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPhone, faStar } from '@fortawesome/free-solid-svg-icons';

export default function RestaurantCarousel() {
    const navigate = useNavigate();
    const { restaurants } = useRestaurants();

    // const parsePhoneNumber = phoneNumber => 
    //     `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6)}`;

    const ratingPlaceholder = 3;
    const reviewCountPlaceholder = 150;

    return (
        <div className='restaurant-carousel'>
            <h1 className='carousel-header'>Restaurants near you</h1>
            <ul className='carousel-content'>
                {restaurants.map(restaurant => {
                    return <li key={restaurant.id} className='carousel-restaurant' 
                        onClick={() => navigate(restaurantUrl(restaurant.urlId))}
                    >
                        <img className='carousel-restaurant-image' src={restaurant.imageUrl} alt={restaurant.name}></img>
                        <div className='carousel-restaurant-info'>
                            <h2 className='carousel-restaurant-name'>{restaurant.name}</h2>
                            <div className='carousel-restaurant-reviews'>
                                <span className='review-ratings'>
                                    {Array.from(Array(5).keys()).map(i => 
                                        <FontAwesomeIcon key={restaurant.id + i} icon={faStar} 
                                            className='star-icon'
                                            style={{
                                                color: i < ratingPlaceholder 
                                                    ? '#3795DA' 
                                                    : '#E1E1E1'
                                            }}
                                        />
                                    )}
                                </span>
                                <span className='review-count'>{reviewCountPlaceholder} reviews</span>
                            </div>
                            <div className='carousel-restaurant-details'>
                                <span className='carousel-restaurant-detail'>{restaurant.cuisine}</span>
                                <span className='carousel-restaurant-detail'>{restaurant.priceRange}</span>
                                <span className='carousel-restaurant-detail'>{restaurant.neighborhood}</span>
                            </div>
                        </div>
                    </li>
                })}
            </ul>
        </div>
    )
}