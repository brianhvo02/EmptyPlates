// import logo from './logo.svg';
import { ReactComponent as Logo } from './logo.svg';
import './index.css';
import { useDispatch, useSelector } from 'react-redux';
import { toggleModal } from '../../store/modalSlice';
import { logout, useSession } from '../../store/sessionSlice';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Header() {
    const { dispatch, currentUser } = useSession();
    const navigate = useNavigate();
    const dropdown = useRef();

    const handleProfileClick = function() {
        const classList = dropdown.current.classList;
        classList.contains('reveal') ? classList.remove('reveal') : classList.add('reveal');
    }

    const handleLogout = function() {
        dropdown.current.classList.remove('reveal');
        dispatch(logout());
    }

    return (
        <header>
            <div className='header-left'>
                <Logo onClick={() => navigate('/')}></Logo>
            </div>
            <div className='header-right'>
                {currentUser ? (
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
                <p className='profile-dropdown-selector' 
                    onClick={() => navigate('/restaurant/new')}
                >Create a Restaurant</p>
                <p className='profile-dropdown-selector' 
                    onClick={handleLogout}
                >Sign out</p>
            </div>
        </header>
    )
}

export default Header;
