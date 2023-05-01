import './index.css';
import './AuthModal.css';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { login, useSession } from '../../store/sessionSlice';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faX } from '@fortawesome/free-solid-svg-icons';
import { createReservation, signUp } from '../../store/userSlice';
import { useNeighborhoods } from '../../store/neighborhoodSlice';
import { useClearErrorsOnUnmount } from '../../store/errorSlice';

export default function MiniSignUpModal({ restaurant, reservation, closeModal }) {
    useClearErrorsOnUnmount();
    const errors = useSelector(state => state.errors.user);
    const users = useSelector(state => Object.values(state.entities.users))
    const dispatch = useDispatch();
    const { isLoggedIn } = useSession();

    const [continueState, setContinueState] = useState(0);

    const modalRef = useRef();

    const [input, setInput] = useState({
        email: '',
        phoneNumber: '',
        firstName: '',
        lastName: '',
        password: '',
        neighborhoodId: 0,
        isOwner: false,
        isGuest: true
    });

    useEffect(() => setInput(prev => ({
        ...prev,
        neighborhoodId: restaurant?.neighborhood?.id
    })), [restaurant])

    const handleFormSubmit = e => {
        e.preventDefault();

        dispatch(signUp(input));
    }

    const handleInputChange = e => {
        setInput(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    }

    useEffect(() => {
        if (isLoggedIn) closeModal();
    }, [isLoggedIn]);

    useEffect(() => {
        setTimeout(() => modalRef.current && modalRef.current.classList.add('modal-show'), 100);
    }, [modalRef]);

    const userReservationCount = useRef();
    const registrationRef = useRef(false);
    useEffect(() => {
        const user = users.find(user => user.email === input.email);
        if (!registrationRef.current && user) {
            setContinueState(1);
            registrationRef.current = true;
            userReservationCount.current = user.reservations ? Object.values(user.reservations).length : 0;
            reservation.dinerId = user.id;
            dispatch(createReservation(reservation));
        }
    }, [users, registrationRef]);

    const reservationRef = useRef(false);
    useEffect(() => {
        const user = users.find(user => (user.reservations ? Object.values(user.reservations).length : 0) > userReservationCount.current);
        if (!reservationRef.current && user) {
            setContinueState(2);
            reservationRef.current = true;
        }
    }, [users, reservationRef])

    return (
        <div className='modal-container'>
            <form className='modal' ref={modalRef} onSubmit={handleFormSubmit}>
            {
                continueState === 0 ? (
                    <>
                        <h1 className='form-header'>More info for your reservation</h1>
                        <div className='errors'>
                            {errors.map((error, i) => <p className='error' key={i}>{error}</p>)}
                        </div>
                        <input placeholder='First Name' name='firstName' value={input.firstName} 
                            className='form-input' onChange={handleInputChange} />
                        <input placeholder='Last Name' name='lastName' value={input.lastName} 
                            className='form-input' onChange={handleInputChange} />
                        <input placeholder='Email' name='email' value={input.email} 
                            className='form-input' onChange={handleInputChange} />
                        <input placeholder='Phone Number' name='phoneNumber' value={input.phoneNumber} 
                            className='form-input' onChange={handleInputChange} />
                        <button className='form-input'>Continue</button>
                    </>
                ) : continueState === 1 ? (
                    <>
                        <h1>Waiting for your reservation to be made...</h1>
                    </>
                ) : (
                    <>
                        <FontAwesomeIcon className='modal-exit' onClick={() => closeModal(modalRef)} icon={faX} />
                        <h1>Reservation successful.</h1>
                        <p>
                            Check your email for a confirmation of your reservation.
                            Thanks for using EmptyPlates!
                        </p>
                    </>
                )
            }
            </form>
        </div>
    )
}