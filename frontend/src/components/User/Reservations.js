import { useCurrentUserReservations } from '../../store/userSlice';
import './Reservations.css';
import ReservationTile from './ReservationTile';

export default function Reservations() {
    const reservations = useCurrentUserReservations()?.map(reservation => {
        reservation.datetime = new Date(reservation.datetime * 1000);
        return reservation;
    });

    return (
        <>
            <div className='reservations'>
                <h2>Current reservations</h2>
                {
                    reservations?.sort((a, b) => a.datetime - b.datetime).map(reservation => {
                        if (reservation.datetime <= new Date()) return;
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
                    })
                }
            </div>
            <div className='reservations'>
                <h2>Past reservations</h2>
                {
                    reservations?.sort((a, b) => b.datetime - a.datetime).map(reservation => {
                        if (reservation.datetime > new Date()) return;
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
                    })
                }
            </div>
        </>
    );
}