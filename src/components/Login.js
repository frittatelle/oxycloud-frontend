import React, { useState }  from 'react';

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
import {setUserSession,removeUserSession} from './Queries';

const useStyles = makeStyles((theme) => ({
  root: {
    flexWrap: 'wrap',
    top:'110px',
    position:'fixed',
    flexDirection: 'column',
    alignItems: 'center',
    width:'100%',
    justifyContent: 'center',
    minHeight: '110vh',
    maxHeight:'400px',
    height:'400px',
    '& .MuiInputBase-root': {
      margin: theme.spacing(1,0,1,0),
      width: '25ch'
    },
    '& .MuiButtonGroup-root': {
      margin: theme.spacing(3,0,3,0),
    },
    '& .MuiBox-root': {
      backgroundColor: 'white',
      verticalAlign :'middle',
      border: 'solid cornflowerblue',
      borderRadius :'10px',
      padding:theme.spacing(3,3,1,3),
      boxShadow: '5px 5px lightgrey'
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
      width:'100%',
      display: 'grid',
      },
      input:{
        justifyContent: 'center',
        display:'grid',
        margin :'auto',
        }
}));

function showMessage(title,text,type){
  return swal.fire({
    title: title,
    text: text,
    type: "error",
    confirmButtonColor: "#283593"
  });
}

function Login (props)  {
    const classes = useStyles();
    const [values, setValues] = useState({
      username: '',
      password: '',
      showPassword: false,
    });
    const [loading, setLoading] = useState(false);
    const username = useFormInput('');
    const password = useFormInput('');
    const [error,setError] = useState(null);
    

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
        if ((username.value)==='' &&(password.value)===''){
          showMessage("Information",'Please fill your username and password.', "error")
        }
        else if (error.response!=null) setError(error.response.data.message);
        else {
            removeUserSession();
            showMessage("Information",'Something went wrong. Please try again later.', "error")
            }
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
  const [value, setValue] = useState(initialValue);
 
  const handleChange = e => {
    setValue(e.target.value);
  }
  return {
    value,
    onChange: handleChange
  }
}
export default Login;
