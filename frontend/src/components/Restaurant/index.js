import { useEffect } from "react"
import { useParams } from "react-router-dom"
import { getRestaurant, setRestaurant } from "../../store/restaurantSlice";
import { useDispatch, useSelector } from "react-redux";

export default function RestaurantPage() {
    const { restaurantId } = useParams();
    const errors = useSelector(state => state.errors.restaurant);
    const restaurant = useSelector(state => state.entities.restaurants[restaurantId]);
    
    const dispatch = useDispatch();

    const newRestaurant = !restaurantId;

    useEffect(() => {
        if (restaurantId) dispatch(getRestaurant(restaurantId));
    }, [restaurantId, dispatch]);

    return (
        newRestaurant ? (
            <p>Make new restaurant</p>
        ) : (
            errors.length > 0 ? (
                errors.map((error, i) => <p key={i}>{error}</p>)
            ) : (
                restaurant ? (
                    <div className="restaurant">
                        <h1>{restaurant.name}</h1>
                        <p>{restaurant.bio}</p>
                        <p>{restaurant.address}</p>
                        <p>{restaurant.phoneNumber}</p>
                        <p>{Array(restaurant.priceRange).fill('$').join('')}</p>
                        <p>{restaurant.neighborhood}</p>
                        <p>{restaurant.cuisine}</p>
                    </div>
                ) : null
            )
        )
    )
}