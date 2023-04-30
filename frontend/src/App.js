import { Route, Routes } from 'react-router-dom';
import './App.css';
import Header from './components/Header';
import HomePage from './components/HomePage';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { getSession } from './store/sessionSlice';
import RestaurantPage from './components/Restaurant';
import Footer from './components/Footer';
import CrEditRestaurantPage from './components/Restaurant/CrEditRestaurant';
import ErrorModal from './components/Modal/ErrorModal';

function App() {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getSession());
    }, [dispatch]);

    return (
        <div className='container'>
            <Header />
            <Routes>
                <Route path='*' element={<ErrorModal errors={['Page not found!']} />} />
                <Route path='/' Component={HomePage} />
                <Route path='/restaurants/new' Component={CrEditRestaurantPage} />
                <Route path='/restaurants/:restaurantId' Component={RestaurantPage} />
                <Route path='/restaurants/:restaurantId/edit' Component={CrEditRestaurantPage} />
            </Routes>
            <Footer />
        </div>
    )
}

export default App;
