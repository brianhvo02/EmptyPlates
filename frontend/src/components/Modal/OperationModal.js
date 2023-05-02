import './index.css';
import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { restaurantUrl } from '../../store/restaurantSlice';

export default function OperationModal({urlId, closeModal}) {
    const modalRef = useRef();
    const navigate = useNavigate();
    

    useEffect(() => {
        setTimeout(() => !modalRef.current || modalRef.current.classList.add('modal-show'), 100);
    }, [modalRef]);

    return (
        <div className='modal-container'>
            <div className='modal' ref={modalRef}>
                <h1>Operation successful! Where do you want to go next?</h1>
                <button onClick={() => navigate('/')} className='reservation-button'>Go to homepage</button>
                <button onClick={() => navigate(restaurantUrl(urlId))} className='reservation-button'>Go to restaurant page</button>
                <button onClick={() => closeModal(modalRef)} className='reservation-button'>Continue to edit restaurant</button>
            </div>
        </div>
    )
}