import * as React from 'react';

//Animation
import ParticlesBg from "particles-bg";

//materialUI
import {Container,makeStyles,withStyles,Fab} from '@material-ui/core';
import PropTypes from 'prop-types';

//Icon
import PlayCircleFilledWhiteTwoToneIcon from '@material-ui/icons/PlayCircleFilledWhiteTwoTone';

//Components
import {getDomain} from './Queries';

const useStyles = makeStyles((theme) => ({
  root: {
    maxHeight:'500px',
    height:'500px',
    backgroundColor: theme.palette.background.paper,
    flexWrap: 'wrap',
    '& .MuiInputBase-root': {
      width: '25ch',
    },
    '& .MuiAppBar-colorPrimary':{
      positon:'relative',
      zIndex:'-1',
      color: theme.palette.background.paper,
      backgroundColor: 'white',
      paddingLeft: '150px',
      height:'100px'
    },
    '& span.PrivateTabIndicator-root':{
      backgroundColor: 'blue' 
    },
    '& .fill':{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      textAlign: 'center',
      minHeight: '110vh'
    }
  },  
    colorPrimary: {
      color: theme.palette.background.paper,
      backgroundColor: 'transparent'
    },
    '& span .PrivateTabIndicator':{
       backgroundColor:'blue'
    },
    loginIcon: {
      marginRight: theme.spacing(1),
    },
    border:{
      marginLeft:'auto',
      marginRight:'auto',
      backgroundImage: 'linear-gradient(to right,darkslateblue,lightsteelblue)',
      color:'white'
    }
}));

function HomeScreen ()  {
    const classes = useStyles();
    const gotoLogin = () => {
      window.location=getDomain()+"/login";
    };
 
    return(
    <div className={classes.root}>
      <Container>
        <div className="fill">
                <Fab variant="extended" className={classes.border} onClick={() => gotoLogin()}>
                  <PlayCircleFilledWhiteTwoToneIcon className={classes.loginIcon} />
                  Login
                </Fab>
                <ParticlesBg color="#3f51b5" num={10} type="cobweb" bg={true} />
        </div>
      </Container>
    </div>
    );
}
HomeScreen.propTypes = {
  classes: PropTypes.object.isRequired,
};
export default withStyles(useStyles) (HomeScreen);
