import { matchRoutes, useLocation, useNavigate } from "react-router-dom";
import { useSession } from "./store/sessionSlice";
import { useEffect } from "react";

const authRoutes = [];

const authOwnerRoutes = [
    {
        path: '/restaurants/new'
    }
];

export const useAuth = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { currentUser } = useSession();

    useEffect(() => {
        const routes = matchRoutes(authRoutes, location);
        const ownerRoutes = matchRoutes(authOwnerRoutes, location);
        if (
            (ownerRoutes && ownerRoutes.length > 0 && (!currentUser || !currentUser.isOwner))
                || (routes && routes.length > 0 && !currentUser)
        ) navigate('/');
    }, [location, navigate, currentUser]);
    
}