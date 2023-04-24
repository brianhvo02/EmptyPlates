import { useEffect, useRef } from 'react';
import './MapSide.css';
import { Loader } from '@googlemaps/js-api-loader';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLocationDot } from '@fortawesome/free-solid-svg-icons';

export default function MapSide({address}) {
    const mapRef = useRef();

    useEffect(() => {
        if (mapRef.current) {
            const loader = new Loader({
                apiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
                version: "weekly"
            });
              
            loader.load().then(async google => {
                try {
                    const { Map } = await google.maps.importLibrary("maps");
                    const { Marker } = await google.maps.importLibrary("marker")
                    const { Geocoder } = await google.maps.importLibrary("geocoding");
                    const geocode = await new Geocoder().geocode({ address });
                    const position = geocode.results[0].geometry.location;
                    const map = new Map(mapRef.current, {
                        center: position,
                        zoom: 16,
                    });
    
                    new Marker({ position, map });
                } catch(e) {
                    console.error('MapLoader:', e.message)
                }
            });
        }
    }, [mapRef, address])
    

    return (
        <div className='side-map'>
            <div className='map' ref={mapRef}></div>
            <div className='map-address'>
                <FontAwesomeIcon icon={faLocationDot} />
                <p>{address}</p>
            </div>
        </div>
    )
}