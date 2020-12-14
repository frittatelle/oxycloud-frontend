import {React,useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import {Paper,Grid} from '@material-ui/core';
import Typography from '@material-ui/core/Typography';


const width =  window.innerWidth;

const styles = theme => ({
  root: {
  
    '& .MasterFooter-root':{
      padding: theme.spacing(0,0,0,0),
      backgroundColor: '#3f51b5',
      width: '100%',
      color: 'white',
    }
  },
  footer: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'fixed',
    marginLeft: 'calc(100%/2 - 120px)',
    bottom: 0,  
    display: 'flex',
    '& p':{
        color: '#3f51b5',
    }
  }
});

function MasterFooter(props) {
  const { classes } = props;

  return (
    <footer className={classes.footer}>
      <Grid container spacing={10} >
            <Grid item xs={12} sm={12} md={12} lg={12}  >
      <Paper className={classes.root} elevation={1}>   
        <Typography component="p">
          Sweng@2020 All right reserved
        </Typography>
      </Paper>
      </Grid>
      </Grid>
    </footer>
  );
}

MasterFooter.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(MasterFooter);