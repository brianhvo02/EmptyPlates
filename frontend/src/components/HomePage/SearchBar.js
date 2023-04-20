import './SearchBar.css';
import { useState } from 'react';
import { faChevronDown, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
import { faCalendar, faClock, faUser } from '@fortawesome/free-regular-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function SearchBar() {
    const [searchDate, setSearchDate] = useState(new Date());
    const [searchPeople, setSearchPeople] = useState(2);

    return (
        <div className='searchbar'>
            <h1 className='searchbar-header'>Has someone set out plates for you?</h1>
            <div className='searchbar-bar'>
                <div className='searchbar-bar-dropdown-container'>
                    <div className='searchbar-bar-dropdown'>
                        <FontAwesomeIcon icon={faCalendar} />
                        <p className='searchbar-bar-dropdown-content'>
                            {searchDate.toLocaleDateString('en-US', { 
                                month: 'short', 
                                day: '2-digit', 
                                year: 'numeric' 
                            })}
                        </p>
                        <FontAwesomeIcon className='down-chevron' icon={faChevronDown} />
                    </div>
                    <div className='searchbar-bar-dropdown'>
                        <FontAwesomeIcon icon={faClock} />
                        <p className='searchbar-bar-dropdown-content'>
                            {searchDate.toLocaleTimeString('en-US', { 
                                hour: '2-digit', 
                                minute: '2-digit' 
                            })}
                        </p>
                        <FontAwesomeIcon className='down-chevron' icon={faChevronDown} />
                    </div>
                    <div className='searchbar-bar-dropdown'>
                        <FontAwesomeIcon icon={faUser} />
                        <p className='searchbar-bar-dropdown-content'>
                            {searchPeople} people
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