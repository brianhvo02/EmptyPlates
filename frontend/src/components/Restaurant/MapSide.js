import { useEffect, useRef } from 'react';
import './MapSide.css';
import { Loader } from '@googlemaps/js-api-loader';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLocationDot } from '@fortawesome/free-solid-svg-icons';
import { useMaps } from '../../utils';

export default function MapSide({address}) {
    const { ref } = useMaps({ address: address || '' });

    return (
        <div className='side-map'>
            <div className='map' ref={ref}></div>
            <div className='map-address'>
                <FontAwesomeIcon icon={faLocationDot} />
                <p>{address}</p>
            </div>
        </div>
    )
}