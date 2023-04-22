import { useState } from 'react';
import { Icon } from '@iconify/react';
import eyeFill from '@iconify/icons-eva/eye-fill';
import eyeOffFill from '@iconify/icons-eva/eye-off-fill';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
// material
import { Stack, TextField, IconButton, InputAdornment, Typography } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import axios from "axios";
// import PropTypes from 'prop-types';



export default function RegisterForm() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [form,setform] = useState({username: '',password: '',name: '',email: '',seller: false});
  const [signup,setsignup] = useState({loading: false, username: false, password: false,uMessage: '',pMessage: '',  email: false, name: false,eMessage: '',nMessage: '',show: false,mError: false, mMessage: ''})

  
  const handleSubmit = () => {
    // console.log(form.password.length < 1)
    setsignup({...signup,
      loading: !(form.username.length < 1 || form.password.length < 1),
      username: form.username.length < 1, 
      uMessage: form.username.length < 1 ? 'Username is necessary' : '', 
      password: form.password.length < 1, 
      pMessage: form.password.length < 1 ? 'Password is necessary' : '' , 
      email: form.password.length < 1, 
      eMessage: form.password.length < 1 ? 'Email is necessary' : '' 
    })
    if(form.username.length < 1 || form.password.length < 1 || form.email.length < 1){
      return 0;
    }
    // console.log('requesting/...')
    axios.post(`${process.env.REACT_APP_DOMAIN}/signup`,form)
    .then((resp)=>{
      // console.log(resp.data)
      if(resp.data.error){
        console.log("error",resp.data.message)
        setsignup({...signup, loading: false, mError: true, mMessage: resp.data.message})
      }
      else{
        // console.log("no error",resp.data.details)
        setsignup({...signup,loading: false })
        dispatch({type: 'LOGIN',payload: resp.data.details})
        navigate(-1);
      }
    })
    .catch((err)=> {
      console.log(err)
      setsignup({...signup, loading: false, mError: true, mMessage: 'Something went wrong'})
    })
    return false;
  }


  return (<>
        <Stack spacing={3}>
          {signup.mError && <Typography color="error.main">{signup.mMessage}</Typography> }
            <TextField
              fullWidth
              label="Username"
              value={form.username}
              onChange={(e)=>setform({...form, username: e.target.value})}
              error={signup.username}
              helperText={signup.uMessage}
            />

            <TextField
              fullWidth
              label="Full name"
              value={form.name}
              onChange={(e)=>setform({...form, name: e.target.value})}
              error={signup.name}
              helperText={signup.nMessage}
            />

          <TextField
            fullWidth
            autoComplete="username"
            type="email"
            label="Email address"
            value={form.email}
            onChange={(e)=>setform({...form, email: e.target.value})}
            error={signup.email}
            helperText={signup.eMessage}
          />

          <TextField
            fullWidth
            autoComplete="current-password"
            type={signup.show ? 'text' : 'password'}
            label="Password"
            value={form.password}
            onChange={(e)=>setform({...form, password: e.target.value})}
            error={signup.password}
            helperText={signup.pMessage}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton edge="end" onClick={() => setsignup({...signup, show: !signup.show})}>
                    <Icon icon={signup.show ? eyeFill : eyeOffFill} />
                  </IconButton>
                </InputAdornment>
              )
            }}
          />

          <LoadingButton
            fullWidth
            size="large"
            type="submit"
            variant="contained"
            loading={signup.loading}
            disabled={signup.loading}
            onClick={handleSubmit}
          >
            Signup
          </LoadingButton>
        </Stack>
      </>
  );
}
