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

export default function MiniSignUpModal({ restaurant, reservation, closeModal, defaultState = 0 }) {
    useClearErrorsOnUnmount();
    const errors = useSelector(state => state.errors.user);
    // const users = useSelector(state => Object.values(state.entities.users))
    const dispatch = useDispatch();
    const { isLoggedIn } = useSession();

    const [continueState, setContinueState] = useState(defaultState);

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

        dispatch(signUp(input))
            .then(dinerId => dinerId && (() => {
                setContinueState(1);
                dispatch(createReservation({
                    ...reservation,
                    dinerId 
                })).then(status => status && setContinueState(2));
            })());
    }

    const handleInputChange = e => {
        setInput(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    }

    useEffect(() => {
        if (isLoggedIn && continueState < 2) closeModal();
    }, [isLoggedIn]);

    useEffect(() => {
        setTimeout(() => modalRef.current && modalRef.current.classList.add('modal-show'), 100);
    }, [modalRef]);

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