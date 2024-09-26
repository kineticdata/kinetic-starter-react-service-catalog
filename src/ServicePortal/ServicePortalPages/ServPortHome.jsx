import React, { useContext, useEffect, useMemo, useState } from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import { GlobalContext } from '../../Global/GlobalResources/GlobalContextWrapper';
import { PageTitle } from '../../Global/GlobalComponents/Widgets/PageTitle';
import { ServicePortalContext } from '../ServicePortalContext';
import { MyItems } from '../ServicePortalWidgets/MyItems';

export const ServicePortalHome = () => {
  const globalState = useContext(GlobalContext);
  const { updateBreadcrumbs, userProfile } = globalState;
  const location = useLocation();
  const servicePortalState = useContext(ServicePortalContext);
  const { categories, categoryError } = servicePortalState;

  useEffect(() => {
    updateBreadcrumbs({
      pageNames: ['Service Portal'],
      path: '/service-portal',
    });
  }, []);

  // Using the breadcrumbs to return to the My Items page does not give the
  // proper view so we route the use to the submitted view for now
  // TODO: update this to be dynamic based on the status of ticket being viewed
  useEffect(() => {
    if (location.pathname === "/service-portal/my-items") {
      window.location.replace(`${window.location.href}/submitted`);
    }
}, [])

  // prettier-ignore
  const titleSubtext = useMemo(() => (
      <Box
        sx={{
          fontSize: 'medium',
          color: 'greyscale.secondary',
          fontWeight: '400',
        }}
      >
        Welcome to the Kinetic Data Service Portal Demo!
      </Box>
    ), []);

  return !categoryError && categories && userProfile && (
    <Box sx={{ mb: '1rem' }}>
      <PageTitle
        title={`Hello, ${userProfile.displayName}`}
        subtext={titleSubtext}
      />
      <Box sx={{ display: 'flex' }}>
        <Box
          sx={{
            flex: 2,
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            mr: '.5rem',
          }}
        >
          <Box
            sx={{
              border: '2px solid',
              borderColor: 'primary.main',
              height: '20rem',
              borderRadius: '.75rem',
            }}
          >
            <Typography variant="h4" sx={{ m: '1rem', fontStyle: 'bold' }}>
              Example of the latest News article Headline.
            </Typography>
            <Typography sx={{ m: '1rem', fontStyle: 'bold' }}>
              Unsure if we're keeping this. If so it will be static and if we
              have time upgrade to a carousel later.
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'row', gap: '1rem' }}>
            <Box
              sx={{
                flex: 1,
                border: '2px solid',
                borderColor: 'primary.main',
                height: '10rem',
                borderRadius: '.75rem',
              }}
            >
              <Typography variant="h5" sx={{ m: '1rem', fontStyle: 'bold' }}>
                Surveys
              </Typography>
              <Typography sx={{ m: '1rem', fontStyle: 'bold' }}>
                Most likely removing this.
              </Typography>
            </Box>
            <Box
              sx={{
                flex: 1,
                border: '2px solid',
                borderColor: 'primary.main',
                height: '10rem',
                borderRadius: '.75rem',
              }}
            >
              <Typography variant="h5" sx={{ m: '1rem', fontStyle: 'bold' }}>
                System Status
              </Typography>
              <Typography sx={{ m: '1rem', fontStyle: 'bold' }}>
                Most likely removing this.
              </Typography>
            </Box>
          </Box>
          <Typography variant="h5" sx={{ fontStyle: 'bold' }}>
            Recently Used Services
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'row', gap: '1rem' }}>
            {['Service 1', 'Service 2', 'Service 3', 'Service 4'].map(
              (service, idx) => (
                <Box
                  key={idx}
                  sx={{
                    flex: 1,
                    border: '2px solid',
                    borderColor: 'primary.main',
                    height: '15rem',
                    borderRadius: '.75rem',
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{ m: '1rem', fontStyle: 'bold' }}
                  >
                    {service}
                  </Typography>
                </Box>
              ),
            )}
          </Box>
          <Typography variant="h5" sx={{ fontStyle: 'bold' }}>
            Service Categories
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'row', gap: '1rem' }}>
            {categories.map((category, idx) => (
              <Link
                key={idx}
                component={RouterLink}
                to={`service-catalog/${category.slug}`}
                sx={{
                  flex: 1,
                  border: '2px solid',
                  textDecoration: 'none',
                  borderColor: 'primary.main',
                  height: '15rem',
                  borderRadius: '.75rem',
                }}
              >
                <Typography
                  variant="h6"
                  sx={{ m: '1rem', fontStyle: 'bold' }}
                >
                  {category.name}
                </Typography>
              </Link>
            ))}
          </Box>
          <Typography variant="h5" sx={{ fontStyle: 'bold' }}>
            Popular Services
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'row', gap: '1rem' }}>
            {['Service 1', 'Service 2', 'Service 3'].map((service, idx) => (
              <Box
                key={idx}
                sx={{
                  flex: 1,
                  border: '2px solid',
                  borderColor: 'primary.main',
                  height: '15rem',
                  borderRadius: '.75rem',
                }}
              >
                <Typography
                  variant="h6"
                  sx={{ m: '1rem', fontStyle: 'bold' }}
                >
                  {service}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            ml: '.5rem',
          }}
        >
          <MyItems />
          <Box
            sx={{
              border: '2px solid',
              borderColor: 'primary.main',
              height: '30rem',
              borderRadius: '.75rem',
            }}
          >
            <Typography variant="h5" sx={{ m: '1rem', fontStyle: 'bold' }}>
              My Open Actions
            </Typography>
            <Typography sx={{ m: '1rem', fontStyle: 'bold' }}>
              This will display up to 5 actions and route the user to the My
              Items Page.
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
