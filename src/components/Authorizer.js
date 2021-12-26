import React from 'react';

import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import CircularProgress from '@material-ui/core/CircularProgress'
import { makeStyles } from '@material-ui/core/styles';

import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import Button from '@material-ui/core/Button';
import Alert from '@material-ui/lab/Alert';
import { useForm } from "react-hook-form";

import {OxySession} from "../utils/api";

const useStyles = makeStyles((theme) => ({
  card: {
    maxWidth: 345,
    paddingLeft: theme.spacing(3),
    paddingRight: theme.spacing(3),
    paddingTop: theme.spacing(2),
  },
  logo: {
    fontWeight: 800,
    '&:hover': {
      cursor: 'pointer',
    },
    marginBot: theme.spacing(4),
  }
}));

const EMAIL_REGEX = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const Authorizer = (props)=> {
    const [error, setError] = React.useState(null);
    const [success, setSuccess] = React.useState(null);
    const [content, setContent] = React.useState(
        OxySession.isReady? "SIGNIN" : "LOADING"
    );
    const [isAuthorized, setIsAuthorized] = React.useState(OxySession.isAuthorized);
    const { register, handleSubmit, formState: { errors } } = useForm();
    const classes = useStyles();
    
    const resetMessages = ()=>{
        setError(null); setSuccess(null);
    };

    const handleSignout = () => {
        resetMessages();
        OxySession.signOut().then(()=>{
            setSuccess("Signed out correctly");
            setIsAuthorized(false);
            setContent("SIGNIN");
        }).catch(console.error);
    }
    const handleSignin = ({email,password}) => {
        setContent("LOADING")
        resetMessages();
        OxySession.signIn({email, password})
            .then(()=>setIsAuthorized(true))
            .catch((err)=>{
                setError(err);
                setContent("SIGNIN");
            });
    }
    const handleSignup = (params) => {
        setContent("LOADING")
        resetMessages();
        OxySession.signUp(params)
            .then((res)=>{
                setSuccess("All fine. Now sign-in please");
                setContent("SIGNIN");
            })
            .catch((err)=>{
                setError(err);
                setContent("SIGNUP");
            });    
    }
    React.useEffect(()=>{
        window.setInterval(()=>{
            if (OxySession.isAuthorized !== isAuthorized)
                setIsAuthorized(OxySession.isAuthorized)
            if (!OxySession.isReady && !(content === "LOADING"))
                setContent("LOADING")
        },
        250)
    },[]);

    if(isAuthorized)
        return (<div>
            {
                React.Children.map(props.children, 
                    c=>React.cloneElement(c,{doSignOut: handleSignout})
                )
            }</div>)
    return (
            <Grid
              container
              spacing={0}
              direction="column"
              alignItems="center"
              justify="center"
              style={{ minHeight: '90vh' }}>

              <Card className={classes.card} align="center">
                <CardContent>
                  <Typography align='center' variant="h3" className={classes.logo}>
                    <Typography color="primary" variant="inherit" component="span">Oxy</Typography>Cloud
                  </Typography>
                 {error !== null && 
                    <Alert severity="error">{error}</Alert>
                 }
                 {success !== null && 
                    <Alert severity="success">{success}</Alert>
                 }

                 {content==="LOADING" &&
                    <CircularProgress align='center' />}
                 {content==="SIGNIN" &&
                    <form onSubmit={handleSubmit(handleSignin)} align='left'>
                      <InputLabel htmlFor="email">Email address</InputLabel>
                      <Input id="email" type="email" 
                        error={errors.email && true} 
                        {...register("email",{required:true, pattern: EMAIL_REGEX})}/>
                      <InputLabel htmlFor="password">Password</InputLabel>
                      <Input id="password" type="password" 
                        error={errors.password && true} 
                        {...register("password",{required:true, min:8})}/>
                      <Input type="submit"/>
                    </form>
                 }
                 {content==="SIGNUP" &&
                     <form onSubmit={handleSubmit(handleSignup)} align='left'>
                     <InputLabel htmlFor="plan">Plan</InputLabel>
                     <Select id="plan" name="plan" label="Plan"
                         error={errors.plan} 
                         {...register("plan",{required:true})}>
                          <MenuItem value="50">50 GB</MenuItem>
                          <MenuItem value="100">100 GB</MenuItem>
                          <MenuItem value="500">500 GB</MenuItem>
                      </Select>
                      <InputLabel htmlFor="name">Your name</InputLabel>
                      <Input id="plan" name="plan" type="hidden" >50</Input>
                      <Input id="name" type="text" 
                        error={errors.name} 
                        {...register("name",{required:true})}/>
                      <InputLabel htmlFor="email">Email address</InputLabel>
                      <Input id="email" type="email" 
                        error={errors.email} 
                        {...register("email",{required:true, pattern: EMAIL_REGEX})}/>
                      <InputLabel htmlFor="password">Password</InputLabel>
                      <Input id="password" type="password" 
                        error={errors.password} 
                        {...register("password",{required:true, min:8})}/>
                      <Input type="submit"/>
                    </form>
                 }
                </CardContent>
                <CardActions>
                 {content!=="LOADING" &&
                     <>
                     <Button size="small" 
                        disabled={content==="SIGNIN"} 
                        onClick={()=>setContent("SIGNIN")}>Sign In</Button>
                     <Button size="small" 
                        disabled={content==="SIGNUP"} 
                        onClick={()=>setContent("SIGNUP")}>Sign Up</Button>
                     </>
                 }
                </CardActions>
              </Card>
            </Grid>
          );    
}

export default Authorizer;
