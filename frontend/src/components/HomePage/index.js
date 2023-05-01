import { useFetchNeighborhoods, useNeighborhoods } from '../../store/neighborhoodSlice';
import { useRestaurantSlice } from '../../store/restaurantSlice';
import { useSession } from '../../store/sessionSlice';
import { useFetchUser } from '../../store/userSlice';
import RestaurantCarousel from './RestaurantCarousel';
import SearchBar from './SearchBar';
import './index.css';

export default function HomePage() {
    const { currentUser } = useSession();
    useFetchUser(currentUser?.id);
    useFetchNeighborhoods();
    const neighborhoods = useNeighborhoods();
    const restaurantSlice = useRestaurantSlice();

    return (
        <div className='homepage'>
            <SearchBar />
            {
                neighborhoods.map(neighborhood => 
                    <RestaurantCarousel 
                        key={`neighborhood_${neighborhood.id}`}
                        header={`Restaurants in ${neighborhood.name}`} 
                        restaurants={
                            neighborhood.restaurants.map(restaurantId => 
                                restaurantSlice?.[restaurantId]
                            )
                        } />
                )
            }
        </div>
    )
}