import { useClearErrorsOnUnmount, useError } from '../../store/errorSlice';
import { createRestaurant, deleteRestaurant, restaurantUrl, updateRestaurant, useRestaurantShallow } from '../../store/restaurantSlice';
import { dynamicTextArea, useAuth } from '../../utils';
import { useEffect, useRef, useState } from 'react';
import { faPhone, faStar, faUtensils } from '@fortawesome/free-solid-svg-icons';
import { faMessage, faMoneyBill1 } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import MapSide from './MapSide';
import './CrEditRestaurant.css';
import { priceRange } from '.';
import { useNavigate } from 'react-router-dom';
import { useCuisines, useFetchCuisines } from '../../store/cuisineSlice';
import grayBackground from './gray.png';
import { useDispatch } from 'react-redux';
import _ from 'lodash';
import { useRestaurantSlice } from '../../store/restaurantSlice';
import { createPortal } from 'react-dom';
import AvailabilityModal from '../Modal/AvailabilityModal';
import ConfirmDeleteModal from '../Modal/ConfirmDeleteModal';
import OperationModal from '../Modal/OperationModal';

export default function CrEditRestaurantPage() {
    const { currentUser } = useAuth();
    const errors = useError('restaurant');
    const { restaurant, isNew } = useRestaurantShallow();
    const restaurants = useRestaurantSlice();
    useFetchCuisines();
    const cuisines = useCuisines();
    useClearErrorsOnUnmount();
    const navigate = useNavigate();
    const textarea = useRef();
    const phoneInput = useRef();
    const dispatch = useDispatch();
    const updatedInput = useRef(false);
    const currentPage = useRef(isNew);

    useEffect(() => {
        if (!isNew && currentUser && restaurant && !currentUser.restaurants.includes(restaurant.urlId)) {
            navigate('/');
        }
    }, [currentUser, isNew, restaurant, navigate]);

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
        imageUrl: grayBackground
    });

    const [initialInput, setInitialInput] = useState({});
    const [image, setImage] = useState();
    const [toggleAvailabilityModal, setToggleAvailabilityModal] = useState(false);
    const [toggleConfirmDeleteModal, setToggleConfirmDeleteModal] = useState(false);
    const [toggleOperationModal, setToggleOperationModal] = useState(false);
    
    useEffect(() => {
        if (isNew && isNew !== currentPage.current) {
            setInput({
                name: '',
                address: '',
                neighborhoodId: 0,
                priceRange: 0,
                cuisineId: 0,
                bio: '',
                phoneNumber: '',
                imageUrl: grayBackground
            });
        }
    }, [isNew, currentPage]);
    
    useEffect(() => setInput(prev =>({ ...prev, ownerId: currentUser?.id })), [currentUser]);

    const handleInputChange = e => {
        if (e.target.type === 'file') {
            if (e.target.files[0]) {
                setImage(e.target.files[0]);
                const fileReader = new FileReader();
                fileReader.onload = e => setInput(prev => ({ ...prev, imageUrl: e.target.result }));
                fileReader.readAsDataURL(e.target.files[0]);
            } else {
                setImage();
                setInput(prev => ({ ...prev, imageUrl: restaurant.imageUrl || grayBackground }));
            }
        } else {
            setInput(prev => {
                return {
                    ...prev,
                    [e.target.name]: e.target.value
                }
            });
        }
    }

    const ref = useRef(false);

    useEffect(() => {
        if (
            (isNew && restaurants[`${input.name.toLowerCase().split(' ').join('-')}-${input.phoneNumber}`]) 
                || (!isNew && input.urlId && !_.isEqual(initialInput, restaurant))
        ) {
            if (!ref.current) {
                setToggleAvailabilityModal(false);
                setToggleConfirmDeleteModal(false);
                setToggleOperationModal(true);
                ref.current = true
            }
            
        }
    }, [initialInput, input, isNew, restaurant, restaurants]);

    useEffect(() => {
        if (!_.isEmpty(restaurant) && !updatedInput.current) {
            setInitialInput(restaurant);
            setInput(restaurant);
            updatedInput.current = true;
        }
    }, [restaurant, updatedInput]);

    const handleSubmit = () => {
        const formData = new FormData();
        for (let name in input) {
            if (name === 'imageUrl') {
                formData.append('restaurant[photo]', image);
            } else if(name !== 'availableTables') {
                formData.append(`restaurant[${name}]`, input[name]);
            }
        }
        dispatch((isNew ? createRestaurant : updateRestaurant)(formData));
    }

    return (
        input ? (
            <div className='restaurant'>
                {
                    toggleAvailabilityModal && createPortal(
                        <AvailabilityModal restaurant={restaurant} closeModal={modalRef => {
                            modalRef.current.classList.remove('modal-show');
                            setTimeout(() => setToggleAvailabilityModal(false), 300);
                        }} />,
                        document.body
                    )
                }
                {
                    toggleConfirmDeleteModal && createPortal(
                        <ConfirmDeleteModal restaurant={restaurant} deleteFunc={() => dispatch(deleteRestaurant(restaurant.id))} closeModal={modalRef => {
                            modalRef.current.classList.remove('modal-show');
                            setTimeout(() => setToggleConfirmDeleteModal(false), 300);
                        }} />,
                        document.body
                    )
                }
                {
                    toggleOperationModal && createPortal(
                        <OperationModal restaurant={restaurant} closeModal={modalRef => {
                            setInitialInput(restaurant);
                            ref.current = false;
                            modalRef.current.classList.remove('modal-show');
                            setTimeout(() => setToggleOperationModal(false), 300);
                        }} />,
                        document.body
                    )
                }
                <label className='restaurant-image-upload'>
                    Upload an Image
                    <input type='file' name='photo' accept='image/*' onChange={handleInputChange} />
                </label>
                <img className='restaurant-image' src={input.imageUrl} alt={input.name} />
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
                                placeholder='Enter restaurant name here' autoComplete="off"/>
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
                                autoComplete="off"
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
                                <button className='reservation-button reservation-edit' onClick={handleSubmit}>{isNew ? 'Create' : 'Edit'} Restaurant</button>
                                {!isNew ? (
                                    <>
                                        <button className='reservation-button' 
                                            onClick={() => navigate(restaurantUrl(restaurant.urlId))}>
                                            Go to Restaurant Page
                                        </button>
                                        <button className='reservation-button' 
                                            onClick={() => setToggleAvailabilityModal(true)}>
                                            Change Availability
                                        </button>
                                        <button className='reservation-button reservation-delete' onClick={
                                                () => setToggleConfirmDeleteModal(true)
                                            }>Delete Restaurant
                                        </button>
                                    </>
                                ) : null}
                            </div>
                        </section>
                        <MapSide address={input.address} 
                            setInput={setInput} credit={true}/>
                        <div className='side-phone'>
                            <h1>Order takeout</h1>
                            <div onClick={() => phoneInput.current.focus()}>
                                <FontAwesomeIcon icon={faPhone} />
                                <input ref={phoneInput} name='phoneNumber' autoComplete="off" 
                                    value={input.phoneNumber} onChange={handleInputChange} 
                                    className='side-phone-edit edit' 
                                    placeholder='Enter restaurant phone number here' />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        ) : null
    )
}