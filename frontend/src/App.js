import { Route, Routes } from 'react-router-dom';
import './App.css';
import Header from './components/Header';
import HomePage from './components/HomePage';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { getSession } from './store/sessionSlice';
import RestaurantPage from './components/Restaurant';
import { useModal } from './store/modalSlice';
import AuthModal from './components/Modal/AuthModal';
import NewRestaurantPage from './components/Restaurant/NewRestaurant';
import EditRestaurantPage from './components/Restaurant/EditRestaurant';
import Footer from './components/Footer';

function App() {
    const modal = useModal();
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getSession());
    }, [dispatch]);

    return (
        <div className='container'>
            <Header />
            {modal === 'signin' || modal === 'signup' ? <AuthModal modal={modal} /> : null}
            <Routes>
                <Route path='/' Component={HomePage} />
                <Route path='/restaurants/new' Component={NewRestaurantPage} />
                <Route path='/restaurants/:restaurantId' Component={RestaurantPage} />
                <Route path='/restaurants/:restaurantId/edit' Component={EditRestaurantPage} />
            </Routes>
            <Footer />
        </div>
    )
}

export default App;
