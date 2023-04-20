import RestaurantCarousel from './RestaurantCarousel';
import SearchBar from './SearchBar';
import './index.css';

export default function HomePage() {
    return (
        <main className='homepage'>
            <SearchBar />
            <RestaurantCarousel />
        </main>
    )
}