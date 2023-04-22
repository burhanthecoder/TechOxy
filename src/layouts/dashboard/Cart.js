import { Icon } from '@iconify/react';
import { useRef, useState, useEffect, useContext } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import axios from 'axios';
// material
import { alpha, styled } from '@mui/material/styles';
import {
  Button,
  Box,
  Divider,
  Drawer,
  Typography,
  Stack,
  IconButton,
  Tooltip,
  Badge,
  Grid,
  Card,
  CircularProgress,
  ButtonGroup
} from '@mui/material';
// components
// import MenuPopover from '../../components/MenuPopover';
// import Fav from "../../comps/Fav";
import Label from '../../components/Label';
import noim from '../../assets/noim.jpg';
import Scrollbar from '../../components/Scrollbar';
import { ThemeContext } from '.';
//
// import account from '../../_mocks_/account';

// ----------------------------------------------------------------------

// ----------------------------------------------------------------------

const ProductImgStyle = styled('img')({
  top: 0,
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  position: 'absolute'
  // borderTopLeftRadius: '16px',
  // borderTopRightRadius: '16px',
});

ProductItem.propTypes = {
  product: PropTypes.object,
  quantity: PropTypes.number,
  plus: PropTypes.func,
  minus: PropTypes.func,
  remove: PropTypes.func
};

function ProductItem({ product, quantity, plus, minus, remove }) {
  return (
    <Grid key={product.id} item xs={12} sm={12} md={12}>
      <Box sx={{ position: 'relative' }}>
        {/* <Fav favs={product.favourites} id={product.id.toString()} /> */}
        <Tooltip title="Remove from Cart">
          <IconButton
            onClick={() => remove(product.id)}
            color="error"
            sx={{
              zIndex: 9,
              top: 8,
              left: 8,
              position: 'absolute',
              textTransform: 'uppercase'
            }}
          >
            <Icon icon="eva:trash-2-outline" />
          </IconButton>
        </Tooltip>
      </Box>
      <Card>
        <Box sx={{ pt: '100%', position: 'relative' }}>
          {product.exclusive && (
            <Label
              variant="filled"
              color="info"
              sx={{
                zIndex: 9,
                top: 8,
                right: 8,
                position: 'absolute',
                textTransform: 'uppercase'
                // borderTopLeft
              }}
            >
              Exclusive
            </Label>
          )}
          <ProductImgStyle alt={product.title} src={product.image ? product.image : noim} />
        </Box>
        <Stack spacing={2} sx={{ p: 1.5 }}>
          <RouterLink
            to={`/product/${product.id}`}
            state={product}
            style={{ textDecoration: 'none' }}
          >
            <Typography variant="subtitle2" style={{ textTransform: 'capitalize' }} noWrap>
              {product.title} X {quantity}
            </Typography>
          </RouterLink>
          <ButtonGroup>
            <Button onClick={() => minus(product.id)} disabled={quantity === 1}>
              <Icon icon="eva:minus-outline" />
            </Button>
            <Button onClick={() => plus(product.id)}>
              <Icon icon="eva:plus-outline" />
            </Button>
          </ButtonGroup>
          <Stack direction="row" alignItems="center" justifyContent="flex-end">
            <Typography variant="subtitle2">
              {/* {product.price > product.finalprice && 
                <Typography component="span" variant="body2" sx={{ color: 'text.disabled', textDecoration: 'line-through'}}>
                ₹{product.price}
                </Typography>} */}
              &nbsp; ₹{product.finalprice}*{quantity}
            </Typography>
          </Stack>
        </Stack>
      </Card>
    </Grid>
  );
}

export default function Cart() {
  // const dispatch = useDispatch()
  const anchorRef = useRef(null);
  const [open, setOpen] = useState(false);
  const user = useSelector((state) => state.userInfo);
  const [cart, setcart] = useState([]);
  const [loading, setloading] = useState(true);
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const cont = useContext(ThemeContext);
  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_DOMAIN}/cart`, {
        headers: { Authorization: `Token ${user.token}` }
      })
      .then((resp) => {
        console.log(resp.data, 'lol');
        setloading(false);
        setcart(resp.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [user.token, cont.key]);

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
  const remove = (id) => {
    axios
      .put(
        `${process.env.REACT_APP_DOMAIN}/cart/${id}/3`,
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

  return (
    <>
      <Tooltip title="Your Cart">
        <IconButton
          ref={anchorRef}
          size="large"
          onClick={handleOpen}
          sx={{
            ...(open && {
              bgcolor: (theme) =>
                alpha(theme.palette.primary.main, theme.palette.action.focusOpacity)
            }),
            color: '#fff',
            ml: 0
          }}
          style={{ marginLeft: '0px !important' }}
        >
          <Badge badgeContent={cart.length} color="error">
            <Icon icon="eva:shopping-cart-fill" width={20} height={20} />
          </Badge>
        </IconButton>
      </Tooltip>
      <Drawer
        anchor="right"
        open={open}
        onClose={handleClose}
        PaperProps={{
          sx: { width: 280, border: 'none', overflow: 'hidden' }
        }}
      >
        <Stack direction="row" alignItems="center" justifyContent="left" sx={{ p: 2 }}>
          {/* <IconButton onClick={handleClose}>
                  <Icon icon="eva:arrow-ios-back-outline" />
                  </IconButton> */}
          <Typography variant="subtitle1" gutterBottom sx={{ margin: 0, ml: 0 }}>
            Your Cart
          </Typography>
        </Stack>
        <Divider />

        {loading ? (
          <Box sx={{ p: 2 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Scrollbar>
            <Stack spacing={3} sx={{ p: 2 }}>
              <div>
                <Grid container spacing={3}>
                  {cart.length > 0 ? (
                    cart.map((cart) => (
                      <ProductItem
                        key={cart.product.id}
                        product={cart.product}
                        quantity={cart.quantity}
                        plus={plus}
                        minus={minus}
                        remove={remove}
                      />
                    ))
                  ) : (
                    <Grid item xs={12} sm={12} md={12}>
                      <Box sx={{ py: 2 }}>
                        <Typography variant="h3">Whoops!</Typography>
                        <Typography>You have no products in cart</Typography>
                      </Box>
                    </Grid>
                  )}
                </Grid>
              </div>
            </Stack>
          </Scrollbar>
        )}
        {cart.length > 0 && (
          <Box sx={{ p: 2 }}>
            <RouterLink to="/checkout">
              <Button
                fullWidth
                size="large"
                type="submit"
                color="secondary"
                variant="outlined"
                disabled={loading}
                onClick={handleClose}
                endIcon={<Icon icon="eva:arrow-forward-fill" />}
              >
                Checkout
              </Button>
            </RouterLink>
          </Box>
        )}
      </Drawer>
    </>
  );
}
