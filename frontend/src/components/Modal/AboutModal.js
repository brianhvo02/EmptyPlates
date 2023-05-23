import './index.css';
import './AboutModal.css';
import { useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub, faLinkedin } from '@fortawesome/free-brands-svg-icons';

export default function AboutModal({ closeModal }) {
    const modalRef = useRef();
    useEffect(() => {
        setTimeout(() => !modalRef.current || modalRef.current.classList.add('modal-show'), 100);
    }, [modalRef]);

    return (
        <div className='modal-container' onClick={e => e.target.classList.contains('modal-container') && closeModal(modalRef)}>
            <div className='modal' ref={modalRef}>
                <h1>About EmptyPlates</h1>
                <div className='about-container'>
                    <img src='/profile.jpg' alt='Picture of Brian Vo'/>
                    <div className='about'>
                        <p>Hi there! My name is Brian, and I'm the developer behind EmptyPlates.</p>
                        <p>
                            EmptyPlates is a clone of OpenTable, where as an owner you can create restaurants,
                            manage available tables, and as a diner make reservations and leave reviews.
                        </p>
                        <p>If you liked EmptyPlates, here are some of my other projects:</p>
                        <p>
                            <a href='https://ontime.brianhuyvo.com' target='_blank' rel='noreferrer'>
                                OnTime Transit
                            </a> - a San Francisco Bay Area transit visualizer
                        </p>
                        <p>
                            <a href='https://scene-app.herokuapp.com/' target='_blank' rel='noreferrer'>
                                Scene
                            </a> - a social platform for movie lovers
                        </p>
                        <p>Or take a look at my <a href='https://brianhuyvo.com' target='_blank' rel='noreferrer'>portfolio website</a> for more info.</p>
                        <div className='about-icons'>
                            <a href='https://github.com/brianhvo02' target='_blank' rel='noreferrer'>
                                <FontAwesomeIcon icon={faGithub} />
                            </a>
                            <a href='https://www.linkedin.com/in/brian-huy-vo' target='_blank' rel='noreferrer'>
                                <FontAwesomeIcon icon={faLinkedin} />
                            </a>
                        </div>
                    </div>
                </div>
                <button onClick={() => closeModal(modalRef)} className='reservation-button'>Go back</button>
            </div>
        </div>
    )
}