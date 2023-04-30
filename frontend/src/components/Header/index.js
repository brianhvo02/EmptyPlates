import { ReactComponent as Logo } from './logo.svg';
import './index.css';
import { toggleModal, useModal } from '../../store/modalSlice';
import { logout, useSession } from '../../store/sessionSlice';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faLocationDot } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useMemo, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useRestaurant } from '../../store/restaurantSlice';
import { useCurrentUserRestaurants, useFetchUser } from '../../store/userSlice';
import { useDispatch } from 'react-redux';
import { useDebug } from '../../utils';
import { useFetchNeighborhoods } from '../../store/neighborhoodSlice';
import AuthModal from '../Modal/AuthModal';
import { createPortal } from 'react-dom';

function Header() {
    const modal = useModal();
    const { currentUser, isLoggedIn, ownedRestaurants } = useCurrentUserRestaurants();
    const { pathname } = useLocation();
    const { restaurant } = useRestaurant();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const dropdown = useRef();
    const isRestaurantEditor = useMemo(() => pathname.includes('new') || pathname.includes('edit'), [pathname]);

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

    useDebug(ownedRestaurants);

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
                                onClick={() => dispatch(toggleModal('signup'))}
                            >Sign up</button>
                            <button className='signin' 
                                onClick={() => dispatch(toggleModal('signin'))}
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
                {(modal === 'signin' || modal === 'signup') && createPortal(
                    <AuthModal modal={modal} />,
                    document.body
                )}
            </header>
        </>
    )
}

export default Header;
