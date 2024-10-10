import React, { useContext, useEffect, useState } from "react";
import { defineKqlQuery, searchSubmissions, fetchForms } from '@kineticdata/react';
import { ServicePortalContext } from "../../../ServicePortal/ServicePortalContext";
import { Link as RouterLink } from 'react-router-dom';
import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";

export const SearchContent = ({ closeMenu }) => {
  const servicePortalState = useContext(ServicePortalContext);
  const { searchText } = servicePortalState;
  const [ ticketsLoading, setTicketsLoading ] = useState(true);
  const [ formsLoading, setFormsLoading ] = useState(true);
  const [ ticketData, setTicketData ] = useState();
  const [ formData, setFormData ] = useState();
  const [ ticketError, setTicketError ] = useState();
  const [ formError, setFormError ] = useState();

  const query = defineKqlQuery()
  .startsWith('values[Summary]', 'searchText')
  .end();

  useEffect(() => {
    const q = query({ searchText });

    searchSubmissions({
      kapp: 'catalog',
      orderBy: 'values[Summary]',
      direction: 'desc',
      search: {
        limit: 20,
        include: ['values', 'details', 'form', 'form.attributesMap'],
        q,
      },
    }).then((response, error) => {
      if (error) {
        setTicketError(error);
      } else {
        setTicketData(response.submissions);
        setTicketsLoading(false);
      }
    });

    fetchForms({ kappSlug: 'catalog', include: 'details, kapp' }).then(({ forms, error}) => {
      if (error) {
        setFormError(error);
      } else {
        setFormData(forms.filter(form => form.name.toLowerCase().includes(searchText.toLowerCase())));
        setFormsLoading(false);
      }
    })
  },[searchText]);

  const generateMatches = type => {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <Typography sx={{ fontWeight: 'bold', fontSize: '1.25rem', pb: '.5rem' }}>{type === 'ticket' ? 'Ticket Matches' : 'Service Matches'}</Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', maxHeight: 300, overflow: 'scroll' }}>
          {type === 'ticket' ?
            (ticketData.length ? ticketData.map((ticket, idx) => 
              <Link
                key={idx}
                to={`/service-portal/my-items/catalog/${ticket.form.slug}/${ticket.id}`}
                component={RouterLink}
                onClick={closeMenu}
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  textDecoration: 'none',
                  borderRadius: '.25rem',
                  maxWidth: 400,
                  p: '.5rem',
                  '&:hover': {
                    bgcolor: 'greyscale.tertiary'
                  }
                }}
              >
                <Typography sx={{ fontWeight: 'bold' }}>{ticket.values['Summary']}</Typography>
                <Typography sx={{ fontSize: '.75rem' }}>{ticket.values['Detail']}</Typography>
              </Link>
            ) : 'No matching tickets.')
            : 
            (formData.length ? formData.map((form, idx) =>
              <Link
                key={idx}
                to={`/service-portal/service/${form.kapp.slug}/${form.slug}`}
                component={RouterLink}
                onClick={closeMenu}
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  textDecoration: 'none',
                  borderRadius: '.25rem',
                  maxWidth: 400,
                  p: '.5rem',
                  '&:hover': {
                    bgcolor: 'greyscale.tertiary'
                  }
                }}
              > 
                <Typography sx={{ fontWeight: 'bold' }}>{form.name}</Typography>
                <Typography sx={{ fontSize: '.75rem' }}>{form.description}</Typography>
              </Link>
            ) : 'No matching services.')
          }
        </Box>
      </Box>
    )
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <Box sx={{ m: '1rem' }}>
        {!ticketsLoading && !ticketError && ticketData ? 
          generateMatches('ticket') :
          <Skeleton variant='overlay' sx={{ width: 600, height: 132, borderRadius: '.75rem' }} />
        }
      </Box>
      <Box sx={{ m: '1rem' }}>
        {!formsLoading && !formError && formData ? 
          generateMatches('form') :
          <Skeleton variant='overlay' sx={{ width: 600, height: 132, borderRadius: '.75rem' }} />
        }
      </Box>
    </Box>
  )
}