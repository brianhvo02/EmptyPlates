import './index.css';
import { useFetchRestaurant, useRestaurant } from "../../store/restaurantSlice";
import { useRef, useState } from 'react';
import { faPhone, faStar, faUtensils } from '@fortawesome/free-solid-svg-icons';
import { faMessage, faMoneyBill1 } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ReservationSide from './ReservationSide';
import MapSide from './MapSide';
import { useError } from '../../store/errorSlice';
import { useParams } from 'react-router-dom';
import { createPortal } from 'react-dom';
import ErrorModal from '../Modal/ErrorModal';

export const priceRange = {
    1: '$20 and under',
    2: '$30 and under',
    3: '$40 and under',
    4: '$50 and over'
}

const ratingPlaceholder = 3;
const reviewCountPlaceholder = 150;

const phoneNumBeautify = phoneNum => `(${phoneNum?.slice(0, 3)}) ${phoneNum?.slice(3, 6)}-${phoneNum?.slice(6)}`;

export default function RestaurantPage() {
    const errors = useError('restaurant');
    const { restaurantId } = useParams();
    useFetchRestaurant(restaurantId);
    const { restaurant } = useRestaurant();
    const [activeSection, setActiveSection] = useState('overview');

    const phoneNumRef = useRef();

    const date = new Date();
    const hour = date.getHours();
    const minutes = date.getMinutes();
    const nearestHalfHour = new Date(`${date.toLocaleDateString()} ${hour + (minutes < 30 ? 0 : 1)}:${minutes < 30 ? 30 : 0}`);

    return (
        <main className="restaurant">
            {errors && errors.length > 0 && createPortal(
                <ErrorModal errors={errors} />,
                document.body
            )}
            <img className="restaurant-image" src={restaurant?.imageUrl} alt={restaurant?.name} />
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
                        <h1 className='overview-name'>{restaurant?.name}</h1>
                        <div className='overview-labels'>
                            <div className='rating-label'>
                                {Array.from(Array(5).keys()).map(i => 
                                    <FontAwesomeIcon key={`rating-${restaurant?.id}-${i}`} 
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
                                {priceRange[priceRange]}
                            </div>
                            <div className='cuisine-label'>
                                <FontAwesomeIcon icon={faUtensils} 
                                className='overview-label-icon' />
                                {restaurant?.cuisine?.name}
                            </div>
                        </div>
                        <div className='overview-bio'>{restaurant?.bio}</div>
                    </section>
                </div>
                <div className='restaurant-content-side'>
                    <ReservationSide 
                        availableTables={restaurant?.availableTables} 
                        reservations={restaurant?.reservations} 
                        neighborhood={restaurant?.neighborhood} 
                        defaultPartySize={2}
                        defaultDate={
                            nearestHalfHour.toLocaleDateString('en-US', { 
                                month: 'short', 
                                day: '2-digit', 
                                year: 'numeric' 
                            })
                        }
                        defaultTime={
                            nearestHalfHour.toLocaleTimeString('en-US', { 
                                hour: '2-digit', 
                                minute: '2-digit' 
                            })
                        }
                    />
                    <MapSide address={restaurant?.address} />
                    <div className='side-phone'>
                        <h1>Order takeout</h1>
                        <a ref={phoneNumRef} href={`tel:${restaurant?.phoneNumber}`} hidden>Phone Number</a>
                        <div onClick={() => phoneNumRef.current.click()} className='side-phone-display'>
                            <FontAwesomeIcon icon={faPhone} />
                            <span className='ep-blue'>{phoneNumBeautify(restaurant?.phoneNumber)}</span>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}
