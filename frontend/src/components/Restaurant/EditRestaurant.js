import { useClearErrorsOnUnmount, useError } from '../../store/errorSlice';
import { useRestaurant } from '../../store/restaurantSlice';
import { useAuth } from '../../utils';
import { useEffect, useState } from 'react';
import { faStar, faUtensils } from '@fortawesome/free-solid-svg-icons';
import { faMessage, faMoneyBill1 } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ReservationSide from './ReservationSide';
import MapSide from './MapSide';
import './EditRestaurant.css';
import { priceRange } from '.';
import { useNavigate } from 'react-router-dom';
import { useCuisines } from '../../store/cuisineSlice';

export default function EditRestaurantPage() {
    const { currentUser, isLoggedIn } = useAuth();
    const errors = useError('restaurant');
    const { restaurant } = useRestaurant();
    const { cuisines } = useCuisines();
    useClearErrorsOnUnmount();
    const navigate = useNavigate();

    useEffect(() => {
        if (isLoggedIn && restaurant && !currentUser.restaurants.includes(restaurant.urlId)) {
            navigate('/');
        }
    }, [currentUser, isLoggedIn, restaurant]);

    const ratingPlaceholder = 3;
    const reviewCountPlaceholder = 150;

    const [input, setInput] = useState();
    
    const [activeSection, setActiveSection] = useState('overview');

    const handleInputChange = e => {
        setInput(prev => {
            return {
                ...prev,
                [e.target.name]: e.target.value
            }
        });
    }

    const [ranOnce, setRanOnce] = useState(false);

    useEffect(() => {
        if (!ranOnce && restaurant) {
            setInput({
                ...restaurant,
                cuisine: restaurant.cuisine.id,
                neighborhood: restaurant.neighborhood.id
            })
            setRanOnce(true)
        }
    }, [restaurant, ranOnce])

    return (
        restaurant && input ? (
            errors.length > 0 ? (
                errors.map((error, i) => <p key={i}>{error}</p>)
            ) : (
                restaurant ? (
                    <div className="restaurant">
                        <img className="restaurant-image" src={input.imageUrl} alt={input.name} />
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
                                    <input name='name' value={input.name} onChange={handleInputChange} className='overview-name edit' />
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
                                            <select className='edit' defaultValue={input.priceRange}>
                                            {
                                                Object.entries(priceRange)
                                                    .map(([id, desc]) => 
                                                        <option key={`price_range_${id}`} value={id}>{desc}</option>
                                                )
                                            }
                                        </select>
                                        </div>
                                        <div className='cuisine-label'>
                                            <FontAwesomeIcon icon={faUtensils} 
                                            className='ep-blue overview-label-icon' />
                                            <select className='edit' name='cuisine' defaultValue={input.cuisine}>
                                            {
                                                cuisines.map(({id, name}) => 
                                                    <option key={`cuisine_${id}`} value={id}>{name}</option>
                                                )
                                            }
                                            </select>
                                        </div>
                                        
                                    </div>
                                    <textarea name='bio' className='overview-bio-edit edit' value={input.bio} onChange={handleInputChange} />
                                </section>
                            </div>
                            <div className='restaurant-content-side'>
                                <ReservationSide />
                                <MapSide address={input.address} handleInputChange={handleInputChange} edit={true}/>
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