import * as React from 'react';
import {useQuery,useMutation,queryCache} from 'react-query';

import FacebookIcon from '@material-ui/icons/Facebook';
import TwitterIcon from '@material-ui/icons/Twitter';
import IconButton from '@material-ui/core/IconButton';
import AccountCircle from '@material-ui/icons/AccountCircle';

import {  Box,InputLabel,Input,Container,ButtonGroup ,Button,InputAdornment } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

//visibility of password 
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';

//alert
import swal from 'sweetalert2';

//api
import axios from 'axios';
import {setUserSession} from './Queries';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    '& .MuiInputBase-root': {
      margin: theme.spacing(1,0,1,0),
      width: '25ch'
    },
    '& .MuiButtonGroup-root': {
      margin: theme.spacing(3,0,3,0),
    },
    '& .MuiBox-root': {
      backgroundColor: 'white',
      margin: theme.spacing(2,4,2,4),
      verticalAlign :'middle',
      border: 'solid cornflowerblue',
      borderRadius :'5px',
      padding:theme.spacing(3,3,1,3),
    },
    '& .MuiInputLabel-formControl':{
      top: '10px',
      left: '30px',
      position: 'relative'
      },
      '& .MuiContainer-root':{
        width :'max-content',
      }
  },
    form: {
        justifyContent: 'center',
        display:'grid',
        width:'100%'
      },
      input:{
        justifyContent: 'center',
        display:'grid',
        margin :'auto',
        padding: theme.spacing(1,0,1,0),
        }
}));

function Login (props)  {
    const classes = useStyles();
    const [values, setValues] = React.useState({
      username: '',
      password: '',
      showPassword: false,
    });
  
  const username = useFormInput('');
  const password = useFormInput('');
  const [error, setError] = React.useState(null);
  const [loading, setLoading] = React.useState(false);

    const handleSubmit = () => {
      console.log(username.value);
      console.log( password.value);
      setError(null);
      setLoading(true);
      axios.post('http://localhost:3001/users/signin', { username: username.value, password: password.value }).then(response => {
        setLoading(false);
        setUserSession(response.data.token, response.data.user);
        props.history.push('/FileExplorer');
      }).catch(error => {
        setLoading(false);
        if (error.response!=null) setError(error.response.data.message);
        else swal.fire({
               title: "Login Error",
               text: 'Something went wrong. Please try again later.',
               type: "error",
               confirmButtonColor: "#283593"
             });
      });
    }
   
    const handleClickShowPassword = () => {
      setValues({ ...values, showPassword: !values.showPassword });
    };
  
    const handleMouseDownPassword = (event) => {
      event.preventDefault();
    };
   
    return(
    <div className={classes.root}>
    <Container>
      <Box >
      <form className={classes.form} id='LoginForm'>
       <div className={classes.input}>
       <InputLabel htmlFor="username">Username</InputLabel>
        <Input
          id="username"
          {...username}
          startAdornment={
            <InputAdornment position="start">
              <AccountCircle />
            </InputAdornment>
          }
        />
        </div>
        <div className={classes.input}>
        <InputLabel htmlFor="password">Password</InputLabel>
        <Input
            id="password"
            type={values.showPassword ? 'text' : 'password'}
            {...password}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                >
                  {values.showPassword ? <Visibility /> : <VisibilityOff />}
                </IconButton>
              </InputAdornment>
            }
          />
      </div>

<div className={classes.input}>
<ButtonGroup
        orientation="vertical"
        color="primary"
        aria-label=""
        variant="contained"
      >
        <Button>Forgot Password</Button>
        <Button onClick={handleSubmit} disabled={loading}  value={loading ? 'Loading...' : 'Login'}>Login</Button>
      </ButtonGroup>
      </div>
      </form>
      <div className={classes.input}>
      <InputLabel>or sign up using</InputLabel>
      <IconButton  id="sFacebook" onClick={handleClickShowPassword}>  
                        <FacebookIcon />
                    </IconButton>     
                    <IconButton id="sTwitter" onClick={handleClickShowPassword}>
                        <TwitterIcon />
                    </IconButton> 
                    </div>
        </Box>
        </Container>
        </div>
    );
}
const useFormInput = initialValue => {
  const [value, setValue] = React.useState(initialValue);
 
  const handleChange = e => {
    setValue(e.target.value);
  }
  return {
    value,
    onChange: handleChange
  }
}
export default Login;
