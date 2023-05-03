import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Calendar } from "./Calendar";
import { useEffect, useRef, useState } from "react";
import { convertRemToPixels } from "../../utils";

export default function DateTimeDropdowns({ date, time, setDateTime }) {
    // eslint-disable-next-line
    const dropdowns = {
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
    
    const toggleDropdown = e => setShowDropdown({ ...emptyDropdown, [e.currentTarget.id]: !showDropdown[e.currentTarget.id] });
    
    const handleDropdownClick = e => {
        const id = e.currentTarget.id;
        const value = id === 'partySize' ? parseInt(e.target.dataset.value) : 
            id === 'date' ? e.target.dataset.value : e.target.innerText;
        if (!value) return;
        setDateTime(prev => ({ ...prev, [id]: value }));
        setShowDropdown({ ...emptyDropdown });
    }

    return (
        <>
            <div className='datetime-unit'>
                <label className='reservation-datetime-label'>Date</label>
                <label className='reservation-datetime-label'>Time</label>
            </div>
            <div className='reservation-dropdown-datetime'>
                <div className='reservation-dropdown' id='date' onClick={toggleDropdown}>
                    <p className='reservation-dropdown-content'>
                        {date}
                    </p>
                    <FontAwesomeIcon className='reservation-down-chevron' icon={faChevronDown} />
                </div>
                <div className='reservation-dropdown' id='time' onClick={toggleDropdown}>
                    <p className='reservation-dropdown-content'>
                        {time}
                    </p>
                    <FontAwesomeIcon className='reservation-down-chevron' icon={faChevronDown} />
                </div>
            </div>
            <Calendar
                reservationDate={date} 
                dateRef={dropdowns.date} 
                handleDropdownClick={handleDropdownClick} />
            <div className='time-dropdown' ref={dropdowns.time} id='time' onClick={handleDropdownClick}>
                {
                    Array.from(Array(48).keys()).map(i => {
                        const timeDisplay = new Date(`0 ${Math.floor(i / 2)}:${i % 2 === 1 ? 30 : '00'}`)
                            .toLocaleTimeString('en-US', { 
                                hour: '2-digit', 
                                minute: '2-digit' 
                            });

                        return <p key={`time-dropdown-${i}`} className={
                            `dropdown-option${time === timeDisplay
                                ? ' dropdown-selected' : ''}`
                            }>
                            {timeDisplay}
                        </p>
                    })
                }
            </div>
        </>
    )
}