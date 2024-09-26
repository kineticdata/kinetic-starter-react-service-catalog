import React, { useContext, useEffect, useState } from "react";
import { Link as RouterLink } from 'react-router-dom';
import { defineKqlQuery, searchSubmissions } from '@kineticdata/react';
import { GlobalContext } from "../../Global/GlobalResources/GlobalContextWrapper";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import Skeleton from "@mui/material/Skeleton";
import Link from "@mui/material/Link";
import ModeIcon from '@mui/icons-material/Mode';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import { formatDate } from "../../Global/GlobalResources/Helpers";
import { ServicePortalContext } from "../ServicePortalContext";

export const MyItems = () => {
  const globalState = useContext(GlobalContext);
  const { userProfile } = globalState;
  const { username } = userProfile;
  const servicePortalState = useContext(ServicePortalContext);
  const { draftCount, submittedCount } = servicePortalState;
  const [ pageError, setPageError ] = useState();
  const [ submissions, setSubmissions ] = useState()

  const query = defineKqlQuery()
    .in('type', 'type')
    .in('coreState', 'coreState')
    .or()
    .equals('createdBy', 'username')
    .equals('submittedBy', 'username')
    .equals('values[Requested By]', 'username')
    .equals('values[Requested For]', 'username')
    .end()
    .end();

  // useEffect(() => {
  //   const q = query({
  //     type: ['Catalog Item'],
  //     coreState: ['Draft'],
  //     username,
  //   });

  //   searchSubmissions({
  //     kapp: 'catalog',
  //     search: {
  //       count: true,
  //       limit: 0,
  //       include: [],
  //       q,
  //     },
  //   }).then(
  //     result => result.error ? setDraftCount('N/A') && setPageError(result.error) : setDraftCount(result.count));
  // }, []);

  useEffect(() => {
    const q = query({
      type: ['Catalog Item'],
      coreState: ['Submitted', 'Draft'],
      username,
    });

    searchSubmissions({
      kapp: 'catalog',
      search: {
        limit: 5,
        include: ['values', 'details', 'form'],
        q,
      },
    }).then(result => {
      if (result.error) {
        setPageError(result.error);
      } else { 
        setSubmissions(result.submissions)
      }
    })
  }, []);

  return draftCount && submissions && !pageError && (
    <Box
      sx={{
        border: '2px solid',
        borderColor: 'primary.main',
        borderRadius: '.75rem',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="h5" sx={{ m: '1rem', fontStyle: 'bold' }}>
          My Open Tickets
        </Typography>
        <Box>
          {draftCount && submittedCount ?
            <>
              <Chip icon={<ModeIcon sx={{ fontSize: '1rem' }} />} label={draftCount} sx={{ mr: '.5rem' }} />
              <Chip icon={<ConfirmationNumberIcon sx={{ fontSize: '1rem' }} />} label={submittedCount} sx={{ mr: '.5rem' }} />
            </>
            : <Skeleton variant='rounded' animation="wave" width={106} height={32} sx={{ bgcolor: 'greyscale.tertiary', mr: '.5rem' }} />
          }
        </Box>
      </Box>
      <Box sx={{ m: '1rem', display: 'flex', flexDirection: 'column', gap: '.75rem' }}>
        {submissions.map((submission, idx) => (
          <Link
            key={idx}
            component={RouterLink}
            to={`my-items/catalog/${submission.form.slug}/${submission.id}`}
            noWrap
            sx={{
              display: 'flex',
              alignItems: 'center',
              flex: 1,
              p: '.5rem',
              border: '1px solid',
              textDecoration: 'none',
              borderColor: 'primary.main',
              borderRadius: '.75rem',
              '&:hover': {
                bgcolor: 'greyscale.tertiary'
              }
            }}
          >
            {submission.coreState === 'Draft' ?
              <ModeIcon sx={{ fontSize: '1.5rem' }} /> :
              <ConfirmationNumberIcon sx={{ fontSize: '1.5rem' }} />
            }
            <Box sx={{ display: 'flex', flexDirection: 'column', ml: '1rem'}}>
              <Typography sx={{ fontWeight: 'bold'}}>
                {submission.values['Summary']}
              </Typography>
              <Typography sx={{ fontSize: 'medium', color: 'greyscale.secondary', fontWeight: '400', }}>
                Last updated {formatDate(submission.updatedAt, 'MMMM Do, YYYY')}
              </Typography>
            </Box>
          </Link>
        ))}
      </Box>
      <Box sx={{ display: 'flex', mb: '1rem', justifyContent: 'center', alignItems: 'center' }}>
      <Link
        component={RouterLink}
        to={`my-items/draft`}
        sx={{
          p: '.5rem',
          color: 'primary.secondary',
          textDecoration: 'none',
          '&:hover': {
            textDecoration: 'underline',
          }
        }}
      >
        View Draft
      </Link> |
      <Link
        component={RouterLink}
        to={`my-items/submitted`}
        sx={{
          p: '.5rem',
          color: 'primary.secondary',
          textDecoration: 'none',
          '&:hover': {
            textDecoration: 'underline',
          }
        }}
      >
        View Submitted
      </Link> |
      <Link
        component={RouterLink}
        to={`my-items/closed`}
        sx={{
          p: '.5rem',
          color: 'primary.secondary',
          textDecoration: 'none',
          '&:hover': {
            textDecoration: 'underline',
          }
        }}
      >
        View Closed
      </Link>
      </Box>
    </Box>
  )
}