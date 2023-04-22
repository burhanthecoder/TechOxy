import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
// material
import { styled } from '@mui/material/styles';
//
import DashboardNavbar from './Navbar';
import DashboardSidebar from './Sidebar';

// ----------------------------------------------------------------------

const APP_BAR_MOBILE = 50;
const APP_BAR_DESKTOP = 70;

const RootStyle = styled('div')({
  display: 'flex',
  minHeight: '100%',
  overflow: 'hidden'
});

const MainStyle = styled('div')(({ theme }) => ({
  flexGrow: 1,
  overflow: 'auto',
  minHeight: '100%',
  paddingTop: APP_BAR_MOBILE + 24,
  paddingBottom: theme.spacing(10),
  [theme.breakpoints.up('lg')]: {
    paddingTop: APP_BAR_DESKTOP + 24,
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2)
  }
}));

// ----------------------------------------------------------------------
export const ThemeContext = React.createContext()

export default function DashboardLayout() {
  const [open, setOpen] = useState(false);
  const [refkey,setrefkey] = useState(0);

  // React.useEffect(()=>{
  //   if(refkey < 0) {
  //     console.log(refkey);
  //   }
  // },[refkey])

  // const refresh = () => {
  //   setrefkey(refkey+1);
  // }
  // console.log(refkey)
  
  // const getContextValue = React.useCallback(
  //   () => ({key: refkey,refresh: ()=> setrefkey(refkey+1)}),
  //   [refkey],
  // )

  const showSnack = (message, type='default') => {
    const ran = Math.floor(Math.random() * 10001);
    const snackid = `Snack${ran.toString()}`
    const div = document.createElement("div")
    div.id = snackid;
    div.className = `snackbar ${type}`
    const p = document.createElement("p")
    p.className = 'snack-message'
    p.innerHTML = message
    div.append(p)
    document.getElementById('snack-container').append(div)
    // console.log(message, type, snackid)
    setTimeout(() => {
      try{
        document.getElementById(snackid).remove()
      }
      catch {
        console.log('')
      }
    }, 3500);
  }

  return (
    <RootStyle>
      <ThemeContext.Provider value={{key: refkey,refresh: ()=> setrefkey(refkey+1),showSnack: (m,t)=>showSnack(m,t)}}>
        <DashboardNavbar onOpenSidebar={() => setOpen(true)} refresh={ ()=> setrefkey(refkey+1)} />
        <DashboardSidebar isOpenSidebar={open} onCloseSidebar={() => setOpen(false)} />
        <MainStyle>
          <div id='snack-container'> </div>
          <Outlet refkey={refkey} />
          
        </MainStyle>
      </ThemeContext.Provider>
    </RootStyle>
  );
}
