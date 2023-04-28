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
    address,
    setNeighborhood
}) => {
    const mapRef = useRef();
    // const acRef = useRef();
    const [maps, setMaps] = useState();
    const [acResults, setAcResults] = useState();

    const { neighborhoods } = useNeighborhoods();

    const runUpdate = useCallback((libraries) => {
        try {
            if (mapRef.current && address && neighborhoods) {
                libraries ||= maps;
                new libraries.Geocoder().geocode({ address }).then(geocode => {
                    const position = geocode.results[0].geometry.location;
                    const map = new libraries.Map(mapRef.current, {
                        center: position,
                        zoom: 16,
                    });
                    new libraries.Marker({ position, map });

                    // const nearestNeighborhoods = neighborhoods.sort((n1, n2) => 
                    //     spherical.computeDistanceBetween(
                    //         [n1.latitude, n1.longitude], position
                    //     ) > spherical.computeDistanceBetween(
                    //         [n2.latitude, n2.longitude], position
                    //     ) ? 1 : -1
                    // );

                    const nearestNeighborhood = neighborhoods.reduce((nearest, current) => 
                        libraries.spherical.computeDistanceBetween(
                            [nearest.latitude, nearest.longitude], position
                        ) < libraries.spherical.computeDistanceBetween(
                            [current.latitude, current.longitude], position
                        ) ? nearest : current
                    );

                    setNeighborhood(nearestNeighborhood);
                });

                new libraries.AutocompleteService()
                    .getPlacePredictions({ input: address, types: ['address'] })
                    .then(({predictions}) => setAcResults(predictions.map(prediction => prediction.description)));
            }
        } catch (e) {
            console.error(e.message);
        }
    }, [mapRef, address, maps, neighborhoods]);
    
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
    }, [mapRef, address])

    return { mapRef, acResults };
}

export const convertRemToPixels = rem => rem * parseFloat(getComputedStyle(document.documentElement).fontSize);

export const dynamicTextArea = e => {
    e.target.style.height = '';
    e.target.style.height = e.target.scrollHeight + 'px';
}