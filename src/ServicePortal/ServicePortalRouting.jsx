import React from "react";
import { Route, Routes } from 'react-router-dom';
import { ServicePortalHome } from "./ServicePortalPages/ServPortHome";
import { Box } from "@mui/material";

// This component will handle routing for the base Kinetic bundle routes
export const ServicePortalRouting = () => (
    <>
        <Routes>
            <Route  
                path='/'
                element={<ServicePortalHome  />}
            />

        </Routes>
    </>
);
