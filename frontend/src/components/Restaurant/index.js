import './index.css';
import { useFetchRestaurant, useRestaurant } from "../../store/restaurantSlice";
import { useEffect, useMemo, useRef, useState } from 'react';
import { faPhone, faStar, faUtensils } from '@fortawesome/free-solid-svg-icons';
import { faMessage, faMoneyBill1 } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ReservationSide from './ReservationSide';
import MapSide from './MapSide';
import { useError } from '../../store/errorSlice';
import { useParams } from 'react-router-dom';
import { createPortal } from 'react-dom';
import ErrorModal from '../Modal/ErrorModal';
import { useReservationSearchSlice } from '../../store/reservationSearchSlice';
import Review from './Review';
import { getReviewRatings } from '../../utils';

export const priceRange = {
    1: '$20 and under',
    2: '$30 and under',
    3: '$40 and under',
    4: '$50 and over'
}

const phoneNumBeautify = phoneNum => `(${phoneNum?.slice(0, 3)}) ${phoneNum?.slice(3, 6)}-${phoneNum?.slice(6)}`;

export default function RestaurantPage() {
    const search = useReservationSearchSlice();
    const errors = useError('restaurant');
    const { restaurantId } = useParams();
    useFetchRestaurant(restaurantId);
    const { restaurant } = useRestaurant();
    const [activeSection, setActiveSection] = useState();

    const phoneNumRef = useRef();

    const sections = {
        overview: useRef(),
        reviews: useRef()
    }

    useEffect(() => {
        if (activeSection) sections[activeSection].current.scrollIntoView({ behavior: 'smooth' });
    }, [activeSection]);

    return (
        <div className="restaurant">
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
                                (activeSection === 'overview' || !activeSection)
                                    ? 'activeSection main-navlink'
                                    : 'main-navlink'
                            }
                            onClick={() => setActiveSection('overview')}>
                            Overview
                        </span>
                        <span 
                            className={
                                activeSection === 'reviews'
                                    ? 'activeSection main-navlink'
                                    : 'main-navlink'
                            } 
                            onClick={() => setActiveSection('reviews')}>
                            Reviews
                        </span>
                    </nav>
                    <section className='overview' ref={sections.overview}>
                        <h1 className='overview-name'>{restaurant?.name}</h1>
                        <div className='overview-labels'>
                            <div className='rating-label'>
                                {Array.from(Array(5).keys()).map(i => 
                                    <FontAwesomeIcon key={`rating-${restaurant?.id}-${i}`} 
                                        icon={faStar} className='star-icon'
                                        style={{
                                            color: (i + 1) <= Math.round(restaurant?.reviewBreakdown.overall)
                                                ? '#3795DA' 
                                                : '#E1E1E1'
                                        }}
                                    />
                                )}
                                <span className='rating-label-text'>{restaurant?.reviewBreakdown?.overall ? restaurant.reviewBreakdown.overall.slice(0, 3) : 0}</span>
                            </div>
                            <div className='review-count-label'>
                                <FontAwesomeIcon icon={faMessage} 
                                className='overview-label-icon' />
                                {restaurant ? restaurant.reviewCount : 0} Reviews
                            </div>
                            <div className='price-range-label'>
                                <FontAwesomeIcon icon={faMoneyBill1} 
                                className='overview-label-icon' />
                                {priceRange[restaurant?.priceRange]}
                            </div>
                            <div className='cuisine-label'>
                                <FontAwesomeIcon icon={faUtensils} 
                                className='overview-label-icon' />
                                {restaurant?.cuisine?.name}
                            </div>
                        </div>
                        <div className='overview-bio'>{restaurant?.bio}</div>
                    </section>
                    <section className='reviews' ref={sections.reviews}>
                        <h2>{`What ${restaurant ? restaurant.reviews.length : ''} ${restaurant?.reviews.length === 1 ? 'person is' : 'people are'} saying`}</h2>
                        <div className='reviews-overall'>
                            <div className='overall-info'>
                                <h3>Overall ratings and reviews</h3>
                                <p>Reviews can only be made by diners who have eaten at this restaurant</p>
                                <div className='rating-label'>
                                    {Array.from(Array(5).keys()).map(i => 
                                        <FontAwesomeIcon key={`rating-mini-${restaurant?.id}-${i}`} 
                                            icon={faStar} className='star-icon'
                                            style={{
                                                color: (i + 1) <= Math.round(restaurant?.reviewBreakdown.overall)
                                                    ? '#3795DA' 
                                                    : '#E1E1E1'
                                            }}
                                        />
                                    )}
                                    <span className='rating-label-text'>
                                        {
                                            restaurant?.reviewBreakdown.overall ? restaurant?.reviewBreakdown.overall.slice(0, 3) : 0
                                        } based on recent ratings
                                    </span>
                                </div>
                                <div className='average-ratings'>
                                    {
                                        restaurant &&
                                        Object.entries(restaurant.reviewBreakdown).map(([key, value]) => 
                                            <div className='average-rating' key={key}>
                                                <span>{value ? value.slice(0, 3) : 0}</span>
                                                <span>{key[0].toUpperCase() + key.slice(1)}</span>
                                            </div>
                                        )
                                    }
                                </div>
                            </div>
                            <div className='rating-bars'>
                                {
                                    Array.from(Array(5).keys()).reverse().map(i =>
                                        <div className='ratings-bar-container' key={`ratings-${i}`}>
                                            <label htmlFor={`meter-${i + 1}`}>{i + 1}</label>
                                            <meter id={`meter-${i + 1}`} className='ratings-bar'>
                                                <div className='meter-bar' style={
                                                    { 
                                                        width: restaurant?.reviewCounts?.[i] ? `${parseFloat(restaurant.reviewCounts[i]) * 100}%`: 0
                                                    }
                                                } />
                                            </meter>
                                        </div>
                                    )
                                }
                            </div>
                        </div>
                        <div className='reviews-all'>
                            {
                                restaurant?.reviews.map(review =>
                                    review.review && <Review key={review.id} review={review} />
                                )
                            }
                        </div>
                    </section>
                </div>
                <div className='restaurant-content-side'>
                    <ReservationSide 
                        availableTables={restaurant?.availableTables} 
                        reservations={restaurant?.reservations} 
                        neighborhood={restaurant?.neighborhood} 
                        defaultPartySize={search.partySize}
                        defaultDate={search.date}
                        defaultTime={search.time}
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
        </div>
    )
}
