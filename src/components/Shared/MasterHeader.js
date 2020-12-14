import * as React from 'react';
import { useHistory} from "react-router-dom";
//Animation
import { motion, AnimatePresence } from "framer-motion"

//materialUI
import {Box,Container,withStyles,Grid,Tabs,Tab,AppBar,Typography} from '@material-ui/core';
import PropTypes from 'prop-types';

//Logo Image
import logo from '../../image/logo2.png';

//Components
import {getDomain} from '../Queries';

const layout = theme => ({
  root: {
    backgroundColor: theme.palette.background.paper,
    flexWrap: 'wrap',    
    '& .MuiAppBar-root':{
      position:'fixed',
      color: theme.palette.background.paper,
      backgroundColor: 'transparent',
      paddingLeft: '150px',
      height:'100px',
      display:'flex',
      float:'right',
    },
    '& span.PrivateTabIndicator-root':{
      backgroundColor: 'blue' 
    },
    '& .MuiAppBar-colorPrimary': {
      display:'flex',
      float:'right',
      color: 'blue',
      backgroundcolor: 'white',
      verticalAlign:'middle',
      },
  },
  colorPrimary: {
    display:'flex',
    float:'right',
    color: 'blue',
    backgroundcolor: 'white',
    verticalAlign:'middle',
    },
    imgStyle: {
      position: 'fixed',
      marginLeft: '0%',
      marginTop:'-10px'
    },
});
const variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
}

function TabPanel(props) {
  const { children, value, index, ...other } = props; 
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`nav-tabpanel-${index}`}
      aria-labelledby={`nav-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `nav-tab-${index}`,
    'aria-controls': `nav-tabpanel-${index}`,
  };
}

function LinkTab(props) {
  return (
    <Tab className="colorPrimary"
      onClick={(event) => {

      }}
      {...props}
    />
  );
}

const StyledTab = withStyles({
  root: {
    display:'flex',
    float:'right',
    color: 'blue',
    backgroundcolor: 'white',
    verticalAlign:'middle',
  }
})(Tabs);


class MasterHeader extends React.Component {
  constructor(props) {
    super(props);
    this.state = { value: '1' }  
  }
 
  handle_change = (value) => {
    let page = '';
    if(value==='2'){
      page='/about';
    }
    else if(value==='3'){
      page='/contact';
    }
    window.location = getDomain() + page;
  };
  
  render() {
    const { classes } = this.props;
    return( 
     
    <div className={classes.root}>
      <Container>
        <Box component="div" display="inline" id="imgLogo" className={classes.imgStyle}>
          <AnimatePresence >
            <motion.img
              variants={variants}
              src={logo} alt="Logo" width="100px" height="100px" 
              animate={{ rotate: 360 }}
              transition={{loop:Infinity, duration: 5}}
            />
          </AnimatePresence>
        </Box>
      </Container>
      <AppBar>
        <Grid container spacing={10} >
            <Grid item xs={12} sm={12} md={12} lg={12}  >
            <div>
                <StyledTab value={this.state.value} onChange={(e, v) => { this.handle_change(v) }} 
                  indicatorColor="primary" variant="fullWidth"  className={classes.colorPrimary}
                    centered>
                    <LinkTab value='1' label="Home" {...a11yProps(1)} ></LinkTab>
                    <LinkTab value='2' label="About" {...a11yProps(2)}></LinkTab>
                    <LinkTab value='3' label="Contact" {...a11yProps(3)}></LinkTab>
                </StyledTab>
            </div>
          </Grid>
        </Grid>
      </AppBar>
    </div>
    );
}
}
MasterHeader.propTypes = {
    classes: PropTypes.object.isRequired,
  };
export default withStyles(layout)(MasterHeader);