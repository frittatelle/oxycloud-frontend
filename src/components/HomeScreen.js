import * as React from 'react';

// import Image from './Background.PNG';
import {  Box,FormControl,InputLabel,Input,Grid,TextField, Container,ButtonGroup ,Button,InputAdornment } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';



const logoSpace = 65;
const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    '& .MuiInputBase-root': {
      margin: theme.spacing(1,0,1,0),
      width: '25ch',
    },
    '& .MuiBox-root': {
      backgroundColor: 'blue',
      height: '500px'
    },
    '& .MuiContainer-root': {
      backgroundColor: 'blue',
      margin: theme.spacing(2,2,2,2),
      
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

    return(
    <div className={classes.root}>
    <Container>
      <Box> 
      </Box>
    </Container>
    </div>
    
    );
}

  export default HomeScreen;