import { matchRoutes, useLocation, useNavigate } from "react-router-dom";
import { useSession } from "./store/sessionSlice";
import { useCallback, useEffect, useRef, useState } from "react";
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
    
    return { currentUser, isLoggedIn }
}

export const useMaps = ({
    address
}) => {
    const mapRef = useRef();
    // const acRef = useRef();
    const [maps, setMaps] = useState();
    const [acResults, setAcResults] = useState();

    const runUpdate = useCallback((libraries) => {
        // try {
            if (mapRef.current && address) {
                libraries ||= maps;
                new libraries.Geocoder().geocode({ address }).then(geocode => {
                    const position = geocode.results[0].geometry.location;
                    const map = new libraries.Map(mapRef.current, {
                        center: position,
                        zoom: 16,
                    });
                    new libraries.Marker({ position, map });
                });


                new libraries.AutocompleteService()
                    .getPlacePredictions({ input: address, types: ['address'] })
                    .then(({predictions}) => setAcResults(predictions.map(prediction => prediction.description)));
                // const autocomplete = new Autocomplete(acRef.current, { types: ['address'] });
                // setListener(autocomplete.addListener('place_changed', () => 
                //     autoCompleteListener(autocomplete.getPlace().formatted_address)));
            }
            //  else if (ref.current && autoCompleteListener && stage === 3 && !listener) {
                
            // } else if (nearestNeighborhoodsListener && stage === 4 && neighborhoods) {
            //     const geocode = await new Geocoder().geocode({ address });
            //     const position = geocode.results[0].geometry.location;
            //     const nearestNeighborhoods = neighborhoods.sort((n1, n2) => 
            //         spherical.computeDistanceBetween(
            //             [n1.latitude, n1.longitude], position
            //         ) > spherical.computeDistanceBetween(
            //             [n2.latitude, n2.longitude], position
            //         ) ? 1 : -1
            //     );
            //     nearestNeighborhoodsListener(nearestNeighborhoods);
            // }
        // } catch (e) {
        //     console.error(e.message);
        // }
    }, [mapRef, address, maps]);
    
    useEffect(() => {
        if (!maps) {
            const loader = new Loader({
                apiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
                version: "weekly"
            });

            loader.load().then(async google => {
                const [
                    { Map },
                    { Marker },
                    { Geocoder },
                    { AutocompleteService }
                ] = await Promise.all([
                    'maps',
                    'marker',
                    'geocoding',
                    'places'
                ].map(library => google.maps.importLibrary(library)));

                const libraries = { Map, Marker, Geocoder, AutocompleteService };

                setMaps(libraries);
                runUpdate(libraries);
            });
        } else {
            runUpdate();
        }
    }, [mapRef, address])

    return { mapRef, acResults };
}

export const convertRemToPixels = rem => rem * parseFloat(getComputedStyle(document.documentElement).fontSize);