import * as React from 'react';

//materialUI
import {makeStyles,withStyles} from '@material-ui/core';
import PropTypes from 'prop-types';

const useStyles = makeStyles((theme) => ({
  root: {
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
    height:'400px',
    marginLeft:'auto',
    marginRight:'auto'
  }
}));



function About ()  {
    const classes = useStyles();
    return(
    <div className={classes.root}>
     <p>We are a technology company that provides reliable and continuous security for your cloud environment. 
                Our teams consists of 4 persons : Luca Ferrari, Gianluca Carlonte, Giuseppe Nuccio Crea, Vina Panduwinata</p>
    </div>
    );
}
About.propTypes = {
  classes: PropTypes.object.isRequired,
};
export default withStyles(useStyles) (About);