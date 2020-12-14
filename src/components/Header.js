//Styles
import { fade, makeStyles } from '@material-ui/core/styles';

//Components
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import InputBase from '@material-ui/core/InputBase';
import Divider from '@material-ui/core/Divider';
import {getUser, removeUserSession} from './Queries';

//Icons
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';
import KeyboardArrowLeftIcon from '@material-ui/icons/KeyboardArrowLeft';
import SearchIcon from '@material-ui/icons/Search';
import ViewComfyIcon from '@material-ui/icons/ViewComfy';
import AddIcon from '@material-ui/icons/Add';
import SettingsIcon from '@material-ui/icons/Settings';
import NotificationsIcon from '@material-ui/icons/Notifications';

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },    
    appBar: {
      zIndex: theme.zIndex.drawer + 1,
    },
    logo: {
        marginRight: theme.spacing(3),
        fontWeight: 800,
        '&:hover':{
            cursor: 'pointer',
        },
    },
    span:{
        color: theme.palette.primary,
    },
    search: {
        position: 'relative',
        borderRadius: theme.shape.borderRadius,
        backgroundColor: fade(theme.palette.primary.main, 0.15),
        '&:hover': {
          backgroundColor: fade(theme.palette.primary.main, 0.25),
        },
        marginRight: theme.spacing(3),
        width: '100%',
        [theme.breakpoints.up('lg')]: {
          width: 'auto',
        },
    },
    searchIcon: {
        padding: theme.spacing(0, 2),
        height: '100%',
        position: 'absolute',
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    inputRoot: {
        color: 'inherit',
    },
    inputInput: {
        padding: theme.spacing(1, 1, 1, 0),
        // vertical padding + font size from searchIcon
        paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            width: '12ch',
            '&:focus': {
            width: '20ch',
            },
        },
    },    
}));

const Header = ({handleSidebar, sidebarOpen,props}) => {

    const classes = useStyles();
 // handle click event of logout button
 const handleLogout = () => {   
    removeUserSession(); 
    props.history.push('/login');
  }
 
    return(
        <div className={classes.root}>
            <AppBar position="fixed" color="white" className={classes.appBar}>
                <Toolbar>
                    <Typography variant="h6" className={classes.logo}>
                       <Typography color="primary" variant="inherit" component="span">Oxy</Typography>Cloud    
                    </Typography>
                    Welcome User!<br /><br />
        <input type="button" onClick={handleLogout} value="Logout" />
                    <Divider orientation="vertical" flexItem />
                    <IconButton onClick={handleSidebar}>
                        {sidebarOpen ? <KeyboardArrowLeftIcon /> : <KeyboardArrowRightIcon /> }
                    </IconButton>       
                    <div className={classes.search}>
                        <div className={classes.searchIcon}>
                            <SearchIcon />
                        </div>
                        <InputBase
                            placeholder="Search…"
                            classes={{
                                root: classes.inputRoot,
                                input: classes.inputInput,
                            }}
                            inputProps={{ 'aria-label': 'search' }}
                        />
                    </div>  
                    <IconButton >
                        <ViewComfyIcon />
                    </IconButton>     
                    <IconButton >
                        <AddIcon />
                    </IconButton> 
                    <IconButton >
                        <NotificationsIcon />
                    </IconButton> 
                    <IconButton >
                        <SettingsIcon />
                    </IconButton>            
                </Toolbar>
            </AppBar>    
        </div>
        
    );
}


 
   
export default Header;
