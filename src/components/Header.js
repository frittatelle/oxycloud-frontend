//Styles
import { fade, makeStyles } from '@material-ui/core/styles';

//Components
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import InputBase from '@material-ui/core/InputBase';
import Divider from '@material-ui/core/Divider';

import Modal from "@material-ui/core/Modal";
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

//Icons
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';
import KeyboardArrowLeftIcon from '@material-ui/icons/KeyboardArrowLeft';
import SearchIcon from '@material-ui/icons/Search';
import CreateNewFolderIcon from '@material-ui/icons/CreateNewFolder';
import AddIcon from '@material-ui/icons/Add';
import SettingsIcon from '@material-ui/icons/Settings';
import NotificationsIcon from '@material-ui/icons/Notifications';
import IconButton from '@material-ui/core/IconButton'
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import { OxySession } from '../utils/api';
import { useState } from 'react'


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
        '&:hover': {
            cursor: 'pointer',
        },
    },
    span: {
        color: theme.palette.primary,
    },
    avatar: {
        marginLeft: theme.spacing(3),
        marginRight: theme.spacing(3),
    },
    search: {
        position: 'relative',
        borderRadius: theme.shape.borderRadius,
        backgroundColor: fade(theme.palette.primary.main, 0.15),
        '&:hover': {
            backgroundColor: fade(theme.palette.primary.main, 0.25),
        },
        marginRight: theme.spacing(3),
        marginLeft: 0,
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
    hide: {
        display: 'none'
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
const MkDirModal = ({open, handleClose, currentFolder}) => {
    const [dirName, setDirName] = useState("");
    const mkdir = ()=>{
        OxySession.storage.mkdir(currentFolder.id, dirName);
        handleClose();
        setDirName("");
    }
    return (
        <Modal
            style={{display:'flex',alignItems:'center',justifyContent:'center'}}
            open={open}
            onClose={handleClose}>
              <Card align="left" style={{minWidth: 275}}>
                  <CardContent>
                    <Typography color="textSecondary" gutterBottom>
                      New folder..
                    </Typography>
                    <form noValidate autoComplete="off">
                      <TextField value={dirName} label="name" variant="outlined" 
                        onChange={(e)=>{setDirName(e.target.value)}}/>
                    </form>
                    <CardActions>
                        <Button 
                            disabled={dirName===""} 
                            size="small" 
                            onClick={mkdir}>
                            Confirm
                        </Button>
                    </CardActions>
              </CardContent>
              </Card>
        </Modal>
   )
}
const Header = ({ handleSidebar, sidebarOpen, folder, rootFolder }) => {

    const [, selectFile] = useState("");
    const [mkdirModalOpen, setMkdirModalOpen] = useState(false);

    const handleMkdirModalOpen = () => {
        setMkdirModalOpen(true);
    };

    const handleMkdirModalClose = () => {
        setMkdirModalOpen(false);
    };


    function onFileChange(e) {

        const file = e.target.files[0];
        selectFile(file);

        OxySession.storage.put(file, folder.id)
    }


    const classes = useStyles();
    return (
        <div className={classes.root}>
            <AppBar position="fixed" color="inherit" className={classes.appBar}>
                <Toolbar>
                    <Typography variant="h6" className={classes.logo}>
                        <Typography 
                            color="primary" 
                            variant="inherit" component="span">Oxy</Typography>Cloud
                    </Typography>
                    <Divider orientation="vertical" flexItem />
                    <Avatar className={classes.avatar}>
                        <IconButton color="inherit" onClick={handleSidebar} >
                            {sidebarOpen ? 
                                  <KeyboardArrowLeftIcon /> 
                                : <KeyboardArrowRightIcon />}
                        </IconButton>
                    </Avatar>
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
                   { (rootFolder==="FOLDER") &&
                    <Avatar className={classes.avatar}>
                        <IconButton color="inherit" onClick={handleMkdirModalOpen}>
                            <CreateNewFolderIcon />
                            <MkDirModal 
                                currentFolder={folder} 
                                open={mkdirModalOpen} 
                                handleClose={handleMkdirModalClose}/> 
                        </IconButton>
                    </Avatar>
                   }
                   { (rootFolder==="FOLDER") &&
                    <Avatar className={classes.avatar}>
                        <IconButton color="inherit" >
                            <input id="imagefile" 
                                type="file" 
                                hidden 
                                onChange={(e) => onFileChange(e, folder)} />
                            <label htmlFor="imagefile">
                                <AddIcon />
                            </label>
                        </IconButton>
                    </Avatar>
                    }
                    <Avatar className={classes.avatar}>
                        <IconButton color="inherit" >
                            <NotificationsIcon />
                        </IconButton>
                    </Avatar>


                    <Avatar className={classes.avatar}>
                        <IconButton color="inherit" >
                            <SettingsIcon />
                        </IconButton>
                    </Avatar>

                    <Avatar className={classes.avatar}>
                        <IconButton color="inherit" onClick={() => OxySession.signOut()}>
                            <ExitToAppIcon  />
                        </IconButton>
                    </Avatar>

                </Toolbar>
            </AppBar>
        </div>

    );
}

export default Header;
