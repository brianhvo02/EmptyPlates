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
import UserPage from './components/User';

function App() {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getSession());
    }, [dispatch]);

    return (
        <div className='container'>
            <Header />
            <main>
                <Routes>
                    <Route path='*' element={<ErrorModal errors={['Page not found!']} />} />
                    <Route path='/' Component={HomePage} />
                    <Route path='/restaurants/new' Component={CrEditRestaurantPage} />
                    <Route path='/restaurants/:restaurantId' Component={RestaurantPage} />
                    <Route path='/restaurants/:restaurantId/edit' Component={CrEditRestaurantPage} />
                    <Route path='/user/*' Component={UserPage} />
                </Routes>
            </main>
            <Footer />
        </div>
    )
}

export default App;
