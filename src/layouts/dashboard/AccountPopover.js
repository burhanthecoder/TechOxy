import { Icon } from '@iconify/react';
import { useRef, useState } from 'react';
import homeFill from '@iconify/icons-eva/home-fill';
import personFill from '@iconify/icons-eva/person-fill';
import settings2Fill from '@iconify/icons-eva/settings-2-fill';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
// material
// import { alpha } from '@mui/material/styles';
import { Button, Box, Divider, MenuItem, Typography, Avatar, IconButton, Tooltip, Stack } from '@mui/material';
// components
import MenuPopover from '../../components/MenuPopover';
import noim from "../../assets/noim.jpg";
//
// import account from '../../_mocks_/account';

// ----------------------------------------------------------------------

const MENU_OPTIONS = [
  {
    label: 'Home',
    icon: homeFill,
    linkTo: '/'
  },
  {
    label: 'Profile',
    icon: personFill,
    linkTo: '/profile'
  },
  {
    label: 'My Orders',
    icon: "eva:briefcase-fill",
    linkTo: '/orders'
  },
  {
    label: 'Settings',
    icon: settings2Fill,
    linkTo: '#'
  }
];

// ----------------------------------------------------------------------

export default function AccountPopover() {
  const dispatch = useDispatch()
  const anchorRef = useRef(null);
  const [open, setOpen] = useState(false);
  const user = useSelector(state => state.userInfo)
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const navigate = useNavigate()

  return (
    <>
    <Tooltip title={user.username ? user.username : "Not Logged In"}>
      <span>
      <IconButton
        ref={anchorRef}
        sx={{color: 'white'}}
        onClick={user.username ? handleOpen : () => navigate('/auth/login', {state: { link: '/profile'} })}
      >
        <Icon icon="eva:person-fill" />
      </IconButton>
      </span>
      </Tooltip>

      {/* sx={{
          padding: 0,
          width: 25,
          height: 25,
          ...(open && {
            '&:before': {
              zIndex: 1,
              content: "''",
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              position: 'absolute',
              bgcolor: (theme) => alpha(theme.palette.grey[900], 0.72)
            }
          })
        }} */}
      <MenuPopover
        open={open}
        onClose={handleClose}
        anchorEl={anchorRef.current}
        sx={{ width: 220 }}
      >
        <Stack direction="row" alignItems="center" sx={{ my: 1.5, px: 2  }}>
        <Avatar src={user.photo ? process.env.REACT_APP_DOMAIN +user.photo : noim} alt="Profile" sx={{ width: 37, height: 37 }} />
          <Box sx={{ ml: 1,  }}>
            <Typography variant="subtitle2" noWrap>
              {user.username ? user.username : "Not logged in"}
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary' }} noWrap>
              {user.email}
            </Typography>
          </Box>
        </Stack>

        <Divider sx={{ my: 1 }} />

        {MENU_OPTIONS.map((option) => (
          <MenuItem
            key={option.label}
            to={option.linkTo}
            component={RouterLink}
            onClick={handleClose}
            sx={{ typography: 'body2', py: 1, px: 2.5 }}
          >
            <Box
              component={Icon}
              icon={option.icon}
              sx={{
                mr: 2,
                width: 24,
                height: 24
              }}
            />

            {option.label}
          </MenuItem>
        ))}

        <Box sx={{ p: 2, pt: 1.5 }}>
          <Button fullWidth color="error" onClick={()=>{dispatch({type: 'LOGOUT'});handleClose();navigate('/')}} variant="outlined">
            Logout
          </Button>
        </Box>
      </MenuPopover>
    </>
  );
}
