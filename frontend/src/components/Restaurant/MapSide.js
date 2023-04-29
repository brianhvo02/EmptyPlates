import { useEffect, useRef, useState } from 'react';
import './MapSide.css';
import { Loader } from '@googlemaps/js-api-loader';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLocationDot } from '@fortawesome/free-solid-svg-icons';
import { dynamicTextArea, useDebug, useMaps } from '../../utils';

export default function MapSide({address, credit, handleInputChange}) {
    const textarea = useRef();
    const [tempAddress, setTempAddress] = useState(address || '');
    const [neighborhood, setNeighborhood] = useState('');
    
    const { mapRef, acResults } = useMaps({ 
        address: tempAddress || address || '',
        setNeighborhood
    });

    useEffect(() => {
        if (neighborhood && handleInputChange) {
            handleInputChange({
                target: {
                    name: 'neighborhoodId',
                    value: neighborhood.id
                }
            });
        }
    }, [neighborhood]);

    useEffect(() => {
        if (textarea?.current) {
            dynamicTextArea({
                target: textarea.current
            });
        }
    }, [textarea.current]);

    useEffect(() => setTempAddress(address), [address]);

    // useEffect(() => acResults ? console.log(acResults, tempAddress === acResults[0], address === acResults[0]) : () => {}, [acResults, address, tempAddress])

    return (
        <div className='side-map'>
            <div className='map' ref={mapRef}></div>
            <div className='map-address'>
                <FontAwesomeIcon icon={faLocationDot} />
                {credit ? 
                    <textarea ref={textarea} onFocus={dynamicTextArea} name='address' autoComplete="off"
                        value={tempAddress} onChange={e => setTempAddress(e.target.value)} onInput={dynamicTextArea} className='edit' 
                        placeholder='Search for restaurant address here'/>
                    : <p>{address}</p>}
            </div>
            <p onClick={() => {
                handleInputChange({
                    target: {
                        name: 'address',
                        value: acResults[0]
                    }
                });
                setTempAddress(acResults[0]);
            }}
            style={{
                display: (!credit || (credit && acResults && tempAddress === acResults[0] && address === acResults[0])) ? 'none' : 'block'
            }}>Click to Autocomplete: <strong>{acResults ? acResults[0] : 'No results'}</strong></p>
        </div>
    )
}