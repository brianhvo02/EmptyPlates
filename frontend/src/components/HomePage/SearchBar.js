import './SearchBar.css';
import { useEffect, useMemo, useRef, useState } from 'react';
import { faChevronDown, faMagnifyingGlass, faMapPin, faShop, faUtensils } from '@fortawesome/free-solid-svg-icons'
import { faCalendar, faClock, faUser } from '@fortawesome/free-regular-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { fetchSearch, setParams, useReservationSearchSlice } from '../../store/reservationSearchSlice';
import { convertRemToPixels } from '../../utils';
import { Calendar } from '../Restaurant/Calendar';
import { useDispatch } from 'react-redux';
import { useCuisines } from '../../store/cuisineSlice';
import { restaurantUrl, useRestaurants } from '../../store/restaurantSlice';
import { useNeighborhoodSlice, useNeighborhoods } from '../../store/neighborhoodSlice';
import _ from 'lodash';
import { useLocation, useNavigate } from 'react-router-dom';

export default function SearchBar() {
    const search = useReservationSearchSlice();
    const dispatch = useDispatch();
    const cuisines = useCuisines();
    const restaurants = useRestaurants();
    const neighborhoods = useNeighborhoods();
    const neighborhoodSlice = useNeighborhoodSlice();

    const searchArrays = {
        restaurants,
        neighborhoods,
        cuisines,
    }

    const dropdowns = {
        partySize: useRef(),
        date: useRef(),
        time: useRef()
    }

    const emptyDropdown = Object.freeze({
        partySize: false,
        date: false,
        time: false
    });

    const [showDropdown, setShowDropdown] = useState({ ...emptyDropdown });

    useEffect(() => {
        if (Object.values(dropdowns).every(ref => ref.current) && showDropdown) {
            Object.entries(dropdowns).forEach(([name, element]) => {
                element.current.classList[showDropdown[name] ? 'add' : 'remove']('dropdown-show');
                element.current.scrollTo(0, 
                    Array.from(document.querySelector(`.${name === 'partySize' ? 'party-size' : name}-dropdown`).children)
                        .findIndex(option => 
                            option.classList.contains('dropdown-selected')
                        ) * convertRemToPixels(1.875)
                );
            });
        }
    }, [dropdowns, showDropdown]);

    const toggleDropdown = e => setShowDropdown({ ...emptyDropdown, [e.currentTarget.dataset.type]: !showDropdown[e.currentTarget.dataset.type] });

    const handleDropdownClick = e => {
        const id = e.currentTarget.id;
        const value = id === 'partySize' ? parseInt(e.target.dataset.value) : 
            id === 'date' ? e.target.dataset.value : e.target.innerText;
        if (!value) return;
        dispatch(setParams({ [id]: value }));
        setShowDropdown({ ...emptyDropdown });
    }

    const [searchResults, setSearchResults] = useState({});

    const handleSearch = e => {
        const query = e.target.value;
        dispatch(setParams({ query }));
        const searchStrings = query.split(' ');
        
        const results = Object.keys(searchArrays).reduce((acc, key) => {
            acc[key] = searchArrays[key].filter(searchArray => {
                for (let i in searchStrings) {
                    if (searchArray.name.toLowerCase().includes(searchStrings[i].toLowerCase())) return true;
                }
                return false;
            });
            return acc;
        }, {});

        setSearchResults(results);
    }

    const searchBarRef = useRef();

    const navigate = useNavigate();

    const handleClick = e => {
        const type = e.currentTarget.dataset.type;
        const id = e.currentTarget.dataset.id;

        if (type === 'restaurants') {
            navigate(restaurantUrl(id));
        } else {
            navigate(`/search?${type}=${id}`);
        }
    }

    const [focused, setFocused] = useState(false);
    const onFocus = () => setFocused(true);
    const onBlur = () => setFocused(false)

    const { pathname } = useLocation();

    return (
        <div className='searchbar'>
            <h1 className='searchbar-header' hidden={pathname.includes('search')}>Has someone set out plates for you?</h1>
            <div className='searchbar-bar'>
                <div className='searchbar-bar-dropdown-container'>
                    <div className='searchbar-bar-dropdown' data-type='date' onClick={toggleDropdown}>
                        <FontAwesomeIcon icon={faCalendar} />
                        <p className='searchbar-bar-dropdown-content'>
                            {search.date}
                        </p>
                        <FontAwesomeIcon className='down-chevron' icon={faChevronDown} />
                        <Calendar
                            reservationDate={search.date} 
                            dateRef={dropdowns.date} 
                            handleDropdownClick={handleDropdownClick} />
                    </div>
                    <div className='searchbar-bar-dropdown' data-type='time' onClick={toggleDropdown}>
                        <FontAwesomeIcon icon={faClock} />
                        <p className='searchbar-bar-dropdown-content'>
                            {search.time}
                        </p>
                        <FontAwesomeIcon className='down-chevron' icon={faChevronDown} />
                        <div className='time-dropdown' ref={dropdowns.time} id='time' onClick={handleDropdownClick}>
                            {
                                Array.from(Array(48).keys()).map(i => {
                                    const time = new Date(`0 ${Math.floor(i / 2)}:${i % 2 === 1 ? 30 : '00'}`)
                                        .toLocaleTimeString('en-US', { 
                                            hour: '2-digit', 
                                            minute: '2-digit' 
                                        });

                                    if (new Date(`${search.date} ${time}`) < new Date()) return null;

                                    return <p key={`time-dropdown-${i}`} className={
                                        `dropdown-option${search.time === time
                                            ? ' dropdown-selected' : ''}`
                                        }>
                                        {time}
                                    </p>
                                })
                            }
                        </div>
                    </div>
                    <div className='searchbar-bar-dropdown' data-type='partySize' onClick={toggleDropdown}>
                        <FontAwesomeIcon icon={faUser} />
                        <p className='searchbar-bar-dropdown-content'>
                            {search.partySize} {search.partySize === 1 ? 'person' : 'people'}
                        </p>
                        <FontAwesomeIcon className='down-chevron' icon={faChevronDown} />
                        <div className='party-size-dropdown' ref={dropdowns.partySize} id='partySize' onClick={handleDropdownClick}>
                            {
                            Array.from(Array(20).keys()).map(i => 
                            <p key={`party-size-dropdown-${i}`} data-value={i + 1} className={
                                `dropdown-option${search.partySize === (i + 1)
                                    ? ' dropdown-selected' : ''}`
                                }>{i + 1} {i === 0 ? 'person' : 'people'}</p>)
                            }
                        </div>
                    </div>
                </div>
                <div className='searchbar-bar-search'>
                    <FontAwesomeIcon icon={faMagnifyingGlass} />
                    <input 
                        type='text' className='search-input'
                        placeholder='Location, Restaurant, or Cuisine' 
                        value={search.query} onChange={handleSearch}
                        ref={searchBarRef} onFocus={onFocus} onBlur={onBlur}
                        onKeyDown={e => e.key === 'Enter' && navigate(`/search?query=${search.query}`)}
                    />
                    { 
                        search.query && focused &&
                        <ol className='search-dropdown'>
                            <li onMouseDown={() => navigate(`/search?query=${search.query}`)}>
                                <span>Search: {search.query}</span>
                            </li>
                            {
                                Object.keys(searchArrays).map(key =>
                                    <div key={key}>
                                        <li className='search-headers'>
                                            <FontAwesomeIcon icon={
                                                key === 'restaurants'
                                                    ? faShop
                                                    : key === 'neighborhoods'
                                                        ? faMapPin
                                                        : (key === 'cuisines' && faUtensils)
                                            } />
                                            <span>{key[0].toUpperCase() + key.slice(1)}</span>
                                        </li>
                                        {
                                            searchResults[key]?.slice(0, 5).map(res => 
                                                <li key={`${key}_${res.id}`} 
                                                    data-type={key} 
                                                    data-id={key === 'restaurants' ? res.urlId : res.id}
                                                    onMouseDown={handleClick}
                                                >
                                                    <span>
                                                        {res.name} {
                                                            key === 'restaurants' && 
                                                                `(${
                                                                    neighborhoodSlice[
                                                                        res.neighborhoodId
                                                                    ].name
                                                                })`
                                                        }
                                                    </span>
                                                </li>
                                            )
                                        }
                                    </div>
                                )
                            }
                        </ol>
                    }
                </div>
                <button className='searchbar-bar-button' onClick={() => navigate(`/search?query=${search.query}`)}>Let's go!</button>
            </div>
        </div>
    )
}