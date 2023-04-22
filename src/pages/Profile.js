// material
import { Box, Grid, Container, Typography, Stack, Avatar, Card, CardHeader, Divider, IconButton, Tooltip, TextField, Button, Link } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import moment from "moment";
// import { formatDistanceToNow } from 'date-fns';
import PropTypes from 'prop-types';
import { Icon } from '@iconify/react';
import axios from 'axios';
import React from 'react';
import { ThemeContext } from 'src/layouts/dashboard';
import { Link as RouterLink } from 'react-router-dom';
import Scrollbar from 'src/components/Scrollbar';
import noim from 'src/assets/noim.jpg';
// components
import Page from '../components/Page';
// import { AppCurrentVisits } from '../components/_dashboard/app';

// ----------------------------------------------------------------------

OrderItem.propTypes = {
  news: PropTypes.object
};

function OrderItem({ news }) {
  const { image, title, description, category, id } = news;

  return (
    <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
      <Stack direction="row" alignItems="center" spacing={2}>
          <Box
            component="img"
            alt={title}
            src={image}
            sx={{ width: 48, height: 48, borderRadius: 1.5 }}
          />
        <Box sx={{ minWidth: 240 }}>
          <Link to={`/product/${id}`} state={news} color="inherit" underline="hover" component={RouterLink}>
            <Typography variant="subtitle2" noWrap>
              {title}
            </Typography>
          </Link>
          <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
            {description}
          </Typography>
        </Box>
      </Stack>
      <Typography variant="caption" sx={{ pr: 3, flexShrink: 0, color: 'text.secondary' }}>
          {category.category.name} | {category.name}
       </Typography>
    </Stack>
  );
}


