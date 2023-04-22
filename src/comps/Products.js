import PropTypes from 'prop-types';
// import { Icon } from '@iconify/react';
import React from "react";
// material
import { Grid, Stack, Box, Card, Typography,Button, Menu, MenuItem } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Link as RouterLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
// import ShopProductCard from './ProductCard';
import Label from '../components/Label';
import noim from "../assets/noim.jpg"
import Fav from './Fav';
// ----------------------------------------------------------------------

const ProductImgStyle = styled('img')({
  top: 0,
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  position: 'absolute',
  // borderTopLeftRadius: '16px',
  // borderTopRightRadius: '16px',
});


Products.propTypes = {
  products: PropTypes.array.isRequired
};

export default function Products({ products, ...other }) {
  const [menu, setmenu] = React.useState(null)

  const user = useSelector(state => state.userInfo)

  const sendfb =(name)=> {
        setmenu(null)
        // var shareLink = 'Hello "'+user.refcode+'" is my Referral Code for Cyber3ra, Let\'s Bounty Hunt Together %0D%0A '+window.location.host+'/auth/signup?'+user.refcode
        const url = `https://www.facebook.com/sharer.php?quote=Check out this awesome product from Shymee, ${name}`;
        window.open(url);
    }

    const sendmsg =(name)=> {
        setmenu(null)
        const url = `whatsapp://send?text=Check out this awesome product from Shymee, ${name}`;
        window.open(url);
    }

    const sendmail = (name) => {
      setmenu(null)
      const url = `https://mail.google.com/mail/?view=cm&fs=1&tf=1&to=&su=Shymee Product&body=Check out this awesome product from Shymee, ${name}&ui=2&tf=1&pli=1`;
      window.open(url);
    }


  return (
    <Grid container spacing={3} {...other}>
      {products.map((product) => (
        <Grid key={product.id} item xs={6} sm={6} md={2}>
        <Box sx={{  position: 'relative' }}>
          {user.token &&
          <Fav favs={product.favourites} id={product.id.toString()} />
            }
          {/* <Button size="small"
            sx={{
              zIndex: 9,
              bottom: 16,
              right: 16,
              position: 'absolute',
            }}>Share</Button> */}
        </Box>
          <Card>

      <Box sx={{ pt: '100%', position: 'relative' }}>
        {product.exclusive && (
          <Label
            variant="filled"
            color='info'
            sx={{
              zIndex: 9,
              top: 16,
              right: 16,
              position: 'absolute',
              textTransform: 'uppercase',
              // borderTopLeft
            }}
          >
            Exclusive
          </Label>
        )}
        {/* <Fav favs={product.favourites} id={product.id.toString()} /> */}
          <RouterLink to={`/product/${product.id}`} state={product} style={{textDecoration: 'none'}}>
        <ProductImgStyle alt={product.title} src={product.image ? product.image : noim} />
              </RouterLink>
      </Box>
      <Stack spacing={2} sx={{ p: {xs: 1.5,md: 3} }}>

        {/* <Link to={`/product/${product.id}`} color="inherit" underline="hover" component={RouterLink}> */}
          <RouterLink to={`/product/${product.id}`} state={product} style={{textDecoration: 'none'}}>
          <Typography variant="subtitle2" style={{textTransform: 'capitalize'}} noWrap>
            {product.title}
          </Typography>
              </RouterLink>
          <Typography variant="caption" sx={{ mt: 0,flexShrink: 0, color: 'text.secondary' }}>
          {product.category.category.name} | {product.category.name}
       </Typography>
        {/* </Link> */}
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          {/* <ColorPreview colors={colors} /> */}
          {/* <Typography variant="subtitle2">
            Add to Cart
          </Typography> */}
          <Typography variant="subtitle2">
            {product.price > product.finalprice && 
            <Typography
              component="span"
              variant="body2"
              sx={{
                color: 'text.disabled',
                textDecoration: 'line-through'
              }}
            >
            ₹{product.price}
            </Typography>}
            &nbsp;
            ₹{product.finalprice}
          </Typography>
          <Button size="small" onClick={(e)=>setmenu(e.currentTarget)}>Share</Button>
          
          <Menu
              keepMounted
              anchorEl={menu}
              open={Boolean(menu)}
              onClose={()=>setmenu(null)}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <MenuItem
                  key="whatsapp"
                  selected={false}
                  onClick={()=>sendmsg(product.title)}
                  sx={{ typography: 'body2' }}
                >
                  Whatsapp
                </MenuItem>
                <MenuItem
                  key="facebook"
                  selected={false}
                  onClick={()=>sendfb(product.title)}
                  sx={{ typography: 'body2' }}
                >
                  Facebook
                </MenuItem>
                <MenuItem
                  key="gmail"
                  selected={false}
                  onClick={()=>sendmail(product.title)}
                  sx={{ typography: 'body2' }}
                >
                  Gmail
                </MenuItem>
            </Menu>

        </Stack>
      </Stack>
    </Card>
        </Grid>
      ))}
    </Grid>
  );
}
