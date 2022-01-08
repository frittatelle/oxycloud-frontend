//Styles
import { makeStyles } from '@material-ui/core/styles';

//React
import clsx from 'clsx';

//Components
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import Toolbar from '@material-ui/core/Toolbar';

//Icons
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import ShareIcon from '@material-ui/icons/Share';
import StorageIcon from '@material-ui/icons/Storage';


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
		width: 72,
	},
}));

const SideBar = ({ sidebarOpen, rootFolder, setRootFolder }) => {

	//Styles
	const classes = useStyles();
	//useQuery (get data)
	return (
		<>
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
					<Toolbar />
					<List>
                        <ListItem button 
                                selected={rootFolder==="FOLDER"}
                                onClick={()=>setRootFolder("FOLDER")}
                                >
							<ListItemAvatar>
								<Avatar>
									<StorageIcon />
								</Avatar>
							</ListItemAvatar>
							<ListItemText primary="My folder" />
						</ListItem>
						<ListItem button 
                                selected={rootFolder==="SHARED"}
                                onClick={()=>setRootFolder("SHARED")}
                                >
							<ListItemAvatar>
								<Avatar>
									<ShareIcon />
								</Avatar>
							</ListItemAvatar>
							<ListItemText primary="Shared with me" />
						</ListItem>
						<ListItem button 
                            selected={rootFolder==="TRASH"}
                            onClick={()=>setRootFolder("TRASH")}
                            >
							<ListItemAvatar>
								<Avatar>
									<DeleteOutlineIcon />
								</Avatar>
							</ListItemAvatar>
							<ListItemText primary="Trash" />
						</ListItem>
					</List>
				</Drawer>
			)}
		</>
	);
}

export default SideBar;
