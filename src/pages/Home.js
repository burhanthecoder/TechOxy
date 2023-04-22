// material
import { Box, Grid, Container, Typography, Stack, Toolbar, Avatar, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import axios from 'axios';
import React from 'react';
import Slider from 'react-slick';
import Products from 'src/comps/Products';
import { ThemeContext } from 'src/layouts/dashboard';
import { styled } from '@mui/material/styles';
// components
import Page from '../components/Page';
// import {
//   AppTasks,
//   AppNewUsers,
//   AppBugReports,
//   AppItemOrders,
//   AppNewsUpdate,
//   AppWeeklySales,
//   AppOrderTimeline,
//   AppCurrentVisits,
//   AppWebsiteVisits,
//   AppTrafficBySite,
//   AppCurrentSubject,
//   AppConversionRates
// } from '../components/_dashboard/app';

// import mob from "../assets/mob.jpg"
// import fas from "../assets/fas.png"

import noim from "../assets/noim.jpg"

// ----------------------------------------------------------------------

export default function Home() {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    // autoplay: true
  };
  const cont = React.useContext(ThemeContext)
  // console.log(cont)
  // const [banners,setbanners] = React.useState([])
  // const [products,setproducts] = React.useState([])
  // const [categories,setcategories] = React.useState([])
  const [elements,setelements] = React.useState({banners: [],categories: [],exclusive: [],dailydeal: [],random: [],secondary: [],primary: [],})
  console.log(process.env.REACT_APP_DOMAIN)
  const fetch = React.useCallback( () => {
    axios.get(`${process.env.REACT_APP_DOMAIN}/home`)
    .then((resp)=>{
      console.log(resp.data)
      // setbanners(resp.data.banners)
      // setproducts(resp.data.products)
      // setcategories(resp.data.categories)
      setelements({banners: resp.data.banners,categories: resp.data.categories,exclusive: resp.data.products,dailydeal: resp.data.dailydeal,random: resp.data.random,secondary: resp.data.secondary,primary: resp.data.primary})
    })
    .catch((err)=>{
      console.log(err)
    })
  },[])
  React.useEffect(()=>{
    // console.log('entered')
    fetch()
  },[fetch,cont.key])

  // console.log(cont.key)
  
  

  const ToolbarStyle = styled(Toolbar)(() => ({
    backgroundColor: '#fff',
    boxShadow: '0px 2px 4px -1px rgb(145 158 171 / 20%), 0px 4px 5px 0px rgb(145 158 171 / 14%), 0px 1px 10px 0px rgb(145 158 171 / 12%);'
  }));

  // const categories = [
  //   {name: 'Fashion', image: fas, link: ''},
  //   {name: 'Mobile', image: mob, link: '#'},
  //   {name: 'Electronics', image: mob, link: '#'},
  //   {name: 'Men Wear', image: mob, link: '#'},
  //   {name: 'Women Wear', image: mob, link: '#'},
  //   {name: 'Mobile', image: mob, link: '#'},
  //   {name: 'Mobile', image: mob, link: '#'},
  // ]


  return (
    <Page title="Dashboard | Shymee">
      <Container maxWidth="xxl">
        
      <ToolbarStyle sx={{mb: 2}}>
          {/* <Stack direction="row" alignItems="center" justifyContent="center" spacing={{ xs: 0.5, sm: 1.5 }} sx={{p:1,width: '100%'}}> */}
            <Grid container spacing={1} > 
            {elements.categories.map((item, index)=> (
              <Grid key={index} item xs={3} sm={2} md={1}>
              <Link to={`/products?category=${item.name}`} style={{textDecoration: 'none'}}  >
                <Stack direction="column" alignItems="center" spacing={{ xs: 0.5, sm: 1.5 }} sx={{p: 1}}>
                  <Avatar src={item.image ? process.env.REACT_APP_DOMAIN + item.image : noim} sx={{width: 50, height: 50}} />
                  <Typography variant="subtitle2" color="common.black" style={{marginTop: '3px'}}>{item.name}</Typography>
                </Stack>
              </Link>
              </Grid>
            ))}
            </Grid>
          {/* </Stack> */}
        </ToolbarStyle>

        <Slider {...settings}>
          {elements.banners.map((item,index) => 
          
              <div key={index} style={{width: '100%'}}>
                <img src={process.env.REACT_APP_DOMAIN +item.image} style={{width: '100%'}} alt={item.name} />
                </div>
            )}
        </Slider>


        <Stack sx={{ pt: 5 }} direction="row" justifyContent="space-between">
          <Typography variant="h5">Deals of the Day</Typography>
          <Link style={{textDecoration: 'none'}}   to="/products"><Button >View All</Button></Link>
        </Stack>
        <Box sx={{ pt: 5 }}>
          <Products products={elements.dailydeal} />
        </Box>

        {elements.primary[0] && elements.primary[1] && 
        <Box sx={{ mt: 5, borderRadius: '16px',overflow: 'hidden' }}>
        <Grid container spacing={4}>
            <Grid item xs={12} sm={6}>
                <img src={process.env.REACT_APP_DOMAIN +elements.primary[0].image} style={{width: '100%'}} alt={elements.primary[0].name} />
            </Grid>
            <Grid item xs={12} sm={6}>
                <img src={process.env.REACT_APP_DOMAIN +elements.primary[1].image} style={{width: '100%'}} alt={elements.primary[1].name} />
            </Grid>
        </Grid>
        </Box>}

        <Stack sx={{ pt: 5 }} direction="row" justifyContent="space-between">
          <Typography variant="h5">Exclusive Products</Typography>
          <Link style={{textDecoration: 'none'}}   to="/products"><Button >View All</Button></Link>
        </Stack>
        <Box sx={{ pt: 5 }}>
          <Products products={elements.exclusive} />
        </Box>

        {elements.secondary[0] && elements.secondary[1] && 
        <Box sx={{ mt: 5, borderRadius: '16px',overflow: 'hidden' }}>
        <Grid container spacing={4}>
            <Grid item xs={12} sm={6}>
                <img src={process.env.REACT_APP_DOMAIN +elements.secondary[0].image} style={{width: '100%'}} alt={elements.secondary[0].name} />
            </Grid>
            <Grid item xs={12} sm={6}>
                <img src={process.env.REACT_APP_DOMAIN +elements.secondary[1].image} style={{width: '100%'}} alt={elements.secondary[1].name} />
            </Grid>
        </Grid>
        </Box>}


        <Stack sx={{ pt: 5 }} direction="row" justifyContent="space-between">
          <Typography variant="h5">Explore Products</Typography>
          <Link style={{textDecoration: 'none'}}   to="/products"><Button >View All</Button></Link>
        </Stack>
        <Box sx={{ pt: 5 }}>
          <Products products={elements.random} />
        </Box>
        {/* <Box sx={{ pb: 5, pt: 5 }}>
          <Typography variant="h4">Hi, Welcome back</Typography>
        </Box> */}
        <Grid container spacing={3}>
          {/* <Grid item xs={12} sm={6} md={3}>
            <AppWeeklySales />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <AppNewUsers />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <AppItemOrders />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <AppBugReports />
          </Grid>

          <Grid item xs={12} md={6} lg={8}>
            <AppWebsiteVisits />
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <AppCurrentVisits />
          </Grid>

          <Grid item xs={12} md={6} lg={8}>
            <AppConversionRates />
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <AppCurrentSubject />
          </Grid>

          <Grid item xs={12} md={6} lg={8}>
            <AppNewsUpdate />
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <AppOrderTimeline />
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <AppTrafficBySite />
          </Grid>

          <Grid item xs={12} md={6} lg={8}>
            <AppTasks />
          </Grid> */}
        </Grid>
      </Container>
    </Page>
  );
}
