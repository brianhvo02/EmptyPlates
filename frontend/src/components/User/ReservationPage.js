import { Link, useNavigate, useParams } from 'react-router-dom';
import { deleteReservation, useReservation } from '../../store/reservationSlice';
import './ReservationPage.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBuilding, faCircle, faHouseFlag, faLocationDot, faLocationPin, faMapPin, faMessage, faUtensils } from '@fortawesome/free-solid-svg-icons';
import { faCalendar, faClock, faUser, faMessage as faMessageHollow } from '@fortawesome/free-regular-svg-icons';
import { restaurantUrl, useRestaurant } from '../../store/restaurantSlice';
import { useAuth, useMaps } from '../../utils';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useCurrentUserReservations } from '../../store/userSlice';
import ReservationSide from '../Restaurant/ReservationSide';
import ConfirmDeleteModal from '../Modal/ConfirmDeleteModal';
import { createPortal } from 'react-dom';
import { useDispatch } from 'react-redux';
import ErrorModal from '../Modal/ErrorModal';
import { useClearErrorsOnUnmount } from '../../store/errorSlice';
import ReviewModal from '../Modal/ReviewModal';

export default function ReservationPage() {
    const { currentUser, neighborhood: userNeighborhood } = useAuth();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    useClearErrorsOnUnmount();
    const userCreated = useMemo(() => {
        const date = new Date(currentUser?.createdAt);
        if (!isNaN(date.getTime())) return date.toLocaleDateString('en-US', {
            month: 'short', 
            year: 'numeric' 
        });
    }, [currentUser]);

    const [showConfirmDelete, setShowConfirmDelete] = useState(false);

    const getReservationTile = reservation => {
        const { restaurant } = reservation.availableTable;
        const { name, imageUrl, neighborhood } = restaurant;

        return (
            <Link key={reservation.id} to={`/user/reservations/${reservation.id}`} className='side-history-reservation'>
                <img src={imageUrl} />
                <div>
                    <h4>{name}</h4>
                    <p>{neighborhood?.name}</p>
                    <p>
                        Dined {
                            reservation?.datetime.toLocaleDateString('en-US', {
                                month: 'short', 
                                day: 'numeric',
                            })
                        }
                    </p>
                </div>
            </Link>
        )
    }

    const { reservationId } = useParams();
    const { id, datetime, availableTable, restaurant, cuisine, neighborhood, review } = useReservation(reservationId);
    const reservations = useCurrentUserReservations()?.map(reservation => {
        reservation.datetime = new Date(reservation.datetime);
        return reservation;
    })
    .filter(reservation => reservation.datetime < new Date() && reservation.id !== id)
    .sort((a, b) => a.datetime - b.datetime)
    .slice(0, 5)
    .map(getReservationTile);

    const { restaurant: restaurantObj } = useRestaurant(restaurant?.urlId);
    const { mapRef } = useMaps({ address: restaurant?.address || '' });

    const [errors, setErrors] = useState([]);

    const ref = useRef(false);
    useEffect(() => {
        if (currentUser && !id && !ref.current) {
            setErrors(['Reservation not found!']);
        } else if (!ref.current && id) {
            ref.current = true;
        } else if (ref.current && !id ) {
            navigate('/user/reservations');
        }
    }, [currentUser, id]);

    const [showReview, setShowReview] = useState(false);

    return (
        <div className='reservation-container'>
            {
                showConfirmDelete && createPortal(
                    <ConfirmDeleteModal name={'this reservation'} deleteFunc={() => dispatch(deleteReservation(id))} closeModal={modalRef => {
                        modalRef.current.classList.remove('modal-show');
                        setTimeout(() => setShowConfirmDelete(false), 300);
                    }} />,
                    document.body
                )
            }
            {
                errors && errors.length > 0 && createPortal(
                    <ErrorModal errors={errors} closeModal={modalRef => {
                        modalRef.current.classList.remove('modal-show');
                        setTimeout(() => errors.length = 0, 300);
                    }} />,
                    document.body
                )
            }
            {
                showReview && createPortal(
                    <ReviewModal reservationId={reservationId} review={review}
                    closeModal={modalRef => {
                        modalRef.current.classList.remove('modal-show');
                        setTimeout(() => setShowReview(false), 300);
                    }} />,
                    document.body
                )
            }
            <div className='reservation-page'>
                <section className='reservation'>
                    <div className='reservation-header'>
                        <img src={restaurant?.imageUrl} />
                        <div className='reservation-info'>
                            <Link to={restaurantUrl(restaurant?.urlId)}>{restaurant?.name}</Link>
                            <p>
                                <FontAwesomeIcon icon={faUser} />
                                <span>{availableTable?.seats}</span>
                                <FontAwesomeIcon icon={faCalendar} />
                                <span>
                                    {
                                        datetime?.toLocaleDateString('en-US', { 
                                            weekday: 'short', 
                                            month: 'short', 
                                            day: 'numeric',
                                            year: 'numeric' 
                                        })
                                    } at {
                                        datetime?.toLocaleTimeString('en-US', {
                                            hour: '2-digit',  minute: '2-digit'
                                        })
                                    }
                                </span>
                            </p>
                            <p>
                                <FontAwesomeIcon icon={faUtensils} />
                                <span>{cuisine?.name}</span>
                                <FontAwesomeIcon icon={faMapPin} />
                                <span>{neighborhood?.name}</span>
                            </p>
                            <p>
                                <FontAwesomeIcon icon={faLocationDot} />
                                <span>{restaurant?.address}</span>
                            </p>
                        </div>
                    </div>
                    <div className='reservation-buttons'>
                        <div onClick={() => datetime <= new Date() && setShowReview(true)}>
                            <div className={datetime > new Date() ? 'review-disabled' : undefined} />
                            <FontAwesomeIcon className='reservation-button-icon' icon={faMessage} inverse transform='shrink-3'/>
                            <div>
                                <h3>{review ? 'Edit Your Review' : 'Rate and Review'}</h3>
                                <p>Share your experience</p>
                            </div>
                        </div>
                        <Link to={restaurantUrl(restaurant?.urlId)}>
                            <FontAwesomeIcon className='reservation-button-icon' icon={faUtensils} inverse/>
                            <div>
                                <h3>Browse menu</h3>
                                <p>Restaurant's profile</p>
                            </div>
                        </Link>
                    </div>
                    <div className='reservation-new-container'>
                        <div className='reservation-new'>
                            {
                                restaurantObj && availableTable && datetime &&
                                <ReservationSide 
                                    id={datetime > new Date() ? id : null}
                                    availableTables={restaurantObj?.fullAvailableTables}
                                    neighborhood={neighborhood} 
                                    defaultPartySize={availableTable?.seats}
                                    defaultDate={
                                        datetime?.toLocaleDateString('en-US', { 
                                            month: 'short', 
                                            day: 'numeric',
                                            year: 'numeric' 
                                        })
                                    }
                                    defaultTime={
                                        datetime?.toLocaleTimeString('en-US', {
                                            hour: '2-digit',  minute: '2-digit'
                                        })
                                    }
                                />
                            }
                        </div>
                    </div>
                    <div className='reservation-map' ref={mapRef} />
                    <button onClick={() => setShowConfirmDelete(true)} className='reservation-button reservation-delete'>Cancel Reservation</button>
                </section>
                <aside className='reservation-side'>
                    <div className='side-profile'>
                        <div>
                            <FontAwesomeIcon icon={faUser} />
                            <h3>{currentUser?.firstName} {currentUser?.lastName}</h3>
                        </div>
                        <p>Joined in {userCreated}</p>
                        <div>
                            <FontAwesomeIcon icon={faHouseFlag} />  
                            <p>{userNeighborhood?.name}</p>
                        </div>
                        <div>
                            <FontAwesomeIcon icon={faMessageHollow} />  
                            <p>{currentUser ? currentUser.reviews.length : 0} reviews</p>
                        </div>
                    </div>
                    <div className='side-history'>
                        <h3>Your dining history</h3>
                        {reservations}
                    </div>
                </aside>
            </div>
        </div>
    )
}