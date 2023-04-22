import React from "react";
import { Link as RouterLink, Outlet, useNavigate } from 'react-router-dom';
import { useSelector } from "react-redux";
// material
import { styled } from '@mui/material/styles';
// components
// import Logo from '../components/Logo';
import logo from '../assets/logob.png';

// ----------------------------------------------------------------------

const HeaderStyle = styled('header')(({ theme }) => ({
  top: 0,
  left: 0,
  lineHeight: 0,
  width: '100%',
  position: 'absolute',
  padding: theme.spacing(3, 3, 0),
  [theme.breakpoints.up('sm')]: {
    padding: theme.spacing(5, 5, 0)
  }
}));

// ----------------------------------------------------------------------

export default function LogoOnlyLayout() {
  const user = useSelector(state=>state.userInfo);
  const navigate = useNavigate()
  React.useEffect(()=>{
    if(user.username){
      navigate('/',{state: {message: 'Already Logged In'}})
    }
  },[navigate, user])
  return (
    <>
      <HeaderStyle>
        <RouterLink to="/">
          <img alt="Shymee Logo" src={logo} width="70" height="70" />
        </RouterLink>
      </HeaderStyle>
      <Outlet />
    </>
  );
}
