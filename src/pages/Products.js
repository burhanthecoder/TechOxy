import React, { useState } from 'react';
import { useLocation } from 'react-router';
import axios from 'axios';
import { useSelector } from 'react-redux';
import Products from 'src/comps/Products';
import { Icon } from '@iconify/react';

import {
  Container,
  Stack,
  Typography,
  Box,
  FormGroup,
  FormControlLabel,
  Select,
  Radio,
  RadioGroup,
  Slider,
  Button,
  MenuItem,
  Divider,
  IconButton,
  Drawer,
  TextField,
  Grid,
  Menu,
  CircularProgress
} from '@mui/material';
// components
import { ThemeContext } from 'src/layouts/dashboard';
import Page from '../components/Page';
import Scrollbar from '../components/Scrollbar';
// import {
//   ProductSort,
//   ProductList,
//   ProductCartWidget,
//   // ProductFilterSidebar
// } from '../components/_dashboard/products';
// //
// import PRODUCTS from '../_mocks_/products';

// ----------------------------------------------------------------------
const filterexclusives = ['All', 'Yes', 'No'];

const sorts = [
  { value: '?', label: 'None' },
  { value: '-exclusive', label: 'Exclusive First' },
  { value: '-added', label: 'Newest First' },
  { value: '-finalprice', label: 'Price: High to Low' },
  { value: 'finalprice', label: 'Price: Low to High' }
];

