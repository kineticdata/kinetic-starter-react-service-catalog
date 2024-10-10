import React, { useContext, useRef, useState } from 'react';
import { styled } from '@mui/material/styles';
import { ServicePortalContext } from '../../../ServicePortal/ServicePortalContext';
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';

const DebounceInput = props => {
  const { handleDebounce, debounceTimeout, ...other } = props;
  
  const timerRef = useRef(undefined);
  
  const handleChange = (event) => {
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      handleDebounce(event.target.value);
    }, debounceTimeout);
  };

  return <InputBase {...other} onChange={handleChange} />;
}

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  marginRight: '1rem',
  borderRadius: theme.shape.borderRadius,
  '&:hover': {
    backgroundColor: theme.palette.greyscale.tertiary,
  },
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(1),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  color: theme.palette.secondary.secondary,
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 10,
}));

const StyledInputBase = styled(DebounceInput)(({ theme }) => ({
  color: 'inherit',
  width: '100%',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    [theme.breakpoints.up('sm')]: {
      width: '0rem',
      '&:focus': {
        width: '20rem',
        color: theme.palette.greyscale.main,
        border: 'solid 1px',
        borderColor: theme.palette.greyscale.secondary,
        borderRadius: theme.shape.borderRadius,
        backgroundColor: theme.palette.greyscale.quaternary,
      },
    },
  },
}));

// TODO: add functionality.
export const SearchAppBar = ({ isSearchOpen, setIsSearchOpen }) => {
  const servicePortalState = useContext(ServicePortalContext);
  const { setSearchText } = servicePortalState;

  const handleDebounce = value => {
    setSearchText(value);
  };

  return (
    <Search>
      <SearchIconWrapper>
        <SearchIcon />
      </SearchIconWrapper>
      <StyledInputBase
        placeholder="Search…"
        inputProps={{
          'aria-label': 'search',
          onChange: e => {
            !isSearchOpen && setIsSearchOpen('search', e);
          },
        }}
        debounceTimeout={2000}
        handleDebounce={handleDebounce}
      />
    </Search>
  );
};
