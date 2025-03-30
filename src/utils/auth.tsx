import { jwtDecode } from "jwt-decode";
import React, { useState, useEffect, ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";

interface ProtectedRouteProps {
    children: ReactNode;
}

const AdminProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    const location = useLocation();
    const [isAdmin, setIsAdmin] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [checkDone, setCheckDone] = useState(false);

    useEffect(() => {
        const checkAdminAuth = () => {
            console.log("AdminProtectedRoute: Checking admin status");
            const token = localStorage.getItem("token");
            
            if (!token) {
                setIsAuthenticated(false);
                setIsAdmin(false);
                setCheckDone(true);
                return;
            }
            
            const userData = localStorage.getItem("user");
            if (userData) {
                try {
                    const user = JSON.parse(userData);
                    setIsAuthenticated(true);
                    setIsAdmin(user.peran === "Admin");
                } catch (error) {
                    console.error("Error parsing user data:", error);
                    setIsAuthenticated(true);
                    setIsAdmin(false);
                }
            } else {
                setIsAuthenticated(true);
                setIsAdmin(false);
            }
            
            setCheckDone(true);
        };

        checkAdminAuth();
        
        const timeoutId = setTimeout(checkAdminAuth, 300);
        return () => clearTimeout(timeoutId);
    }, [location.pathname]);

    if (!checkDone) {
        return (
            <div className="flex justify-center items-center">
                <div className="text-center">
                    <h2 className="text-xl font-bold py-24">Verifying admin privileges...</h2>
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }
    
    if (!isAdmin) {
        return <Navigate to="/dashboard" state={{ from: location }} replace />;
    }

    return <>{children}</>;
};


const AuthenticatedProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    const location = useLocation(); 
    const [directTokenCheck, setDirectTokenCheck] = useState(false); 
    const [localCheckDone, setLocalCheckDone] = useState(false); 

    useEffect(() => { 

        // CEK LOCALSTORAGE
        const checkLocalAuth = () => { 
            console.log("ProtectedRoute: Checking auth status");
            const token = localStorage.getItem("token");

            if (token) {
                setDirectTokenCheck(true); 
            } else {
                setDirectTokenCheck(false); 
            }

            setLocalCheckDone(true);
        };

        checkLocalAuth();

        // Set up a short timeout to recheck, in case localStorage was updated after mount
        const timeoutId = setTimeout(checkLocalAuth, 300);
        return() => clearTimeout(timeoutId);

    }, [location.pathname])

    if (!localCheckDone) {
        console.log("ProtectedRoute: Still loading auth status");

        return (
            <div className="flex justify-center items-center">
                <div className="text-center">
                    <h2 className="text-xl font-bold py-24">Verifying your authentication...</h2>
                </div>
            </div>
        )
    }

    if (!directTokenCheck) {
        console.log(
            "ProtectedRoute: Unauthenticated user, rendering auth page"
        );
        return <>{children}</>;
    }

    toast.success("Login berhasil!")

    return <Navigate to="/dashboard" state={{ from: location }} replace />;
};

const UnauthenticatedProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => { 
    const location = useLocation();
    const [directTokenCheck, setDirectTokenCheck] = useState(false);
    const [localCheckDone, setLocalCheckDone] = useState(false);

    useEffect(() => {

        // CEK LOCALSTORAGE
        const checkLocalAuth = () => { 
            console.log("ProtectedRoute: Checking auth status");
            const token = localStorage.getItem("token");
        
            if (token) {
                try {
                    const decoded = jwtDecode<{ exp: number }>(token);
                    console.log(decoded);
                    console.log(Date.now());
                    const isExpired = decoded.exp * 1000 < Date.now();
        
                    if (isExpired) {
                        console.log("Token expired, logging out...");
                        localStorage.removeItem("token");
                        setDirectTokenCheck(false);
                    } else {
                        setDirectTokenCheck(true);
                    }
                } catch (error) {
                    console.error("Invalid token:", error);
                    setDirectTokenCheck(false);
                }
            } else {
                setDirectTokenCheck(false);
            }
        
            setLocalCheckDone(true);
        };

        checkLocalAuth();

        // Set up a short timeout to recheck, in case localStorage was updated after mount
        const timeoutId = setTimeout(checkLocalAuth, 300);
        return() => clearTimeout(timeoutId);

    }, [location.pathname])
    
    if (!localCheckDone) {
        console.log("ProtectedRoute: Still loading auth status");

        return (
            <div className="flex justify-center items-center">
                <div className="text-center">
                    <h2 className="text-xl font-bold py-24">Verifying your authentication...</h2>
                </div>
            </div>
        )
    }

    if (directTokenCheck) {
        console.log(
            "ProtectedRoute: Authentication confirmed, rendering protected content"
        );
        return <>{children}</>;
    }

    console.log("ProtectedRoute: Not authenticated, redirecting to login =>  directTokenCheck", {directTokenCheck}, "page location :", {from: location.pathname})

    toast.error("Token Expired: silahkan login kembali!")

    return <Navigate to="/login" state={{ from: location }} replace />;
}

export {AdminProtectedRoute, UnauthenticatedProtectedRoute, AuthenticatedProtectedRoute};