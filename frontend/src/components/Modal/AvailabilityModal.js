import { useEffect, useRef, useState } from 'react';
import './AvailabilityModal.css';
import { createAvailableTable, useRestaurant } from '../../store/restaurantSlice';
import { useDispatch } from 'react-redux';

export default function AvailabilityModal({ closeModal }) {
    const modalRef = useRef();
    const dispatch = useDispatch();
    const { restaurant } = useRestaurant();

    useEffect(() => {
        setTimeout(() => !modalRef.current || modalRef.current.classList.add('modal-show'), 100);
    }, [modalRef]);

    const [allTables, setAllTables] = useState(restaurant.availableTables || {});
    const [seats, setSeats] = useState(1);
    const [tables, setTables] = useState(0);

    const handleSubmit = e => {
        e.preventDefault();

        setAllTables(prev => {
            const table = prev[seats];

            return {
                ...prev,
                [seats]: {
                    ...table,
                    seats,
                    tables
                }
            }
        });
    }

    return (
        <div className='modal-container'>
            <div className='modal' ref={modalRef}>
                <h1>{restaurant.name} Availability</h1>
                <div className='availability-container'>
                    <h2>Available Tables</h2>
                    <ul className='current-availability'>
                        {
                            Object.values(allTables).map(({seats, tables}) => 
                                tables > 0 ?
                                    <li key={seats}>
                                        <p>{seats} seat{seats > 1 ? 's' : ''}</p>
                                        <p>{tables} table{tables > 1 ? 's' : ''}</p>
                                    </li>
                                : null
                            )
                        }
                    </ul>
                    <form onSubmit={handleSubmit} className='availability-form'>
                        <label>
                            How many seats are at this table?
                            <input min={1} value={seats} type='number'
                                onChange={e => setSeats(parseInt(e.target.value))} />
                        </label>
                        <label>
                            How many {seats}-seater tables are there?
                            <input min={0} value={tables} type='number'
                                onChange={e => setTables(parseInt(e.target.value))} />
                        </label>
                        <button className='reservation-button'>Add Table</button>
                    </form>
                </div>
                <button className='reservation-button reservation-edit' 
                    onClick={() => dispatch(
                        createAvailableTable(
                            restaurant.id,
                            Object.values(allTables)
                        )
                    )}
                    >
                    Change availability
                </button>
                <button className='reservation-button reservation-delete' 
                    onClick={() => closeModal(modalRef)}>
                    Discard changes
                </button>
            </div>
        </div>
    )
}