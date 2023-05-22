import './index.css';
import './LoadingModal.css';
import { useEffect, useRef } from 'react';

export default function LoadingModal() {
    const modalRef = useRef();
    useEffect(() => {
        setTimeout(() => !modalRef.current || modalRef.current.classList.add('modal-show'), 100);
    }, [modalRef]);

    return (
        <div className='modal-container'>
            <div class='lds-dual-ring' />
        </div>
    )
}