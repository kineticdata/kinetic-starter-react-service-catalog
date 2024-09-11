import React, { useContext, useEffect, useMemo, useState } from "react";
import { Box } from "@mui/material";
import { GlobalContext } from "../../Global/GlobalResources/GlobalContextWrapper";
import { PageTitle } from "../../Global/GlobalComponents/Widgets/PageTitle";

export const ServicePortalHome = () => {
    const globalState = useContext(GlobalContext);
    const { updateBreadcrumbs, userProfile } = globalState;

    useEffect(() => {
        updateBreadcrumbs({
            pageNames: ['Service Portal'],
            path: '/service-portal'
        });
    }, [])

    const titleSubtext = useMemo(() => (
        <Box sx={{ fontSize: 'medium', color: 'greyscale.secondary', fontWeight: '400'}}>
            Welcome to the Kinetic Data Service Portal Demo!
        </Box>
    ), [])

    return userProfile && (
        <Box>
            <PageTitle title={`Hello, ${userProfile.displayName}`} subtext={titleSubtext} /> 
            Hello World!
        </Box>
    )
}