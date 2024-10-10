import React from "react";
import { Route, Routes } from 'react-router-dom';
import { ServicePortalHome } from "./ServicePortalPages/ServPortHome";
import { ServPortMyItems } from "./ServicePortalPages/ServPortMyItems";
import { ServiceCatalog } from "./ServicePortalPages/ServiceCatalog";
import { ServPortSubmission } from "./ServicePortalPages/ServPortSubmission";
import { ServPortService } from "./ServicePortalPages/ServPortService";

// This component will handle routing for the base Kinetic bundle routes
export const ServicePortalRouting = () => (
    <>
        <Routes>
            <Route  
                path='/*'
                element={<ServicePortalHome  />}
            />
            <Route  
                path='/my-items/:view'
                element={<ServPortMyItems  />}
            />
            <Route  
                path='/my-items/:kappSlug/:formSlug/:submissionsId'
                element={<ServPortSubmission  />}
            />
            <Route  
                path='/service/:kappSlug/:formSlug'
                element={<ServPortService  />}
            />
            <Route  
                path='/service-catalog/:catalog'
                element={<ServiceCatalog  />}
            />
        </Routes>
    </>
);
