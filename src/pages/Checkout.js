// material
import {
  Box,
  Grid,
  Container,
  Typography,
  Stack,
  Avatar,
  Card,
  CardHeader,
  IconButton,
  TextField,
  Link,
  Radio,
  RadioGroup,
  FormControlLabel
} from '@mui/material';
import { useSelector } from 'react-redux';
import { LoadingButton } from '@mui/lab';
// import moment from "moment";
// import { formatDistanceToNow } from 'date-fns';
import PropTypes from 'prop-types';
import { Icon } from '@iconify/react';
import axios from 'axios';
import React from 'react';
import { ThemeContext } from 'src/layouts/dashboard';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import Scrollbar from 'src/components/Scrollbar';
import { MHidden } from 'src/components/@material-extend';
import useRazorpay from "react-razorpay";
import { makePayment } from 'src/payment';

// import noim from 'src/assets/noim.jpg';
// components
import Page from '../components/Page';
// import { AppCurrentVisits } from '../components/_dashboard/app';

// ----------------------------------------------------------------------

OrderItem.propTypes = {
  news: PropTypes.object
  // plus: PropTypes.func,
  // minus: PropTypes.func,
  // loading: PropTypes.bool
};

function OrderItem({
  news
  // plus, minus,loading
}) {
  const { image, title, description, category, id } = news.product;

  return (
    <Stack direction="row" alignItems="center" spacing={2} key={id}>
      <Stack direction="row" alignItems="center" spacing={1} sx={{ flexGrow: 1 }}>
        <Box
          component="img"
          alt={title}
          src={image}
          sx={{ width: 48, height: 48, borderRadius: 1.5 }}
        />
        <Box sx={{ flexGrow: 1 }}>
          <Link
            to={`/product/${id}`}
            state={news.product}
            color="inherit"
            underline="hover"
            component={RouterLink}
          >
            <Typography variant="subtitle2" noWrap>
              {title} X {news.quantity}
            </Typography>
          </Link>
          <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
            {description}
          </Typography>
        </Box>
      </Stack>
      <Box sx={{ p: 1 }}>
        {/* <MHidden width="smUp">
            <ButtonGroup orientation="vertical">
              <Button onClick={()=>plus(id)} disabled={loading}><Icon icon="eva:plus-outline" /></Button>
              <Button onClick={()=>minus(id)} disabled={news.quantity === 1 || loading}><Icon icon="eva:minus-outline" /></Button>
            </ButtonGroup>
          </MHidden>
          <MHidden width="smDown">
            <ButtonGroup>
              <Button onClick={()=>minus(id)} disabled={news.quantity === 1 || loading}><Icon icon="eva:minus-outline" /></Button>
              <Button onClick={()=>plus(id)} disabled={loading}><Icon icon="eva:plus-outline" /></Button>
            </ButtonGroup>
            <br />
          </MHidden> */}
        <MHidden width="smDown">
          <Typography variant="caption" sx={{ pr: 3, flexShrink: 0, color: 'text.secondary' }}>
            {category.category.name} | {category.name}
          </Typography>
        </MHidden>
      </Box>
    </Stack>
  );
}

