import PropTypes from 'prop-types';
import { noCase } from 'change-case';
import { useRef, useState, useEffect, useContext } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import moment from 'moment';
// import { formatDistanceToNow } from 'date-fns';
import { Icon } from '@iconify/react';
import bellFill from '@iconify/icons-eva/bell-fill';
import clockFill from '@iconify/icons-eva/clock-fill';
import doneAllFill from '@iconify/icons-eva/done-all-fill';
import axios from 'axios';
import { useSelector } from 'react-redux';
// material
import { alpha } from '@mui/material/styles';
import {
  Box,
  List,
  Badge,
  Button,
  Avatar,
  Tooltip,
  Divider,
  IconButton,
  Typography,
  ListItemText,
  ListSubheader,
  ListItemAvatar,
  ListItemButton
} from '@mui/material';
// utils
// components
import Scrollbar from '../../components/Scrollbar';
import MenuPopover from '../../components/MenuPopover';
import { ThemeContext } from ".";

// ----------------------------------------------------------------------



NotificationItem.propTypes = {
  noti: PropTypes.object
};

function NotificationItem({ noti }) {
  return (
    <ListItemButton
      to="#"
      disableGutters
      component={RouterLink}
      disabled={noti.seen}
      sx={{
        py: 1.5,
        px: 2.5,
        mt: '1px',
      }}
    >
      <ListItemAvatar>
        <Avatar sx={{ bgcolor: 'background.neutral',color: "primary.main" }}><Icon color="common.black" icon="eva:calendar-fill" /></Avatar>
      </ListItemAvatar>
      <ListItemText
        primary={
          <Typography variant="subtitle2">
            {noti.title}
            <Typography component="span" variant="body2" sx={{ color: 'text.secondary' }}>
              &nbsp; {noCase(noti.description)}
            </Typography>
          </Typography>
        }
        secondary={
          <Typography
            variant="caption"
            sx={{
              mt: 0.5,
              display: 'flex',
              alignItems: 'center',
              color: 'text.disabled'
            }}
          >
            <Box component={Icon} icon={clockFill} sx={{ mr: 0.5, width: 16, height: 16 }} />
            {/* {formatDistanceToNow(new Date(notification.date))} */}
            {/* {formatDistanceToNow(new Date(noti.date))}  HERE */}
            {moment(noti.date).fromNow()} ago
          </Typography>
        }
      />
    </ListItemButton>
  );
}

export default function Notifications() {
  const anchorRef = useRef(null);
  const [open, setOpen] = useState(false);
  // const [notifications, setNotifications] = useState(NOTIFICATIONS);
  // const totalUnRead = notifications.filter((item) => item.isUnRead === true).length;
  const user = useSelector(state => state.userInfo);
  const cont = useContext(ThemeContext);
  const [notis,setnotis] = useState({seen: [],unseen: []})
  useEffect(()=>{
    axios.get(`${process.env.REACT_APP_DOMAIN}/notifications`,{headers: {'Authorization': `Token ${user.token}`}})
    .then((resp)=> {
      // console.log(resp.data);
      setnotis(resp.data)
    })
    .catch((err)=>{
      console.log(err)
    })
  },[user, cont.key])

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  // const handleMarkAllAsRead = () => {
  //   setNotifications(
  //     notifications.map((notification) => ({
  //       ...notification,
  //       isUnRead: false
  //     }))
  //   );
  // };

  const markAll = () => {
    console.log("markall");
  }

  return (
    <>
    <Tooltip title="Notifications">
      <IconButton
        ref={anchorRef}
        size="large"
        onClick={handleOpen}
        sx={{
          ...(open && {
            bgcolor: (theme) => alpha(theme.palette.primary.main, theme.palette.action.focusOpacity)
          }),color: "#fff"
        }}
      >
        <Badge badgeContent={notis.unseen.length} color="error">
          <Icon icon={bellFill} width={20} height={20} />
        </Badge>
      </IconButton>
      </Tooltip>

      <MenuPopover
        open={open}
        onClose={handleClose}
        anchorEl={anchorRef.current}
        sx={{ width: 360 }}
      >
        {/* <div style={{maxWidth: '300px'}}> */}
        <Box sx={{ display: 'flex', alignItems: 'center', py: 2, px: 2.5 }}>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="subtitle1">Notifications</Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              You have {notis.unseen.length} unread messages
            </Typography>
          </Box>

          {notis.unseen.length > 0 && (
            <Tooltip title=" Mark all as read">
              <IconButton color="primary" onClick={markAll}>
                <Icon icon={doneAllFill} width={20} height={20} />
              </IconButton>
            </Tooltip>
          )}
        </Box>

        <Divider />

        <Scrollbar sx={{ height: { xs: 340 } }}>


          
            <List
                disablePadding
                subheader={
                  <ListSubheader disableSticky sx={{ py: 1, px: 2.5, typography: 'overline' }}>
                    New
                  </ListSubheader>
                }
              >
                {notis.unseen.map((notification) => (
                  <NotificationItem key={notification.id} noti={notification} />
                ))}
              </List>


          
              <List
                disablePadding
                subheader={
                  <ListSubheader disableSticky sx={{ py: 1, px: 2.5, typography: 'overline' }}>
                    Seen
                  </ListSubheader>
                }
              >
                {notis.seen.map((notification) => (
                  <NotificationItem key={notification.id} noti={notification} />
                ))}
              </List>
          
        </Scrollbar>

        <Divider />

        <Box sx={{ p: 1 }}>
          <Button fullWidth disableRipple component={RouterLink} to="#">
            Dismiss Read
          </Button>
        </Box>
        {/* </div> */}
      </MenuPopover>
    </>
  );
}
