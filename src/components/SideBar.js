//Styles
import { makeStyles } from '@material-ui/core/styles';

//React
import clsx from 'clsx';

//Components
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Divider from '@material-ui/core/Divider';
import Toolbar from '@material-ui/core/Toolbar';

//Icons
import FolderIcon from '@material-ui/icons/Folder';

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
        whiteSpace: 'nowrap',
    },
    drawerOpen: {
      width: drawerWidth,
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.easeInOut,
        duration: theme.transitions.duration.standard,
      }),
    },
    drawerClose: {
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.easeInOut,
        duration: theme.transitions.duration.standard,
      }),
      overflowX: 'hidden',
      width: 64,
    },
}));


const SideBar = ({sidebarOpen}) => {
    const classes = useStyles();

    return(
        <Drawer
        variant="permanent"
        className={clsx(classes.drawer, {
          [classes.drawerOpen]: sidebarOpen,
          [classes.drawerClose]: !sidebarOpen,
        })}
        classes={{
          paper: clsx({
            [classes.drawerOpen]: sidebarOpen,
            [classes.drawerClose]: !sidebarOpen,
          }),
        }}
      >
        {/* Inserting the empty Toolbar for Header space*/}
        <Toolbar />
        <List>
            {/*TODO: map through S3 folders*/}
          {['Inbox', 'Starred', 'Send email', 'Drafts'].map((text) => (
            <ListItem button key={text}>
              <ListItemIcon><FolderIcon /></ListItemIcon>
              <ListItemText primary={text} />
            </ListItem>
          ))}
        </List>
        <Divider />
        <List>
            {/*TODO: map through S3 folders*/}
          {['All mail', 'Trash', 'Spam'].map((text) => (
            <ListItem button key={text}>
              <ListItemIcon><FolderIcon /></ListItemIcon>
              <ListItemText primary={text} />
            </ListItem>
          ))}
        </List>
      </Drawer>
    );
}

export default SideBar;