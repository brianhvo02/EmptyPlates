import './ReservationSide.css';

import { useEffect, useMemo, useRef, useState } from 'react';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Calendar } from './Calendar';
import { convertRemToPixels } from '../../utils';
import { useSession } from '../../store/sessionSlice';
import { useDispatch, useSelector } from 'react-redux';
import { createReservation } from '../../store/userSlice';
import { useClearErrorsOnUnmount } from '../../store/errorSlice';
import { createPortal } from 'react-dom';
import MiniSignUpModal from '../Modal/MiniSignUpModal';
import { updateReservation } from '../../store/userSlice';
import { useNavigate } from 'react-router-dom';
import { reservationUrl } from '../../store/reservationSlice';

export default function ReservationSide({ 
    id,
    availableTables: availableTablesRaw, 
    reservations, 
    neighborhood,
    defaultPartySize,
    defaultDate,
    defaultTime,
}) {
    useClearErrorsOnUnmount();
    const { currentUser, isLoggedIn } = useSession();
    const userErrors = useSelector(state => state.errors.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // eslint-disable-next-line
    const dropdowns = {
        partySize: useRef(),
        date: useRef(),
        time: useRef()
    }

    const availableTables = useMemo(() => Object.fromEntries(
        Object.values(availableTablesRaw ? availableTablesRaw : [])
            .map(table => [table.seats, table])
    ), [availableTablesRaw]);

    const [currentReservation, setCurrentReservation] = useState({
        partySize: defaultPartySize,
        date: defaultDate,
        time: defaultTime
    });

    const currentDate = useMemo(() => new Date([currentReservation.date, currentReservation.time].join(' ')), [currentReservation]);

    const emptyDropdown = Object.freeze({
        partySize: false,
        date: false,
        time: false
    });

    const [showDropdown, setShowDropdown] = useState({ ...emptyDropdown });
    const [availableTablesParty, setAvailableTables] = useState();
    const [currentAvailableTable, setCurrentAvailableTable] = useState();
    const [showMiniSignUpModal, setShowMiniSignUpModal] = useState(false);

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
        setCurrentReservation(prev => ({ ...prev, [id]: value }));
        setShowDropdown({ ...emptyDropdown });
    }

    const handleSubmit = () => {
        const availableTablesParty = availableTables?.[currentReservation.partySize];

        if (!availableTablesParty) return setAvailableTables([]);
        const count = (reservations ? Object.values(reservations) : []).reduce((acc, reservation) =>
            reservation.availableTableId === availableTablesParty.id 
                && new Date(new Date(currentDate.getTime() + 3600000)) >= new Date(reservation.datetime * 1000)
                && new Date(new Date(currentDate.getTime() - 3600000)) <= new Date(reservation.datetime * 1000)
                ? acc + 1
                : acc, 0
        );

        if (count >= availableTablesParty.tables) return setAvailableTables([]);

        setCurrentAvailableTable(availableTablesParty.id)

        setAvailableTables([
            currentDate.getTime() - 2700000,
            currentDate.getTime() - 900000,
            currentDate.getTime(),
            currentDate.getTime() + 900000,
            currentDate.getTime() + 2700000
        ]);
    }

    const [reservation, setReservation] = useState();

    // const currentUserReservationCount = useRef();

    // useEffect(() => {
    //     if (reservation && currentUser && userErrors?.length === 0 && currentUser.reservations.length > currentUserReservationCount.current) {
    //         currentUserReservationCount.current = currentUser.reservations.length;
    //         setShowMiniSignUpModal(true);
    //     }
    // }, [reservation, currentUser, userErrors]);

    // useEffect(() => {
    //     if (currentUser && !currentUserReservationCount.current) {
    //         currentUserReservationCount.current = currentUser.reservations.length;
    //     }
    // }, [currentUser, currentUserReservationCount]);

    const handleReservation = e => {
        const reservation = {
            id,
            datetime: new Date(parseInt(e.target.dataset.value)).toISOString(),
            dinerId: currentUser?.id,
            availableTableId: currentAvailableTable
        }

        setReservation(reservation);

        if (isLoggedIn) {
            dispatch((id ? updateReservation : createReservation)(reservation))
                .then(reservationId => reservationId && (id ? setShowMiniSignUpModal(true) : navigate(reservationUrl(reservationId))))
        } else {
            setShowMiniSignUpModal(true);
        }
    }

    return (
        <section className='side-reservation'>
            {showMiniSignUpModal && createPortal(
                <MiniSignUpModal neighborhood={neighborhood} closeModal={modalRef => {
                    modalRef?.current.classList.remove('modal-show');
                    setTimeout(() => setShowMiniSignUpModal(false), 300);
                }} reservation={reservation} defaultState={isLoggedIn ? 2 : 0} />,
                document.body
            )}
            <h1 className='reservation-heading'>{id ? 'Make a change to your reservation' : 'Make a reservation'}</h1>
            <div className='reservation-dropdown-container'>
                <label className='reservation-dropdown-label'>Party Size</label>
                <div className='reservation-dropdown-party-size' id='partySize' onClick={toggleDropdown}>
                    <p className='reservation-dropdown-content'>
                        {currentReservation.partySize} {currentReservation.partySize === 1 ? 'person' : 'people'}
                    </p>
                    <FontAwesomeIcon className='reservation-down-chevron' icon={faChevronDown} />
                </div>
                <div className='party-size-dropdown' ref={dropdowns.partySize} id='partySize' onClick={handleDropdownClick}>
                    {
                    Array.from(Array(20).keys()).map(i => 
                    <p key={`party-size-dropdown-${i}`} data-value={i + 1} className={
                        `dropdown-option${currentReservation.partySize === (i + 1)
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
                            {currentReservation.date}
                        </p>
                        <FontAwesomeIcon className='reservation-down-chevron' icon={faChevronDown} />
                    </div>
                    <div className='reservation-dropdown' id='time' onClick={toggleDropdown}>
                        <p className='reservation-dropdown-content'>
                            {currentReservation.time}
                        </p>
                        <FontAwesomeIcon className='reservation-down-chevron' icon={faChevronDown} />
                    </div>
                </div>
                <Calendar
                    reservationDate={currentReservation.date} 
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
                                `dropdown-option${currentReservation.time === time
                                    ? ' dropdown-selected' : ''}`
                                }>
                                {time}
                            </p>
                        })
                    }
                </div>
                <button onClick={handleSubmit} className='reservation-button'>Find a time</button>
                {availableTablesParty?.length > 0 ? (
                    <div className='reservation-time-select'>
                        {userErrors.map((error, i) => <p key={`error_${i}`}>{error}</p>)}
                        <h2>Select a time</h2>
                        <ul>
                            {
                                availableTablesParty?.map((availableTable) => 
                                    <li key={availableTable} data-value={availableTable} onClick={handleReservation}>{
                                        new Date(availableTable).toLocaleTimeString('en-US', {
                                            hour: '2-digit', 
                                            minute: '2-digit' 
                                        })
                                    }</li>
                                )
                            }
                        </ul>
                    </div>
                ) : availableTablesParty ? <p>No tables available!</p> : null}
            </div>
        </section>
    )
}