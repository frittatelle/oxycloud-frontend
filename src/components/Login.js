import * as React from 'react';
import clsx from 'clsx';
import FacebookIcon from '@material-ui/icons/Facebook';
import TwitterIcon from '@material-ui/icons/Twitter';
import IconButton from '@material-ui/core/IconButton';
import AccountCircle from '@material-ui/icons/AccountCircle';
// import Image from './Background.PNG';
import {  Box,FormControl,InputLabel,Input,Grid,TextField, Container,ButtonGroup ,Button,InputAdornment } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';


const logoSpace = 65;
const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    '& .MuiInputBase-root': {
      margin: theme.spacing(1,0,1,0),
      width: '25ch',
    },
    '& .MuiButtonGroup-root': {
      margin: theme.spacing(3,0,3,0),
    },
    '& .MuiBox-root': {
      backgroundColor: 'white',
      margin: theme.spacing(2,2,2,2)
    },
  },
    margin: {
        margin: theme.spacing(2,2,2,2),
        alignItems: 'center', 
        justifyContent: 'center',
        padding:theme.spacing(0,0,0,0),
        width:'100%',
        maxWidth:'1200'
      },
      input:{
        marginLeft:'20',
        '& .MuiInputBase-input':{
        alignItems:'center',
        justifyContent: 'center'}
        },
}));

function HomeScreen ()  {
    const classes = useStyles();

    const [values, setValues] = React.useState({
      amount: '',
      password: '',
      weight: '',
      weightRange: '',
      showPassword: false,
    });
  
    const handleChange = (prop) => (event) => {
      setValues({ ...values, [prop]: event.target.value });
    };
  
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
      
      <FormControl className={classes.margin}>
      <div className={classes.input}>
        <Grid container spacing={1} alignItems="flex-end">
          <Grid item>
            <AccountCircle />
          </Grid>
          <Grid item>
            <TextField id="input-with-icon-grid" label="Username" />
          </Grid>
        </Grid>
        </div>
        <div className={classes.input}>
        <Input
            id="standard-adornment-password"
            type={values.showPassword ? 'text' : 'password'}
            value={values.password}
            onChange={handleChange('password')} 
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
      <ButtonGroup
        orientation="vertical"
        color="primary"
        aria-label="vertical contained primary button group"
        variant="contained"
      >
        <Button>Forgot Password</Button>
        <Button>Login</Button>
      </ButtonGroup>
     <IconButton >
                        <FacebookIcon />
                    </IconButton>     
                    <IconButton >
                        <TwitterIcon />
                    </IconButton> 
         
</FormControl>

        </Box>
        </Container>
       
        </div>
    
    );
}

  export default HomeScreen;