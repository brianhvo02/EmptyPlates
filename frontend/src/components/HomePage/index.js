import { useFetchCuisines } from '../../store/cuisineSlice';
import { useFetchRestaurants } from '../../store/restaurantSlice';
import { useSession } from '../../store/sessionSlice';
import { useFetchUser } from '../../store/userSlice';
import RestaurantCarousel from './RestaurantCarousel';
import SearchBar from './SearchBar';
import './index.css';

export default function HomePage() {
    const { currentUser } = useSession();
    useFetchUser(currentUser?.id);
    useFetchRestaurants();
    useFetchCuisines();

    return (
        <main className='homepage'>
            <SearchBar />
            <RestaurantCarousel />
        </main>
    )
}