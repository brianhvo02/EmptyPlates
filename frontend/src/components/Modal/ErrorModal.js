import './index.css';
import './ErrorModal.css';
import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ErrorModal({errors}) {
    const navigate = useNavigate();
    const modalRef = useRef();
    useEffect(() => {
        setTimeout(() => !modalRef.current || modalRef.current.classList.add('modal-show'), 100);
    }, [modalRef]);

    return (
        <div className='modal-container'>
            <div className='modal' ref={modalRef}>
                <h1>Oh no! Errors have occurred:</h1>
                {errors.map((error, i) => <p className='.modal-error' key={`error-${i}`}>{error}</p>)}
                <button onClick={() => navigate(-1)} className='reservation-button'>Go back</button>
            </div>
        </div>
    )
}