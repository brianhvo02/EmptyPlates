import './index.css';
import { useRestaurant } from "../../store/restaurantSlice";
import { useState } from 'react';
import { faStar, faUtensils } from '@fortawesome/free-solid-svg-icons';
import { faMessage, faMoneyBill1 } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ReservationSide from './ReservationSide';
import MapSide from './MapSide';
import { useError } from '../../store/errorSlice';

export const priceRange = {
    1: '$20 and under',
    2: '$30 and under',
    3: '$40 and under',
    4: '$50 and over'
}

const ratingPlaceholder = 3;
const reviewCountPlaceholder = 150;

export default function RestaurantPage() {
    const errors = useError('restaurant');
    const { restaurant } = useRestaurant();
    const [activeSection, setActiveSection] = useState('overview');

    return (
        restaurant ? (
            errors.length > 0 ? (
                errors.map((error, i) => <p key={i}>{error}</p>)
            ) : (
                restaurant ? (
                    <div className="restaurant">
                        <img className="restaurant-image" src={restaurant.imageUrl} alt={restaurant.name} />
                        <div className="restaurant-content">
                            <div className='restaurant-content-main'>
                                <nav className='main-navbar'>
                                    <span 
                                        className={
                                            activeSection === 'overview'
                                                ? 'activeSection main-navlink'
                                                : 'main-navlink'
                                        }
                                        onClick={() => setActiveSection('overview')}>
                                        Overview
                                    </span>
                                    <span 
                                        className={
                                            activeSection === 'review'
                                                ? 'activeSection main-navlink'
                                                : 'main-navlink'
                                        } 
                                        onClick={() => setActiveSection('review')}>
                                        Review
                                    </span>
                                </nav>
                                <section className='overview'>
                                    <h1 className='overview-name'>{restaurant.name}</h1>
                                    <div className='overview-labels'>
                                        <div className='rating-label'>
                                            {Array.from(Array(5).keys()).map(i => 
                                                <FontAwesomeIcon key={`rating-${restaurant.id}-${i}`} 
                                                    icon={faStar} className='star-icon'
                                                    style={{
                                                        color: i < ratingPlaceholder 
                                                            ? '#3795DA' 
                                                            : '#E1E1E1'
                                                    }}
                                                />
                                            )}
                                            <span className='rating-label-text'>{ratingPlaceholder.toFixed(1)}</span>
                                        </div>
                                        <div className='review-count-label'>
                                            <FontAwesomeIcon icon={faMessage} 
                                            className='overview-label-icon' />
                                            {reviewCountPlaceholder} Reviews
                                        </div>
                                        <div className='price-range-label'>
                                            <FontAwesomeIcon icon={faMoneyBill1} 
                                            className='overview-label-icon' />
                                            {priceRange[restaurant.priceRange]}
                                        </div>
                                        <div className='cuisine-label'>
                                            <FontAwesomeIcon icon={faUtensils} 
                                            className='ep-blue overview-label-icon' />
                                            {restaurant.cuisine.name}
                                        </div>
                                    </div>
                                    <div className='overview-bio'>{restaurant.bio}</div>
                                </section>
                            </div>
                            <div className='restaurant-content-side'>
                                <ReservationSide />
                                <MapSide address={restaurant.address} />
                            </div>
                        </div>
                    </div>
                ) : null
            )
        ) : (
            <p>Loading</p>
        )
    )
}
