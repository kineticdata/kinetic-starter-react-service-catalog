import React, { useContext, useEffect, useMemo, useState } from 'react';
import { defineKqlQuery, searchSubmissions, deleteSubmission, bundle } from '@kineticdata/react';
import { handleErrors, paramBuilder, headerBuilder } from '@kineticdata/react/lib/apis/http';
import { useParams, useNavigate, Link as RouterLink } from 'react-router-dom';
import { PageTitle } from '../../Global/GlobalComponents/Widgets/PageTitle';
import { GlobalContext } from '../../Global/GlobalResources/GlobalContextWrapper';
import { ServicePortalContext } from '../ServicePortalContext';
import { formatDate } from '../../Global/GlobalResources/Helpers';
import axios from 'axios';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import CloseIcon from '@mui/icons-material/Close';
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';
import FileCopyOutlinedIcon from '@mui/icons-material/FileCopyOutlined';

export const ServPortMyItems = () => {  
  const globalState = useContext(GlobalContext);
  const { updateBreadcrumbs, userProfile } = globalState;
  const { username } = userProfile || {};
  const servicePortalState = useContext(ServicePortalContext);
  const { draftCount, submittedCount, closedCount } = servicePortalState;
  const navigate = useNavigate();
  const { view } = useParams();
  const [ activeCat, setActiveCat ] = useState(view)
  const [ pageError, setPageError ] = useState();
  const [ currentItems, setCurrentItems ] = useState();
  const [ isDeleteOpen, setIsDeleteOpen ] = useState(false);
  const [ isCloneOpen, setIsCloneOpen ] = useState(false);
  const [ submissionId, setSubmissionId ] = useState();

  const viewArray = useMemo(() => {
    return [
      'Mine',
      'Unassigned',
      'Created by Me',
      'Draft',
      'Submitted',
      'Closed'
      ]
  }, [])

  const query = defineKqlQuery()
    .in('type', 'type')
    .equals('coreState', 'coreState')
    .or()
    .equals('createdBy', 'username')
    .equals('submittedBy', 'username')
    .equals('values[Requested By]', 'username')
    .equals('values[Requested For]', 'username')
    .end()
    .end();

  useEffect(() => {
    setActiveCat(view)
}, [view])

  useEffect(() => {
    updateBreadcrumbs({
      pageNames: ['Service Portal', 'My Items'],
      path: '/service-portal/my-items/submitted',
    });
  }, []);

  useEffect(() => {
    if (username && ['draft', 'submitted', 'closed'].includes(view)) {
      const q = query({
        type: ['Catalog Item'],
        coreState: view,
        username,
      });
  
      searchSubmissions({
        kapp: 'catalog',
        search: {
          count: true,
          limit: 1000,
          include: ['values', 'details', 'form', 'form.attributesMap'],
          q,
        },
      }).then((response, error) => {
        if (error) {
          setPageError(error);
        } else {
          setCurrentItems(response.submissions)
        }
      })
    }
  }, [view, username]);

  const cloneSubmission = options => {
    const { id, completed = false, ...opts } = options;
  
    const path = `${bundle.apiLocation()}/submissions/${id}/clone`;
    const params = { ...paramBuilder(options), completed };
    const formData = new FormData();
    formData.append('submission', JSON.stringify({ "values": {} }));
  
    return (
      axios
        .post(path, formData, { params, headers: headerBuilder(options) })
        // Remove the response envelop and leave us with the submission one.
        .then(() => navigate(0))
        // Clean up any errors we receive. Make sure this the last thing so that it
        // cleans up any errors.
        .catch(handleErrors)
    );
  };

  const getCount = category => {
    switch (category) {
      case 'Draft' : return draftCount;
      case 'Submitted' : return submittedCount;
      case 'Closed' : return closedCount;
      default: 'N/A';
    }
  };

  const confirmDeleteSubmission = () => {
    deleteSubmission({ id: submissionId, values: {} }).then(({error}) => !error ? navigate(0) && setSubmissionId(null) : setPageError(error));
  }

  const confirmCloneSubmission = () => {
    cloneSubmission({ id: submissionId }).then(({error}) => !error ? navigate(0) && setSubmissionId(null) : setPageError(error));
  }

  return !pageError && currentItems && (
    <Box sx={{ mb: '1rem' }}>
      <PageTitle title={`My Items`} />
      <Box sx={{ display: 'flex', gap: '1rem'}}>
        <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
          {viewArray.map((category, idx) => (
              <Link
                key={idx}
                replace={true}
                to={`/service-portal/my-items/${category.toLowerCase()}`}
                component={RouterLink}
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  textDecoration: 'none',
                  bgcolor: activeCat === category.toLocaleLowerCase() && 'greyscale.tertiary',
                  borderRight: activeCat === category.toLocaleLowerCase() && '3px solid',
                  borderRightColor: activeCat === category.toLocaleLowerCase() && 'primary.secondary',
                  p: '1.5rem',
                  '&:hover': {
                    bgcolor: 'greyscale.tertiary'
                  }
                }}
              >
                <Box>
                  {category === 'Submitted' ? 'Open' : category}
                </Box>
                <Box>
                  {getCount(category)}
                </Box>
              </Link>
            ))
          }
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', flex: 3, gap: '1rem', maxHeight: '70vh', overflow: 'scroll' }}>
          
        {currentItems.length ? currentItems.map((item, idx) => (
              <Box
                key={idx}
                sx={{
                  display: 'flex',
                  textDecoration: 'none',
                  border: '2px solid',
                  borderColor: 'primary.main',
                  borderRadius: '.75rem',
                  '&:hover': {
                    bgcolor: 'greyscale.tertiary'
                  }
                }}
                onClick={() => {}}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', m: '1.5rem' }}>
                  <Link
                    to={`/service-portal/my-items/catalog/${item.form.slug}/${item.id}`}
                    component={RouterLink} 
                    sx={{ display: 'flex', alignItems: 'center', width: '100%', textDecoration: 'none' }}
                  >
                    <Box className={`${item.form.attributesMap['Icon'] && `las ${item.form.attributesMap['Icon'][0]}`}`} sx={{ fontSize: '2.25rem', height: '2.25rem', mr: '1.5rem' }} />
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                      <Typography>{item.form.name}</Typography>
                      <Typography variant='h5' sx={{ fontStyle: 'bold' }}>{item.values['Summary']}</Typography>
                      <Typography>{`${item.handle} - Opened ${formatDate(item.createdAt, 'MMMM Do, YY')} by ${item.createdBy}`}</Typography>
                    </Box>
                  </Link>
                  <Box sx={{ minWidth: '10rem'}}>
                    <FormControl fullWidth>
                      <InputLabel id="select-ticket-action">Actions</InputLabel>
                      <Select
                        autoWidth
                        labelId="select-ticket-action"
                        id="select-ticket-action"
                        label="Actions"
                        onChange={() => {}}
                      >
                        {/* For some reason wrapping the MenuItems in a Box removes the default bgColor */}
                        <Box>
                          <MenuItem onClick={() => navigate(`/service-portal/my-items/catalog/${item.form.slug}/${item.id}`)}>
                            <ArrowRightAltIcon sx={{ pr: '.5rem', fontSize: '1.5rem' }} />
                            View Ticket
                          </MenuItem>
                          {view === 'submitted' && 
                            <MenuItem onClick={() => {
                                setSubmissionId(item.id);
                                setIsCloneOpen(true);
                              }}
                            >
                              <FileCopyOutlinedIcon sx={{ pr: '.5rem', fontSize: '1.5rem' }} />
                              Clone Ticket
                            </MenuItem>
                          }
                          <MenuItem onClick={() => {
                              setSubmissionId(item.id);
                              setIsDeleteOpen(true);
                            }}>
                              <CloseIcon sx={{ pr: '.5rem', fontSize: '1.5rem' }} />
                              Delete Ticket
                          </MenuItem>
                        </Box>
                      </Select>
                    </FormControl>
                  </Box>
                </Box>
              </Box>
            )) : 
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>There are currently no tickets of this type.</Box>
          }
        </Box>
      </Box>
      <Modal
        open={isDeleteOpen || isCloneOpen}
        onClose={() => isDeleteOpen ? setIsDeleteOpen(false) : setIsCloneOpen(false)}
        aria-labelledby="delete-submission"
        aria-describedby="delete-this-submission"
      >
        <Box
        id='delete-submission-modal-wrapper'
        sx={{
            width: '38.125rem',
            position: 'absolute',
            top: '30%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            bgcolor: 'greyscale.quaternary',
            p: '2.5rem',
            borderRadius: '.25rem'
        }}
        >
            <>
                <Box 
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        lineHeight: '1.25',
                        fontSize: '1.5rem',
                        fontWeight: '600',
                        borderBottom: '1px solid',
                        borderColor: 'secondary.secondary',
                        mb: '1.5rem',
                        pb: '1.5rem'
                    }}
                    >
                        {`${isCloneOpen ? 'Clone' : 'Delete'} Submission`}
                    <Button 
                        onClick={() => isDeleteOpen ? setIsDeleteOpen(false) : setIsCloneOpen(false)} 
                        sx={{ 
                        minWidth: '0',
                        color: 'primary.secondary',
                        fontWeight: 'bold',
                        '&:hover': {
                            color: 'primary.main',
                            backgroundColor: 'primary.quaternary',
                        },
                        }} 
                        aria-label="Close Modal."
                    >
                        <CloseIcon sx={{p: '.5rem', fontSize: '2.5rem'}} />
                    </Button>
                </Box>
                <Box>
                    <Box>{`Are you sure you want to ${isCloneOpen ? 'clone' : 'delete'} this Submission?`}</Box>
                    <Box sx={{ 
                        display: 'flex', 
                        justifyContent: 'flex-end', 
                        gap: '1.5rem', 
                        mt: '1.5rem', 
                        pt: '1.5rem', 
                        borderTop: '1px solid', 
                        borderTopColor: 'secondary.secondary' 
                    }}>
                        <Button 
                            aria-label="Delete submission."
                            onClick={() => isCloneOpen ? confirmCloneSubmission() : confirmDeleteSubmission()}
                            sx={{ 
                                bgcolor: 'error.secondary', 
                                color: 'greyscale.quinary', 
                                '&:hover': {
                                  backgroundColor: 'error.main',
                                },
                            }}
                        >
                            {`${isCloneOpen ? 'Clone' : 'Delete'} Submission`}
                        </Button>
                    </Box>
                </Box>
            </>
        </Box>
      </Modal>
    </Box>
  );
};

