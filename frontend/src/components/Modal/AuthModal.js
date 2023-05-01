import './index.css';
import './AuthModal.css';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { login, useSession } from '../../store/sessionSlice';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faX } from '@fortawesome/free-solid-svg-icons';
import { signUp } from '../../store/userSlice';
import { useNeighborhoods } from '../../store/neighborhoodSlice';
import { useClearErrorsOnUnmount } from '../../store/errorSlice';

export default function AuthModal({modal, closeModal}) {
    useClearErrorsOnUnmount();
    const sessionErrors = useSelector(state => state.errors.session);
    const userErrors = useSelector(state => state.errors.user);
    const errors = useMemo(() => sessionErrors?.concat(userErrors), [sessionErrors, userErrors]);
    const dispatch = useDispatch();
    const { isLoggedIn } = useSession();
    const neighborhoods = useNeighborhoods();

    const modalRef = useRef();

    const [input, setInput] = useState(Object.assign({
        email: '',
        password: '',
    }, modal === 'signup' ? {
        phoneNumber: '',
        firstName: '',
        lastName: '',
        isOwner: false,
        neighborhood_id: 0
    } : {}));

    const handleFormSubmit = function(e) {
        e.preventDefault();

        dispatch((modal === 'signin' ? login : signUp)(input))
    }

    const handleInputChange = function(e) {
        setInput(prev => {
            return {
                ...prev,
                [e.target.name]: e.target.value
            }
        });
    }

    const loginAsDemo = function() {
        dispatch(login({
            email: 'demo@emptyplates.com',
            password: 'Password123'
        }));
    }

    useEffect(() => {
        if (isLoggedIn) closeModal(modalRef);
    }, [isLoggedIn]);

    useEffect(() => {
        setTimeout(() => !modalRef.current || modalRef.current.classList.add('modal-show'), 100);
    }, [modalRef]);

    return (
        <div className='modal-container' onClick={e => e.target.classList.contains('modal-container') && closeModal(modalRef)}>
            <form className='modal' ref={modalRef} onSubmit={handleFormSubmit}>
                <FontAwesomeIcon className='modal-exit' onClick={() => closeModal(modalRef)} icon={faX} />
                <h1 className='form-header'>
                    {modal === 'signin' ? 'Sign in to your ' : 'Sign up for an '}<strong>EmptyPlates</strong>
                </h1>
                <div className='errors'>
                    {errors.map((error, i) => <p className='error' key={i}>{error}</p>)}
                </div>
                <input placeholder='Email' name='email' value={input.email} 
                    className='form-input' onChange={handleInputChange} />
                <input type='password' name='password' value={input.password} 
                    placeholder='Password' className='form-input'
                    onChange={handleInputChange} />
                {modal === 'signin' ? (<>
                    <p className='demo-input' onClick={() => loginAsDemo()}>
                        Sign in as <strong>DEMO USER</strong>
                    </p>
                </>) : (<>
                    <input placeholder='First Name' name='firstName' value={input.firstName} 
                        className='form-input' onChange={handleInputChange} />
                    <input placeholder='Last Name' name='lastName' value={input.lastName} 
                        className='form-input' onChange={handleInputChange} />
                    <input placeholder='Phone Number' name='phoneNumber' value={input.phoneNumber} 
                        className='form-input' onChange={handleInputChange} />
                    <select name="neighborhoodId" defaultValue='0' 
                        className='form-input' onChange={handleInputChange}>
                        <option value='0' disabled>Select a primary neighborhood</option>
                        {neighborhoods.map(neighborhood => <option key={neighborhood.id} value={neighborhood.id}>{neighborhood.name}</option>)}
                    </select>
                </>)}
                <button className='form-input'>{modal === 'signin' ? 'Log In' : 'Sign Up'}</button>
            </form>
        </div>
    )
}