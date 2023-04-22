import PropTypes from 'prop-types';
import { useEffect } from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { Icon } from '@iconify/react';
// import pieChart2Fill from '@iconify/icons-eva/pie-chart-2-fill';
import homeOut from '@iconify/icons-eva/home-outline';
import peopleFill from '@iconify/icons-eva/people-fill';
import shoppingBagFill from '@iconify/icons-eva/shopping-bag-fill';
import fileTextFill from '@iconify/icons-eva/file-text-fill';
// import lockFill from '@iconify/icons-eva/lock-fill';
// import personAddFill from '@iconify/icons-eva/person-add-fill';
import alertTriangleFill from '@iconify/icons-eva/alert-triangle-fill';
// material
import { styled } from '@mui/material/styles';
import { Box, Link, Drawer, Typography, Avatar } from '@mui/material';
import { useSelector } from 'react-redux';
// components
// import Logo from '../../components/Logo';
import Scrollbar from '../../components/Scrollbar';
import NavSection from '../../components/NavSection';
// import { MHidden } from '../../components/@material-extend';
// import account from '../../_mocks_/account';

import logo from '../../assets/logofw.png';
import noim from '../../assets/noim.jpg';

// ----------------------------------------------------------------------

// ----------------------------------------------------------------------

const getIcon = (name) => <Icon icon={name} width={22} height={22} />;

const DRAWER_WIDTH = 280;

const RootStyle = styled('div')(({ theme }) => ({
  [theme.breakpoints.up('lg')]: {
    flexShrink: 0
    // width: DRAWER_WIDTH
  }
}));

const AccountStyle = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(2, 2.5),
  borderRadius: theme.shape.borderRadiusSm,
  backgroundColor: theme.palette.grey[200]
}));

// ----------------------------------------------------------------------

DashboardSidebar.propTypes = {
  isOpenSidebar: PropTypes.bool,
  onCloseSidebar: PropTypes.func
};

export default function DashboardSidebar({ isOpenSidebar, onCloseSidebar }) {
  const { pathname } = useLocation();
  const user = useSelector((state) => state.userInfo);
  // console.log(user)
  useEffect(() => {
    if (isOpenSidebar) {
      onCloseSidebar();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const userOnly = () => {
    if (user.username) {
      return true;
    }
    return false;
  };

  const sidebarConfig = [
    {
      title: 'home',
      path: '/',
      icon: getIcon(homeOut),
      visible: true
    },
    // {
    //   title: 'dashboard',
    //   path: '/app',
    //   icon: getIcon(pieChart2Fill)
    // },
    {
      title: 'Your Order',
      path: '/orders',
      icon: getIcon(shoppingBagFill),
      visible: true
    },
    {
      title: 'Your Orders',
      path: '/orders',
      icon: getIcon(peopleFill),
      visible: userOnly()
    },
    {
      title: 'profile',
      path: '/profile',
      icon: getIcon(peopleFill),
      visible: userOnly()
    },
    {
      title: 'settings',
      path: '/settings',
      icon: getIcon('eva:settings-2-outline'),
      visible: true
    },
    {
      title: 'about us',
      path: '/about',
      icon: getIcon(fileTextFill),
      visible: true
    },
    {
      title: 'help',
      path: '/help',
      icon: getIcon('eva:question-mark-outline'),
      visible: true
    },
    {
      title: 'Report',
      path: '/report',
      icon: getIcon(alertTriangleFill),
      visible: true
    }
  ];

  const renderContent = (
    <Scrollbar
      sx={{
        height: '100%',
        '& .simplebar-content': { height: '100%', display: 'flex', flexDirection: 'column' }
      }}
    >
      <Box sx={{ px: 2.5, py: 3 }}>
        <Box component={RouterLink} to="/" sx={{ display: 'inline-flex' }}>
          {/* <Logo /> */}
          <img src={logo} alt="Shymee Logo" />
        </Box>
      </Box>

      <Box sx={{ mb: 5, mx: 2.5 }}>
        <Link
          underline="none"
          component={RouterLink}
          to={user.username ? '/profile' : '/auth/login'}
        >
          <AccountStyle>
            <Avatar
              src={user.photo ? process.env.REACT_APP_DOMAIN + user.photo : noim}
              alt="Profile"
            />
            <Box sx={{ ml: 2 }}>
              <Typography variant="subtitle2" sx={{ color: 'text.primary' }}>
                {user.username ? user.username : 'Not logged In'}
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Buyer
              </Typography>
            </Box>
          </AccountStyle>
        </Link>
      </Box>

      <NavSection navConfig={sidebarConfig} />

      <Box sx={{ flexGrow: 1 }} />

      {/* <Box sx={{ px: 2.5, pb: 3, mt: 10 }}>
        <Stack
          alignItems="center"
          spacing={3}
          sx={{
            p: 2.5,
            pt: 5,
            borderRadius: 2,
            position: 'relative',
            bgcolor: 'grey.200'
          }}
        >
          <Box
            component="img"
            src="/static/illustrations/illustration_avatar.png"
            sx={{ width: 100, position: 'absolute', top: -50 }}
          />

          <Box sx={{ textAlign: 'center' }}>
            <Typography gutterBottom variant="h6">
              Get more?
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              From only $69
            </Typography>
          </Box>

          <Button
            fullWidth
            href="https://material-ui.com/store/items/minimal-dashboard/"
            target="_blank"
            variant="contained"
          >
            Upgrade to Pro
          </Button>
        </Stack>
      </Box> */}
    </Scrollbar>
  );

  return (
    <RootStyle>
      {/* <MHidden width="lgUp"> */}
      <Drawer
        open={isOpenSidebar}
        onClose={onCloseSidebar}
        PaperProps={{
          sx: { width: DRAWER_WIDTH }
        }}
      >
        {renderContent}
      </Drawer>
      {/* </MHidden> */}
      {/* 
      <MHidden width="lgDown">
        <Drawer
          open
          variant="persistent"
          PaperProps={{
            sx: {
              width: DRAWER_WIDTH,
              bgcolor: 'background.default'
            }
          }}
        >
          {renderContent}
        </Drawer>
      </MHidden> */}
    </RootStyle>
  );
}
