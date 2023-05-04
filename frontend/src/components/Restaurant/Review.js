import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useReservationSlice } from '../../store/reservationSlice';
import { useUser } from '../../store/userSlice';
import './Review.css';
import { faMessage } from '@fortawesome/free-regular-svg-icons';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { Fragment } from 'react';

export default function Review({ review }) {
    const reservationSlice = useReservationSlice();
    const reservation = reservationSlice[review?.reservationId];
    const diner = useUser(reservation?.dinerId);
    const dinerName = (diner?.displayName || (diner?.firstName + diner?.lastName[0]) || '');
    const timestampSinceReservation = new Date() - new Date(reservation.datetime);
    const timeSinceReservation = timestampSinceReservation < 604800000
        ? `Dined ${new Date(timestampSinceReservation).getDate()} days ago`
        : `Dined on ${new Date(reservation.datetime).toLocaleDateString('en-US', {
            month: 'short', 
            day: '2-digit', 
            year: 'numeric' 
        })}`;

    return (
        <div className='review-component'>
            <div className='review-profile'>
                <div className='review-profile-pic'>
                    <span>
                        {
                            dinerName.match(/[A-Z]+/g) || dinerName[0]
                        }
                    </span>
                </div>
                <h3>{dinerName}</h3>
                <p>{diner?.neighborhood.name}</p>
                <p>
                    <FontAwesomeIcon icon={faMessage} />
                    {diner ? diner.reviews.length : 0} reviews
                </p>
            </div>
            <div className='review-content'>
                <div className='rating-label'>
                    {Array.from(Array(5).keys()).map(i => 
                        <FontAwesomeIcon key={`review-rating-${review.id}-${i}`} 
                            icon={faStar} className='star-icon'
                            style={{
                                color: (i + 1) <= review.overall
                                    ? '#3795DA' 
                                    : '#E1E1E1'
                            }}
                        />
                    )}
                    <span className='rating-label-text'>
                        {timeSinceReservation}
                    </span>
                </div>
                <div className='review-ratings'>
                    {
                        Object.entries(review).map(([key, value]) => 
                            !['id', 'reservationId', 'review'].includes(key) &&
                            <Fragment key={`rating_${review.id}_${key}`}>
                                <span>{key}</span>
                                <span className='rating-score'>{value}</span>
                            </Fragment>
                        )
                    }
                </div>
                <p className='review-body'>{review.review}</p>
            </div>
        </div>
    );
}