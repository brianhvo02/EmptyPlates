import { matchRoutes, useLocation, useNavigate } from "react-router-dom";
import { useSession } from "./store/sessionSlice";
import { useCallback, useEffect, useRef, useState } from "react";
import { Loader } from "@googlemaps/js-api-loader";
import { useNeighborhoods } from "./store/neighborhoodSlice";

const authOwnerRoutes = [
    { path: '/restaurants/new' },
    { path: '/restaurants/:restaurantId/edit' }
];

export const useAuth = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { currentUser, isLoggedIn, neighborhood } = useSession();

    useEffect(() => {
        if (isLoggedIn !== null) {
            if (isLoggedIn) {
                const ownerRoutes = matchRoutes(authOwnerRoutes, location);
                if (ownerRoutes && ownerRoutes.length > 0 && !currentUser.isOwner) navigate('/');
            } else {
                navigate('/');
            }
        }
    }, [location, navigate, currentUser, isLoggedIn]);
    
    return { currentUser, isLoggedIn, neighborhood }
}

export const useMaps = ({
    address,
    setNeighborhood
}) => {
    const mapRef = useRef();
    const [maps, setMaps] = useState();
    const [acResults, setAcResults] = useState();

    const neighborhoods = useNeighborhoods();

    const runUpdate = useCallback(libraries => {
        try {
            if (mapRef.current && address && neighborhoods) {
                libraries ||= maps;
                new libraries.Geocoder().geocode({ address }).then(geocode => {
                    const position = geocode.results[0].geometry.location;
                    const map = new libraries.Map(mapRef.current, {
                        center: position,
                        zoom: 16,
                        disableDefaultUI: true,
                        fullscreenControl: true
                    });
                    new libraries.Marker({ position, map });
                    
                    if (setNeighborhood) {
                        const nearestNeighborhood = neighborhoods.reduce((nearest, current) => {
                            return libraries.spherical.computeDistanceBetween(
                                {
                                    lat: nearest.latitude, 
                                    lng: nearest.longitude
                                }, position
                            ) < libraries.spherical.computeDistanceBetween(
                                {
                                    lat: current.latitude, 
                                    lng: current.longitude
                                }, position
                            ) ? nearest : current;
                        });

                        setNeighborhood(nearestNeighborhood);
                    }
                });

                new libraries.AutocompleteService()
                    .getPlacePredictions({ input: address, types: ['address'] })
                    .then(({predictions}) => setAcResults(predictions.map(prediction => prediction.description)));
            }
        } catch (e) {
            console.error(e.message);
        }
    }, [mapRef, address, maps, neighborhoods, setNeighborhood]);
    
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
                    { AutocompleteService },
                    { spherical }
                ] = await Promise.all([
                    'maps',
                    'marker',
                    'geocoding',
                    'places',
                    'geometry'
                ].map(library => google.maps.importLibrary(library)));

                const libraries = { Map, Marker, Geocoder, AutocompleteService, spherical };
                setMaps(libraries);
                runUpdate(libraries);
            });
        } else {
            runUpdate();
        }
    }, [mapRef, address, maps, runUpdate]);

    return { mapRef, acResults };
}

export const convertRemToPixels = rem => rem * parseFloat(getComputedStyle(document.documentElement).fontSize);

export const dynamicTextArea = e => {
    e.target.style.height = '';
    e.target.style.height = e.target.scrollHeight + 'px';
}