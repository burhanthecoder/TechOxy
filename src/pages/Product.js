
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { Icon } from '@iconify/react';
import axios from 'axios';
import moment from 'moment';
import { useSelector } from 'react-redux';
// import { format, parse } from 'date-fns';
// import Products from 'src/comps/Products';
// material
import { Container, Stack, Typography, Grid, Card, CardHeader, Divider, Box, Button, IconButton, Tooltip, Rating, TextField } from '@mui/material';
// components
import { ThemeContext } from 'src/layouts/dashboard';
import { makePayment } from 'src/payment';
import useRazorpay from "react-razorpay";
import Page from '../components/Page';
import noim from "../assets/noim.jpg"

// ----------------------------------------------------------------------

export default function Product() {
  const Razorpay = useRazorpay(
    {
      key_id: 'rzp_test_dCc7zFPTy5AGCv',
        key_secret: 'yW0YMhG0nbcNJ3s4dba47FeQ',
    }
  );
  
  const location =  useLocation()
  const navigate = useNavigate()
  const user = useSelector(state=> state.userInfo);
  // const [products,setproducts] = useState([])
  // console.log(location)
  const [product,setproduct] = useState(location.state || {id: location.pathname.substring(9,location.pathname.length)});
  const [reviews, setreviews] = useState([])
  const [review, setreview] = useState({open: false, title: '', desciption: '',rating: 0,hover: -1,loading: false})
  // console.log(location.pathname.substring(9,location.pathname.length))
  const cont = React.useContext(ThemeContext)
  React.useEffect(()=>{
    axios.get(`${process.env.REACT_APP_DOMAIN}/get/${product.id}`,{headers: {'Authorization': `Token ${user.token}`}})
    .then((resp)=>{
      // console.log(resp.data)
      setproduct(resp.data.product)
      setreviews(resp.data.reviews)
    })
    .catch((err)=>{
      console.log(err)
    })
  },[user.token,cont.key, product.id])
  // console.log(product)

  const added = product.cart && (product.cart.map(a => a.user.id).includes(user.id))
  // console.log(product.cart.map(a => a.user.id).includes(user.id))
  // console.log(product.cart)
  // console.log(user.token)
  const add = () => {
    if(user.token){
      axios.put(`${process.env.REACT_APP_DOMAIN}/cart/${product.id}/1`,{},{headers: {'Authorization': `Token ${user.token}`}})
      .then((resp)=>{
          console.log(resp.data)
          cont.refresh()
      })
      .catch((err)=>{
          console.log(err)
      })
    }
    else{
      cont.showSnack('You need to login to proceed','error')
      navigate('/auth/login',{state: { link: `/product/${product.id}`} })
    }
  }
  const remove = () => {
    axios.put(`${process.env.REACT_APP_DOMAIN}/cart/${product.id}/3`,{},{headers: {'Authorization': `Token ${user.token}`}})
    .then(()=>{
        // console.log(resp.data)
        cont.refresh()
    })
    .catch((err)=>{
        console.log(err)
    })
  }

  const reviewSave = () => {
    setreview({...review,loading: true})
    axios.post(`${process.env.REACT_APP_DOMAIN}/reviews/p=${product.id}`,review,{headers: {'Authorization': `Token ${user.token}`}})
    .then(()=>{
        // console.log(resp.data)
        cont.refresh()
        setreview({open: false, title: '', desciption: '',rating: 0,hover: -1,loading: false})
    })
    .catch((err)=>{
        console.log(err)
        setreview({...review,loading: false})
    })
    console.log('entered')
  }

  return (
    <Page title="Dashboard: Products | Shymee">
      <Container maxWidth="xxl">
        {/* <Typography variant="h4" sx={{ mb: 5 }}>
          Products
        </Typography> */}
        <Stack direction="row" sx={{mb: 2}}>
          <Button color="inherit" onClick={()=>navigate(-1) || navigate('/')} ><Icon icon="eva:arrow-ios-back-outline" /> Go Back</Button>
          </Stack>
        <Card sx={{p: 1}}>
          <Grid container spacing={4}>
            <Grid item xs={12} sm={6} >
              <Box 
                component="img"
                alt={product.title || ''}
                src={product.image || noim}
                sx={{ width: '100%', borderRadius: 1.5 }} />
            </Grid>


            <Grid item xs={12} sm={6}>
              <Card sx={{boxShadow: 'none', pl: 1}}>
                <CardHeader title={
                  <Typography variant="h5" >{product.title || ''}</Typography>
                } />
                <Stack direction="column" sx={{p: 1.5}}>
                  <Typography variant="h4" >{product.price ? product.price > product.finalprice && 
                  <Typography
                          component="span"
                    variant="h4"
                    sx={{
                      color: 'text.disabled',
                      textDecoration: 'line-through'
                    }}
                  >
                  ₹{product.price || ''}
                  </Typography> : null}
                  &nbsp;
                  ₹{product.finalprice || ''}</Typography>
                  {/* <Typography variant="subtitle1">Contact</Typography> */}
                  <Typography sx={{mt: 1}}>{product.description || ''}</Typography>
                  <Divider sx={{my: 3}} />
                  <Stack direction="row" sx={{mt: 2,pb: 2}} justifyContent="space-around">
                    <Button color="secondary" variant="contained" onClick={added ? remove : add}>{added ? 'Remove from Cart' : 'Add to Cart'}</Button>
                    <Button color="primary" variant="outlined" onClick={() =>{
                      // eslint-disable-next-line react-hooks/rules-of-hooks
                     
                     makePayment(product.finalprice, Razorpay)
                      
                    }}>Buy Now</Button>
                  </Stack>
                  <Stack direction="row" sx={{mt: 2,pb: 2}} justifyContent="space-between">
                    <Typography variant="h5" >Top Reviews</Typography>
                    {review.open ?
                    <div>
                      <Tooltip title="Save"><IconButton disabled={review.loading} onClick={reviewSave} ><Icon icon="eva:save-outline" /></IconButton></Tooltip>
                      <Tooltip title="Cancel"><IconButton disabled={review.loading} onClick={()=>setreview({open: false, title: '', desciption: '',rating: 0})} ><Icon icon="eva:close-outline" /></IconButton></Tooltip>
                    </div>
                    :
                    <Tooltip title="Add a Review"><IconButton onClick={()=>user.token ? setreview({...reviews,open: true}): navigate('/auth/login')} ><Icon icon="akar-icons:edit" /></IconButton></Tooltip>
                    }
                    </Stack>
                  {review.open && 
                  <Grid container spacing={2} sx={{p: 2}}>
                    <Grid item xs={6}>
                      <Stack direction="row">
                        <Tooltip title={`${review.hover ? review.hover.toString() : '0'}`} placement="top">
                          <Rating name="simple-rating" disabled={review.loading} defaultValue={review.rating} precision={0.1} onChangeActive={(event, newHover) => setreview({...review,hover: newHover})} onChange={(e,val)=>setreview({...review,rating: val})} />
                        </Tooltip>
                        <Typography variant="subtitle2" sx={{ml: 2}}>{review.rating}</Typography>
                        </Stack>
                    </Grid>
                    <Grid item xs={6}>
                      <TextField value={review.title} disabled={review.loading} fullWidth onChange={(e)=>setreview({...review,title: e.target.value})} variant="standard" placeholder="Title of Review" />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField multiline fullWidth disabled={review.loading} value={review.desciption} onChange={(e)=>setreview({...review,description: e.target.value})} variant="standard" placeholder="Describe your Review" />
                    </Grid>
                  </Grid>
                  }
                  <Stack direction="column" sx={{mt: 2,pb: 2}} justifyContent="space-around">
                    {reviews.length < 1 ?
                    <Typography>No Reviews here. Be the first one to review</Typography>
                    :
                    (reviews.slice(0, 5).map((rev)=>(
                      <Stack direction="row" key={rev.id} alignItems="center" justifyContent="space-between" sx={{py: 1.5}} >
                        <Stack direction="row" alignItems="center" spacing={2}>
                            <Box
                              component="img"
                              alt={rev.title}
                              src={rev.user.photo ? process.env.REACT_APP_DOMAIN+rev.user.photo: "https://media.istockphoto.com/vectors/profile-placeholder-image-gray-silhouette-no-photo-vector-id1016744034?k=20&m=1016744034&s=612x612&w=0&h=kjCAwH5GOC3n3YRTHBaLDsLIuF8P3kkAJc9RvfiYWBY="}
                              sx={{ width: 48, height: 48, borderRadius: 1.5, objectFit: 'cover' }}
                            />
                          <Box sx={{ minWidth: 240 }}>
                              <Typography variant="subtitle1" color="primary" noWrap>
                                {rev.user.username}
                              </Typography>
                              <Stack direction="row" alignItems="center">
                                <Typography variant="subtitle2" noWrap>
                                  {rev.title} 
                                </Typography>
                                <Rating name="simple-rating" sx={{ml: 2}} readOnly defaultValue={rev.rating} precision={0.1} size="small" />
                                <Typography variant="body2" sx={{ml: 1}} noWrap>
                                  {rev.rating} 
                                </Typography>
                              </Stack>
                            <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
                              {rev.description}
                            </Typography>
                          </Box>
                        </Stack>
                        <Typography variant="caption" sx={{ pr: 3, flexShrink: 0, color: 'text.secondary' }}>
                             {/* {format(parse(rev.date, "yyyy-MM-dd'T'HH:mm:ss.SSSxxx", new Date()),"DD MMM YY")} HERE */}
                             {moment(rev.date).format("Do MMM YY [at] h:mm a")}
                         </Typography>
                      </Stack>
                    )))
                    }
                  </Stack>
                </Stack>
              </Card>
            </Grid>
          </Grid>
        </Card>
      </Container>
    </Page>
  );
}
