import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useAuth, useMaps } from '../../utils';
import './NewRestaurant.css';

import grayBackground from './gray.png';
import { faHouse, faUtensils } from '@fortawesome/free-solid-svg-icons';
import { faMoneyBill1 } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import MapSide from './MapSide';
import ReservationSide from './ReservationSide';
import { useNeighborhoods } from '../../store/neighborhoodSlice';
import { useCuisines } from '../../store/cuisineSlice';
import { priceRange } from '.';
import { createRestaurant, useRestaurants } from '../../store/restaurantSlice';
import { useSession } from '../../store/sessionSlice';
import { useClearErrorsOnUnmount, useError } from '../../store/errorSlice';
import { useNavigate } from 'react-router-dom';

// const phoneNumToInteger = phoneNum => phoneNum.slice(1, 4) + phoneNum.slice(6, 9) + phoneNum.slice(10);
// const integerToPhoneNum = integer => `(${integer.slice(0, 3)}) ${integer.slice(3, 6)}-${integer.slice(6)}`;

export default function NewRestaurantPage() {
    useAuth();
    useClearErrorsOnUnmount();

    const navigate = useNavigate();
    const errors = useError('restaurant');
    const { restaurants } = useRestaurants();
    const { dispatch, currentUser } = useSession();
    const { neighborhoods, neighborhoodSlice } = useNeighborhoods();
    const { cuisines, cuisineSlice } = useCuisines();

    const [nearestNeighborhoods, setNearestNeighborhoods] = useState([]);

    const emptyForm = Object.freeze({
        header: <></>,
        body: <></>,
        inputs: <></>,
        submit: <></>
    });

    const formRef = useRef();

    const [stage, setStage] = useState(0);

    // const [input, setInput] = useState({
    //     name: '',
    //     address: '',
    //     neighborhoodId: 0,
    //     priceRange: 0,
    //     cuisineId: 0,
    //     bio: '',
    //     phoneNumber: '',
    //     photo: grayBackground,
    //     ownerId: 0
    // });

    const [input, setInput] = useState({
        name: 'The Rotunda',
        address: '150 Stockton St, San Francisco, CA 94108',
        neighborhoodId: 1,
        priceRange: 3,
        cuisineId: 80,
        bio: 'The Rotunda is a stunning circular restaurant located in the heart of San Francisco, California. Situated on the top floor of Neiman Marcus, the Rotunda boasts a beautiful 360-degree view of the city. The menu at the Rotunda is upscale and features modern American cuisine. The restaurant is best known for its signature popover, a light and airy pastry that is served with strawberry butter. In addition to the main dining room, the Rotunda also features a lounge area where guests can enjoy drinks and small bites. The lounge is decorated with plush couches and chairs, making it a comfortable spot to relax and enjoy the view.',
        phoneNumber: '4152492720',
        photo: '',
        ownerId: 0
    });

    const [imageUrl, setImageUrl] = useState(grayBackground);

    useEffect(() => setInput(prev => ({ ...prev, ownerId: currentUser?.id })), [currentUser]);

    const handleChange = e => {
        if (e) e.preventDefault();
        if (e && stage === 3) return;
        if (e && stage === 10) {
            const formData = new FormData();
            for (let name in input) formData.append(`restaurant[${name}]`, input[name]);
            dispatch(createRestaurant(formData));
            setStage(prev => prev + 1);
            return;
        }
        formRef.current.style.opacity = 0;
        setTimeout(() => setStage(prev => prev + 1), 300);
    }

    const { ref } = useMaps({
        stage,
        neighborhoods,
        address: input.address,
        nearestNeighborhoodsListener: useCallback(setNearestNeighborhoods, [setNearestNeighborhoods]),
        autoCompleteListener: useCallback(address => {
            setInput(prev => ({ ...prev, address }));
            handleChange();
        }, [])
    });

    const handleInputChange = e => setInput(prev => ({ ...prev, [e.target.name]: e.target.value }));

    // const handleDropdownClick = e => {}
    // const toggleDropdown = e => {}

    const stages = useMemo(() => [
        {
            ...emptyForm,
            header: <h1>EmptyPlates Restaurant Editor</h1>,
            body: (
                <p>
                    Welcome to the EmptyPlates Restaurant Editor, where you can add a new restaurant 
                    to our platform. You must be approved as an owner to gain access this page, so 
                    if you're here then you must own a restaurant!
                    <br />
                    With our restaurant editor, you can setup a page for patrons to learn more about
                    your restaurant or create availability so you can have customers start making 
                    reservations. Click the button below to get the process started.
                </p>
            ),
            submit: <button>Sounds good to me!</button>
        },
        {
            ...emptyForm,
            header: <h1>Let's get started!</h1>
        },
        {
            ...emptyForm,
            header: <h1>First, give us the name of your restaurant.</h1>,
            inputs: <input name='name' autoComplete='off' placeholder='The Cheesecake Factory' value={input.name} onChange={handleInputChange} />,
            submit: <button>Continue</button>
        },
        {
            ...emptyForm,
            header: <h1>Where is your restaurant located?</h1>,
            inputs: (
                <>
                    <input ref={ref} autoComplete='off' name='address' placeholder='251 Geary St 8th Floor, San Francisco, CA 94102' value={input.address} onChange={handleInputChange} />
                </>
            )
        },
        {
            ...emptyForm,
            header: <h1>Select your neighborhood from the following:</h1>,
            inputs: (
                <select value={input.neighborhoodId} 
                    onChange={e => setInput(prev => ({ ...prev, neighborhoodId: e.target.value }))}>
                        <option value={0} disabled />
                    {
                        nearestNeighborhoods.map(neighborhood => 
                            <option key={`${neighborhood.id}_${neighborhood.name}`} value={neighborhood.id}>{neighborhood.name}</option>
                        )
                    }
                </select>
            ),
            submit: <button disabled={input.neighborhoodId === 0}>Select neighborhood</button>
        },
        {
            ...emptyForm,
            header: <h1>How expensive is your fare?</h1>,
            body: <p>{input.priceRange === 0 
                ? 'Hover over the dollar sign to see the range and click to choose.' 
                : priceRange[input.priceRange]}</p>,
            inputs: (
                <span 
                    onMouseLeave={() => setInput(prev => ({ ...prev, priceRange: 0 }))}
                    onClick={handleChange}>
                    {Array.from(Array(4).keys()).map(i => 
                        <span 
                            style={{
                                color: input.priceRange > i ? '#2480c4' : 'black'
                            }} 
                            onMouseEnter={() => setInput(prev => ({ ...prev, priceRange: i + 1 }))}
                            key={`price-range-${i}`}
                        >$</span>
                    )}
                </span>
            )
        },
        {
            ...emptyForm,
            header: <h1>Select your cuisine from the following:</h1>,
            inputs: (
                <select value={input.cuisineId} 
                    onChange={e => setInput(prev => ({ ...prev, cuisineId: e.target.value }))}>
                        <option value={0} disabled />
                    {
                        cuisines.map(cuisine => 
                            <option key={`${cuisine.id}_${cuisine.name}`} value={cuisine.id}>{cuisine.name}</option>
                        )
                    }
                </select>
            ),
            submit: <button disabled={input.neighborhoodId === 0}>Select cuisine</button>
        },
        {
            ...emptyForm,
            header: <h1>Enter a short description about your restaurant:</h1>,
            inputs: (
                <textarea name='bio' value={input.bio} onChange={handleInputChange} />
            ),
            submit: <button>Continue</button>
        },
        {
            ...emptyForm,
            header: <h1>What is your restaurant's phone number?</h1>,
            inputs: <input name='phoneNumber' autoComplete='off' placeholder='1234567890' value={input.phoneNumber} onChange={handleInputChange} />,
            submit: <button>Continue</button>
        }, 
        {
            ...emptyForm,
            header: <h1>Upload an image for display.</h1>,
            inputs: <input type='file' accept='image/*' onChange={e => {
                setInput(prev => ({ ...prev, photo: e.target.files[0] }));
                handleChange();
            }} />
        }, 
        {
            header: <h1>Does everything on the page look right to you?</h1>,
            submit: errors.length > 0 ? null : <button>Confirm restaurant creation</button>
        },
        {
            header: <h1>Saving your restaurant...</h1>,
            body: errors.map((error, i) => <p style={{ color: 'red' }}key={i}>{error}</p>)
        }
    ], [input, emptyForm, ref, neighborhoods, cuisines, errors]);

    useEffect(() => {
        if (formRef.current) {
            if (stage === 1) {
                formRef.current.style.opacity = 1;
                setTimeout(handleChange, 2000);
            } else if (stage) {
                Array.from(formRef.current.children).forEach(child => child.style.opacity = 0);
    
                setTimeout(() => {
                    formRef.current.style.opacity = 1;
                    formRef.current.querySelector('h1').style.opacity = 1;
                }, 300);
                
                setTimeout(() => 
                    Array.from(formRef.current.children)
                        .forEach(selector => selector.style.opacity = 1)
                    , 2000);
            }
        }
    }, [stage, formRef]);

    useEffect(() => {
        if (input.photo) {
            const reader = new FileReader();
            reader.readAsDataURL(input.photo);
            reader.onload = e => setImageUrl(e.target.result);
        }
    }, [input]);

    useEffect(() => {
        if (errors.length > 0 && stage === 11) {
            setTimeout(() => navigate('/'), 3000);
        }
    }, [errors, stage]);

    useEffect(() => {
        if (restaurants && stage === 11) {
            setTimeout(() => navigate('/'), 3000);
        }
    }, [restaurants, stage]);

    return (
        <>
            <form className='field' ref={formRef} onSubmit={handleChange}>
                {stages[stage].header}
                {stages[stage].body}
                {stages[stage].inputs}
                <div>
                    {stages[stage].submit}
                </div>
            </form>
            <div className='disable-all' />
            <div className="restaurant new-restaurant">
                <img className="restaurant-image" src={imageUrl} alt={input.name} />
                <div className="restaurant-content">
                    <div className='restaurant-content-main'>
                        <nav className='main-navbar'>
                            <span className='activeSection main-navlink'>Overview</span>
                            <span className='main-navlink'>Review</span>
                        </nav>
                        <section className='overview'>
                            <h1 className='overview-name'>{input.name}</h1>
                            <div className='overview-labels'>
                                <div className='cuisine-label'>
                                    <FontAwesomeIcon icon={faHouse} 
                                        className='ep-blue overview-label-icon' />
                                    {input.neighborhoodId > 0 ? neighborhoodSlice[input.neighborhoodId]?.name : '?'}
                                </div>
                                <div className='price-range-label'>
                                    <FontAwesomeIcon icon={faMoneyBill1} 
                                        className='overview-label-icon' />
                                    {input.priceRange > 0 ? priceRange[input.priceRange] : '?'}
                                </div>
                                <div className='cuisine-label'>
                                    <FontAwesomeIcon icon={faUtensils} 
                                        className='ep-blue overview-label-icon' />
                                    {input.cuisineId > 0 ? cuisineSlice[input.cuisineId]?.name : '?'}
                                </div>
                            </div>
                            <div className='overview-bio'>{input.bio}</div>
                        </section>
                    </div>
                    <div className='restaurant-content-side'>
                        <ReservationSide />
                        <MapSide address={input.address} />
                    </div>
                </div>
            </div>
        </>
    );
}