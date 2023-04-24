import { matchRoutes, useLocation, useNavigate } from "react-router-dom";
import { useSession } from "./store/sessionSlice";
import { useEffect } from "react";

const authOwnerRoutes = [
    {
        path: '/restaurants/new'
    }
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

export const convertRemToPixels = rem => rem * parseFloat(getComputedStyle(document.documentElement).fontSize);