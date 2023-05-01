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
    const { restaurant } = useRestaurant();
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

    const handleCreateRestaurant = () => {
        dropdown.current.classList.remove('reveal');
        navigate('/restaurants/new');
    }
    
    return (
        <>
            <div className='header-top'></div>
            <header>
                <div className='header-left'>
                    <Logo className='header-logo' onClick={() => navigate('/')}></Logo>
                    {Object.keys(restaurant).length > 0 || isRestaurantEditor ? 
                        <div className='header-location'>
                            <FontAwesomeIcon className='header-location-icon' icon={faLocationDot} />
                            <span className='header-location-text'>{isRestaurantEditor ? 'Restaurant Editor' : restaurant?.neighborhood?.name}</span>
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
                    <p className='profile-dropdown-name'>Hello, {currentUser?.firstName}!</p>
                    <p className='profile-restaurant-header'>My Restaurants</p>
                    {
                        ownedRestaurants?.map(restaurant => 
                            <Link 
                                to={`/restaurants/${restaurant?.urlId}/edit`} 
                                className='profile-dropdown-selector profile-restaurant' 
                                key={restaurant?.urlId}
                                onClick={() => dropdown.current.classList.remove('reveal')}
                                >{restaurant?.name}</Link>)}
                    <p className='profile-dropdown-selector' 
                        onClick={handleCreateRestaurant}
                    >Create a Restaurant</p>
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
