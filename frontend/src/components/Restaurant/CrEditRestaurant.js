import { useClearErrorsOnUnmount, useError } from '../../store/errorSlice';
import { createRestaurant, deleteRestaurant, updateRestaurant, useRestaurant, useRestaurants } from '../../store/restaurantSlice';
import { dynamicTextArea, useAuth } from '../../utils';
import { useEffect, useRef, useState } from 'react';
import { faPhone, faStar, faUtensils } from '@fortawesome/free-solid-svg-icons';
import { faMessage, faMoneyBill1 } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ReservationSide from './ReservationSide';
import MapSide from './MapSide';
import './CrEditRestaurant.css';
import { priceRange } from '.';
import { useNavigate } from 'react-router-dom';
import { useCuisines } from '../../store/cuisineSlice';

import grayBackground from './gray.png';

export default function CrEditRestaurantPage() {
    const { currentUser, isLoggedIn } = useAuth();
    const errors = useError('restaurant');
    const { dispatch, restaurant, isNew } = useRestaurant();
    const { restaurantIds } = useRestaurants();
    const { cuisines } = useCuisines();
    useClearErrorsOnUnmount();
    const navigate = useNavigate();
    const textarea = useRef();
    const phoneInput = useRef();

    useEffect(() => console.log(errors), [errors])

    useEffect(() => {
        if (isLoggedIn && restaurant && !currentUser.restaurants.includes(restaurant.urlId)) {
            navigate('/');
        }
    }, [currentUser, isLoggedIn, restaurant]);

    const ratingPlaceholder = 3;
    const reviewCountPlaceholder = 150;

    const [input, setInput] = useState({
        name: '',
        address: '',
        neighborhoodId: 0,
        priceRange: 0,
        cuisineId: 0,
        bio: '',
        phoneNumber: '',
        photo: null,
        ownerId: 0
    });

    const [initialInput, setInitialInput] = useState({});
    const [deleted, setDeleted] = useState(false);

    const [imageUrl, setImageUrl] = useState(grayBackground);
    const [initialImageUrl, setInitialImageUrl] = useState(grayBackground);

    const handleInputChange = e => {
        if (e.target.type === 'file') {
            if (e.target.files[0]) {
                const fileReader = new FileReader();
                fileReader.onload = e => setImageUrl(e.target.result);
                fileReader.readAsDataURL(e.target.files[0]);
            } else {
                setImageUrl(initialImageUrl);
                setInput(prev => ({ ...prev, photo: null}));
            }
        }

        setInput(prev => {
            return {
                ...prev,
                [e.target.name]: e.target.type === 'file' ? e.target.files[0] : e.target.value
            }
        });
    }

    const [ranOnce, setRanOnce] = useState(false);

    useEffect(() => {
        if (!ranOnce && restaurant) {
            const restaurantInput = Object.assign({}, restaurant);
            setInitialInput(restaurant);
            setImageUrl(restaurantInput.imageUrl);
            setInitialImageUrl(restaurantInput.imageUrl);
            restaurantInput.cuisineId = restaurantInput.cuisine.id;
            restaurantInput.neighborhoodId = restaurantInput.neighborhood.id;
            delete restaurantInput.imageUrl;
            delete restaurantInput.cuisine;
            delete restaurantInput.neighborhood;
            setInput(restaurantInput);
            setRanOnce(true);
        } else if (restaurant) {
            let match = true;
            for (let key in restaurant) {
                if (
                    (key === 'cuisine' || key === 'neighborhood')
                        ? restaurant[key].id !== initialInput[key].id
                        : restaurant[key] !== initialInput[key]
                ) {
                    console.log(key);
                    match = false;
                }
            }

            if (!match) {
                navigate('/')
            }
        }
    }, [restaurant, ranOnce]);

    useEffect(() => {
        if (!restaurant && restaurantIds && input.name && input.phoneNumber) {
            if (restaurantIds.includes(`${input.name.toLowerCase().split(' ').join('-')}-${input.phoneNumber}`)) {
                navigate('/')
            }
        }
    }, [restaurantIds, input, restaurant])

    useEffect(() => {
        if (textarea?.current) {
            dynamicTextArea({
                target: textarea.current
            });
        }
    }, [textarea.current]);

    useEffect(() => {
        if (currentUser) {
            handleInputChange({
                target: {
                    name: 'ownerId',
                    value: currentUser.id
                }
            });
        }
    }, [currentUser]);

    useEffect(() => {
        if (deleted && restaurantIds && restaurant) {
            if (!restaurantIds.includes(restaurant.id)) {
                navigate('/');
            }
        }
    }, [deleted, restaurantIds, restaurant]);

    const handleSubmit = () => {
        const formData = new FormData();
        for (let name in input) formData.append(`restaurant[${name}]`, input[name]);
        dispatch((isNew ? createRestaurant : updateRestaurant)(formData));
        // setStage(prev => prev + 1);
        // return;
    }

    return (
        input ? (
            <div className='restaurant'>
                <label className='restaurant-image-upload'>
                    Upload an Image
                    <input type='file' name='photo' accept='image/*' onChange={handleInputChange} />
                </label>
                <img className='restaurant-image' src={imageUrl} alt={input.name} />
                <div className='restaurant-content'>
                    <div className='restaurant-content-main'>
                        <nav className='main-navbar'>
                            <span className='activeSection main-navlink'>
                                Overview
                            </span>
                            <span className='main-navlink'>
                                Reviews
                            </span>
                        </nav>
                        <section className='overview'>
                            <input name='name' value={input.name} onChange={handleInputChange} className='overview-name edit' 
                                placeholder='Enter restaurant name here'/>
                            <div className='overview-labels'>
                                <div className='rating-label'>
                                    {Array.from(Array(5).keys()).map(i => 
                                        <FontAwesomeIcon key={`rating-${i}`} 
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
                                    <select className='edit' name='priceRange' value={input.priceRange} onChange={handleInputChange}>
                                        <option value={0} disabled>Select price range</option>
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
                                    <select className='edit' name='cuisineId' value={input.cuisineId} onChange={handleInputChange}>
                                        <option value={0} disabled>Select cuisine</option>
                                        {
                                            cuisines.map(({id, name}) => 
                                                <option key={`cuisine_${id}`} value={id}>{name}</option>
                                            )
                                        }
                                    </select>
                                </div>
                                
                            </div>
                            <textarea 
                                onFocus={dynamicTextArea} 
                                name='bio' 
                                className='overview-bio-edit edit' 
                                value={input.bio} 
                                onInput={dynamicTextArea}
                                onChange={handleInputChange}
                                ref={textarea}
                                placeholder='Enter restaurant biography here, write a length description for customers to grasp what your restaurant is about.'/>
                        </section>
                    </div>
                    <div className='restaurant-content-side'>
                        <section className='side-reservation'>
                            <h1 className='reservation-heading'>{isNew ? 'Create' : 'Edit'} Restaurant</h1>
                            {errors?.map((error, i) => <p key={`error_${i}`}>{error}</p>)}
                            <div className='reservation-dropdown-container'>
                                <button className='reservation-button' onClick={handleSubmit}>{isNew ? 'Create' : 'Edit'} Restaurant</button>
                                {!isNew ? <button className='reservation-button' onClick={() => {
                                    dispatch(deleteRestaurant(restaurant.id));
                                    setDeleted(true);
                                }}>Delete Restaurant</button> : null}
                            </div>
                        </section>
                        <MapSide address={input.address} handleInputChange={handleInputChange} credit={true}/>
                        <div className='side-phone'>
                            <h1>Order takeout</h1>
                            <div onClick={() => phoneInput.current.focus()}>
                                <FontAwesomeIcon icon={faPhone} />
                                <input ref={phoneInput} name='phoneNumber' value={input.phoneNumber} onChange={handleInputChange} className='edit' placeholder='Enter restaurant phone number here' />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        ) : null
    )
}