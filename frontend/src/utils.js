import { matchRoutes, useLocation, useNavigate } from "react-router-dom";
import { useSession } from "./store/sessionSlice";
import { useEffect, useRef, useState } from "react";
import { Loader } from "@googlemaps/js-api-loader";

const authOwnerRoutes = [
    { path: '/restaurants/new' },
    { path: '/restaurants/:restaurantId/edit' }
];

export const useAuth = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { currentUser, isLoggedIn } = useSession();

    useEffect(() => {
        if (currentUser) {
            if (isLoggedIn) {
                const ownerRoutes = matchRoutes(authOwnerRoutes, location);
                if (ownerRoutes && ownerRoutes.length > 0 && !currentUser.isOwner) navigate('/');
            } else {
                navigate('/');
            }
        }
    }, [location, navigate, currentUser, isLoggedIn]);
    
}

export const useMaps = ({
    address, 
    autoCompleteListener, 
    nearestNeighborhoodsListener, 
    stage, 
    neighborhoods
}) => {
    const ref = useRef();
    const [listener, setListener] = useState();
    
    useEffect(() => {
        const loader = new Loader({
            apiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
            version: "weekly"
        });
            
        loader.load().then(async google => {
            try {
                const [
                    { Map },
                    { Marker },
                    { Geocoder },
                    { Autocomplete },
                    { spherical }
                ] = await Promise.all([
                    'maps',
                    'marker',
                    'geocoding',
                    'places',
                    'geometry'
                ].map(library => google.maps.importLibrary(library)));
    
                if (ref.current && address && !neighborhoods) {
                    const geocode = await new Geocoder().geocode({ address });
                    const position = geocode.results[0].geometry.location;
                    const map = new Map(ref.current, {
                        center: position,
                        zoom: 16,
                    });
                    new Marker({ position, map });
                } else if (ref.current && autoCompleteListener && stage === 3 && !listener) {
                    const autocomplete = new Autocomplete(ref.current, { types: ['address'] });
                    setListener(autocomplete.addListener('place_changed', () => 
                        autoCompleteListener(autocomplete.getPlace().formatted_address)));
                } else if (nearestNeighborhoodsListener && stage === 4 && neighborhoods) {
                    const geocode = await new Geocoder().geocode({ address });
                    const position = geocode.results[0].geometry.location;
                    // const nearestNeighborhood = neighborhoods.reduce((n, neighborhood) => 
                    //     spherical.computeDistanceBetween(
                    //         [n.latitude, n.longitude], position
                    //     ) < spherical.computeDistanceBetween(
                    //         [neighborhood.latitude, neighborhood.longitude], position
                    //     ) ? neighborhood : n
                    // );

                    const nearestNeighborhoods = neighborhoods.sort((n1, n2) => 
                        spherical.computeDistanceBetween(
                            [n1.latitude, n1.longitude], position
                        ) > spherical.computeDistanceBetween(
                            [n2.latitude, n2.longitude], position
                        ) ? 1 : -1
                    );
                    nearestNeighborhoodsListener(nearestNeighborhoods);
                }
            } catch (e) {
                console.error(e.message);
            }
        });
    }, [ref, address, autoCompleteListener, nearestNeighborhoodsListener, stage, neighborhoods, listener])

    return { ref };
}

export const convertRemToPixels = rem => rem * parseFloat(getComputedStyle(document.documentElement).fontSize);