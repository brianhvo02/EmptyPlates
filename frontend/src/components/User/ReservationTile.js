import { Link } from 'react-router-dom';
import './ReservationTile.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendar, faClock, faUser } from '@fortawesome/free-regular-svg-icons';
import { faLocationDot, faUtensils } from '@fortawesome/free-solid-svg-icons';
import { reservationUrl } from '../../store/reservationSlice';

export default function ReservationTile({reservation, imageUrl, name, cuisine, neighborhood, seats}) {
    return (
        <Link to={reservationUrl(reservation.id)}>
            <img src={imageUrl} />
            <div className='reservation-content'>
                <h3>{name}</h3>
                <p>
                    <FontAwesomeIcon icon={faCalendar} />
                    <span>{reservation.datetime.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                </p>
                <p>
                    <FontAwesomeIcon icon={faUser} />
                    <span>{seats}</span>
                    <FontAwesomeIcon icon={faClock} />
                    <span>{reservation.datetime.toLocaleTimeString('en-US', { hour: '2-digit',  minute: '2-digit' })}</span>
                </p>
                <p>
                    <FontAwesomeIcon icon={faUtensils} />
                    <span>{cuisine.name}</span>
                </p>
                <p>
                    <FontAwesomeIcon icon={faLocationDot} />
                    <span>{neighborhood.name}</span>
                </p>
            </div>
        </Link>
    )
}