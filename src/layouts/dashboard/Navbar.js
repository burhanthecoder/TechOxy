import PropTypes from 'prop-types';
import { Icon } from '@iconify/react';
import React from 'react';
import menu2Fill from '@iconify/icons-eva/menu-2-fill';
import refreshFill from '@iconify/icons-eva/refresh-fill';
import { useSelector } from 'react-redux';
// material
import { styled } from '@mui/material/styles';
import { Box, Stack, AppBar, Toolbar, IconButton, Tooltip } from '@mui/material';
// components
import { Search } from '@material-ui/icons';
import InputAdornment from '@mui/material/InputAdornment';
import { MHidden } from '../../components/@material-extend';
//
// import Searchbar from './Searchbar';
import AccountPopover from './AccountPopover';
// import LanguagePopover from './LanguagePopover';
import NotificationsPopover from './Notifications';
import Cart from './Cart';
// ----------------------------------------------------------------------
// const DRAWER_WIDTH = 280;
// const APPBAR_MOBILE = 64;
// const APPBAR_DESKTOP = 92;

const RootStyle = styled(AppBar)(({ theme }) => ({
  // boxShadow: 'none',
  backdropFilter: 'blur(6px)',
  WebkitBackdropFilter: 'blur(6px)', // Fix on Mobile
  // backgroundColor: alpha(theme.palette.background.default, 0.72),
  [theme.breakpoints.up('lg')]: {
    width: `100%`
  }
}));

const Searchbar = styled('input')`
  width: 700px;
  font-size: 0.8rem;
  font-family: IBM Plex Sans, sans-serif;
  font-weight: 400;
  line-height: 1.4375em;
  background: rgb(243, 246, 249);
  border: 1px solid #e5e8ec;
  border-radius: 3px;
  padding: 6px 10px;
  color: #20262d;
  transition: width 300ms ease;

  &:hover {
    background: #eaeef3;
    border-color: #e5e8ec;
  }

  &:focus {
    outline: none;
    // width: 400px;
  }
`;

const Searchbar2 = styled('input')`
  width: 300px;
  font-size: 0.8rem;
  font-family: IBM Plex Sans, sans-serif;
  font-weight: 400;
  line-height: 1.4375em;
  background: rgb(243, 246, 249);
  border: 1px solid #e5e8ec;
  border-radius: 3px;
  padding: 6px 10px;
  color: #20262d;
  transition: width 300ms ease;

  &:hover {
    background: #eaeef3;
    border-color: #e5e8ec;
  }

  &:focus {
    outline: none;
  }
`;

// ----------------------------------------------------------------------

DashboardNavbar.propTypes = {
  onOpenSidebar: PropTypes.func,
  refresh: PropTypes.func
};

export default function DashboardNavbar({ onOpenSidebar, refresh }) {
  const user = useSelector((state) => state.userInfo);
  // const [search,setsearch] = React.useState(false)
  return (
    <>
      <RootStyle>
        <Toolbar color="primary">
          <IconButton onClick={onOpenSidebar} sx={{ mr: 1, color: '#fff' }}>
            <Icon icon={menu2Fill} />
          </IconButton>
          <Tooltip title="Refresh">
            <IconButton onClick={refresh} sx={{ mr: 1, color: '#fff' }}>
              <Icon icon={refreshFill} />
            </IconButton>
          </Tooltip>
          <Stack direction="row" sx={{ flexGrow: 1 }} justifyContent="center">
            <MHidden width="mdDown">
              <Searchbar placeholder="Search Products" aria-label="Search bar" />
            </MHidden>
          </Stack>

          {/* <Searchbar /> */}
          <Box />

          <Stack direction="row" alignItems="center" spacing={{ xs: 0.5, sm: 1.5 }}>
            {/* <LanguagePopover /> */}
            {user.username && <Cart />}
            {user.username && <NotificationsPopover />}
            <AccountPopover />
          </Stack>
        </Toolbar>
        <MHidden width="mdUp">
          <Toolbar color="primary">
            <Stack direction="row" sx={{ flexGrow: 1 }} justifyContent="center">
              <Searchbar2
                placeholder="Search Products "
                aria-label="Search bar Mobile"
                startAdornment={
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                }
              />
            </Stack>
          </Toolbar>
        </MHidden>
      </RootStyle>
    </>
  );
}