export default function Checkout() {
  const Razorpay = useRazorpay(
    {
      key_id: 'rzp_test_dCc7zFPTy5AGCv',
        key_secret: 'yW0YMhG0nbcNJ3s4dba47FeQ',
    }
  );
  const cont = React.useContext(ThemeContext);
  const navigate = useNavigate();
  const user = useSelector((state) => state.userInfo);
  const [cart, setcart] = React.useState([]);
  const [address, setaddress] = React.useState([]);
  const [newadds, setnewadds] = React.useState(0);
  const [checkout, setcheckout] = React.useState({
    address: '',
    pay: '',
    loading: false,
    products: []
  });
  console.log(
    cart.map((car) => car.product.cart.map((e) => e.product)),
    'cart Products'
  );
  const fetch = React.useCallback(() => {
    axios
      .get(`${process.env.REACT_APP_DOMAIN}/profiling`, {
        headers: { Authorization: `Token ${user.token}` }
      })
      .then((resp) => {
        console.log(resp.data.cart);
        setcart(resp.data.cart);
        setaddress(resp.data.profile.address);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [user.token]);

  React.useEffect(() => {
    fetch();
  }, [fetch, cont.key]);

  // const dispatch = useDispatch()

  const plus = (id) => {
    axios
      .put(
        `${process.env.REACT_APP_DOMAIN}/cart/${id}/2`,
        {},
        { headers: { Authorization: `Token ${user.token}` } }
      )
      .then(() => {
        // console.log(resp.data)
        cont.refresh();
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const minus = (id) => {
    axios
      .put(
        `${process.env.REACT_APP_DOMAIN}/cart/${id}/0`,
        {},
        { headers: { Authorization: `Token ${user.token}` } }
      )
      .then(() => {
        // console.log(resp.data)
        cont.refresh();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const newAddress = () => {
    setaddress([
      ...address,
      {
        name: '',
        street: '',
        landmark: '',
        city: '',
        state: '',
        country: 'India',
        pin: '',
        edit: true,
        loading: false
      }
    ]);
    setnewadds(newadds + 1);
    // console.log('newaddress')
  };

  const cancelAddress = () => {
    fetch();
    setnewadds(0);
  };

  const handleChange = (e, index) => {
    const items = [...address];
    const item = { ...items[index] };
    item[e.target.name] = e.target.value;
    items[index] = item;
    setaddress(items);
  };

  const saveAdd = (index) => {
    if (
      address[index].name.length < 2 ||
      address[index].street.length < 2 ||
      address[index].city.length < 2
    ) {
      return 0;
    }
    const items = [...address];
    const item = { ...items[index] };
    item.loading = true;
    items[index] = item;
    setaddress(items);
    axios
      .post(`${process.env.REACT_APP_DOMAIN}/addressing`, address[index], {
        headers: { Authorization: `Token ${user.token}` }
      })
      .then(() => {
        // console.log(resp)
        const items = [...address];
        const item = { ...items[index] };
        item.loading = false;
        items[index] = item;
        setaddress(items);
        fetch();
      })
      .catch((err) => {
        console.log(err);
      });
    return false;
  };

  const submit = () => {
    if (checkout.address === '') {
      cont.showSnack('Please select Address', 'error');
      return 0;
    }
    if (checkout.pay === '') {
      cont.showSnack('Please select Payment Type', 'error');
      return 0;
    }
    if(checkout.pay === 'online'){
    let price = 0;
   console.log(checkout.address);

    cart.forEach(element => {
      // console.log(element.f);
      price += element.total;
    });
   console.log(price,"price");

    makePayment(price *100, Razorpay,() =>{
      axios
      .get(`${process.env.REACT_APP_DOMAIN}/checkingout/${checkout.address}/${checkout.pay}`, {
        headers: { Authorization: `Token ${user.token}` }
      })
      .then((resp) => {
        console.log(resp);
        navigate('/orders');
      })
      .catch(() => {
        cont.showSnack('Something went Wrong', 'error');
        setcheckout({ ...checkout, loading: false });
      });
    
    });
    setcheckout({ ...checkout, loading: true, products: cart.map((car) => car.product) });
  
  
 
    } else {
      axios
      .get(`${process.env.REACT_APP_DOMAIN}/checkingout/${checkout.address}/${checkout.pay}`, {
        headers: { Authorization: `Token ${user.token}` }
      })
      .then((resp) => {
        console.log(resp);
        navigate('/orders');
      })
      .catch(() => {
        cont.showSnack('Something went Wrong', 'error');
        setcheckout({ ...checkout, loading: false });
      });
    }
    return 1;
  };

  return (
    <Page title="Checkout | Shymee">
      <Container maxWidth="xxl">
        <Box sx={{ pb: 5, pt: 2 }}>
          <Typography variant="h4">Checkout</Typography>
        </Box>

        <Grid container spacing={4}>
          <Grid item xs={12} sm={4}>
            <Card>
              <CardHeader
                title={
                  <Stack direction="row" sx={{ p: 0 }} justifyContent="space-between">
                    <Typography variant="h6">Addresses</Typography>
                    <div>
                      {newadds < 1 ? (
                        <IconButton onClick={newAddress}>
                          <Icon icon="eva:plus-outline" />
                        </IconButton>
                      ) : (
                        <IconButton onClick={cancelAddress}>
                          <Icon icon="eva:close-outline" />
                        </IconButton>
                      )}
                    </div>
                  </Stack>
                }
              />

              {address.map((add, index) => (
                <RadioGroup key={index} value={checkout.address}>
                  <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                    spacing={2}
                    sx={{ p: 2 }}
                  >
                    <Stack direction="row" alignItems="center" sx={{ flexGrow: 1 }}>
                      <Avatar sx={{ width: 48, height: 48, borderRadius: 1.5, bgcolor: 'pink' }}>
                        <Icon icon="eva:pricetags-outline" />
                      </Avatar>
                      {add.edit ? (
                        <Box sx={{ minWidth: 240, ml: 2, flexGrow: 1 }}>
                          <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                              <TextField
                                placeholder="Name/Tag"
                                variant="standard"
                                disabled={add.loading}
                                fullWidth
                                name="name"
                                value={add.name}
                                onChange={(e) => handleChange(e, index)}
                              />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                              <TextField
                                placeholder="Address Street/Locale"
                                variant="standard"
                                disabled={add.loading}
                                fullWidth
                                name="street"
                                value={add.street}
                                onChange={(e) => handleChange(e, index)}
                              />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                              <TextField
                                placeholder="Landmark"
                                variant="standard"
                                disabled={add.loading}
                                name="landmark"
                                fullWidth
                                value={add.landmark}
                                onChange={(e) => handleChange(e, index)}
                              />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                              <TextField
                                placeholder="City"
                                variant="standard"
                                disabled={add.loading}
                                fullWidth
                                name="city"
                                value={add.city}
                                onChange={(e) => handleChange(e, index)}
                              />
                            </Grid>
                            <Grid item xs={12} sm={4}>
                              <TextField
                                placeholder="State"
                                variant="standard"
                                disabled={add.loading}
                                fullWidth
                                name="state"
                                value={add.state}
                                onChange={(e) => handleChange(e, index)}
                              />
                            </Grid>
                            <Grid item xs={12} sm={4}>
                              <TextField
                                placeholder="Country"
                                variant="standard"
                                disabled={add.loading}
                                fullWidth
                                name="country"
                                value={add.country}
                                onChange={(e) => handleChange(e, index)}
                              />
                            </Grid>
                            <Grid item xs={12} sm={4}>
                              <TextField
                                placeholder="Pin Code"
                                variant="standard"
                                disabled={add.loading}
                                name="pin"
                                fullWidth
                                value={add.pin}
                                onChange={(e) => handleChange(e, index)}
                              />
                            </Grid>
                          </Grid>
                        </Box>
                      ) : (
                        <Box sx={{ minWidth: 240, ml: 2 }}>
                          <Typography variant="subtitle2" noWrap>
                            {add.name}
                          </Typography>
                          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                            {`${add.street} ${add.landmark} ${add.city} ${add.state}`}
                          </Typography>
                          <Typography variant="caption" sx={{ color: 'text.secondary' }} noWrap>
                            {`${add.country} ${add.pin}`}
                          </Typography>
                        </Box>
                      )}
                    </Stack>
                    {add.edit ? (
                      <IconButton onClick={() => saveAdd(index)} disabled={add.loading}>
                        <Icon icon="eva:save-outline" />
                      </IconButton>
                    ) : (
                 
                      <FormControlLabel
                        control={<Radio />}
                        label=""
                        value={add.id.toString()}
                        onChange={(e) => setcheckout({ ...checkout, address: e.target.value })}
                      />
                    )}
                  </Stack>
                </RadioGroup>
              ))}
            </Card>
          </Grid>

          <Grid item xs={12} md={4} lg={4}>
            <Card>
              <CardHeader title="Products in the Cart" />

              <Scrollbar>
                <Stack spacing={3} sx={{ p: 3, pr: 0 }}>
                  {cart.length < 1 ? (
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
                  ) : (
                    cart.map((order) => (
                      <OrderItem
                        key={order.id}
                        news={order}
                        loading={false}
                        plus={plus}
                        minus={minus}
                      />
                    ))
                  )}
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

          <Grid item xs={12} md={4} lg={4}>
            <Card>
              <CardHeader title="Payment Type" />

              <Scrollbar>
                <Stack spacing={3} sx={{ p: 3, pr: 0 }}>
                  <RadioGroup value={checkout.pay}>
                    <Stack direction="row" alignItems="center" spacing={2} sx={{ p: 1 }}>
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="subtitle2" noWrap>
                          Online
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
                          Pay the best way possible today
                        </Typography>
                      </Box>
                      <FormControlLabel
                        value="online"
                        control={<Radio />}
                        label=""
                        onChange={(e) => setcheckout({ ...checkout, pay: e.target.value })}
                      />
                    </Stack>
                    <Stack direction="row" alignItems="center" spacing={2} sx={{ p: 1 }}>
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="subtitle2" noWrap>
                          Cash on Delivery
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
                          Or pay the traditional old way
                        </Typography>
                      </Box>
                      <FormControlLabel
                        value="cod"
                        control={<Radio />}
                        label=""
                        onChange={(e) => setcheckout({ ...checkout, pay: e.target.value })}
                      />
                    </Stack>
                  </RadioGroup>
                </Stack>
              </Scrollbar>
            </Card>
          </Grid>

          <Grid item xs={12}>
            <Stack direction="row" justifyContent="center">
              {/* <Button size="large" variant="contained" disabled={checkout.loading} onClick={submit}>
                Let's Go
              </Button> */}

              <LoadingButton
                size="large"
                onClick={submit}
                variant="contained"
                loading={checkout.loading}
                disabled={checkout.loading}
             
            >
                Let's Go
              </LoadingButton>
            </Stack>
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
}
