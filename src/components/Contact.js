import * as React from 'react';

//Animation
import ParticlesBg from "particles-bg";

//materialUI
import {Container,makeStyles,withStyles,Fab} from '@material-ui/core';
import PropTypes from 'prop-types';


const useStyles = makeStyles((theme) => ({
    root:{
    flexWrap: 'wrap',
    flexDirection: 'column',
    alignItems: 'center',
    width:'100%',
    paddingTop:'110px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    backgroundColor: theme.palette.background.paper,
    flexWrap: 'wrap',
    maxHeight:'400px',
    height:'400px'
    }
}));

function Contact ()  {
    const classes =  useStyles();
    return(
    <div className={classes.root}>
        <h2>Do you have ANY QUESTIONS?</h2>
        <p>The easiest thing to do is post on
        our <a href="https://sweng.unipv.it">forums</a>.
        </p>
        <ParticlesBg color="#3f51b5" num={10} type="cobweb" bg={true} />
    </div>
    );
}

Contact.propTypes = {
  classes: PropTypes.object.isRequired,
};
export default withStyles(useStyles) (Contact);