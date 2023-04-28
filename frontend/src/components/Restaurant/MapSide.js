import { useEffect, useRef, useState } from 'react';
import './MapSide.css';
import { Loader } from '@googlemaps/js-api-loader';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLocationDot } from '@fortawesome/free-solid-svg-icons';
import { useMaps } from '../../utils';

export default function MapSide({address, edit, handleInputChange}) {
    const { mapRef, acResults } = useMaps({ 
        address: address || ''
    });

    return (
        <div className='side-map'>
            <div className='map' ref={mapRef}></div>
            <div className='map-address'>
                <FontAwesomeIcon icon={faLocationDot} />
                {edit ? <textarea name='address' value={address} onChange={handleInputChange} className='edit'>test</textarea> : <p>{address}</p>}
            </div>
            <p onClick={() => handleInputChange({
                target: {
                    name: 'address',
                    value: acResults ? acResults[0] : ''
                }
            })}
            style={{
                visibility: address === acResults[0] ? 'hidden' : 'visible'
            }}>Click to Autocomplete: <strong>{acResults ? acResults[0] : 'No results'}</strong></p>
        </div>
    )
}