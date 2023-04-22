// import * as Yup from 'yup';
import { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
// import { useFormik, Form, FormikProvider } from 'formik';
import { Icon } from '@iconify/react';
import eyeFill from '@iconify/icons-eva/eye-fill';
import eyeOffFill from '@iconify/icons-eva/eye-off-fill';
import axios from 'axios';
// import { useSnackbar } from 'notistack';
// material
import {
  Link,
  Stack,
  // Checkbox,
  TextField,
  IconButton,
  InputAdornment,
  Typography
  // FormControlLabel
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
// import { set } from 'date-fns';
import { useDispatch } from 'react-redux';

// ----------------------------------------------------------------------

export default function LoginForm() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [form, setform] = useState({ username: '', password: '' });
  const [login, setlogin] = useState({
    loading: false,
    uError: false,
    pError: false,
    uMessage: '',
    pMessage: '',
    show: false,
    mError: false,
    mMessage: ''
  });
  // const [showPassword, setShowPassword] = useState(false);
  // const { enqueueSnackbar } = useSnackbar()
  // console.log(form)
  // console.log(login)
  // console.log(location)
  const handleSubmit = () => {
    // console.log(form.password.length < 1)
    setlogin({
      ...login,
      loading: !(form.username.length < 1 || form.password.length < 1),
      uError: form.username.length < 1,
      uMessage: form.username.length < 1 ? 'Username is necessary' : '',
      pError: form.password.length < 1,
      pMessage: form.password.length < 1 ? 'Password is necessary' : ''
    });
    if (form.username.length < 1 || form.password.length < 1) {
      return 0;
    }
    // console.log('requesting/...')
    axios
      .post(`${process.env.REACT_APP_DOMAIN}/login`, form)
      .then((resp) => {
        console.log(resp.data);
        if (resp.data.error) {
          console.log('error', resp.data.message);
          setlogin({ ...login, loading: false, mError: true, mMessage: resp.data.message });
        } else {
          // console.log("no error",resp.data.details)
          setlogin({ ...login, loading: false });
          dispatch({ type: 'LOGIN', payload: resp.data.details });
          navigate(-1);
        }
      })
      .catch((err) => {
        console.log(err);
        setlogin({ ...login, loading: false, mError: true, mMessage: 'Something went wrong' });
      });
    return false;
  };

  return (
    <>
      <Stack spacing={3}>
        {login.mError && <Typography color="error.main">{login.mMessage}</Typography>}
        <TextField
          fullWidth
          autoComplete="username"
          type="email"
          label="Email address"
          value={form.username}
          onChange={(e) => setform({ ...form, username: e.target.value })}
          error={login.uError}
          helperText={login.uMessage}
        />

        <TextField
          fullWidth
          autoComplete="current-password"
          type={login.show ? 'text' : 'password'}
          label="Password"
          value={form.password}
          onKeyDown={(e) => {
            if (e.keyCode === 13 && !login.loading) {
              handleSubmit();
            }
          }}
          onChange={(e) => setform({ ...form, password: e.target.value })}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setlogin({ ...login, show: !login.show })} edge="end">
                  <Icon icon={login.show ? eyeFill : eyeOffFill} />
                </IconButton>
              </InputAdornment>
            )
          }}
          error={login.pError}
          helperText={login.pMessage}
        />
      </Stack>

      <Stack direction="row" alignItems="center" justifyContent="flex-end" sx={{ my: 2 }}>
        {/* <FormControlLabel
            control={<Checkbox {...getFieldProps('remember')} checked={values.remember} />}
            label="Remember me"
          /> */}

        <Link component={RouterLink} variant="subtitle2" to="#">
          Forgot password?
        </Link>
      </Stack>

      <LoadingButton
        fullWidth
        size="large"
        onClick={handleSubmit}
        variant="contained"
        loading={login.loading}
        disabled={login.loading}
      >
        Login
      </LoadingButton>
    </>
  );
}
