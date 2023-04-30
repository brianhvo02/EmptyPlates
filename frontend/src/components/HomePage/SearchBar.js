import './SearchBar.css';
import { useState } from 'react';
import { faChevronDown, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
import { faCalendar, faClock, faUser } from '@fortawesome/free-regular-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function SearchBar() {
    // const dropdowns = {
    //     partySize: useRef(),
    //     date: useRef(),
    //     time: useRef()
    // }

    const date = new Date();
    const hour = date.getHours();
    const minutes = date.getMinutes();
    const nearestHalfHour = new Date(`${date.toLocaleDateString()} ${hour + (minutes < 30 ? 0 : 1)}:${minutes < 30 ? 30 : 0}`);

    const [reservation] = useState({
        partySize: 2,
        date: nearestHalfHour.toLocaleDateString('en-US', { 
            month: 'short', 
            day: '2-digit', 
            year: 'numeric' 
        }),
        time: nearestHalfHour.toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit' 
        })
    });

    // const emptyDropdown = Object.freeze({
    //     partySize: false,
    //     date: false,
    //     time: false
    // });

    // const [showDropdown, setShowDropdown] = useState({ ...emptyDropdown });

    // useEffect(() => {
    //     if (Object.values(dropdowns).every(ref => ref.current) && showDropdown) {
    //         Object.entries(dropdowns).forEach(([name, element]) => {
    //             element.current.classList[showDropdown[name] ? 'add' : 'remove']('dropdown-show');
    //             element.current.scrollTo(0, 
    //                 Array.from(document.querySelector(`.${name === 'partySize' ? 'party-size' : name}-dropdown`).children)
    //                     .findIndex(option => 
    //                         option.classList.contains('dropdown-selected')
    //                     ) * convertRemToPixels(1.875)
    //             );
    //         });
    //     }
    // }, [dropdowns, showDropdown]);
    
    // const toggleDropdown = e => setShowDropdown({ ...emptyDropdown, [e.currentTarget.id]: !showDropdown[e.currentTarget.id] });

    // const handleDropdownClick = e => {
    //     const id = e.currentTarget.id;
    //     const value = id === 'partySize' ? parseInt(e.target.dataset.value) : 
    //         id === 'date' ? e.target.dataset.value : e.target.innerText;
    //     if (!value) return;
    //     setReservation(prev => ({ ...prev, [id]: value }));
    //     setShowDropdown({ ...emptyDropdown });
    // }

    return (
        <div className='searchbar'>
            <h1 className='searchbar-header'>Has someone set out plates for you?</h1>
            <div className='searchbar-bar'>
                <div className='searchbar-bar-dropdown-container'>
                    <div className='searchbar-bar-dropdown'>
                        <FontAwesomeIcon icon={faCalendar} />
                        <p className='searchbar-bar-dropdown-content'>
                            {reservation.date}
                        </p>
                        <FontAwesomeIcon className='down-chevron' icon={faChevronDown} />
                    </div>
                    <div className='searchbar-bar-dropdown'>
                        <FontAwesomeIcon icon={faClock} />
                        <p className='searchbar-bar-dropdown-content'>
                            {reservation.time}
                        </p>
                        <FontAwesomeIcon className='down-chevron' icon={faChevronDown} />
                    </div>
                    <div className='searchbar-bar-dropdown'>
                        <FontAwesomeIcon icon={faUser} />
                        <p className='searchbar-bar-dropdown-content'>
                            {reservation.partySize} {reservation.partySize === 1 ? 'person' : 'people'}
                        </p>
                        <FontAwesomeIcon className='down-chevron' icon={faChevronDown} />
                    </div>
                </div>
                <div className='searchbar-bar-search'>
                    <FontAwesomeIcon icon={faMagnifyingGlass} />
                    <input type='text' className='search-input'
                        placeholder='Location, Restaurant, or Cuisine'></input>
                </div>
                <button className='searchbar-bar-button'>Search!</button>
            </div>
        </div>
    )
}