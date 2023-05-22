import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './Calendar.css';
import { faChevronCircleLeft, faChevronCircleRight } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState } from 'react';

const getFirstDay = date => {
    const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    return new Date(firstDayOfMonth.getTime() - 86400000 * firstDayOfMonth.getDay());
}

export function Calendar({reservationDate, dateRef, handleDropdownClick}) {
    const currentDate = new Date(new Date().toLocaleDateString() + ' 00:')
    const [calendarDate, setCalendarDate] = useState(new Date(reservationDate));
    const [firstDay, setFirstDay] = useState(getFirstDay(new Date(reservationDate)).getTime());

    const setDate = add =>
        setCalendarDate(prev => {
            if (add) {
                if (prev.getMonth() + 1 > 11) {
                    return new Date(prev.getFullYear() + 1, 0);
                } else {
                    return new Date(prev.getFullYear(), prev.getMonth() + 1);
                }
            } else {
                if (prev.getMonth() - 1 < 0) {
                    return new Date(prev.getFullYear() - 1, 11);
                } else {
                    return new Date(prev.getFullYear(), prev.getMonth() - 1);
                }
            }
        });

    useEffect(() => !calendarDate || setFirstDay(getFirstDay(calendarDate).getTime()), [calendarDate]);

    return (
        calendarDate && firstDay ?
        <div className='date-dropdown' ref={dateRef}>
            <div className='calendar-header'>
                <FontAwesomeIcon className='calendar-header-icon' icon={faChevronCircleLeft} 
                    onClick={() => setDate(false)}/>
                <h1 className='calendar-header-text'>{calendarDate.toLocaleDateString('en-US', { 
                    month: 'long', 
                    year: 'numeric' 
                })}</h1>
                <FontAwesomeIcon className='calendar-header-icon' icon={faChevronCircleRight} 
                    onClick={() => setDate(true)}/>
            </div>
            <div className='calendar-dates' id='date' onClick={e => handleDropdownClick(e)}>
                {Array.from(Array(7).keys()).map(i => <div key={`calendar-header-${i}`} className='calendar-date-name'>{new Date(0, 0, i).toLocaleDateString('en-US', { weekday: 'short' })}</div>)}
                {Array.from(Array(42).keys()).map(i => {
                    const date = new Date(firstDay + i * 86400000);
                    const dateString = date.toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: '2-digit', 
                        year: 'numeric' 
                    });
                    
                    return <div 
                        className={`calendar-date${reservationDate === dateString ? ' calendar-date-selected' : ''}`}
                        key={`calendar-date-${i}`}
                        data-value={ date < currentDate ? '' : dateString }
                        style={{
                            backgroundColor: date.getMonth() === calendarDate.getMonth() ? 'white' : '#f1f2f4'
                        }}
                        disabled={date < currentDate}>{date.getDate()}</div>
                })}
            </div>
        </div>
        : null
    )
}