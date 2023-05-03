import { ReactComponent as Logo } from './logo.svg';
import './index.css';
import { logout } from '../../store/sessionSlice';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faLocationDot } from '@fortawesome/free-solid-svg-icons';
import { useMemo, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useRestaurant } from '../../store/restaurantSlice';
import { useCurrentUserRestaurants } from '../../store/userSlice';
import { useDispatch } from 'react-redux';
import AuthModal from '../Modal/AuthModal';
import { createPortal } from 'react-dom';

function Header() {
    const { currentUser, isLoggedIn, ownedRestaurants } = useCurrentUserRestaurants();
    const { pathname } = useLocation();
    const { neighborhood } = useRestaurant();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const dropdown = useRef();
    const isRestaurantEditor = useMemo(() => pathname.includes('new') || pathname.includes('edit'), [pathname]);

    const [modal, setModal] = useState();

    const handleProfileClick = () => {
        const classList = dropdown.current.classList;
        classList.contains('reveal') ? classList.remove('reveal') : classList.add('reveal');
    }

    const handleLogout = () => {
        dropdown.current.classList.remove('reveal');
        dispatch(logout());
        navigate('/');
    }

    const handleDisappear = () => dropdown.current.classList.remove('reveal');
    
    return (
        <>
            <div className='header-top'></div>
            <header>
                <div className='header-left'>
                    <Logo className='header-logo' onClick={() => navigate('/')}></Logo>
                    {neighborhood || isRestaurantEditor ? 
                        <div className='header-location'>
                            <FontAwesomeIcon className='header-location-icon' icon={faLocationDot} />
                            <span className='header-location-text'>{isRestaurantEditor ? 'Restaurant Editor' : neighborhood?.name}</span>
                        </div>
                    : null}
                </div>
                <div className='header-right'>
                    {isLoggedIn ? (
                        <FontAwesomeIcon className='profile-icon' icon={faUser} 
                            onClick={handleProfileClick} 
                        />
                    ) : (
                        <>
                            <button className='signup' 
                                onClick={() => setModal('signup')}
                            >Sign up</button>
                            <button className='signin' 
                                onClick={() => setModal('signin')}
                            >Sign in</button>
                        </>
                    )}
                </div>
                <div className='profile-dropdown' ref={dropdown}>
                    <h2 className='profile-dropdown-name'>Hello, {currentUser?.firstName}!</h2>
                    <Link to='/user/details' className='profile-dropdown-selector' onClick={handleDisappear}>My Profile</Link>
                    <Link to='/user/reservations' className='profile-dropdown-selector' onClick={handleDisappear}>My Dining History</Link>
                    <Link to='/user/saved' className='profile-dropdown-selector' onClick={handleDisappear}>My Saved Restaurants</Link>
                    {currentUser?.isOwner && <Link to='/user/restaurants' className='profile-dropdown-selector' onClick={handleDisappear}>My Owned Restaurants</Link>}
                    <p className='profile-dropdown-selector' 
                        onClick={handleLogout}
                    >Sign out</p>
                </div>
                {modal && createPortal(
                    <AuthModal modal={modal} closeModal={modalRef => {
                        modalRef.current.classList.remove('modal-show');
                        setTimeout(() => setModal(), 300)
                    }} />,
                    document.body
                )}
            </header>
        </>
    )
}

export default Header;
