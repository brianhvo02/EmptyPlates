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
import { setParams } from '../../store/reservationSearchSlice';
import LoadingModal from '../Modal/LoadingModal';

export default function ReservationSide({ 
    id,
    availableTables, 
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
    
    const toggleDropdown = e => setShowDropdown({ ...emptyDropdown, [e.currentTarget.dataset.type]: !showDropdown[e.currentTarget.dataset.type] });

    const handleDropdownClick = e => {
        const targetId = e.currentTarget.id;
        const value = targetId === 'partySize' ? parseInt(e.target.dataset.value) : 
            targetId === 'date' ? e.target.dataset.value : e.target.innerText;
        if (!value) return;
        setCurrentReservation(prev => ({ ...prev, [targetId]: value }));
        !id && dispatch(setParams({ [targetId]: value }));
        setShowDropdown({ ...emptyDropdown });
    }

    const currentParty = useMemo(() => availableTables?.[currentReservation.partySize], [availableTables, currentReservation]);

    const availableReservations = useMemo(() => 
        currentParty && Object.values(currentParty.reservations).reduce(
            (sum, reservation) => 
                new Date(new Date(currentDate.getTime() + 3600000)) >= new Date(reservation.datetime)
                    && 
                new Date(new Date(currentDate.getTime() - 3600000)) <= new Date(reservation.datetime)
                ? sum + 1
                : sum, 0
        ) < currentParty.tables, [currentParty, currentDate]);

    const handleSubmit = () => {
        if (!currentParty || !availableReservations || new Date(`${currentReservation.date} ${currentReservation.time}`).getTime() + 2700000 < new Date()) return setAvailableTables([]);
        setCurrentAvailableTable(currentParty.id);
        setAvailableTables([
            currentDate.getTime() - 2700000,
            currentDate.getTime() - 900000,
            currentDate.getTime(),
            currentDate.getTime() + 900000,
            currentDate.getTime() + 2700000
        ]);
    }

    const [reservation, setReservation] = useState();

    const handleReservation = e => {
        setLoading(true);
        const reservation = {
            id,
            datetime: new Date(parseInt(e.target.dataset.value)).toISOString(),
            dinerId: currentUser?.id,
            availableTableId: currentAvailableTable
        }

        setReservation(reservation);

        if (isLoggedIn) {
            dispatch((id ? updateReservation : createReservation)(reservation))
                .then(reservationId => reservationId ? (id ? () => {
                    setLoading(false);
                    setShowMiniSignUpModal(true);
                } : navigate(reservationUrl(reservationId)))
                : setLoading(false))
        } else {
            setLoading(false);
            setShowMiniSignUpModal(true);
        }
    }

    const [loading, setLoading] = useState(false);

    return (
        <section className='side-reservation'>
            {showMiniSignUpModal && createPortal(
                <MiniSignUpModal neighborhood={neighborhood} closeModal={modalRef => {
                    modalRef?.current.classList.remove('modal-show');
                    setTimeout(() => setShowMiniSignUpModal(false), 300);
                }} reservation={reservation} defaultState={isLoggedIn ? 2 : 0} />,
                document.body
            )}
            {loading && createPortal(
                <LoadingModal />,
                document.body
            )}
            <h1 className='reservation-heading'>{id ? 'Make a change to your reservation' : 'Make a reservation'}</h1>
            <div className='reservation-dropdown-container'>
                <label className='reservation-dropdown-label'>Party Size</label>
                <div className='reservation-dropdown-party-size' data-type='partySize' onClick={toggleDropdown}>
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
                    <div className='reservation-dropdown' data-type='date' onClick={toggleDropdown}>
                        <p className='reservation-dropdown-content'>
                            {currentReservation.date}
                        </p>
                        <FontAwesomeIcon className='reservation-down-chevron' icon={faChevronDown} />
                    </div>
                    <div className='reservation-dropdown' data-type='time' onClick={toggleDropdown}>
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
                                
                            if (new Date(`${currentReservation.date} ${time}`).getTime() + 2700000 < new Date()) return null;

                            return (
                                <p key={`time-dropdown-${i}`} className={
                                    `dropdown-option${currentReservation.time === time
                                        ? ' dropdown-selected' : ''}`
                                    }>
                                    {time}
                                </p>
                            )
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