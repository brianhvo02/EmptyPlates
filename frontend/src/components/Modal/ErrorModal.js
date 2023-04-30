import { useEffect, useRef } from 'react';
import './index.css';
import './ErrorModal.css';

export default function ErrorModal({errors}) {
    const modalRef = useRef();
    useEffect(() => {
        setTimeout(() => !modalRef.current || modalRef.current.classList.add('modal-show'), 100);
    }, [modalRef]);

    return (
        <div className='modal-container'>
            <div className='modal' ref={modalRef}>
                <h1>Oh no! Errors have occurred:</h1>
                {errors.map((error, i) => <p className='.modal-error' key={`error-${i}`}>{error}</p>)}
            </div>
        </div>
    )
}