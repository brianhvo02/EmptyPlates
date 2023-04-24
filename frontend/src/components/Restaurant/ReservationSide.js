import './ReservationSide.css';

import { useEffect, useRef, useState } from 'react';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Calendar } from './Calendar';
import { convertRemToPixels } from '../../utils';

export default function ReservationSide() {
    // eslint-disable-next-line
    const dropdowns = {
        partySize: useRef(),
        date: useRef(),
        time: useRef()
    }

    const date = new Date();
    const hour = date.getHours();
    const minutes = date.getMinutes();
    const nearestHalfHour = new Date(`${date.toLocaleDateString()} ${hour + (minutes < 30 ? 0 : 1)}:${minutes < 30 ? 30 : 0}`);

    const [reservation, setReservation] = useState({
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
    
    const toggleDropdown = e => setShowDropdown({ ...emptyDropdown, [e.currentTarget.id]: !showDropdown[e.currentTarget.id] });

    const handleDropdownClick = e => {
        const id = e.currentTarget.id;
        const value = id === 'partySize' ? parseInt(e.target.dataset.value) : 
            id === 'date' ? e.target.dataset.value : e.target.innerText;
        if (!value) return;
        setReservation(prev => ({ ...prev, [id]: value }));
        setShowDropdown({ ...emptyDropdown });
    }

    return (
        <section className='side-reservation'>
            <h1 className='reservation-heading'>Make a reservation</h1>
            <div className='reservation-dropdown-container'>
                <label className='reservation-dropdown-label'>Party Size</label>
                <div className='reservation-dropdown-party-size' id='partySize' onClick={toggleDropdown}>
                    <p className='reservation-dropdown-content'>
                        {reservation.partySize} {reservation.partySize === 1 ? 'person' : 'people'}
                    </p>
                    <FontAwesomeIcon className='reservation-down-chevron' icon={faChevronDown} />
                </div>
                <div className='party-size-dropdown' ref={dropdowns.partySize} id='partySize' onClick={handleDropdownClick}>
                    {
                    Array.from(Array(20).keys()).map(i => 
                    <p key={`party-size-dropdown-${i}`} data-value={i + 1} className={
                        `dropdown-option${reservation.partySize === (i + 1)
                            ? ' dropdown-selected' : ''}`
                        }>{i + 1} {i === 0 ? 'person' : 'people'}</p>)
                    }
                </div>
                <div className='datetime-unit'>
                    <label className='reservation-datetime-label'>Date</label>
                    <label className='reservation-datetime-label'>Time</label>
                </div>
                <div className='reservation-dropdown-datetime'>
                    <div className='reservation-dropdown' id='date' onClick={toggleDropdown}>
                        <p className='reservation-dropdown-content'>
                            {reservation.date}
                        </p>
                        <FontAwesomeIcon className='reservation-down-chevron' icon={faChevronDown} />
                    </div>
                    <div className='reservation-dropdown' id='time' onClick={toggleDropdown}>
                        <p className='reservation-dropdown-content'>
                            {reservation.time}
                        </p>
                        <FontAwesomeIcon className='reservation-down-chevron' icon={faChevronDown} />
                    </div>
                </div>
                <Calendar
                    reservationDate={reservation.date} 
                    dateRef={dropdowns.date} 
                    handleDropdownClick={handleDropdownClick} />
                <div className='time-dropdown' ref={dropdowns.time} id='time' onClick={handleDropdownClick}>
                    {
                        Array.from(Array(48).keys()).map(i => {
                            const time = new Date(`0 ${Math.floor(i / 2)}:${i % 2 === 1 ? 30 : '00'}`)
                                .toLocaleTimeString('en-US', { 
                                    hour: '2-digit', 
                                    minute: '2-digit' 
                                });

                            return <p key={`time-dropdown-${i}`} className={
                                `dropdown-option${reservation.time === time
                                    ? ' dropdown-selected' : ''}`
                                }>
                                {time}
                            </p>
                        })
                    }
                </div>
                <button className='reservation-button'>Find a time</button>
            </div>
        </section>
    )
}