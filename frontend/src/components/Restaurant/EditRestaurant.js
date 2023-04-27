import { useClearErrorsOnUnmount, useError } from '../../store/errorSlice';
import { useRestaurant } from '../../store/restaurantSlice';
import { useAuth } from '../../utils';
import './EditRestaurant.css';

export default function EditRestaurantPage() {
    useAuth();
    useClearErrorsOnUnmount();

    const errors = useError('restaurant');
    const { restaurant } = useRestaurant();

    return null;
}