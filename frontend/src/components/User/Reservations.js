import { useCurrentUserReservations } from '../../store/userSlice';
import './Reservations.css';
import ReservationTile from './ReservationTile';

export default function Reservations() {
    const reservations = useCurrentUserReservations()?.map(reservation => {
        reservation.datetime = new Date(reservation.datetime);
        return reservation;
    });

    const getReservationTile = reservation => {
        const { restaurant, seats } = reservation.availableTable;
        const { name, imageUrl, neighborhood, cuisine } = restaurant;

        return <ReservationTile
            key={reservation.id}
            reservation={reservation}
            name={name} 
            imageUrl={imageUrl} 
            neighborhood={neighborhood} 
            cuisine={cuisine}
            seats={seats}
        />
    }

    return (
        <>
            <div className='reservations'>
                <h2>Current reservations</h2>
                {
                    reservations?.sort((a, b) => a.datetime - b.datetime).map(reservation => 
                        (reservation.datetime > new Date() && getReservationTile(reservation)))
                }
            </div>
            <div className='reservations'>
                <h2>Past reservations</h2>
                {
                    reservations?.sort((a, b) => b.datetime - a.datetime).map(reservation => 
                        (reservation.datetime <= new Date() && getReservationTile(reservation)))
                }
            </div>
        </>
    );
}