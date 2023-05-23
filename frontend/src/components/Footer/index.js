import './index.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import { useState } from 'react';
import { createPortal } from 'react-dom';
import AboutModal from '../Modal/AboutModal';

export default function Footer() {<FontAwesomeIcon icon={faGithub} />
    const [showAbout, setShowAbout] = useState(false);

    return (
        <footer>
            {
                showAbout &&
                createPortal(
                    <AboutModal closeModal={modalRef => {
                        modalRef.current.classList.remove('modal-show');
                        setTimeout(() => setShowAbout(false), 300);
                    }} />,
                    document.body
                )
            }
            <p>Copyright © 2023 Brian Vo - All rights reserved. - <button onClick={() => setShowAbout(true)}>About the developer</button></p>
        </footer>
    );
}