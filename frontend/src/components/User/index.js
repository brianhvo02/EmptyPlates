import './index.css';
import { useSession } from '../../store/sessionSlice';
import { NavLink, Route, Routes, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuth } from '../../utils';
import Reservations from './Reservations';
import ErrorModal from '../Modal/ErrorModal';
import Restaurants from './Restaurants';

export default function UserPage() {
    const { currentUser } = useAuth();

    return (
        <div className='dashboard'>
            <div className='dashboard-header'>
                <h1>{currentUser?.firstName} {currentUser?.lastName}</h1>
            </div>
            <div className='dashboard-container'>
                <nav>
                    <ul>
                        <li>
                            <NavLink to='/user/reservations'>Reservations</NavLink>
                        </li>
                        {/* <li>
                            <NavLink to='/user/saved'>Saved Restaurants</NavLink>
                        </li> */}
                        {/* <li>
                            <NavLink to='/user/details'>Account Details</NavLink>
                        </li> */}
                        {currentUser?.isOwner &&
                            <li>
                                <NavLink to='/user/restaurants'>Owned Restaurants</NavLink>
                            </li>
                        }
                    </ul>
                </nav>
                <div className='dashboard-body'>
                    <Routes>
                        <Route path='*' element={<ErrorModal errors={['Page not found!']} />} />
                        <Route path="/reservations" Component={Reservations} />
                        <Route path="/restaurants" Component={Restaurants} />
                    </Routes>
                </div>
            </div>
        </div>
    );
}