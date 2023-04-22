// material
import { Box, Grid, Container, Typography, Stack, Card, Link } from '@mui/material';
import { useSelector } from 'react-redux';
// import { LoadingButton } from '@mui/lab';
import moment from 'moment';
// import moment from "moment";
// import { formatDistanceToNow } from 'date-fns';
import PropTypes from 'prop-types';
// import { Icon } from '@iconify/react';
import axios from 'axios';
import React from 'react';
import { ThemeContext } from 'src/layouts/dashboard';
import { Link as RouterLink } from 'react-router-dom';
// import Scrollbar from 'src/components/Scrollbar';
import { MHidden } from 'src/components/@material-extend';
// import noim from 'src/assets/noim.jpg';
// components
import Button from '@mui/material/Button';
import Page from '../components/Page';
// import { AppCurrentVisits } from '../components/_dashboard/app';

// ----------------------------------------------------------------------

Pro.propTypes = {
  news: PropTypes.object
  // plus: PropTypes.func,
  // minus: PropTypes.func,
  // loading: PropTypes.bool
};

function Pro({
  news
  // plus, minus,loading
}) {
  console.log(news, 'pro');
  const { title, image, description, id, finalprice } = news.product;

  return (
    <div
      style={{
        margin: '7px'
      }}
    >
      <Stack direction="row" alignItems="center" spacing={2} key="1">
        <Stack direction="row" alignItems="center" spacing={1} sx={{ flexGrow: 1 }}>
          <div
            style={{
              margin: '5px'
            }}
          >
            <Box
              component="img"
              alt={title}
              src={image}
              sx={{ width: 100, height: 100, borderRadius: 1.5 }}
            />
          </div>
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
          <MHidden width="smDown">
            <Button variant="outlined">Return</Button>
          </MHidden>
        </Box>
      </Stack>
    </div>
  );
}

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
  const { grandtotal, added, address, products, id } = news;
  // console.log(news)
  return (
    <Card key={id} sx={{ p: 2, mb: 2 }}>
      <Stack direction="row" alignItems="center" spacing={2}>
        <Stack direction="row" alignItems="center" spacing={1} sx={{ flexGrow: 1 }}>
          {/* <Box
            component="img"
            alt={title}
            src={image}
            sx={{ width: 48, height: 48, borderRadius: 1.5 }}
          /> */}
          <Box sx={{ flexGrow: 1 }}>
            {/* <Link to={`/product/${id}`} state={news.product} color="inherit" underline="hover" component={RouterLink}> */}
            <Typography variant="subtitle1" noWrap>
              <Typography variant="subtitle2" sx={{ display: 'inline-block' }}>
                Delivered to{' '}
              </Typography>{' '}
              {address.name}
            </Typography>
            {/* </Link> */}
            <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
              {address.street}
            </Typography>
          </Box>
        </Stack>
        <Box sx={{ p: 1 }}>
          <MHidden width="smDown">
            <Typography variant="caption" sx={{ pr: 3, flexShrink: 0, color: 'text.secondary' }}>
              {moment(added).fromNow()}
            </Typography>
          </MHidden>
        </Box>
      </Stack>
      <Stack direction="row" alignItems="center" spacing={2}>
        <Stack direction="row" alignItems="center" spacing={1} sx={{ flexGrow: 1 }}>
          <Box sx={{ flexGrow: 1, py: 1 }}>
            <Typography variant="subtitle2" sx={{ display: 'inline-block' }}>
              Products{' '}
            </Typography>
          </Box>
        </Stack>
        <Box sx={{ p: 1 }}>
          <MHidden width="smDown">
            <Typography variant="caption" sx={{ pr: 3, flexShrink: 0, color: 'text.secondary' }}>
              {products.length}
            </Typography>
          </MHidden>
        </Box>
      </Stack>
      <Stack direction="row" alignItems="center" spacing={1} sx={{ flexGrow: 1 }}>
        <Box sx={{ flexGrow: 1, py: 1 }}>
          {products.map((pro) => (
            <Pro news={pro} key={pro.id} />
          ))}
        </Box>
      </Stack>

      <Stack direction="row" justifyContent="flex-end" spacing={2}>
        <Typography variant="subtitle2" sx={{ display: 'inline-block' }}>
          Total: ₹ {grandtotal}{' '}
        </Typography>
      </Stack>
    </Card>
  );
}

export default function Orders() {
  const cont = React.useContext(ThemeContext);
  // const navigate = useNavigate()
  const user = useSelector((state) => state.userInfo);
  const [orders, setorders] = React.useState({ pending: [], finished: [] });

  const fetch = React.useCallback(() => {
    axios
      .get(`${process.env.REACT_APP_DOMAIN}/orderings`, {
        headers: { Authorization: `Token ${user.token}` }
      })
      .then((resp) => {
        console.log(resp.data.pending, 'pending');
        setorders(resp.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [user.token]);

  React.useEffect(() => {
    fetch();
  }, [fetch, cont.key]);

  // const dispatch = useDispatch()

  return (
    <Page title="Checkout | Shymee">
      <Container maxWidth="xxl">
        <Box sx={{ pb: 5, pt: 2 }}>
          <Typography variant="h4"> Your Orders</Typography>
        </Box>

        {/* <Grid container spacing={4}> */}
        {/* <Grid item xs={12} md={6} lg={6}> */}
        {/* <Typography variant="h6" sx={{ my: 2 }}>
          Your Orders
        </Typography> */}

        {orders.pending.map((order) => (
          <>
            <OrderItem key={order.id} news={order} loading={false} />
          </>
        ))}
        {/* {orders.pending.length < 1 ? (
          <Card>
            <Stack spacing={3} sx={{ p: 3, pr: 0 }}>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Box sx={{ minWidth: 240 }}>
                  <Link to="#" color="inherit" underline="hover" component={RouterLink}>
                    <Typography variant="subtitle2" noWrap>
                      No Orders Found
                    </Typography>
                  </Link>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
                    You don't have any Pending orders
                  </Typography>
                </Box>
              </Stack>
            </Stack>
          </Card>
        ) : null} */}
        {/* </Grid> */}

        {/* <Grid item xs={12} md={6} lg={6}>
            <Typography variant="h6" sx={{ my: 2 }}>
              Finished Orders
            </Typography>

            {orders.finished.map((order) => (
              <OrderItem key={order.id} news={order} loading={false} />
            ))}
            {orders.finished.length < 1 ? (
              <Card>
                <Stack spacing={3} sx={{ p: 3, pr: 0 }}>
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <Box sx={{ minWidth: 240 }}>
                      <Link to="#" color="inherit" underline="hover" component={RouterLink}>
                        <Typography variant="subtitle2" noWrap>
                          No Orders Found
                        </Typography>
                      </Link>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
                        You don't have any finished orders
                      </Typography>
                    </Box>
                  </Stack>
                </Stack>
              </Card>
            ) : null} */}
        {/* </Grid> */}
        {/* </Grid> */}
      </Container>
    </Page>
  );
}
