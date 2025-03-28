import React, { useState, useEffect, ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";

interface ProtectedRouteProps {
    children: ReactNode;
}

const AuthenticatedProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    const location = useLocation(); // informasi lokasi halaman
    const [directTokenCheck, setDirectTokenCheck] = useState(false); // cek apakah token ditemuin scr lgsg di localStorage
    const [localCheckDone, setLocalCheckDone] = useState(false); // status apakah pengecekan lokal udh selesai

    useEffect(() => { // cek status autentikasi pengguna tiap kali ada perubahan state

        // FUNCTION UTK CEK LOCALSTORAGE
        const checkLocalAuth = () => { 
            console.log("ProtectedRoute: Checking auth status");
            const token = localStorage.getItem("token");

            if (token) {
                setDirectTokenCheck(true); // ubah status kalau udh ngelakuin directTokenCheck
            } else {
                setDirectTokenCheck(false); // ubah status kalau udh ngelakuin directTokenCheck
            }

            setLocalCheckDone(true);
        };

        checkLocalAuth();

        // Set up a short timeout to recheck, in case localStorage was updated after mount
        const timeoutId = setTimeout(checkLocalAuth, 300);
        return() => clearTimeout(timeoutId);

    }, [location.pathname])

    // Kalau lagi dalam proses cek lokal, atau lagi proses autentikasi, tampilin status lagi Verifying
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

    return <Navigate to="/dashboard" state={{ from: location }} replace />;
};

const UnauthenticatedProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {  // ambil data isAuthenticated, isLoading, dan checkAuthStatus tuh dari data login user?
    const location = useLocation(); // informasi lokasi halaman
    const [directTokenCheck, setDirectTokenCheck] = useState(false); // cek apakah token ditemuin scr lgsg di localStorage
    const [localCheckDone, setLocalCheckDone] = useState(false); // status apakah pengecekan lokal udh selesai

    useEffect(() => { // cek status autentikasi pengguna tiap kali ada perubahan state

        // FUNCTION UTK CEK LOCALSTORAGE
        const checkLocalAuth = () => { 
            console.log("ProtectedRoute: Checking auth status");
            const token = localStorage.getItem("token");

            if (token) {
                setDirectTokenCheck(true); // ubah status kalau udh ngelakuin directTokenCheck
            } else {
                setDirectTokenCheck(false); // ubah status kalau udh ngelakuin directTokenCheck
            }

            setLocalCheckDone(true);
        };

        checkLocalAuth();

        // Set up a short timeout to recheck, in case localStorage was updated after mount
        const timeoutId = setTimeout(checkLocalAuth, 300);
        return() => clearTimeout(timeoutId);

    }, [location.pathname])
    // checking local storage auth bakal dilakuin tiap user pindah halaman

    // Kalau lagi dalam proses cek lokal, atau lagi proses autentikasi, tampilin status lagi Verifying
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

    // yeay proses autentikasi utk route udh selesai dan user bisa masuk ke page yang dituju
    return <Navigate to="/login" state={{ from: location }} replace />;
}

export {UnauthenticatedProtectedRoute, AuthenticatedProtectedRoute};