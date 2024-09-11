import { useEffect } from 'react';

// LandingPage redirects to the kapps list by default,
// update this component if a unique landing page is needed.
export const LandingPage = () => {
    
    // TODO: Decide if we want the landing to default to a single demo 
    // or if we want to have a landing page to select which demo to view?
    useEffect(() => {
        // use location replace so this page does not get added to browser history.
        window.location.replace(`${window.location.href}service-portal`);
    },[])
};          