import React from 'react';
import { IconButton, Tooltip } from '@mui/material';
import { Icon } from '@iconify/react';
import { useSelector } from 'react-redux';
import PropTypes from "prop-types";
import axios from 'axios';
import { ThemeContext } from 'src/layouts/dashboard';


Fav.propTypes = {
    favs: PropTypes.array,
    id: PropTypes.string,
  };


function Fav({favs, id}) {
    const user = useSelector(state=>state.userInfo);
    const cont = React.useContext(ThemeContext);
    const change = () => {
        axios.get(`${process.env.REACT_APP_DOMAIN}/product/f=${id}`,{headers: {'Authorization': `Token ${user.token}`}})
        .then(()=>{
            // console.log(resp.data)
            cont.refresh()
        })
        .catch((err)=>{
            console.log(err)
        })
    }
    return (
        <Tooltip placement="top" title={favs.map(a => a.id).includes(user.id) ? "Added to Favourites" : "Add to Favourites"}>
          <IconButton
            variant="filled"
            color='info'
            onClick={change}
            sx={{
              zIndex: 9,
              top: 8,
              left: 8,
              position: 'absolute',
              textTransform: 'uppercase'
            }}
          >
            <Icon icon={favs.map(a => a.id).includes(user.id) ? "eva:heart-fill" : "eva:heart-outline"} />
          </IconButton>
          </Tooltip>
    );
}

export default Fav;