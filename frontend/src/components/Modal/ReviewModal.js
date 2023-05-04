import './index.css';
import './ReviewModal.css';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { restaurantUrl } from '../../store/restaurantSlice';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { faStar as faStarHollow } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useDispatch } from 'react-redux';
import { createReview, deleteReview, updateReview } from '../../store/reservationSlice';

export default function ReviewModal({ reservationId, closeModal, review }) {
    const modalRef = useRef();
    const dispatch = useDispatch();

    useEffect(() => {
        setTimeout(() => !modalRef.current || modalRef.current.classList.add('modal-show'), 100);
    }, [modalRef]);

    const [values, setValues] = useState({
        overall: 0,
        food: 0,
        service: 0,
        ambience: 0,
        review: '',
        ...review
    });

    const handleSubmit = e => {
        e.preventDefault();

        const newReview = { ...values, reservationId };
        
        dispatch((review ? updateReview : createReview)(newReview))
            .then(status => status && closeModal(modalRef))
    }

    return (
        <div className='modal-container' onClick={e => e.target === e.currentTarget && closeModal(modalRef)}>
            <div className='modal' ref={modalRef}>
                <form className='review-form' onSubmit={handleSubmit}>
                    <h1>{review ? 'Edit your' : 'Fill out a'} review</h1>
                    {
                        Object.keys(values).map(name =>
                            !['review', 'id', 'reservationId'].includes(name) && <ReviewInputGroup
                                key={name}
                                name={name[0].toUpperCase() + name.slice(1)}
                                value={values[name]}
                                setValue={value => setValues(prev => ({ ...prev, [name]: value }))}
                            />
                        )
                    }
                    <h2>Review Text (optional)</h2>
                    <textarea value={values.review} onChange={e => setValues(prev => ({ ...prev, review: e.target.value }))} />
                    <button className='reservation-button'>{review ? 'Edit' : 'Create'} review</button>
                </form>
                    <button className='reservation-button reservation-delete' hidden={!review} onClick={() =>
                        dispatch(deleteReview(review)).then(status => status && closeModal(modalRef))
                    }>Delete review</button>
            </div>
        </div>
    )
}

function ReviewInputGroup({ name, value, setValue }) {
    const [tempValue, setTempValue] = useState(value);

    return (
        <div className='review-input-group'>
            <h2>{name}</h2>
            <div className='review-stars-row'>
                {
                    Array.from(Array(5).keys())
                        .map(i => 
                            <FontAwesomeIcon
                                key={`${name}_${i}`}
                                icon={tempValue > i ? faStar : faStarHollow}
                                color={tempValue > i ? '#3795DA' : 'black'}
                                onMouseEnter={() => setTempValue(i + 1)}
                                onMouseLeave={() => setTempValue(value)}
                                onClick={() => setValue(tempValue)}
                            />
                        )
                }
            </div>
        </div>
    )
}