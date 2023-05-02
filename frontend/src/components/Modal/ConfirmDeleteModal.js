import './index.css';
import { useEffect, useRef } from 'react';

export default function ConfirmDeleteModal({ name, deleteFunc, closeModal }) {
    const modalRef = useRef();
    useEffect(() => {
        setTimeout(() => !modalRef.current || modalRef.current.classList.add('modal-show'), 100);
    }, [modalRef]);

    return (
        <div className='modal-container'>
            <div className='modal' ref={modalRef}>
                <h1>Are you sure you want to delete {name}?</h1>
                <button onClick={() => closeModal(modalRef)} className='reservation-button'>Go back!</button>
                <button onClick={() => deleteFunc()} className='reservation-button reservation-delete'>Yes, I'm sure.</button>
            </div>
        </div>
    )
}