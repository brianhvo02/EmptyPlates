import { useDispatch, useSelector } from 'react-redux';
import './RestaurantCarousel.css';
import { getRestaurants, getRestaurantsFromState, restaurantUrl, useRestaurants } from '../../store/restaurantSlice';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPhone } from '@fortawesome/free-solid-svg-icons';

export default function RestaurantCarousel() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const restaurants = useRestaurants()

    useEffect(() => {
        dispatch(getRestaurants());
    }, [dispatch]);

    const parsePhoneNumber = phoneNumber => 
        `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6)}`;

    return (
        <div className='restaurant-carousel'>
            <h1 className='carousel-header'>Restaurants near you</h1>
            <ul className='carousel-content'>
                {restaurants.map(restaurant => {
                    return <li key={restaurant.id} className='carousel-restaurant' 
                        onClick={() => navigate(restaurantUrl(restaurant.urlId))}
                    >
                        <h2 className='carousel-restaurant-name'>{restaurant.name}</h2>
                        <div className='carousel-restarant-details'>
                            <p className='carousel-restarant-detail'>{restaurant.cuisine}</p>
                            <p className='carousel-restarant-detail'>{restaurant.priceRange}</p>
                            <p className='carousel-restarant-detail'>{restaurant.neighborhood}</p>
                        </div>
                        <div className='carousel-restaurant-phone'>
                            <FontAwesomeIcon icon={faPhone} />
                            <p>{parsePhoneNumber(restaurant.phoneNumber)}</p>
                        </div>
                        
                    </li>
                })}
            </ul>
        </div>
    )
}