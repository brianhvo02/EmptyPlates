import './index.css';
import { useRestaurant } from "../../store/restaurantSlice";
import { useSelector } from "react-redux";
import { useState } from 'react';

export default function RestaurantPage() {
    const errors = useSelector(state => state.errors.restaurant);
    const { restaurant } = useRestaurant();

    const [activeSection, setActiveSection] = useState('overview');

    return (
        restaurant ? (
            errors.length > 0 ? (
                errors.map((error, i) => <p key={i}>{error}</p>)
            ) : (
                restaurant ? (
                    <div className="restaurant">
                        <img className="restaurant-image" src={restaurant.imageUrl} />
                        <div className="restaurant-content">
                            <div className='restaurant-content-main'>
                                <nav className='main-navbar'>
                                    <span 
                                        className={
                                            activeSection === 'overview'
                                                ? 'activeSection main-navlink'
                                                : 'main-navlink'
                                        } >
                                        Overview
                                    </span>
                                    <span 
                                        className={
                                            activeSection === 'review'
                                                ? 'activeSection main-navlink'
                                                : 'main-navlink'
                                        } >
                                        Review
                                    </span>
                                </nav>
                                <h1>{restaurant.name}</h1>
                            </div>
                            <div className='restaurant-content-side'>
                                
                            </div>
                            {/* <p>{restaurant.bio}</p>
                            <p>{restaurant.address}</p>
                            <p>{restaurant.phoneNumber}</p>
                            <p>{Array(restaurant.priceRange).fill('$').join('')}</p>
                            <p>{restaurant.neighborhood}</p>
                            <p>{restaurant.cuisine}</p> */}
                        </div>
                    </div>
                ) : null
            )
        ) : (
            <p>Make new restaurant</p>
        )
    )
}