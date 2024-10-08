import React, { useContext, useEffect, useMemo, useState } from 'react';
import { fetchForms, defineKqlQuery } from '@kineticdata/react';
import { PageTitle } from '../../Global/GlobalComponents/Widgets/PageTitle';
import { GlobalContext } from '../../Global/GlobalResources/GlobalContextWrapper';
import { useParams, Link as RouterLink } from 'react-router-dom';
import { ServicePortalContext } from '../ServicePortalContext';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';

export const ServiceCatalog = () => {  
  const globalState = useContext(GlobalContext);
  const { updateBreadcrumbs } = globalState;
  const servicePortalState = useContext(ServicePortalContext);
  const { categories, categoryError } = servicePortalState;
  const { catalog } = useParams();
  const [ activeCat, setActiveCat ] = useState();
  const [ pageError, setPageError ] = useState();
  const [ forms, setForms ] = useState();

  useEffect(() => {
    updateBreadcrumbs({
      pageNames: ['Service Portal', 'Service Catalog'],
      path: '/service-portal/catalog',
    });
  }, []);

  useEffect(() => {
      setActiveCat(categories.filter(cat => cat.slug === catalog)[0]?.name)
  }, [categories, catalog])

  // pretier ignore
  useEffect(() => {
    if (activeCat) {
      const getQuery = defineKqlQuery().equals('category', 'category').end();
      const q = getQuery({ category: activeCat})
      fetchForms({ kappSlug: 'catalog', q, include: 'attributesMap, kapp' }).then(( forms, error) => {
        if (!error) {
          setForms(forms.forms);
        } else {
          setPageError(error);
        }
      })
    }
  }, [activeCat])
  
  // pretier ignore
  const titleSubtext = useMemo(() => (
      <Box
        sx={{ fontSize: 'medium', color: 'greyscale.secondary', fontWeight: '400' }}>
        Request a service
      </Box>
    ), []);

  return forms && !pageError && !categoryError && (
    <Box sx={{ mb: '1rem' }}>
      <PageTitle title={`Service Catalog`} subtext={titleSubtext} />
      <Box sx={{ display: 'flex', gap: '1rem'}}>
        <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
          {categories.map((category, idx) => (
              <Link
                key={idx}
                to={`/service-portal/service-catalog/${category.slug}`}
                component={RouterLink}
                sx={{
                  display: 'flex',
                  textDecoration: 'none',
                  bgcolor: activeCat === category.name && 'greyscale.tertiary',
                  borderRight: activeCat === category.name && '3px solid',
                  borderRightColor: activeCat === category.name && 'primary.secondary',
                  p: '1.5rem',
                  '&:hover': {
                    bgcolor: 'greyscale.tertiary'
                  }
                }}
                onClick={() => setActiveCat(category.name)}
              >
                {category.name}
              </Link>
            ))
          }
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', flex: 3, gap: '1rem', maxHeight: '70vh', overflow: 'scroll' }}>
          
        {forms.map((form, idx) => (
              <Link
                key={idx}
                component={RouterLink}
                to={`/service-portal/service/${form.kapp.slug}/${form.slug}`}
                sx={{
                  display: 'flex',
                  textDecoration: 'none',
                  border: '2px solid',
                  borderColor: 'primary.main',
                  borderRadius: '.75rem',
                  p: '1.5rem',
                  '&:hover': {
                    bgcolor: 'greyscale.tertiary'
                  }
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Box className={`${form.attributesMap['Icon'] && `las ${form.attributesMap['Icon'][0]}`}`} sx={{ fontSize: '2.25rem', height: '2.25rem', mr: '1.5rem' }} />
                  <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    <Typography variant='h5' sx={{ fontStyle: 'bold' }}>
                      {form.name}
                    </Typography>
                    <Typography sx={{
                      fontSize: 'medium',
                      color: 'greyscale.secondary',
                      fontWeight: '400',
                    }}>
                      {form.description}                      
                    </Typography>
                  </Box>
                </Box>
              </Link>
            ))
          }
        </Box>
      </Box>
    </Box>
  );
};
