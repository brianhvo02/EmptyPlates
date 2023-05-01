import { useEffect, useRef, useState } from 'react';
import './MapSide.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLocationDot } from '@fortawesome/free-solid-svg-icons';
import { dynamicTextArea, useMaps } from '../../utils';

export default function MapSide({address, credit, setInput}) {
    const textarea = useRef();
    const [tempAddress, setTempAddress] = useState(address || '');
    const [neighborhood, setNeighborhood] = useState('');
    
    const { mapRef, acResults } = useMaps({ 
        address: tempAddress || address || '',
        setNeighborhood
    });

    useEffect(() => {
        if (neighborhood && setInput) {
            setInput(prev => ({
                ...prev,
                neighborhoodId: neighborhood.id
            }));
        }
    }, [neighborhood, setInput]);

    useEffect(() => {
        if (textarea?.current) {
            dynamicTextArea({
                target: textarea.current
            });
        }
    }, [textarea]);

    useEffect(() => setTempAddress(address), [address]);

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
                setInput(prev => ({
                    ...prev,
                    address: acResults[0]
                }))
                setTempAddress(acResults[0]);
            }}
            style={{
                display: (!credit || (credit && acResults && tempAddress === acResults[0] && address === acResults[0])) ? 'none' : 'block'
            }}>Click to Autocomplete: <strong>{acResults ? acResults[0] : 'No results'}</strong></p>
        </div>
    )
}