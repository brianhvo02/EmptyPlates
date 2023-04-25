import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useAuth, useMaps } from '../../utils';
import './NewRestaurant.css';

import grayBackground from './gray.png';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { faMessage } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import MapSide from './MapSide';
import ReservationSide from './ReservationSide';
import { Loader } from '@googlemaps/js-api-loader';
import { useNeighborhood } from '../../store/neighborhoodSlice';

export default function NewRestaurantPage() {
    useAuth();
    const { neighborhoods } = useNeighborhood();

    const emptyForm = Object.freeze({
        header: <></>,
        body: <></>,
        inputs: <></>,
        submit: <></>
    });

    const formRef = useRef();

    const [stage, setStage] = useState(0);
    const [input, setInput] = useState({
        name: '',
        address: '',
        neighborhood: {}
    });

    const handleChange = e => {
        if (e) e.preventDefault();
        if (e && stage === 3) return;
        formRef.current.style.opacity = 0;
        setTimeout(() => setStage(prev => prev + 1), 300);
    }

    const { ref } = useMaps({
        stage,
        neighborhoods,
        address: input.address,
        nearestNeighborhoodListener: useCallback(nearestNeighborhood => setInput(prev => ({ ...prev, neighborhood: nearestNeighborhood })), []),
        autoCompleteListener: useCallback(address => {
            setInput(prev => ({ ...prev, address }));
            handleChange();
        }, [])
    });

    const handleInputChange = e => setInput(prev => ({ ...prev, [e.target.name]: e.target.value }));

    const handleYesNo = e => {
        if (e.target.textContent === 'No') {
            
        } else {
            handleChange();
        }
    }

    const stages = useMemo(() => [
        {
            ...emptyForm,
            header: <h1>EmptyPlates Restaurant Editor</h1>,
            body: <p>Welcome to the EmptyPlates Restaurant Editor, where you can add a new restaurant 
                to our platform. You must be approved as an owner to gain access this page, so 
                if you're here then you must own a restaurant!<br />With our restaurant editor, you can 
                setup a page for patrons to learn more about your restaurant or create availability 
                so you can have customers start making reservations. Click the button below to get 
                the process started.</p>,
            submit: <button>Sounds good to me!</button>
        },
        {
            ...emptyForm,
            header: <h1>Let's get started!</h1>
        },
        {
            ...emptyForm,
            header: <h1>First, give us the name of your restaurant.</h1>,
            inputs: <input name='name' placeholder='The Cheesecake Factory' value={input.name} onChange={handleInputChange} />,
            submit: <button>Continue</button>
        },
        {
            ...emptyForm,
            header: <h1>Where is your restaurant located?</h1>,
            inputs: 
            <>
                <input ref={ref} autoComplete='off' name='address' placeholder='251 Geary St 8th Floor, San Francisco, CA 94102' value={input.address} onChange={handleInputChange} />
            </>
        },
        {
            ...emptyForm,
            header: <h1>Based on what you gave us, is it accurate to say that your restaurant is in the <strong>{input.neighborhood.name}</strong> neighborhood?</h1>,
            submit: 
                <>
                    <button onClick={handleYesNo}>No</button>
                    <button onClick={handleYesNo}>Yes</button>
                </>
        }
    ], [input, emptyForm, ref]);

    // useEffect(() => {
    //     if (input.address.length > 0 && input.neighborhood.length === 0 && neighborhoods && pacRef.current) {
    //         const loader = new Loader({
    //             apiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    //             version: "weekly"
    //         });
              
    //         loader.load().then(async google => {
    //             try {
    //                 const { spherical } = await google.maps.importLibrary("geometry");
    //                 const { Geocoder } = await google.maps.importLibrary("geocoding");
    //                 const autocomplete = new google.maps.places.PlaceAutocompleteElement({ inputElement: pacRef });
    //                 const geocode = await new Geocoder().geocode({ address: input.address });
    //                 const position = geocode.results[0].geometry.location;
    //                 const nearestNeighborhood = neighborhoods.reduce((n, neighborhood) => 
    //                     spherical.computeDistanceBetween(
    //                         [n.latitude, n.longitude], position
    //                     ) < spherical.computeDistanceBetween(
    //                         [neighborhood.latitude, neighborhood.longitude], position
    //                     ) ? neighborhood : n
    //                 );
    
    //                 setInput(prev => ({ ...prev, neighborhood: nearestNeighborhood.name }));
    //             } catch(e) {
    //                 console.error('NeighborhoodLoader:', e.message)
    //             }
    //         });
    //     }
    // }, [input, neighborhoods, pacRef])

    // useEffect(() => {
        // if (pacRef.current && stage === 3) {
        //     const loader = new Loader({
        //         apiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
        //         version: "weekly"
        //     });
                
        //     loader.load().then(async google => {
        //         const { Autocomplete } = await google.maps.importLibrary("places");
        //         const autocomplete = new Autocomplete(pacRef.current, { types: ['address'] });
                // autocomplete.addListener('place_changed', () => {
                //     setInput(prev => ({ ...prev, address: autocomplete.getPlace().formatted_address }));
                //     handleChange();
                // });
        //     });
        // }
        // () => {
        //     setInput(prev => ({ ...prev, address: autocomplete.getPlace().formatted_address }));
        //     handleChange();
        // }
    // }, [pacRef, stage]);
    

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
                
                setTimeout(() => {
                    const p = formRef.current.querySelector('p');
                    if (p) p.style.opacity = 1;
                    formRef.current.querySelector('div').style.opacity = 1;
                    Array.from(formRef.current.querySelectorAll('input'))
                        .forEach(input => input.style.opacity = 1);
                }, 2000);
            }
        }
    }, [stage, formRef]);

    return (
        <>
            <div className='create-container'>
                <form className='field' ref={formRef} onSubmit={handleChange}>
                    {stages[stage].header}
                    {stages[stage].body}
                    {stages[stage].inputs}
                    <div>
                        {stages[stage].submit}
                    </div>
                </form>
            </div>
            <div className="restaurant new-restaurant">
                <img className="restaurant-image" src={grayBackground} alt={input.name} />
                <div className="restaurant-content">
                    <div className='restaurant-content-main'>
                        <nav className='main-navbar'>
                            <span className='activeSection main-navlink'>Overview</span>
                            <span className='main-navlink'>Review</span>
                        </nav>
                        <section className='overview'>
                            <h1 className='overview-name'>{input.name}</h1>
                            <div className='overview-labels'>
                                <div className='rating-label'>
                                    {Array.from(Array(5).keys()).map(i => 
                                        <FontAwesomeIcon key={`rating-${i}`} 
                                            icon={faStar} className='star-icon'
                                            style={{
                                                color: i < 3 
                                                    ? '#3795DA' 
                                                    : '#E1E1E1'
                                            }}
                                        />
                                    )}
                                    <span className='rating-label-text'>{(3).toFixed(1)}</span>
                                </div>
                                <div className='review-count-label'>
                                    <FontAwesomeIcon icon={faMessage} 
                                    className='overview-label-icon' />
                                    1000 Reviews
                                </div>
                                {/* <div className='price-range-label'>
                                    <FontAwesomeIcon icon={faMoneyBill1} 
                                    className='overview-label-icon' />
                                    {priceRange[restaurant.priceRange]}
                                </div> */}
                                {/* <div className='cuisine-label'>
                                    <FontAwesomeIcon icon={faUtensils} 
                                    className='ep-blue overview-label-icon' />
                                    {restaurant.cuisine}
                                </div> */}
                            </div>
                            {/* <div className='overview-bio'>{restaurant.bio}</div> */}
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