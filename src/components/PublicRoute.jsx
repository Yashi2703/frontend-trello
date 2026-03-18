import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const PublicRoute = () => {
    const storageKey = import.meta.env.VITE_STORAGE_PERSIST_CONFIG_KEY || "project-management-storage";

    let isAuthenticated = false;
    try {
        const clsData = JSON.parse(localStorage.getItem(`persist:${storageKey}`) || "{}");
        const parsedData = clsData?.loginReducer ? JSON.parse(clsData.loginReducer) : {};
        isAuthenticated = !!parsedData?.loginUserToken;
    } catch (e) {
        console.error("Error checking authentication status", e);
    }

    return isAuthenticated ? <Navigate to="/dashboard" replace /> : <Outlet />;
};

export default PublicRoute;