export default function Profile() {
  
  const cont = React.useContext(ThemeContext)
  const input = React.useRef()
  
  const [edits,setedits] = React.useState({pic: false, profile: false, address: false,password: false})
  const user = useSelector(state=>state.userInfo)
  const [user2, setuser2] = React.useState({})
  const [propic,setpropic] = React.useState({pic: user.photo ? process.env.REACT_APP_DOMAIN +user.photo : noim,image: undefined})
  const [details,setdetails] = React.useState({name: user.name || '', contact: user.contact || '',loading: false })
  const [cart,setcart] = React.useState([])
  const [favs,setfavs] = React.useState([])
  const [address, setaddress] = React.useState([])
  const [password,setpassword] = React.useState({old: '',password: '',loading: false})
  const [newadds , setnewadds] = React.useState(0)

  const fetch = React.useCallback( () => {
    axios.get(`${process.env.REACT_APP_DOMAIN}/profiling`,{headers: {'Authorization': `Token ${user.token}`}})
    .then((resp)=>{
      // console.log(resp.data)
      setcart(resp.data.cart)
      setfavs(resp.data.favorites)
      setuser2(resp.data.profile)
      setaddress(resp.data.profile.address)
    })
    .catch((err)=>{
      console.log(err)
    })
  },[user.token])

  React.useEffect(()=>{
    fetch()
  },[fetch,cont.key])

  const dispatch = useDispatch()

  const inputChange = (e) => {
    setpropic({pic: URL.createObjectURL(e.target.files[0]),image: e.target.files[0]})
  }
  const inputSave = () => {
    setpropic({...propic,loading: true})
    const formdata = new FormData();
    formdata.append('photo', propic.image, `${user.username}-profile`)
    axios.put(`${process.env.REACT_APP_DOMAIN}/editprofiling`,formdata,{headers: {'Authorization': `Token ${user.token}`}})
    .then((resp)=>{
      // console.log(resp.data)
      dispatch({type: 'LOGIN',payload: resp.data.details})
      setpropic({...propic,loading: false})
      setedits({...edits,pic: false})
    })
    .catch((err)=> {
      console.log(err)
    })
  }
  const detailsSave = () => {
    setdetails({...details,loading: true})
    axios.post(`${process.env.REACT_APP_DOMAIN}/editprofiling`,details,{headers: {'Authorization': `Token ${user.token}`}})
    .then((resp)=>{
      // console.log(resp.data)
      dispatch({type: 'LOGIN',payload: resp.data.details})
      setdetails({...details,loading: false})
      setedits({...edits,profile: false})
    })
    .catch((err)=> {
      console.log(err)
    })
  }

  const newAddress = () => {
    setaddress([...address,{name: '',street: '',landmark: '', city: '', state: '', country: 'India',pin: '',edit: true, loading: false}])
    setnewadds(newadds+1)
    // console.log('newaddress')
  }

  const cancelAddress = () => {
    fetch()
    setnewadds(0)
  }

  const handleChange = (e,index) => {
    const items = [...address];
    const item = {...items[index]};
    item[e.target.name] = e.target.value;
    items[index] = item;
    setaddress(items)
  }

  const editAdd = (index) => {
    const items = [...address];
    const item = {...items[index]};
    item.edit = true;
    items[index] = item;
    setaddress(items)
  }

  // const cityChange = (e,val) => {
  //   console.log(e,val)
  // }
  // console.log(address)
  const saveAdd = (index) => {
    if (address[index].name.length < 2 || address[index].street.length < 2 || address[index].city.length < 2) {
      return 0;
    }
    const items = [...address];
    const item = {...items[index]};
    item.loading = true;
    items[index] = item;
    setaddress(items)
    axios.post(`${process.env.REACT_APP_DOMAIN}/addressing`,address[index],{headers: {'Authorization': `Token ${user.token}`}})
    .then(()=>{
      // console.log(resp)
      const items = [...address];
      const item = {...items[index]};
      item.loading = false;
      items[index] = item;
      setaddress(items)
      fetch()
    })
    .catch((err)=> {
      console.log(err)
    })
    return false;
  }
  // console.log(user2.last_login ? formatDistanceToNow(new Date(user2.last_login)) : '')
  const savePassword = () => {
    if (password.old.length < 2 || password.new.length < 2 ) {
      return 0;
    }
    setpassword({...password,loading: true})
    axios.post(`${process.env.REACT_APP_DOMAIN}/change`,password,{headers: {'Authorization': `Token ${user.token}`}})
    .then((resp)=>{
      // console.log(resp.data)
      if(resp.data.type==="error"){
        // console.log(resp.data.message)
        setpassword({...password,loading: false})
      }
      else{
        setpassword({...password,loading: false})
        setedits({...edits, password: false})
      }
    })
    .catch((err)=> {
      console.log(err)
    })
    return false
  }
  return (
    <Page title="Profile | Shymee">
      <Container maxWidth="xxl">
        <input ref={input} style={{display: 'none'}} type="file" onChange={inputChange} accept="image/*" />
        {/* <Paper> */}
        {/* <Card> */}
          {/* <CardHeader title="Profile" /> */}

          
          <Box sx={{ pb: 5, pt: 2 }}>
            <Typography variant="h4">Profile Page</Typography>
          </Box>
          
          <Grid container spacing={4}>
            <Grid item xs={12} sm={4} >
                <Card sx={{mt: 1,boxShadow: 'none'}}>
                <CardHeader title={
                <Stack direction="row" sx={{p: 0}} justifyContent="space-between">
                  <Typography variant="h6" >Picture</Typography>
                    {edits.pic ?
                    <Stack direction="row">
                      <Tooltip title="Save">
                        <IconButton disabled={propic.loading} onClick={inputSave}>
                          <Icon icon="eva:save-outline" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Cancel">
                        <IconButton disabled={propic.loading} onClick={()=>setedits({...edits,pic: false})}>
                          <Icon icon="eva:close-outline" />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                    :
                      <IconButton onClick={()=>{input.current.click();setedits({...edits,pic: true})}}>
                        <Icon icon="eva:edit-outline" />
                      </IconButton>}
                </Stack>
                } 
                />
                <Stack direction="row" justifyContent="center">
                  <Avatar sx={{width: 200,height: 200}} src={propic.pic} alt="Profile " />
                </Stack>
                </Card>
            </Grid>


            <Grid item xs={12} sm={8}>
              <Card>
                <CardHeader title={
                <Stack direction="row" sx={{p: 0}} justifyContent="space-between">
                  <Typography variant="h6" >Main Details</Typography>
                    {edits.profile ?
                    <Stack direction="row">
                      <Tooltip title="Save">
                        <IconButton disabled={details.loading} onClick={detailsSave}>
                          <Icon icon="eva:save-outline" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Cancel">
                        <IconButton disabled={details.loading} onClick={()=>setedits({...edits,profile: false})}>
                          <Icon icon="eva:close-outline" />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                    :
                      <IconButton onClick={()=>setedits({...edits,profile: true})}>
                        <Icon icon="eva:edit-outline" />
                      </IconButton>}
                </Stack>
                } />
                {(edits.profile ?
                <Stack direction="column" sx={{p: 3}}>
                  <Typography variant="subtitle1">Name</Typography>
                  <TextField placeholder="Name" variant="standard" sx={{mt: 1}} value={details.name} onChange={(e)=>setdetails({...details,name: e.target.value})} />
                  <Divider sx={{my: 2}} />
                  <Typography variant="subtitle1">Contact</Typography>
                  <TextField placeholder="Contact" variant="standard" sx={{mt: 1}} value={details.contact} onChange={(e)=>setdetails({...details,contact: e.target.value})} inputProps={{ maxLength: 11 }} />
                </Stack>
                :
                <Stack direction="column" sx={{p: 3}}>
                  <Typography variant="subtitle1">Name</Typography>
                  <Typography >{user.name}</Typography>
                  <Divider sx={{my: 2}} />
                  <Typography variant="subtitle1">Contact</Typography>
                  <Typography >{user.contact ? user.contact : 'Not Added'}</Typography>
                </Stack>
                )}
              </Card>
            </Grid>

            <Grid item xs={12} sm={4} >
                <Card sx={{mt: 1}}>
                  <CardHeader title={
                  <Stack direction="row" sx={{p: 0}} justifyContent="space-between">
                    <Typography variant="h6" >Overview</Typography>
                  </Stack>
                  } />
                  <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2} sx={{p: 2}}>
                    <Stack direction="row">
                    <Box
                      component="img"
                      alt={`Profile ${user.username}`}
                      src={propic.pic}
                      sx={{ width: 48, height: 48, borderRadius: 1.5 }}
                    />
                    <Box sx={{ minWidth: 240,ml: 2 }}>
                        <Typography variant="subtitle1" noWrap>
                          {user.username}
                        </Typography> 
                      <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
                        {user.email}
                      </Typography>
                    </Box>
                    </Stack>
                    <Typography variant="caption" sx={{ pr: 3, flexShrink: 0, color: 'text.secondary' }}>
                      Buyer
                    </Typography>
                  </Stack>
                </Card>
            </Grid>


            <Grid item xs={12} sm={8}>
              <Card>
                <CardHeader title={
                <Stack direction="row" sx={{p: 0}} justifyContent="space-between">
                  <Typography variant="h6" >Addresses</Typography>
                    <div>
                      {newadds < 1 ?
                      <IconButton onClick={newAddress} >
                        <Icon icon="eva:plus-outline" />
                      </IconButton>
                      :
                      <IconButton onClick={cancelAddress} >
                        <Icon icon="eva:close-outline" />
                      </IconButton>}
                    </div>
                </Stack>
                } />
                
                {address.map((add,index)=>(
                  <Stack direction="row" key={index} alignItems="center" justifyContent="space-between" spacing={2} sx={{p: 2}}>
                      <Stack direction="row" alignItems="center" sx={{flexGrow: 1}} >
                      <Avatar sx={{ width: 48, height: 48, borderRadius: 1.5,bgcolor: 'pink' }}><Icon icon="eva:pricetags-outline" /></Avatar>
                      {add.edit ?
                      <Box sx={{ minWidth: 240,ml: 2,flexGrow: 1 }}>
                        <Grid container spacing={2}>
                          <Grid item xs={12} sm={6}>
                            <TextField placeholder="Name/Tag" variant="standard" disabled={add.loading} fullWidth name="name" value={add.name} onChange={(e)=>handleChange(e,index)} />
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <TextField placeholder="Address Street/Locale" variant="standard" disabled={add.loading} fullWidth name="street" value={add.street} onChange={(e)=>handleChange(e,index)} />
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <TextField placeholder="Landmark" variant="standard" disabled={add.loading} name="landmark" fullWidth value={add.landmark} onChange={(e)=>handleChange(e,index)} />
                          </Grid>
                          <Grid item xs={12} sm={6}>
                              <TextField placeholder="City" variant="standard" disabled={add.loading} fullWidth name="city" value={add.city} onChange={(e)=>handleChange(e,index)} />
                          </Grid>
                          <Grid item xs={12} sm={4}>
                              <TextField placeholder="State" variant="standard" disabled={add.loading} fullWidth name="state" value={add.state} onChange={(e)=>handleChange(e,index)} />
                          </Grid>
                          <Grid item xs={12} sm={4}>
                            <TextField placeholder="Country" variant="standard" disabled={add.loading} fullWidth name="country" value={add.country} onChange={(e)=>handleChange(e,index)} />
                          </Grid>
                          <Grid item xs={12} sm={4}>
                            <TextField placeholder="Pin Code" variant="standard" disabled={add.loading} name="pin" fullWidth value={add.pin} onChange={(e)=>handleChange(e,index)} />
                          </Grid>
                        </Grid>
                      </Box>
                      :
                      <Box sx={{ minWidth: 240,ml: 2 }}>
                          <Typography variant="subtitle2" noWrap>
                            {add.name}
                          </Typography> 
                        <Typography variant="body2" sx={{ color: 'text.secondary' }} >
                          {`${add.street} ${add.landmark} ${add.city} ${add.state}`}
                        </Typography>
                        <Typography variant="caption" sx={{ color: 'text.secondary' }} noWrap>
                          {`${add.country} ${add.pin}`}
                        </Typography>
                      </Box>
                      }
                      </Stack>
                      {(add.edit ?
                        <IconButton onClick={()=>saveAdd(index)} disabled={add.loading}>
                          <Icon icon="eva:save-outline" />
                        </IconButton>
                      :
                        <IconButton onClick={()=>editAdd(index)}>
                          <Icon icon="eva:edit-outline" />
                        </IconButton>
                      )}
                    </Stack>
                ))}

              </Card>
            </Grid>

          <Grid item xs={12} md={4} lg={4}>
            
            <Card>
              <CardHeader title="Your Cart" />

              <Scrollbar>
                <Stack spacing={3} sx={{ p: 3, pr: 0 }}>
                  {cart.length < 1 ?
                    <Stack direction="row" alignItems="center" spacing={2}>
                      <Box sx={{ minWidth: 240 }}>
                        <Link to="#" color="inherit" underline="hover" component={RouterLink}>
                          <Typography variant="subtitle2" noWrap>
                            No Products Found
                          </Typography>
                        </Link>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
                          Add Products to your cart to view here
                        </Typography>
                      </Box>
                    </Stack>
                  :
                  cart.map((order) => (
                    <OrderItem key={order.id} news={order.product} />
                  ))
                  }
                </Stack>
              </Scrollbar>

              <Divider />

              <Box sx={{ p: 2, textAlign: 'right' }}>
                <Button
                  to="/checkout"
                  size="small"
                  color="inherit"
                  component={RouterLink}
                  endIcon={<Icon icon="eva:arrow-ios-forward-outline" />}
                >
                  Checkout
                </Button>
              </Box>
            </Card>
          </Grid>


          <Grid item xs={12} md={4} lg={4}>
            
            <Card>
              <CardHeader title="Your Favourites" />

              <Scrollbar>
                <Stack spacing={3} sx={{ p: 3, pr: 0 }}>
                  {favs.length < 1 ?
                    <Stack direction="row" alignItems="center" spacing={2}>
                      <Box sx={{ minWidth: 240 }}>
                        <Link to="#" color="inherit" underline="hover" component={RouterLink}>
                          <Typography variant="subtitle2" noWrap>
                            No Products Found
                          </Typography>
                        </Link>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
                          Add Products to your Favourites to view here
                        </Typography>
                      </Box>
                    </Stack>
                  :
                  favs.map((order) => (
                    <OrderItem key={order.id} news={order} />
                  ))
                  }
                </Stack>
              </Scrollbar>

              {/* <Divider />

              <Box sx={{ p: 2, textAlign: 'right' }}>
                <Button
                  to="/checkout"
                  size="small"
                  color="inherit"
                  component={RouterLink}
                  endIcon={<Icon icon="eva:arrow-ios-forward-outline" />}
                >
                  Checkout
                </Button>
              </Box> */}
            </Card>
          </Grid>


          <Grid item xs={12} sm={4} >
                <Card sx={{mt: 1}}>
                  <CardHeader title={
                  <Stack direction="row" sx={{p: 0}} justifyContent="space-between">
                    <Typography variant="h6" >Password</Typography>
                  </Stack>
                  } />
                  <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2} sx={{p: 2}}>
                    {edits.password ?
                      <Stack direction="row">
                        <Box sx={{ p: 1 }}>
                          <TextField variant="standard" type="password" disabled={password.loading} placeholder="Enter Old Password" fullWidth value={password.old} onChange={(e)=>setpassword({...password, old: e.target.value})} />
                          <TextField variant="standard" type="password" disabled={password.loading} sx={{mt: 2}} placeholder="Enter New Password" fullWidth value={password.new} onChange={(e)=>setpassword({...password, new: e.target.value})} />
                        </Box>
                      </Stack>
                    :
                      <Stack direction="row">
                        <Avatar sx={{ width: 48, height: 48, borderRadius: 1.5,bgcolor: 'lightgreen' }}><Icon icon="eva:lock-outline" /></Avatar>
                        <Box sx={{ minWidth: 240,ml: 2 }}>
                            <Typography variant="subtitle1" noWrap>
                              Your Password is all good
                            </Typography> 
                          <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
                            Last optimised {moment(user2.last_login).fromNow()}
                          </Typography>
                        </Box>
                      </Stack>
                    }
                      {(edits.password ?
                        <Stack direction="row">
                          <Tooltip title="Save">
                            <IconButton disabled={password.loading} onClick={savePassword} >
                              <Icon icon="eva:save-outline" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Cancel">
                            <IconButton disabled={password.loading}  onClick={()=>setedits({...edits,password: false})}>
                              <Icon icon="eva:close-outline" />
                            </IconButton>
                          </Tooltip>
                        </Stack>
                      :
                        <Tooltip title="Change Password">
                          <IconButton onClick={()=>setedits({...edits,password: true})}>
                            <Icon icon="eva:edit-outline" />
                          </IconButton>
                        </Tooltip>
                      )}
                  </Stack>
                </Card>
            </Grid>

          {/* <Grid item xs={12} md={6} lg={4}>
            <AppCurrentVisits />
          </Grid> */}
          
        </Grid>
      </Container>
    </Page>
  );
}
