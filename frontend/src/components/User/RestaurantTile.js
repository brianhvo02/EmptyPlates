import { Link } from 'react-router-dom';
import './ReservationTile.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLocationDot, faStar, faUtensils } from '@fortawesome/free-solid-svg-icons';
import { restaurantUrl } from '../../store/restaurantSlice';
import { useMemo } from 'react';

export default function RestaurantTile({restaurant}) {
    const ratingPlaceholder = 3;
    const reviewCountPlaceholder = 150;

    return (
        <Link to={restaurantUrl(restaurant.urlId) + '/edit'}>
            <img src={restaurant.imageUrl} />
            <div className='reservation-content'>
                <h3>{restaurant.name}</h3>
                <div>
                    <div className='review-ratings'>
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
                    </div>
                    <div className='review-count'>
                        {reviewCountPlaceholder} reviews
                    </div>
                </div>
                <p>{restaurant.reservations.length} reservation{restaurant.reservations.length !== 1 ? 's' : ''}</p>
                {/* <p>
                    <FontAwesomeIcon icon={faCalendar} />
                    <span>{reservation.datetime.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                </p>
                <p>
                    <FontAwesomeIcon icon={faUser} />
                    <span>{seats}</span>
                    <FontAwesomeIcon icon={faClock} />
                    <span>{reservation.datetime.toLocaleTimeString('en-US', { hour: '2-digit',  minute: '2-digit' })}</span>
                </p> */}
                <p>
                    <FontAwesomeIcon icon={faUtensils} />
                    <span>{restaurant.cuisine.name}</span>
                </p>
                <p>
                    <FontAwesomeIcon icon={faLocationDot} />
                    <span>{restaurant.neighborhood.name}</span>
                </p>
            </div>
        </Link>
    )
}