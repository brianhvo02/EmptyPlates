import { ReactComponent as Logo } from './logo.svg';
import './index.css';
import { toggleModal } from '../../store/modalSlice';
import { logout, useSession } from '../../store/sessionSlice';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faLocationDot } from '@fortawesome/free-solid-svg-icons';
import { useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useRestaurant } from '../../store/restaurantSlice';
import { useCurrentUserRestaurants } from '../../store/userSlice';

function Header() {
    const { dispatch, restaurant, isRestaurantEditor } = useRestaurant();
    const { currentUser, isLoggedIn, ownedRestaurants } = useCurrentUserRestaurants();
    const navigate = useNavigate();
    const dropdown = useRef();

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
                    {restaurant || isRestaurantEditor ? 
                        <div className='header-location'>
                            <FontAwesomeIcon className='header-location-icon' icon={faLocationDot} />
                            <span className='header-location-text'>{isRestaurantEditor ? 'Restaurant Editor' : restaurant?.neighborhood.name}</span>
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
                    <p className='profile-dropdown-name'>Hello, {!currentUser || currentUser.firstName}!</p>
                    <p className='profile-restaurant-header'>My Restaurants</p>
                    {ownedRestaurants?.map(restaurant => <Link to={`/restaurants/${restaurant.urlId}/edit`} className='profile-dropdown-selector' key={restaurant.urlId}>{restaurant.name}</Link>)}
                    <p className='profile-dropdown-selector' 
                        onClick={handleCreateRestaurant}
                    >Create a Restaurant</p>
                    <p className='profile-dropdown-selector' 
                        onClick={handleLogout}
                    >Sign out</p>
                </div>
            </header>
        </>
    )
}

export default Header;