export default function EcommerceShop() {
  const location = new URLSearchParams(useLocation().search);
  // const navigate = useNavigate()
  // console.log(location.get("category"))

  const [filter, setfilter] = useState({
    open: false,
    price: [0, 10000],
    rating: [2, 5],
    category: location.get('category') || 'All',
    exclusive: 'All',
    sortopen: null,
    sort: '?',
    sortlabel: 'None',
    loading: false
  });
  // const params = useParams();
  const user = useSelector((state) => state.userInfo);
  const [products, setproducts] = useState([]);
  const [categories, setcategories] = useState([]);

  const cont = React.useContext(ThemeContext);
  React.useEffect(() => {
    axios
      .get(
        `${process.env.REACT_APP_DOMAIN}/getproducts?category=${filter.category}&exclusive=${filter.exclusive}&price=${filter.price[0]},${filter.price[1]}&rating=${filter.rating[0]},${filter.rating[1]}&sortby=${filter.sort}`,
        { headers: { Authorization: `Token ${user.token}` } }
      )
      .then((resp) => {
        // console.log(resp.data)
        setproducts(resp.data.products);
        setcategories(resp.data.categories);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [user.token, cont.key, filter]);

  return (
    <Page title="Dashboard: Products | Shymee">
      <Container maxWidth="xxl">
        <Typography variant="h4" sx={{ mb: 5 }}>
          Products
        </Typography>

        <Stack
          direction="row"
          flexWrap="wrap-reverse"
          alignItems="center"
          justifyContent="flex-end"
          sx={{ mb: 5 }}
        >
          {/* <TextField placeholder="Search Products" /> */}
          <Stack direction="row" spacing={1} flexShrink={0} sx={{ my: 1 }}>
            <Button
              disableRipple
              color="inherit"
              endIcon={<Icon icon="bi:filter" />}
              onClick={() => setfilter({ ...filter, open: true })}
            >
              Filters&nbsp;
            </Button>

            <Button
              color="inherit"
              disableRipple
              onClick={(e) => setfilter({ ...filter, sortopen: e.currentTarget })}
              endIcon={
                <Icon icon={filter.sortopen ? 'eva:chevron-up-fill' : 'eva:chevron-down-fill'} />
              }
            >
              Sort By:&nbsp;
              <Typography component="span" variant="subtitle2" sx={{ color: 'text.secondary' }}>
                {filter.sortlabel}
              </Typography>
            </Button>
            <Menu
              keepMounted
              anchorEl={filter.sortopen}
              open={Boolean(filter.sortopen)}
              onClose={() => setfilter({ ...filter, sortopen: null })}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
              {sorts.map((option) => (
                <MenuItem
                  key={option.value}
                  selected={option.value === filter.sort}
                  onClick={() =>
                    setfilter({
                      ...filter,
                      sortopen: null,
                      sort: option.value,
                      sortlabel: option.label
                    })
                  }
                  sx={{ typography: 'body2' }}
                >
                  {option.label}
                </MenuItem>
              ))}
            </Menu>
          </Stack>
        </Stack>
        {filter.loading ? (
          <Stack
            direction="row"
            sx={{ width: '100%', py: 5 }}
            alignItems="center"
            justifyContent="center"
          >
            <CircularProgress />
          </Stack>
        ) : (
          <Products products={products} sx={{ mb: 3 }} />
        )}

        <Drawer
          anchor="right"
          open={filter.open}
          onClose={() => setfilter({ ...filter, open: false })}
          PaperProps={{
            sx: { width: 280, border: 'none', overflow: 'hidden' }
          }}
        >
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            sx={{ px: 1, py: 2 }}
          >
            <Typography variant="subtitle1" sx={{ ml: 1 }}>
              Filters
            </Typography>
            <IconButton onClick={() => setfilter({ ...filter, open: false })}>
              <Icon icon="eva:close-fill" width={20} height={20} />
            </IconButton>
          </Stack>

          <Divider />

          <Scrollbar>
            <Stack spacing={3} sx={{ p: 3 }}>
              <div>
                <Typography variant="subtitle1" gutterBottom>
                  Exclusive
                </Typography>
                <FormGroup>
                  <RadioGroup
                    value={filter.exclusive}
                    onChange={(e) => setfilter({ ...filter, exclusive: e.target.value })}
                  >
                    {filterexclusives.map((item) => (
                      <FormControlLabel key={item} value={item} control={<Radio />} label={item} />
                    ))}
                  </RadioGroup>
                </FormGroup>
              </div>

              <div>
                <Typography variant="subtitle1" gutterBottom>
                  Category
                </Typography>
                <Select
                  labelId="demo-simple-select-standard-label"
                  id="demo-simple-select-standard"
                  value={filter.category}
                  onChange={(e) => setfilter({ ...filter, category: e.target.value })}
                >
                  <MenuItem value="All">
                    <em>All</em>
                  </MenuItem>
                  {categories.map((item) => (
                    <MenuItem key={item.name} value={item.name}>
                      {item.name}
                    </MenuItem>
                  ))}
                </Select>
              </div>

              <div>
                <Typography variant="subtitle1" gutterBottom>
                  Price
                </Typography>
                <Grid container spacing={1} sx={{ my: 1 }}>
                  <Grid item xs={6}>
                    <TextField
                      value={filter.price[0]}
                      variant="standard"
                      fullWidth
                      onChange={(e) =>
                        setfilter({ ...filter, price: [e.target.value, filter.price[1]] })
                      }
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      value={filter.price[1]}
                      variant="standard"
                      fullWidth
                      onChange={(e) =>
                        setfilter({ ...filter, price: [filter.price[0], e.target.value] })
                      }
                    />
                  </Grid>
                </Grid>
                <Slider
                  min={0}
                  max={10000}
                  getAriaLabel={() => 'Price range'}
                  value={filter.price}
                  onChange={(e, val) => setfilter({ ...filter, price: val })}
                  valueLabelDisplay="auto"
                  getAriaValueText={(val) => `₹ ${val}`}
                />
              </div>

              <div>
                <Typography variant="subtitle1" gutterBottom>
                  Rating
                </Typography>
                <Slider
                  getAriaLabel={() => 'Filter range'}
                  min={0}
                  max={5}
                  value={filter.rating}
                  onChange={(e, val) => setfilter({ ...filter, rating: val })}
                  valueLabelDisplay="auto"
                  getAriaValueText={(val) => `${val} stars`}
                />
              </div>
            </Stack>
          </Scrollbar>

          <Box sx={{ p: 3 }}>
            <Button
              fullWidth
              size="large"
              type="submit"
              color="inherit"
              variant="outlined"
              onClick={() =>
                setfilter({
                  open: false,
                  price: [0, 10000],
                  rating: [2, 5],
                  category: 'All',
                  exclusive: 'All'
                })
              }
              startIcon={<Icon icon="cil:clear-all" />}
            >
              Clear All
            </Button>
          </Box>
        </Drawer>
      </Container>
    </Page>
  );
}
