import { useCurrentUserRestaurants } from '../../store/userSlice';
import './Restaurants.css';
import ReservationTile from './ReservationTile';
import RestaurantTile from './RestaurantTile';

export default function Restaurants() {
    const { restaurants } = useCurrentUserRestaurants();

    return (
        <>
            <div className='reservations'>
                <h2>Owned restaurants</h2>
                {
                    restaurants?.sort((a, b) => a.name.localeCompare(b.name)).map(restaurant => 
                        <RestaurantTile key={restaurant.id} restaurant={restaurant} />
                    )
                }
            </div>
        </>
    );
}