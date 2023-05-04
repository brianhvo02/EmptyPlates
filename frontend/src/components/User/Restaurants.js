import { useCurrentUserRestaurants } from '../../store/userSlice';
import RestaurantTile from './RestaurantTile';
import { useNavigate } from 'react-router-dom';

export default function Restaurants() {
    const { restaurants } = useCurrentUserRestaurants();
    const navigate = useNavigate();

    return (
        <>
            <button onClick={() => navigate('/restaurants/new')} className='reservation-button'>Create a restaurant</button>
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